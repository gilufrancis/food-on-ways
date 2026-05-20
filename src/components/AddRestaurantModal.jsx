import { useState, useEffect } from 'react';
import { useRestaurants } from '../context/RestaurantContext';

const EMOJIS = [
  '🍛','🍜','🍝','🍣','🍱','🥘','🍲','🫕','🥗','🍔',
  '🍕','🌮','🌯','🥙','🧆','🍤','🦞','🦐','🐟','🥩',
  '🍗','🍖','🥚','🧇','🥞','🧁','🍰','🍮','🍡','🍢',
  '☕','🧋','🍵','🥤','🍹','🫖','🍺','🍻','🥂','🍷',
];

const DEFAULT_FORM = {
  emoji: '🍛',
  name: '',
  cuisine: '',
  location: '',
  lat: '',
  lng: '',
  status: 'wishlist',
  rating: null,
  notes: '',
};

export default function AddRestaurantModal({ onClose, existing }) {
  const { dispatch } = useRestaurants();
  const [form, setForm] = useState(
    existing
      ? { ...existing, lat: String(existing.lat ?? ''), lng: String(existing.lng ?? '') }
      : DEFAULT_FORM
  );
  const [errors, setErrors] = useState({});

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Restaurant name is required';
    if (form.lat && isNaN(Number(form.lat))) errs.lat = 'Must be a number';
    if (form.lng && isNaN(Number(form.lng))) errs.lng = 'Must be a number';
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const payload = {
      ...form,
      name: form.name.trim(),
      lat: form.lat ? Number(form.lat) : null,
      lng: form.lng ? Number(form.lng) : null,
    };

    if (existing) {
      dispatch({ type: 'EDIT_RESTAURANT', payload });
    } else {
      dispatch({
        type: 'ADD_RESTAURANT',
        payload: { ...payload, id: crypto.randomUUID(), createdAt: new Date().toISOString() },
      });
    }
    onClose();
  }

  const inputClass = (hasError) =>
    `w-full px-3 rounded-xl border text-base focus:outline-none focus:ring-2 focus:ring-orange-400 ${
      hasError ? 'border-red-400' : 'border-gray-200'
    }`;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/*
        Mobile: slides up from bottom (bottom sheet)
        Desktop: centred card
      */}
      <div
        className="
          bg-white w-full overflow-y-auto shadow-2xl
          rounded-t-3xl md:rounded-2xl
          max-h-[92dvh] md:max-h-[90vh] md:max-w-md
        "
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {/* Drag handle (mobile visual hint) */}
        <div className="md:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        {/* Header */}
        <div className="sticky top-0 bg-white px-5 pt-3 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {existing ? 'Edit Restaurant' : 'Add Restaurant'}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 text-xl leading-none"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-5">
          {/* Emoji picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
            {/* 8 cols on mobile, 10 on desktop */}
            <div className="grid grid-cols-8 md:grid-cols-10 gap-1 p-2 bg-gray-50 rounded-xl max-h-36 overflow-y-auto">
              {EMOJIS.map((em) => (
                <button
                  type="button"
                  key={em}
                  onClick={() => set('emoji', em)}
                  className={`flex items-center justify-center rounded-xl transition-colors ${
                    form.emoji === em ? 'bg-orange-100 ring-2 ring-orange-400' : 'hover:bg-gray-200 active:bg-gray-300'
                  }`}
                  style={{ fontSize: '22px', aspectRatio: '1', minHeight: '40px' }}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Restaurant Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="e.g. Paragon Restaurant"
              className={inputClass(errors.name)}
              style={{ height: '48px' }}
              autoComplete="off"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Cuisine */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Cuisine Type</label>
            <input
              type="text"
              value={form.cuisine}
              onChange={(e) => set('cuisine', e.target.value)}
              placeholder="e.g. Kerala, Seafood, Italian"
              className={inputClass(false)}
              style={{ height: '48px' }}
              autoComplete="off"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => set('location', e.target.value)}
              placeholder="e.g. Kozhikode, Kerala"
              className={inputClass(false)}
              style={{ height: '48px' }}
              autoComplete="off"
            />
          </div>

          {/* Lat / Lng */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Latitude</label>
              <input
                type="text"
                inputMode="decimal"
                value={form.lat}
                onChange={(e) => set('lat', e.target.value)}
                placeholder="11.2588"
                className={inputClass(errors.lat)}
                style={{ height: '48px' }}
              />
              {errors.lat && <p className="text-red-500 text-xs mt-1">{errors.lat}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Longitude</label>
              <input
                type="text"
                inputMode="decimal"
                value={form.lng}
                onChange={(e) => set('lng', e.target.value)}
                placeholder="75.7804"
                className={inputClass(errors.lng)}
                style={{ height: '48px' }}
              />
              {errors.lng && <p className="text-red-500 text-xs mt-1">{errors.lng}</p>}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
              placeholder="Any notes about this place…"
              rows={2}
              className="w-full px-3 py-3 rounded-xl border border-gray-200 text-base focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <div className="flex gap-3">
              {['wishlist', 'visited'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => set('status', s)}
                  className={`flex-1 rounded-xl text-sm font-medium border-2 transition-colors ${
                    form.status === s
                      ? s === 'visited'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-gray-200 text-gray-500'
                  }`}
                  style={{ minHeight: '48px' }}
                >
                  {s === 'wishlist' ? '❤️ Want to Visit' : '✅ Already Visited'}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1 pb-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              style={{ minHeight: '50px' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl text-sm font-semibold text-white transition-colors"
              style={{ backgroundColor: '#ff5c28', minHeight: '50px' }}
            >
              {existing ? 'Save Changes' : 'Add Restaurant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
