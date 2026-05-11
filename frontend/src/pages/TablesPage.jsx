import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tableService, orderService } from '../services/api';
import { Plus, RotateCcw } from 'lucide-react';

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
    if (window.confirm('Are you sure?')) {
      try {
        await tableService.delete(tableId);
        fetchTables();
      } catch (err) {
        console.error('Failed to delete table:', err);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'occupied':
        return 'bg-red-100 text-red-800';
      case 'reserved':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tables Management</h1>
          <button
            onClick={() => setShowAddTable(!showAddTable)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            Add Table
          </button>
        </div>

        {showAddTable && (
          <div className="card mb-8">
            <form onSubmit={handleAddTable}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Table Number</label>
                  <input
                    type="number"
                    value={newTableData.table_number}
                    onChange={(e) => setNewTableData({ ...newTableData, table_number: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="label">Capacity</label>
                  <input
                    type="number"
                    value={newTableData.capacity}
                    onChange={(e) => setNewTableData({ ...newTableData, capacity: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button type="submit" className="btn-primary">Add Table</button>
                <button
                  type="button"
                  onClick={() => setShowAddTable(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {tables.map((table) => (
            <div
              key={table.id}
              className="card text-center hover:shadow-lg transition-shadow"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Table {table.table_number}</h3>
              <p className="text-gray-600 text-sm mb-3">Capacity: {table.capacity}</p>
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${getStatusColor(table.status)}`}>
                {table.status}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/restaurant/${restaurantId}/orders/${table.id}`)}
                  className="btn-primary text-sm flex-1"
                >
                  Orders
                </button>
                <button
                  onClick={() => handleDeleteTable(table.id)}
                  className="btn-danger text-sm flex-1"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
