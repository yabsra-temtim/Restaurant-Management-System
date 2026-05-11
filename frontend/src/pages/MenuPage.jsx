import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { menuService } from '../services/api';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export const MenuPage = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
  });

  useEffect(() => {
    fetchMenuData();
  }, [restaurantId]);

  const fetchMenuData = async () => {
    try {
      const [categoriesRes, itemsRes] = await Promise.all([
        menuService.getCategories(restaurantId),
        menuService.getItems(restaurantId),
      ]);
      setCategories(categoriesRes.data);
      setMenuItems(itemsRes.data);
    } catch (err) {
      console.error('Failed to fetch menu data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      await menuService.createCategory({
        restaurant_id: restaurantId,
        ...newCategory,
      });
      setNewCategory({ name: '', description: '' });
      setShowAddCategory(false);
      fetchMenuData();
    } catch (err) {
      console.error('Failed to add category:', err);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      await menuService.createItem({
        restaurant_id: restaurantId,
        category_id: newItem.category_id,
        name: newItem.name,
        description: newItem.description,
        price: parseFloat(newItem.price),
      });
      setNewItem({ name: '', description: '', price: '', category_id: '' });
      setShowAddItem(false);
      fetchMenuData();
    } catch (err) {
      console.error('Failed to add item:', err);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Are you sure?')) {
      try {
        await menuService.deleteItem(itemId);
        fetchMenuData();
      } catch (err) {
        console.error('Failed to delete item:', err);
      }
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Menu Management</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setShowAddCategory(!showAddCategory)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={20} />
              Add Category
            </button>
            <button
              onClick={() => setShowAddItem(!showAddItem)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={20} />
              Add Item
            </button>
          </div>
        </div>

        {showAddCategory && (
          <div className="card mb-8">
            <form onSubmit={handleAddCategory}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Category Name</label>
                  <input
                    type="text"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="label">Description</label>
                  <input
                    type="text"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button type="submit" className="btn-primary">Add Category</button>
                <button
                  type="button"
                  onClick={() => setShowAddCategory(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {showAddItem && (
          <div className="card mb-8">
            <form onSubmit={handleAddItem}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Item Name</label>
                  <input
                    type="text"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="label">Category</label>
                  <select
                    value={newItem.category_id}
                    onChange={(e) => setNewItem({ ...newItem, category_id: e.target.value })}
                    className="input-field"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="label">Description</label>
                  <input
                    type="text"
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button type="submit" className="btn-primary">Add Item</button>
                <button
                  type="button"
                  onClick={() => setShowAddItem(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-8">
          {categories.map((category) => (
            <div key={category.id} className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{category.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {menuItems
                  .filter((item) => item.category_id === category.id)
                  .map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">{item.name}</h3>
                      <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-primary-600">${parseFloat(item.price).toFixed(2)}</span>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
