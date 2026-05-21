// Wishlist + Visited + Cuisine Passport screens

// ─────────────────────────────────────────────────────────────
// WishlistScreen
// ─────────────────────────────────────────────────────────────
const WishlistScreen = ({ state, actions }) => {
  const rests = window.FOW_DATA.restaurants;
  // Group by city
  const byCity = {};
  state.wishlist.forEach(id => {
    const r = rests.find(x => x.id === id);
    if (!r) return;
    (byCity[r.city] = byCity[r.city] || []).push(r);
  });
  const cities = Object.keys(byCity);
  const totalCities = cities.length;

  return (
    <div style={{ position: 'absolute', inset: 0, overflowY: 'auto', paddingBottom: 96, background: 'var(--surface)' }} className="no-scrollbar">
      <div style={{ height: 44 }} />

      <div style={{ padding: '8px 22px 8px' }}>
        <div className="t-caps" style={{ color: 'var(--coral)' }}>The Wishlist</div>
        <div className="t-display" style={{ fontSize: 38, lineHeight: 0.96, fontWeight: 500, letterSpacing: '-0.03em', marginTop: 8, textWrap: 'pretty' }}>
          Places I want <span className="t-italic">to eat</span>
        </div>
        <div style={{ marginTop: 10, fontSize: 13, color: 'var(--ink-3)' }}>
          {state.wishlist.length} spots across {totalCities} {totalCities === 1 ? 'city' : 'cities'}
        </div>
      </div>

      {/* Trip planning banner */}
      {Object.values(byCity).some(arr => arr.length >= 2) && (
        <div className="fade-up" style={{ margin: '14px 16px 18px', padding: 18, borderRadius: 22, background: 'var(--ink)', color: '#fff', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -20, top: -20, opacity: 0.15 }}>
            <Icon name="map" size={140} color="var(--orange)" stroke={1.2} />
          </div>
          <div className="t-caps" style={{ color: 'var(--orange)' }}>Trip plan</div>
          <div className="t-display" style={{ fontSize: 20, marginTop: 6 }}>
            {Object.entries(byCity).find(([_, arr]) => arr.length >= 2)[1].length} spots in {Object.entries(byCity).find(([_, arr]) => arr.length >= 2)[0]}
          </div>
          <div style={{ fontSize: 12.5, opacity: 0.7, marginTop: 4 }}>Want to plan a route?</div>
          <button onClick={() => actions.go('map')} className="btn btn-orange" style={{ marginTop: 14, padding: '10px 16px', fontSize: 13 }}>
            Open on map →
          </button>
        </div>
      )}

      {state.wishlist.length === 0 ? (
        // Empty state
        <div style={{ padding: '40px 30px', textAlign: 'center' }}>
          <div style={{
            width: 180, height: 180, margin: '0 auto', borderRadius: 28,
            background: 'var(--surface-2)', position: 'relative',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
              <path d="M 10 90 Q 30 60 50 75 T 110 50"
                stroke="var(--orange)" strokeWidth="2.5" fill="none" strokeDasharray="3 5" strokeLinecap="round" />
              <circle cx="10" cy="90" r="5" fill="var(--orange)" />
              <circle cx="110" cy="50" r="5" fill="var(--orange)" />
              <Icon name="fork" size={36} color="var(--ink)" />
            </svg>
          </div>
          <div className="t-display" style={{ fontSize: 22, marginTop: 18, fontWeight: 500 }}>
            Your food adventures <span className="t-italic">start here.</span>
          </div>
          <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 8 }}>
            Save places from the feed to build your wishlist.
          </div>
          <button onClick={() => actions.go('home')} className="btn btn-orange" style={{ marginTop: 18 }}>
            Explore the feed →
          </button>
        </div>
      ) : (
        // City groupings
        <div style={{ padding: '0 16px' }}>
          {cities.map((city, ci) => (
            <div key={city} className="fade-up" style={{ marginBottom: 22, animationDelay: `${ci * 80}ms` }}>
              {/* City header with collage */}
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12, padding: '4px 4px' }}>
                <div style={{ display: 'flex' }}>
                  {byCity[city].slice(0, 3).map((r, i) => (
                    <div key={r.id} style={{
                      width: 44, height: 44, borderRadius: 12, marginLeft: i === 0 ? 0 : -10,
                      border: '2px solid var(--surface)', overflow: 'hidden',
                      transform: `rotate(${i * 4 - 4}deg)`,
                      boxShadow: 'var(--shadow-sm)',
                    }}>
                      <ImgPh palette={r.palette} src={r.img} tag="" showTag={false} style={{ width: '100%', height: '100%' }} />
                    </div>
                  ))}
                </div>
                <div style={{ flex: 1 }}>
                  <div className="t-display" style={{ fontSize: 22, fontWeight: 500 }}>{city}</div>
                  <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>{byCity[city].length} saved spots</div>
                </div>
                <Icon name="chevronDown" size={20} color="var(--ink-3)" />
              </div>

              {byCity[city].map(r => {
                const creditCreator = window.FOW_DATA.creators[Math.abs(r.id.charCodeAt(0)) % window.FOW_DATA.creators.length];
                return (
                  <button key={r.id} onClick={() => actions.openRestaurant(r.id)}
                    style={{
                      width: '100%', display: 'flex', gap: 12, padding: '10px 8px',
                      textAlign: 'left', borderRadius: 16,
                      background: 'transparent',
                    }}>
                    <ImgPh palette={r.palette} src={r.img} tag="" showTag={false} style={{ width: 76, height: 76, borderRadius: 16, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                        <div className="t-display" style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.1 }}>{r.name}</div>
                        {state.visited.includes(r.id) && <Pill variant="green">Visited</Pill>}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--ink-2)', marginTop: 4 }}>
                        {r.cuisines[0]} · {r.area}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, fontSize: 11, color: 'var(--ink-3)' }}>
                        <Avatar creator={creditCreator} size={16} />
                        Saved from <b style={{ color: 'var(--ink-2)' }}>{creditCreator.handle}</b>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// VisitedScreen + Cuisine Passport
// ─────────────────────────────────────────────────────────────
const VisitedScreen = ({ state, actions }) => {
  const rests = window.FOW_DATA.restaurants;
  const cuisines = window.FOW_DATA.cuisines;
  const visitedRests = state.visited.map(id => rests.find(r => r.id === id)).filter(Boolean);

  // Cuisines unlocked: any cuisine where any visited restaurant has that cuisine label
  const unlocked = new Set();
  visitedRests.forEach(r => r.cuisines.forEach(c => {
    // map restaurant cuisine label to passport id by simple match
    const m = cuisines.find(p => p.label.toLowerCase().includes(c.toLowerCase()) || c.toLowerCase().includes(p.label.toLowerCase()));
    if (m) unlocked.add(m.id);
  }));

  const cities = [...new Set(visitedRests.map(r => r.city))];

  return (
    <div style={{ position: 'absolute', inset: 0, overflowY: 'auto', paddingBottom: 96, background: 'var(--surface)' }} className="no-scrollbar">
      <div style={{ height: 44 }} />

      {/* Header */}
      <div style={{ padding: '8px 22px 4px' }}>
        <div className="t-caps" style={{ color: 'var(--green)' }}>The Trophy Shelf</div>
        <div className="t-display" style={{ fontSize: 36, lineHeight: 0.98, fontWeight: 500, letterSpacing: '-0.03em', marginTop: 8 }}>
          Where I've <span className="t-italic">eaten</span>
        </div>
      </div>

      {/* Stats strip */}
      <div style={{ display: 'flex', gap: 10, padding: '18px 16px 12px' }}>
        {[
          { n: state.visited.length, label: 'Places visited', accent: 'var(--orange)' },
          { n: cities.length, label: 'Cities explored', accent: 'var(--green)' },
          { n: unlocked.size, label: 'Cuisines unlocked', accent: 'var(--amber)' },
        ].map(s => (
          <div key={s.label} style={{ flex: 1, padding: '14px 12px', background: 'var(--surface-2)', borderRadius: 18, position: 'relative' }}>
            <div className="t-display" style={{ fontSize: 32, fontWeight: 600, color: s.accent, letterSpacing: '-0.02em' }}>{s.n}</div>
            <div style={{ fontSize: 10.5, color: 'var(--ink-3)', marginTop: 2, lineHeight: 1.25 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Cuisine passport */}
      <div style={{ padding: '18px 22px 0' }}>
        <div className="t-caps" style={{ color: 'var(--ink-3)', marginBottom: 4 }}>Cuisine Passport</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div className="t-display" style={{ fontSize: 20, fontWeight: 600 }}>{unlocked.size} of {cuisines.length} stamps</div>
          <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>{cuisines.length - unlocked.size} to go</span>
        </div>
      </div>

      <div className="no-scrollbar" style={{ display: 'flex', gap: 12, padding: '14px 16px 6px', overflowX: 'auto' }}>
        {cuisines.map(c => {
          const on = unlocked.has(c.id);
          return (
            <div key={c.id} style={{
              width: 108, flexShrink: 0,
              borderRadius: 20, padding: '14px 10px 12px',
              textAlign: 'center',
              background: on ? '#fff' : 'transparent',
              border: on ? '2px solid var(--ink)' : '2px dashed var(--ink-4)',
              position: 'relative',
              opacity: on ? 1 : 0.55,
            }}>
              <div style={{
                width: 54, height: 54, borderRadius: '50%',
                margin: '0 auto 8px',
                background: on ? `linear-gradient(135deg, ${c.palette[0]}, ${c.palette[2]})` : 'var(--surface-2)',
                border: on ? '2px solid #fff' : '2px dashed var(--ink-4)',
                boxShadow: on ? 'inset 0 0 0 1px rgba(0,0,0,0.1)' : 'none',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 22,
              }}>
                {on ? c.label[0] : '?'}
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: on ? 'var(--ink)' : 'var(--ink-3)' }}>{c.label}</div>
              <div style={{ fontSize: 10, color: 'var(--ink-3)', marginTop: 2 }}>
                {on ? `${visitedRests.filter(r => r.cuisines.some(rc => c.label.toLowerCase().includes(rc.toLowerCase()) || rc.toLowerCase().includes(c.label.toLowerCase()))).length} place` : 'Locked'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Visited list */}
      <div style={{ padding: '24px 22px 6px' }}>
        <SectionHead kicker="Recently visited" title="The diary" style={{ padding: 0 }} />
      </div>
      <div style={{ padding: '0 16px' }}>
        {visitedRests.length === 0 ? (
          <div style={{ padding: 30, textAlign: 'center', borderRadius: 22, background: 'var(--surface-2)', margin: '8px 0 22px' }}>
            <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>
              When you eat somewhere, mark it as Visited. Stamps land here.
            </div>
          </div>
        ) : visitedRests.map((r, i) => {
          const creator = window.FOW_DATA.creators[i % window.FOW_DATA.creators.length];
          return (
            <button key={r.id} onClick={() => actions.openRestaurant(r.id)}
              className="fade-up"
              style={{
                width: '100%', display: 'block', textAlign: 'left',
                marginBottom: 14, borderRadius: 22, overflow: 'hidden',
                background: '#fff', border: '1px solid var(--line)',
                animationDelay: `${i * 60}ms`,
              }}>
              <ImgPh palette={r.palette} src={r.img} tag={r.heroTag} style={{ height: 170, position: 'relative' }}>
                {/* visited stamp overlay (rotated) */}
                <div style={{
                  position: 'absolute', right: 14, top: 14,
                  width: 64, height: 64, borderRadius: '50%',
                  border: '2px solid var(--green)', color: 'var(--green)',
                  background: 'rgba(255,250,240,0.85)',
                  backdropFilter: 'blur(4px)',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  transform: 'rotate(-8deg)',
                  fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 9, letterSpacing: '0.18em',
                  textAlign: 'center', lineHeight: 1.1,
                }}>
                  <div>
                    <Icon name="check" size={18} color="var(--green)" stroke={2.8} /><br />
                    VISITED
                  </div>
                </div>
              </ImgPh>
              <div style={{ padding: '14px 16px 16px' }}>
                <div className="t-display" style={{ fontSize: 20, fontWeight: 600, lineHeight: 1.05 }}>{r.name}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 4 }}>
                  {r.city} · Visited last week
                </div>
                {i === 0 && (
                  <div style={{
                    marginTop: 12, padding: '10px 12px',
                    background: 'var(--surface-2)', borderRadius: 14,
                    fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 13,
                    color: 'var(--ink-2)', lineHeight: 1.4,
                    borderLeft: '3px solid var(--orange)',
                  }}>
                    "The biryani was everything Neha said it was. Came back the next day."
                  </div>
                )}
                {i !== 0 && (
                  <div style={{ marginTop: 10, fontSize: 12, color: 'var(--ink-3)' }}>
                    What did you have? <span style={{ color: 'var(--orange)', fontWeight: 700 }}>Add a memory →</span>
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12, fontSize: 11, color: 'var(--ink-3)' }}>
                  <Avatar creator={creator} size={14} />
                  Discovered via <b style={{ color: 'var(--ink-2)' }}>{creator.handle}</b>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

Object.assign(window, { WishlistScreen, VisitedScreen });
