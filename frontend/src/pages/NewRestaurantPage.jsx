import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { restaurantService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Store, MapPin, Phone, Mail, ArrowLeft, Save } from 'lucide-react';

export const NewRestaurantPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await restaurantService.create({
        ...formData,
        owner_id: user.id,
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to create restaurant. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50/50">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-500 hover:text-primary-600 transition-colors mb-8 font-medium"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        <div className="card !p-0 overflow-hidden border-0 shadow-2xl animate-slide-up">
          <div className="bg-gradient-to-r from-primary-600 to-accent-600 p-8 text-white">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl">
                <Store size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-display font-bold">New Restaurant</h1>
                <p className="text-primary-100">Set up your new dining establishment.</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-white">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm animate-shake">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="label">Restaurant Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  placeholder="e.g. Savor Bistro"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="label text-gray-600">Full Address</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-3.5 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="input-field pl-12"
                    placeholder="123 Culinary Ave, Food City"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="label text-gray-600">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-3.5 text-gray-400" size={18} />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input-field pl-12"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div>
                <label className="label text-gray-600">Business Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 text-gray-400" size={18} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-field pl-12"
                    placeholder="contact@savor.com"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="btn-secondary"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary flex items-center gap-2 px-8"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Create Restaurant
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
