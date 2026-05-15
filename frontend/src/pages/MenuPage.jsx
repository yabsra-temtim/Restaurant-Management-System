import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { menuService } from '../services/api';
import { Plus, Trash2, Utensils, Tag, LayoutList } from 'lucide-react';

export const MenuPage = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
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
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      try {
        await menuService.deleteItem(itemId);
        fetchMenuData();
      } catch (err) {
        console.error('Failed to delete item:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="animate-pulse text-primary-500 font-medium text-lg flex items-center gap-3">
          <div className="w-6 h-6 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          Loading menu...
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
          <LayoutList size={18} />
          Back to Hub
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2 flex items-center gap-3">
              <div className="p-2 bg-primary-100 rounded-xl text-primary-600">
                <LayoutList size={24} />
              </div>
              Menu Management
            </h1>
            <p className="text-gray-500 text-lg">Curate your restaurant's offerings.</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button
              onClick={() => { setShowAddCategory(!showAddCategory); setShowAddItem(false); }}
              className={`btn ${showAddCategory ? 'btn-secondary' : 'bg-white text-gray-700 border border-gray-200 shadow-sm'} flex-1 md:flex-none justify-center gap-2`}
            >
              <Plus size={18} />
              Category
            </button>
            <button
              onClick={() => { setShowAddItem(!showAddItem); setShowAddCategory(false); }}
              className="btn-primary flex-1 md:flex-none justify-center gap-2 shadow-primary-500/30"
            >
              <Utensils size={18} />
              Menu Item
            </button>
          </div>
        </div>

        {showAddCategory && (
          <div className="card mb-10 animate-slide-up border-l-4 border-l-gray-300">
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Add New Category</h2>
            <form onSubmit={handleAddCategory}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">Category Name</label>
                  <input
                    type="text"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    className="input-field"
                    placeholder="e.g. Starters, Main Course"
                    required
                  />
                </div>
                <div>
                  <label className="label">Description (Optional)</label>
                  <input
                    type="text"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                    className="input-field"
                    placeholder="Brief description of category"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setShowAddCategory(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn bg-gray-900 text-white hover:bg-gray-800">Add Category</button>
              </div>
            </form>
          </div>
        )}

        {showAddItem && (
          <div className="card mb-10 animate-slide-up border-l-4 border-l-primary-500">
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Add Menu Item</h2>
            <form onSubmit={handleAddItem}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">Item Name</label>
                  <input
                    type="text"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    className="input-field"
                    placeholder="e.g. Truffle Fries"
                    required
                  />
                </div>
                <div>
                  <label className="label">Category</label>
                  <select
                    value={newItem.category_id}
                    onChange={(e) => setNewItem({ ...newItem, category_id: e.target.value })}
                    className="input-field bg-white"
                    required
                  >
                    <option value="" disabled>Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Price</label>
                  <div className="relative">
                    <span className="absolute left-4 top-2.5 text-gray-500 font-medium">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={newItem.price}
                      onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                      className="input-field pl-8"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="label">Description (Optional)</label>
                  <input
                    type="text"
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    className="input-field"
                    placeholder="e.g. Crispy fries with truffle oil and parmesan"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setShowAddItem(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Add Menu Item</button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-10">
          {categories.map((category) => {
            const items = menuItems.filter((item) => item.category_id === category.id);
            return (
              <div key={category.id} className="animate-fade-in">
                <div className="flex items-end justify-between mb-6 pb-2 border-b-2 border-gray-100">
                  <div>
                    <h2 className="text-2xl font-display font-bold text-gray-900">{category.name}</h2>
                    {category.description && <p className="text-gray-500 text-sm mt-1">{category.description}</p>}
                  </div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-100 px-2.5 py-1 rounded-md">{items.length} Items</span>
                </div>
                
                {items.length === 0 ? (
                  <div className="text-center py-8 bg-white/50 rounded-2xl border border-dashed border-gray-200">
                    <p className="text-gray-500">No items in this category.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {items.map((item) => (
                      <div key={item.id} className="card !p-5 group hover:border-primary-100 transition-colors">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1 group-hover:text-primary-600 transition-colors">{item.name}</h3>
                            <p className="text-gray-500 text-sm mb-4 line-clamp-2">{item.description || 'No description available.'}</p>
                          </div>
                          <div className="text-right">
                            <span className="inline-block bg-primary-50 text-primary-700 font-bold px-3 py-1 rounded-lg text-lg">
                              ${parseFloat(item.price).toFixed(2)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="pt-4 mt-2 border-t border-gray-50 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors flex items-center gap-1 text-sm font-medium"
                          >
                            <Trash2 size={16} /> Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {categories.length === 0 && !loading && (
            <div className="card text-center py-16 px-4 border-dashed">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Utensils className="text-gray-300" size={32} />
              </div>
              <p className="text-gray-500 text-lg mb-2">Your menu is empty.</p>
              <p className="text-gray-400 text-sm">Start by creating a category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
