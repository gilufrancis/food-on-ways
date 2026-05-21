import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRestaurants } from '../context/RestaurantContext';
import { posts } from '../data/posts';
import { events } from '../data/events';
import { creators, getCreator } from '../data/creators';
import CreatorPostCard from '../components/CreatorPostCard';
import Avatar from '../components/Avatar';
import Pill from '../components/Pill';
import PageWrapper from '../components/PageWrapper';

/* ─── Image map ─── */
const IMG = {
  paragon:    'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=900&q=80',
  sagar:      'https://images.unsplash.com/photo-1611599537845-1c7aca0091c0?w=900&q=80',
  kayees:     'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=900&q=80',
  topform:    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=900&q=80',
  appammachi: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=900&q=80',
  moplah:     'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=900&q=80',
  thalassery: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=900&q=80',
  dosadosa:   'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=900&q=80',
};

const TRENDING_IDS = ['paragon', 'kayees', 'moplah', 'appammachi', 'topform'];

function detectCity(restaurants) {
  const cities = restaurants
    .map(r => r.location?.split(',')[1]?.trim() || r.location?.split(',')[0]?.trim())
    .filter(Boolean);
  if (!cities.length) return 'Kozhikode';
  const freq = {};
  cities.forEach(c => { freq[c] = (freq[c] || 0) + 1; });
  return Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0];
}

