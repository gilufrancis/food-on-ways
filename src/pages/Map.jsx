import { useState, useCallback } from 'react';
import { useRestaurants } from '../context/RestaurantContext';
import MapView from '../components/MapView';
import Pill from '../components/Pill';

/* Bottom sheet states */
const SHEET = { DEFAULT: 'default', SELECTED: 'selected', EXPANDED: 'expanded' };

const FILTERS = ['All', 'Wishlist', 'Visited'];

export default function Map() {
  const { restaurants, dispatch } = useRestaurants();
  const [flyTarget, setFlyTarget]   = useState(null);
  const [sheet, setSheet]           = useState(SHEET.DEFAULT);
  const [selected, setSelected]     = useState(null);
  const [activeFilter, setFilter]   = useState('All');
  const [sort, setSort]             = useState('saved');

  const withCoords = restaurants.filter(r => r.lat != null && r.lng != null);

  const filtered = withCoords.filter(r => {
    if (activeFilter === 'Wishlist') return r.status === 'wishlist';
    if (activeFilter === 'Visited')  return r.status === 'visited';
    return true;
  });

  const sorted = [...filtered].sort((a, b) =>
    sort === 'saved'
      ? new Date(b.createdAt) - new Date(a.createdAt)
      : (a.location || '').localeCompare(b.location || '')
  );

  const handlePin = useCallback((r) => {
    setSelected(r);
    setFlyTarget(r);
    setSheet(SHEET.SELECTED);
  }, []);

  const handleToggleStatus = (id) => dispatch({ type: 'TOGGLE_STATUS', payload: { id } });

  /* Sheet heights */
  const PEEK    = 200;  // default — just the handle + strip
  const FULL    = '85dvh';

  return (
    <>
      {/* ── Map (full screen) ── */}
      <div className="md:hidden relative w-full" style={{ height: '100dvh' }}>
        <MapView restaurants={filtered} flyTarget={flyTarget} onPinClick={handlePin} />

        {/* ── Floating filter row ── */}
        <div
          className="absolute top-3 left-0 right-0 z-10 flex gap-2 px-3 overflow-x-auto no-scrollbar"
          style={{ pointerEvents: 'none' }}
        >
          <div style={{ pointerEvents: 'all', display: 'flex', gap: 8 }}>
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  height: 36, paddingLeft: 14, paddingRight: 14, borderRadius: 'var(--r-pill)',
                  fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap',
                  backgroundColor: activeFilter === f ? 'var(--orange)' : 'rgba(253,250,246,0.9)',
                  color: activeFilter === f ? '#fff' : 'var(--ink)',
                  backdropFilter: 'blur(10px)',
                  border: activeFilter === f ? 'none' : '1px solid var(--line)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* ── Legend top-right ── */}
        <div
          className="absolute top-3 right-3 z-10 rounded-2xl flex flex-col gap-1.5 text-xs"
          style={{ backgroundColor: 'rgba(253,250,246,0.92)', backdropFilter: 'blur(8px)', padding: '10px 12px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--line)' }}
        >
          <div className="flex items-center gap-2 font-medium" style={{ color: 'var(--ink-2)' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: 'var(--orange)', display: 'inline-block' }} />
            Wishlist
          </div>
          <div className="flex items-center gap-2 font-medium" style={{ color: 'var(--ink-2)' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: 'var(--green)', display: 'inline-block' }} />
            Visited
          </div>
        </div>

        {/* ── Bottom sheet ── */}
        <div
          className="absolute left-0 right-0 bottom-0 z-20 sheet-enter"
          style={{
            borderRadius: '28px 28px 0 0',
            backgroundColor: 'var(--surface)',
            boxShadow: '0 -8px 40px rgba(40,20,10,0.14)',
            paddingBottom: 'env(safe-area-inset-bottom)',
            transition: 'height 380ms cubic-bezier(0.2,0.7,0.3,1)',
            height: sheet === SHEET.EXPANDED ? FULL : `${PEEK}px`,
            overflow: sheet === SHEET.EXPANDED ? 'auto' : 'hidden',
          }}
        >
          {/* Drag handle */}
          <div
            className="flex justify-center pt-3 pb-2 cursor-pointer"
            onClick={() => setSheet(s => s === SHEET.EXPANDED ? SHEET.DEFAULT : SHEET.EXPANDED)}
          >
            <div style={{ width: 36, height: 4, borderRadius: 99, backgroundColor: 'var(--line)' }} />
          </div>

          {sheet === SHEET.SELECTED && selected ? (
            <SelectedCard
              restaurant={selected}
              onClose={() => { setSheet(SHEET.DEFAULT); setSelected(null); }}
              onToggle={() => handleToggleStatus(selected.id)}
              onExpand={() => setSheet(SHEET.EXPANDED)}
            />
          ) : sheet === SHEET.EXPANDED ? (
            <ExpandedSheet
              restaurants={sorted}
              count={filtered.length}
              sort={sort}
              onSort={setSort}
              onSelect={handlePin}
              onCollapse={() => setSheet(SHEET.DEFAULT)}
            />
          ) : (
            <DefaultSheet
              restaurants={sorted}
              count={filtered.length}
              onSelect={handlePin}
              onExpand={() => setSheet(SHEET.EXPANDED)}
            />
          )}
        </div>
      </div>

      {/* ── Desktop layout ── */}
      <div className="hidden md:flex flex-col w-full" style={{ height: '100dvh' }}>
        <div className="flex-1 relative min-h-0">
          <MapView restaurants={filtered} flyTarget={flyTarget} onPinClick={handlePin} />
          <div
            className="absolute top-3 right-3 z-10 rounded-2xl flex flex-col gap-1.5 text-xs"
            style={{ backgroundColor: 'rgba(253,250,246,0.92)', backdropFilter: 'blur(8px)', padding: '10px 12px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--line)' }}
          >
            <div className="flex items-center gap-2 font-medium" style={{ color: 'var(--ink-2)' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: 'var(--orange)', display: 'inline-block' }} />
              Wishlist
            </div>
            <div className="flex items-center gap-2 font-medium" style={{ color: 'var(--ink-2)' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: 'var(--green)', display: 'inline-block' }} />
              Visited
            </div>
          </div>
        </div>
        <div style={{ backgroundColor: 'var(--surface)', borderTop: '1px solid var(--line)', maxHeight: 240, overflowY: 'auto' }}>
          <p className="t-caps px-5 pt-3 pb-1" style={{ color: 'var(--ink-3)' }}>
            {filtered.length} location{filtered.length !== 1 ? 's' : ''} on map
          </p>
          <DesktopCardList items={sorted} onSelect={handlePin} />
        </div>
      </div>
    </>
  );
}

