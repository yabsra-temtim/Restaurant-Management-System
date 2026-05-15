import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { tableService, orderService, menuService, paymentService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { CreditCard, Banknote, Receipt, Plus, Minus, Search, ShoppingCart, User, ArrowLeft, CheckCircle, Clock } from 'lucide-react';

export const POSPage = () => {
  const { restaurantId, tableId } = useParams();
  const { user } = useAuth();
  const [tables, setTables] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [cart, setCart] = useState([]);
  const [tip, setTip] = useState(0);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, [restaurantId]);

  const fetchInitialData = async () => {
    try {
      const [tablesRes, menuRes] = await Promise.all([
        tableService.getByRestaurant(restaurantId),
        menuService.getItems(restaurantId)
      ]);
      setTables(tablesRes.data);
      setMenuItems(menuRes.data);

      if (tableId) {
        const table = tablesRes.data.find(t => t.id === tableId);
        if (table) handleSelectTable(table);
      }
    } catch (err) {
      console.error('Failed to fetch POS data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTable = async (table) => {
    setSelectedTable(table);
    setCart([]);
    setTip(0);
    if (table.status === 'occupied') {
      try {
        // Find active order for this table
        const { data: orders } = await orderService.getActiveByRestaurant(restaurantId);
        const tableOrder = orders.find(o => o.table_id === table.id);
        setCurrentOrder(tableOrder);
      } catch (err) {
        console.error('Failed to fetch table order:', err);
      }
    } else {
      setCurrentOrder(null);
    }
  };

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prev => prev.filter(i => i.id !== itemId));
  };

  const updateQuantity = (itemId, delta) => {
    setCart(prev => prev.map(i => {
      if (i.id === itemId) {
        const newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }));
  };

  const calculateSubtotal = () => {
    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderTotal = currentOrder ? currentOrder.items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0) : 0;
    return cartTotal + orderTotal;
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    setProcessing(true);
    try {
      await orderService.create({
        restaurant_id: restaurantId,
        table_id: selectedTable.id,
        created_by: user.id,
        items: cart.map(i => ({ menu_item_id: i.id, quantity: i.quantity }))
      });
      fetchInitialData();
      handleSelectTable(selectedTable);
    } catch (err) {
      console.error('Failed to place order:', err);
    } finally {
      setProcessing(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    if (!currentOrder) return;
    setProcessing(true);
    try {
      await orderService.updateStatus(currentOrder.id, newStatus);
      if (newStatus === 'billing') {
        setSelectedTable(null);
        setCurrentOrder(null);
      }
      fetchInitialData();
      if (newStatus !== 'billing') handleSelectTable(selectedTable);
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setProcessing(false);
    }
  };

  const handlePrintReceipt = () => {
    const subtotal = calculateSubtotal();
    const tax = subtotal * 0.15;
    const finalTotal = subtotal + tax + parseFloat(tip || 0);
    const receiptContent = `
--- RESTAURANT RECEIPT ---
Table: #${selectedTable.table_number}
Date: ${new Date().toLocaleString()}
-------------------------
${currentOrder ? currentOrder.items.map(i => `${i.quantity}x ${i.menu_item_name} - $${(i.unit_price * i.quantity).toFixed(2)}`).join('\n') : ''}
${cart.map(i => `${i.quantity}x ${i.name} - $${(i.price * i.quantity).toFixed(2)}`).join('\n')}
-------------------------
Subtotal: $${subtotal.toFixed(2)}
Tax (15%): $${tax.toFixed(2)}
Tip: $${parseFloat(tip || 0).toFixed(2)}
Total: $${finalTotal.toFixed(2)}
-------------------------
Thank you for dining with us!
    `;
    const win = window.open('', 'PRINT', 'height=600,width=400');
    win.document.write('<pre style="font-family: monospace; font-size: 14px; padding: 20px;">' + receiptContent + '</pre>');
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 500);
  };

  const handlePayment = async (method) => {
    if (!currentOrder && cart.length === 0) return;
    setProcessing(true);
    try {
      const subtotal = calculateSubtotal();
      const tax = subtotal * 0.15;
      const finalAmount = subtotal + tax + parseFloat(tip || 0);
      
      // If there are cart items, create order first
      let orderId = currentOrder?.id;
      if (cart.length > 0) {
        const { data: newOrder } = await orderService.create({
          restaurant_id: restaurantId,
          table_id: selectedTable.id,
          created_by: user.id,
          items: cart.map(i => ({ menu_item_id: i.id, quantity: i.quantity }))
        });
        orderId = newOrder.id;
      }

      await paymentService.create({
        order_id: orderId,
        amount: finalAmount,
        payment_method: method
      });

      handlePrintReceipt();
      setSelectedTable(null);
      setCurrentOrder(null);
      setCart([]);
      setTip(0);
      fetchInitialData();
    } catch (err) {
      console.error('Payment failed:', err);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-white bg-gray-900 min-h-screen">Loading POS...</div>;

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Tables Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-gray-900 mb-6 text-sm font-medium transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Hub
          </button>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Receipt className="text-primary-600" />
            Tables
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {tables.map(table => (
            <button
              key={table.id}
              onClick={() => handleSelectTable(table)}
              className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                selectedTable?.id === table.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-transparent bg-gray-50 hover:border-gray-200'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">Table #{table.table_number}</span>
                <span className={`text-[10px] uppercase font-black px-2 py-1 rounded-full ${
                  table.status === 'available' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                }`}>
                  {table.status}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{table.capacity} Seats</p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {!selectedTable ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <Receipt size={64} className="mb-4 opacity-20" />
            <p className="text-xl font-medium">Select a table to start ordering</p>
          </div>
        ) : (
          <>
            <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
              <div>
                <h2 className="text-2xl font-black text-gray-900">Table #{selectedTable.table_number}</h2>
                <p className="text-sm text-gray-500">Service for {selectedTable.capacity} guests</p>
              </div>
              <div className="flex gap-2">
                <button className="btn-secondary flex items-center gap-2">
                  <User size={18} />
                  Change Table
                </button>
              </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
              {/* Menu Grid */}
              <div className="flex-1 overflow-y-auto p-6 bg-white">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {menuItems.map(item => (
                    <button
                      key={item.id}
                      onClick={() => addToCart(item)}
                      className="group p-4 bg-white border border-gray-200 rounded-2xl text-left hover:border-primary-500 hover:shadow-md transition-all active:scale-95"
                    >
                      <h3 className="font-bold text-gray-900 group-hover:text-primary-600 truncate">{item.name}</h3>
                      <p className="text-sm text-gray-500 line-clamp-1 mb-3">{item.description || 'No description'}</p>
                      <span className="text-lg font-black text-gray-900">${parseFloat(item.price).toFixed(2)}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cart / Bill Sidebar */}
              <div className="w-96 bg-gray-50 border-l border-gray-200 flex flex-col">
                <div className="p-6 border-b border-gray-200 bg-white">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <ShoppingCart size={20} className="text-primary-600" />
                    Current Bill
                  </h3>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Active Order Items */}
                  {currentOrder && (
                    <div className="space-y-4">
                      <div className={`p-3 rounded-xl mb-2 flex items-center justify-between ${
                        currentOrder.status === 'ready' ? 'bg-emerald-500/10 text-emerald-600' : 
                        currentOrder.status === 'preparing' ? 'bg-amber-500/10 text-amber-600' :
                        currentOrder.status === 'served' ? 'bg-blue-500/10 text-blue-600' :
                        'bg-gray-100 text-gray-500'
                      }`}>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full bg-current ${currentOrder.status !== 'served' ? 'animate-pulse' : ''}`}></div>
                          <span className="text-[10px] font-black uppercase tracking-widest">{currentOrder.status}</span>
                        </div>
                        <span className="text-[10px] font-medium opacity-60">#{currentOrder.id.split('-')[0]}</span>
                      </div>

                      <div className="space-y-3">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Items at Table</p>
                        {currentOrder.items.map(item => (
                          <div key={item.id} className="flex justify-between items-center text-sm">
                            <span className="text-gray-600 font-medium">
                              <span className="font-bold text-gray-900">{item.quantity}x</span> {item.menu_item_name}
                            </span>
                            <span className="font-bold text-gray-900">${(item.unit_price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* New Cart Items */}
                  {cart.length > 0 && (
                    <div className="space-y-4 pt-4 border-t border-gray-200">
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary-500">New Items</p>
                      {cart.map(item => (
                        <div key={item.id} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-gray-900">{item.name}</span>
                            <span className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden">
                              <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-gray-100"><Minus size={14} /></button>
                              <span className="px-3 font-bold text-xs">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-gray-100"><Plus size={14} /></button>
                            </div>
                            <button onClick={() => removeFromCart(item.id)} className="text-[10px] text-red-500 font-bold hover:underline">Remove</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {!currentOrder && cart.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                      <p className="text-sm">Bill is empty</p>
                    </div>
                  )}
                </div>

                <div className="p-6 bg-white border-t border-gray-200 space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-500 text-sm">
                      <span>Subtotal</span>
                      <span>${calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-500 text-sm">
                      <span>Tax (15%)</span>
                      <span>${(calculateSubtotal() * 0.15).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-gray-500 text-sm">Tip</span>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-400 text-xs">$</span>
                        <input 
                          type="number" 
                          value={tip}
                          onChange={(e) => setTip(e.target.value)}
                          className="w-20 px-2 py-1 bg-gray-50 border border-gray-200 rounded text-right font-bold text-sm"
                        />
                      </div>
                    </div>
                    <div className="flex justify-between text-xl font-black text-gray-900 pt-2 border-t border-gray-100">
                      <span>Total</span>
                      <span>${(calculateSubtotal() * 1.15 + parseFloat(tip || 0)).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={handlePlaceOrder}
                      disabled={cart.length === 0 || processing}
                      className="col-span-2 btn-primary py-4 text-lg shadow-xl shadow-primary-500/20 disabled:opacity-50"
                    >
                      {processing ? 'Processing...' : 'Place Order'}
                    </button>

                    {currentOrder && currentOrder.status === 'ready' && (
                      <button 
                        onClick={() => handleUpdateStatus('served')}
                        disabled={processing}
                        className="col-span-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
                      >
                        <CheckCircle size={20} />
                        Mark as Served
                      </button>
                    )}

                    {currentOrder && currentOrder.status === 'served' && (
                      <button 
                        onClick={() => handleUpdateStatus('billing')}
                        disabled={processing}
                        className="col-span-2 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20"
                      >
                        <Receipt size={20} />
                        Send to Cashier
                      </button>
                    )}

                    <div className="col-span-2 grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
                      <button 
                        onClick={() => handlePayment('Cash')}
                        disabled={!currentOrder || processing || user.role === 'server'}
                        className="btn-secondary flex items-center justify-center gap-2 py-3 disabled:opacity-50 text-xs"
                      >
                        <Banknote size={16} />
                        Cash
                      </button>
                      <button 
                        onClick={() => handlePayment('Card')}
                        disabled={!currentOrder || processing || user.role === 'server'}
                        className="btn-secondary flex items-center justify-center gap-2 py-3 disabled:opacity-50 text-xs"
                      >
                        <CreditCard size={16} />
                        Card
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
