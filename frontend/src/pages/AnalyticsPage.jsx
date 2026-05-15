import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { analyticsService } from '../services/api';
import { BarChart3, TrendingUp, DollarSign, ShoppingBag, Award, Calendar } from 'lucide-react';

export const AnalyticsPage = () => {
  const { restaurantId } = useParams();
  const [summary, setSummary] = useState(null);
  const [bestSellers, setBestSellers] = useState([]);
  const [dailySales, setDailySales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [restaurantId]);

  const fetchAnalytics = async () => {
    try {
      const [summaryRes, bestRes, dailyRes] = await Promise.all([
        analyticsService.getSalesSummary(restaurantId),
        analyticsService.getBestSellers(restaurantId),
        analyticsService.getDailySales(restaurantId)
      ]);
      setSummary(summaryRes.data);
      setBestSellers(bestRes.data);
      setDailySales(dailyRes.data);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-white bg-gray-900 min-h-screen">Loading Analytics...</div>;

  return (
    <div className="min-h-screen bg-gray-50/50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-display font-black text-gray-900 mb-2 flex items-center gap-3">
              <div className="p-2 bg-violet-100 rounded-xl text-violet-600">
                <BarChart3 size={28} />
              </div>
              Analytics & Insights
            </h1>
            <p className="text-gray-500">Track sales performance, popular items, and revenue trends.</p>
          </div>
        </div>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 text-violet-500/5 group-hover:text-violet-500/10 transition-colors">
              <DollarSign size={140} />
            </div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Total Revenue</p>
            <h2 className="text-4xl font-black text-gray-900 mb-1">${parseFloat(summary?.total_revenue || 0).toLocaleString()}</h2>
            <div className="flex items-center gap-1 text-emerald-500 text-sm font-bold">
              <TrendingUp size={16} />
              <span>+12.5% this month</span>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 text-amber-500/5 group-hover:text-amber-500/10 transition-colors">
              <ShoppingBag size={140} />
            </div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Total Orders</p>
            <h2 className="text-4xl font-black text-gray-900 mb-1">{summary?.total_orders || 0}</h2>
            <p className="text-gray-500 text-sm font-medium">Completed transactions</p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 text-blue-500/5 group-hover:text-blue-500/10 transition-colors">
              <Award size={140} />
            </div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Avg Order Value</p>
            <h2 className="text-4xl font-black text-gray-900 mb-1">${parseFloat(summary?.average_order_value || 0).toFixed(2)}</h2>
            <p className="text-gray-500 text-sm font-medium">Per customer ticket</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Daily Sales Chart Placeholder / List */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Calendar size={20} className="text-violet-500" />
                Daily Revenue (Last 7 Days)
              </h3>
            </div>
            <div className="space-y-4">
              {dailySales.length === 0 ? (
                <p className="text-center py-12 text-gray-400 italic">No sales recorded in the last 7 days.</p>
              ) : (
                dailySales.map((day, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <span className="w-24 text-sm font-bold text-gray-500">
                      {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </span>
                    <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-violet-500 rounded-full transition-all duration-1000"
                        style={{ width: `${(day.revenue / Math.max(...dailySales.map(d => d.revenue))) * 100}%` }}
                      ></div>
                    </div>
                    <span className="w-20 text-right font-black text-gray-900">${parseFloat(day.revenue).toFixed(2)}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Best Sellers */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Award size={20} className="text-amber-500" />
                Best Selling Items
              </h3>
            </div>
            <div className="space-y-6">
              {bestSellers.length === 0 ? (
                <p className="text-center py-12 text-gray-400 italic">No items sold yet.</p>
              ) : (
                bestSellers.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${
                        idx === 0 ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-400'
                      }`}>
                        #{idx + 1}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.total_sold} units sold</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-gray-900">${parseFloat(item.total_revenue).toFixed(2)}</p>
                      <p className="text-[10px] text-emerald-500 font-black uppercase tracking-tighter">In Demand</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
