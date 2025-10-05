import React from 'react';
import { X, Home, Map, Star, Users, Settings, HelpCircle, BookOpen, Heart, Clock, MapPin } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: number;
  isActive?: boolean;
}

const navigationItems: NavigationItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: <Home size={20} />,
    href: '/',
    isActive: true
  },
  {
    id: 'explore',
    label: 'Explore',
    icon: <Map size={20} />,
    href: '/explore'
  },
  {
    id: 'favorites',
    label: 'Favorites',
    icon: <Heart size={20} />,
    href: '/favorites',
    badge: 12
  },
  {
    id: 'recent',
    label: 'Recent',
    icon: <Clock size={20} />,
    href: '/recent'
  },
  {
    id: 'reviews',
    label: 'My Reviews',
    icon: <Star size={20} />,
    href: '/reviews'
  },
  {
    id: 'community',
    label: 'Community',
    icon: <Users size={20} />,
    href: '/community'
  },
  {
    id: 'submissions',
    label: 'My Submissions',
    icon: <BookOpen size={20} />,
    href: '/submissions'
  }
];

const quickAccessItems = [
  {
    label: 'Libraries Near Me',
    icon: <MapPin size={16} />,
    href: '/search?type=library&nearby=true'
  },
  {
    label: 'Quiet Cafés',
    icon: <MapPin size={16} />,
    href: '/search?type=cafe&quiet=very_quiet'
  },
  {
    label: 'Parks & Gardens',
    icon: <MapPin size={16} />,
    href: '/search?type=park'
  },
  {
    label: 'Accessible Spaces',
    icon: <MapPin size={16} />,
    href: '/search?accessibility=wheelchair'
  }
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-40 h-full w-72 bg-white border-r border-gray-200 
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-primary-600 rounded-lg">
                <MapPin className="text-white" size={20} />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Quiet Spaces</h2>
            </div>
            <button 
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200 lg:hidden"
              onClick={onClose}
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Main Navigation */}
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Navigation
              </h3>
              <ul className="space-y-1">
                {navigationItems.map((item) => (
                  <li key={item.id}>
                    <a 
                      href={item.href}
                      className={`
                        flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200
                        ${item.isActive 
                          ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600' 
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                        }
                      `}
                    >
                      <span className="flex-shrink-0">{item.icon}</span>
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Access */}
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Quick Access
              </h3>
              <ul className="space-y-1">
                {quickAccessItems.map((item, index) => (
                  <li key={index}>
                    <a 
                      href={item.href} 
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <span className="flex-shrink-0">{item.icon}</span>
                      <span>{item.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* Footer */}
          <div className="border-t border-gray-200 p-6 space-y-4">
            {/* Settings */}
            <div>
              <ul className="space-y-1">
                <li>
                  <a 
                    href="/settings" 
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Settings size={18} />
                    <span>Settings</span>
                  </a>
                </li>
                <li>
                  <a 
                    href="/help" 
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <HelpCircle size={18} />
                    <span>Help & Support</span>
                  </a>
                </li>
              </ul>
            </div>
            
            {/* User Profile */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-primary-100 text-primary-700 rounded-full font-semibold">
                  JD
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">John Doe</p>
                  <p className="text-xs text-gray-500">Contributor</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