/* ── Default sheet: count label + horizontal strip ── */
function DefaultSheet({ restaurants, count, onSelect, onExpand }) {
  return (
    <div>
      <div className="flex items-center justify-between px-4 pb-2">
        <p className="t-caps" style={{ color: 'var(--ink-3)' }}>{count} spot{count !== 1 ? 's' : ''} on map</p>
        <button
          onClick={onExpand}
          className="t-caps"
          style={{ color: 'var(--orange)', border: 'none', background: 'none' }}
        >
          See list →
        </button>
      </div>
      <div className="flex gap-3 px-4 overflow-x-auto no-scrollbar pb-2">
        {restaurants.slice(0, 8).map(r => (
          <button
            key={r.id}
            onClick={() => onSelect(r)}
            className="shrink-0 flex flex-col items-center gap-1.5 text-center"
            style={{ width: 68 }}
          >
            <div style={{
              width: 52, height: 52, borderRadius: 'var(--r-md)', flexShrink: 0,
              backgroundColor: r.status === 'visited' ? 'var(--green-soft)' : 'var(--orange-soft)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
              border: '1px solid var(--line)',
            }}>
              {r.emoji}
            </div>
            <p style={{ fontSize: 10, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.2, width: '100%' }} className="truncate">
              {r.name}
            </p>
          </button>
        ))}
        {restaurants.length === 0 && (
          <p style={{ fontSize: 13, color: 'var(--ink-3)', padding: '8px 0' }}>No locations with coordinates yet.</p>
        )}
      </div>
    </div>
  );
}

/* ── Selected card: compact detail + actions ── */
function SelectedCard({ restaurant: r, onClose, onToggle, onExpand }) {
  const isVisited = r.status === 'visited';
  return (
    <div className="px-4 pb-4">
      <div className="flex items-center gap-3 mb-3">
        <div style={{
          width: 52, height: 52, borderRadius: 'var(--r-md)', flexShrink: 0,
          backgroundColor: isVisited ? 'var(--green-soft)' : 'var(--orange-soft)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
        }}>
          {r.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.01em' }} className="truncate">
            {r.name}
          </p>
          <p style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>{r.cuisine?.split('·')[0].trim()} · {r.location?.split(',')[0]}</p>
        </div>
        <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: 'var(--surface-2)', border: 'none', fontSize: 16, color: 'var(--ink-3)', flexShrink: 0 }}>
          ×
        </button>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onToggle}
          className="flex-1 font-semibold text-sm"
          style={{
            minHeight: 44, borderRadius: 'var(--r-md)',
            border: `1.5px solid ${isVisited ? 'var(--green)' : 'var(--orange)'}`,
            color: isVisited ? 'var(--green)' : 'var(--orange)',
            backgroundColor: isVisited ? 'var(--green-soft)' : 'var(--orange-soft)',
          }}
        >
          {isVisited ? '↩ Wishlist' : '✓ Mark Visited'}
        </button>
        <button
          onClick={onExpand}
          className="flex-1 font-semibold text-sm text-white"
          style={{ minHeight: 44, borderRadius: 'var(--r-md)', backgroundColor: 'var(--ink)', border: 'none' }}
        >
          See all →
        </button>
      </div>
    </div>
  );
}

