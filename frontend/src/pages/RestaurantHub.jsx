import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChefHat, 
  Receipt, 
  UtensilsCrossed, 
  ClipboardList, 
  Users, 
  Package, 
  BarChart3, 
  Settings,
  ArrowLeft
} from 'lucide-react';

export const RestaurantHub = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();

  const tools = [
    { 
      id: 'pos', 
      name: 'POS & Billing', 
      icon: Receipt, 
      color: 'bg-emerald-500', 
      path: `/restaurant/${restaurantId}/pos`,
      description: 'Process orders and payments'
    },
    { 
      id: 'kitchen', 
      name: 'Kitchen', 
      icon: ChefHat, 
      color: 'bg-amber-500', 
      path: `/restaurant/${restaurantId}/kitchen`,
      description: 'Live order tracking and prep'
    },
    { 
      id: 'tables', 
      name: 'Tables', 
      icon: UtensilsCrossed, 
      color: 'bg-blue-500', 
      path: `/restaurant/${restaurantId}/tables`,
      description: 'Manage floor and reservations'
    },
    { 
      id: 'menu', 
      name: 'Menu', 
      icon: ClipboardList, 
      color: 'bg-rose-500', 
      path: `/restaurant/${restaurantId}/menu`,
      description: 'Manage items and prices'
    },
    { 
      id: 'staff', 
      name: 'Staff', 
      icon: Users, 
      color: 'bg-indigo-500', 
      path: `/restaurant/${restaurantId}/staff`,
      description: 'Attendance and scheduling'
    },
    { 
      id: 'inventory', 
      name: 'Inventory', 
      icon: Package, 
      color: 'bg-orange-500', 
      path: `/restaurant/${restaurantId}/inventory`,
      description: 'Stock tracking and suppliers'
    },
    { 
      id: 'analytics', 
      name: 'Analytics', 
      icon: BarChart3, 
      color: 'bg-violet-500', 
      path: `/restaurant/${restaurantId}/analytics`,
      description: 'Sales and profit reports'
    },
    { 
      id: 'settings', 
      name: 'Settings', 
      icon: Settings, 
      color: 'bg-gray-500', 
      path: `/restaurant/${restaurantId}/settings`,
      description: 'General configuration'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 p-8">
      <div className="max-w-7xl mx-auto">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8 font-medium transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        <div className="mb-12">
          <h1 className="text-4xl font-display font-black text-gray-900 mb-3">Restaurant Hub</h1>
          <p className="text-gray-500 text-lg">Select a tool to manage your restaurant operations.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => navigate(tool.path)}
              className="group p-6 bg-white rounded-3xl border border-transparent hover:border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left"
            >
              <div className={`w-14 h-14 ${tool.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-${tool.color.split('-')[1]}-500/20 group-hover:scale-110 transition-transform`}>
                <tool.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{tool.name}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{tool.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
