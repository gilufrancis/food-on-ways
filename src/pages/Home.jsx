import { useState } from 'react';
import { useRestaurants } from '../context/RestaurantContext';
import RestaurantCard from '../components/RestaurantCard';
import PageWrapper from '../components/PageWrapper';

const BRAND = 'linear-gradient(135deg, #ff5c28 0%, #ff7d45 100%)';

export default function Home() {
  const { restaurants } = useRestaurants();
  const [query, setQuery]   = useState('');
  const [filter, setFilter] = useState('all');

  const total         = restaurants.length;
  const visitedCount  = restaurants.filter(r => r.status === 'visited').length;
  const wishlistCount = restaurants.filter(r => r.status === 'wishlist').length;

  const filtered = restaurants.filter(r => {
    const ok = filter === 'all' || r.status === filter;
    const q  = query.toLowerCase();
    return ok && (!q || r.name.toLowerCase().includes(q) ||
      r.cuisine?.toLowerCase().includes(q) || r.location?.toLowerCase().includes(q));
  });

  const TABS = [
    { key: 'all',      label: 'All',     count: total },
    { key: 'wishlist', label: 'Wishlist', count: wishlistCount },
    { key: 'visited',  label: 'Visited',  count: visitedCount },
  ];

  return (
    <PageWrapper>

      {/* ── Full-bleed hero banner ── */}
      <div className="text-white" style={{ background: BRAND }}>
        <div className="px-4 pt-6 pb-7">
          <p className="text-sm font-medium" style={{ opacity: 0.8 }}>Good taste, great places</p>
          <h1 className="text-[26px] font-extrabold tracking-tight mt-0.5 mb-5">My Restaurants</h1>

          {/* Stat row */}
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { label: 'Saved',    value: total },
              { label: 'Visited',  value: visitedCount },
              { label: 'Wishlist', value: wishlistCount },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="rounded-2xl py-3 text-center"
                style={{ backgroundColor: 'rgba(0,0,0,0.15)' }}
              >
                <p className="text-2xl font-extrabold leading-none">{value}</p>
                <p className="text-xs font-semibold mt-1" style={{ opacity: 0.8 }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Search & filters ── */}
      <div className="px-4 pt-4 pb-1">
        {/* Search */}
        <div className="relative mb-3">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="search" value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by name, cuisine, location…"
            className="w-full bg-white rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none"
            style={{
              paddingLeft: 44, paddingRight: query ? 44 : 16,
              height: 50, fontSize: 15,
              border: '1.5px solid #e8e8e8',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-bold"
            >×</button>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {TABS.map(({ key, label, count }) => {
            const active = filter === key;
            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className="shrink-0 flex items-center gap-2 rounded-2xl font-semibold transition-all"
                style={{
                  height: 40, paddingLeft: 14, paddingRight: 14, fontSize: 14,
                  background: active ? BRAND : '#fff',
                  color: active ? '#fff' : '#6b7280',
                  border: active ? 'none' : '1.5px solid #e8e8e8',
                  boxShadow: active ? '0 3px 10px rgba(255,92,40,0.3)' : 'none',
                }}
              >
                {label}
                <span
                  className="rounded-full flex items-center justify-center font-bold"
                  style={{
                    minWidth: 20, height: 20, fontSize: 11, padding: '0 4px',
                    backgroundColor: active ? 'rgba(255,255,255,0.25)' : '#f3f4f6',
                    color: active ? '#fff' : '#9ca3af',
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Card list ── */}
      <div className="px-4 pt-3">
        {filtered.length === 0 ? (
          <EmptyState query={query} filter={filter} />
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map(r => <RestaurantCard key={r.id} restaurant={r} />)}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}

function EmptyState({ query, filter }) {
  const icon  = query ? '🔍' : filter === 'wishlist' ? '❤️' : filter === 'visited' ? '✅' : '🍽️';
  const title = query ? 'No results found'
    : filter === 'wishlist' ? 'Wishlist is empty'
    : filter === 'visited'  ? 'No visited places yet'
    : 'No restaurants yet';
  const sub   = query ? `Nothing matched "${query}"`
    : 'Tap + Add to save your first restaurant';

  return (
    <div className="flex flex-col items-center text-center py-16 px-4">
      <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-4" style={{ backgroundColor: '#f3f4f6' }}>
        {icon}
      </div>
      <p className="text-gray-800 font-bold text-lg">{title}</p>
      <p className="text-gray-400 text-sm mt-2 leading-relaxed">{sub}</p>
    </div>
  );
}
