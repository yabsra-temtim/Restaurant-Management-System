import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tableService } from '../services/api';
import { Plus, Users, Trash2, Edit, CheckCircle, Clock, ArrowLeft } from 'lucide-react';

export const TablesPage = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddTable, setShowAddTable] = useState(false);
  const [newTableData, setNewTableData] = useState({
    table_number: '',
    capacity: '',
  });

  useEffect(() => {
    fetchTables();
  }, [restaurantId]);

  const fetchTables = async () => {
    try {
      const { data } = await tableService.getByRestaurant(restaurantId);
      setTables(data);
    } catch (err) {
      console.error('Failed to fetch tables:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTable = async (e) => {
    e.preventDefault();
    try {
      await tableService.create({
        restaurant_id: restaurantId,
        table_number: parseInt(newTableData.table_number),
        capacity: parseInt(newTableData.capacity),
      });
      setNewTableData({ table_number: '', capacity: '' });
      setShowAddTable(false);
      fetchTables();
    } catch (err) {
      console.error('Failed to add table:', err);
    }
  };

  const handleDeleteTable = async (tableId) => {
    if (window.confirm('Are you sure you want to remove this table?')) {
      try {
        await tableService.delete(tableId);
        fetchTables();
      } catch (err) {
        console.error('Failed to delete table:', err);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'available':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'occupied':
        return 'bg-rose-50 text-rose-700 border-rose-100';
      case 'reserved':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="animate-pulse text-primary-500 font-medium text-lg flex items-center gap-3">
          <div className="w-6 h-6 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          Loading tables...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50/50">
      <div className="max-w-7xl mx-auto">
        <button 
          onClick={() => navigate(`/restaurant/${restaurantId}`)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8 font-medium transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Hub
        </button>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">Tables Management</h1>
            <p className="text-gray-500">Configure layout and manage dining tables.</p>
          </div>
          <button
            onClick={() => setShowAddTable(!showAddTable)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            {showAddTable ? 'Cancel' : 'Add Table'}
          </button>
        </div>

        {showAddTable && (
          <div className="card mb-8 animate-slide-up bg-white">
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-4">New Table Configuration</h2>
            <form onSubmit={handleAddTable}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">Table Number / Label</label>
                  <input
                    type="number"
                    value={newTableData.table_number}
                    onChange={(e) => setNewTableData({ ...newTableData, table_number: e.target.value })}
                    className="input-field"
                    placeholder="e.g. 1"
                    required
                  />
                </div>
                <div>
                  <label className="label">Seating Capacity</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input
                      type="number"
                      value={newTableData.capacity}
                      onChange={(e) => setNewTableData({ ...newTableData, capacity: e.target.value })}
                      className="input-field pl-10"
                      placeholder="e.g. 4"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddTable(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">Add Table</button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {tables.map((table) => (
            <div
              key={table.id}
              className="card !p-0 overflow-hidden hover:-translate-y-1 transition-all duration-300 border-gray-100 group flex flex-col h-full"
            >
              <div className="p-6 flex-1 relative">
                <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Users size={64} className="text-primary-500" />
                </div>
                
                <h3 className="text-3xl font-display font-bold text-gray-900 mb-1">
                  #{table.table_number}
                </h3>
                <div className="flex items-center gap-2 text-gray-500 mb-6 font-medium">
                  <Users size={16} />
                  <span>{table.capacity} Seats</span>
                </div>
                
                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(table.status)}`}>
                  <div className="w-2 h-2 rounded-full bg-current opacity-75"></div>
                  <span className="capitalize">{table.status || 'Available'}</span>
                </div>
              </div>
              
              <div className="flex bg-gray-50/80 border-t border-gray-100 divide-x divide-gray-100">
                <button
                  onClick={() => navigate(`/restaurant/${restaurantId}/pos/${table.id}`)}
                  className="flex-1 py-3 text-sm font-semibold text-primary-600 hover:bg-primary-50 transition-colors flex items-center justify-center gap-2"
                >
                  Orders
                </button>
                <button
                  onClick={() => handleDeleteTable(table.id)}
                  className="px-4 py-3 text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center justify-center"
                  title="Remove Table"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}

          {tables.length === 0 && !loading && (
            <div className="col-span-full card text-center py-16 px-4 border-dashed">
              <p className="text-gray-500 text-lg">No tables defined yet.</p>
              <button
                onClick={() => setShowAddTable(true)}
                className="text-primary-600 font-medium mt-2 hover:underline"
              >
                Add your first table
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
