const STORAGE_KEY = 'foodonways_restaurants';
const VERSION_KEY = 'foodonways_version';
const CURRENT_VERSION = '2';

const SAMPLE_DATA = [
  {
    id: 'paragon',
    emoji: '🦀',
    name: 'Paragon',
    cuisine: 'Malabar · Seafood · Biryani',
    location: 'Kannur Road, Kozhikode',
    lat: 11.2588,
    lng: 75.7804,
    status: 'visited',
    rating: 5,
    notes: 'Best biryani in Kozhikode. Pepper crab is a must.',
    createdAt: new Date('2025-01-10').toISOString(),
  },
  {
    id: 'sagar',
    emoji: '🐟',
    name: 'Sagar',
    cuisine: 'Coastal · Seafood',
    location: 'Beach Road, Kozhikode',
    lat: 11.2434,
    lng: 75.7732,
    status: 'wishlist',
    rating: null,
    notes: 'Karimeen pollichathu is the reason to go.',
    createdAt: new Date('2025-02-15').toISOString(),
  },
  {
    id: 'kayees',
    emoji: '🍚',
    name: 'Kayees Rahmathulla',
    cuisine: 'Biryani · Mughlai',
    location: 'Mattancherry, Kochi',
    lat: 9.9629,
    lng: 76.2518,
    status: 'wishlist',
    rating: null,
    notes: 'A 75-year-old institution. Order before noon.',
    createdAt: new Date('2025-02-28').toISOString(),
  },
  {
    id: 'topform',
    emoji: '☕',
    name: 'Topform',
    cuisine: 'Café · Breakfast',
    location: 'Mavoor Road, Kozhikode',
    lat: 11.2614,
    lng: 75.7878,
    status: 'wishlist',
    rating: null,
    notes: 'V60 pour-over + cardamom bun. Sold out by noon.',
    createdAt: new Date('2025-03-01').toISOString(),
  },
  {
    id: 'appammachi',
    emoji: '🥛',
    name: 'Appammachi',
    cuisine: 'Traditional Kerala · Breakfast',
    location: 'Fort Kochi, Kochi',
    lat: 9.9658,
    lng: 76.2421,
    status: 'wishlist',
    rating: null,
    notes: 'Two sisters. Lacy appam with mutton stew. Breakfast only.',
    createdAt: new Date('2025-03-20').toISOString(),
  },
  {
    id: 'moplah',
    emoji: '🍖',
    name: 'Moplah Kitchen',
    cuisine: 'Malabar · Heritage',
    location: 'Kuttichira, Kozhikode',
    lat: 11.2510,
    lng: 75.7750,
    status: 'visited',
    rating: 4,
    notes: 'Mutton Kuzhimanthi. Mutta Mala dessert.',
    createdAt: new Date('2025-04-05').toISOString(),
  },
  {
    id: 'thalassery',
    emoji: '🍛',
    name: 'Thalassery Calling',
    cuisine: 'Malabar · Biryani',
    location: 'MG Road, Thrissur',
    lat: 10.5276,
    lng: 76.2144,
    status: 'wishlist',
    rating: null,
    notes: 'Khaima rice Thalassery biryani from a Thrissur kitchen.',
    createdAt: new Date('2025-04-20').toISOString(),
  },
  {
    id: 'dosadosa',
    emoji: '🫓',
    name: 'Dosa Dosa Dosa',
    cuisine: 'South Indian · Street Food',
    location: 'Palayam, Thiruvananthapuram',
    lat: 8.4855,
    lng: 76.9492,
    status: 'wishlist',
    rating: null,
    notes: '28 dosa variants. Mysore Masala is the gateway.',
    createdAt: new Date('2025-05-01').toISOString(),
  },
];

export function loadRestaurants() {
  try {
    const version = localStorage.getItem(VERSION_KEY);
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw && version === CURRENT_VERSION) return JSON.parse(raw);
    // First time or version bump — reset with fresh seed
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_DATA));
    localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
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
