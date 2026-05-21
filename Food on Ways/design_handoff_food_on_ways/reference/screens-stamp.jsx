// Full-screen cuisine passport unlock — the onboarding-tier "stamp" moment

const StampUnlock = ({ cuisine, onDone, autoPlay = true }) => {
  const c = cuisine;
  const [played, setPlayed] = useState(false);
  useEffect(() => {
    if (!autoPlay) return;
    const t = setTimeout(() => setPlayed(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: `
        radial-gradient(80% 60% at 50% 30%, ${c.palette[0]} 0%, transparent 65%),
        radial-gradient(100% 80% at 50% 100%, ${c.palette[2]} 0%, transparent 65%),
        ${c.palette[1]}
      `,
      color: '#fff', overflow: 'hidden',
    }}>
      <StatusBar light />

      {/* Top label */}
      <div style={{ position: 'absolute', top: 60, left: 0, right: 0, textAlign: 'center', padding: '0 30px' }}>
        <div className="t-caps" style={{ color: 'rgba(255,255,255,0.7)' }}>
          New stamp unlocked
        </div>
        <div className="t-display" style={{ fontSize: 30, marginTop: 8, lineHeight: 1.05, fontWeight: 500, letterSpacing: '-0.02em', textWrap: 'pretty' }}>
          You're now a <span className="t-italic">{c.label}</span> explorer.
        </div>
      </div>

      {/* The stamp */}
      <div style={{
        position: 'absolute', left: '50%', top: '50%',
        transform: 'translate(-50%, -50%)',
      }}>
        {/* radiating burst lines */}
        <svg width="320" height="320" viewBox="-160 -160 320 320" style={{ position: 'absolute', left: -160, top: -160, opacity: 0.55, animation: 'scaleIn 1000ms 500ms both' }}>
          {Array.from({ length: 24 }).map((_, i) => {
            const ang = (i / 24) * Math.PI * 2;
            const r1 = 110, r2 = 140;
            const x1 = Math.cos(ang) * r1, y1 = Math.sin(ang) * r1;
            const x2 = Math.cos(ang) * r2, y2 = Math.sin(ang) * r2;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.6)" strokeWidth="3" strokeLinecap="round" />;
          })}
        </svg>

        <div className="stamp-drop" style={{
          width: 240, height: 240, borderRadius: '50%',
          border: '6px solid #fff',
          background: 'rgba(255,255,255,0.06)',
          boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.4), 0 30px 60px rgba(0,0,0,0.35)',
          position: 'relative',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {/* inner ring with rotated cuisine name */}
          <svg width="240" height="240" viewBox="0 0 240 240" style={{ position: 'absolute', inset: 0 }}>
            <defs>
              <path id="stamp-ring" d="M 120 120 m -90 0 a 90 90 0 1 1 180 0 a 90 90 0 1 1 -180 0" />
            </defs>
            <text fill="rgba(255,255,255,0.8)" fontSize="11" fontFamily="DM Sans, sans-serif" letterSpacing="6" fontWeight="700">
              <textPath href="#stamp-ring" startOffset="0">
                FOOD ON WAYS · {c.label.toUpperCase()} · EXPLORER · FOOD ON WAYS · {c.label.toUpperCase()} · EXPLORER
              </textPath>
            </text>
          </svg>

          <div style={{ textAlign: 'center' }}>
            <div className="t-display" style={{ fontSize: 56, fontWeight: 600, letterSpacing: '-0.04em', lineHeight: 1 }}>
              {c.label[0]}
            </div>
            <div className="t-caps" style={{ fontSize: 11, marginTop: 6, opacity: 0.85 }}>{c.label}</div>
            <div style={{ marginTop: 8, fontSize: 10, opacity: 0.7 }}>May · 2026</div>
          </div>

          {/* faint banana-leaf / flame decorative motif (simple shape) */}
          <svg width="48" height="48" viewBox="0 0 48 48" style={{ position: 'absolute', top: 18, opacity: 0.4 }}>
            <path d="M24 2 Q 28 14 24 24 Q 20 14 24 2 Z" fill="#fff" />
          </svg>
        </div>
      </div>

      {/* Tiny burst dots around stamp */}
      {Array.from({ length: 12 }).map((_, i) => {
        const ang = (i / 12) * Math.PI * 2;
        const r = 160 + Math.random() * 30;
        return (
          <span key={i} className="heart-burst-piece"
            style={{
              "--tx": Math.cos(ang) * r + 'px',
              "--ty": Math.sin(ang) * r + 'px',
              "--rot": (i * 30) + 'deg',
              color: '#fff',
              animationDelay: (600 + i * 40) + 'ms',
              fontSize: 14,
              top: '50%', left: '50%',
            }}>{i % 2 ? '✦' : '·'}</span>
        );
      })}

      {/* Bottom CTA */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 40, padding: '0 24px', textAlign: 'center', animation: 'fadeUp 500ms 1100ms both' }}>
        <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 16 }}>
          One more cuisine on your map. <br/>3 more {c.label} cuisines to explore.
        </div>
        <button onClick={onDone} className="btn"
          style={{ background: '#fff', color: c.palette[1], padding: '14px 28px', fontSize: 14, fontWeight: 700 }}>
          Keep exploring →
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Minimal Profile screen
// ─────────────────────────────────────────────────────────────
const ProfileScreen = ({ state, actions }) => {
  const cuisines = window.FOW_DATA.cuisines;
  const visitedR = state.visited.map(id => window.FOW_DATA.restaurants.find(r => r.id === id)).filter(Boolean);
  const unlockedCount = new Set(visitedR.flatMap(r => r.cuisines.flatMap(c => cuisines.filter(p => p.label.toLowerCase().includes(c.toLowerCase()) || c.toLowerCase().includes(p.label.toLowerCase())).map(p => p.id)))).size;

  // Build a fake user "creator" for avatar
  const me = { name: "Ayana Rao", paletteCover: window.FOW_DATA.palettes.spice };
  return (
    <div style={{ position: 'absolute', inset: 0, overflowY: 'auto', paddingBottom: 96, background: 'var(--surface)' }} className="no-scrollbar">
      {/* Cover */}
      <ImgPh palette={window.FOW_DATA.palettes.crab} src={window.FOW_DATA.IMG.cover} tag="cover · personal banner" style={{ height: 200, position: 'relative' }}>
        <StatusBar light />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.4))' }} />
      </ImgPh>
      {/* Avatar overlap */}
      <div style={{ marginTop: -50, padding: '0 22px', display: 'flex', alignItems: 'flex-end', gap: 14 }}>
        <div style={{ borderRadius: '50%', border: '4px solid var(--surface)' }}>
          <Avatar creator={me} size={92} />
        </div>
        <div style={{ paddingBottom: 4 }}>
          <div className="t-display" style={{ fontSize: 24, fontWeight: 600 }}>Ayana Rao</div>
          <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>Kozhikode · Member since Mar 2025</div>
        </div>
      </div>

      <div style={{ padding: '18px 22px 6px', fontSize: 13, color: 'var(--ink-2)', fontStyle: 'italic', fontFamily: 'var(--font-display)' }}>
        "Chasing the perfect biryani, one tiffin at a time."
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 10, padding: '14px 16px 8px' }}>
        {[
          { n: state.wishlist.length, label: 'Saved' },
          { n: state.visited.length, label: 'Visited' },
          { n: new Set(visitedR.map(r => r.city)).size || 1, label: 'Cities' },
          { n: unlockedCount, label: 'Cuisines' },
        ].map(s => (
          <div key={s.label} style={{ flex: 1, padding: '12px 8px', background: 'var(--surface-2)', borderRadius: 16, textAlign: 'center' }}>
            <div className="t-display" style={{ fontSize: 22, fontWeight: 700 }}>{s.n}</div>
            <div style={{ fontSize: 10, color: 'var(--ink-3)', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Passport mini */}
      <div style={{ padding: '14px 22px 6px' }}>
        <SectionHead kicker="Cuisine Passport" title="Stamps so far" action="See all" onAction={() => actions.go('visited')} style={{ padding: 0 }} />
      </div>
      <div className="no-scrollbar" style={{ display: 'flex', gap: 10, padding: '12px 16px', overflowX: 'auto' }}>
        {cuisines.slice(0, 8).map((c, i) => {
          const on = i < 3;
          return (
            <div key={c.id} style={{
              width: 64, height: 64, borderRadius: '50%', flexShrink: 0,
              background: on ? `linear-gradient(135deg, ${c.palette[0]}, ${c.palette[2]})` : 'transparent',
              border: on ? '2px solid var(--ink)' : '2px dashed var(--ink-4)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              color: on ? '#fff' : 'var(--ink-4)',
              fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 22,
            }}>{on ? c.label[0] : '?'}</div>
          );
        })}
      </div>

      {/* Creator CTA */}
      <div style={{ margin: '18px 16px 0', padding: 22, borderRadius: 22, background: 'var(--amber-soft)', position: 'relative', overflow: 'hidden' }}>
        <div className="t-caps" style={{ color: '#6E4A0F' }}>Become a creator</div>
        <div className="t-display" style={{ fontSize: 20, marginTop: 4, fontWeight: 600 }}>Share your food finds with thousands of explorers.</div>
        <button className="btn btn-dark" style={{ marginTop: 12 }}>Join the creator program →</button>
      </div>

      {/* Settings list */}
      <div style={{ padding: '22px 16px 0' }}>
        <div className="t-caps" style={{ color: 'var(--ink-3)', padding: '0 6px' }}>Settings</div>
        {['Notification preferences', 'Cuisine preferences', 'Connected accounts', 'Sign out'].map(item => (
          <button key={item} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            width: '100%', padding: 16, marginTop: 8, borderRadius: 14,
            background: 'var(--surface-2)', fontSize: 14, fontWeight: 600,
          }}>
            {item}
            <Icon name="chevronRight" size={16} color="var(--ink-3)" />
          </button>
        ))}
      </div>
    </div>
  );
};

Object.assign(window, { StampUnlock, ProfileScreen });
