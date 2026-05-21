import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRestaurants } from '../context/RestaurantContext';
import { getCreator } from '../data/creators';
import Avatar from './Avatar';
import Pill from './Pill';

const TIER_VARIANT = { Tastemaker: 'orange', Editor: 'amber', Explorer: 'outline' };

export default function CreatorPostCard({ post, index = 0 }) {
  const { restaurants, dispatch } = useRestaurants();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [bursting, setBursting] = useState(false);

  const creator = getCreator(post.creatorId);
  const restaurant = restaurants.find(r => r.id === post.restaurantId);

  if (!creator) return null;

  const isWishlisted = restaurant?.status === 'wishlist';
  const isVisited = restaurant?.status === 'visited';
  const isSaved = isWishlisted || isVisited;

  const handleHeart = () => {
    if (!restaurant) return;
    setBursting(true);
    setSaved(true);
    dispatch({ type: 'TOGGLE_STATUS', payload: { id: restaurant.id } });
    setTimeout(() => setBursting(false), 700);
  };

  const handleMapPin = () => {
    if (restaurant?.lat) navigate('/');
  };

  return (
    <article
      className="fade-up"
      style={{
        animationDelay: `${(index % 5) * 60}ms`,
        backgroundColor: 'var(--surface)',
        borderRadius: 'var(--r-lg)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--line)',
      }}
    >
      {/* Creator header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <a href={creator.youtubeUrl} target="_blank" rel="noopener noreferrer">
          <Avatar name={creator.name} color={creator.color} size={38} />
        </a>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <a
              href={creator.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-sm leading-tight"
              style={{ color: 'var(--ink)', textDecoration: 'none' }}
            >
              {creator.name}
            </a>
            <Pill variant={TIER_VARIANT[creator.tier] || 'outline'} style={{ fontSize: 10, padding: '2px 7px' }}>
              {creator.tier}
            </Pill>
          </div>
          <p className="t-mono mt-0.5" style={{ color: 'var(--ink-3)' }}>
            {creator.handle} · {post.timeAgo}
          </p>
        </div>
        {/* YouTube link */}
        <a
          href={creator.youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center rounded-full"
          style={{ width: 32, height: 32, backgroundColor: 'var(--surface-2)', flexShrink: 0 }}
          aria-label="View on YouTube"
        >
          <YoutubeIcon />
        </a>
      </div>

      {/* Post image — 4:5 aspect */}
      <div
        className="relative w-full img-ph"
        style={{ aspectRatio: '4/5', maxHeight: 340, overflow: 'hidden' }}
      >
        {post.image && (
          <img
            src={post.image}
            alt={restaurant?.name || 'Restaurant photo'}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            loading="lazy"
          />
        )}
        {/* Restaurant pill floating at bottom-left */}
        {restaurant && (
          <button
            className="absolute bottom-3 left-3"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(253,250,246,0.96)',
              backdropFilter: 'blur(12px)',
              borderRadius: 'var(--r-pill)',
              padding: '8px 14px 8px 10px',
              border: '1px solid rgba(255,255,255,0.7)',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <span style={{
              width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
              backgroundColor: 'var(--orange)', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <PinFillIcon />
            </span>
            <span style={{ textAlign: 'left' }}>
              <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, lineHeight: 1, color: 'var(--ink)' }}>
                {restaurant.name}
              </span>
              {restaurant.location && (
                <span style={{ display: 'block', fontSize: 10.5, color: 'var(--ink-3)', marginTop: 2 }}>
                  {restaurant.location.split(',')[0]}
                </span>
              )}
            </span>
          </button>
        )}
      </div>

      {/* Caption */}
      <div className="px-4 pt-3 pb-1">
        <p style={{ fontSize: 14, lineHeight: 1.5, color: 'var(--ink-2)' }}>{post.caption}</p>
      </div>

      {/* Action row */}
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Heart */}
        <div className="relative">
          <button
            onClick={handleHeart}
            className="flex items-center justify-center rounded-full"
            style={{
              width: 36, height: 36, flexShrink: 0,
              backgroundColor: isSaved || saved ? 'var(--coral-soft)' : 'var(--surface-2)',
              border: 'none', position: 'relative', overflow: 'visible',
            }}
            aria-label="Save"
          >
            <HeartSvg filled={isSaved || saved} />
            {bursting && <BurstParticles />}
          </button>
        </div>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-3)' }}>
          {post.saves + (saved && !isSaved ? 1 : 0)}
        </span>

        {/* Map pin */}
        {restaurant?.lat && (
          <button
            onClick={handleMapPin}
            className="flex items-center justify-center rounded-full ml-1"
            style={{ width: 36, height: 36, backgroundColor: 'var(--surface-2)', flexShrink: 0 }}
            aria-label="See on map"
          >
            <MapPinIcon />
          </button>
        )}

        {/* Already saved indicator */}
        {(isSaved || saved) && (
          <span
            className="ml-auto font-semibold"
            style={{ fontSize: 12, color: isVisited ? 'var(--green)' : 'var(--coral)' }}
          >
            {isVisited ? 'Already visited ✓' : 'Saved ✓'}
          </span>
        )}
      </div>
    </article>
  );
}

function HeartSvg({ filled }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24"
      fill={filled ? 'var(--coral)' : 'none'}
      stroke={filled ? 'var(--coral)' : 'var(--ink-3)'}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  );
}

function PinFillIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="#fff">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" strokeWidth="0">
      <path fill="#FF0000" d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58z"/>
      <polygon fill="#fff" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
    </svg>
  );
}

const BURST_ANGLES = [0, 40, 80, 130, 180, 220, 260, 310, 350];
function BurstParticles() {
  return (
    <>
      {BURST_ANGLES.map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const dist = 28 + Math.random() * 14;
        const tx = Math.cos(rad) * dist;
        const ty = Math.sin(rad) * dist;
        return (
          <span
            key={i}
            className="heart-burst-piece"
            style={{ '--tx': `${tx}px`, '--ty': `${ty}px`, '--rot': `${(Math.random() - 0.5) * 60}deg` }}
          >
            ♥
          </span>
        );
      })}
    </>
  );
}
