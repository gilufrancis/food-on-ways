import { useState, useCallback, useRef } from 'react';
import { useRestaurants } from '../context/RestaurantContext';
import MapView from '../components/MapView';

/* ─── Hero images by restaurant id ─── */
const HERO_IMAGES = {
  paragon:    'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=600&q=80',
  sagar:      'https://images.unsplash.com/photo-1611599537845-1c7aca0091c0?w=600&q=80',
  kayees:     'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=600&q=80',
  topform:    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80',
  appammachi: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=600&q=80',
  moplah:     'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&q=80',
  thalassery: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&q=80',
  dosadosa:   'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&q=80',
};

const FILTERS = ['All', 'Wishlist', 'Visited', 'Events', 'Near me'];
const SHEET   = { DEFAULT: 'default', SELECTED: 'selected', EXPANDED: 'expanded' };

/* ─── City detection (simple: from restaurant locations) ─── */
function detectCity(restaurants) {
  const cities = restaurants.map(r => r.location?.split(',')[1]?.trim() || r.location?.split(',')[0]?.trim()).filter(Boolean);
  if (!cities.length) return 'Kerala';
  const freq = {};
  cities.forEach(c => { freq[c] = (freq[c] || 0) + 1; });
  return Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0];
}

export default function Map() {
  const { restaurants, dispatch } = useRestaurants();
  const [flyTarget, setFlyTarget]   = useState(null);
  const [sheet, setSheet]           = useState(SHEET.DEFAULT);
  const [selected, setSelected]     = useState(null);
  const [activeFilter, setFilter]   = useState('All');
  const [searchQuery, setSearch]    = useState('');
  const [locating, setLocating]     = useState(false);
  const mapRef = useRef(null);

  const withCoords = restaurants.filter(r => r.lat != null && r.lng != null);
  const wishlistCount = restaurants.filter(r => r.status === 'wishlist').length;
  const city = detectCity(restaurants);

  const filtered = withCoords.filter(r => {
    if (activeFilter === 'Wishlist') return r.status === 'wishlist';
    if (activeFilter === 'Visited')  return r.status === 'visited';
    return true;
  });

  const sorted = [...filtered].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const handlePin = useCallback((r) => {
    setSelected(r);
    setFlyTarget(r);
    setSheet(SHEET.SELECTED);
  }, []);

  const handleToggle = (id) => dispatch({ type: 'TOGGLE_STATUS', payload: { id } });

  const handleLocate = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        if (mapRef.current) {
          mapRef.current.flyTo([pos.coords.latitude, pos.coords.longitude], 13, { duration: 1.4 });
        }
      },
      () => setLocating(false),
    );
  };

  const handleZoom = (dir) => {
    if (!mapRef.current) return;
    dir === '+' ? mapRef.current.zoomIn() : mapRef.current.zoomOut();
  };

  const handleMapReady = useCallback((map) => {
    mapRef.current = map;
  }, []);

  /* Sheet heights */
  const PEEK = 220;
  const FULL = '82dvh';

  return (
    <div style={{ position: 'relative', width: '100%', height: 'calc(100dvh - 56px)', overflow: 'hidden' }}>

      {/* ─── Full-screen map ─── */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <MapView
          restaurants={filtered}
          flyTarget={flyTarget}
          onPinClick={handlePin}
          onMapReady={handleMapReady}
        />
      </div>

      {/* ─── Floating top overlay ─── */}
      <div
        style={{
          position: 'absolute', top: 16, left: 16, right: 16, zIndex: 10,
          display: 'flex', flexDirection: 'column', gap: 10,
        }}
      >
        {/* Search pill */}
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            backgroundColor: 'rgba(253,250,246,0.96)',
            backdropFilter: 'blur(14px)',
            borderRadius: 'var(--r-pill)',
            border: '1px solid var(--line)',
            boxShadow: 'var(--shadow-md)',
            padding: '10px 10px 10px 16px',
            height: 50,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--ink-4)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            value={searchQuery}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search restaurants, cuisines, areas…"
            style={{
              flex: 1, border: 'none', background: 'none', outline: 'none',
              fontSize: 14, color: 'var(--ink)', fontFamily: 'var(--font-ui)',
            }}
          />
          {/* Layers / filter icon button */}
          <button
            style={{
              width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
              backgroundColor: 'var(--orange)',
              border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            aria-label="Map layers"
          >
            <LayersIcon />
          </button>
        </div>

        {/* Filter pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar" style={{ paddingBottom: 2 }}>
          {FILTERS.map(f => {
            const active = activeFilter === f;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  height: 36, paddingLeft: 16, paddingRight: 16,
                  borderRadius: 'var(--r-pill)',
                  fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0,
                  backgroundColor: active ? 'var(--ink)' : 'rgba(253,250,246,0.94)',
                  color: active ? '#fff' : 'var(--ink)',
                  backdropFilter: 'blur(12px)',
                  border: active ? 'none' : '1px solid rgba(233,222,206,0.8)',
                  boxShadow: active ? '0 2px 8px rgba(26,21,18,0.25)' : 'var(--shadow-sm)',
                }}
              >
                {f}
              </button>
            );
          })}
        </div>

        {/* Location banner */}
        <div
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            backgroundColor: 'var(--ink)',
            borderRadius: 'var(--r-md)',
            padding: '10px 14px',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
              backgroundColor: 'var(--orange)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 15,
            }}>
              ✦
            </div>
            <p style={{ fontSize: 13, color: '#fff', lineHeight: 1.3 }}>
              You're in <strong>{city}</strong>.{' '}
              <span style={{ color: 'rgba(255,255,255,0.6)' }}>
                {filtered.length} saved spot{filtered.length !== 1 ? 's' : ''} nearby.
              </span>
            </p>
          </div>
          <button
            onClick={() => setSheet(SHEET.EXPANDED)}
            style={{
              fontSize: 13, fontWeight: 700, color: 'var(--orange)',
              border: 'none', background: 'none', whiteSpace: 'nowrap', paddingLeft: 8,
            }}
          >
            Zoom →
          </button>
        </div>
      </div>

      {/* ─── Right-side controls ─── */}
      <div
        style={{
          position: 'absolute', right: 16, zIndex: 10,
          display: 'flex', flexDirection: 'column', gap: 8,
          top: '50%', transform: 'translateY(-50%)',
        }}
      >
        {/* Locate button */}
        <button
          onClick={handleLocate}
          style={{
            width: 44, height: 44,
            borderRadius: 'var(--r-md)',
            backgroundColor: 'rgba(253,250,246,0.96)',
            backdropFilter: 'blur(12px)',
            border: '1px solid var(--line)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: locating ? 'var(--orange)' : 'var(--ink)',
          }}
          aria-label="Use my location"
        >
          <LocateIcon />
        </button>

        {/* Zoom card */}
        <div
          style={{
            borderRadius: 'var(--r-md)',
            backgroundColor: 'rgba(253,250,246,0.96)',
            backdropFilter: 'blur(12px)',
            border: '1px solid var(--line)',
            boxShadow: 'var(--shadow-sm)',
            overflow: 'hidden',
          }}
        >
          <button
            onClick={() => handleZoom('+')}
            style={{
              width: 44, height: 44, border: 'none', background: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, fontWeight: 300, color: 'var(--ink)',
              borderBottom: '1px solid var(--line)',
            }}
            aria-label="Zoom in"
          >
            +
          </button>
          <button
            onClick={() => handleZoom('-')}
            style={{
              width: 44, height: 44, border: 'none', background: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, fontWeight: 300, color: 'var(--ink)',
            }}
            aria-label="Zoom out"
          >
            −
          </button>
        </div>
      </div>

      {/* ─── Bottom sheet ─── */}
      <div
        className="absolute left-0 right-0 bottom-0 z-20 sheet-enter"
        style={{
          borderRadius: '28px 28px 0 0',
          backgroundColor: 'var(--surface)',
          boxShadow: '0 -8px 40px rgba(26,21,18,0.14)',
          paddingBottom: 'calc(56px + env(safe-area-inset-bottom))',
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
          <div style={{ width: 40, height: 4, borderRadius: 99, backgroundColor: 'var(--line)' }} />
        </div>

        {sheet === SHEET.SELECTED && selected ? (
          <SelectedCard
            restaurant={selected}
            onClose={() => { setSheet(SHEET.DEFAULT); setSelected(null); }}
            onToggle={() => handleToggle(selected.id)}
            onExpand={() => setSheet(SHEET.EXPANDED)}
          />
        ) : sheet === SHEET.EXPANDED ? (
          <ExpandedSheet
            restaurants={sorted}
            count={filtered.length}
            city={city}
            onSelect={handlePin}
            onCollapse={() => setSheet(SHEET.DEFAULT)}
          />
        ) : (
          <DefaultSheet
            restaurants={sorted}
            count={filtered.length}
            city={city}
            onSelect={handlePin}
            onExpand={() => setSheet(SHEET.EXPANDED)}
          />
        )}
      </div>
    </div>
  );
}

/* ─── Default sheet ─── */
function DefaultSheet({ restaurants, count, city, onSelect, onExpand }) {
  return (
    <div>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '2px var(--px-sheet) 4px' }}>
        <div>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: 22, fontWeight: 700,
            color: 'var(--ink)', letterSpacing: '-0.02em', lineHeight: 1.1,
          }}>
            {count} spot{count !== 1 ? 's' : ''} on map
          </p>
          <p style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 3 }}>
            {city} · Tap a pin to preview
          </p>
        </div>
        <button
          onClick={onExpand}
          style={{
            fontSize: 13, fontWeight: 700, color: 'var(--orange)',
            border: 'none', background: 'none', paddingTop: 4, whiteSpace: 'nowrap',
          }}
        >
          Expand list ↑
        </button>
      </div>

      {/* Horizontal bento cards */}
      <div
        className="flex gap-3 overflow-x-auto no-scrollbar"
        style={{ padding: '10px var(--px-sheet) 14px', scrollSnapType: 'x mandatory' }}
      >
        {restaurants.slice(0, 8).map(r => (
          <BentoCard key={r.id} restaurant={r} onSelect={onSelect} />
        ))}
        {restaurants.length === 0 && (
          <p style={{ fontSize: 13, color: 'var(--ink-3)', padding: '8px 0' }}>
            Add restaurants with coordinates to see them here.
          </p>
        )}
      </div>

      {/* Legend */}
      <div
        className="flex items-center gap-4 flex-wrap"
        style={{ paddingLeft: 'var(--px-sheet)', paddingRight: 'var(--px-sheet)', paddingBottom: 6 }}
      >
        <LegendDot color="var(--orange)" label="Wishlist" />
        <LegendDot color="var(--green)" label="Visited" />
        <LegendDot color="var(--surface)" label="Creator pick" border="var(--orange)" />
        <LegendDot color="var(--amber)" label="Event" />
      </div>
    </div>
  );
}

