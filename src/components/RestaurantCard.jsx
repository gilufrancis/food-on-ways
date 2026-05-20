import { useState } from 'react';
import { useRestaurants } from '../context/RestaurantContext';
import AddRestaurantModal from './AddRestaurantModal';

function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onMouseEnter={() => onChange && setHover(star)}
            onMouseLeave={() => onChange && setHover(0)}
            onClick={() => onChange && onChange(star)}
            className={`flex items-center justify-center ${onChange ? 'cursor-pointer' : 'cursor-default'}`}
            style={{ width: '28px', height: '28px', fontSize: '18px' }}
          >
            <span className={star <= (hover || value) ? 'text-amber-400' : 'text-gray-200'}>★</span>
          </button>
        ))}
      </div>
      {value > 0 && (
        <span className="text-xs text-gray-400 ml-1">{value}/5</span>
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
  const accentColor = isVisited ? '#22c55e' : '#ff5c28';
  const emojiBg = isVisited ? '#f0fdf4' : '#fff7ed';

  function handleDelete() {
    if (confirm(`Delete "${name}"?`)) {
      dispatch({ type: 'DELETE_RESTAURANT', payload: id });
    }
  }

  return (
    <>
      <div
        className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer select-none"
        onClick={() => setExpanded((v) => !v)}
      >
        {/* Left accent bar + content */}
        <div className="flex" style={{ borderLeft: `4px solid ${accentColor}` }}>
          <div className="flex gap-3 p-4 flex-1 min-w-0">
            {/* Emoji avatar */}
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
              style={{ backgroundColor: emojiBg }}
            >
              {emoji}
            </div>

            {/* Main info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-gray-900 text-[15px] leading-snug">{name}</h3>
                <span
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0"
                  style={{
                    backgroundColor: isVisited ? '#dcfce7' : '#fff7ed',
                    color: isVisited ? '#16a34a' : '#ea580c',
                  }}
                >
                  {isVisited ? '✓ Visited' : '♡ Wishlist'}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                {cuisine && (
                  <span className="text-[11px] font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    {cuisine}
                  </span>
                )}
                {location && (
                  <span className="text-[11px] text-gray-400 flex items-center gap-0.5">
                    <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                    </svg>
                    {location}
                  </span>
                )}
              </div>

              {showRating && isVisited && (
                <div className="mt-2" onClick={(e) => e.stopPropagation()}>
                  <StarRating
                    value={rating || 0}
                    onChange={(val) => dispatch({ type: 'EDIT_RESTAURANT', payload: { id, rating: val } })}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Chevron */}
          <div className="flex items-center pr-3 pl-1">
            <svg
              className={`w-4 h-4 text-gray-300 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Expanded panel */}
        {expanded && (
          <div
            className="border-t mx-4 pt-3 pb-4"
            style={{ borderColor: '#f3f4f6' }}
            onClick={(e) => e.stopPropagation()}
          >
            {notes && (
              <p className="text-sm text-gray-500 mb-3 leading-relaxed">"{notes}"</p>
            )}
            <p className="text-[11px] text-gray-400 mb-3">
              Added {new Date(createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => dispatch({ type: 'TOGGLE_STATUS', payload: id })}
                className="flex-1 text-xs font-semibold rounded-xl border-2 transition-colors"
                style={{
                  minHeight: '40px',
                  borderColor: accentColor,
                  color: accentColor,
                  backgroundColor: emojiBg,
                }}
              >
                {isVisited ? '↩ Move to Wishlist' : '✓ Mark Visited'}
              </button>
              <button
                onClick={() => setEditing(true)}
                className="px-4 text-xs font-semibold rounded-xl border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                style={{ minHeight: '40px' }}
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="px-4 text-xs font-semibold rounded-xl border-2 border-red-100 text-red-500 hover:bg-red-50 transition-colors"
                style={{ minHeight: '40px' }}
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>

      {editing && (
        <AddRestaurantModal existing={restaurant} onClose={() => setEditing(false)} />
      )}
    </>
  );
}
