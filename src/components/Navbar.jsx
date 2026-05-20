import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import AddRestaurantModal from './AddRestaurantModal';

const NAV_ITEMS = [
  { to: '/',         label: 'Home',     Icon: HomeIcon },
  { to: '/map',      label: 'Map',      Icon: MapIcon },
  { to: '/wishlist', label: 'Wishlist', Icon: HeartIcon },
  { to: '/visited',  label: 'Visited',  Icon: CheckIcon },
  { to: '/profile',  label: 'Profile',  Icon: PersonIcon },
];

export default function Navbar() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {/* ── Desktop sidebar (hidden on mobile) ── */}
      <aside className="hidden md:flex flex-col w-60 shrink-0 bg-white border-r border-gray-100 min-h-screen sticky top-0 self-start">
        {/* Brand */}
        <div className="px-5 pt-6 pb-5 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shrink-0 shadow-sm"
              style={{ background: 'linear-gradient(135deg, #ff5c28 0%, #ff8c42 100%)' }}
            >
              🍽️
            </div>
            <div>
              <p className="font-extrabold text-gray-900 text-[15px] leading-tight">Food on Ways</p>
              <p className="text-[11px] text-gray-400 font-medium">Restaurant tracker</p>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col gap-1 p-3 flex-1">
          {NAV_ITEMS.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive ? 'text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                }`
              }
              style={({ isActive }) =>
                isActive ? { background: 'linear-gradient(135deg, #ff5c28 0%, #ff8c42 100%)', boxShadow: '0 4px 12px rgba(255,92,40,0.3)' } : {}
              }
            >
              {({ isActive }) => (
                <>
                  <Icon active={isActive} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Add button */}
        <div className="p-4">
          <button
            onClick={() => setShowModal(true)}
            className="w-full py-3 rounded-2xl text-sm font-bold text-white flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #ff5c28 0%, #ff8c42 100%)', boxShadow: '0 4px 14px rgba(255,92,40,0.35)' }}
          >
            <span className="text-lg leading-none font-black">+</span>
            Add Restaurant
          </button>
        </div>
      </aside>

      {/* ── Mobile top bar (shown on mobile, hidden on desktop) ── */}
      {/* In flex-col layout this sits ABOVE <main>, then becomes sticky on scroll */}
      <header
        className="md:hidden w-full flex items-center justify-between px-4 bg-white border-b border-gray-100 sticky top-0 z-40 shrink-0"
        style={{ height: '56px' }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-base shrink-0"
            style={{ background: 'linear-gradient(135deg, #ff5c28 0%, #ff8c42 100%)' }}
          >
            🍽️
          </div>
          <p className="font-extrabold text-gray-900 text-[15px]">Food on Ways</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1 font-bold text-white text-sm px-4 rounded-xl shrink-0"
          style={{
            height: '36px',
            background: 'linear-gradient(135deg, #ff5c28 0%, #ff8c42 100%)',
            boxShadow: '0 2px 8px rgba(255,92,40,0.35)',
          }}
        >
          + Add
        </button>
      </header>

      {/* ── Mobile bottom nav (fixed, hidden on desktop) ── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white z-40 flex"
        style={{
          borderTop: '1px solid #f0f0f0',
          paddingBottom: 'env(safe-area-inset-bottom)',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.06)',
        }}
      >
        {NAV_ITEMS.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className="flex flex-col items-center justify-center flex-1"
            style={{ minHeight: '56px', paddingTop: '6px', paddingBottom: '6px' }}
          >
            {({ isActive }) => (
              <>
                <div
                  className="flex items-center justify-center rounded-xl mb-0.5"
                  style={{
                    width: '40px',
                    height: '28px',
                    backgroundColor: isActive ? '#fff2ee' : 'transparent',
                  }}
                >
                  <Icon active={isActive} />
                </div>
                <span
                  className="text-[10px] font-semibold"
                  style={{ color: isActive ? '#ff5c28' : '#b0b0b0' }}
                >
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {showModal && <AddRestaurantModal onClose={() => setShowModal(false)} />}
    </>
  );
}

/* ── Icon components ── */
function HomeIcon({ active }) {
  const c = active ? '#ff5c28' : '#b0b0b0';
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" fill={active ? '#fff2ee' : 'none'} stroke={c}/>
      <polyline points="9 22 9 12 15 12 15 22" stroke={c}/>
    </svg>
  );
}

function MapIcon({ active }) {
  const c = active ? '#ff5c28' : '#b0b0b0';
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
      <line x1="8" y1="2" x2="8" y2="18"/>
      <line x1="16" y1="6" x2="16" y2="22"/>
    </svg>
  );
}

function HeartIcon({ active }) {
  const c = active ? '#ff5c28' : '#b0b0b0';
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? '#ff5c28' : 'none'} stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
    </svg>
  );
}

function CheckIcon({ active }) {
  const c = active ? '#ff5c28' : '#b0b0b0';
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  );
}

function PersonIcon({ active }) {
  const c = active ? '#ff5c28' : '#b0b0b0';
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );
}
