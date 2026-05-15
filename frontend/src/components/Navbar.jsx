import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ChevronDown, LogOut } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center transition-all">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
            <span className="text-xl text-white">🍽️</span>
          </div>
          <h1 className="text-2xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 tracking-tight">Savor</h1>
        </div>

        {user && (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 pl-4 pr-3 py-2 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all focus:ring-2 focus:ring-primary-500/20"
            >
              <div className="flex flex-col text-right">
                <span className="text-sm font-semibold text-gray-700 leading-tight">{user.name}</span>
                <span className="text-[11px] font-medium text-primary-600 capitalize leading-tight">{user.role}</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm">
                {user.name.charAt(0)}
              </div>
              <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50 animate-fade-in py-1">
                <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                  <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                </div>
                <div className="p-1">
                  <button
                    onClick={() => {
                      logout();
                      setDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
