import { useState } from 'react';
import { useRestaurants } from '../context/RestaurantContext';
import AddRestaurantModal from './AddRestaurantModal';

export default function RestaurantCard({ restaurant, showRating = false }) {
  const { dispatch } = useRestaurants();
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing]   = useState(false);

  const { id, emoji, name, cuisine, location, status, rating, notes, createdAt } = restaurant;
  const isVisited = status === 'visited';

  const iconBg   = isVisited ? 'var(--green-soft)' : 'var(--orange-soft)';
  const badgeBg  = isVisited ? 'var(--green-soft)'  : '#FFF0EB';
  const badgeClr = isVisited ? 'var(--green)'        : 'var(--orange)';
  const badgeLabel = isVisited ? '✓ Visited' : '♡ Wishlist';

  return (
    <>
      <div
        style={{
          backgroundColor: 'var(--surface-2)',
          borderRadius: 'var(--r-lg)',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--line)',
          cursor: 'pointer',
          overflow: 'hidden',
        }}
        onClick={() => setExpanded(v => !v)}
      >
        {/* ── Main flex row ── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: 16 }}>

          {/* Left — icon wrapper */}
          <div style={{
            width: 48, height: 48,
            borderRadius: 12,
            flexShrink: 0,
            backgroundColor: iconBg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22,
          }}>
            {emoji}
          </div>

          {/* Center — name, location, optional stars */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize: 15, fontWeight: 600,
              color: 'var(--ink)',
              letterSpacing: '-0.01em',
              lineHeight: 1.2,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {name}
            </p>
            <p style={{
              fontSize: 12, color: 'var(--ink-3)', marginTop: 3,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {cuisine?.split('·')[0].trim()}
              {location ? ` · ${location.split(',')[0]}` : ''}
            </p>

            {/* Star rating — only on visited cards when showRating */}
            {showRating && isVisited && (
              <div
                style={{ display: 'flex', alignItems: 'center', gap: 2, marginTop: 6 }}
                onClick={e => e.stopPropagation()}
              >
                {[1, 2, 3, 4, 5].map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => dispatch({ type: 'EDIT_RESTAURANT', payload: { id, rating: s } })}
                    style={{
                      fontSize: 14, lineHeight: 1, border: 'none', background: 'none', padding: '2px 1px',
                      color: s <= (rating || 0) ? 'var(--amber)' : 'var(--line)',
                      cursor: 'pointer',
                    }}
                  >
                    ★
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Top-right — status badge */}
          <span style={{
            flexShrink: 0,
            backgroundColor: badgeBg,
            color: badgeClr,
            fontSize: 11, fontWeight: 600,
            padding: '4px 10px',
            borderRadius: 999,
            whiteSpace: 'nowrap',
            alignSelf: 'flex-start',
          }}>
            {badgeLabel}
          </span>
        </div>

        {/* ── Expanded panel ── */}
        {expanded && (
          <div
            style={{ padding: '12px 16px 14px', borderTop: '1px solid var(--line)' }}
            onClick={e => e.stopPropagation()}
          >
            {notes && (
              <p style={{ fontSize: 13, color: 'var(--ink-3)', fontStyle: 'italic', marginBottom: 10, lineHeight: 1.5 }}>
                "{notes}"
              </p>
            )}
            <p style={{ fontSize: 11, color: 'var(--ink-4)', fontFamily: 'var(--font-mono)', marginBottom: 12 }}>
              Added {new Date(createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => dispatch({ type: 'TOGGLE_STATUS', payload: { id } })}
                style={{
                  flex: 1, minHeight: 40, borderRadius: 12, fontSize: 13, fontWeight: 600,
                  border: `1.5px solid ${isVisited ? 'var(--green)' : 'var(--orange)'}`,
                  color: isVisited ? 'var(--green)' : 'var(--orange)',
                  backgroundColor: isVisited ? 'var(--green-soft)' : 'var(--orange-soft)',
                }}
              >
                {isVisited ? '↩ Wishlist' : '✓ Mark Visited'}
              </button>
              <button
                onClick={() => setEditing(true)}
                style={{
                  paddingLeft: 16, paddingRight: 16, minHeight: 40, borderRadius: 12,
                  fontSize: 13, fontWeight: 600,
                  border: '1.5px solid var(--line)', color: 'var(--ink-2)', backgroundColor: 'transparent',
                }}
              >
                Edit
              </button>
              <button
                onClick={() => window.confirm(`Delete "${name}"?`) && dispatch({ type: 'DELETE_RESTAURANT', payload: id })}
                style={{
                  paddingLeft: 14, paddingRight: 14, minHeight: 40, borderRadius: 12,
                  fontSize: 13, fontWeight: 600,
                  border: '1.5px solid var(--coral-soft)', color: 'var(--coral)', backgroundColor: 'var(--coral-soft)',
                }}
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>

      {editing && <AddRestaurantModal existing={restaurant} onClose={() => setEditing(false)} />}
    </>
  );
}