/* ─── Bento restaurant card ─── */
function BentoCard({ restaurant: r, onSelect }) {
  const image = HERO_IMAGES[r.id];
  const isVisited = r.status === 'visited';
  return (
    <button
      onClick={() => onSelect(r)}
      style={{
        width: 140, flexShrink: 0, borderRadius: 'var(--r-md)',
        backgroundColor: 'var(--surface-2)',
        border: '1px solid var(--line)',
        boxShadow: 'var(--shadow-sm)',
        overflow: 'hidden', textAlign: 'left',
        scrollSnapAlign: 'start',
        cursor: 'pointer',
      }}
    >
      {/* Photo */}
      <div className="img-ph" style={{ height: 90, position: 'relative' }}>
        {image ? (
          <img src={image} alt={r.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading="lazy" />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            backgroundColor: isVisited ? 'var(--green-soft)' : 'var(--orange-soft)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 30,
          }}>
            {r.emoji}
          </div>
        )}
        {/* Status dot */}
        <div style={{
          position: 'absolute', top: 7, right: 7,
          width: 10, height: 10, borderRadius: '50%',
          backgroundColor: isVisited ? 'var(--green)' : 'var(--orange)',
          border: '1.5px solid white',
        }} />
      </div>
      {/* Info */}
      <div style={{ padding: '8px 10px 10px' }}>
        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: 13, fontWeight: 700,
          color: 'var(--ink)', lineHeight: 1.2,
          letterSpacing: '-0.01em',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {r.name}
        </p>
        <p style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {r.location?.split(',')[0]}
        </p>
      </div>
    </button>
  );
}

