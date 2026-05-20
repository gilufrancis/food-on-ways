import { useState } from 'react';
import { useRestaurants } from '../context/RestaurantContext';
import AddRestaurantModal from './AddRestaurantModal';

function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => onChange && setHover(star)}
          onMouseLeave={() => onChange && setHover(0)}
          onClick={() => onChange && onChange(star)}
          /* 44×44 minimum tap area */
          className={`flex items-center justify-center ${
            onChange ? 'cursor-pointer' : 'cursor-default'
          }`}
          style={{ width: '36px', height: '36px', fontSize: '22px', lineHeight: 1 }}
          aria-label={`${star} star`}
        >
          <span className={star <= (hover || value) ? 'text-yellow-400' : 'text-gray-200'}>
            ★
          </span>
        </button>
      ))}
    </div>
  );
}

export default function RestaurantCard({ restaurant, showRating = false }) {
  const { dispatch } = useRestaurants();
  const [editing, setEditing] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const { id, emoji, name, cuisine, location, status, rating, notes, createdAt } = restaurant;

  function handleDelete() {
    if (confirm(`Delete "${name}"?`)) {
      dispatch({ type: 'DELETE_RESTAURANT', payload: id });
    }
  }

  function handleToggle() {
    dispatch({ type: 'TOGGLE_STATUS', payload: id });
  }

  function handleRating(val) {
    dispatch({ type: 'EDIT_RESTAURANT', payload: { id, rating: val } });
  }

  const statusColor =
    status === 'visited' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700';
  const statusLabel = status === 'visited' ? 'Visited' : 'Wishlist';

  return (
    <>
      <div
        className="bg-white rounded-2xl border border-gray-100 shadow-sm active:shadow-sm hover:shadow-md transition-shadow cursor-pointer select-none"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="p-4">
          <div className="flex items-start gap-3">
            <span className="text-3xl leading-none mt-0.5 shrink-0">{emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-gray-900 text-base leading-snug">{name}</h3>
                <span className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${statusColor}`}>
                  {statusLabel}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {cuisine && (
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{cuisine}</span>
                )}
                {location && (
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {location}
                  </span>
                )}
              </div>

              {showRating && status === 'visited' && (
                <div className="mt-1 -ml-1" onClick={(e) => e.stopPropagation()}>
                  <StarRating value={rating || 0} onChange={handleRating} />
                </div>
              )}
            </div>
          </div>

          {/* Expand chevron hint */}
          <div className="flex justify-center mt-2">
            <svg
              className={`w-4 h-4 text-gray-300 transition-transform ${expanded ? 'rotate-180' : ''}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {expanded && (
            <div className="mt-2 pt-3 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
              {notes && <p className="text-sm text-gray-600 mb-3">{notes}</p>}
              <p className="text-xs text-gray-400 mb-3">
                Added{' '}
                {new Date(createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>

              {/* Action buttons — min 44px height for touch */}
              <div className="flex gap-2">
                <button
                  onClick={handleToggle}
                  className="flex-1 rounded-xl border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                  style={{ minHeight: '44px' }}
                >
                  {status === 'wishlist' ? '✓ Mark Visited' : '↺ Move to Wishlist'}
                </button>
                <button
                  onClick={() => setEditing(true)}
                  className="flex-1 rounded-xl border border-blue-200 text-xs font-medium text-blue-600 hover:bg-blue-50 active:bg-blue-100 transition-colors"
                  style={{ minHeight: '44px' }}
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 rounded-xl border border-red-200 text-xs font-medium text-red-500 hover:bg-red-50 active:bg-red-100 transition-colors"
                  style={{ minHeight: '44px' }}
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {editing && (
        <AddRestaurantModal existing={restaurant} onClose={() => setEditing(false)} />
      )}
    </>
  );
}
