import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRestaurants } from '../context/RestaurantContext';
import { posts } from '../data/posts';
import { events } from '../data/events';
import { creators, getCreator } from '../data/creators';
import CreatorPostCard from '../components/CreatorPostCard';
import SectionHead from '../components/SectionHead';
import Pill from '../components/Pill';
import Avatar from '../components/Avatar';
import PageWrapper from '../components/PageWrapper';

const HERO_IMAGES = {
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

export default function Explore() {
  const { restaurants, dispatch } = useRestaurants();
  const navigate = useNavigate();
  const [query, setQuery]   = useState('');
  const [filter, setFilter] = useState('all');

  const total         = restaurants.length;
  const visitedCount  = restaurants.filter(r => r.status === 'visited').length;
  const wishlistCount = restaurants.filter(r => r.status === 'wishlist').length;

  const hero = [...restaurants].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
  const trending = TRENDING_IDS.map(id => restaurants.find(r => r.id === id)).filter(Boolean);
  const handleToggle = (id) => dispatch({ type: 'TOGGLE_STATUS', payload: { id } });

  return (
    <PageWrapper>

      {/* ── Location bar ── */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <Pill variant="outline" style={{ fontSize: 13, gap: 6 }}>
          <span style={{ color: 'var(--orange)' }}>📍</span> Kerala
        </Pill>
        <p style={{ fontSize: 13, color: 'var(--ink-3)', fontWeight: 500 }}>
          <span style={{ color: 'var(--orange)', fontWeight: 700 }}>{wishlistCount}</span> wishlisted
        </p>
      </div>

      {/* ── Section heading ── */}
      <div className="px-4 pb-5">
        <p className="t-caps mb-2" style={{ color: 'var(--ink-3)' }}>Your next great meal</p>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 30, fontWeight: 500,
          color: 'var(--ink)',
          letterSpacing: '-0.03em',
          lineHeight: 1.05,
        }}>
          Crab, biryani,{' '}
          <em style={{ color: 'var(--orange)', fontStyle: 'italic' }}>sunset.</em>
        </h1>
      </div>

      {/* ── Hero card ── */}
      {hero && (
        <div className="px-4 pb-6">
          <HeroCard
            restaurant={hero}
            image={HERO_IMAGES[hero.id]}
            onToggle={() => handleToggle(hero.id)}
            creatorPreviews={creators.slice(0, 3)}
          />
        </div>
      )}

      {/* ── Trending near you ── */}
      <div className="pb-6">
        <div className="px-4 mb-3">
          <SectionHead
            kicker="Trending near you 🔥"
            title={<>What's getting <em style={{ color: 'var(--orange)' }}>saved</em></>}
            action="Map"
            onAction={() => navigate('/map')}
          />
        </div>
        {trending.length > 0 ? (
          <div className="flex gap-3 px-4 overflow-x-auto no-scrollbar pb-2" style={{ scrollSnapType: 'x mandatory' }}>
            {trending.map((r, i) => (
              <TrendingCard
                key={r.id}
                restaurant={r}
                image={HERO_IMAGES[r.id]}
                index={i}
                onToggle={() => handleToggle(r.id)}
              />
            ))}
            <button
              onClick={() => navigate('/map')}
              className="shrink-0 flex flex-col items-center justify-center gap-2 overflow-hidden"
              style={{
                width: 120, minHeight: 175,
                background: 'var(--ink)', color: '#fff', border: 'none',
                boxShadow: 'var(--shadow-md)',
                borderRadius: 'var(--r-lg)',
                scrollSnapAlign: 'start',
                position: 'relative',
              }}
            >
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 60% 40%, rgba(245,98,45,0.35), transparent 55%)' }} />
              <span style={{ fontSize: 30, position: 'relative', zIndex: 1 }}>🗺️</span>
              <span style={{ fontSize: 11, fontWeight: 600, textAlign: 'center', lineHeight: 1.4, padding: '0 10px', position: 'relative', zIndex: 1 }}>
                See all<br />on map →
              </span>
            </button>
          </div>
        ) : (
          <div className="px-4">
            <p style={{ fontSize: 13, color: 'var(--ink-3)', paddingTop: 8 }}>
              Add restaurants to see them here.
            </p>
          </div>
        )}
      </div>

      {/* ── Fresh from creators ── */}
      <div className="pb-6">
        <div className="px-4 mb-4">
          <SectionHead
            kicker="🎬 Fresh from creators"
            title={<>YouTuber <em style={{ color: 'var(--orange)', fontStyle: 'italic' }}>picks</em></>}
          />
        </div>
        <div className="flex flex-col gap-5 px-4">
          {posts.map((post, i) => (
            <CreatorPostCard key={post.id} post={post} index={i} />
          ))}
        </div>
      </div>

      {/* ── Happening soon ── */}
      <div className="pb-6">
        <div className="px-4 mb-3">
          <SectionHead
            kicker="📅 Happening soon"
            title={<>Eat with <em style={{ color: 'var(--amber)', fontStyle: 'italic' }}>others</em></>}
          />
        </div>
        <div className="flex gap-3 px-4 overflow-x-auto no-scrollbar pb-2">
          {events.map(ev => (
            <EventCard key={ev.id} event={ev} />
          ))}
        </div>
      </div>

      {/* ── Wishlist nudge ── */}
      {wishlistCount >= 1 && (
        <div className="px-4 pb-6">
          <button
            onClick={() => navigate('/wishlist')}
            className="w-full text-left rounded-2xl p-4"
            style={{
              background: 'linear-gradient(135deg, var(--orange-soft) 0%, var(--coral-soft) 100%)',
              border: '1px solid var(--line)',
              boxShadow: 'var(--shadow-sm)',
              borderRadius: 'var(--r-lg)',
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div style={{
                width: 38, height: 38, borderRadius: '50%',
                background: 'var(--orange)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, flexShrink: 0,
              }}>
                ♥
              </div>
              <div>
                <p className="t-caps mb-0.5" style={{ color: 'var(--orange-deep)' }}>Planning a Kerala crawl?</p>
                <p style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 17, fontWeight: 600,
                  color: 'var(--ink)', letterSpacing: '-0.02em',
                }}>
                  You have <em style={{ color: 'var(--orange)' }}>{wishlistCount} spots</em> to visit →
                </p>
              </div>
            </div>
          </button>
        </div>
      )}

      {/* ── All restaurants ── */}
      <div className="px-4 pb-4">
        <div className="mb-4">
          <SectionHead kicker="All restaurants" title={<>Your <em style={{ color: 'var(--ink-3)', fontStyle: 'italic' }}>collection</em></>} />
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
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
              fontSize: 14, borderRadius: 'var(--r-md)',
              border: '1.5px solid var(--line)',
              backgroundColor: 'var(--surface-2)',
              color: 'var(--ink)', outline: 'none',
              boxShadow: 'var(--shadow-sm)',
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ backgroundColor: 'var(--surface-3)', color: 'var(--ink-3)', border: 'none' }}
            >
              ×
            </button>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 mb-4">
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
                className="shrink-0 flex items-center gap-1.5 font-semibold transition-all"
                style={{
                  height: 36, paddingLeft: 14, paddingRight: 14, fontSize: 13,
                  borderRadius: 'var(--r-pill)',
                  backgroundColor: active ? 'var(--orange)' : 'var(--surface-2)',
                  color: active ? '#fff' : 'var(--ink-3)',
                  border: active ? 'none' : '1.5px solid var(--line)',
                  boxShadow: active ? '0 3px 10px rgba(245,98,45,0.28)' : 'none',
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
      </div>
    </PageWrapper>
  );
}

