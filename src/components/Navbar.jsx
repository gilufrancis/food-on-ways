import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import AddRestaurantModal from './AddRestaurantModal';

const NAV = [
  { to: '/',         label: 'Map',     Icon: MapIcon     },
  { to: '/explore',  label: 'Explore', Icon: HomeIcon    },
  { to: '/wishlist', label: 'Wishlist',Icon: HeartIcon   },
  { to: '/visited',  label: 'Visited', Icon: CheckIcon   },
  { to: '/profile',  label: 'Profile', Icon: PersonIcon  },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ════ Desktop sidebar ════ */}
      <aside
        className="hidden md:flex flex-col w-64 shrink-0 min-h-screen sticky top-0 self-start"
        style={{ backgroundColor: 'var(--surface)', borderRight: '1px solid var(--line)' }}
      >
        {/* Wordmark */}
        <div className="px-5 pt-6 pb-5" style={{ borderBottom: '1px solid var(--line)' }}>
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl shrink-0"
              style={{ backgroundColor: 'var(--orange)' }}
            >
              🍽️
            </div>
            <div>
              <p className="font-extrabold leading-tight" style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--ink)', letterSpacing: '-0.02em' }}>
                Food <em style={{ color: 'var(--orange)', fontStyle: 'italic' }}>on</em> Ways
              </p>
              <p className="t-mono mt-0.5" style={{ color: 'var(--ink-3)' }}>Restaurant tracker</p>
            </div>
          </div>
        </div>

        <nav className="flex flex-col gap-1 p-3 flex-1">
          {NAV.map(({ to, label, Icon }) => (
            <NavLink
              key={to} to={to} end={to === '/' || to === '/explore'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  isActive ? 'text-white' : ''
                }`
              }
              style={({ isActive }) => isActive
                ? { backgroundColor: 'var(--orange)', boxShadow: '0 4px 14px rgba(245,98,45,0.35)', color: '#fff' }
                : { color: 'var(--ink-3)' }
              }
            >
              {({ isActive }) => <><Icon active={isActive} />{label}</>}
            </NavLink>
          ))}
        </nav>

        <div className="p-4">
          <button
            onClick={() => setOpen(true)}
            className="w-full py-3.5 rounded-2xl text-sm font-bold text-white flex items-center justify-center gap-2"
            style={{ backgroundColor: 'var(--orange)', boxShadow: '0 4px 14px rgba(245,98,45,0.35)' }}
          >
            + Add Restaurant
          </button>
        </div>
      </aside>

      {/* ════ Mobile top bar ════ */}
      <header
        className="md:hidden w-full flex items-center justify-between sticky top-0 z-40 shrink-0"
        style={{
          height: 54,
          paddingLeft: 16, paddingRight: 12,
          backgroundColor: 'var(--surface)',
          borderBottom: '1px solid var(--line)',
          boxShadow: '0 1px 0 var(--line)',
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="flex items-center justify-center rounded-xl shrink-0"
            style={{ width: 32, height: 32, backgroundColor: 'var(--orange)', fontSize: 16 }}
          >
            🍽️
          </div>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--ink)' }}>
            Food <em style={{ color: 'var(--orange)', fontStyle: 'italic' }}>on</em> Ways
          </p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-1 font-bold rounded-full text-white"
          style={{ height: 34, paddingLeft: 14, paddingRight: 14, backgroundColor: 'var(--orange)', boxShadow: '0 2px 8px rgba(245,98,45,0.38)', fontSize: 13 }}
        >
          + Add
        </button>
      </header>

      {/* ════ Mobile bottom nav ════ */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-stretch"
        style={{
          backgroundColor: 'var(--surface)',
          borderTop: '1px solid var(--line)',
          paddingBottom: 'env(safe-area-inset-bottom)',
          boxShadow: '0 -4px 24px rgba(40,20,10,0.08)',
        }}
      >
        {NAV.map(({ to, label, Icon }) => (
          <NavLink
            key={to} to={to} end={to === '/' || to === '/explore'}
            className="flex flex-col items-center justify-center flex-1 pt-2 pb-1.5 gap-0.5"
            style={{ minHeight: 58 }}
          >
            {({ isActive }) => (
              <>
                <div
                  className="flex items-center justify-center rounded-xl transition-all duration-150"
                  style={{ width: 44, height: 28, backgroundColor: isActive ? 'var(--orange-soft)' : 'transparent' }}
                >
                  <Icon active={isActive} />
                </div>
                <span
                  className="font-semibold leading-none"
                  style={{ fontSize: 10, color: isActive ? 'var(--orange)' : 'var(--ink-4)', fontFamily: 'var(--font-ui)' }}
                >
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
function MapIcon({ active }) {
  const c = active ? 'var(--orange)' : 'var(--ink-4)';
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>;
}
function HomeIcon({ active }) {
  const c = active ? 'var(--orange)' : 'var(--ink-4)';
  return <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? c : 'none'} stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
}
function HeartIcon({ active }) {
  const c = active ? 'var(--coral)' : 'var(--ink-4)';
  return <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? c : 'none'} stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>;
}
function CheckIcon({ active }) {
  const c = active ? 'var(--green)' : 'var(--ink-4)';
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
}
function PersonIcon({ active }) {
  const c = active ? 'var(--orange)' : 'var(--ink-4)';
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
}
