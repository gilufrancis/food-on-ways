import { useRestaurants } from '../context/RestaurantContext';
import PageWrapper from '../components/PageWrapper';

const BRAND = 'linear-gradient(135deg, #ff5c28 0%, #ff7d45 100%)';

export default function Profile() {
  const { restaurants } = useRestaurants();

  const total    = restaurants.length;
  const visited  = restaurants.filter(r => r.status === 'visited').length;
  const wishlist = restaurants.filter(r => r.status === 'wishlist').length;

  const cuisineCounts = {};
  restaurants.forEach(r => {
    if (r.cuisine) cuisineCounts[r.cuisine] = (cuisineCounts[r.cuisine] || 0) + 1;
  });
  const favCuisine = Object.entries(cuisineCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';

  const rated = restaurants.filter(r => r.status === 'visited' && r.rating);
  const avgRating = rated.length
    ? (rated.reduce((s, r) => s + r.rating, 0) / rated.length).toFixed(1)
    : null;

  const recent = [...restaurants]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  return (
    <PageWrapper>
      {/* ── Hero ── */}
      <div className="rounded-3xl p-5 mb-6 text-white" style={{ background: BRAND }}>
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0"
            style={{ backgroundColor: 'rgba(255,255,255,0.22)' }}
          >
            🍽️
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xl font-extrabold leading-tight">Food Explorer</p>
            <p className="text-sm opacity-75 mt-0.5">Discovering great food</p>
          </div>
        </div>

        {/* Inline stat strip */}
        <div className="grid grid-cols-3 gap-2 mt-5">
          {[
            { label: 'Saved',   value: total },
            { label: 'Visited', value: visited },
            { label: 'Wishlist',value: wishlist },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="rounded-2xl py-3 text-center"
              style={{ backgroundColor: 'rgba(255,255,255,0.18)' }}
            >
              <p className="text-2xl font-extrabold leading-none">{value}</p>
              <p className="text-xs font-medium opacity-80 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Highlights row ── */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <HighlightCard
          icon="🍴" label="Favourite Cuisine" value={favCuisine}
          bg="#fff7ed" color="#c2410c"
        />
        <HighlightCard
          icon="⭐" label="Avg. Rating" value={avgRating ? `${avgRating}/5` : '—'}
          bg="#fefce8" color="#a16207"
        />
      </div>

      {/* ── Recently added ── */}
      <SectionLabel>Recently Added</SectionLabel>
      {recent.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-10">No restaurants yet</p>
      ) : (
        <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.07)' }}>
          {recent.map((r, i) => {
            const isVisited = r.status === 'visited';
            return (
              <div
                key={r.id}
                className="flex items-center gap-3 px-4"
                style={{
                  minHeight: 68,
                  borderTop: i !== 0 ? '1px solid #f3f4f6' : 'none',
                }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
                  style={{ backgroundColor: isVisited ? '#f0fdf4' : '#fff7ed' }}
                >
                  {r.emoji}
                </div>
                <div className="flex-1 min-w-0 py-3">
                  <p className="font-semibold text-gray-900 truncate" style={{ fontSize: 15 }}>{r.name}</p>
                  <p className="text-xs text-gray-400 truncate mt-0.5">
                    {r.location ? `${r.location} · ` : ''}
                    {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <span
                  className="shrink-0 text-xs font-semibold rounded-full px-2.5 py-1"
                  style={{
                    backgroundColor: isVisited ? '#dcfce7' : '#ffedd5',
                    color: isVisited ? '#15803d' : '#c2410c',
                    whiteSpace: 'nowrap',
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

function HighlightCard({ icon, label, value, bg, color }) {
  return (
    <div
      className="rounded-2xl p-4"
      style={{ backgroundColor: bg, boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}
    >
      <span className="text-2xl">{icon}</span>
      <p className="font-extrabold text-xl mt-2 leading-tight" style={{ color }}>
        {value}
      </p>
      <p className="text-xs text-gray-500 font-medium mt-0.5">{label}</p>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">{children}</p>
  );
}
