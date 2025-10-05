import React, { useState } from 'react';
import { Search, X, MapPin, Clock, Filter, Volume2, Accessibility } from 'lucide-react';
import type { SearchFilters, LocationType, QuietLevel } from '../../types';
import { LOCATION_TYPE_CONFIG, QUIET_LEVEL_CONFIG } from '../../types/constants';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onFiltersChange?: (filters: SearchFilters) => void;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ 
  isOpen, 
  onClose, 
  onFiltersChange 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    locationTypes: [],
    quietLevels: [],
    accessibility: {},
    radius: 2,
    openNow: false,
    hasReviews: false,
    minRating: 0
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic here
    console.log('Search query:', searchQuery);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const toggleArrayFilter = <T,>(
    currentArray: T[] | undefined,
    value: T,
    key: keyof SearchFilters
  ) => {
    const array = currentArray || [];
    const newArray = array.includes(value)
      ? array.filter(item => item !== value)
      : [...array, value];
    const newFilters = { ...filters, [key]: newArray };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const recentSearches = [
    'libraries near me',
    'quiet cafes',
    'parks with wifi',
    'accessible spaces'
  ];

  const popularLocations = [
    'NYPL - Stephen A. Schwarzman Building',
    'Bryant Park',
    'Central Park - Sheep Meadow',
    'Brooklyn Public Library'
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Search Panel */}
      <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Search & Filters</h2>
            <button 
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
              onClick={onClose}
              aria-label="Close search"
            >
              <X size={20} />
            </button>
          </div>

          {/* Search Form */}
          <div className="p-6 border-b border-gray-200">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search quiet spaces..."
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              <button 
                type="submit"
                className="w-full btn-primary"
              >
                Search
              </button>
            </form>
          </div>

          {/* Filters */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Location Types */}
            <div>
              <h3 className="flex items-center space-x-2 text-sm font-semibold text-gray-900 mb-3">
                <MapPin size={16} />
                <span>Location Type</span>
              </h3>
              <div className="space-y-2">
                {Object.entries(LOCATION_TYPE_CONFIG).map(([type, config]) => (
                  <label key={type} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.locationTypes?.includes(type as LocationType) || false}
                      onChange={() => toggleArrayFilter(filters.locationTypes, type as LocationType, 'locationTypes')}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-lg">{config.icon}</span>
                    <span className="text-sm text-gray-700">{config.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Quiet Levels */}
            <div>
              <h3 className="flex items-center space-x-2 text-sm font-semibold text-gray-900 mb-3">
                <Volume2 size={16} />
                <span>Quiet Level</span>
              </h3>
              <div className="space-y-2">
                {Object.entries(QUIET_LEVEL_CONFIG).map(([level, config]) => (
                  <label key={level} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.quietLevels?.includes(level as QuietLevel) || false}
                      onChange={() => toggleArrayFilter(filters.quietLevels, level as QuietLevel, 'quietLevels')}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-lg">{config.icon}</span>
                    <span className="text-sm text-gray-700">{config.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Accessibility */}
            <div>
              <h3 className="flex items-center space-x-2 text-sm font-semibold text-gray-900 mb-3">
                <Accessibility size={16} />
                <span>Accessibility</span>
              </h3>
              <div className="space-y-2">
                <label className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.accessibility?.wheelchairAccessible || false}
                    onChange={(e) => {
                      const newFilters = {
                        ...filters,
                        accessibility: {
                          ...filters.accessibility,
                          wheelchairAccessible: e.target.checked
                        }
                      };
                      setFilters(newFilters);
                      onFiltersChange?.(newFilters);
                    }}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">Wheelchair Accessible</span>
                </label>
                <label className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.accessibility?.quietHours || false}
                    onChange={(e) => {
                      const newFilters = {
                        ...filters,
                        accessibility: {
                          ...filters.accessibility,
                          quietHours: e.target.checked
                        }
                      };
                      setFilters(newFilters);
                      onFiltersChange?.(newFilters);
                    }}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">Quiet Hours</span>
                </label>
                <label className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.accessibility?.sensoryFriendly || false}
                    onChange={(e) => {
                      const newFilters = {
                        ...filters,
                        accessibility: {
                          ...filters.accessibility,
                          sensoryFriendly: e.target.checked
                        }
                      };
                      setFilters(newFilters);
                      onFiltersChange?.(newFilters);
                    }}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">Sensory Friendly</span>
                </label>
              </div>
            </div>

            {/* Recent Searches */}
            <div>
              <h3 className="flex items-center space-x-2 text-sm font-semibold text-gray-900 mb-3">
                <Clock size={16} />
                <span>Recent Searches</span>
              </h3>
              <div className="space-y-1">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    className="w-full text-left p-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                    onClick={() => {
                      setSearchQuery(search);
                    }}
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Locations */}
            <div>
              <h3 className="flex items-center space-x-2 text-sm font-semibold text-gray-900 mb-3">
                <MapPin size={16} />
                <span>Popular Locations</span>
              </h3>
              <div className="space-y-1">
                {popularLocations.map((location, index) => (
                  <button
                    key={index}
                    className="w-full text-left p-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                  >
                    {location}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Filters applied: {Object.keys(filters).filter(key => 
                Array.isArray(filters[key as keyof SearchFilters]) 
                  ? (filters[key as keyof SearchFilters] as any[]).length > 0
                  : filters[key as keyof SearchFilters]
              ).length}</span>
              <button 
                className="text-primary-600 hover:text-primary-700 font-medium"
                onClick={() => {
                  const clearedFilters: SearchFilters = {
                    locationTypes: [],
                    quietLevels: [],
                    accessibility: {},
                    radius: 2,
                    openNow: false,
                    hasReviews: false,
                    minRating: 0
                  };
                  setFilters(clearedFilters);
                  onFiltersChange?.(clearedFilters);
                }}
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
