import { useRestaurants } from '../context/RestaurantContext';
import PageWrapper from '../components/PageWrapper';

function StatCard({ icon, label, value, color }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-2xl font-bold leading-tight" style={{ color }}>{value}</div>
      <div className="text-xs text-gray-500 mt-0.5">{label}</div>
    </div>
  );
}

export default function Profile() {
  const { restaurants } = useRestaurants();

  const total = restaurants.length;
  const visited = restaurants.filter((r) => r.status === 'visited').length;
  const wishlist = restaurants.filter((r) => r.status === 'wishlist').length;

  const cuisineCounts = {};
  restaurants.forEach((r) => {
    if (r.cuisine) cuisineCounts[r.cuisine] = (cuisineCounts[r.cuisine] || 0) + 1;
  });
  const favCuisine = Object.entries(cuisineCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';

  const recent = [...restaurants]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <PageWrapper>
      {/* Profile header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6 flex items-center gap-4">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center text-2xl shrink-0"
          style={{ backgroundColor: '#ff5c28' }}
        >
          🍽️
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Food Explorer</h1>
          <p className="text-sm text-gray-500">Tracking delicious places</p>
        </div>
      </div>

      {/* Stats */}
      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Stats</h2>
      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard icon="🗂️" label="Total Saved" value={total} color="#6366f1" />
        <StatCard icon="✅" label="Visited" value={visited} color="#22c55e" />
        <StatCard icon="❤️" label="Wishlist" value={wishlist} color="#ff5c28" />
        <StatCard icon="🍴" label="Fav Cuisine" value={favCuisine} color="#f59e0b" />
      </div>

      {/* Recent */}
      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Recently Added</h2>
      {recent.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">No restaurants yet</p>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {recent.map((r, i) => (
            <div
              key={r.id}
              className={`flex items-center gap-3 px-4 ${i !== 0 ? 'border-t border-gray-50' : ''}`}
              style={{ minHeight: '60px' }}
            >
              <span className="text-xl shrink-0">{r.emoji}</span>
              <div className="flex-1 min-w-0 py-3">
                <p className="text-sm font-medium text-gray-900 truncate">{r.name}</p>
                <p className="text-xs text-gray-400 truncate">
                  {r.location} ·{' '}
                  {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium shrink-0 ${
                  r.status === 'visited' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                }`}
              >
                {r.status === 'visited' ? 'Visited' : 'Wishlist'}
              </span>
            </div>
          ))}
        </div>
      )}
    </PageWrapper>
  );
}
