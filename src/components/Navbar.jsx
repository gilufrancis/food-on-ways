import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useRestaurants } from '../context/RestaurantContext';
import AddRestaurantModal from './AddRestaurantModal';

const NAV = [
  { to: '/',         label: 'Map',     Icon: MapIcon,    end: true  },
  { to: '/explore',  label: 'Home',    Icon: HomeIcon,   end: true  },
  { to: '/wishlist', label: 'Wishlist', Icon: HeartIcon, end: false },
  { to: '/visited',  label: 'Visited', Icon: CheckIcon,  end: false },
  { to: '/vlogs',    label: 'Vlogs',   Icon: VideoIcon,  end: false },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { restaurants } = useRestaurants();
  const wishlistCount = restaurants.filter(r => r.status === 'wishlist').length;

  return (
    <>
      {/* ── Editorial top bar ── */}
      <header
        style={{
          backgroundColor: 'var(--surface)',
          borderBottom: '1px solid var(--line)',
          padding: '12px var(--px) 10px',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Left — stacked kicker */}
          <div style={{ flex: '0 0 auto' }}>
            <p className="t-caps" style={{ color: 'var(--orange)', letterSpacing: '0.1em' }}>Good taste,</p>
            <p className="t-caps" style={{ color: 'var(--ink-3)', letterSpacing: '0.1em', marginTop: 2 }}>great places.</p>
          </div>

          {/* Center — wordmark */}
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: 20, fontWeight: 500,
            letterSpacing: '-0.025em',
            color: 'var(--ink)',
            position: 'absolute', left: '50%', transform: 'translateX(-50%)',
          }}>
            Food <em style={{ color: 'var(--orange)', fontStyle: 'italic' }}>on</em> Ways
          </p>

          {/* Right — bell */}
          <button
            style={{
              position: 'relative',
              width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
              backgroundColor: 'var(--surface-2)',
              border: '1px solid var(--line)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flex: '0 0 auto',
            }}
            aria-label="Notifications"
          >
            <BellIcon />
            {/* Unread dot */}
            <span style={{
              position: 'absolute', top: 6, right: 6,
              width: 8, height: 8, borderRadius: '50%',
              backgroundColor: 'var(--orange)',
              border: '1.5px solid var(--surface)',
            }} />
          </button>
        </div>
      </header>

      {/* ── Floating + FAB (sits in the page flow via the container) ── */}
      {/* Rendered as a portal-like fixed element capped at max-w-md */}
      <div
        style={{
          position: 'fixed',
          top: 66,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: 448,
          pointerEvents: 'none',
          zIndex: 50,
        }}
      >
        <div style={{ position: 'absolute', right: 16, top: 0, pointerEvents: 'all' }}>
          <button
            onClick={() => setOpen(true)}
            style={{
              width: 52, height: 52, borderRadius: '50%',
              backgroundColor: 'var(--orange)',
              color: '#fff',
              fontSize: 28, fontWeight: 300, lineHeight: 1,
              border: 'none',
              boxShadow: '0 4px 16px rgba(245,98,45,0.45)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            aria-label="Add restaurant"
          >
            +
          </button>
        </div>
      </div>

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
        {NAV.map(({ to, label, Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className="flex flex-col items-center justify-center flex-1 gap-0.5"
            style={{ minHeight: 56, paddingTop: 8, paddingBottom: 6 }}
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
function BellIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--ink-2)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
    </svg>
  );
}
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
function VideoIcon({ active }) {
  const c = active ? 'var(--orange)' : 'var(--ink-4)';
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7"/>
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
    </svg>
  );
}
