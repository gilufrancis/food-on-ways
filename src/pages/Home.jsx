import { useState } from 'react';
import { useRestaurants } from '../context/RestaurantContext';
import RestaurantCard from '../components/RestaurantCard';
import SearchBar from '../components/SearchBar';
import PageWrapper from '../components/PageWrapper';

export default function Home() {
  const { restaurants } = useRestaurants();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const total = restaurants.length;
  const visitedCount = restaurants.filter((r) => r.status === 'visited').length;
  const wishlistCount = restaurants.filter((r) => r.status === 'wishlist').length;

  const filtered = restaurants.filter((r) => {
    const matchesFilter = filter === 'all' || r.status === filter;
    const q = query.toLowerCase();
    const matchesQuery =
      !q ||
      r.name.toLowerCase().includes(q) ||
      r.cuisine?.toLowerCase().includes(q) ||
      r.location?.toLowerCase().includes(q);
    return matchesFilter && matchesQuery;
  });

  const FILTERS = [
    { key: 'all', label: 'All', count: total },
    { key: 'wishlist', label: 'Wishlist', count: wishlistCount },
    { key: 'visited', label: 'Visited', count: visitedCount },
  ];

  return (
    <PageWrapper>
      {/* Stats banner */}
      <div
        className="rounded-2xl p-5 mb-5 text-white"
        style={{ background: 'linear-gradient(135deg, #ff5c28 0%, #ff8c42 100%)' }}
      >
        <p className="text-sm font-medium opacity-80 mb-0.5">Good taste, great places</p>
        <h1 className="text-2xl font-extrabold tracking-tight">My Restaurants</h1>
        <div className="flex gap-4 mt-4">
          <StatChip label="Saved" value={total} />
          <div className="w-px bg-white opacity-20" />
          <StatChip label="Visited" value={visitedCount} />
          <div className="w-px bg-white opacity-20" />
          <StatChip label="Wishlist" value={wishlistCount} />
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <SearchBar value={query} onChange={setQuery} />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-0.5 scrollbar-none">
        {FILTERS.map(({ key, label, count }) => {
          const active = filter === key;
          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className="shrink-0 flex items-center gap-1.5 px-4 rounded-full text-sm font-semibold transition-all"
              style={{
                minHeight: '36px',
                backgroundColor: active ? '#ff5c28' : '#f3f4f6',
                color: active ? '#fff' : '#6b7280',
                boxShadow: active ? '0 2px 8px rgba(255,92,40,0.3)' : 'none',
              }}
            >
              {label}
              <span
                className="text-[11px] font-bold px-1.5 py-0.5 rounded-full leading-none"
                style={{
                  backgroundColor: active ? 'rgba(255,255,255,0.25)' : '#e5e7eb',
                  color: active ? '#fff' : '#9ca3af',
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Card list */}
      {filtered.length === 0 ? (
        <EmptyState query={query} filter={filter} />
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
        </div>
      )}
    </PageWrapper>
  );
}

function StatChip({ label, value }) {
  return (
    <div className="text-center">
      <p className="text-2xl font-extrabold leading-none">{value}</p>
      <p className="text-xs opacity-75 mt-0.5">{label}</p>
    </div>
  );
}

function EmptyState({ query, filter }) {
  return (
    <div className="text-center py-16 px-4">
      <div className="text-6xl mb-4">{query ? '🔍' : '🍽️'}</div>
      <p className="text-gray-700 font-semibold text-lg">
        {query ? 'No results found' : filter !== 'all' ? `No ${filter} restaurants yet` : 'No restaurants yet'}
      </p>
      <p className="text-gray-400 text-sm mt-1.5 max-w-xs mx-auto">
        {query
          ? `Nothing matched "${query}". Try a different search.`
          : 'Tap + Add to save your first restaurant.'}
      </p>
    </div>
  );
}
