import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { inventoryService } from '../services/api';
import { Package, AlertTriangle, ArrowUpRight, Plus, Search, Filter } from 'lucide-react';

export const InventoryPage = () => {
  const { restaurantId } = useParams();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchInventory();
  }, [restaurantId]);

  const fetchInventory = async () => {
    try {
      const { data } = await inventoryService.getByRestaurant(restaurantId);
      setInventory(data);
    } catch (err) {
      console.error('Failed to fetch inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredInventory = inventory.filter(item => 
    item.item_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-8 text-center text-white bg-gray-900 min-h-screen">Loading Inventory...</div>;

  return (
    <div className="min-h-screen bg-gray-50/50 p-8">
      <div className="max-w-7xl mx-auto">
        <button 
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-gray-900 mb-8 font-medium transition-colors"
        >
          <Package size={18} />
          Back to Hub
        </button>

        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-display font-black text-gray-900 mb-2 flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-xl text-orange-600">
                <Package size={28} />
              </div>
              Inventory
            </h1>
            <p className="text-gray-500">Track ingredients, stock levels, and supply alerts.</p>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <Plus size={20} />
            Add Item
          </button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Total Items</p>
            <p className="text-3xl font-black text-gray-900">{inventory.length}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-sm font-bold text-rose-500 uppercase tracking-widest mb-1">Low Stock Alerts</p>
            <p className="text-3xl font-black text-rose-600">
              {inventory.filter(i => parseFloat(i.current_stock) <= parseFloat(i.low_stock_threshold)).length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-sm font-bold text-emerald-500 uppercase tracking-widest mb-1">Out of Stock</p>
            <p className="text-3xl font-black text-emerald-600">
              {inventory.filter(i => parseFloat(i.current_stock) <= 0).length}
            </p>
          </div>
        </div>

        {/* Inventory List */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between bg-gray-50/30">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search ingredients..." 
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button className="p-3 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-gray-900 transition-colors">
                <Filter size={20} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-500">
                  <th className="px-8 py-4">Item Name</th>
                  <th className="px-8 py-4 text-center">Status</th>
                  <th className="px-8 py-4 text-center">Current Stock</th>
                  <th className="px-8 py-4 text-center">Threshold</th>
                  <th className="px-8 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredInventory.map((item) => {
                  const isLow = parseFloat(item.current_stock) <= parseFloat(item.low_stock_threshold);
                  const isOut = parseFloat(item.current_stock) <= 0;
                  
                  return (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <p className="font-bold text-gray-900 text-lg">{item.item_name}</p>
                        <p className="text-xs text-gray-500 mt-1">Measured in {item.unit}</p>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          isOut ? 'bg-rose-100 text-rose-700' : 
                          isLow ? 'bg-amber-100 text-amber-700' : 
                          'bg-emerald-100 text-emerald-700'
                        }`}>
                          {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'Healthy'}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className={`text-xl font-black ${isLow ? 'text-amber-600' : 'text-gray-900'}`}>
                          {parseFloat(item.current_stock).toFixed(1)}
                        </span>
                        <span className="text-gray-400 text-xs ml-1">{item.unit}</span>
                      </td>
                      <td className="px-8 py-6 text-center text-gray-500 font-medium">
                        {parseFloat(item.low_stock_threshold).toFixed(1)} {item.unit}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button className="text-orange-600 font-bold text-sm hover:underline flex items-center gap-1 ml-auto">
                          Update <ArrowUpRight size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
