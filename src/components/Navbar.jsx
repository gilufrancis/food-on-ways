import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import AddRestaurantModal from './AddRestaurantModal';

const BRAND = 'linear-gradient(135deg, #ff5c28 0%, #ff7d45 100%)';

const NAV = [
  { to: '/',         label: 'Home',     Icon: HomeIcon },
  { to: '/map',      label: 'Map',      Icon: MapIcon },
  { to: '/wishlist', label: 'Wishlist', Icon: HeartIcon },
  { to: '/visited',  label: 'Visited',  Icon: CheckIcon },
  { to: '/profile',  label: 'Profile',  Icon: PersonIcon },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ════ Desktop sidebar ════ */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 bg-white border-r border-gray-100 min-h-screen sticky top-0 self-start">
        <div className="px-5 pt-6 pb-5 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl shrink-0" style={{ background: BRAND }}>
              🍽️
            </div>
            <div>
              <p className="font-extrabold text-gray-900 text-base leading-tight">Food on Ways</p>
              <p className="text-xs text-gray-400 mt-0.5">Restaurant tracker</p>
            </div>
          </div>
        </div>

        <nav className="flex flex-col gap-1 p-3 flex-1">
          {NAV.map(({ to, label, Icon }) => (
            <NavLink
              key={to} to={to} end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  isActive ? 'text-white' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                }`
              }
              style={({ isActive }) => isActive
                ? { background: BRAND, boxShadow: '0 4px 14px rgba(255,92,40,0.35)' }
                : {}
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
            style={{ background: BRAND, boxShadow: '0 4px 14px rgba(255,92,40,0.35)' }}
          >
            + Add Restaurant
          </button>
        </div>
      </aside>

      {/* ════ Mobile top bar ════ */}
      <header
        className="md:hidden w-full flex items-center justify-between bg-white sticky top-0 z-40 shrink-0"
        style={{ height: 60, paddingLeft: 16, paddingRight: 16, borderBottom: '1px solid #f0f0f0' }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0" style={{ background: BRAND }}>
            🍽️
          </div>
          <p className="font-extrabold text-gray-900 text-base">Food on Ways</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-1.5 text-white font-bold text-sm rounded-2xl px-4"
          style={{ height: 40, background: BRAND, boxShadow: '0 2px 10px rgba(255,92,40,0.4)' }}
        >
          + Add
        </button>
      </header>

      {/* ════ Mobile bottom nav ════ */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white z-40 flex items-stretch"
        style={{
          borderTop: '1px solid #ebebeb',
          paddingBottom: 'env(safe-area-inset-bottom)',
          boxShadow: '0 -4px 24px rgba(0,0,0,0.08)',
        }}
      >
        {NAV.map(({ to, label, Icon }) => (
          <NavLink
            key={to} to={to} end={to === '/'}
            className="flex flex-col items-center justify-center flex-1 pt-2 pb-1.5 gap-1"
            style={{ minHeight: 58 }}
          >
            {({ isActive }) => (
              <>
                <div
                  className="flex items-center justify-center rounded-xl transition-all duration-150"
                  style={{
                    width: 44, height: 30,
                    backgroundColor: isActive ? '#fff2ee' : 'transparent',
                  }}
                >
                  <Icon active={isActive} />
                </div>
                <span
                  className="font-semibold leading-none"
                  style={{ fontSize: 10, color: isActive ? '#ff5c28' : '#a8a8a8' }}
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

/* ── SVG Icons ── */
function HomeIcon({ active }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? '#ff5c28' : 'none'} stroke={active ? '#ff5c28' : '#b8b8b8'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
}
function MapIcon({ active }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#ff5c28' : '#b8b8b8'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>;
}
function HeartIcon({ active }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? '#ff5c28' : 'none'} stroke={active ? '#ff5c28' : '#b8b8b8'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>;
}
function CheckIcon({ active }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#ff5c28' : '#b8b8b8'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
}
function PersonIcon({ active }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#ff5c28' : '#b8b8b8'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
}
