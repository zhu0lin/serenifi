// Core Location Data Model
export interface Location {
  id: string;
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  type: LocationType;
  quietLevel: QuietLevel;
  accessibility: AccessibilityFeatures;
  hours: OperatingHours;
  description?: string;
  photos?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Location Types
export type LocationType = 
  | 'library'
  | 'park'
  | 'pops' // Privately Owned Public Space
  | 'cafe'
  | 'coworking'
  | 'bookstore'
  | 'museum'
  | 'other';

// Quiet Level Rating (based on noise complaint data analysis)
export type QuietLevel = 
  | 'very_quiet'    // 1 - Minimal noise complaints
  | 'quiet'         // 2 - Low noise complaints  
  | 'moderate'      // 3 - Some noise complaints
  | 'noisy'         // 4 - High noise complaints
  | 'very_noisy';   // 5 - Very high noise complaints

// Accessibility Features
export interface AccessibilityFeatures {
  wheelchairAccessible: boolean;
  elevatorAccess: boolean;
  accessibleRestrooms: boolean;
  quietHours: boolean;
  sensoryFriendly: boolean;
  assistiveListening: boolean;
  brailleSignage: boolean;
  accessibleParking: boolean;
  details?: string; // Additional accessibility information
}

// Operating Hours
export interface OperatingHours {
  monday?: TimeRange;
  tuesday?: TimeRange;
  wednesday?: TimeRange;
  thursday?: TimeRange;
  friday?: TimeRange;
  saturday?: TimeRange;
  sunday?: TimeRange;
  specialHours?: SpecialHours[];
}

export interface TimeRange {
  open: string; // HH:MM format
  close: string; // HH:MM format
  isClosed?: boolean;
}

export interface SpecialHours {
  date: string; // YYYY-MM-DD format
  hours: TimeRange;
  description?: string;
}

// 311 Noise Complaint Data
export interface NoiseComplaint {
  id: string;
  complaintId: string;
  location: {
    lat: number;
    lng: number;
    address: string;
    borough: string;
  };
  complaintType: string;
  description: string;
  createdDate: Date;
  status: 'Open' | 'Closed' | 'Pending';
  resolutionDescription?: string;
  closedDate?: Date;
}

// Community Reviews
export interface Review {
  id: string;
  locationId: string;
  userId: string;
  rating: number; // 1-5 stars
  noiseLevel: QuietLevel;
  title: string;
  content: string;
  photos?: string[];
  accessibilityRating?: number; // 1-5 stars for accessibility
  helpfulCount: number;
  createdAt: Date;
  updatedAt: Date;
  isVerified: boolean; // Verified visit
}

// User Profile
export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  avatar?: string;
  preferences: UserPreferences;
  accessibilityNeeds?: string[];
  joinDate: Date;
  reviewCount: number;
  helpfulVotes: number;
}

// User Preferences
export interface UserPreferences {
  defaultSearchRadius: number; // in miles
  preferredLocationTypes: LocationType[];
  accessibilityRequirements: AccessibilityFeatures;
  notifications: {
    newReviews: boolean;
    quietSpotAlerts: boolean;
    weeklyDigest: boolean;
  };
}

// Search and Filter Models
export interface SearchFilters {
  locationTypes?: LocationType[];
  quietLevels?: QuietLevel[];
  accessibility?: Partial<AccessibilityFeatures>;
  radius?: number; // in miles
  openNow?: boolean;
  hasReviews?: boolean;
  minRating?: number;
}

export interface SearchResult {
  location: Location;
  distance?: number; // in miles
  relevanceScore: number;
  reviewSummary?: {
    averageRating: number;
    totalReviews: number;
    latestReview?: Review;
  };
}

// Map and Navigation
export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface MapState {
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
  bounds?: MapBounds;
}

// API Response Models
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface LocationSearchResponse {
  locations: SearchResult[];
  totalCount: number;
  searchTime: number;
  suggestions?: string[];
}

// Error Models
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

// Form Models
export interface LocationSubmissionForm {
  name: string;
  address: string;
  type: LocationType;
  description?: string;
  photos?: File[];
  accessibility: AccessibilityFeatures;
  hours: OperatingHours;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface ReviewForm {
  locationId: string;
  rating: number;
  noiseLevel: QuietLevel;
  title: string;
  content: string;
  photos?: File[];
  accessibilityRating?: number;
}

// Analytics and Insights
export interface LocationAnalytics {
  locationId: string;
  totalViews: number;
  totalSearches: number;
  averageRating: number;
  totalReviews: number;
  noiseComplaintTrend: {
    period: string;
    count: number;
  }[];
  popularHours: {
    hour: number;
    visits: number;
  }[];
}

export interface BoroughStats {
  borough: string;
  totalLocations: number;
  averageQuietLevel: QuietLevel;
  topLocationTypes: {
    type: LocationType;
    count: number;
  }[];
  noiseComplaintDensity: number; // complaints per square mile
}

// Re-export utility types and constants
export * from './constants';
export * from './utils';
