const STORAGE_KEY = 'foodonways_restaurants';

const SAMPLE_DATA = [
  {
    id: '1',
    emoji: '🍛',
    name: 'Paragon Restaurant',
    cuisine: 'Kerala',
    location: 'Kozhikode, Kerala',
    lat: 11.2588,
    lng: 75.7804,
    status: 'visited',
    rating: 5,
    notes: 'Best biryani in Kozhikode!',
    createdAt: new Date('2025-01-10').toISOString(),
  },
  {
    id: '2',
    emoji: '🦞',
    name: 'Fort House Restaurant',
    cuisine: 'Seafood',
    location: 'Fort Kochi, Kochi',
    lat: 9.9659,
    lng: 76.2423,
    status: 'wishlist',
    rating: null,
    notes: 'Famous for crab and lobster',
    createdAt: new Date('2025-02-15').toISOString(),
  },
  {
    id: '3',
    emoji: '🥘',
    name: 'Dhe Puttu',
    cuisine: 'Traditional Kerala',
    location: 'Thiruvananthapuram, Kerala',
    lat: 8.5241,
    lng: 76.9366,
    status: 'visited',
    rating: 4,
    notes: 'Amazing puttu varieties',
    createdAt: new Date('2025-03-01').toISOString(),
  },
  {
    id: '4',
    emoji: '🍜',
    name: 'Malabar Junction',
    cuisine: 'Malabar',
    location: 'Thrissur, Kerala',
    lat: 10.5276,
    lng: 76.2144,
    status: 'wishlist',
    rating: null,
    notes: 'Authentic Malabar cuisine',
    createdAt: new Date('2025-03-20').toISOString(),
  },
  {
    id: '5',
    emoji: '🍢',
    name: 'Sarovaram Restaurant',
    cuisine: 'Multi-cuisine',
    location: 'Alappuzha, Kerala',
    lat: 9.4981,
    lng: 76.3388,
    status: 'wishlist',
    rating: null,
    notes: 'Backwaters dining experience',
    createdAt: new Date('2025-04-05').toISOString(),
  },
];

export function loadRestaurants() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
    // First time — seed with sample data
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_DATA));
    return SAMPLE_DATA;
  } catch {
    return SAMPLE_DATA;
  }
}

export function saveRestaurants(restaurants) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(restaurants));
  } catch {
    // storage might be full — silently fail
  }
}
