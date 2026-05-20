import { useState } from 'react';
import { useRestaurants } from '../context/RestaurantContext';
import RestaurantCard from '../components/RestaurantCard';
import SearchBar from '../components/SearchBar';
import PageWrapper from '../components/PageWrapper';

const FILTERS = ['all', 'wishlist', 'visited'];

export default function Home() {
  const { restaurants } = useRestaurants();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');

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

  return (
    <PageWrapper>
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-900 mb-0.5">My Restaurants</h1>
        <p className="text-sm text-gray-500">{restaurants.length} places saved</p>
      </div>

      <div className="mb-4">
        <SearchBar value={query} onChange={setQuery} />
      </div>

      {/* Filter tabs — scrollable if they overflow on tiny screens */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1 -mx-1 px-1">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`shrink-0 px-4 rounded-full text-sm font-medium transition-colors ${
              filter === f
                ? 'text-white'
                : 'bg-gray-100 text-gray-600 active:bg-gray-200'
            }`}
            style={{
              minHeight: '36px',
              ...(filter === f && { backgroundColor: '#ff5c28' }),
            }}
          >
            {f === 'all' ? 'All' : f === 'wishlist' ? 'Wishlist' : 'Visited'}
            <span className="ml-1.5 text-xs opacity-70">
              {f === 'all'
                ? restaurants.length
                : restaurants.filter((r) => r.status === f).length}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🍽️</div>
          <p className="text-gray-500 font-medium">No restaurants found</p>
          <p className="text-gray-400 text-sm mt-1">Try a different search or filter</p>
        </div>
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
