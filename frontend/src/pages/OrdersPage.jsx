import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { orderService } from '../services/api';
import { Receipt, Clock, CheckCircle, XCircle, ChefHat, PackageCheck, AlertCircle } from 'lucide-react';

export const OrdersPage = () => {
  const { restaurantId } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, [restaurantId]);

  const fetchOrders = async () => {
    try {
      const { data } = await orderService.getByRestaurant(restaurantId);
      setOrders(data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await orderService.updateStatus(orderId, newStatus);
      fetchOrders();
    } catch (err) {
      console.error('Failed to update order status:', err);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-amber-100 text-amber-800 border-amber-200',
      preparing: 'bg-blue-100 text-blue-800 border-blue-200',
      ready: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      completed: 'bg-gray-100 text-gray-800 border-gray-200',
      cancelled: 'bg-rose-100 text-rose-800 border-rose-200',
    };
    return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return <Clock size={16} className="text-amber-600" />;
      case 'preparing': return <ChefHat size={16} className="text-blue-600" />;
      case 'ready': return <PackageCheck size={16} className="text-emerald-600" />;
      case 'completed': return <CheckCircle size={16} className="text-gray-600" />;
      case 'cancelled': return <XCircle size={16} className="text-rose-600" />;
      default: return <AlertCircle size={16} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="animate-pulse text-primary-500 font-medium text-lg flex items-center gap-3">
          <div className="w-6 h-6 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          Loading live orders...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50/50">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8 font-medium transition-colors"
        >
          <Receipt size={18} />
          Back to Hub
        </button>

        <div className="flex items-center gap-3 mb-10">
          <div className="p-2 bg-primary-100 rounded-xl text-primary-600">
            <Receipt size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900">Live Orders</h1>
            <p className="text-gray-500">Real-time order tracking and management.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.length === 0 ? (
            <div className="col-span-full card text-center py-16 px-4 bg-white/50 border-dashed border-2 border-gray-200">
              <Receipt size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Active Orders</h3>
              <p className="text-gray-500">New orders will appear here automatically.</p>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="card relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                {/* Status colored accent line */}
                <div className={`absolute top-0 left-0 w-full h-1.5 ${getStatusColor(order.status).split(' ')[0]}`}></div>
                
                <div className="flex justify-between items-start mb-6 mt-2">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 font-mono tracking-tight">#{order.id.slice(0, 8).toUpperCase()}</h3>
                    <p className="text-gray-500 text-xs mt-1 flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900 mb-1">${parseFloat(order.total_amount).toFixed(2)}</p>
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border capitalize ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 mb-5 border border-gray-100">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">Table</span>
                    <span className="font-semibold text-gray-900">TBD</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Items</span>
                    <span className="font-semibold text-gray-900">Mixed Items</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Update Status</label>
                  <select
                    value={order.status}
                    onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                    className="input-field w-full text-sm font-medium focus:bg-white bg-gray-50 cursor-pointer"
                  >
                    <option value="pending">Pending</option>
                    <option value="preparing">Preparing</option>
                    <option value="ready">Ready</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
