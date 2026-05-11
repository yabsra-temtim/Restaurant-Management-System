import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Menu as MenuIcon, Users, CalendarDays, Settings } from 'lucide-react';

export const RestaurantPage = () => {
  const { restaurantId } = useParams();
  const [activeTab, setActiveTab] = useState('tables');

  const tabs = [
    { id: 'tables', label: 'Tables', icon: Users },
    { id: 'menu', label: 'Menu', icon: MenuIcon },
    { id: 'orders', label: 'Orders', icon: CalendarDays },
    { id: 'reservations', label: 'Reservations', icon: Settings },
  ];

  return (
    <div>
      <div className="bg-white shadow border-b">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Restaurant Management</h1>
        </div>
      </div>

      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex gap-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 font-medium flex items-center gap-2 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon size={20} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div>
        {activeTab === 'tables' && <div>Tables Component</div>}
        {activeTab === 'menu' && <div>Menu Component</div>}
        {activeTab === 'orders' && <div>Orders Component</div>}
        {activeTab === 'reservations' && <div>Reservations Component</div>}
      </div>
    </div>
  );
};
