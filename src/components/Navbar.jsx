import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import AddRestaurantModal from './AddRestaurantModal';

const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/map', label: 'Map', icon: '🗺️' },
  { to: '/wishlist', label: 'Wishlist', icon: '❤️' },
  { to: '/visited', label: 'Visited', icon: '✅' },
  { to: '/profile', label: 'Profile', icon: '👤' },
];

export default function Navbar() {
  const [showModal, setShowModal] = useState(false);

  const sidebarLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
      isActive
        ? 'bg-orange-50 text-orange-600'
        : 'text-gray-600 hover:bg-gray-100'
    }`;

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex flex-col w-56 shrink-0 border-r border-gray-100 bg-white min-h-screen sticky top-0 p-4">
        <div className="flex items-center gap-2 mb-8 mt-2 px-1">
          <span className="text-2xl">🍽️</span>
          <div>
            <p className="font-bold text-gray-900 leading-tight text-sm">Food on Ways</p>
            <p className="text-xs text-gray-400">Restaurant tracker</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {NAV_ITEMS.map(({ to, label, icon }) => (
            <NavLink key={to} to={to} end={to === '/'} className={sidebarLinkClass}>
              <span className="text-base">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={() => setShowModal(true)}
          className="mt-4 w-full py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#ff5c28' }}
        >
          + Add Restaurant
        </button>
      </aside>

      {/* ── Mobile top bar ── */}
      <header className="md:hidden flex items-center justify-between px-4 bg-white border-b border-gray-100 sticky top-0 z-40"
        style={{ height: '52px' }}>
        <div className="flex items-center gap-2">
          <span className="text-xl">🍽️</span>
          <p className="font-bold text-gray-900 text-sm">Food on Ways</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="font-semibold text-white px-4 py-2 rounded-xl text-sm"
          style={{ backgroundColor: '#ff5c28', minHeight: '36px' }}
        >
          + Add
        </button>
      </header>

      {/* ── Mobile bottom nav ── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-40 flex justify-around items-stretch"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {NAV_ITEMS.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 flex-1 py-2 text-[10px] font-medium transition-colors ${
                isActive ? 'text-orange-600' : 'text-gray-400'
              }`
            }
            style={{ minHeight: '56px' }}
          >
            {({ isActive }) => (
              <>
                <span
                  className={`flex items-center justify-center rounded-xl transition-colors ${
                    isActive ? 'bg-orange-50 px-3 py-1' : 'px-3 py-1'
                  }`}
                  style={{ fontSize: '20px', lineHeight: 1 }}
                >
                  {icon}
                </span>
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {showModal && <AddRestaurantModal onClose={() => setShowModal(false)} />}
    </>
  );
}
