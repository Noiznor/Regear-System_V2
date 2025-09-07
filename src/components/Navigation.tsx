import React from 'react';
import { Plus, Eye, Edit, Shield } from 'lucide-react';

interface NavigationProps {
  currentView: 'home' | 'create' | 'view' | 'modify';
  onViewChange: (view: 'home' | 'create' | 'view' | 'modify') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange }) => {
  const navItems = [
    { id: 'create', label: 'Create Thread', icon: Plus, color: 'text-blue-600 hover:text-blue-700' },
    { id: 'view', label: 'View Threads', icon: Eye, color: 'text-green-600 hover:text-green-700' },
    { id: 'modify', label: 'Modify Threads', icon: Edit, color: 'text-purple-600 hover:text-purple-700' }
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          <button
            onClick={() => onViewChange('home')}
            className="flex items-center space-x-3 group"
          >
            <div className="rounded-2xl p-2 shadow-lg group-hover:scale-110 transition-transform duration-200 bg-white">
              <img 
                src="/mahaLogo.png" 
                alt="Maharlika Logo" 
                className="h-10 w-10 object-contain"
              />
            </div>
            <div className="text-left">
              <div className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                Maharlika Regear System
              </div>
              <div className="text-sm text-gray-500">Guild Management</div>
            </div>
          </button>
          
          <div className="flex space-x-2">
            {navItems.map(({ id, label, icon: Icon, color }) => (
              <button
                key={id}
                onClick={() => onViewChange(id as any)}
                className={`relative inline-flex items-center px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 transform hover:scale-105 ${
                  currentView === id
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                    : `text-gray-600 hover:bg-gray-100 ${color}`
                }`}
              >
                <Icon className="mr-2 h-4 w-4" />
                {label}
                {currentView === id && (
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 opacity-20 animate-pulse" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};
