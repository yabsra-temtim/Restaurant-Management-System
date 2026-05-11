import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { orderService, tableService } from '../services/api';

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
      pending: 'badge-warning',
      preparing: 'badge-warning',
      ready: 'badge-success',
      completed: 'badge-success',
      cancelled: 'badge-danger',
    };
    return colors[status] || 'badge-primary';
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Orders</h1>

        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="card text-center py-8 text-gray-600">
              No orders yet
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="card">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Order #{order.id.slice(0, 8)}</h3>
                    <p className="text-gray-600 text-sm">Created: {new Date(order.created_at).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary-600">${parseFloat(order.total_amount).toFixed(2)}</p>
                    <span className={`badge ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <select
                    value={order.status}
                    onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                    className="input-field w-48"
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
