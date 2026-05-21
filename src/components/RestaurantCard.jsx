import { useState } from 'react';
import { useRestaurants } from '../context/RestaurantContext';
import AddRestaurantModal from './AddRestaurantModal';
import Pill from './Pill';

function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1 mt-2">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onMouseEnter={() => onChange && setHover(s)}
          onMouseLeave={() => onChange && setHover(0)}
          onClick={() => onChange && onChange(s)}
          style={{ width: 28, height: 28, fontSize: 18, border: 'none', background: 'none', padding: 0, cursor: onChange ? 'pointer' : 'default' }}
        >
          <span style={{ color: s <= (hover || value) ? 'var(--amber)' : 'var(--line)' }}>★</span>
        </button>
      ))}
      {value > 0 && (
        <span style={{ fontSize: 12, color: 'var(--ink-3)', fontWeight: 600, marginLeft: 2 }}>{value}/5</span>
      )}
    </div>
  );
}

export default function RestaurantCard({ restaurant, showRating = false }) {
  const { dispatch } = useRestaurants();
  const [editing, setEditing] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const { id, emoji, name, cuisine, location, status, rating, notes, createdAt } = restaurant;
  const isVisited = status === 'visited';

  const accentColor = isVisited ? 'var(--green)' : 'var(--orange)';
  const emojiBg     = isVisited ? 'var(--green-soft)' : 'var(--orange-soft)';

  return (
    <>
      <div
        className="overflow-hidden select-none"
        style={{
          borderRadius: 'var(--r-lg)',
          backgroundColor: 'var(--surface)',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--line)',
          borderLeft: `3px solid ${accentColor}`,
          cursor: 'pointer',
        }}
        onClick={() => setExpanded(v => !v)}
      >
        {/* Card body */}
        <div className="flex items-center gap-3 px-4 py-3.5">
          {/* Emoji */}
          <div style={{ width: 52, height: 52, borderRadius: 'var(--r-md)', backgroundColor: emojiBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>
            {emoji}
          </div>

          <div className="flex-1 min-w-0">
            {/* Name + badge */}
            <div className="flex items-start justify-between gap-2">
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.01em', lineHeight: 1.2 }} className="truncate">
                {name}
              </p>
              <Pill variant={isVisited ? 'green' : 'coral'} style={{ fontSize: 11, flexShrink: 0 }}>
                {isVisited ? '✓ Visited' : '♡ Wishlist'}
              </Pill>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
              {cuisine && (
                <span style={{ fontSize: 12, color: 'var(--ink-3)', fontWeight: 500 }}>{cuisine.split('·')[0].trim()}</span>
              )}
              {location && (
                <span style={{ fontSize: 12, color: 'var(--ink-4)' }}>· {location.split(',')[0]}</span>
              )}
            </div>

            {showRating && isVisited && (
              <div onClick={e => e.stopPropagation()}>
                <StarRating value={rating || 0} onChange={val => dispatch({ type: 'EDIT_RESTAURANT', payload: { id, rating: val } })} />
              </div>
            )}
          </div>

          {/* Chevron */}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ink-4)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            style={{ flexShrink: 0, transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 200ms' }}>
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>

        {/* Expanded actions */}
        {expanded && (
          <div
            className="px-4 pb-4 pt-3"
            style={{ borderTop: '1px solid var(--line)' }}
            onClick={e => e.stopPropagation()}
          >
            {notes && (
              <p style={{ fontSize: 13, color: 'var(--ink-3)', lineHeight: 1.5, marginBottom: 10, fontStyle: 'italic' }}>"{notes}"</p>
            )}
            <p style={{ fontSize: 11, color: 'var(--ink-4)', marginBottom: 14, fontFamily: 'var(--font-mono)' }}>
              Added {new Date(createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => dispatch({ type: 'TOGGLE_STATUS', payload: { id } })}
                className="flex-1 text-sm font-semibold"
                style={{
                  minHeight: 44, borderRadius: 'var(--r-md)',
                  border: `1.5px solid ${accentColor}`,
                  color: accentColor, backgroundColor: emojiBg,
                }}
              >
                {isVisited ? '↩ Wishlist' : '✓ Mark Visited'}
              </button>
              <button
                onClick={() => setEditing(true)}
                className="px-4 text-sm font-semibold"
                style={{ minHeight: 44, borderRadius: 'var(--r-md)', border: '1.5px solid var(--line)', color: 'var(--ink-2)', backgroundColor: 'var(--surface-2)' }}
              >
                Edit
              </button>
              <button
                onClick={() => window.confirm(`Delete "${name}"?`) && dispatch({ type: 'DELETE_RESTAURANT', payload: id })}
                className="px-4 text-sm font-semibold"
                style={{ minHeight: 44, borderRadius: 'var(--r-md)', border: '1.5px solid var(--coral-soft)', color: 'var(--coral)', backgroundColor: 'var(--coral-soft)' }}
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