/* ─── Legend dot ─── */
function LegendDot({ color, label, border }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      <span style={{
        width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
        backgroundColor: color,
        border: border ? `1.5px solid ${border}` : undefined,
        boxShadow: border ? 'none' : undefined,
      }} />
      <span style={{ fontSize: 11, color: 'var(--ink-3)', fontWeight: 500 }}>{label}</span>
    </div>
  );
}

/* ─── Selected card ─── */
function SelectedCard({ restaurant: r, onClose, onToggle, onExpand }) {
  const isVisited = r.status === 'visited';
  const image = HERO_IMAGES[r.id];
  return (
    <div style={{ padding: '4px var(--px-sheet) 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        {/* Thumbnail */}
        <div className="img-ph" style={{ width: 56, height: 56, borderRadius: 'var(--r-md)', flexShrink: 0, overflow: 'hidden' }}>
          {image ? (
            <img src={image} alt={r.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', backgroundColor: isVisited ? 'var(--green-soft)' : 'var(--orange-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
              {r.emoji}
            </div>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.015em' }} className="truncate">
            {r.name}
          </p>
          <p style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>
            {r.cuisine?.split('·')[0].trim()} · {r.location?.split(',')[0]}
          </p>
        </div>
        <button
          onClick={onClose}
          style={{
            width: 32, height: 32, borderRadius: '50%',
            backgroundColor: 'var(--surface-2)', border: '1px solid var(--line)',
            fontSize: 16, color: 'var(--ink-3)', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          ×
        </button>
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          onClick={onToggle}
          style={{
            flex: 1, minHeight: 44, borderRadius: 'var(--r-md)', fontSize: 13, fontWeight: 700,
            border: `1.5px solid ${isVisited ? 'var(--green)' : 'var(--orange)'}`,
            color: isVisited ? 'var(--green)' : 'var(--orange)',
            backgroundColor: isVisited ? 'var(--green-soft)' : 'var(--orange-soft)',
          }}
        >
          {isVisited ? '↩ Wishlist' : '✓ Mark Visited'}
        </button>
        <button
          onClick={onExpand}
          style={{
            flex: 1, minHeight: 44, borderRadius: 'var(--r-md)', fontSize: 13, fontWeight: 700,
            backgroundColor: 'var(--ink)', color: '#fff', border: 'none',
          }}
        >
          See all →
        </button>
      </div>
    </div>
  );
}

/* ─── Expanded sheet ─── */
function ExpandedSheet({ restaurants, count, city, onSelect, onCollapse }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px var(--px-sheet) 14px' }}>
        <div>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.02em' }}>
            {count} <em style={{ color: 'var(--orange)', fontStyle: 'italic' }}>spots</em> on this map
          </p>
          <p style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>{city}</p>
        </div>
        <button
          onClick={onCollapse}
          style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-3)', border: 'none', background: 'none' }}
        >
          ↓ Map
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {restaurants.map((r, i) => (
          <ExpandedRow key={r.id} restaurant={r} index={i} onSelect={onSelect} />
        ))}
        {restaurants.length === 0 && (
          <p style={{ textAlign: 'center', padding: '32px 16px', fontSize: 13, color: 'var(--ink-3)' }}>
            No locations with coordinates. Edit a restaurant to add lat/lng.
          </p>
        )}
      </div>
    </div>
  );
}

function ExpandedRow({ restaurant: r, index, onSelect }) {
  const isVisited = r.status === 'visited';
  const image = HERO_IMAGES[r.id];
  return (
    <button
      onClick={() => onSelect(r)}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px var(--px-sheet)',
        borderTop: index !== 0 ? '1px solid var(--line)' : 'none',
        background: 'none', border: index !== 0 ? undefined : 'none',
        width: '100%', textAlign: 'left',
        minHeight: 68,
      }}
    >
      {/* Number marker */}
      <div style={{
        width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
        backgroundColor: isVisited ? 'var(--green)' : 'var(--orange)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11, fontWeight: 700, color: '#fff', fontFamily: 'var(--font-mono)',
      }}>
        {index + 1}
      </div>
      {/* Photo */}
      <div className="img-ph" style={{ width: 48, height: 48, borderRadius: 10, flexShrink: 0, overflow: 'hidden' }}>
        {image ? (
          <img src={image} alt={r.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', backgroundColor: isVisited ? 'var(--green-soft)' : 'var(--orange-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
            {r.emoji}
          </div>
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--font-display)', letterSpacing: '-0.01em' }} className="truncate">
          {r.name}
        </p>
        <p style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }} className="truncate">
          {r.location?.split(',')[0]}
        </p>
      </div>
      <span style={{
        flexShrink: 0,
        fontSize: 11, fontWeight: 700,
        padding: '3px 10px', borderRadius: 999,
        backgroundColor: isVisited ? 'var(--green-soft)' : 'var(--orange-soft)',
        color: isVisited ? 'var(--green)' : 'var(--orange)',
      }}>
        {isVisited ? '✓' : '♡'}
      </span>
    </button>
  );
}

/* ─── Icons ─── */
function LayersIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2"/>
      <polyline points="2 17 12 22 22 17"/>
      <polyline points="2 12 12 17 22 12"/>
    </svg>
  );
}

function LocateIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <line x1="12" y1="2" x2="12" y2="6"/>
      <line x1="12" y1="18" x2="12" y2="22"/>
      <line x1="2" y1="12" x2="6" y2="12"/>
      <line x1="18" y1="12" x2="22" y2="12"/>
    </svg>
  );
}