/* ── Hero Card ── */
function HeroCard({ restaurant, image, onToggle, creatorPreviews }) {
  const isWish = restaurant.status === 'wishlist';
  const isVis  = restaurant.status === 'visited';
  const isSaved = isWish || isVis;

  return (
    <div
      style={{
        borderRadius: 'var(--r-xl)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-md)',
        border: '1px solid var(--line)',
        backgroundColor: 'var(--surface-2)',
      }}
    >
      {/* Image section */}
      <div className="relative img-ph" style={{ height: 280 }}>
        {image && (
          <img
            src={image} alt={restaurant.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            loading="lazy"
          />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(20,10,5,0.80) 0%, rgba(20,10,5,0.08) 55%, transparent 100%)' }} />

        <div className="absolute top-3 left-3">
          <Pill variant="dark" style={{ fontSize: 11 }}>✨ Picked for you</Pill>
        </div>

        <button
          onClick={onToggle}
          className="absolute top-3 right-3 flex items-center justify-center rounded-full"
          style={{
            width: 38, height: 38,
            backgroundColor: isSaved ? 'var(--coral-soft)' : 'rgba(26,21,18,0.45)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: isSaved ? 'var(--coral)' : '#fff',
            fontSize: 17,
          }}
        >
          {isSaved ? '♥' : '♡'}
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex gap-1.5 mb-2 flex-wrap">
            {restaurant.cuisine?.split('·').slice(0, 2).map(c => (
              <Pill key={c} variant="dark" style={{ fontSize: 11 }}>{c.trim()}</Pill>
            ))}
          </div>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600, color: '#fff', letterSpacing: '-0.025em', lineHeight: 1.1 }}>
            {restaurant.name}
          </p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>
            {restaurant.location}
          </p>
        </div>
      </div>

      {/* Below-image section */}
      <div style={{ padding: '14px 16px 16px' }}>
        <p style={{ fontSize: 14, lineHeight: 1.5, color: 'var(--ink-2)', fontStyle: 'italic' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--ink)', marginRight: 4 }}>"</span>
          {restaurant.notes || 'One of the most loved spots in Kerala — known for its signature biryani and coastal flavours.'}
        </p>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <div style={{ display: 'flex' }}>
              {creatorPreviews.map((c, i) => (
                <div key={c.id} style={{ marginLeft: i === 0 ? 0 : -8 }}>
                  <Avatar name={c.name} color={c.color} size={26} ring />
                </div>
              ))}
            </div>
            <p style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>
              <strong style={{ color: 'var(--ink)' }}>3 creators</strong> have been here
            </p>
          </div>
          <button
            style={{
              height: 36, paddingLeft: 14, paddingRight: 14,
              borderRadius: 'var(--r-pill)',
              backgroundColor: 'var(--ink)', color: '#fff',
              fontSize: 13, fontWeight: 600, border: 'none',
            }}
          >
            View details →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Trending Card ── */
function TrendingCard({ restaurant, image, index, onToggle }) {
  const isSaved = restaurant.status === 'wishlist' || restaurant.status === 'visited';
  return (
    <div
      className="shrink-0 overflow-hidden fade-up"
      style={{
        width: 130, borderRadius: 'var(--r-lg)',
        animationDelay: `${index * 60}ms`,
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--line)',
        backgroundColor: 'var(--surface-2)',
        scrollSnapAlign: 'start',
      }}
    >
      <div className="relative img-ph" style={{ height: 110 }}>
        {image && (
          <img src={image} alt={restaurant.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading="lazy" />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,21,18,0.65) 0%, transparent 55%)' }} />
        <button
          onClick={onToggle}
          className="absolute top-2 right-2 flex items-center justify-center rounded-full"
          style={{
            width: 28, height: 28, fontSize: 14,
            backgroundColor: 'rgba(26,21,18,0.42)',
            backdropFilter: 'blur(6px)',
            border: 'none',
            color: isSaved ? 'var(--coral)' : 'rgba(255,255,255,0.85)',
          }}
        >
          {isSaved ? '♥' : '♡'}
        </button>
      </div>
      <div style={{ padding: '10px 11px 13px' }}>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
          {restaurant.name}
        </p>
        <p style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 3 }}>
          {restaurant.location?.split(',')[0]}
        </p>
      </div>
    </div>
  );
}

/* ── Event Card ── */
function EventCard({ event: ev }) {
  const host = getCreator(ev.hostCreatorId);
  return (
    <div
      className="shrink-0 overflow-hidden"
      style={{
        width: 230, borderRadius: 'var(--r-lg)',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--line)',
        backgroundColor: 'var(--surface-2)',
      }}
    >
      <div className="relative img-ph" style={{ height: 120 }}>
        {ev.image && (
          <img src={ev.image} alt={ev.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading="lazy" />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,21,18,0.5) 0%, transparent 60%)' }} />
        <div className="absolute top-2.5 left-2.5">
          <Pill variant="amber" style={{ fontSize: 11 }}>
            📅 {ev.date} · {ev.time}
          </Pill>
        </div>
      </div>
      <div style={{ padding: '12px 13px 14px' }}>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
          {ev.name}
        </p>
        {host && (
          <div className="flex items-center gap-2 mt-2">
            <Avatar name={host.name} color={host.color} size={20} />
            <p style={{ fontSize: 11, color: 'var(--ink-3)' }}>
              Hosted by <strong style={{ color: 'var(--ink-2)' }}>{host.name}</strong>
            </p>
          </div>
        )}
        <div className="flex items-center justify-between mt-3">
          {ev.spotsLeft <= 8 ? (
            <span style={{ fontSize: 11, color: 'var(--coral)', fontWeight: 700 }}>
              ● {ev.spotsLeft} spots left
            </span>
          ) : (
            <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>{ev.attending} going</span>
          )}
          <button
            style={{
              height: 30, paddingLeft: 14, paddingRight: 14,
              borderRadius: 'var(--r-pill)',
              backgroundColor: 'var(--orange)', color: '#fff',
              fontSize: 12, fontWeight: 600, border: 'none',
            }}
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Filtered collection list ── */
function FilteredList({ restaurants, query, filter }) {
  const q = query.toLowerCase();
  const filtered = restaurants.filter(r => {
    const ok = filter === 'all' || r.status === filter;
    return ok && (!q || r.name.toLowerCase().includes(q) || r.cuisine?.toLowerCase().includes(q) || r.location?.toLowerCase().includes(q));
  });

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center text-center py-10">
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
    <div className="flex flex-col gap-2">
      {filtered.map((r, i) => <MiniCard key={r.id} restaurant={r} index={i} />)}
    </div>
  );
}

/* ── Mini card ── */
function MiniCard({ restaurant: r, index }) {
  const isVisited = r.status === 'visited';
  return (
    <div
      className="flex items-center gap-3 fade-up"
      style={{
        padding: '10px 12px',
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
      <div className="flex-1 min-w-0">
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.01em' }} className="truncate">
          {r.name}
        </p>
        <p style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }} className="truncate">
          {r.cuisine?.split('·')[0].trim()} · {r.location?.split(',')[0]}
        </p>
      </div>
      <Pill variant={isVisited ? 'green' : 'coral'} style={{ fontSize: 11, flexShrink: 0 }}>
        {isVisited ? '✓' : '♡'}
      </Pill>
    </div>
  );
}
