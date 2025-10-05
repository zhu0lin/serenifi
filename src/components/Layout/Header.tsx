import React from 'react';
import { Search, Menu, Map, List, Grid, User, Bell, MapPin } from 'lucide-react';
import type { ViewMode } from '../../types';

interface HeaderProps {
  onMenuClick: () => void;
  onSearchClick: () => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onMenuClick,
  onSearchClick,
  viewMode,
  onViewModeChange
}) => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section - Logo and Menu */}
          <div className="flex items-center space-x-4">
            <button 
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200 lg:hidden"
              onClick={onMenuClick}
              aria-label="Open navigation menu"
            >
              <Menu size={24} />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary-600 rounded-lg">
                <MapPin className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Quiet Spaces NYC</h1>
                <p className="text-sm text-gray-500 hidden sm:block">Find Your Focus</p>
              </div>
            </div>
          </div>

          {/* Center Section - Search */}
          <div className="flex-1 max-w-lg mx-8 hidden md:block">
            <button 
              className="w-full flex items-center space-x-3 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-left text-gray-500 hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              onClick={onSearchClick}
              aria-label="Open search and filters"
            >
              <Search size={20} />
              <span>Search quiet spaces...</span>
            </button>
          </div>

          {/* Right Section - View Controls and User */}
          <div className="flex items-center space-x-2">
            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center bg-gray-100 rounded-lg p-1">
              <button
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === 'map' 
                    ? 'bg-white text-primary-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => onViewModeChange('map')}
                aria-label="Map view"
                title="Map view"
              >
                <Map size={18} />
              </button>
              <button
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-white text-primary-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => onViewModeChange('list')}
                aria-label="List view"
                title="List view"
              >
                <List size={18} />
              </button>
              <button
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-white text-primary-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => onViewModeChange('grid')}
                aria-label="Grid view"
                title="Grid view"
              >
                <Grid size={18} />
              </button>
            </div>

            {/* Notifications */}
            <button 
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200 hidden sm:block"
              aria-label="Notifications"
              title="Notifications"
            >
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </button>

            {/* User Profile */}
            <button 
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              aria-label="User profile"
              title="User profile"
            >
              <User size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <button 
            className="w-full flex items-center space-x-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-left text-gray-500 hover:bg-gray-100 hover:border-gray-300 transition-all duration-200"
            onClick={onSearchClick}
          >
            <Search size={18} />
            <span>Search quiet spaces...</span>
          </button>
        </div>
      </div>
    </header>
  );
};
