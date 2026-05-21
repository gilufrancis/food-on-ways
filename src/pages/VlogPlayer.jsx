import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useVlogs } from '../context/VlogContext';
import { useRestaurants } from '../context/RestaurantContext';

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

export default function VlogPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { vlogs, dispatch } = useVlogs();
  const { restaurants } = useRestaurants();
  const vlog = vlogs.find(v => v.id === id);

  const containerRef = useRef(null);
  const playerRef    = useRef(null);
  const [ready, setReady]             = useState(false);
  const [addingSpot, setAddingSpot]   = useState(false);
  const [pendingTime, setPendingTime] = useState(0);
  const [spotLabel, setSpotLabel]     = useState('');
  const [spotRestId, setSpotRestId]   = useState('');

  useEffect(() => {
    if (!vlog || !containerRef.current) return;
    let destroyed = false;

    loadYT(() => {
      if (destroyed || !containerRef.current) return;
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId: vlog.youtubeId,
        playerVars: { rel: 0, modestbranding: 1, playsinline: 1 },
        events: {
          onReady: () => setReady(true),
        },
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
    setSpotRestId('');
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
          restaurantId: spotRestId || null,
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
      {/* YT IFrame API renders its own <iframe> inside this container div */}
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
            {/* Timestamp indicator */}
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

            <select
              value={spotRestId}
              onChange={e => setSpotRestId(e.target.value)}
              style={{
                height: 44, paddingLeft: 12,
                fontSize: 14, borderRadius: 'var(--r-md)',
                border: '1.5px solid var(--line)',
                backgroundColor: 'var(--surface-2)',
                color: spotRestId ? 'var(--ink)' : 'var(--ink-4)',
                outline: 'none',
                fontFamily: 'var(--font-ui)',
              }}
            >
              <option value="">Link to a restaurant (optional)</option>
              {restaurants.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>

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
          {vlog.spots?.map(spot => {
            const rest = restaurants.find(r => r.id === spot.restaurantId);
            return (
              <div
                key={spot.id}
                onClick={() => handleSeek(spot.timestamp)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  backgroundColor: 'var(--surface-2)',
                  border: '1px solid var(--line)',
                  borderLeft: '3px solid var(--orange)',
                  borderRadius: 'var(--r-md)',
                  padding: '10px 12px 10px 14px',
                  cursor: 'pointer',
                }}
              >
                {/* Timestamp chip */}
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

                {/* Label + restaurant */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontSize: 14, fontWeight: 600, color: 'var(--ink)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {spot.label}
                  </p>
                  {rest && (
                    <p style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }}>
                      📍 {rest.name} · {rest.location?.split(',')[0]}
                    </p>
                  )}
                </div>

                {/* Delete */}
                <button
                  onClick={e => {
                    e.stopPropagation();
                    dispatch({ type: 'DELETE_SPOT', payload: { vlogId: vlog.id, spotId: spot.id } });
                  }}
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
            );
          })}

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
