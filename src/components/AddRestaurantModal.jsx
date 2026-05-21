import { useState, useEffect } from 'react';
import { useRestaurants } from '../context/RestaurantContext';

const EMOJIS = [
  '🍛','🍜','🍝','🍣','🍱','🥘','🍲','🫕','🥗','🍔',
  '🍕','🌮','🌯','🥙','🧆','🍤','🦞','🦐','🐟','🥩',
  '🍗','🍖','🥚','🧇','🥞','🧁','🍰','🍮','🍡','🍢',
  '☕','🧋','🍵','🥤','🍹','🫖','🍺','🍻','🥂','🍷',
];

const DEFAULT = {
  emoji: '🍛', name: '', cuisine: '', location: '',
  lat: '', lng: '', status: 'wishlist', rating: null, notes: '',
};

const PX = 24; /* modal horizontal padding */

export default function AddRestaurantModal({ onClose, existing }) {
  const { dispatch } = useRestaurants();
  const [form, setForm] = useState(
    existing
      ? { ...existing, lat: String(existing.lat ?? ''), lng: String(existing.lng ?? '') }
      : DEFAULT
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

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const payload = {
      ...form,
      name: form.name.trim(),
      lat: form.lat ? +form.lat : null,
      lng: form.lng ? +form.lng : null,
    };
    if (existing) {
      dispatch({ type: 'EDIT_RESTAURANT', payload });
    } else {
      dispatch({ type: 'ADD_RESTAURANT', payload: { ...payload, id: crypto.randomUUID(), createdAt: new Date().toISOString() } });
    }
    onClose();
  };

  const field = (err) => ({
    height: 50,
    paddingLeft: 14, paddingRight: 14,
    fontSize: 14,
    borderRadius: 'var(--r-md)',
    border: `1.5px solid ${err ? 'var(--coral)' : 'var(--line)'}`,
    backgroundColor: 'var(--surface-2)',
    color: 'var(--ink)',
    outline: 'none',
    width: '100%',
    fontFamily: 'var(--font-ui)',
  });

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        backgroundColor: 'rgba(26,21,18,0.55)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          width: '100%', maxWidth: 448,
          maxHeight: '94dvh',
          backgroundColor: 'var(--surface)',
          borderRadius: '28px 28px 0 0',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 12, paddingBottom: 4, flexShrink: 0 }}>
          <div style={{ width: 36, height: 4, borderRadius: 99, backgroundColor: 'var(--line)' }} />
        </div>

        {/* Sticky header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: `14px ${PX}px 14px`,
          borderBottom: '1px solid var(--line)',
          backgroundColor: 'var(--surface)',
          flexShrink: 0,
        }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 20, fontWeight: 600,
            color: 'var(--ink)', letterSpacing: '-0.02em',
          }}>
            {existing ? 'Edit Restaurant' : 'Add Restaurant'}
          </h2>
          <button
            onClick={onClose}
            style={{
              width: 34, height: 34, borderRadius: '50%',
              backgroundColor: 'var(--surface-2)',
              border: '1px solid var(--line)',
              fontSize: 18, color: 'var(--ink-3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Scrollable form */}
        <form
          onSubmit={handleSubmit}
          style={{
            overflowY: 'auto',
            flex: 1,
            padding: `20px ${PX}px`,
            display: 'flex', flexDirection: 'column', gap: 20,
            paddingBottom: `calc(24px + env(safe-area-inset-bottom))`,
          }}
        >

          {/* Emoji picker */}
          <div>
            <FieldLabel>Icon</FieldLabel>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)',
              gap: 6, padding: 12,
              backgroundColor: 'var(--surface-2)',
              borderRadius: 'var(--r-lg)',
              border: '1px solid var(--line)',
              maxHeight: 164, overflowY: 'auto',
            }}>
              {EMOJIS.map(em => (
                <button
                  type="button" key={em}
                  onClick={() => set('emoji', em)}
                  style={{
                    fontSize: 22, aspectRatio: '1', minHeight: 40,
                    borderRadius: 10,
                    backgroundColor: form.emoji === em ? 'var(--surface)' : 'transparent',
                    outline: form.emoji === em ? '2px solid var(--orange)' : 'none',
                    outlineOffset: -2,
                    border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'background-color 120ms',
                  }}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <FieldLabel required>Restaurant Name</FieldLabel>
            <input
              type="text" value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="e.g. Paragon Restaurant"
              style={field(errors.name)}
              autoComplete="off"
            />
            {errors.name && <p style={{ fontSize: 12, color: 'var(--coral)', marginTop: 6 }}>{errors.name}</p>}
          </div>

          {/* Cuisine */}
          <div>
            <FieldLabel>Cuisine Type</FieldLabel>
            <input
              type="text" value={form.cuisine}
              onChange={e => set('cuisine', e.target.value)}
              placeholder="Kerala, Seafood, Italian…"
              style={field(false)}
              autoComplete="off"
            />
          </div>

          {/* Location */}
          <div>
            <FieldLabel>Location</FieldLabel>
            <input
              type="text" value={form.location}
              onChange={e => set('location', e.target.value)}
              placeholder="Kozhikode, Kerala"
              style={field(false)}
              autoComplete="off"
            />
          </div>

          {/* Lat / Lng */}
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <FieldLabel>Latitude</FieldLabel>
              <input
                type="text" inputMode="decimal" value={form.lat}
                onChange={e => set('lat', e.target.value)}
                placeholder="11.2588"
                style={field(errors.lat)}
              />
              {errors.lat && <p style={{ fontSize: 12, color: 'var(--coral)', marginTop: 6 }}>{errors.lat}</p>}
            </div>
            <div style={{ flex: 1 }}>
              <FieldLabel>Longitude</FieldLabel>
              <input
                type="text" inputMode="decimal" value={form.lng}
                onChange={e => set('lng', e.target.value)}
                placeholder="75.7804"
                style={field(errors.lng)}
              />
              {errors.lng && <p style={{ fontSize: 12, color: 'var(--coral)', marginTop: 6 }}>{errors.lng}</p>}
            </div>
          </div>

          {/* Notes */}
          <div>
            <FieldLabel>Notes</FieldLabel>
            <textarea
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              placeholder="Any notes about this place…"
              rows={2}
              style={{
                ...field(false),
                height: 'auto', paddingTop: 12, paddingBottom: 12,
                resize: 'none', lineHeight: 1.5,
              }}
            />
          </div>

          {/* Status */}
          <div>
            <FieldLabel>Status</FieldLabel>
            <div style={{ display: 'flex', gap: 10 }}>
              {[
                { val: 'wishlist', label: '♥ Want to Visit',   active: { border: 'var(--orange)', bg: 'var(--orange-soft)', color: 'var(--orange-deep)' } },
                { val: 'visited',  label: '✓ Already Visited', active: { border: 'var(--green)',  bg: 'var(--green-soft)',  color: 'var(--green)' } },
              ].map(({ val, label, active }) => {
                const isActive = form.status === val;
                return (
                  <button
                    key={val} type="button"
                    onClick={() => set('status', val)}
                    style={{
                      flex: 1, minHeight: 50,
                      borderRadius: 'var(--r-md)',
                      border: `2px solid ${isActive ? active.border : 'var(--line)'}`,
                      backgroundColor: isActive ? active.bg : 'var(--surface-2)',
                      color: isActive ? active.color : 'var(--ink-4)',
                      fontSize: 13, fontWeight: 700,
                      fontFamily: 'var(--font-ui)',
                      transition: 'all 150ms',
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
            <button
              type="button" onClick={onClose}
              style={{
                flex: 1, minHeight: 52,
                borderRadius: 'var(--r-pill)',
                border: '1.5px solid var(--line)',
                backgroundColor: 'var(--surface-2)',
                fontSize: 14, fontWeight: 600,
                color: 'var(--ink-3)',
                fontFamily: 'var(--font-ui)',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                flex: 2, minHeight: 52,
                borderRadius: 'var(--r-pill)',
                backgroundColor: 'var(--orange)',
                color: '#fff', border: 'none',
                fontSize: 14, fontWeight: 700,
                fontFamily: 'var(--font-ui)',
                boxShadow: '0 4px 14px rgba(245,98,45,0.38)',
              }}
            >
              {existing ? 'Save Changes' : 'Add Restaurant'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

function FieldLabel({ children, required }) {
  return (
    <p style={{
      fontSize: 13, fontWeight: 600,
      color: 'var(--ink-2)',
      marginBottom: 8,
      fontFamily: 'var(--font-ui)',
    }}>
      {children}
      {required && <span style={{ color: 'var(--coral)', marginLeft: 2 }}>*</span>}
    </p>
  );
}
