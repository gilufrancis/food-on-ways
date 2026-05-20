import { useState, useEffect } from 'react';
import { useRestaurants } from '../context/RestaurantContext';

const EMOJIS = [
  '🍛','🍜','🍝','🍣','🍱','🥘','🍲','🫕','🥗','🍔',
  '🍕','🌮','🌯','🥙','🧆','🍤','🦞','🦐','🐟','🥩',
  '🍗','🍖','🥚','🧇','🥞','🧁','🍰','🍮','🍡','🍢',
  '☕','🧋','🍵','🥤','🍹','🫖','🍺','🍻','🥂','🍷',
];

const DEFAULT = { emoji: '🍛', name: '', cuisine: '', location: '', lat: '', lng: '', status: 'wishlist', rating: null, notes: '' };

const BRAND = 'linear-gradient(135deg, #ff5c28 0%, #ff7d45 100%)';

export default function AddRestaurantModal({ onClose, existing }) {
  const { dispatch } = useRestaurants();
  const [form, setForm] = useState(
    existing ? { ...existing, lat: String(existing.lat ?? ''), lng: String(existing.lng ?? '') } : DEFAULT
  );
  const [errors, setErrors] = useState({});

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const set = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    setErrors(e => ({ ...e, [field]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (form.lat && isNaN(+form.lat)) e.lat = 'Must be a number';
    if (form.lng && isNaN(+form.lng)) e.lng = 'Must be a number';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const payload = { ...form, name: form.name.trim(), lat: form.lat ? +form.lat : null, lng: form.lng ? +form.lng : null };
    if (existing) {
      dispatch({ type: 'EDIT_RESTAURANT', payload });
    } else {
      dispatch({ type: 'ADD_RESTAURANT', payload: { ...payload, id: crypto.randomUUID(), createdAt: new Date().toISOString() } });
    }
    onClose();
  };

  const inputStyle = (err) => ({
    height: 52, paddingLeft: 14, paddingRight: 14, fontSize: 15,
    borderRadius: 14, border: `1.5px solid ${err ? '#f87171' : '#e5e7eb'}`,
    width: '100%', background: '#fff', outline: 'none',
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(2px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white w-full overflow-y-auto rounded-t-3xl md:rounded-2xl md:max-w-md"
        style={{
          maxHeight: '94dvh',
          paddingBottom: 'env(safe-area-inset-bottom)',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.18)',
        }}
      >
        {/* Drag handle */}
        <div className="md:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1.5 rounded-full bg-gray-200" />
        </div>

        {/* Header */}
        <div className="sticky top-0 bg-white flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-lg font-extrabold text-gray-900">
            {existing ? 'Edit Restaurant' : 'Add Restaurant'}
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full text-gray-500 text-xl font-bold"
            style={{ backgroundColor: '#f3f4f6' }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-5 space-y-5">

          {/* Emoji picker */}
          <div>
            <Label>Icon</Label>
            <div className="grid grid-cols-8 gap-1.5 p-3 bg-gray-50 rounded-2xl max-h-40 overflow-y-auto">
              {EMOJIS.map(em => (
                <button
                  type="button" key={em}
                  onClick={() => set('emoji', em)}
                  className="flex items-center justify-center rounded-xl transition-all"
                  style={{
                    fontSize: 24, aspectRatio: '1', minHeight: 44,
                    backgroundColor: form.emoji === em ? '#fff2ee' : 'transparent',
                    outline: form.emoji === em ? '2px solid #ff5c28' : 'none',
                    outlineOffset: -2,
                  }}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <Label required>Restaurant Name</Label>
            <input
              type="text" value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="e.g. Paragon Restaurant"
              style={inputStyle(errors.name)} autoComplete="off"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1.5">{errors.name}</p>}
          </div>

          {/* Cuisine */}
          <div>
            <Label>Cuisine Type</Label>
            <input
              type="text" value={form.cuisine}
              onChange={e => set('cuisine', e.target.value)}
              placeholder="Kerala, Seafood, Italian…"
              style={inputStyle(false)} autoComplete="off"
            />
          </div>

          {/* Location */}
          <div>
            <Label>Location</Label>
            <input
              type="text" value={form.location}
              onChange={e => set('location', e.target.value)}
              placeholder="Kozhikode, Kerala"
              style={inputStyle(false)} autoComplete="off"
            />
          </div>

          {/* Lat / Lng */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Latitude</Label>
              <input type="text" inputMode="decimal" value={form.lat}
                onChange={e => set('lat', e.target.value)}
                placeholder="11.2588" style={inputStyle(errors.lat)} />
              {errors.lat && <p className="text-red-500 text-xs mt-1">{errors.lat}</p>}
            </div>
            <div>
              <Label>Longitude</Label>
              <input type="text" inputMode="decimal" value={form.lng}
                onChange={e => set('lng', e.target.value)}
                placeholder="75.7804" style={inputStyle(errors.lng)} />
              {errors.lng && <p className="text-red-500 text-xs mt-1">{errors.lng}</p>}
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label>Notes</Label>
            <textarea
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              placeholder="Any notes about this place…"
              rows={2}
              style={{ ...inputStyle(false), height: 'auto', paddingTop: 14, paddingBottom: 14, resize: 'none' }}
            />
          </div>

          {/* Status */}
          <div>
            <Label>Status</Label>
            <div className="flex gap-3">
              {[
                { val: 'wishlist', label: '❤️ Want to Visit',   border: '#ff5c28', bg: '#fff7ed', clr: '#c2410c' },
                { val: 'visited',  label: '✅ Already Visited', border: '#22c55e', bg: '#f0fdf4', clr: '#15803d' },
              ].map(({ val, label, border, bg, clr }) => (
                <button
                  key={val} type="button" onClick={() => set('status', val)}
                  className="flex-1 text-sm font-semibold rounded-2xl transition-all"
                  style={{
                    minHeight: 52,
                    border: `2px solid ${form.status === val ? border : '#e5e7eb'}`,
                    backgroundColor: form.status === val ? bg : '#fafafa',
                    color: form.status === val ? clr : '#9ca3af',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1 pb-2">
            <button
              type="button" onClick={onClose}
              className="flex-1 text-sm font-semibold text-gray-600 rounded-2xl"
              style={{ minHeight: 54, border: '1.5px solid #e5e7eb', backgroundColor: '#fafafa' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 text-sm font-bold text-white rounded-2xl"
              style={{ minHeight: 54, background: BRAND, boxShadow: '0 4px 14px rgba(255,92,40,0.4)' }}
            >
              {existing ? 'Save Changes' : 'Add Restaurant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Label({ children, required }) {
  return (
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      {children}{required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
  );
}
