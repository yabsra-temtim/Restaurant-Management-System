import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { restaurantService } from '../services/api';
import { Plus, MapPin, Phone, Mail, ChevronRight, LayoutDashboard } from 'lucide-react';

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
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="animate-pulse text-primary-500 font-medium text-lg flex items-center gap-3">
          <div className="w-6 h-6 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          Loading your restaurants...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50/50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-display font-bold text-gray-900 mb-2 flex items-center gap-3">
              <div className="p-2 bg-primary-100 rounded-xl text-primary-600">
                <LayoutDashboard size={28} />
              </div>
              Dashboard
            </h1>
            <p className="text-gray-500 text-lg">Select a restaurant to manage its operations.</p>
          </div>
          <button
            onClick={() => navigate('/restaurant/new')}
            className="btn-primary flex items-center gap-2 shadow-primary-500/30"
          >
            <Plus size={20} />
            Add Restaurant
          </button>
        </div>

        {restaurants.length === 0 ? (
          <div className="card text-center py-16 px-4 bg-white/50 border-dashed border-2 border-gray-200 shadow-sm">
            <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6 text-primary-500">
              <Plus size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No restaurants yet</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">Get started by creating your first restaurant profile to manage tables, menus, and orders.</p>
            <button
              onClick={() => navigate('/restaurant/new')}
              className="btn-primary"
            >
              Create Restaurant
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {restaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                onClick={() => handleSelectRestaurant(restaurant.id)}
                className="card cursor-pointer group hover:-translate-y-1 transition-all duration-300 border-transparent hover:border-primary-100 shadow-sm hover:shadow-xl hover:shadow-primary-500/10 overflow-hidden relative !p-0"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-50 to-transparent opacity-80 rounded-bl-full z-0 group-hover:scale-110 transition-transform"></div>
                
                <div className="p-6 relative z-10">
                  <h2 className="text-2xl font-bold text-gray-900 mb-5 group-hover:text-primary-600 transition-colors">{restaurant.name}</h2>
                  
                  <div className="space-y-3 mb-6 text-sm text-gray-600">
                    <div className="flex items-start gap-3">
                      <MapPin className="text-gray-400 shrink-0 mt-0.5" size={16} />
                      <span className="leading-relaxed">{restaurant.address}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="text-gray-400 shrink-0" size={16} />
                      <span>{restaurant.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="text-gray-400 shrink-0" size={16} />
                      <span>{restaurant.email}</span>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between group-hover:bg-primary-50/50 transition-colors">
                  <span className="text-sm font-semibold text-primary-600">Manage Operations</span>
                  <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-colors text-gray-400">
                    <ChevronRight size={18} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
