import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderService, paymentService } from '../services/api';
import { 
  Banknote, 
  CreditCard, 
  Receipt, 
  User, 
  ArrowLeft, 
  Clock, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const CashierPage = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [tip, setTip] = useState(0);

  useEffect(() => {
    fetchBillingOrders();
    const interval = setInterval(fetchBillingOrders, 15000); // Poll every 15s
    return () => clearInterval(interval);
  }, [restaurantId]);

  const fetchBillingOrders = async () => {
    try {
      const { data } = await orderService.getBillingByRestaurant(restaurantId);
      setOrders(data);
    } catch (err) {
      console.error('Failed to fetch billing orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessPayment = async (method) => {
    if (!selectedOrder) return;
    setProcessing(true);
    try {
      const subtotal = parseFloat(selectedOrder.total_amount);
      const tax = subtotal * 0.15;
      const finalAmount = subtotal + tax + parseFloat(tip || 0);

      await paymentService.create({
        order_id: selectedOrder.id,
        amount: finalAmount,
        payment_method: method
      });

      setSelectedOrder(null);
      setTip(0);
      fetchBillingOrders();
    } catch (err) {
      console.error('Payment processing failed:', err);
    } finally {
      setProcessing(false);
    }
  };

  const calculateTotal = (subtotal) => {
    const s = parseFloat(subtotal);
    const tax = s * 0.15;
    return (s + tax + parseFloat(tip || 0)).toFixed(2);
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-emerald-600 font-medium text-lg flex items-center gap-3">
          <Banknote className="animate-bounce" />
          Synchronizing Billing...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <button 
          onClick={() => navigate(`/restaurant/${restaurantId}`)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8 font-medium transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Hub
        </button>

        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-display font-black text-gray-900 mb-2 flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-xl text-emerald-600">
                <Receipt size={28} />
              </div>
              Cashier Dashboard
            </h1>
            <p className="text-gray-500">Processing payments for ready bills.</p>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Orders Awaiting Payment</p>
            <p className="text-2xl font-black text-emerald-600">{orders.length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order List */}
          <div className="lg:col-span-2 space-y-4">
            {orders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm border-dashed">
                <CheckCircle size={48} className="mx-auto text-gray-200 mb-4" />
                <p className="text-xl font-bold text-gray-400">All caught up!</p>
                <p className="text-gray-500">No orders currently awaiting billing.</p>
              </div>
            ) : (
              orders.map((order) => (
                <div 
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className={`bg-white p-6 rounded-3xl border-2 transition-all cursor-pointer hover:shadow-lg ${
                    selectedOrder?.id === order.id 
                      ? 'border-emerald-500 shadow-emerald-500/10' 
                      : 'border-transparent shadow-sm'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-900 font-black text-xl">
                        #{order.table_number}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Order from {order.waiter_name || 'Waiter'}</h3>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {formatDistanceToNow(new Date(order.updated_at))} ago
                          </span>
                          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                          <span className="font-medium">ID: {order.id.split('-')[0]}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Subtotal</p>
                      <p className="text-2xl font-black text-gray-900">${parseFloat(order.total_amount).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Payment Interface */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl sticky top-8">
              {!selectedOrder ? (
                <div className="text-center py-12 text-gray-400">
                  <Banknote size={48} className="mx-auto mb-4 opacity-10" />
                  <p className="font-bold">Select an order to process payment</p>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-6">
                    <h2 className="text-2xl font-black text-gray-900">Settlement</h2>
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-black uppercase">Table #{selectedOrder.table_number}</span>
                  </div>

                  <div className="space-y-4">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-gray-600 font-medium">{item.quantity}x {item.menu_item_name}</span>
                        <span className="text-gray-900 font-bold">${(item.quantity * item.unit_price).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 pt-6 border-t border-gray-100">
                    <div className="flex justify-between text-gray-500 text-sm">
                      <span>Subtotal</span>
                      <span>${parseFloat(selectedOrder.total_amount).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-500 text-sm">
                      <span>Tax (15%)</span>
                      <span>${(parseFloat(selectedOrder.total_amount) * 0.15).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-gray-500 text-sm font-medium">Tip / Gratuity</span>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-400 text-xs">$</span>
                        <input 
                          type="number" 
                          value={tip}
                          onChange={(e) => setTip(e.target.value)}
                          className="w-24 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-right font-black text-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div className="flex justify-between text-3xl font-black text-gray-900 pt-4 border-t-2 border-gray-900">
                      <span>Total</span>
                      <span>${calculateTotal(selectedOrder.total_amount)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <button 
                      onClick={() => handleProcessPayment('Cash')}
                      disabled={processing}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                    >
                      <Banknote size={24} />
                      Complete Cash Payment
                    </button>
                    <button 
                      onClick={() => handleProcessPayment('Card')}
                      disabled={processing}
                      className="w-full bg-gray-900 hover:bg-black text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-gray-900/20 disabled:opacity-50"
                    >
                      <CreditCard size={24} />
                      Process Card Transaction
                    </button>
                  </div>

                  <div className="flex items-center gap-2 p-4 bg-amber-50 rounded-2xl text-amber-700 text-xs font-medium">
                    <AlertCircle size={16} className="shrink-0" />
                    Completing this will mark table #{selectedOrder.table_number} as available.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
