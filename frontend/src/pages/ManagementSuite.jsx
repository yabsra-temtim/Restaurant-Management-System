import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { Truck, ShoppingCart, Calendar, Plus, ExternalLink, Mail, Phone } from 'lucide-react';

export const ManagementSuite = () => {
  const { restaurantId } = useParams();
  const [activeTab, setActiveTab] = useState('suppliers');
  const [data, setData] = useState({ suppliers: [], purchaseOrders: [], shifts: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [restaurantId, activeTab]);

  const fetchData = async () => {
    try {
      // For now, let's just fetch suppliers as a placeholder for the suite
      const { data: suppliers } = await api.get(`/suppliers/restaurant/${restaurantId}`);
      setData(prev => ({ ...prev, suppliers }));
    } catch (err) {
      console.error('Failed to fetch management data:', err);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'suppliers', name: 'Suppliers', icon: Truck },
    { id: 'pos', name: 'Purchase Orders', icon: ShoppingCart },
    { id: 'shifts', name: 'Shift Schedule', icon: Calendar },
  ];

  if (loading) return <div className="p-8 text-center text-white bg-gray-900 min-h-screen">Loading Management Suite...</div>;

  return (
    <div className="min-h-screen bg-gray-50/50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-display font-black text-gray-900 mb-2">Management Suite</h1>
            <p className="text-gray-500">Back-office operations: Suppliers, Procurement, and Scheduling.</p>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <Plus size={20} />
            New {activeTab.slice(0, -1)}
          </button>
        </div>

        <div className="flex gap-2 mb-8 bg-gray-200/50 p-1 rounded-2xl w-fit">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                activeTab === tab.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon size={18} />
              {tab.name}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
          {activeTab === 'suppliers' && (
            <div className="divide-y divide-gray-100">
              {data.suppliers.length === 0 ? (
                <div className="py-20 text-center opacity-30">
                  <Truck size={48} className="mx-auto mb-4" />
                  <p className="text-xl font-bold">No suppliers registered yet.</p>
                </div>
              ) : (
                data.suppliers.map(s => (
                  <div key={s.id} className="p-8 flex justify-between items-center hover:bg-gray-50 transition-colors">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{s.name}</h3>
                      <div className="flex gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><User size={14} /> {s.contact_name}</span>
                        <span className="flex items-center gap-1"><Phone size={14} /> {s.phone}</span>
                        <span className="flex items-center gap-1"><Mail size={14} /> {s.email}</span>
                      </div>
                    </div>
                    <button className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-all">
                      <ExternalLink size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'pos' && (
            <div className="py-20 text-center opacity-30">
              <ShoppingCart size={48} className="mx-auto mb-4" />
              <p className="text-xl font-bold">Purchase Order system coming soon.</p>
            </div>
          )}

          {activeTab === 'shifts' && (
            <div className="py-20 text-center opacity-30">
              <Calendar size={48} className="mx-auto mb-4" />
              <p className="text-xl font-bold">Shift scheduling module coming soon.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