export default function Explore() {
  const { restaurants, dispatch } = useRestaurants();
  const navigate = useNavigate();
  const [query, setQuery]   = useState('');
  const [filter, setFilter] = useState('all');

  const wishlistCount = restaurants.filter(r => r.status === 'wishlist').length;
  const visitedCount  = restaurants.filter(r => r.status === 'visited').length;
  const total         = restaurants.length;
  const city = detectCity(restaurants);

  const hero = [...restaurants].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
  const trending = TRENDING_IDS.map(id => restaurants.find(r => r.id === id)).filter(Boolean);
  const handleToggle = id => dispatch({ type: 'TOGGLE_STATUS', payload: { id } });

  return (
    <PageWrapper>

      {/* ─── Location bar ─── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px var(--px) 14px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Pill variant="outline" style={{ fontSize: 13, fontWeight: 600, gap: 5 }}>
            <span style={{ color: 'var(--orange)' }}>📍</span>
            {city}
          </Pill>
          <span style={{ fontSize: 13, color: 'var(--ink-3)' }}>· Switch city</span>
        </div>
        {/* Right count — leave space for FAB */}
        <p style={{ fontSize: 13, color: 'var(--ink-3)', paddingRight: 68 }}>
          <span style={{ color: 'var(--orange)', fontWeight: 700 }}>{wishlistCount}</span> wishlisted
        </p>
      </div>

      {/* ─── Section heading ─── */}
      <div style={{ padding: '0 var(--px) 20px' }}>
        <p className="t-caps" style={{ color: 'var(--orange)', marginBottom: 6 }}>
          Your next great meal
        </p>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 32, fontWeight: 600,
          color: 'var(--ink)',
          letterSpacing: '-0.035em',
          lineHeight: 1.05,
        }}>
          Crab, biryani, <em style={{ color: 'var(--orange)', fontStyle: 'italic' }}>sunset.</em>
        </h1>
      </div>

      {/* ─── Hero card ─── */}
      {hero && (
        <div style={{ padding: '0 var(--px-card) 24px' }}>
          <HeroCard
            restaurant={hero}
            image={IMG[hero.id]}
            onToggle={() => handleToggle(hero.id)}
            creatorPreviews={creators.slice(0, 3)}
          />
        </div>
      )}

      {/* ─── Trending near you ─── */}
      <section style={{ marginBottom: 28 }}>
        {/* Section head */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 var(--px) 14px' }}>
          <div>
            <p className="t-caps" style={{ color: 'var(--ink-3)', marginBottom: 4 }}>Trending near you 🔥</p>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 22, fontWeight: 600,
              color: 'var(--ink)', letterSpacing: '-0.025em', lineHeight: 1.1,
            }}>
              What's getting <em style={{ color: 'var(--orange)', fontStyle: 'italic' }}>saved</em>
            </h2>
          </div>
          <button
            onClick={() => navigate('/map')}
            className="t-caps"
            style={{ color: 'var(--orange)', border: 'none', background: 'none', paddingBottom: 2 }}
          >
            Map →
          </button>
        </div>

        {/* Horizontal scroll cards */}
        <div
          className="no-scrollbar"
          style={{
            display: 'flex', gap: 12,
            overflowX: 'auto',
            padding: '0 var(--px) 4px',
            scrollSnapType: 'x mandatory',
          }}
        >
          {trending.length > 0 ? trending.map((r, i) => (
            <TrendingCard
              key={r.id}
              restaurant={r}
              image={IMG[r.id]}
              index={i}
              onToggle={() => handleToggle(r.id)}
            />
          )) : (
            <p style={{ fontSize: 13, color: 'var(--ink-3)' }}>Add restaurants to see them here.</p>
          )}

          {/* "See all on map" card */}
          <button
            onClick={() => navigate('/map')}
            style={{
              width: 130, flexShrink: 0, borderRadius: 'var(--r-lg)',
              background: 'var(--ink)', color: '#fff',
              border: 'none', cursor: 'pointer',
              position: 'relative', overflow: 'hidden',
              scrollSnapAlign: 'start',
            }}
          >
            <div style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(circle at 60% 35%, rgba(245,98,45,0.38), transparent 55%)',
            }} />
            <div style={{ padding: '0 0 16px', position: 'relative', zIndex: 1 }}>
              <div style={{ height: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}>
                🗺️
              </div>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 600, textAlign: 'center', lineHeight: 1.3, padding: '0 12px' }}>
                See all<br />on map →
              </p>
            </div>
          </button>
        </div>
      </section>

      {/* ─── Fresh from creators ─── */}
      <section style={{ marginBottom: 28 }}>
        <div style={{ padding: '0 var(--px) 16px' }}>
          <p className="t-caps" style={{ color: 'var(--ink-3)', marginBottom: 4 }}>🎬 Fresh from creators</p>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 22, fontWeight: 600,
            color: 'var(--ink)', letterSpacing: '-0.025em', lineHeight: 1.1,
          }}>
            YouTuber <em style={{ color: 'var(--orange)', fontStyle: 'italic' }}>picks</em>
          </h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '0 var(--px)' }}>
          {posts.map((post, i) => (
            <CreatorPostCard key={post.id} post={post} index={i} />
          ))}
        </div>
      </section>

      {/* ─── Happening soon ─── */}
      <section style={{ marginBottom: 28 }}>
        <div style={{ padding: '0 var(--px) 14px' }}>
          <p className="t-caps" style={{ color: 'var(--ink-3)', marginBottom: 4 }}>📅 Happening soon</p>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 22, fontWeight: 600,
            color: 'var(--ink)', letterSpacing: '-0.025em', lineHeight: 1.1,
          }}>
            Eat with <em style={{ color: 'var(--amber)', fontStyle: 'italic' }}>others</em>
          </h2>
        </div>
        <div
          className="no-scrollbar"
          style={{ display: 'flex', gap: 12, overflowX: 'auto', padding: '0 var(--px) 4px' }}
        >
          {events.map(ev => <EventCard key={ev.id} event={ev} />)}
        </div>
      </section>

      {/* ─── Wishlist nudge ─── */}
      {wishlistCount >= 1 && (
        <div style={{ padding: '0 var(--px)', marginBottom: 24 }}>
          <button
            onClick={() => navigate('/wishlist')}
            style={{
              width: '100%', textAlign: 'left',
              background: 'linear-gradient(135deg, var(--orange-soft) 0%, var(--coral-soft) 100%)',
              border: '1px solid var(--line)',
              borderRadius: 'var(--r-lg)',
              padding: '16px 18px',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                backgroundColor: 'var(--orange)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17,
              }}>
                ♥
              </div>
              <div>
                <p className="t-caps" style={{ color: 'var(--orange-deep)', marginBottom: 4 }}>
                  Planning a {city} crawl?
                </p>
                <p style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 16, fontWeight: 600,
                  color: 'var(--ink)', letterSpacing: '-0.02em',
                }}>
                  You have <em style={{ color: 'var(--orange)' }}>{wishlistCount} spots</em> to visit →
                </p>
              </div>
            </div>
          </button>
        </div>
      )}

      {/* ─── All restaurants ─── */}
      <section style={{ padding: '0 var(--px)', marginBottom: 16 }}>
        <div style={{ marginBottom: 14 }}>
          <p className="t-caps" style={{ color: 'var(--ink-3)', marginBottom: 4 }}>All restaurants</p>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 22, fontWeight: 600,
            color: 'var(--ink)', letterSpacing: '-0.025em', lineHeight: 1.1,
          }}>
            Your <em style={{ color: 'var(--ink-3)', fontStyle: 'italic' }}>collection</em>
          </h2>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 12 }}>
          <svg
            style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
            width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="var(--ink-4)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="search" value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search name, cuisine, location…"
            style={{
              width: '100%', height: 46,
              paddingLeft: 38, paddingRight: query ? 38 : 14,
              fontSize: 14, borderRadius: 'var(--r-pill)',
              border: '1.5px solid var(--line)',
              backgroundColor: 'var(--surface-2)',
              color: 'var(--ink)', outline: 'none',
              fontFamily: 'var(--font-ui)',
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                width: 20, height: 20, borderRadius: '50%',
                backgroundColor: 'var(--surface-3)', color: 'var(--ink-3)',
                border: 'none', fontSize: 13, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              ×
            </button>
          )}
        </div>

        {/* Filter tabs */}
        <div
          className="no-scrollbar"
          style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 16 }}
        >
          {[
            { key: 'all',      label: 'All',      count: total },
            { key: 'wishlist', label: 'Wishlist',  count: wishlistCount },
            { key: 'visited',  label: 'Visited',   count: visitedCount },
          ].map(({ key, label, count }) => {
            const active = filter === key;
            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  height: 36, paddingLeft: 14, paddingRight: 14,
                  fontSize: 13, fontWeight: 600, flexShrink: 0,
                  borderRadius: 'var(--r-pill)',
                  backgroundColor: active ? 'var(--orange)' : 'var(--surface-2)',
                  color: active ? '#fff' : 'var(--ink-3)',
                  border: active ? 'none' : '1.5px solid var(--line)',
                  boxShadow: active ? '0 3px 10px rgba(245,98,45,0.28)' : 'none',
                  cursor: 'pointer',
                }}
              >
                {label}
                <span style={{
                  minWidth: 18, height: 18, borderRadius: 999,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 700, padding: '0 4px',
                  backgroundColor: active ? 'rgba(255,255,255,0.25)' : 'var(--surface-3)',
                  color: active ? '#fff' : 'var(--ink-4)',
                }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <FilteredList restaurants={restaurants} query={query} filter={filter} />
      </section>
    </PageWrapper>
  );
}