/* ── Expanded sheet: full list with sort ── */
function ExpandedSheet({ restaurants, count, sort, onSort, onSelect, onCollapse }) {
  return (
    <div>
      <div className="flex items-center justify-between px-4 pb-3">
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.02em' }}>
          {count} <em style={{ color: 'var(--orange)' }}>spots</em> on map
        </p>
        <button onClick={onCollapse} className="t-caps" style={{ color: 'var(--ink-3)', border: 'none', background: 'none' }}>↓ Map</button>
      </div>
      {/* Sort toggle */}
      <div className="flex gap-2 px-4 mb-3">
        {[{ key: 'saved', label: 'Recently saved' }, { key: 'location', label: 'By location' }].map(s => (
          <button
            key={s.key}
            onClick={() => onSort(s.key)}
            style={{
              height: 32, paddingLeft: 12, paddingRight: 12, borderRadius: 'var(--r-pill)', fontSize: 12, fontWeight: 600,
              backgroundColor: sort === s.key ? 'var(--orange)' : 'var(--surface-2)',
              color: sort === s.key ? '#fff' : 'var(--ink-3)',
              border: 'none',
            }}
          >
            {s.label}
          </button>
        ))}
      </div>
      <div className="flex flex-col">
        {restaurants.map((r, i) => (
          <ExpandedRow key={r.id} restaurant={r} index={i} onSelect={onSelect} />
        ))}
        {restaurants.length === 0 && (
          <p className="text-center py-8" style={{ fontSize: 13, color: 'var(--ink-3)' }}>
            No locations with coordinates. Add lat/lng when saving a restaurant.
          </p>
        )}
      </div>
    </div>
  );
}

function ExpandedRow({ restaurant: r, index, onSelect }) {
  const isVisited = r.status === 'visited';
  return (
    <button
      onClick={() => onSelect(r)}
      className="flex items-center gap-3 px-4 text-left w-full"
      style={{ minHeight: 64, borderTop: index !== 0 ? '1px solid var(--line)' : 'none', background: 'none', border: index !== 0 ? undefined : 'none' }}
    >
      <div style={{
        width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
        backgroundColor: isVisited ? 'var(--green)' : 'var(--orange)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 12, fontWeight: 700, color: '#fff', fontFamily: 'var(--font-mono)',
      }}>
        {index + 1}
      </div>
      <div style={{
        width: 44, height: 44, borderRadius: 'var(--r-md)', flexShrink: 0,
        backgroundColor: isVisited ? 'var(--green-soft)' : 'var(--orange-soft)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
      }}>
        {r.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--font-display)' }} className="truncate">{r.name}</p>
        <p style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>{r.location?.split(',')[0]}</p>
      </div>
      <Pill variant={isVisited ? 'green' : 'coral'} style={{ fontSize: 11, flexShrink: 0 }}>
        {isVisited ? '✓' : '♡'}
      </Pill>
    </button>
  );
}

/* ── Desktop list ── */
function DesktopCardList({ items, onSelect }) {
  if (items.length === 0) {
    return <p className="px-5 py-6 text-sm" style={{ color: 'var(--ink-3)' }}>No restaurants with coordinates yet.</p>;
  }
  return (
    <div className="flex flex-col">
      {items.map((r, i) => {
        const isVisited = r.status === 'visited';
        return (
          <button
            key={r.id}
            onClick={() => onSelect(r)}
            className="flex items-center gap-3 px-5 text-left w-full"
            style={{ minHeight: 56, borderTop: i !== 0 ? '1px solid var(--line)' : 'none', background: 'none' }}
          >
            <div style={{ width: 36, height: 36, borderRadius: 'var(--r-md)', flexShrink: 0, backgroundColor: isVisited ? 'var(--green-soft)' : 'var(--orange-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{r.emoji}</div>
            <div className="flex-1 min-w-0">
              <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }} className="truncate">{r.name}</p>
              <p style={{ fontSize: 11, color: 'var(--ink-3)' }} className="truncate">{r.location}</p>
            </div>
            <Pill variant={isVisited ? 'green' : 'coral'} style={{ fontSize: 11 }}>
              {isVisited ? '✓ Visited' : '♡ Wishlist'}
            </Pill>
          </button>
        );
      })}
    </div>
  );
}
