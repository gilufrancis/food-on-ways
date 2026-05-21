// Food on Ways — shared components
// Loaded after React + Babel. Components are exported to window at bottom.

const { useState, useRef, useEffect, useMemo, useCallback } = React;

// ─────────────────────────────────────────────────────────────
// Icons (inline SVG, 24px viewBox unless noted)
// ─────────────────────────────────────────────────────────────
const Icon = ({ name, size = 22, stroke = 1.7, color = "currentColor", style }) => {
  const paths = {
    home:        <path d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1v-8.5Z" />,
    map:         <><path d="M9 3 3 5v16l6-2 6 2 6-2V3l-6 2-6-2Z" /><path d="M9 3v16M15 5v16" /></>,
    heart:       <path d="M12 20s-7-4.5-9-9.2C1.6 7.1 4.2 4 7.5 4c1.9 0 3.5 1 4.5 2.5C13 5 14.6 4 16.5 4 19.8 4 22.4 7.1 21 10.8 19 15.5 12 20 12 20Z" />,
    heartFill:   <path d="M12 20s-7-4.5-9-9.2C1.6 7.1 4.2 4 7.5 4c1.9 0 3.5 1 4.5 2.5C13 5 14.6 4 16.5 4 19.8 4 22.4 7.1 21 10.8 19 15.5 12 20 12 20Z" fill={color} stroke="none" />,
    check:       <path d="M5 12l5 5L20 7" />,
    user:        <><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></>,
    bell:        <><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2H4.5L6 16Z" /><path d="M10 20a2 2 0 0 0 4 0" /></>,
    plus:        <><path d="M12 5v14M5 12h14" /></>,
    share:       <><path d="M14 4l6 6-6 6" /><path d="M20 10H10c-3 0-6 2-6 6v4" /></>,
    arrowLeft:   <><path d="M14 6l-6 6 6 6" /></>,
    arrowRight:  <><path d="M10 6l6 6-6 6" /></>,
    search:      <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
    pin:         <><path d="M12 22s7-7.5 7-13a7 7 0 0 0-14 0c0 5.5 7 13 7 13Z" /><circle cx="12" cy="9" r="2.5" /></>,
    pinFill:     <><path d="M12 22s7-7.5 7-13a7 7 0 0 0-14 0c0 5.5 7 13 7 13Z" fill={color} stroke="none"/><circle cx="12" cy="9" r="2.5" fill="#fff" stroke="none" /></>,
    calendar:    <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 9h18M8 3v4M16 3v4" /></>,
    flame:       <><path d="M12 3s4 4 4 8c0 2-1 4-4 4-2 0-4-1-4-4 0-3 4-3 4-8Z" /><path d="M7 14a5 5 0 0 0 5 7 5 5 0 0 0 5-7" /></>,
    sparkle:     <><path d="M12 3v6M12 15v6M3 12h6M15 12h6M6 6l3 3M15 15l3 3M6 18l3-3M15 9l3-3"/></>,
    dot:         <circle cx="12" cy="12" r="4" fill={color} stroke="none" />,
    chevronRight:<path d="m9 6 6 6-6 6" />,
    chevronDown: <path d="m6 9 6 6 6-6" />,
    close:       <><path d="M6 6l12 12M18 6 6 18" /></>,
    phone:       <path d="M5 4h3l1.5 4-2 1.5a12 12 0 0 0 6 6L15 13.5 19 15v3a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2Z" />,
    clock:       <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    star:        <path d="m12 3 2.7 5.5 6 .9-4.4 4.3 1 6.1L12 17 6.7 19.8l1-6.1L3.4 9.4l6-.9L12 3Z" />,
    grid:        <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></>,
    layers:      <><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 13 9 5 9-5M3 18l9 5 9-5" /></>,
    refresh:     <><path d="M3 12a9 9 0 0 1 15-6.7L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" /><path d="M3 21v-5h5" /></>,
    fork:        <><path d="M7 3v6a3 3 0 0 0 6 0V3" /><path d="M10 12v9" /><path d="M17 3v18l3-2v-9c0-3-3-7-3-7Z" /></>,
    locate:      <><circle cx="12" cy="12" r="3" /><path d="M12 3v3M12 18v3M3 12h3M18 12h3" /></>,
    play:        <path d="M7 4v16l13-8Z" fill={color} stroke="none" />,
    image:       <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><path d="M3 18l6-5 4 3 3-3 5 4" /></>,
    camera:      <><path d="M4 8h3l2-3h6l2 3h3v11H4V8Z" /><circle cx="12" cy="13" r="3.5" /></>,
    minus:       <path d="M6 12h12" />,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={style}>
      {paths[name]}
    </svg>
  );
};