/* ─── Hero Card ─── */
function HeroCard({ restaurant: r, image, onToggle, creatorPreviews }) {
  const isSaved = r.status === 'wishlist' || r.status === 'visited';
  const isWish  = r.status === 'wishlist';

  return (
    <div style={{
      borderRadius: 'var(--r-xl)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-md)',
      backgroundColor: 'var(--surface-2)',
      border: '1px solid var(--line)',
    }}>
      {/* Image */}
      <div className="img-ph" style={{ position: 'relative', height: 360 }}>
        {image && (
          <img
            src={image} alt={r.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            loading="eager"
          />
        )}
        {/* Gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(20,10,5,0.82) 0%, rgba(20,10,5,0.05) 50%, transparent 100%)' }} />

        {/* Top-left: "Picked for you" */}
        <div style={{ position: 'absolute', top: 14, left: 14 }}>
          <Pill variant="dark" style={{ fontSize: 12, gap: 5 }}>
            ✦ Picked for you
          </Pill>
        </div>

        {/* Top-right: heart button */}
        <button
          onClick={onToggle}
          style={{
            position: 'absolute', top: 14, right: 14,
            width: 40, height: 40, borderRadius: '50%',
            backgroundColor: isSaved ? '#fff' : 'rgba(253,250,246,0.2)',
            backdropFilter: 'blur(10px)',
            border: isSaved ? 'none' : '1px solid rgba(255,255,255,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, color: isWish ? 'var(--coral)' : isSaved ? 'var(--green)' : 'rgba(255,255,255,0.85)',
            cursor: 'pointer',
          }}
        >
          {isSaved ? '♥' : '♡'}
        </button>

        {/* Bottom overlay: cuisine pills + name + location */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 16px 16px' }}>
          {/* Cuisine pills + distance */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
            {r.cuisine?.split('·').slice(0, 2).map(c => (
              <Pill key={c} variant="dark" style={{ fontSize: 11 }}>{c.trim()}</Pill>
            ))}
            <Pill variant="dark" style={{ fontSize: 11 }}>📍 1.2 km</Pill>
          </div>
          {/* Restaurant name */}
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: 38, fontWeight: 500,
            color: '#fff',
            letterSpacing: '-0.03em',
            lineHeight: 0.96,
            textWrap: 'pretty',
          }}>
            {r.name}
          </p>
          {/* Location */}
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 6 }}>
            {r.location?.split(',')[0]} · {r.location?.split(',')[1]?.trim() || ''}
          </p>
        </div>
      </div>

      {/* Below image */}
      <div style={{ padding: '14px 16px 16px', backgroundColor: 'var(--surface-2)' }}>
        {/* Quote */}
        <p style={{ fontSize: 14, lineHeight: 1.5, color: 'var(--ink-2)' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 22, color: 'var(--ink)', marginRight: 5, lineHeight: 0 }}>"</span>
          {r.notes || 'Known for their pepper crab and the view of Fort Kochi at sunset.'}
        </p>

        {/* Creator avatars + view details */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Overlapping avatars */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {creatorPreviews.map((c, i) => (
                <div key={c.id} style={{ marginLeft: i === 0 ? 0 : -10 }}>
                  <Avatar name={c.name} color={c.color} size={28} ring />
                </div>
              ))}
            </div>
            <p style={{ fontSize: 12, color: 'var(--ink-3)' }}>
              <strong style={{ color: 'var(--ink)', fontWeight: 700 }}>3 creators</strong> have been here
            </p>
          </div>

          {/* View details button */}
          <button style={{
            height: 40, paddingLeft: 18, paddingRight: 18,
            borderRadius: 'var(--r-pill)',
            backgroundColor: 'var(--ink)', color: '#fff',
            fontSize: 13, fontWeight: 700, border: 'none',
            display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}>
            View details <span style={{ fontSize: 15 }}>›</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Trending Card ─── */
function TrendingCard({ restaurant: r, image, index, onToggle }) {
  const isSaved   = r.status === 'wishlist' || r.status === 'visited';
  const isVisited = r.status === 'visited';

  return (
    <div
      className="fade-up"
      style={{
        width: 155, flexShrink: 0,
        borderRadius: 'var(--r-lg)',
        animationDelay: `${index * 60}ms`,
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--line)',
        backgroundColor: 'var(--surface-2)',
        overflow: 'hidden',
        scrollSnapAlign: 'start',
        cursor: 'pointer',
      }}
    >
      {/* Image */}
      <div className="img-ph" style={{ position: 'relative', height: 130 }}>
        {image && (
          <img src={image} alt={r.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading="lazy" />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,21,18,0.5) 0%, transparent 60%)' }} />
        <button
          onClick={onToggle}
          style={{
            position: 'absolute', top: 8, right: 8,
            width: 30, height: 30, borderRadius: '50%', border: 'none',
            backgroundColor: isSaved ? '#fff' : 'rgba(26,21,18,0.38)',
            backdropFilter: 'blur(6px)',
            color: isSaved ? 'var(--coral)' : 'rgba(255,255,255,0.9)',
            fontSize: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          {isSaved ? '♥' : '♡'}
        </button>
      </div>

      {/* Info */}
      <div style={{ padding: '10px 12px 12px' }}>
        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: 14, fontWeight: 700,
          color: 'var(--ink)', lineHeight: 1.2, letterSpacing: '-0.01em',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {r.name}
        </p>
        <p style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {r.location?.split(',')[0]}
        </p>
      </div>
    </div>
  );
}

/* ─── Event Card ─── */
function EventCard({ event: ev }) {
  const host = getCreator(ev.hostCreatorId);
  return (
    <div style={{
      width: 230, flexShrink: 0,
      borderRadius: 'var(--r-lg)',
      overflow: 'hidden',
      backgroundColor: 'var(--surface-2)',
      border: '1px solid var(--line)',
      boxShadow: 'var(--shadow-sm)',
    }}>
      <div className="img-ph" style={{ position: 'relative', height: 110 }}>
        {ev.image && <img src={ev.image} alt={ev.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading="lazy" />}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,21,18,0.45) 0%, transparent 60%)' }} />
        <div style={{ position: 'absolute', top: 10, left: 10 }}>
          <Pill variant="amber" style={{ fontSize: 11 }}>📅 {ev.date} · {ev.time}</Pill>
        </div>
      </div>
      <div style={{ padding: '12px 14px 14px' }}>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
          {ev.name}
        </p>
        {host && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 8 }}>
            <Avatar name={host.name} color={host.color} size={20} />
            <p style={{ fontSize: 11, color: 'var(--ink-3)' }}>
              Hosted by <strong style={{ color: 'var(--ink-2)' }}>{host.name}</strong>
            </p>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
          {ev.spotsLeft <= 8 ? (
            <span style={{ fontSize: 11, color: 'var(--coral)', fontWeight: 700 }}>● {ev.spotsLeft} spots left</span>
          ) : (
            <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>{ev.attending} going</span>
          )}
          <button style={{
            height: 30, paddingLeft: 14, paddingRight: 14,
            borderRadius: 'var(--r-pill)',
            backgroundColor: 'var(--orange)', color: '#fff',
            fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer',
          }}>
            Join
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Filtered list ─── */
function FilteredList({ restaurants, query, filter }) {
  const q = query.toLowerCase();
  const filtered = restaurants.filter(r => {
    const ok = filter === 'all' || r.status === filter;
    return ok && (!q || r.name.toLowerCase().includes(q) || r.cuisine?.toLowerCase().includes(q) || r.location?.toLowerCase().includes(q));
  });

  if (filtered.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingTop: 40, paddingBottom: 24 }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', backgroundColor: 'var(--surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 12 }}>
          {query ? '🔍' : '🍽️'}
        </div>
        <p style={{ fontWeight: 700, fontSize: 15, color: 'var(--ink)' }}>
          {query ? 'No results found' : 'No restaurants yet'}
        </p>
        <p style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 6 }}>
          {query ? `Nothing matched "${query}"` : 'Tap + Add to save your first'}
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {filtered.map((r, i) => <MiniCard key={r.id} restaurant={r} index={i} />)}
    </div>
  );
}

/* ─── Mini card ─── */
function MiniCard({ restaurant: r, index }) {
  const isVisited = r.status === 'visited';
  return (
    <div
      className="fade-up"
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '10px 14px',
        backgroundColor: 'var(--surface-2)',
        border: '1px solid var(--line)',
        borderLeft: `3px solid ${isVisited ? 'var(--green)' : 'var(--orange)'}`,
        borderRadius: 'var(--r-md)',
        boxShadow: 'var(--shadow-sm)',
        animationDelay: `${(index % 8) * 40}ms`,
      }}
    >
      <div style={{
        width: 42, height: 42, borderRadius: 10, flexShrink: 0,
        backgroundColor: isVisited ? 'var(--green-soft)' : 'var(--orange-soft)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
      }}>
        {r.emoji}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.01em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {r.name}
        </p>
        <p style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {r.cuisine?.split('·')[0].trim()} · {r.location?.split(',')[0]}
        </p>
      </div>
      <span style={{
        flexShrink: 0, fontSize: 11, fontWeight: 700,
        padding: '4px 10px', borderRadius: 999,
        backgroundColor: isVisited ? 'var(--green-soft)' : 'var(--coral-soft)',
        color: isVisited ? 'var(--green)' : 'var(--coral)',
      }}>
        {isVisited ? '✓' : '♡'}
      </span>
    </div>
  );
}
