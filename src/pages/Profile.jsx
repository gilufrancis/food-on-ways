import { useRestaurants } from '../context/RestaurantContext';
import PageWrapper from '../components/PageWrapper';

const STAT_CONFIG = [
  { key: 'total',    icon: '🗂️', label: 'Total Saved',  color: '#6366f1', bg: '#eef2ff' },
  { key: 'visited',  icon: '✅', label: 'Visited',       color: '#16a34a', bg: '#f0fdf4' },
  { key: 'wishlist', icon: '❤️', label: 'Wishlist',      color: '#ea580c', bg: '#fff7ed' },
  { key: 'cuisine',  icon: '🍴', label: 'Fav Cuisine',   color: '#d97706', bg: '#fffbeb' },
];

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

  const statsValues = { total, visited, wishlist, cuisine: favCuisine };

  const recent = [...restaurants]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const visitedRated = restaurants.filter((r) => r.status === 'visited' && r.rating);
  const avgRating = visitedRated.length
    ? (visitedRated.reduce((s, r) => s + r.rating, 0) / visitedRated.length).toFixed(1)
    : null;

  return (
    <PageWrapper>
      {/* Profile hero */}
      <div
        className="rounded-2xl p-5 mb-6 text-white"
        style={{ background: 'linear-gradient(135deg, #ff5c28 0%, #ff8c42 100%)' }}
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center text-3xl shrink-0">
            🍽️
          </div>
          <div>
            <h1 className="text-xl font-extrabold">Food Explorer</h1>
            <p className="text-sm opacity-80 mt-0.5">Discovering great food</p>
            {avgRating && (
              <div className="flex items-center gap-1 mt-2 bg-white bg-opacity-20 rounded-full px-3 py-1 w-fit">
                <span className="text-amber-300">★</span>
                <span className="text-sm font-bold">{avgRating} avg rating</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Overview</h2>
      <div className="grid grid-cols-2 gap-3 mb-7">
        {STAT_CONFIG.map(({ key, icon, label, color, bg }) => (
          <div
            key={key}
            className="rounded-2xl p-4 shadow-sm"
            style={{ backgroundColor: bg, border: `1px solid ${color}20` }}
          >
            <span className="text-2xl">{icon}</span>
            <p className="text-2xl font-extrabold mt-1 leading-none" style={{ color }}>
              {statsValues[key]}
            </p>
            <p className="text-xs text-gray-500 font-medium mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Recently added */}
      <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Recently Added</h2>
      {recent.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">No restaurants yet</p>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          {recent.map((r, i) => {
            const isVisited = r.status === 'visited';
            return (
              <div
                key={r.id}
                className={`flex items-center gap-3 px-4 ${i !== 0 ? 'border-t border-gray-50' : ''}`}
                style={{ minHeight: '64px' }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                  style={{ backgroundColor: isVisited ? '#f0fdf4' : '#fff7ed' }}
                >
                  {r.emoji}
                </div>
                <div className="flex-1 min-w-0 py-3">
                  <p className="text-sm font-bold text-gray-900 truncate">{r.name}</p>
                  <p className="text-xs text-gray-400 truncate mt-0.5">
                    {r.location && `${r.location} · `}
                    {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </p>
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
              </div>
            );
          })}
        </div>
      )}
    </PageWrapper>
  );
}
