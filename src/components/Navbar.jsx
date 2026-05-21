import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useRestaurants } from '../context/RestaurantContext';
import AddRestaurantModal from './AddRestaurantModal';

const NAV = [
  { to: '/',         label: 'Home',    Icon: HomeIcon    },
  { to: '/map',      label: 'Map',     Icon: MapIcon     },
  { to: '/wishlist', label: 'Wishlist', Icon: HeartIcon  },
  { to: '/visited',  label: 'Visited', Icon: CheckIcon   },
  { to: '/profile',  label: 'Profile', Icon: PersonIcon  },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { restaurants } = useRestaurants();
  const wishlistCount = restaurants.filter(r => r.status === 'wishlist').length;

  return (
    <>
      {/* ── Top bar ── */}
      <header
        className="w-full flex items-center justify-between sticky top-0 z-40 shrink-0"
        style={{
          height: 56,
          paddingLeft: 20,
          paddingRight: 16,
          backgroundColor: 'var(--surface)',
          borderBottom: '1px solid var(--line)',
          boxShadow: '0 1px 0 var(--line)',
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            style={{
              width: 32, height: 32, borderRadius: 10, flexShrink: 0,
              backgroundColor: 'var(--orange)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
            }}
          >
            🍽️
          </div>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--ink)' }}>
            Food <em style={{ color: 'var(--orange)', fontStyle: 'italic' }}>on</em> Ways
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          style={{
            height: 36, paddingLeft: 16, paddingRight: 16,
            borderRadius: 'var(--r-pill)',
            backgroundColor: 'var(--orange)',
            color: '#fff', fontWeight: 700, fontSize: 13,
            border: 'none',
            boxShadow: '0 3px 10px rgba(245,98,45,0.38)',
            display: 'flex', alignItems: 'center', gap: 4,
          }}
        >
          + Add
        </button>
      </header>

      {/* ── Bottom nav ── */}
      <nav
        style={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: 448,
          backgroundColor: 'var(--surface)',
          borderTop: '1px solid var(--line)',
          paddingBottom: 'env(safe-area-inset-bottom)',
          zIndex: 40,
          display: 'flex',
          boxShadow: '0 -4px 20px rgba(26,21,18,0.07)',
        }}
      >
        {NAV.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/' || to === '/map'}
            className="flex flex-col items-center justify-center flex-1 pt-2 pb-1.5 gap-0.5"
            style={{ minHeight: 56 }}
          >
            {({ isActive }) => (
              <>
                <div
                  style={{
                    width: 40, height: 26,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderRadius: 8,
                    backgroundColor: isActive ? 'var(--orange-soft)' : 'transparent',
                    transition: 'background-color 150ms',
                    position: 'relative',
                  }}
                >
                  <Icon active={isActive} />
                  {/* Wishlist badge */}
                  {label === 'Wishlist' && wishlistCount > 0 && (
                    <span style={{
                      position: 'absolute', top: 0, right: 4,
                      minWidth: 16, height: 16, borderRadius: 999,
                      backgroundColor: 'var(--orange)',
                      color: '#fff', fontSize: 9, fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      padding: '0 4px',
                      border: '1.5px solid var(--surface)',
                      lineHeight: 1,
                    }}>
                      {wishlistCount > 99 ? '99+' : wishlistCount}
                    </span>
                  )}
                </div>
                <span style={{
                  fontSize: 10, fontWeight: 600,
                  color: isActive ? 'var(--orange)' : 'var(--ink-4)',
                  fontFamily: 'var(--font-ui)',
                }}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {open && <AddRestaurantModal onClose={() => setOpen(false)} />}
    </>
  );
}

/* ── Icons ── */
function HomeIcon({ active }) {
  const c = active ? 'var(--orange)' : 'var(--ink-4)';
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  );
}
function MapIcon({ active }) {
  const c = active ? 'var(--orange)' : 'var(--ink-4)';
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
      <line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>
    </svg>
  );
}
function HeartIcon({ active }) {
  const c = active ? 'var(--coral)' : 'var(--ink-4)';
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? c : 'none'} stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
    </svg>
  );
}
function CheckIcon({ active }) {
  const c = active ? 'var(--green)' : 'var(--ink-4)';
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  );
}
function PersonIcon({ active }) {
  const c = active ? 'var(--orange)' : 'var(--ink-4)';
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );
}
