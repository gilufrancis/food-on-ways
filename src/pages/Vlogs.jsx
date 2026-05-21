import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVlogs } from '../context/VlogContext';
import PageWrapper from '../components/PageWrapper';

function parseYouTubeId(input) {
  const m = input.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/))([^&\n?#]+)/
  );
  return m ? m[1] : null;
}

export default function Vlogs() {
  const { vlogs, dispatch } = useVlogs();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);

  return (
    <PageWrapper>
      {/* Header */}
      <div style={{ padding: '24px var(--px) 16px' }}>
        <p className="t-caps" style={{ color: 'var(--ink-3)', marginBottom: 8 }}>Your saved content</p>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 28, fontWeight: 500,
          color: 'var(--ink)',
          letterSpacing: '-0.025em', lineHeight: 1.05,
        }}>
          Food <em style={{ color: 'var(--orange)', fontStyle: 'italic' }}>vlogs</em>
        </h1>
      </div>

      {/* Fixed FAB — sits above the bottom nav */}
      <div style={{
        position: 'fixed',
        bottom: 'calc(72px + env(safe-area-inset-bottom))',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 448,
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
        zIndex: 30,
      }}>
        <button
          onClick={() => setAdding(true)}
          style={{
            pointerEvents: 'all',
            height: 52,
            paddingLeft: 24, paddingRight: 24,
            borderRadius: 'var(--r-pill)',
            backgroundColor: 'var(--orange)', color: '#fff',
            fontSize: 15, fontWeight: 700, border: 'none',
            display: 'flex', alignItems: 'center', gap: 8,
            boxShadow: '0 6px 20px rgba(245,98,45,0.45)',
          }}
        >
          <span style={{ fontSize: 22, fontWeight: 300, lineHeight: 1 }}>+</span>
          Add vlog
        </button>
      </div>

      {vlogs.length === 0 ? (
        <EmptyVlogs onAdd={() => setAdding(true)} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '4px var(--px)' }}>
          {vlogs.map(v => (
            <VlogCard
              key={v.id}
              vlog={v}
              onOpen={() => navigate(`/vlogs/${v.id}`)}
              onDelete={() => window.confirm(`Delete "${v.title}"?`) && dispatch({ type: 'DELETE_VLOG', payload: v.id })}
            />
          ))}
        </div>
      )}

      {adding && (
        <AddVlogSheet
          onClose={() => setAdding(false)}
          onSave={vlog => {
            dispatch({ type: 'SAVE_VLOG', payload: vlog });
            setAdding(false);
          }}
        />
      )}
    </PageWrapper>
  );
}

/* ─── Vlog card ─── */
function VlogCard({ vlog, onOpen, onDelete }) {
  return (
    <div
      style={{
        backgroundColor: 'var(--surface-2)',
        borderRadius: 'var(--r-lg)',
        border: '1px solid var(--line)',
        boxShadow: 'var(--shadow-sm)',
        overflow: 'hidden',
        cursor: 'pointer',
      }}
      onClick={onOpen}
    >
      {/* Thumbnail */}
      <div style={{ position: 'relative', height: 190, backgroundColor: '#111' }}>
        <img
          src={`https://img.youtube.com/vi/${vlog.youtubeId}/hqdefault.jpg`}
          alt={vlog.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(26,21,18,0.65) 0%, transparent 50%)',
        }} />
        {/* Play button */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 52, height: 52, borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.92)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--ink)">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        </div>
        {/* Spots badge */}
        {vlog.spots?.length > 0 && (
          <span style={{
            position: 'absolute', bottom: 10, left: 10,
            backgroundColor: 'var(--orange)',
            borderRadius: 'var(--r-pill)',
            padding: '4px 10px',
            fontSize: 11, fontWeight: 700, color: '#fff',
          }}>
            📍 {vlog.spots.length} spot{vlog.spots.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Info row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px 14px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: 15, fontWeight: 600,
            color: 'var(--ink)', letterSpacing: '-0.01em', lineHeight: 1.3,
          }}>
            {vlog.title}
          </p>
          {vlog.channelName && (
            <p style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 4 }}>
              {vlog.channelName}
            </p>
          )}
        </div>
        <button
          onClick={e => { e.stopPropagation(); onDelete(); }}
          style={{
            flexShrink: 0, width: 30, height: 30, borderRadius: '50%',
            backgroundColor: 'var(--surface-3)', border: 'none',
            fontSize: 15, color: 'var(--ink-4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
}

/* ─── Empty state ─── */
function EmptyVlogs({ onAdd }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      textAlign: 'center', padding: '48px 24px 24px',
    }}>
      <div style={{
        width: 80, height: 80, borderRadius: 24,
        backgroundColor: '#FFE8E8',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 36, marginBottom: 18,
      }}>
        🎬
      </div>
      <p style={{
        fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 500,
        color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: 8,
      }}>
        No vlogs <em style={{ color: 'var(--orange)' }}>yet</em>
      </p>
      <p style={{ fontSize: 14, color: 'var(--ink-3)', lineHeight: 1.55, maxWidth: 240, marginBottom: 24 }}>
        Paste any YouTube food vlog to save it and mark restaurant spots
      </p>
      <button
        onClick={onAdd}
        style={{
          height: 44, paddingLeft: 24, paddingRight: 24,
          borderRadius: 'var(--r-pill)',
          backgroundColor: 'var(--orange)', color: '#fff',
          fontWeight: 700, fontSize: 14, border: 'none',
          boxShadow: '0 4px 14px rgba(245,98,45,0.35)',
        }}
      >
        Add your first vlog
      </button>
    </div>
  );
}

