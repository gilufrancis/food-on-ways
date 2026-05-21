import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useVlogs } from '../context/VlogContext';

/* ─── YouTube IFrame API — singleton loader ─── */
let _ytLoaded = false;
const _ytQueue = [];

function loadYT(cb) {
  if (window.YT?.Player) { cb(); return; }
  _ytQueue.push(cb);
  if (!_ytLoaded) {
    _ytLoaded = true;
    const s = document.createElement('script');
    s.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(s);
    window.onYouTubeIframeAPIReady = () => {
      _ytQueue.forEach(fn => fn());
      _ytQueue.length = 0;
    };
  }
}

function fmt(sec) {
  const s = Math.floor(Math.max(0, sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

/* ─── Nominatim place search ─── */
async function searchPlaces(query) {
  const url = new URL('https://nominatim.openstreetmap.org/search');
  url.searchParams.set('q', query);
  url.searchParams.set('format', 'json');
  url.searchParams.set('limit', '5');
  url.searchParams.set('addressdetails', '1');
  const res = await fetch(url, {
    headers: { 'Accept-Language': 'en', 'User-Agent': 'FoodOnWaysApp/1.0' },
  });
  return res.json();
}

function placeToMapsUrl(lat, lon) {
  return `https://www.google.com/maps?q=${lat},${lon}`;
}

/* ─── PlaceSearch autocomplete ─── */
function PlaceSearch({ value, onChange }) {
  const [query, setQuery]     = useState(value?.name || '');
  const [results, setResults] = useState([]);
  const [open, setOpen]       = useState(false);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef(null);
  const wrapRef  = useRef(null);

  /* Close on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleInput = (q) => {
    setQuery(q);
    if (!q) { onChange(null); setResults([]); setOpen(false); return; }
    clearTimeout(timerRef.current);
    if (q.length < 3) return;
    setLoading(true);
    timerRef.current = setTimeout(async () => {
      try {
        const data = await searchPlaces(q);
        setResults(data);
        setOpen(data.length > 0);
      } catch {}
      setLoading(false);
    }, 420);
  };

  const handleSelect = (place) => {
    const name = place.display_name.split(',')[0].trim();
    const sub  = place.display_name.split(',').slice(1, 3).join(',').trim();
    const mapsUrl = placeToMapsUrl(place.lat, place.lon);
    onChange({ name, sub, mapsUrl, lat: parseFloat(place.lat), lng: parseFloat(place.lon) });
    setQuery(name);
    setOpen(false);
    setResults([]);
  };

  const handleClear = () => {
    setQuery('');
    onChange(null);
    setResults([]);
    setOpen(false);
  };

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      {/* Input */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <svg
          style={{ position: 'absolute', left: 12, pointerEvents: 'none', flexShrink: 0 }}
          width="15" height="15" viewBox="0 0 24 24" fill="none"
          stroke="var(--ink-4)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          value={query}
          onChange={e => handleInput(e.target.value)}
          placeholder="Search restaurant on Maps…"
          style={{
            width: '100%', height: 44,
            paddingLeft: 36, paddingRight: value ? 36 : 14,
            fontSize: 14, borderRadius: 'var(--r-md)',
            border: `1.5px solid ${value ? 'var(--green)' : 'var(--line)'}`,
            backgroundColor: value ? 'var(--green-soft)' : 'var(--surface-2)',
            color: 'var(--ink)', outline: 'none',
            fontFamily: 'var(--font-ui)',
            transition: 'border-color 200ms, background-color 200ms',
          }}
        />
        {/* Loading spinner or clear */}
        {loading && (
          <span style={{ position: 'absolute', right: 12, fontSize: 13, color: 'var(--ink-4)' }}>…</span>
        )}
        {value && !loading && (
          <button
            onClick={handleClear}
            style={{
              position: 'absolute', right: 10,
              width: 22, height: 22, borderRadius: '50%',
              backgroundColor: 'var(--surface-3)', border: 'none',
              fontSize: 13, color: 'var(--ink-3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >×</button>
        )}
      </div>

      {/* Dropdown results */}
      {open && results.length > 0 && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
          zIndex: 300,
          backgroundColor: 'var(--surface)',
          borderRadius: 'var(--r-md)',
          border: '1px solid var(--line)',
          boxShadow: 'var(--shadow-md)',
          overflow: 'hidden',
        }}>
          {results.map((place, i) => {
            const name = place.display_name.split(',')[0].trim();
            const sub  = place.display_name.split(',').slice(1, 3).join(',').trim();
            return (
              <button
                key={place.place_id}
                onClick={() => handleSelect(place)}
                style={{
                  width: '100%', textAlign: 'left',
                  display: 'flex', alignItems: 'flex-start', gap: 10,
                  padding: '10px 14px',
                  borderTop: i > 0 ? '1px solid var(--line)' : 'none',
                  background: 'none', border: i > 0 ? undefined : 'none',
                  cursor: 'pointer',
                }}
              >
                <div style={{
                  width: 28, height: 28, borderRadius: 8, flexShrink: 0, marginTop: 1,
                  backgroundColor: 'var(--orange-soft)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="var(--orange)">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {name}
                  </p>
                  <p style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {sub}
                  </p>
                </div>
                {/* Maps badge */}
                <span style={{
                  flexShrink: 0, fontSize: 10, fontWeight: 700,
                  padding: '3px 7px', borderRadius: 999,
                  backgroundColor: '#E8F0FE', color: '#1A73E8',
                  alignSelf: 'center',
                }}>
                  Maps
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Selected place — Google Maps link */}
      {value && (
        <a
          href={value.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            marginTop: 8,
            fontSize: 12, fontWeight: 600,
            color: '#1A73E8',
            textDecoration: 'none',
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#1A73E8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
            <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
          Open in Google Maps →
        </a>
      )}
    </div>
  );
}

/* ─── Main player ─── */
export default function VlogPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { vlogs, dispatch } = useVlogs();
  const vlog = vlogs.find(v => v.id === id);

  const containerRef = useRef(null);
  const playerRef    = useRef(null);
  const [ready, setReady]             = useState(false);
  const [addingSpot, setAddingSpot]   = useState(false);
  const [pendingTime, setPendingTime] = useState(0);
  const [spotLabel, setSpotLabel]     = useState('');
  const [spotPlace, setSpotPlace]     = useState(null);

  useEffect(() => {
    if (!vlog || !containerRef.current) return;
    let destroyed = false;

    loadYT(() => {
      if (destroyed || !containerRef.current) return;
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId: vlog.youtubeId,
        playerVars: { rel: 0, modestbranding: 1, playsinline: 1 },
        events: { onReady: () => setReady(true) },
      });
    });

    return () => {
      destroyed = true;
      try { playerRef.current?.destroy?.(); } catch {}
      playerRef.current = null;
      setReady(false);
    };
  }, [vlog?.id]);

  if (!vlog) return (
    <div style={{ padding: '60px var(--px)', textAlign: 'center', backgroundColor: 'var(--surface)', minHeight: '100dvh' }}>
      <p style={{ color: 'var(--ink-3)', marginBottom: 16, fontSize: 15 }}>Vlog not found.</p>
      <button
        onClick={() => navigate('/vlogs')}
        style={{ color: 'var(--orange)', fontWeight: 700, border: 'none', background: 'none', fontSize: 14 }}
      >
        ← Back to vlogs
      </button>
    </div>
  );

  const openMarkForm = () => {
    const t = Math.floor(playerRef.current?.getCurrentTime?.() ?? 0);
    playerRef.current?.pauseVideo?.();
    setPendingTime(t);
    setSpotLabel('');
    setSpotPlace(null);
    setAddingSpot(true);
  };

  const handleSaveSpot = () => {
    if (!spotLabel.trim()) return;
    dispatch({
      type: 'ADD_SPOT',
      payload: {
        vlogId: vlog.id,
        spot: {
          id: `sp-${Date.now()}`,
          timestamp: pendingTime,
          label: spotLabel.trim(),
          place: spotPlace || null,
        },
      },
    });
    setAddingSpot(false);
  };

  const handleSeek = (ts) => {
    playerRef.current?.seekTo?.(ts, true);
    playerRef.current?.playVideo?.();
  };

  return (
    <div style={{
      backgroundColor: 'var(--surface)',
      minHeight: '100dvh',
      paddingBottom: 'calc(72px + env(safe-area-inset-bottom))',
    }}>

      {/* ── Back header ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '14px var(--px) 12px',
        borderBottom: '1px solid var(--line)',
      }}>
        <button
          onClick={() => navigate('/vlogs')}
          style={{
            width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
            backgroundColor: 'var(--surface-2)',
            border: '1px solid var(--line)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          aria-label="Back"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: 15, fontWeight: 600,
            color: 'var(--ink)', letterSpacing: '-0.01em',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {vlog.title}
          </p>
          {vlog.channelName && (
            <p style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 1 }}>{vlog.channelName}</p>
          )}
        </div>
      </div>

      {/* ── YouTube player ── */}
      <div style={{ position: 'relative', paddingTop: '56.25%', backgroundColor: '#000' }}>
        <div
          ref={containerRef}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        />
        {!ready && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundColor: '#111',
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🎬</div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Loading player…</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Mark spot bar ── */}
      <div style={{ padding: '14px var(--px)', borderBottom: '1px solid var(--line)' }}>
        {!addingSpot ? (
          <button
            onClick={openMarkForm}
            disabled={!ready}
            style={{
              width: '100%', height: 46,
              borderRadius: 'var(--r-pill)',
              backgroundColor: ready ? 'var(--orange-soft)' : 'var(--surface-2)',
              border: `1.5px dashed ${ready ? 'var(--orange)' : 'var(--line)'}`,
              color: ready ? 'var(--orange)' : 'var(--ink-4)',
              fontSize: 13, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            📍 {ready ? 'Mark this spot' : 'Loading player…'}
          </button>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* Captured timestamp */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700,
                color: 'var(--orange)',
                backgroundColor: 'var(--orange-soft)',
                padding: '4px 10px', borderRadius: 8,
              }}>
                {fmt(pendingTime)}
              </span>
              <p style={{ fontSize: 13, color: 'var(--ink-3)' }}>Spot captured — add a label</p>
            </div>

            {/* Spot label */}
            <input
              value={spotLabel}
              onChange={e => setSpotLabel(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSaveSpot()}
              placeholder="e.g. Paragon – try the fish curry"
              autoFocus
              style={{
                height: 44, paddingLeft: 14, paddingRight: 14,
                fontSize: 14, borderRadius: 'var(--r-md)',
                border: '1.5px solid var(--orange)',
                backgroundColor: 'var(--surface-2)',
                color: 'var(--ink)', outline: 'none',
                fontFamily: 'var(--font-ui)',
              }}
            />

            {/* Maps place search */}
            <PlaceSearch value={spotPlace} onChange={setSpotPlace} />

            {/* Actions */}
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => setAddingSpot(false)}
                style={{
                  flex: 1, height: 42, borderRadius: 'var(--r-md)',
                  backgroundColor: 'var(--surface-2)',
                  border: '1px solid var(--line)',
                  fontSize: 13, fontWeight: 600, color: 'var(--ink-3)',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSpot}
                disabled={!spotLabel.trim()}
                style={{
                  flex: 2, height: 42, borderRadius: 'var(--r-md)',
                  backgroundColor: spotLabel.trim() ? 'var(--orange)' : 'var(--surface-3)',
                  color: spotLabel.trim() ? '#fff' : 'var(--ink-4)',
                  border: 'none', fontSize: 13, fontWeight: 700,
                }}
              >
                Save spot
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Spots list ── */}
      <div style={{ padding: '16px var(--px) 0' }}>
        <p className="t-caps" style={{ color: 'var(--ink-3)', marginBottom: 12 }}>
          {vlog.spots?.length
            ? `${vlog.spots.length} saved spot${vlog.spots.length !== 1 ? 's' : ''} — tap to jump`
            : 'No spots yet'}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {vlog.spots?.map(spot => (
            <SpotRow
              key={spot.id}
              spot={spot}
              onSeek={() => handleSeek(spot.timestamp)}
              onDelete={() => dispatch({ type: 'DELETE_SPOT', payload: { vlogId: vlog.id, spotId: spot.id } })}
            />
          ))}

          {(!vlog.spots || vlog.spots.length === 0) && (
            <div style={{ textAlign: 'center', padding: '28px 0' }}>
              <p style={{ fontSize: 13, color: 'var(--ink-4)', lineHeight: 1.6 }}>
                Play the video, pause at a good moment,<br />then tap "Mark this spot"
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Spot row ─── */
function SpotRow({ spot, onSeek, onDelete }) {
  return (
    <div
      style={{
        backgroundColor: 'var(--surface-2)',
        border: '1px solid var(--line)',
        borderLeft: '3px solid var(--orange)',
        borderRadius: 'var(--r-md)',
        overflow: 'hidden',
      }}
    >
      {/* Main tap row */}
      <div
        onClick={onSeek}
        style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '10px 12px 10px 14px',
          cursor: 'pointer',
        }}
      >
        <span style={{
          flexShrink: 0,
          fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700,
          color: 'var(--orange)',
          backgroundColor: 'var(--orange-soft)',
          padding: '3px 8px', borderRadius: 6,
          letterSpacing: '0.02em',
        }}>
          {fmt(spot.timestamp)}
        </span>

        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontSize: 14, fontWeight: 600, color: 'var(--ink)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {spot.label}
          </p>
          {spot.place && (
            <p style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              📍 {spot.place.name}
              {spot.place.sub ? ` · ${spot.place.sub.split(',')[0]}` : ''}
            </p>
          )}
        </div>

        <button
          onClick={e => { e.stopPropagation(); onDelete(); }}
          style={{
            flexShrink: 0, width: 28, height: 28, borderRadius: '50%',
            backgroundColor: 'var(--surface-3)', border: 'none',
            fontSize: 14, color: 'var(--ink-4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          ×
        </button>
      </div>

      {/* Google Maps link row */}
      {spot.place?.mapsUrl && (
        <a
          href={spot.place.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '7px 14px 9px',
            borderTop: '1px solid var(--line)',
            fontSize: 12, fontWeight: 600,
            color: '#1A73E8', textDecoration: 'none',
            backgroundColor: '#F0F4FF',
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1A73E8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
            <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
          Open in Google Maps
        </a>
      )}
    </div>
  );
}
