// Map View screen
const MapView = ({ state, actions, initialExpanded = false }) => {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('All');
  const [expanded, setExpanded] = useState(initialExpanded);

  // Restaurant subset — pin coords laid out manually in % of frame
  const pins = [
    { r: 'paragon',    x: 36, y: 44, kind: 'wishlist' },
    { r: 'sagar',      x: 70, y: 30, kind: 'creator' },
    { r: 'topform',    x: 20, y: 32, kind: 'visited' },
    { r: 'kayees',     x: 58, y: 62, kind: 'wishlist' },
    { r: 'appammachi', x: 26, y: 72, kind: 'creator' },
    { r: 'moplah',     x: 78, y: 56, kind: 'event' },
    { r: 'dosadosa',   x: 48, y: 18, kind: 'wishlist' },
  ];

  const kindColor = {
    wishlist: 'var(--orange)',
    visited:  'var(--green)',
    creator:  '#FFFFFF',
    event:    'var(--amber)',
  };

  const sel = selected ? window.FOW_DATA.restaurants.find(r => r.id === selected) : null;

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#E8DDC9', overflow: 'hidden' }}>
      {/* Warm map canvas */}
      <div style={{ position: 'absolute', inset: 0 }}>
        {/* base wash */}
        <div style={{ position: 'absolute', inset: 0, background: `
          radial-gradient(60% 50% at 30% 30%, #F3E6C9 0%, transparent 60%),
          radial-gradient(70% 60% at 80% 70%, #E0D2B0 0%, transparent 65%),
          #EADAB9
        ` }} />
        {/* road network (abstract organic shapes) */}
        <svg width="100%" height="100%" viewBox="0 0 390 844" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
          {/* Water — top right */}
          <path d="M 280 -10 Q 340 80 380 60 L 410 -20 Z" fill="#BBC9C0" opacity="0.75" />
          <path d="M 0 700 Q 80 740 130 720 Q 200 700 230 760 L 230 900 L 0 900 Z" fill="#BBC9C0" opacity="0.65" />
          {/* Parks */}
          <ellipse cx="120" cy="220" rx="65" ry="38" fill="#C8D2A4" opacity="0.7" />
          <ellipse cx="300" cy="500" rx="55" ry="40" fill="#C8D2A4" opacity="0.65" />
          {/* Roads */}
          {[
            "M -10 200 Q 100 220 200 180 T 410 220",
            "M -10 380 Q 80 360 180 380 T 410 360",
            "M -10 580 Q 140 580 220 620 T 410 580",
            "M 80 -10 Q 100 200 140 400 T 200 870",
            "M 280 -10 Q 260 200 290 400 T 320 870",
          ].map((d, i) => (
            <g key={i}>
              <path d={d} stroke="#D9C39A" strokeWidth="14" fill="none" opacity="0.9" />
              <path d={d} stroke="#F4E7CA" strokeWidth="10" fill="none" />
            </g>
          ))}
          {/* tiny side streets */}
          {[
            "M 50 100 L 140 130", "M 230 90 L 320 110", "M 60 460 L 160 470",
            "M 200 700 L 290 690", "M 320 250 L 380 280", "M 30 540 L 110 560",
          ].map((d, i) => (
            <path key={i} d={d} stroke="#D9C39A" strokeWidth="5" fill="none" opacity="0.65" />
          ))}
          {/* building blocks */}
          {Array.from({ length: 28 }).map((_, i) => {
            const x = (i * 53) % 380;
            const y = ((i * 89) % 760) + 40;
            const w = 18 + (i % 4) * 6;
            const h = 14 + (i % 3) * 8;
            return <rect key={i} x={x} y={y} width={w} height={h} rx="2" fill="#D8C7A6" opacity="0.55" />;
          })}
        </svg>

        {/* Texture grain */}
        <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(45deg, rgba(110,80,40,0.02) 0 4px, transparent 4px 8px)', pointerEvents: 'none' }} />
      </div>

      <StatusBar />

      {/* Floating header */}
      <div style={{ position: 'absolute', top: 50, left: 14, right: 14, zIndex: 10 }}>
        <div style={{
          background: 'rgba(253,250,246,0.92)', backdropFilter: 'blur(14px)',
          borderRadius: 999, padding: '12px 14px',
          display: 'flex', alignItems: 'center', gap: 10,
          boxShadow: 'var(--shadow-sm)', border: '1px solid rgba(255,255,255,0.7)',
        }}>
          <Icon name="search" size={18} color="var(--ink-3)" />
          <input
            placeholder="Search restaurants, cuisines, areas..."
            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 14 }}
          />
          <button style={{ background: 'var(--orange-soft)', borderRadius: 999, padding: '6px 8px', display: 'inline-flex', alignItems: 'center' }}>
            <Icon name="layers" size={14} color="var(--orange-deep)" />
          </button>
        </div>
        {/* Filter pills row */}
        <div className="no-scrollbar" style={{ display: 'flex', gap: 8, marginTop: 10, overflowX: 'auto', paddingBottom: 4 }}>
          {['All', 'Wishlist', 'Visited', 'Events', 'Near me', 'Malabar', 'Seafood', 'Café'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className="pill"
              style={{
                background: filter === f ? 'var(--ink)' : 'rgba(253,250,246,0.9)',
                color: filter === f ? '#fff' : 'var(--ink-2)',
                border: filter === f ? '1px solid var(--ink)' : '1px solid rgba(255,255,255,0.6)',
                fontWeight: 600, fontSize: 12, flexShrink: 0,
              }}>{f}</button>
          ))}
        </div>
      </div>

      {/* Map controls */}
      <div style={{ position: 'absolute', right: 16, top: 220, display: 'flex', flexDirection: 'column', gap: 10, zIndex: 8 }}>
        <button style={{ width: 42, height: 42, borderRadius: 14, background: 'rgba(253,250,246,0.95)', backdropFilter: 'blur(10px)', boxShadow: 'var(--shadow-sm)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="locate" size={20} color="var(--orange)" stroke={2.2} />
        </button>
        <div style={{ background: 'rgba(253,250,246,0.95)', backdropFilter: 'blur(10px)', boxShadow: 'var(--shadow-sm)', borderRadius: 14, display: 'flex', flexDirection: 'column' }}>
          <button style={{ width: 42, height: 38, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid var(--line)' }}>
            <Icon name="plus" size={18} stroke={2.2} />
          </button>
          <button style={{ width: 42, height: 38, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="minus" size={18} stroke={2.2} />
          </button>
        </div>
      </div>

      {/* Pins */}
      {pins.map((p, i) => {
        const r = window.FOW_DATA.restaurants.find(x => x.id === p.r);
        if (!r) return null;
        const color = kindColor[p.kind];
        const isCreator = p.kind === 'creator';
        return (
          <button key={p.r} onClick={() => setSelected(p.r)}
            style={{
              position: 'absolute',
              left: `${p.x}%`, top: `${p.y}%`,
              animation: `pinDrop 700ms ${100 + i * 80}ms cubic-bezier(.2,.7,.3,1) both`,
              transform: 'translate(-50%, -100%)',
              zIndex: selected === p.r ? 9 : 6,
            }}>
            <div style={{
              position: 'relative',
              filter: 'drop-shadow(0 6px 8px rgba(60,30,10,0.32))',
              transform: selected === p.r ? 'scale(1.18)' : 'scale(1)',
              transition: 'transform 200ms',
            }}>
              <svg width="34" height="44" viewBox="0 0 34 44" fill="none">
                <path d="M17 0 C26.4 0 34 7.6 34 17 C34 28 17 44 17 44 C17 44 0 28 0 17 C0 7.6 7.6 0 17 0 Z"
                  fill={color}
                  stroke={isCreator ? 'var(--orange)' : 'rgba(255,255,255,0.85)'}
                  strokeWidth={isCreator ? 3 : 2} />
                <circle cx="17" cy="17" r="6" fill={isCreator ? 'var(--orange)' : '#fff'} />
              </svg>
            </div>
          </button>
        );
      })}

      {/* "You're in a new city" banner */}
      {!selected && (
        <div className="fade-up" style={{
          position: 'absolute', left: 14, right: 14, top: 162,
          background: 'var(--ink)', color: '#fff',
          padding: '10px 14px', borderRadius: 14,
          display: 'flex', alignItems: 'center', gap: 10, zIndex: 7,
          boxShadow: 'var(--shadow-md)',
          animationDelay: '600ms',
        }}>
          <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--orange)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="sparkle" size={14} color="#fff" stroke={2.4} />
          </span>
          <div style={{ flex: 1, fontSize: 12, lineHeight: 1.3 }}>
            You're in <b>{state.city}</b>. <span style={{ opacity: 0.7 }}>{state.wishlist.length} saved spots nearby.</span>
          </div>
          <button style={{ color: 'var(--orange)', fontSize: 12, fontWeight: 700 }}>Zoom →</button>
        </div>
      )}

      {/* Bottom sheet */}
      <div className="sheet-enter" style={{
        position: 'absolute', left: 0, right: 0,
        bottom: 78,
        top: expanded ? 44 : 'auto',
        background: 'var(--surface)',
        borderRadius: '24px 24px 0 0',
        boxShadow: '0 -10px 30px rgba(40,20,10,0.18)',
        zIndex: 12,
        transition: 'top 380ms cubic-bezier(.2,.7,.3,1)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>
        <button onClick={() => setExpanded(e => !e)} style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 6px', width: '100%' }}>
          <div style={{ width: 38, height: 4, borderRadius: 4, background: 'var(--ink-4)' }} />
        </button>

        {sel ? (
          <div style={{ padding: '6px 16px 18px' }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <ImgPh palette={sel.palette} src={sel.img} tag={sel.heroTag} style={{ width: 92, height: 92, borderRadius: 16, flexShrink: 0 }} showTag={false} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                  <div>
                    <div className="t-display" style={{ fontSize: 20, fontWeight: 600, lineHeight: 1.05 }}>{sel.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>{sel.cuisines.join(' · ')}</div>
                  </div>
                  <button onClick={() => setSelected(null)} style={{ color: 'var(--ink-3)', padding: 4 }}>
                    <Icon name="close" size={18} />
                  </button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, fontSize: 12, color: 'var(--ink-2)' }}>
                  <Icon name="pin" size={12} color="var(--orange)" />
                  {sel.area} · {sel.distance}
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  <button onClick={() => actions.toggleWishlist(sel.id)} className="btn"
                    style={{ flex: 1, padding: '8px 10px', fontSize: 12, background: state.wishlist.includes(sel.id) ? 'var(--coral-soft)' : 'var(--surface-2)', color: state.wishlist.includes(sel.id) ? 'var(--coral)' : 'var(--ink)' }}>
                    <Icon name={state.wishlist.includes(sel.id) ? 'heartFill' : 'heart'} size={13} color="var(--coral)" stroke={2.2} />
                    {state.wishlist.includes(sel.id) ? 'Saved' : 'Save'}
                  </button>
                  <button onClick={() => actions.openRestaurant(sel.id)} className="btn btn-orange" style={{ flex: 1.4, padding: '8px 10px', fontSize: 12 }}>
                    Open details →
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : expanded ? (
          <ExpandedSheet pins={pins} state={state} actions={actions} setSelected={setSelected} onCollapse={() => setExpanded(false)} filter={filter} setFilter={setFilter} />
        ) : (
          <div style={{ padding: '6px 16px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div>
                <div className="t-display" style={{ fontSize: 18, fontWeight: 600 }}>{pins.length} spots on map</div>
                <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{state.city} · Tap a pin to preview</div>
              </div>
              <button onClick={() => setExpanded(true)} style={{ fontSize: 12, color: 'var(--orange)', fontWeight: 700 }}>Expand list ↑</button>
            </div>
            <div className="no-scrollbar" style={{ display: 'flex', gap: 10, overflowX: 'auto', marginTop: 12 }}>
              {pins.map(p => {
                const r = window.FOW_DATA.restaurants.find(x => x.id === p.r);
                return (
                  <button key={p.r} onClick={() => setSelected(p.r)} style={{
                    width: 140, flexShrink: 0, textAlign: 'left',
                    background: 'var(--surface-2)', borderRadius: 14, overflow: 'hidden',
                  }}>
                    <ImgPh palette={r.palette} src={r.img} tag={r.heroTag} style={{ height: 70 }} showTag={false} />
                    <div style={{ padding: '8px 10px 10px' }}>
                      <div style={{ fontSize: 12.5, fontWeight: 700, lineHeight: 1.1 }}>{r.name}</div>
                      <div style={{ fontSize: 10, color: 'var(--ink-3)', marginTop: 3 }}>{r.area}</div>
                    </div>
                  </button>
                );
              })}
            </div>
            {/* Legend */}
            <div style={{ display: 'flex', gap: 12, marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--line)', flexWrap: 'wrap' }}>
              {[
                ['var(--orange)', 'Wishlist'],
                ['var(--green)', 'Visited'],
                ['#fff', 'Creator pick', 'var(--orange)'],
                ['var(--amber)', 'Event'],
              ].map(([c, label, stroke]) => (
                <span key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--ink-2)' }}>
                  <span style={{ width: 11, height: 11, borderRadius: '50%', background: c, border: stroke ? `2px solid ${stroke}` : 'none' }} />
                  {label}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Expanded list state — full vertical list of all visible restaurants
const ExpandedSheet = ({ pins, state, actions, setSelected, onCollapse, filter, setFilter }) => {
  const [sortBy, setSortBy] = useState('distance');
  const rests = window.FOW_DATA.restaurants;

  // Build list of pin restaurants with sort
  const items = pins.map(p => ({ ...rests.find(r => r.id === p.r), pinKind: p.kind }));
  const sorted = [...items].sort((a, b) => {
    if (sortBy === 'distance') return parseFloat(a.distance) - parseFloat(b.distance);
    if (sortBy === 'saves')    return b.wishlistedBy - a.wishlistedBy;
    return 0;
  });

  const kindLabel = { wishlist: 'On wishlist', visited: 'Visited', creator: 'Creator pick', event: 'Event soon' };
  const kindColor = { wishlist: 'var(--orange)', visited: 'var(--green)', creator: 'var(--orange)', event: 'var(--amber)' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      {/* Header */}
      <div style={{ padding: '4px 18px 12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className="t-caps" style={{ color: 'var(--orange)' }}>In view · {state.city}</div>
            <div className="t-display" style={{ fontSize: 28, fontWeight: 500, lineHeight: 1.05, letterSpacing: '-0.02em', marginTop: 4 }}>
              {pins.length} spots <span className="t-italic">on this map</span>
            </div>
          </div>
          <button onClick={onCollapse} className="btn" style={{ background: 'var(--surface-2)', color: 'var(--ink-2)', padding: '8px 12px', fontSize: 12 }}>
            <Icon name="chevronDown" size={14} stroke={2.4} /> Map
          </button>
        </div>
        {/* Sort + filter */}
        <div style={{ display: 'flex', gap: 8, marginTop: 14, alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: 'var(--ink-3)', fontWeight: 600 }}>Sort by</span>
          {['distance', 'saves'].map(s => (
            <button key={s} onClick={() => setSortBy(s)} style={{
              padding: '6px 10px', borderRadius: 999,
              background: sortBy === s ? 'var(--ink)' : 'transparent',
              color: sortBy === s ? '#fff' : 'var(--ink-2)',
              fontSize: 11, fontWeight: 600,
              border: sortBy === s ? '1px solid var(--ink)' : '1px solid var(--line)',
            }}>{s === 'distance' ? 'Closest' : 'Most saved'}</button>
          ))}
          <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--ink-3)' }}>{filter !== 'All' ? `· ${filter}` : ''}</span>
        </div>
      </div>

      {/* Scrollable list */}
      <div className="no-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '0 12px 24px' }}>
        {sorted.map((r, i) => {
          const onWish = state.wishlist.includes(r.id);
          const onVis  = state.visited.includes(r.id);
          return (
            <div key={r.id} role="button" tabIndex={0} onClick={() => setSelected(r.id)}
              className="fade-up"
              style={{
                width: '100%', textAlign: 'left',
                display: 'flex', gap: 12, padding: '12px 10px',
                borderRadius: 16, position: 'relative',
                background: 'transparent', cursor: 'pointer',
                animationDelay: `${i * 40}ms`,
              }}>
              {/* numbered marker matching pin order */}
              <div style={{
                width: 30, height: 30, borderRadius: '50%',
                background: kindColor[r.pinKind] || 'var(--ink-3)',
                color: r.pinKind === 'creator' ? 'var(--orange)' : '#fff',
                border: r.pinKind === 'creator' ? '2px solid var(--orange)' : '2px solid #fff',
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, marginTop: 4,
                boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                background: r.pinKind === 'creator' ? '#fff' : kindColor[r.pinKind],
              }}>{i + 1}</div>
              <ImgPh palette={r.palette} src={r.img} tag="" showTag={false} style={{ width: 66, height: 66, borderRadius: 14, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'baseline' }}>
                  <div className="t-display" style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.1 }}>{r.name}</div>
                  <span style={{ fontSize: 11, color: 'var(--ink-3)', flexShrink: 0 }}>{r.distance}</span>
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--ink-2)', marginTop: 3 }}>
                  {r.cuisines[0]} · {r.area}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
                  <span style={{ fontSize: 10.5, color: kindColor[r.pinKind], fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: kindColor[r.pinKind], border: r.pinKind === 'creator' ? '1.5px solid var(--orange)' : 'none' }} />
                    {kindLabel[r.pinKind]}
                  </span>
                  <span style={{ marginLeft: 'auto', fontSize: 10.5, color: 'var(--ink-3)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Icon name="heart" size={11} color="var(--coral)" stroke={2} />
                    {r.wishlistedBy}
                  </span>
                  <button onClick={(e) => { e.stopPropagation(); actions.toggleWishlist(r.id); }} style={{
                    width: 30, height: 30, borderRadius: '50%',
                    background: onWish ? 'var(--coral-soft)' : 'var(--surface-2)',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon name={onWish ? 'heartFill' : 'heart'} size={14} color="var(--coral)" stroke={2.2} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

Object.assign(window, { MapView });
