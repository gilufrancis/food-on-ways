import { useNavigate } from 'react-router-dom';
import { useRestaurants } from '../context/RestaurantContext';
import PageWrapper from '../components/PageWrapper';

const SETTINGS = [
  { icon: '🔔', label: 'Notifications' },
  { icon: '📍', label: 'Location' },
  { icon: '🎨', label: 'Appearance' },
  { icon: '📤', label: 'Export my data' },
  { icon: '❓', label: 'Help & feedback' },
];

export default function Profile() {
  const { restaurants } = useRestaurants();
  const navigate = useNavigate();

  const total    = restaurants.length;
  const visited  = restaurants.filter(r => r.status === 'visited').length;
  const wishlist = restaurants.filter(r => r.status === 'wishlist').length;
  const cities   = new Set(restaurants.map(r => r.location?.split(',')[1]?.trim() || r.location?.split(',')[0]?.trim()).filter(Boolean)).size;

  const cuisineMap = {};
  restaurants.forEach(r => {
    (r.cuisine || '').split('·').forEach(c => {
      const k = c.trim();
      if (k) cuisineMap[k] = (cuisineMap[k] || 0) + 1;
    });
  });
  const favCuisine = Object.entries(cuisineMap).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';

  const rated = restaurants.filter(r => r.status === 'visited' && r.rating);
  const avgRating = rated.length
    ? (rated.reduce((s, r) => s + r.rating, 0) / rated.length).toFixed(1)
    : null;

  const recent = [...restaurants]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <PageWrapper>
      {/* ── Full-bleed hero ── */}
      <div style={{ backgroundColor: 'var(--surface-3)', borderBottom: '1px solid var(--line)' }}>
        <div className="px-4 pt-8 pb-6">
          <div className="flex items-center gap-4">
            <div style={{
              width: 64, height: 64, borderRadius: 'var(--r-xl)', flexShrink: 0,
              backgroundColor: 'var(--orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28,
            }}>
              🍽️
            </div>
            <div>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.02em' }}>
                Food Explorer
              </p>
              <p style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 2, fontStyle: 'italic' }}>
                Discovering great food across Kerala
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── 4-up stat cards ── */}
      <div className="grid grid-cols-4 gap-2 px-4 pt-5">
        {[
          { label: 'Saved',   value: total,    color: 'var(--orange)' },
          { label: 'Visited', value: visited,  color: 'var(--green)' },
          { label: 'Wishlist',value: wishlist, color: 'var(--coral)' },
          { label: 'Cities',  value: cities,   color: 'var(--amber)' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-md)', padding: '12px 6px', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600, color, letterSpacing: '-0.02em' }}>{value}</p>
            <p style={{ fontSize: 10, fontWeight: 600, color: 'var(--ink-3)', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1.2 }}>{label}</p>
          </div>
        ))}
      </div>

      {/* ── Highlights ── */}
      <div className="grid grid-cols-2 gap-3 px-4 pt-4">
        <HighlightCard icon="🍴" label="Fav cuisine" value={favCuisine} bg="var(--orange-soft)" color="var(--orange-deep)" />
        <HighlightCard icon="⭐" label="Avg rating" value={avgRating ? `${avgRating}/5` : '—'} bg="var(--amber-soft)" color="#a16207" />
      </div>

      {/* ── Become a creator CTA ── */}
      <div className="px-4 pt-5">
        <div
          className="rounded-2xl p-4 flex items-center gap-3"
          style={{ backgroundColor: 'var(--amber-soft)', border: '1px solid var(--amber)', boxShadow: 'var(--shadow-sm)' }}
        >
          <span style={{ fontSize: 28, flexShrink: 0 }}>🎬</span>
          <div>
            <p className="t-caps mb-0.5" style={{ color: '#6E4A0F' }}>Food creator?</p>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: 'var(--ink)', letterSpacing: '-0.01em' }}>
              Share your picks <em style={{ color: '#a16207' }}>with the community</em>
            </p>
          </div>
        </div>
      </div>

      {/* ── Recently added ── */}
      <div className="px-4 pt-5">
        <p className="t-caps mb-3" style={{ color: 'var(--ink-3)' }}>Recently added</p>
        {recent.length === 0 ? (
          <p style={{ fontSize: 13, color: 'var(--ink-3)', textAlign: 'center', paddingTop: 32 }}>No restaurants yet</p>
        ) : (
          <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            {recent.map((r, i) => {
              const isVisited = r.status === 'visited';
              return (
                <div
                  key={r.id}
                  className="flex items-center gap-3 px-4"
                  style={{ minHeight: 64, borderTop: i !== 0 ? '1px solid var(--line)' : 'none' }}
                >
                  <div style={{ width: 40, height: 40, borderRadius: 'var(--r-md)', flexShrink: 0, backgroundColor: isVisited ? 'var(--green-soft)' : 'var(--orange-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                    {r.emoji}
                  </div>
                  <div className="flex-1 min-w-0 py-3">
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 600, color: 'var(--ink)' }} className="truncate">{r.name}</p>
                    <p style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }} className="truncate">
                      {r.location?.split(',')[0]} · {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 'var(--r-pill)', flexShrink: 0,
                    backgroundColor: isVisited ? 'var(--green-soft)' : 'var(--coral-soft)',
                    color: isVisited ? 'var(--green)' : 'var(--coral)',
                  }}>
                    {isVisited ? '✓ Visited' : '♡ Wishlist'}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Settings ── */}
      <div className="px-4 pt-6 pb-2">
        <p className="t-caps mb-3" style={{ color: 'var(--ink-3)' }}>Settings</p>
        <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          {SETTINGS.map((s, i) => (
            <button
              key={s.label}
              className="flex items-center gap-3 w-full text-left px-4"
              style={{ minHeight: 52, borderTop: i !== 0 ? '1px solid var(--line)' : 'none', background: 'none' }}
            >
              <span style={{ fontSize: 18, flexShrink: 0 }}>{s.icon}</span>
              <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>{s.label}</span>
              <span style={{ fontSize: 16, color: 'var(--ink-4)' }}>›</span>
            </button>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}

function HighlightCard({ icon, label, value, bg, color }) {
  return (
    <div style={{ backgroundColor: bg, borderRadius: 'var(--r-lg)', padding: 16, boxShadow: 'var(--shadow-sm)', border: '1px solid var(--line)' }}>
      <span style={{ fontSize: 24 }}>{icon}</span>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, marginTop: 8, color, letterSpacing: '-0.01em', lineHeight: 1.1 }}>{value}</p>
      <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-3)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
    </div>
  );
}