// ─────────────────────────────────────────────────────────────
// ImagePlaceholder — warm gradient + diagonal weave + caption tag
// ─────────────────────────────────────────────────────────────
const ImgPh = ({ palette, tag, src, children, style, className = "", radius = 0, dim = 0, showTag = true }) => {
  const [a, b, c] = palette || ["#E6D6BC", "#A47A52", "#3E2A1A"];
  const bg = {
    background: `
      radial-gradient(120% 90% at 25% 25%, ${a} 0%, transparent 55%),
      radial-gradient(140% 100% at 100% 100%, ${c} 0%, transparent 65%),
      ${b}
    `,
  };
  const [imgFailed, setImgFailed] = useState(false);
  const useImg = src && !imgFailed;
  return (
    <div className={`img-ph ${className}`} style={{ borderRadius: radius, ...bg, ...style }}>
      {useImg && (
        <img src={src} alt=""
          onError={() => setImgFailed(true)}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%', objectFit: 'cover',
            opacity: 1, zIndex: 0,
          }} />
      )}
      {dim > 0 && <div style={{ position: 'absolute', inset: 0, background: `rgba(0,0,0,${dim})`, zIndex: 1 }} />}
      {showTag && tag && !useImg && <div className="img-ph-tag">{tag}</div>}
      {children && <div style={{ position: 'relative', zIndex: 2, width: '100%', height: '100%' }}>{children}</div>}
      {!children && null}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Avatar — circular gradient placeholder with initial letter
// ─────────────────────────────────────────────────────────────
const Avatar = ({ creator, size = 36, ring }) => {
  const [a, b] = creator.paletteCover || ["#C84313", "#2A0F0A"];
  const initial = creator.name.split(" ").map(p => p[0]).slice(0, 2).join("");
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `linear-gradient(135deg, ${a}, ${b})`,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontFamily: 'var(--font-display)', fontSize: size * 0.4,
      fontWeight: 600, letterSpacing: '-0.02em',
      boxShadow: ring ? `0 0 0 2px ${ring}, 0 0 0 4px var(--surface)` : 'inset 0 0 0 1px rgba(0,0,0,0.08)',
      flexShrink: 0,
    }}>{initial}</div>
  );
};

// ─────────────────────────────────────────────────────────────
// HeartButton — orange burst + pulse on tap
// ─────────────────────────────────────────────────────────────
const HeartButton = ({ filled, onChange, size = 40, color = "#fff", fillColor = "var(--coral)", style }) => {
  const [pieces, setPieces] = useState([]);
  const [pulse, setPulse] = useState(false);
  const ref = useRef(null);

  const toggle = (e) => {
    e?.stopPropagation();
    const next = !filled;
    onChange?.(next);
    if (next) {
      // burst
      const id = Date.now();
      const newPieces = Array.from({ length: 9 }, (_, i) => {
        const ang = (i / 9) * Math.PI * 2;
        const r = 30 + Math.random() * 14;
        return { id: id + i, tx: Math.cos(ang) * r + 'px', ty: Math.sin(ang) * r + 'px', rot: (Math.random()*60-30) + 'deg', char: i % 3 === 0 ? '✦' : '♥' };
      });
      setPieces(newPieces);
      setPulse(true);
      setTimeout(() => setPieces([]), 800);
      setTimeout(() => setPulse(false), 650);
    }
  };

  return (
    <button onClick={toggle} ref={ref}
      style={{
        position: 'relative', width: size, height: size, borderRadius: '50%',
        background: filled ? 'rgba(253,250,246,0.95)' : 'rgba(26,21,18,0.42)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.18)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        ...style,
      }}>
      <span className={pulse ? 'heart-pulse' : ''} style={{ display: 'inline-flex' }}>
        <Icon name={filled ? 'heartFill' : 'heart'} size={size * 0.5}
          color={filled ? fillColor : color} stroke={2} />
      </span>
      {pieces.map(p => (
        <span key={p.id} className="heart-burst-piece"
          style={{ "--tx": p.tx, "--ty": p.ty, "--rot": p.rot, color: 'var(--coral)' }}>
          {p.char}
        </span>
      ))}
    </button>
  );
};

