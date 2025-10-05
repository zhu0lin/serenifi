# TypeScript Type Definitions

This directory contains comprehensive TypeScript type definitions for the Quiet Spaces NYC application.

## File Structure

- `index.ts` - Main type definitions for core data models
- `constants.ts` - Configuration constants and display mappings
- `utils.ts` - Utility types and helper definitions

## Core Data Models

### Location
The central data model representing a quiet space in NYC.

```typescript
import { Location, LocationType, QuietLevel } from './types';

const library: Location = {
  id: 'loc_123',
  name: 'NYPL - Stephen A. Schwarzman Building',
  address: '476 5th Ave, New York, NY 10018',
  coordinates: { lat: 40.7532, lng: -73.9822 },
  type: 'library',
  quietLevel: 'very_quiet',
  accessibility: {
    wheelchairAccessible: true,
    elevatorAccess: true,
    accessibleRestrooms: true,
    quietHours: true,
    sensoryFriendly: false,
    assistiveListening: true,
    brailleSignage: true,
    accessibleParking: false
  },
  hours: {
    monday: { open: '10:00', close: '20:00' },
    tuesday: { open: '10:00', close: '20:00' },
    // ... other days
  },
  createdAt: new Date(),
  updatedAt: new Date()
};
```

### Review
Community-generated reviews for locations.

```typescript
import { Review, QuietLevel } from './types';

const review: Review = {
  id: 'rev_456',
  locationId: 'loc_123',
  userId: 'user_789',
  rating: 5,
  noiseLevel: 'very_quiet',
  title: 'Perfect study environment',
  content: 'Great lighting, comfortable seating, and very quiet atmosphere.',
  helpfulCount: 12,
  createdAt: new Date(),
  updatedAt: new Date(),
  isVerified: true
};
```

### Search Filters
Configuration for filtering and searching locations.

```typescript
import { SearchFilters, LocationType, QuietLevel } from './types';

const filters: SearchFilters = {
  locationTypes: ['library', 'cafe'],
  quietLevels: ['very_quiet', 'quiet'],
  accessibility: {
    wheelchairAccessible: true,
    quietHours: true
  },
  radius: 2,
  openNow: true,
  minRating: 4
};
```

## Location Types

The app supports various types of quiet spaces:

- `library` - Public and private libraries
- `park` - Public parks and green spaces  
- `pops` - Privately Owned Public Spaces
- `cafe` - Coffee shops and cafés
- `coworking` - Coworking spaces
- `bookstore` - Independent and chain bookstores
- `museum` - Museums and cultural institutions
- `other` - Other quiet spaces

## Quiet Levels

Based on NYC 311 noise complaint data analysis:

- `very_quiet` - Minimal noise complaints (Level 1)
- `quiet` - Low noise complaints (Level 2)
- `moderate` - Some noise complaints (Level 3)
- `noisy` - High noise complaints (Level 4)
- `very_noisy` - Very high noise complaints (Level 5)

## Accessibility Features

Comprehensive accessibility information:

```typescript
interface AccessibilityFeatures {
  wheelchairAccessible: boolean;
  elevatorAccess: boolean;
  accessibleRestrooms: boolean;
  quietHours: boolean;
  sensoryFriendly: boolean;
  assistiveListening: boolean;
  brailleSignage: boolean;
  accessibleParking: boolean;
  details?: string; // Additional information
}
```

## API Response Models

Standardized API response structure:

```typescript
import { ApiResponse, LocationSearchResponse } from './types';

const response: ApiResponse<LocationSearchResponse> = {
  data: {
    locations: [...],
    totalCount: 42,
    searchTime: 150,
    suggestions: ['libraries near me', 'quiet cafes']
  },
  success: true,
  message: 'Search completed successfully',
  pagination: {
    page: 1,
    limit: 20,
    total: 42,
    hasNext: true,
    hasPrev: false
  }
};
```

## Constants and Configuration

### Location Type Configuration
```typescript
import { LOCATION_TYPE_CONFIG } from './types/constants';

const libraryConfig = LOCATION_TYPE_CONFIG.library;
// {
//   label: 'Library',
//   icon: '📚',
//   color: '#4A90E2',
//   description: 'Public and private libraries'
// }
```

### Quiet Level Configuration
```typescript
import { QUIET_LEVEL_CONFIG } from './types/constants';

const quietConfig = QUIET_LEVEL_CONFIG.very_quiet;
// {
//   label: 'Very Quiet',
//   level: 1,
//   color: '#4CAF50',
//   description: 'Minimal noise complaints',
//   icon: '🔇'
// }
```

## Utility Types

### Form Models
```typescript
import { LocationSubmissionForm, ReviewForm } from './types';

const locationForm: LocationSubmissionForm = {
  name: 'New Quiet Space',
  address: '123 Main St, New York, NY',
  type: 'cafe',
  accessibility: {
    wheelchairAccessible: true,
    // ... other features
  },
  hours: {
    monday: { open: '07:00', close: '18:00' }
    // ... other days
  }
};
```

### Search Context
```typescript
import { SearchContext, SortOption, SortDirection } from './types';

const searchContext: SearchContext = {
  query: 'libraries',
  filters: {
    location_type: ['library'],
    quiet_level: ['very_quiet', 'quiet']
  },
  sort: {
    field: 'distance',
    direction: 'asc'
  },
  pagination: {
    page: 1,
    limit: 20
  }
};
```

## Usage Examples

### Creating a New Location
```typescript
import { Location, LocationType } from './types';

const createLocation = (data: Partial<Location>): Location => {
  return {
    id: generateId(),
    name: data.name || '',
    address: data.address || '',
    coordinates: data.coordinates || { lat: 0, lng: 0 },
    type: data.type || 'other',
    quietLevel: data.quietLevel || 'moderate',
    accessibility: data.accessibility || {
      wheelchairAccessible: false,
      elevatorAccess: false,
      accessibleRestrooms: false,
      quietHours: false,
      sensoryFriendly: false,
      assistiveListening: false,
      brailleSignage: false,
      accessibleParking: false
    },
    hours: data.hours || {},
    createdAt: new Date(),
    updatedAt: new Date()
  };
};
```

### Filtering Locations
```typescript
import { Location, SearchFilters, QuietLevel } from './types';

const filterLocations = (locations: Location[], filters: SearchFilters): Location[] => {
  return locations.filter(location => {
    // Filter by location type
    if (filters.locationTypes && !filters.locationTypes.includes(location.type)) {
      return false;
    }
    
    // Filter by quiet level
    if (filters.quietLevels && !filters.quietLevels.includes(location.quietLevel)) {
      return false;
    }
    
    // Filter by accessibility features
    if (filters.accessibility) {
      const accessibility = filters.accessibility;
      if (accessibility.wheelchairAccessible && !location.accessibility.wheelchairAccessible) {
        return false;
      }
      // ... other accessibility checks
    }
    
    return true;
  });
};
```

## Best Practices

1. **Always use the provided types** instead of creating custom interfaces for core data models
2. **Use constants** from `constants.ts` for display labels, colors, and configuration
3. **Leverage utility types** for form validation and API responses
4. **Extend types** when needed rather than modifying core interfaces
5. **Use type guards** for runtime type checking when working with external data

## Type Safety

All types are designed to provide maximum type safety:

- Required fields are explicitly marked
- Optional fields use the `?` operator
- Union types restrict values to specific options
- Generic types provide flexibility while maintaining safety
- Utility types help with common transformations

This type system ensures that your application will catch type errors at compile time, reducing runtime bugs and improving developer experience.
