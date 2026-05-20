import { useState } from 'react';
import { useRestaurants } from '../context/RestaurantContext';
import MapView from '../components/MapView';

export default function Map() {
  const { restaurants } = useRestaurants();
  const [flyTarget, setFlyTarget] = useState(null);

  const withCoords = restaurants.filter((r) => r.lat != null && r.lng != null);

  return (
    <>
      {/* ── Mobile layout: map on top, card list scrolls below ── */}
      <div className="md:hidden flex flex-col w-full">
        {/* Fixed-height map on mobile — leaves room for bottom nav (56px) and top bar (52px) */}
        <div className="relative w-full" style={{ height: 'calc(50dvh)' }}>
          <MapView restaurants={restaurants} flyTarget={flyTarget} />
          <Legend />
        </div>

        {/* Scrollable card list — naturally clears the fixed bottom nav */}
        <div
          className="bg-white border-t border-gray-100 overflow-y-auto"
          style={{ paddingBottom: 'calc(56px + env(safe-area-inset-bottom))' }}
        >
          <p className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {withCoords.length} locations on map
          </p>
          <CardList items={withCoords} onSelect={setFlyTarget} />
        </div>
      </div>

      {/* ── Desktop layout: full-height flex column ── */}
      <div
        className="hidden md:flex flex-col w-full"
        style={{ height: '100dvh' }}
      >
        <div className="flex-1 relative min-h-0">
          <MapView restaurants={restaurants} flyTarget={flyTarget} />
          <Legend />
        </div>

        <div className="bg-white border-t border-gray-100 shrink-0" style={{ maxHeight: '220px', overflowY: 'auto' }}>
          <p className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {withCoords.length} locations on map
          </p>
          <CardList items={withCoords} onSelect={setFlyTarget} />
        </div>
      </div>
    </>
  );
}

function Legend() {
  return (
    <div className="absolute top-3 right-3 z-10 bg-white rounded-xl shadow-md px-3 py-2 text-xs flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: '#ff5c28' }} />
        Wishlist
      </div>
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-green-500 shrink-0" />
        Visited
      </div>
    </div>
  );
}

function CardList({ items, onSelect }) {
  if (items.length === 0) {
    return (
      <p className="px-4 py-6 text-sm text-gray-400 text-center">
        No restaurants with coordinates yet. Add lat/lng when creating a restaurant.
      </p>
    );
  }
  return (
    <div className="flex flex-col">
      {items.map((r) => (
        <button
          key={r.id}
          onClick={() => onSelect(r)}
          className="flex items-center gap-3 px-4 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left w-full"
          style={{ minHeight: '56px' }}
        >
          <span className="text-xl shrink-0">{r.emoji}</span>
          <div className="flex-1 min-w-0 py-3">
            <p className="text-sm font-medium text-gray-900 truncate">{r.name}</p>
            <p className="text-xs text-gray-500 truncate">{r.location}</p>
          </div>
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium shrink-0 ${
              r.status === 'visited' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
            }`}
          >
            {r.status === 'visited' ? 'Visited' : 'Wishlist'}
          </span>
        </button>
      ))}
    </div>
  );
}