// ─────────────────────────────────────────────────────────────
// Pill
// ─────────────────────────────────────────────────────────────
const Pill = ({ children, variant = "", style, onClick }) => (
  <span className={`pill ${variant}`} style={style} onClick={onClick}>{children}</span>
);

// ─────────────────────────────────────────────────────────────
// Bottom Nav
// ─────────────────────────────────────────────────────────────
const BottomNav = ({ active, onChange, badges = {} }) => {
  const items = [
    { id: 'home',     label: 'Home',     icon: 'home' },
    { id: 'map',      label: 'Map',      icon: 'map' },
    { id: 'wishlist', label: 'Wishlist', icon: 'heart' },
    { id: 'visited',  label: 'Visited',  icon: 'check' },
    { id: 'profile',  label: 'Profile',  icon: 'user' },
  ];
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0,
      height: 78, paddingBottom: 14,
      background: 'rgba(253,250,246,0.92)',
      backdropFilter: 'blur(18px)',
      borderTop: '1px solid var(--line)',
      display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end',
      zIndex: 20,
    }}>
      {items.map(it => {
        const on = active === it.id;
        return (
          <button key={it.id} onClick={() => onChange(it.id)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              padding: '8px 6px', flex: 1, position: 'relative',
              color: on ? 'var(--orange)' : 'var(--ink-3)',
            }}>
            <span style={{ position: 'relative' }}>
              <Icon name={it.icon} size={22} stroke={on ? 2.2 : 1.8} />
              {badges[it.id] > 0 && (
                <span style={{
                  position: 'absolute', top: -4, right: -8,
                  background: 'var(--coral)', color: '#fff',
                  fontSize: 10, fontWeight: 700, minWidth: 16, height: 16,
                  borderRadius: 8, padding: '0 4px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '2px solid var(--surface)',
                }}>{badges[it.id]}</span>
              )}
            </span>
            <span style={{
              fontSize: 11, fontWeight: on ? 700 : 500,
              letterSpacing: '0.01em',
            }}>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// FAB — top-right Add button
// ─────────────────────────────────────────────────────────────
const FAB = ({ onClick, top = 14 }) => (
  <button onClick={onClick}
    style={{
      position: 'absolute', right: 16, top,
      width: 48, height: 48, borderRadius: '50%',
      background: 'var(--orange)', color: '#fff',
      boxShadow: '0 10px 24px rgba(245,98,45,0.42)',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 30,
    }}>
    <Icon name="plus" size={22} stroke={2.4} />
  </button>
);

// ─────────────────────────────────────────────────────────────
// Phone status bar (mock)
// ─────────────────────────────────────────────────────────────
const StatusBar = ({ light = false }) => (
  <div style={{
    position: 'absolute', top: 0, left: 0, right: 0, height: 44,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 22px',
    color: light ? '#fff' : 'var(--ink)',
    fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 14,
    pointerEvents: 'none', zIndex: 50,
  }}>
    <span>9:41</span>
    <span style={{ display: 'inline-flex', gap: 5, alignItems: 'center' }}>
      <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
        <rect x="0" y="3" width="3" height="4" rx="0.5" fill="currentColor"/>
        <rect x="4" y="2" width="3" height="6" rx="0.5" fill="currentColor"/>
        <rect x="8" y="1" width="3" height="8" rx="0.5" fill="currentColor"/>
        <rect x="12" y="0" width="3" height="10" rx="0.5" fill="currentColor"/>
      </svg>
      <svg width="14" height="10" viewBox="0 0 14 10" fill="currentColor"><path d="M7 1.5C4.5 1.5 2.4 2.4.7 3.9c-.3.3-.3.7 0 1L1.9 6c.3.2.7.2 1 0a6.5 6.5 0 0 1 8.2 0c.3.2.7.2 1 0L13.3 4.9c.3-.3.3-.7 0-1A11 11 0 0 0 7 1.5Z"/></svg>
      <svg width="22" height="10" viewBox="0 0 22 10" fill="none">
        <rect x="0.5" y="0.5" width="18" height="9" rx="2.2" stroke="currentColor" opacity="0.5"/>
        <rect x="2" y="2" width="13" height="6" rx="1" fill="currentColor"/>
        <rect x="19.5" y="3.5" width="1.5" height="3" rx="0.5" fill="currentColor" opacity="0.5"/>
      </svg>
    </span>
  </div>
);

// ─────────────────────────────────────────────────────────────
// Section heading
// ─────────────────────────────────────────────────────────────
const SectionHead = ({ kicker, title, action, onAction, style }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '6px 20px', ...style }}>
    <div>
      {kicker && <div className="t-caps" style={{ color: 'var(--orange)', marginBottom: 4 }}>{kicker}</div>}
      <div className="t-display" style={{ fontSize: 22, lineHeight: 1.05, fontWeight: 600 }}>{title}</div>
    </div>
    {action && <button onClick={onAction} style={{ fontSize: 12, color: 'var(--ink-3)', fontWeight: 600 }}>{action} →</button>}
  </div>
);

// ─────────────────────────────────────────────────────────────
// Restaurant Mini Card — used in trending strip
// ─────────────────────────────────────────────────────────────
const TrendingCard = ({ r, savedState, onOpen }) => (
  <button onClick={() => onOpen(r.id)} style={{
    width: 168, flexShrink: 0,
    background: 'var(--surface)', borderRadius: 18,
    boxShadow: 'var(--shadow-sm)',
    overflow: 'hidden', textAlign: 'left',
    border: '1px solid var(--line)',
  }}>
    <ImgPh palette={r.palette} src={r.img} tag={r.heroTag} style={{ height: 130 }}>
      {savedState && (
        <div style={{ position: 'absolute', top: 8, right: 8 }}>
          <Pill variant={savedState === 'visited' ? 'green' : 'coral'}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />
            {savedState === 'visited' ? 'Visited' : 'Saved'}
          </Pill>
        </div>
      )}
    </ImgPh>
    <div style={{ padding: '10px 12px 12px' }}>
      <div className="t-display" style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.1 }}>{r.name}</div>
      <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 3 }}>{r.area}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, fontSize: 11, color: 'var(--ink-2)' }}>
        <Icon name="heart" size={12} stroke={2} color="var(--coral)" />
        <span style={{ fontWeight: 600 }}>{r.wishlistedBy}</span>
      </div>
    </div>
  </button>
);

// ─────────────────────────────────────────────────────────────
// Snackbar
// ─────────────────────────────────────────────────────────────
const Snackbar = ({ message, onUndo, onDone }) => {
  useEffect(() => { const t = setTimeout(onDone, 3500); return () => clearTimeout(t); }, [message]);
  if (!message) return null;
  return (
    <div className="fade-up" style={{
      position: 'absolute', left: 16, right: 16, bottom: 96,
      background: 'var(--ink)', color: '#fff', borderRadius: 16,
      padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      fontSize: 14, boxShadow: 'var(--shadow-lg)', zIndex: 50,
    }}>
      <span>{message}</span>
      {onUndo && <button onClick={onUndo} style={{ color: 'var(--orange)', fontWeight: 700 }}>Undo</button>}
    </div>
  );
};

Object.assign(window, {
  Icon, ImgPh, Avatar, HeartButton, Pill, BottomNav, FAB, StatusBar,
  SectionHead, TrendingCard, Snackbar,
});
