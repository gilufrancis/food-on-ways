import { useNavigate } from 'react-router-dom';
import { useRestaurants } from '../context/RestaurantContext';
import RestaurantCard from '../components/RestaurantCard';

export default function Wishlist() {
  const { restaurants } = useRestaurants();
  const navigate = useNavigate();
  const wishlist  = restaurants.filter(r => r.status === 'wishlist');

  /* Group by city */
  const byCity = wishlist.reduce((acc, r) => {
    const city = r.location?.split(',')[1]?.trim() || r.location?.split(',')[0]?.trim() || 'Other';
    if (!acc[city]) acc[city] = [];
    acc[city].push(r);
    return acc;
  }, {});
  const cities = Object.entries(byCity);

  return (
    <div style={{ backgroundColor: 'var(--surface)', minHeight: '100dvh' }}>

      {/* Header */}
      <div style={{ padding: '24px var(--px) 20px' }}>
        <p className="t-caps" style={{ color: 'var(--ink-3)', marginBottom: 8 }}>Your saved places</p>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 28, fontWeight: 500,
          color: 'var(--ink)',
          letterSpacing: '-0.025em', lineHeight: 1.05,
        }}>
          Places I want{' '}
          <em style={{ color: 'var(--coral)', fontStyle: 'italic' }}>to eat</em>
        </h1>
        <p style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 8 }}>
          {wishlist.length} {wishlist.length === 1 ? 'place' : 'places'} saved
        </p>
      </div>

      {wishlist.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '48px 24px 24px' }}>
          <div style={{
            width: 80, height: 80, borderRadius: 24,
            backgroundColor: 'var(--coral-soft)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 36, marginBottom: 18,
          }}>
            ♡
          </div>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 500, color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: 8 }}>
            Wishlist is <em style={{ color: 'var(--coral)' }}>empty</em>
          </p>
          <p style={{ fontSize: 14, color: 'var(--ink-3)', lineHeight: 1.55, maxWidth: 240, marginBottom: 24 }}>
            Explore the feed or tap + Add to save your first restaurant
          </p>
          <button
            onClick={() => navigate('/explore')}
            style={{
              height: 44, paddingLeft: 24, paddingRight: 24,
              borderRadius: 'var(--r-pill)',
              backgroundColor: 'var(--orange)', color: '#fff',
              fontWeight: 700, fontSize: 14, border: 'none',
              boxShadow: '0 4px 14px rgba(255,111,67,0.35)',
            }}
          >
            Explore the feed →
          </button>
        </div>
      ) : (
        <div style={{ padding: '0 var(--px)', display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 'calc(80px + env(safe-area-inset-bottom))' }}>

          {/* Trip-plan nudge */}
          {cities.some(([, rs]) => rs.length >= 2) && (
            <div
              className="rounded-2xl p-4 flex items-center gap-3"
              style={{ backgroundColor: 'var(--ink)', boxShadow: 'var(--shadow-sm)' }}
            >
              <span style={{ fontSize: 28, flexShrink: 0 }}>🗺️</span>
              <div>
                <p className="t-caps" style={{ color: 'rgba(255,255,255,0.45)', marginBottom: 4 }}>Ready to plan?</p>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: '#fff', letterSpacing: '-0.01em', lineHeight: 1.3 }}>
                  You have multiple spots in the same city
                </p>
              </div>
            </div>
          )}

          {/* City groups */}
          {cities.map(([city, items]) => (
            <div key={city}>
              <div className="flex items-center gap-2" style={{ marginBottom: 12 }}>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.01em' }}>
                  {city}
                </p>
                <span style={{ fontSize: 11, color: 'var(--ink-4)', fontFamily: 'var(--font-mono)' }}>
                  {items.length} spot{items.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {items.map(r => <RestaurantCard key={r.id} restaurant={r} />)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
