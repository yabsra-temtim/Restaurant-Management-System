import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { restaurantService, tableService, orderService } from '../services/api';
import { Plus } from 'lucide-react';

export const DashboardPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const { data } = await restaurantService.getAll();
      setRestaurants(data);
    } catch (err) {
      console.error('Failed to fetch restaurants:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRestaurant = (restaurantId) => {
    navigate(`/restaurant/${restaurantId}`);
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Select a restaurant to manage</p>
        </div>

        <div className="mb-6">
          <button
            onClick={() => navigate('/restaurant/new')}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            Add New Restaurant
          </button>
        </div>

        {restaurants.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-600 mb-4">No restaurants yet. Create one to get started!</p>
            <button
              onClick={() => navigate('/restaurant/new')}
              className="btn-primary"
            >
              Create Restaurant
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                onClick={() => handleSelectRestaurant(restaurant.id)}
                className="card cursor-pointer hover:shadow-lg transition-shadow"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-2">{restaurant.name}</h2>
                <p className="text-gray-600 text-sm mb-4">{restaurant.address}</p>
                <div className="flex justify-between text-sm text-gray-600 mb-4">
                  <span>📞 {restaurant.phone}</span>
                  <span>✉️ {restaurant.email}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectRestaurant(restaurant.id);
                  }}
                  className="btn-primary w-full mt-4"
                >
                  Manage
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
