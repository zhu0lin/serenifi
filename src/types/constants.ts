// Import types for use in type definitions
// import type { LocationType, QuietLevel } from './index';

// Location Type Display Names and Icons
export const LOCATION_TYPE_CONFIG = {
  library: {
    label: 'Library',
    icon: '📚',
    color: '#4A90E2',
    description: 'Public and private libraries'
  },
  park: {
    label: 'Park',
    icon: '🌳',
    color: '#7ED321',
    description: 'Public parks and green spaces'
  },
  pops: {
    label: 'POPS',
    icon: '🏢',
    color: '#BD10E0',
    description: 'Privately Owned Public Spaces'
  },
  cafe: {
    label: 'Café',
    icon: '☕',
    color: '#F5A623',
    description: 'Coffee shops and cafés'
  },
  coworking: {
    label: 'Coworking',
    icon: '💻',
    color: '#50E3C2',
    description: 'Coworking spaces'
  },
  bookstore: {
    label: 'Bookstore',
    icon: '📖',
    color: '#B8E986',
    description: 'Independent and chain bookstores'
  },
  museum: {
    label: 'Museum',
    icon: '🏛️',
    color: '#9013FE',
    description: 'Museums and cultural institutions'
  },
  other: {
    label: 'Other',
    icon: '📍',
    color: '#9B9B9B',
    description: 'Other quiet spaces'
  }
} as const;

// Quiet Level Configuration
export const QUIET_LEVEL_CONFIG = {
  very_quiet: {
    label: 'Very Quiet',
    level: 1,
    color: '#4CAF50',
    description: 'Minimal noise complaints',
    icon: '🔇'
  },
  quiet: {
    label: 'Quiet',
    level: 2,
    color: '#8BC34A',
    description: 'Low noise complaints',
    icon: '🔉'
  },
  moderate: {
    label: 'Moderate',
    level: 3,
    color: '#FFC107',
    description: 'Some noise complaints',
    icon: '🔊'
  },
  noisy: {
    label: 'Noisy',
    level: 4,
    color: '#FF9800',
    description: 'High noise complaints',
    icon: '📢'
  },
  very_noisy: {
    label: 'Very Noisy',
    level: 5,
    color: '#F44336',
    description: 'Very high noise complaints',
    icon: '📢'
  }
} as const;

// NYC Boroughs
export const NYC_BOROUGHS = [
  { name: 'Manhattan', code: 'MN', color: '#FF6B6B' },
  { name: 'Brooklyn', code: 'BK', color: '#4ECDC4' },
  { name: 'Queens', code: 'QN', color: '#45B7D1' },
  { name: 'Bronx', code: 'BX', color: '#96CEB4' },
  { name: 'Staten Island', code: 'SI', color: '#FECA57' }
] as const;

// Default Map Settings
export const DEFAULT_MAP_CENTER = {
  lat: 40.7128,
  lng: -74.0060
};

export const DEFAULT_MAP_ZOOM = 12;

// Search Configuration
export const SEARCH_RADIUS_OPTIONS = [
  { value: 0.25, label: '0.25 miles' },
  { value: 0.5, label: '0.5 miles' },
  { value: 1, label: '1 mile' },
  { value: 2, label: '2 miles' },
  { value: 5, label: '5 miles' },
  { value: 10, label: '10 miles' }
] as const;

// Accessibility Feature Labels
export const ACCESSIBILITY_LABELS = {
  wheelchairAccessible: 'Wheelchair Accessible',
  elevatorAccess: 'Elevator Access',
  accessibleRestrooms: 'Accessible Restrooms',
  quietHours: 'Quiet Hours',
  sensoryFriendly: 'Sensory Friendly',
  assistiveListening: 'Assistive Listening',
  brailleSignage: 'Braille Signage',
  accessibleParking: 'Accessible Parking'
} as const;

// API Endpoints (for future use)
export const API_ENDPOINTS = {
  locations: '/api/locations',
  reviews: '/api/reviews',
  users: '/api/users',
  search: '/api/search',
  noiseComplaints: '/api/noise-complaints',
  analytics: '/api/analytics'
} as const;

// Form Validation Rules
export const VALIDATION_RULES = {
  review: {
    title: { minLength: 5, maxLength: 100 },
    content: { minLength: 10, maxLength: 1000 },
    rating: { min: 1, max: 5 }
  },
  location: {
    name: { minLength: 2, maxLength: 100 },
    address: { minLength: 5, maxLength: 200 },
    description: { maxLength: 500 }
  }
} as const;

// Date and Time Utilities
export const TIME_FORMATS = {
  display: 'h:mm A',
  api: 'HH:mm',
  date: 'YYYY-MM-DD',
  datetime: 'YYYY-MM-DD HH:mm:ss'
} as const;

// Rating Scales
export const RATING_SCALES = {
  overall: { min: 1, max: 5, step: 1 },
  noise: { min: 1, max: 5, step: 1 },
  accessibility: { min: 1, max: 5, step: 1 }
} as const;

// File Upload Limits
export const UPLOAD_LIMITS = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  maxFiles: 5,
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
} as const;

// Cache Keys (for future use with caching)
export const CACHE_KEYS = {
  locations: 'locations',
  reviews: 'reviews',
  userProfile: 'user-profile',
  searchResults: 'search-results',
  noiseData: 'noise-data'
} as const;
