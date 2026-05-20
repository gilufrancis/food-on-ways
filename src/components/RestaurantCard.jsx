import { useState } from 'react';
import { useRestaurants } from '../context/RestaurantContext';
import AddRestaurantModal from './AddRestaurantModal';

/* ── Star rating ── */
function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1.5 mt-2">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            type="button"
            onMouseEnter={() => onChange && setHover(s)}
            onMouseLeave={() => onChange && setHover(0)}
            onClick={() => onChange && onChange(s)}
            style={{ width: 32, height: 32, fontSize: 20 }}
            className={`flex items-center justify-center ${onChange ? 'cursor-pointer' : 'cursor-default'}`}
          >
            <span style={{ color: s <= (hover || value) ? '#f59e0b' : '#e5e7eb' }}>★</span>
          </button>
        ))}
      </div>
      {value > 0 && (
        <span className="text-sm text-gray-400 font-medium">{value}/5</span>
      )}
    </div>
  );
}

/* ── Main card ── */
export default function RestaurantCard({ restaurant, showRating = false }) {
  const { dispatch } = useRestaurants();
  const [editing, setEditing] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const { id, emoji, name, cuisine, location, status, rating, notes, createdAt } = restaurant;
  const isVisited = status === 'visited';

  const accent   = isVisited ? '#22c55e' : '#ff5c28';
  const emojiBg  = isVisited ? '#f0fdf4' : '#fff7ed';
  const badgeBg  = isVisited ? '#dcfce7' : '#ffedd5';
  const badgeClr = isVisited ? '#15803d' : '#c2410c';

  return (
    <>
      <div
        className="bg-white rounded-2xl overflow-hidden select-none"
        style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.07)' }}
        onClick={() => setExpanded(v => !v)}
      >
        {/* ── Card body ── */}
        <div className="flex items-center gap-3 px-4 py-4" style={{ borderLeft: `4px solid ${accent}` }}>
          {/* Emoji avatar */}
          <div
            className="rounded-2xl flex items-center justify-center shrink-0 text-3xl"
            style={{ width: 56, height: 56, backgroundColor: emojiBg }}
          >
            {emoji}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            {/* Name + badge row */}
            <div className="flex items-start justify-between gap-2">
              <p className="font-semibold text-gray-900 leading-snug" style={{ fontSize: 16 }}>
                {name}
              </p>
              <span
                className="shrink-0 font-semibold rounded-full px-3 py-1 text-xs leading-none"
                style={{ backgroundColor: badgeBg, color: badgeClr, whiteSpace: 'nowrap' }}
              >
                {isVisited ? '✓ Visited' : '♡ Wishlist'}
              </span>
            </div>

            {/* Tags row */}
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              {cuisine && (
                <span className="text-xs font-medium text-gray-500 bg-gray-100 rounded-full px-2.5 py-1">
                  {cuisine}
                </span>
              )}
              {location && (
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                  </svg>
                  {location}
                </span>
              )}
            </div>

            {/* Star rating (Visited page) */}
            {showRating && isVisited && (
              <div onClick={e => e.stopPropagation()}>
                <StarRating
                  value={rating || 0}
                  onChange={val => dispatch({ type: 'EDIT_RESTAURANT', payload: { id, rating: val } })}
                />
              </div>
            )}
          </div>

          {/* Chevron */}
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="#c4c4c4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            className="shrink-0 transition-transform duration-200"
            style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>

        {/* ── Expanded actions ── */}
        {expanded && (
          <div
            className="px-4 pb-4 pt-3"
            style={{ borderTop: '1px solid #f3f4f6', borderLeft: `4px solid ${accent}` }}
            onClick={e => e.stopPropagation()}
          >
            {notes && (
              <p className="text-sm text-gray-500 leading-relaxed mb-3 italic">"{notes}"</p>
            )}
            <p className="text-xs text-gray-400 mb-4">
              Added {new Date(createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => dispatch({ type: 'TOGGLE_STATUS', payload: id })}
                className="flex-1 text-sm font-semibold rounded-xl"
                style={{ minHeight: 48, border: `1.5px solid ${accent}`, color: accent, backgroundColor: emojiBg }}
              >
                {isVisited ? '↩ Wishlist' : '✓ Visited'}
              </button>
              <button
                onClick={() => setEditing(true)}
                className="px-5 text-sm font-semibold rounded-xl text-gray-600"
                style={{ minHeight: 48, border: '1.5px solid #e5e7eb', backgroundColor: '#f9fafb' }}
              >
                Edit
              </button>
              <button
                onClick={() => confirm(`Delete "${name}"?`) && dispatch({ type: 'DELETE_RESTAURANT', payload: id })}
                className="px-5 text-sm font-semibold rounded-xl text-red-500"
                style={{ minHeight: 48, border: '1.5px solid #fecaca', backgroundColor: '#fff5f5' }}
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
