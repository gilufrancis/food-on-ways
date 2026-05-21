import { useState } from 'react';
import { useRestaurants } from '../context/RestaurantContext';
import AddRestaurantModal from '../components/AddRestaurantModal';

/* ── Cuisine stamp catalogue ── */
const CUISINES = [
  { id: 'kerala',   label: 'Kerala',       emoji: '🥛' },
  { id: 'malabar',  label: 'Malabar',      emoji: '🍛' },
  { id: 'seafood',  label: 'Seafood',      emoji: '🐟' },
  { id: 'street',   label: 'Street Food',  emoji: '🫓' },
  { id: 'biryani',  label: 'Biryani',      emoji: '🍚' },
  { id: 'south',    label: 'South Indian', emoji: '🥘' },
  { id: 'coastal',  label: 'Coastal',      emoji: '🌊' },
  { id: 'cafe',     label: 'Café',         emoji: '☕' },
  { id: 'heritage', label: 'Heritage',     emoji: '🏛️' },
  { id: 'fusion',   label: 'Fusion',       emoji: '🍱' },
];

export default function Visited() {
  const { restaurants } = useRestaurants();
  const visited = restaurants.filter(r => r.status === 'visited');

  const rated      = visited.filter(r => r.rating);
  const avgRating  = rated.length
    ? (rated.reduce((s, r) => s + r.rating, 0) / rated.length).toFixed(1)
    : null;
  const citySet    = new Set(
    visited.map(r => r.location?.split(',')[1]?.trim() || r.location?.split(',')[0]?.trim()).filter(Boolean)
  );

  const unlockedSet = new Set(
    visited.flatMap(r => (r.cuisine || '').split('·').map(c => c.trim().toLowerCase()))
  );
  const isUnlocked = (c) =>
    unlockedSet.has(c.label.toLowerCase()) ||
    [...unlockedSet].some(u => u.includes(c.id));

  return (
    <div style={{ backgroundColor: 'var(--surface)', minHeight: '100dvh' }}>

      {/* ── Page header ── */}
      <div style={{ padding: '24px var(--px) 20px' }}>
        <p className="t-caps" style={{ color: 'var(--ink-3)', marginBottom: 8 }}>
          Your food diary
        </p>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 28, fontWeight: 500,
          color: 'var(--ink)',
          letterSpacing: '-0.025em',
          lineHeight: 1.05,
        }}>
          Where I've{' '}
          <em style={{ color: 'var(--green)', fontStyle: 'italic' }}>eaten</em>
        </h1>
      </div>

      <div style={{ padding: '0 var(--px)', display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 'calc(80px + env(safe-area-inset-bottom))' }}>

        {/* ── Stats Row (grid grid-cols-3 gap-3) ── */}
        {visited.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: visited.length,         label: 'Visited',  accent: 'var(--orange)' },
              { value: citySet.size || '—',    label: 'Cities',   accent: 'var(--green)'  },
              { value: avgRating ? `${avgRating}★` : '—', label: 'Avg Rating', accent: 'var(--amber)' },
            ].map(({ value, label, accent }) => (
              <div
                key={label}
                style={{
                  backgroundColor: 'var(--surface-2)',
                  borderRadius: 'var(--r-lg)',
                  boxShadow: 'var(--shadow-sm)',
                  border: '1px solid var(--line)',
                  padding: 16,
                  textAlign: 'center',
                }}
              >
                <p style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 26, fontWeight: 700,
                  color: accent,
                  letterSpacing: '-0.025em',
                  lineHeight: 1,
                }}>
                  {value}
                </p>
                <p style={{
                  fontSize: 10, fontWeight: 600,
                  color: 'var(--ink-3)',
                  marginTop: 5,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* ── Cuisine Passport (horizontal scroll) ── */}
        {visited.length > 0 && (
          <div>
            <p className="t-caps" style={{ color: 'var(--ink-3)', marginBottom: 12 }}>
              Cuisine Passport
            </p>
            <div
              className="flex overflow-x-auto scrollbar-hide"
              style={{ gap: 10, paddingBottom: 4 }}
            >
              {CUISINES.map(c => {
                const unlocked = isUnlocked(c);
                return (
                  <div
                    key={c.id}
                    className="shrink-0 flex flex-col items-center rounded-2xl"
                    style={{
                      width: 72,
                      padding: '12px 8px 10px',
                      gap: 7,
                      backgroundColor: unlocked ? '#FFFFFF' : 'var(--surface-3)',
                      boxShadow: unlocked ? '0 4px 16px rgba(46,37,32,0.05)' : 'none',
                      opacity: unlocked ? 1 : 0.5,
                      transition: 'opacity 200ms',
                    }}
                  >
                    <span style={{ fontSize: 22, lineHeight: 1 }}>
                      {unlocked ? c.emoji : '✦'}
                    </span>
                    <p style={{
                      fontSize: 9, fontWeight: 600,
                      color: unlocked ? 'var(--ink-2)' : 'var(--ink-4)',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      lineHeight: 1.3,
                    }}>
                      {c.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Restaurant list ── */}
        {visited.length === 0 ? (
          <EmptyVisited />
        ) : (
          <div>
            <p className="t-caps" style={{ color: 'var(--ink-3)', marginBottom: 12 }}>
              {visited.length} {visited.length === 1 ? 'place' : 'places'} visited
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {visited.map(r => (
                <VisitedCard key={r.id} restaurant={r} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Visited Card — flex row per spec ── */
function VisitedCard({ restaurant: r }) {
  const { dispatch } = useRestaurants();
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing]   = useState(false);

  return (
    <>
      <div
        style={{
          backgroundColor: 'var(--surface-2)',
          borderRadius: 'var(--r-lg)',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--line)',
          cursor: 'pointer',
        }}
        onClick={() => setExpanded(v => !v)}
      >
        {/* Main row */}
        <div className="flex items-start gap-3 p-4">
          {/* Left — icon wrapper */}
          <div style={{
            width: 48, height: 48,
            borderRadius: 12,
            flexShrink: 0,
            backgroundColor: 'var(--green-soft)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22,
          }}>
            {r.emoji}
          </div>

          {/* Center — name, location, stars */}
          <div className="flex-1 min-w-0">
            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize: 15, fontWeight: 600,
              color: 'var(--ink)',
              letterSpacing: '-0.01em',
              lineHeight: 1.2,
            }} className="truncate">
              {r.name}
            </p>
            <p style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 3 }} className="truncate">
              {r.cuisine?.split('·')[0].trim()} · {r.location?.split(',')[0]}
            </p>
            {/* Star rating row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginTop: 6 }} onClick={e => e.stopPropagation()}>
              {[1, 2, 3, 4, 5].map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => dispatch({ type: 'EDIT_RESTAURANT', payload: { id: r.id, rating: s } })}
                  style={{
                    fontSize: 14, lineHeight: 1, border: 'none', background: 'none', padding: '2px 1px',
                    color: s <= (r.rating || 0) ? 'var(--amber)' : 'var(--line)',
                    cursor: 'pointer',
                  }}
                >
                  ★
                </button>
              ))}
              {r.rating > 0 && (
                <span style={{ fontSize: 11, color: 'var(--ink-3)', marginLeft: 3, fontWeight: 600 }}>
                  {r.rating}/5
                </span>
              )}
            </div>
          </div>

          {/* Top-right — badge */}
          <span style={{
            flexShrink: 0,
            backgroundColor: 'var(--green-soft)',
            color: 'var(--green)',
            fontSize: 11, fontWeight: 600,
            padding: '4px 10px',
            borderRadius: 'var(--r-pill)',
            whiteSpace: 'nowrap',
          }}>
            ✓ Visited
          </span>
        </div>

        {/* Expanded actions */}
        {expanded && (
          <div
            style={{ padding: '12px 16px 14px', borderTop: '1px solid var(--line)' }}
            onClick={e => e.stopPropagation()}
          >
            {r.notes && (
              <p style={{ fontSize: 13, color: 'var(--ink-3)', fontStyle: 'italic', marginBottom: 10, lineHeight: 1.5 }}>
                "{r.notes}"
              </p>
            )}
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => dispatch({ type: 'TOGGLE_STATUS', payload: { id: r.id } })}
                style={{
                  flex: 1, minHeight: 40, borderRadius: 12, fontSize: 13, fontWeight: 600,
                  border: '1.5px solid var(--line)', color: 'var(--ink-2)', backgroundColor: 'transparent',
                }}
              >
                ↩ Wishlist
              </button>
              <button
                onClick={() => setEditing(true)}
                style={{
                  flex: 1, minHeight: 40, borderRadius: 12, fontSize: 13, fontWeight: 600,
                  border: '1.5px solid var(--line)', color: 'var(--ink-2)', backgroundColor: 'transparent',
                }}
              >
                Edit
              </button>
              <button
                onClick={() => window.confirm(`Delete "${r.name}"?`) && dispatch({ type: 'DELETE_RESTAURANT', payload: r.id })}
                style={{
                  flex: 1, minHeight: 40, borderRadius: 12, fontSize: 13, fontWeight: 600,
                  border: '1.5px solid var(--coral-soft)', color: 'var(--coral)', backgroundColor: 'var(--coral-soft)',
                }}
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>

      {editing && <AddRestaurantModal existing={r} onClose={() => setEditing(false)} />}
    </>
  );
}

/* ── Empty state ── */
function EmptyVisited() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingTop: 48, paddingBottom: 24 }}>
      <div style={{
        width: 80, height: 80, borderRadius: 'var(--r-xl)',
        backgroundColor: 'var(--green-soft)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 36, marginBottom: 18,
      }}>
        ✅
      </div>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 500, color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: 8 }}>
        No <em style={{ color: 'var(--green)' }}>visited</em> places yet
      </p>
      <p style={{ fontSize: 14, color: 'var(--ink-3)', lineHeight: 1.55, maxWidth: 240 }}>
        Open any wishlist restaurant and mark it as visited
      </p>
    </div>
  );
}
