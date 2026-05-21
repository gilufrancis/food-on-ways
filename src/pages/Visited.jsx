import { useRestaurants } from '../context/RestaurantContext';
import RestaurantCard from '../components/RestaurantCard';
import PageWrapper from '../components/PageWrapper';

const CUISINES = [
  { id: 'kerala',   label: 'Kerala',       emoji: '🥛' },
  { id: 'malabar',  label: 'Malabar',      emoji: '🍛' },
  { id: 'seafood',  label: 'Seafood',      emoji: '🐟' },
  { id: 'street',   label: 'Street Food',  emoji: '🫓' },
  { id: 'biryani',  label: 'Biryani',      emoji: '🍚' },
  { id: 'south',    label: 'South Indian', emoji: '🥘' },
  { id: 'coastal',  label: 'Coastal',      emoji: '🌊' },
  { id: 'cafe',     label: 'Café',         emoji: '☕' },
];

export default function Visited() {
  const { restaurants } = useRestaurants();
  const visited = restaurants.filter(r => r.status === 'visited');

  const rated = visited.filter(r => r.rating);
  const avgRating = rated.length
    ? (rated.reduce((s, r) => s + r.rating, 0) / rated.length).toFixed(1)
    : null;

  const cities = new Set(visited.map(r => r.location?.split(',')[1]?.trim() || r.location?.split(',')[0]?.trim()).filter(Boolean)).size;

  /* Which cuisine stamps are unlocked */
  const unlockedCuisines = new Set(
    visited.flatMap(r => (r.cuisine || '').split('·').map(c => c.trim().toLowerCase()))
  );

  return (
    <PageWrapper>
      {/* Header */}
      <div className="px-4 pt-5 pb-4">
        <p className="t-caps mb-2" style={{ color: 'var(--ink-3)' }}>Your food diary</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 500, letterSpacing: '-0.02em', color: 'var(--ink)', lineHeight: 1.05 }}>
          Where I've <em style={{ color: 'var(--green)' }}>eaten</em>
        </h1>
      </div>

      {/* Stats trio */}
      {visited.length > 0 && (
        <div className="grid grid-cols-3 gap-2.5 px-4">
          {[
            { label: 'Visited',  value: visited.length, color: 'var(--orange)' },
            { label: 'Cities',   value: cities,          color: 'var(--green)' },
            { label: 'Avg ★',    value: avgRating || '—', color: 'var(--amber)' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', padding: '14px 0', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 600, color, letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</p>
              <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-3)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Cuisine passport */}
      {visited.length > 0 && (
        <div className="px-4 pt-6">
          <p className="t-caps mb-3" style={{ color: 'var(--ink-3)' }}>Cuisine passport</p>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {CUISINES.map(c => {
              const unlocked = unlockedCuisines.has(c.label.toLowerCase()) ||
                [...unlockedCuisines].some(u => u.includes(c.id));
              return (
                <div
                  key={c.id}
                  style={{
                    width: 80, minHeight: 92, borderRadius: 'var(--r-lg)', flexShrink: 0,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
                    padding: '10px 6px',
                    backgroundColor: unlocked ? 'var(--surface)' : 'var(--surface-2)',
                    border: unlocked ? '2px solid var(--ink)' : '2px dashed var(--line)',
                    opacity: unlocked ? 1 : 0.55,
                  }}
                >
                  <span style={{ fontSize: 26 }}>{unlocked ? c.emoji : '?'}</span>
                  <p style={{ fontSize: 10, fontWeight: 600, color: unlocked ? 'var(--ink)' : 'var(--ink-4)', textAlign: 'center', lineHeight: 1.2, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {c.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Diary list */}
      {visited.length === 0 ? (
        <div className="flex flex-col items-center text-center py-16 px-6">
          <div style={{ width: 80, height: 80, borderRadius: 'var(--r-xl)', backgroundColor: 'var(--green-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, marginBottom: 16 }}>
            ✅
          </div>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 500, color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: 8 }}>
            No <em style={{ color: 'var(--green)' }}>visited</em> places yet
          </p>
          <p style={{ fontSize: 14, color: 'var(--ink-3)', lineHeight: 1.5, maxWidth: 260 }}>
            Open any wishlist restaurant and mark it as visited
          </p>
        </div>
      ) : (
        <div className="px-4 pt-6 flex flex-col gap-2.5">
          {visited.map(r => <RestaurantCard key={r.id} restaurant={r} showRating />)}
        </div>
      )}
    </PageWrapper>
  );
}
