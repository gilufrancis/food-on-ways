import { useState } from 'react';
import { useRestaurants } from '../context/RestaurantContext';
import MapView from '../components/MapView';

export default function Map() {
  const { restaurants } = useRestaurants();
  const [flyTarget, setFlyTarget] = useState(null);
  const withCoords = restaurants.filter((r) => r.lat != null && r.lng != null);

  return (
    <>
      {/* ── Mobile layout ── */}
      <div className="md:hidden flex flex-col w-full" style={{ minHeight: 'calc(100dvh - 56px)' }}>
        {/* Map: 50% of the dynamic viewport */}
        <div className="relative w-full shrink-0" style={{ height: '50dvh' }}>
          <MapView restaurants={restaurants} flyTarget={flyTarget} />
          <Legend />
        </div>

        {/* Scrollable card list clears the fixed bottom nav */}
        <div
          className="flex-1 bg-white border-t border-gray-100 overflow-y-auto"
          style={{ paddingBottom: 'calc(64px + env(safe-area-inset-bottom))' }}
        >
          <ListHeader count={withCoords.length} />
          <CardList items={withCoords} onSelect={setFlyTarget} />
        </div>
      </div>

      {/* ── Desktop layout ── */}
      <div className="hidden md:flex flex-col w-full" style={{ height: '100dvh' }}>
        <div className="flex-1 relative min-h-0">
          <MapView restaurants={restaurants} flyTarget={flyTarget} />
          <Legend />
        </div>
        <div className="bg-white border-t border-gray-100 shrink-0" style={{ maxHeight: '220px', overflowY: 'auto' }}>
          <ListHeader count={withCoords.length} />
          <CardList items={withCoords} onSelect={setFlyTarget} />
        </div>
      </div>
    </>
  );
}

function Legend() {
  return (
    <div className="absolute top-3 right-3 z-10 bg-white rounded-2xl shadow-md px-3 py-2.5 text-xs flex flex-col gap-2">
      <div className="flex items-center gap-2 font-medium text-gray-600">
        <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: '#ff5c28' }} />
        Wishlist
      </div>
      <div className="flex items-center gap-2 font-medium text-gray-600">
        <span className="w-3 h-3 rounded-full bg-green-500 shrink-0" />
        Visited
      </div>
    </div>
  );
}

function ListHeader({ count }) {
  return (
    <p className="px-4 pt-3 pb-1 text-xs font-bold text-gray-400 uppercase tracking-wider">
      {count} location{count !== 1 ? 's' : ''} on map
    </p>
  );
}

function CardList({ items, onSelect }) {
  if (items.length === 0) {
    return (
      <p className="px-4 py-8 text-sm text-gray-400 text-center">
        No restaurants with coordinates yet. Add lat/lng when creating one.
      </p>
    );
  }
  return (
    <div className="flex flex-col">
      {items.map((r) => {
        const isVisited = r.status === 'visited';
        return (
          <button
            key={r.id}
            onClick={() => onSelect(r)}
            className="flex items-center gap-3 px-4 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left w-full"
            style={{ minHeight: '60px' }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
              style={{ backgroundColor: isVisited ? '#f0fdf4' : '#fff7ed' }}
            >
              {r.emoji}
            </div>
            <div className="flex-1 min-w-0 py-3">
              <p className="text-sm font-bold text-gray-900 truncate">{r.name}</p>
              <p className="text-xs text-gray-400 truncate">{r.location}</p>
            </div>
            <span
              className="text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0"
              style={{
                backgroundColor: isVisited ? '#dcfce7' : '#fff7ed',
                color: isVisited ? '#16a34a' : '#ea580c',
              }}
            >
              {isVisited ? '✓ Visited' : '♡ Wishlist'}
            </span>
          </button>
        );
      })}
    </div>
  );
}
