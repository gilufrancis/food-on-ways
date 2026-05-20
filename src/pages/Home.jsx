import { useState } from 'react';
import { useRestaurants } from '../context/RestaurantContext';
import RestaurantCard from '../components/RestaurantCard';
import PageWrapper from '../components/PageWrapper';

const BRAND = 'linear-gradient(135deg, #ff5c28 0%, #ff7d45 100%)';

export default function Home() {
  const { restaurants } = useRestaurants();
  const [query, setQuery]   = useState('');
  const [filter, setFilter] = useState('all');

  const total        = restaurants.length;
  const visitedCount = restaurants.filter(r => r.status === 'visited').length;
  const wishlistCount= restaurants.filter(r => r.status === 'wishlist').length;

  const filtered = restaurants.filter(r => {
    const matchFilter = filter === 'all' || r.status === filter;
    const q = query.toLowerCase();
    const matchQuery = !q ||
      r.name.toLowerCase().includes(q) ||
      r.cuisine?.toLowerCase().includes(q) ||
      r.location?.toLowerCase().includes(q);
    return matchFilter && matchQuery;
  });

  const TABS = [
    { key: 'all',      label: 'All',      count: total },
    { key: 'wishlist', label: 'Wishlist',  count: wishlistCount },
    { key: 'visited',  label: 'Visited',   count: visitedCount },
  ];

  return (
    <PageWrapper>

      {/* ── Stats banner ── */}
      <div className="rounded-3xl p-5 mb-5 text-white" style={{ background: BRAND }}>
        <p className="text-sm font-medium opacity-75 mb-1">Good taste, great places</p>
        <h1 className="text-2xl font-extrabold tracking-tight mb-5">My Restaurants</h1>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Saved',    value: total,         bg: 'rgba(255,255,255,0.18)' },
            { label: 'Visited',  value: visitedCount,  bg: 'rgba(255,255,255,0.18)' },
            { label: 'Wishlist', value: wishlistCount, bg: 'rgba(255,255,255,0.18)' },
          ].map(({ label, value, bg }) => (
            <div key={label} className="rounded-2xl text-center py-3" style={{ backgroundColor: bg }}>
              <p className="text-2xl font-extrabold leading-none">{value}</p>
              <p className="text-xs font-medium opacity-80 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Search bar ── */}
      <div className="relative mb-4">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by name, cuisine, location…"
          className="w-full bg-white rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none"
          style={{
            paddingLeft: 44, paddingRight: 16, height: 52,
            fontSize: 15,
            boxShadow: '0 1px 6px rgba(0,0,0,0.08)',
            border: '1.5px solid transparent',
          }}
          onFocus={e => e.target.style.border = '1.5px solid #ff5c28'}
          onBlur={e => e.target.style.border = '1.5px solid transparent'}
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-bold"
          >
            ×
          </button>
        )}
      </div>

      {/* ── Filter tabs ── */}
      <div className="flex gap-2 mb-5 hide-scrollbar overflow-x-auto">
        {TABS.map(({ key, label, count }) => {
          const active = filter === key;
          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className="shrink-0 flex items-center gap-2 rounded-2xl font-semibold transition-all"
              style={{
                height: 44,
                paddingLeft: 16, paddingRight: 16,
                fontSize: 14,
                background: active ? BRAND : '#fff',
                color: active ? '#fff' : '#6b7280',
                boxShadow: active
                  ? '0 3px 10px rgba(255,92,40,0.35)'
                  : '0 1px 4px rgba(0,0,0,0.07)',
              }}
            >
              {label}
              <span
                className="rounded-full font-bold leading-none flex items-center justify-center"
                style={{
                  minWidth: 22, height: 22, fontSize: 11,
                  backgroundColor: active ? 'rgba(255,255,255,0.28)' : '#f3f4f6',
                  color: active ? '#fff' : '#9ca3af',
                  padding: '0 5px',
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Card list ── */}
      {filtered.length === 0 ? (
        <EmptyState query={query} filter={filter} />
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(r => <RestaurantCard key={r.id} restaurant={r} />)}
        </div>
      )}
    </PageWrapper>
  );
}

function EmptyState({ query, filter }) {
  const icon = query ? '🔍' : filter === 'wishlist' ? '❤️' : filter === 'visited' ? '✅' : '🍽️';
  const title = query
    ? 'No results found'
    : filter === 'wishlist' ? 'Wishlist is empty'
    : filter === 'visited' ? 'No visited places yet'
    : 'No restaurants yet';
  const sub = query
    ? `Nothing matched "${query}"`
    : 'Tap + Add to save a restaurant';

  return (
    <div className="text-center py-16 px-6">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-4"
        style={{ backgroundColor: '#f3f4f6' }}
      >
        {icon}
      </div>
      <p className="text-gray-800 font-bold text-lg">{title}</p>
      <p className="text-gray-400 text-sm mt-2 leading-relaxed">{sub}</p>
    </div>
  );
}
