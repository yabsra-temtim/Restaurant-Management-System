import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/api';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await userService.login({ email, password });
      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      const message = err?.response?.data?.error || 'Login failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center flex items-center justify-center p-4 relative"
      style={{ backgroundImage: 'url("/login-bg.png")' }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0"></div>
      
      <div className="card w-full max-w-md relative z-10 border-0 shadow-2xl animate-fade-in !p-10">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-tr from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/30">
            <span className="text-3xl text-white">🍽️</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">Savor</h1>
          <p className="text-gray-500 font-medium">Restaurant Management System</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="p-4 bg-red-50/80 backdrop-blur-sm border border-red-100 rounded-xl text-red-600 text-sm flex items-center gap-2 animate-slide-up">
              <span className="font-semibold">Error:</span> {error}
            </div>
          )}

          <div>
            <label className="label text-gray-600">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field bg-gray-50/50 focus:bg-white"
              placeholder="manager@restaurant.com"
              required
            />
          </div>

          <div>
            <label className="label text-gray-600">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field bg-gray-50/50 focus:bg-white"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 mt-4 text-lg"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 p-4 bg-primary-50/50 border border-primary-100/50 rounded-xl text-sm text-gray-600 text-center">
          <p className="font-semibold text-primary-700 mb-1">Demo Access</p>
          <p>manager@restaurant.com / <span className="font-mono bg-white px-1 rounded text-xs">password</span></p>
        </div>
      </div>
    </div>
  );
};
