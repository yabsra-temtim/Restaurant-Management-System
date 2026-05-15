import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userService, restaurantService } from '../services/api';
import { Lock, ArrowLeft, Loader2, ShieldCheck } from 'lucide-react';

export const RestaurantLoginPage = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const { user, setRestaurantSession } = useAuth();
  const [password, setPassword] = useState('');
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRestaurant();
  }, [restaurantId]);

  const fetchRestaurant = async () => {
    try {
      const { data } = await restaurantService.getById(restaurantId);
      setRestaurant(data);
    } catch (err) {
      console.error('Failed to fetch restaurant:', err);
      setError('Could not identify restaurant');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setVerifying(true);
    setError('');

    try {
      await userService.restaurantLogin({
        restaurantId,
        email: user.email,
        password
      });
      
      setRestaurantSession(restaurantId);
      navigate(`/restaurant/${restaurantId}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Verification failed. Please check your password.');
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        <div className="bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-700 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <ShieldCheck size={120} />
          </div>

          <div className="relative z-10">
            <div className="w-16 h-16 bg-primary-500/10 rounded-2xl flex items-center justify-center text-primary-500 mb-6">
              <Lock size={32} />
            </div>

            <h1 className="text-3xl font-display font-black text-white mb-2">
              Restaurant Access
            </h1>
            <p className="text-gray-400 mb-8">
              Confirm your password to enter <span className="text-primary-400 font-bold">{restaurant?.name || 'this restaurant'}</span>.
            </p>

            {error && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-sm font-medium mb-6 animate-shake">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Your Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-4 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all"
                  placeholder="Enter your system password"
                  required
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={verifying}
                className="w-full bg-primary-500 hover:bg-primary-400 disabled:opacity-50 text-gray-900 font-black py-4 rounded-xl transition-all shadow-xl shadow-primary-500/20 flex items-center justify-center gap-2"
              >
                {verifying ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Verifying Access...
                  </>
                ) : (
                  'Confirm & Enter Hub'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
