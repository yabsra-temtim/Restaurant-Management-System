import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { orderService } from '../services/api';
import { Clock, CheckCircle, Flame, ChefHat, Timer } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const KitchenPage = () => {
  const { restaurantId } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveOrders();
    const interval = setInterval(fetchActiveOrders, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, [restaurantId]);

  const fetchActiveOrders = async () => {
    try {
      const { data } = await orderService.getActiveByRestaurant(restaurantId);
      setOrders(data);
    } catch (err) {
      console.error('Failed to fetch kitchen orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateItemStatus = async (orderId, itemId, newStatus) => {
    try {
      await orderService.updateItemStatus(itemId, newStatus);
      fetchActiveOrders();
    } catch (err) {
      console.error('Failed to update item status:', err);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderService.updateStatus(orderId, newStatus);
      fetchActiveOrders();
    } catch (err) {
      console.error('Failed to update order status:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center bg-gray-900">
        <div className="animate-pulse text-amber-500 font-medium text-lg flex items-center gap-3">
          <ChefHat className="animate-bounce" />
          Synchronizing Kitchen...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <button 
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 font-medium transition-colors"
        >
          <ChefHat size={18} />
          Back to Hub
        </button>

        <div className="flex justify-between items-center mb-10 border-b border-gray-800 pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500/20 rounded-2xl text-amber-500">
              <ChefHat size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold">Kitchen Dashboard</h1>
              <p className="text-gray-400">Live order queue and preparation tracking.</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Active Orders</p>
              <p className="text-2xl font-bold text-amber-500">{orders.length}</p>
            </div>
            <div className="h-10 w-px bg-gray-800"></div>
            <div className="flex items-center gap-2 text-sm text-gray-400 bg-gray-800/50 px-4 py-2 rounded-full">
              <Timer size={16} />
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 opacity-30">
            <Flame size={64} className="mb-4" />
            <p className="text-2xl font-medium">All clear! No pending orders.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {orders.map((order) => (
              <div 
                key={order.id} 
                className={`flex flex-col h-full bg-gray-800 rounded-2xl border-l-8 overflow-hidden shadow-xl animate-fade-in ${
                  order.status === 'pending' ? 'border-l-rose-500' : 'border-l-amber-500'
                }`}
              >
                <div className="p-6 bg-gray-800/50 border-b border-gray-700 flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-tighter mb-1 block">Table</span>
                    <h2 className="text-4xl font-black text-white">#{order.table_number}</h2>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1.5 text-gray-400 text-xs font-medium mb-2">
                      <Clock size={14} />
                      {formatDistanceToNow(new Date(order.created_at))} ago
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      order.status === 'pending' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {order.status}
                    </div>
                  </div>
                </div>

                <div className="flex-1 p-6 space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-start gap-4 group">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded-lg font-bold text-white shrink-0">
                            {item.quantity}
                          </span>
                          <p className="font-bold text-lg leading-tight">{item.menu_item_name}</p>
                        </div>
                        {item.special_instructions && (
                          <p className="mt-1.5 ml-11 text-sm text-rose-400 font-medium italic">
                            "{item.special_instructions}"
                          </p>
                        )}
                      </div>
                      <button 
                        onClick={() => handleUpdateItemStatus(order.id, item.id, item.status === 'ready' ? 'preparing' : 'ready')}
                        className={`shrink-0 p-2 rounded-xl transition-all ${
                          item.status === 'ready' 
                            ? 'bg-emerald-500 text-white' 
                            : 'bg-gray-700 text-gray-500 hover:bg-gray-600 hover:text-gray-300'
                        }`}
                      >
                        <CheckCircle size={20} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-gray-900/50 flex gap-2">
                  {order.status === 'pending' && (
                    <button 
                      onClick={() => handleUpdateOrderStatus(order.id, 'preparing')}
                      className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-gray-900 font-black rounded-xl transition-colors text-sm uppercase tracking-widest"
                    >
                      Start Preparing
                    </button>
                  )}
                  {order.status === 'preparing' && (
                    <button 
                      onClick={() => handleUpdateOrderStatus(order.id, 'ready')}
                      className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-black rounded-xl transition-colors text-sm uppercase tracking-widest"
                    >
                      All Items Ready
                    </button>
                  )}
                  {order.status === 'ready' && (
                    <div className="w-full py-3 bg-gray-700 text-gray-400 font-black rounded-xl text-center text-sm uppercase tracking-widest">
                      Waiting for Pickup
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