/* ─── Add vlog bottom sheet ─── */
function AddVlogSheet({ onClose, onSave }) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [channel, setChannel] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');

  const youtubeId = parseYouTubeId(url);

  async function handleFetch() {
    if (!youtubeId) { setError('Paste a valid YouTube URL'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch(
        `https://noembed.com/embed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${youtubeId}`)}`
      );
      const data = await res.json();
      setTitle(data.title || '');
      setChannel(data.author_name || '');
      setPreview(youtubeId);
    } catch {
      setError('Could not auto-fetch. Enter title manually.');
      setPreview(youtubeId);
    }
    setLoading(false);
  }

  function handleSave() {
    if (!youtubeId || !title.trim()) return;
    onSave({
      id: `vlog-${Date.now()}`,
      youtubeId,
      title: title.trim(),
      channelName: channel.trim(),
      savedAt: new Date().toISOString(),
      spots: [],
    });
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      {/* Backdrop */}
      <div
        style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(26,21,18,0.6)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />
      {/* Sheet */}
      <div style={{
        position: 'relative',
        backgroundColor: 'var(--surface)',
        borderRadius: '28px 28px 0 0',
        padding: '24px var(--px) calc(40px + env(safe-area-inset-bottom))',
        display: 'flex', flexDirection: 'column', gap: 14,
      }}>
        {/* Handle */}
        <div style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', width: 36, height: 4, borderRadius: 99, backgroundColor: 'var(--line)' }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.02em' }}>
            Add YouTube vlog
          </p>
          <button
            onClick={onClose}
            style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: 'var(--surface-2)', border: '1px solid var(--line)', fontSize: 16, color: 'var(--ink-3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            ×
          </button>
        </div>

        {/* URL + fetch */}
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            value={url}
            onChange={e => { setUrl(e.target.value); setPreview(null); setError(''); }}
            placeholder="Paste YouTube URL…"
            style={{
              flex: 1, height: 46, paddingLeft: 14, paddingRight: 14,
              fontSize: 14, borderRadius: 'var(--r-md)',
              border: '1.5px solid var(--line)',
              backgroundColor: 'var(--surface-2)',
              color: 'var(--ink)', outline: 'none',
              fontFamily: 'var(--font-ui)',
            }}
          />
          <button
            onClick={handleFetch}
            disabled={!youtubeId || loading}
            style={{
              height: 46, paddingLeft: 18, paddingRight: 18, flexShrink: 0,
              borderRadius: 'var(--r-md)',
              backgroundColor: youtubeId && !loading ? 'var(--orange)' : 'var(--surface-3)',
              color: youtubeId && !loading ? '#fff' : 'var(--ink-4)',
              border: 'none', fontWeight: 700, fontSize: 13,
            }}
          >
            {loading ? '…' : 'Fetch'}
          </button>
        </div>

        {error && <p style={{ fontSize: 13, color: 'var(--coral)', marginTop: -6 }}>{error}</p>}

        {/* Thumbnail preview */}
        {preview && (
          <div style={{ borderRadius: 'var(--r-md)', overflow: 'hidden', height: 140 }}>
            <img
              src={`https://img.youtube.com/vi/${preview}/hqdefault.jpg`}
              alt="thumbnail"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
        )}

        {/* Title + channel fields */}
        {(preview || title) && (
          <>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Video title"
              style={{
                width: '100%', height: 46, paddingLeft: 14, paddingRight: 14,
                fontSize: 14, borderRadius: 'var(--r-md)',
                border: `1.5px solid ${title ? 'var(--orange)' : 'var(--line)'}`,
                backgroundColor: 'var(--surface-2)',
                color: 'var(--ink)', outline: 'none',
                fontFamily: 'var(--font-ui)',
              }}
            />
            <input
              value={channel}
              onChange={e => setChannel(e.target.value)}
              placeholder="Channel name (optional)"
              style={{
                width: '100%', height: 46, paddingLeft: 14, paddingRight: 14,
                fontSize: 14, borderRadius: 'var(--r-md)',
                border: '1.5px solid var(--line)',
                backgroundColor: 'var(--surface-2)',
                color: 'var(--ink)', outline: 'none',
                fontFamily: 'var(--font-ui)',
              }}
            />
            <button
              onClick={handleSave}
              disabled={!title.trim()}
              style={{
                width: '100%', height: 50, borderRadius: 'var(--r-pill)',
                backgroundColor: title.trim() ? 'var(--orange)' : 'var(--surface-3)',
                color: title.trim() ? '#fff' : 'var(--ink-4)',
                fontSize: 15, fontWeight: 700, border: 'none',
                boxShadow: title.trim() ? '0 4px 14px rgba(245,98,45,0.3)' : 'none',
              }}
            >
              Save vlog
            </button>
          </>
        )}
      </div>
    </div>
  );
}
