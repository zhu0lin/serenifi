// Import types for use in type definitions
// import type { LocationType, QuietLevel } from './index';

// Utility Types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type NonEmptyArray<T> = [T, ...T[]];

// API Status Types
export type ApiStatus = 'idle' | 'loading' | 'success' | 'error';

// Sort Options
export type SortOption = 
  | 'distance'
  | 'rating'
  | 'quiet_level'
  | 'recent'
  | 'popular'
  | 'name';

export type SortDirection = 'asc' | 'desc';

// Filter Types
export type FilterType = 
  | 'location_type'
  | 'quiet_level'
  | 'accessibility'
  | 'rating'
  | 'distance'
  | 'open_now';

// View Modes
export type ViewMode = 'map' | 'list' | 'grid';

// Notification Types
export type NotificationType = 
  | 'success'
  | 'error'
  | 'warning'
  | 'info';

// User Roles
export type UserRole = 'guest' | 'user' | 'moderator' | 'admin';

// Review Status
export type ReviewStatus = 'pending' | 'approved' | 'rejected' | 'flagged';

// Location Status
export type LocationStatus = 'active' | 'inactive' | 'pending' | 'rejected';

// Data Quality Indicators
export type DataQuality = 'high' | 'medium' | 'low';

// Time Periods for Analytics
export type TimePeriod = 
  | 'hour'
  | 'day'
  | 'week'
  | 'month'
  | 'quarter'
  | 'year';

// Search Context
export interface SearchContext {
  query?: string;
  filters: Partial<Record<FilterType, any>>;
  sort: {
    field: SortOption;
    direction: SortDirection;
  };
  pagination: {
    page: number;
    limit: number;
  };
}

// Geolocation Types
export interface GeolocationPosition {
  coords: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  timestamp: number;
}

export interface GeolocationError {
  code: number;
  message: string;
}

// Map Interaction Types
export type MapInteraction = 
  | 'pan'
  | 'zoom'
  | 'click'
  | 'drag'
  | 'hover';

// Feature Flags (for future A/B testing)
export interface FeatureFlags {
  enableCommunityReviews: boolean;
  enablePhotoUploads: boolean;
  enableRealTimeUpdates: boolean;
  enableAdvancedFilters: boolean;
  enableAccessibilityMode: boolean;
  enableDarkMode: boolean;
}

// Performance Metrics
export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  apiResponseTime: number;
  userInteractionTime: number;
}

// Analytics Events
export type AnalyticsEvent = 
  | 'search_performed'
  | 'location_viewed'
  | 'review_submitted'
  | 'filter_applied'
  | 'map_interaction'
  | 'user_registration'
  | 'location_submitted';

export interface AnalyticsEventData {
  event: AnalyticsEvent;
  properties: Record<string, any>;
  timestamp: Date;
  userId?: string;
  sessionId: string;
}

// Error Types
export type ErrorCode = 
  | 'NETWORK_ERROR'
  | 'VALIDATION_ERROR'
  | 'AUTHENTICATION_ERROR'
  | 'AUTHORIZATION_ERROR'
  | 'NOT_FOUND'
  | 'RATE_LIMIT_EXCEEDED'
  | 'SERVER_ERROR'
  | 'GEOLOCATION_ERROR';

// Form Field Types
export type FormFieldType = 
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'radio'
  | 'textarea'
  | 'file'
  | 'date'
  | 'time';

// Validation Result
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// Pagination Info
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Location Cluster (for map clustering)
export interface LocationCluster {
  id: string;
  center: {
    lat: number;
    lng: number;
  };
  locations: string[]; // Location IDs
  count: number;
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

// Search Suggestions
export interface SearchSuggestion {
  id: string;
  text: string;
  type: 'location' | 'neighborhood' | 'landmark';
  location?: {
    lat: number;
    lng: number;
  };
  popularity?: number;
}

// Keyboard Shortcuts
export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  action: string;
  description: string;
}

// Theme Configuration
export interface ThemeConfig {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  warning: string;
  success: string;
  info: string;
}

// Responsive Breakpoints
export interface BreakpointConfig {
  xs: number; // 0px
  sm: number; // 576px
  md: number; // 768px
  lg: number; // 992px
  xl: number; // 1200px
  xxl: number; // 1400px
}

// Export commonly used type unions
export type LocationTypeKeys = keyof typeof import('./constants').LOCATION_TYPE_CONFIG;
export type QuietLevelKeys = keyof typeof import('./constants').QUIET_LEVEL_CONFIG;

// Helper type for extracting enum values
export type EnumValues<T> = T[keyof T];

// Helper type for creating readonly arrays
export type ReadonlyArray<T> = readonly T[];

// Helper type for deep partial
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Helper type for making specific properties required
export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Helper type for making specific properties optional
export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
