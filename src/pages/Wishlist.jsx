import { useNavigate } from 'react-router-dom';
import { useRestaurants } from '../context/RestaurantContext';
import RestaurantCard from '../components/RestaurantCard';
import PageWrapper from '../components/PageWrapper';
import SectionHead from '../components/SectionHead';

export default function Wishlist() {
  const { restaurants } = useRestaurants();
  const navigate = useNavigate();
  const wishlist = restaurants.filter(r => r.status === 'wishlist');

  /* City groupings */
  const byCity = wishlist.reduce((acc, r) => {
    const city = r.location?.split(',')[1]?.trim() || r.location?.split(',')[0]?.trim() || 'Other';
    if (!acc[city]) acc[city] = [];
    acc[city].push(r);
    return acc;
  }, {});
  const cities = Object.entries(byCity);

  return (
    <PageWrapper>
      {/* Header */}
      <div className="px-4 pt-5 pb-4">
        <p className="t-caps mb-2" style={{ color: 'var(--ink-3)' }}>Your saved places</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 500, letterSpacing: '-0.02em', color: 'var(--ink)', lineHeight: 1.05 }}>
          Places I want <em style={{ color: 'var(--coral)' }}>to eat</em>
        </h1>
        <p style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 8 }}>
          {wishlist.length} {wishlist.length === 1 ? 'place' : 'places'} saved
        </p>
      </div>

      {wishlist.length === 0 ? (
        <EmptyWishlist onExplore={() => navigate('/explore')} />
      ) : (
        <div className="px-4 pt-4 pb-2">
          {/* Trip plan nudge if any city has 2+ spots */}
          {cities.some(([, rs]) => rs.length >= 2) && (
            <div
              className="rounded-2xl p-4 mb-5 flex items-center gap-3"
              style={{ backgroundColor: 'var(--ink)', boxShadow: 'var(--shadow-sm)' }}
            >
              <div style={{ fontSize: 28, flexShrink: 0 }}>🗺️</div>
              <div>
                <p className="t-caps mb-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Ready to plan?</p>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: '#fff', letterSpacing: '-0.01em' }}>
                  You have multiple spots in the same city
                </p>
              </div>
            </div>
          )}

          {/* City groups */}
          {cities.map(([city, items]) => (
            <div key={city} className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.01em' }}>
                  {city}
                </p>
                <span style={{ fontSize: 12, color: 'var(--ink-4)', fontFamily: 'var(--font-mono)' }}>
                  {items.length} spot{items.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex flex-col gap-2.5">
                {items.map(r => <RestaurantCard key={r.id} restaurant={r} />)}
              </div>
            </div>
          ))}
        </div>
      )}
    </PageWrapper>
  );
}

function EmptyWishlist({ onExplore }) {
  return (
    <div className="flex flex-col items-center text-center px-6 py-16">
      <div style={{ width: 80, height: 80, borderRadius: 'var(--r-xl)', backgroundColor: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, marginBottom: 16, border: '2px dashed var(--line)' }}>
        ♡
      </div>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 500, color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: 8 }}>
        Wishlist is <em style={{ color: 'var(--coral)' }}>empty</em>
      </p>
      <p style={{ fontSize: 14, color: 'var(--ink-3)', lineHeight: 1.5, maxWidth: 260, marginBottom: 20 }}>
        Explore the feed or tap + Add to save your first restaurant
      </p>
      <button
        onClick={onExplore}
        style={{ height: 44, paddingLeft: 20, paddingRight: 20, borderRadius: 'var(--r-pill)', backgroundColor: 'var(--orange)', color: '#fff', fontWeight: 600, fontSize: 14, border: 'none', boxShadow: '0 4px 14px rgba(245,98,45,0.35)' }}
      >
        Explore the feed →
      </button>
    </div>
  );
}
