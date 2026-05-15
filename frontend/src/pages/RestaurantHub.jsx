import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ChefHat, 
  Receipt, 
  UtensilsCrossed, 
  ClipboardList, 
  Users, 
  Package, 
  BarChart3, 
  Settings,
  ArrowLeft,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import api from '../services/api';

export const RestaurantHub = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const userRole = user?.role?.toLowerCase() || 'staff';

  const allTools = [
    { 
      id: 'pos', 
      name: 'POS & Billing', 
      icon: Receipt, 
      color: 'bg-emerald-600', 
      path: userRole === 'cashior' ? `/restaurant/${restaurantId}/cashier` : `/restaurant/${restaurantId}/pos`,
      description: 'Quick billing and payments',
      roles: ['manager', 'cashior', 'server']
    },
    { 
      id: 'orders', 
      name: 'Live Orders', 
      icon: ClipboardList, 
      color: 'bg-emerald-500', 
      path: `/restaurant/${restaurantId}/orders`,
      description: 'Monitor all active orders',
      roles: ['manager', 'cashior', 'server', 'kitchen staff']
    },
    { 
      id: 'kitchen', 
      name: 'Kitchen', 
      icon: ChefHat, 
      color: 'bg-amber-500', 
      path: `/restaurant/${restaurantId}/kitchen`,
      description: 'Order preparation dashboard',
      roles: ['manager', 'kitchen staff']
    },
    { 
      id: 'tables', 
      name: 'Tables', 
      icon: UtensilsCrossed, 
      color: 'bg-blue-500', 
      path: `/restaurant/${restaurantId}/tables`,
      description: 'Manage floor and reservations',
      roles: ['manager', 'server', 'cashior']
    },
    { 
      id: 'menu', 
      name: 'Menu Management', 
      icon: ClipboardList, 
      color: 'bg-rose-500', 
      path: `/restaurant/${restaurantId}/menu`,
      description: 'Manage items and prices',
      roles: ['manager']
    },
    { 
      id: 'staff', 
      name: 'Staff & Attendance', 
      icon: Users, 
      color: 'bg-indigo-500', 
      path: `/restaurant/${restaurantId}/staff`,
      description: 'Attendance and scheduling',
      roles: ['manager']
    },
    { 
      id: 'inventory', 
      name: 'Inventory & Supplies', 
      icon: Package, 
      color: 'bg-orange-500', 
      path: `/restaurant/${restaurantId}/inventory`,
      description: 'Stock tracking and suppliers',
      roles: ['manager', 'storkeeper']
    },
    { 
      id: 'analytics', 
      name: 'Reports & Analytics', 
      icon: BarChart3, 
      color: 'bg-violet-500', 
      path: `/restaurant/${restaurantId}/analytics`,
      description: 'Sales and profit reports',
      roles: ['manager', 'storkeeper']
    },
    { 
      id: 'settings', 
      name: 'Settings', 
      icon: Settings, 
      color: 'bg-gray-500', 
      path: `/restaurant/${restaurantId}/settings`,
      description: 'General configuration',
      roles: ['manager']
    },
  ];

  const tools = allTools.filter(tool => tool.roles.includes(userRole));

  const handleClockOut = async () => {
    try {
      await api.post('/staff/clock-out', { user_id: user.id, restaurant_id: restaurantId });
      navigate('/dashboard');
    } catch (err) {
      console.error('Clock out failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>
          
          <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
              <UserIcon size={16} />
            </div>
            <div className="text-sm">
              <p className="font-bold text-gray-900 leading-none">{user?.name}</p>
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter mt-1">On Duty</p>
            </div>
            <div className="w-px h-6 bg-gray-100 mx-2"></div>
            <button 
              onClick={handleClockOut}
              className="flex items-center gap-2 text-rose-500 hover:text-rose-600 font-bold text-xs transition-colors"
            >
              <LogOut size={14} />
              Clock Out
            </button>
          </div>
        </div>

        <div className="mb-12">
          <h1 className="text-4xl font-display font-black text-gray-900 mb-3">Restaurant Hub</h1>
          <p className="text-gray-500 text-lg">Select a tool to manage your restaurant operations.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.length === 0 ? (
            <div className="col-span-full py-20 text-center text-gray-400">
              <p className="text-xl">No tools available for your role.</p>
            </div>
          ) : (
            tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => navigate(tool.path)}
                className="group p-6 bg-white rounded-3xl border border-transparent hover:border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left"
              >
                <div className={`w-14 h-14 ${tool.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-primary-500/10 group-hover:scale-110 transition-transform`}>
                  <tool.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{tool.name}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{tool.description}</p>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
