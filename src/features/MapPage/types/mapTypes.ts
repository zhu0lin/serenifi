
export type PlaceType = "Cafe" | "Library" | "Park" | "Schools";

export type Listing = {
  id: number;
  title: string;
  price: number;
  rating: number;
  image: string;
  location: { lat: number; lng: number };
  type: PlaceType;
};

export const ALL_PLACE_TYPES: PlaceType[] = [
  "Cafe",
  "Library",
  "Park",
  "Schools",
];

export type LatLngLiteral = {
  lat: number;
  lng: number;
};


export const allListings: Listing[] = [
  {
    id: 1,
    title: "Greenwich Village Park View",
    price: 15,
    rating: 4.8,
    image: "https://placehold.co/600x400/38B000/ffffff?text=Park+View",
    location: { lat: 40.75, lng: -73.98 },
    type: "Park",
  },
  {
    id: 2,
    title: "Art High School near Museum Row",
    price: 0,
    rating: 4.6,
    image: "https://placehold.co/600x400/800080/ffffff?text=High+School",
    location: { lat: 40.7712, lng: -73.9742 },
    type: "Schools",
  },
  {
    id: 3,
    title: "The Coffee Bean Cafe",
    price: 8,
    rating: 4.9,
    image: "https://placehold.co/600x400/00A3C9/ffffff?text=Cafe",
    location: { lat: 40.76, lng: -73.95 },
    type: "Cafe",
  },
  {
    id: 4,
    title: "The Book Nook Library",
    price: 15,
    rating: 4.5,
    image: "https://placehold.co/600x400/FFD700/000000?text=Library",
    location: { lat: 40.74, lng: -74.0 },
    type: "Library",
  },
  {
    id: 5,
    title: "Quiet Corner Park",
    price: 150,
    rating: 4.0,
    image: "https://placehold.co/600x400/8A2BE2/ffffff?text=Park+2",
    location: { lat: 40.72, lng: -74.01 },
    type: "Park",
  },
];
