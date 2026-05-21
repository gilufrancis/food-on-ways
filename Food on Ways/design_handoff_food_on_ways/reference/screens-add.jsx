// Add a Place bottom sheet + Stamp celebration overlay

const AddSheet = ({ open, onClose, state, actions, onComplete }) => {
  const [step, setStep] = useState(1);
  const [query, setQuery] = useState('');
  const [picked, setPicked] = useState(null);
  const [mode, setMode] = useState(null); // 'wishlist' or 'visited'
  const [dish, setDish] = useState(null);
  const [sentiment, setSentiment] = useState(null);

  useEffect(() => {
    if (open) { setStep(1); setQuery(''); setPicked(null); setMode(null); setDish(null); setSentiment(null); }
  }, [open]);

  if (!open) return null;

  const restaurants = window.FOW_DATA.restaurants;
  const filtered = query
    ? restaurants.filter(r => r.name.toLowerCase().includes(query.toLowerCase()))
    : restaurants.slice(0, 4);

  const next = () => setStep(s => s + 1);
  const back = () => setStep(s => Math.max(1, s - 1));

  const finish = () => {
    if (mode === 'wishlist') actions.addWishlist(picked.id);
    else actions.addVisited(picked.id);
    onComplete?.({ restaurant: picked, mode });
    onClose();
  };

  return (
    <>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(20,10,5,0.42)', backdropFilter: 'blur(4px)', zIndex: 90, animation: 'scaleIn 200ms both' }} />
      <div className="sheet-enter" style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        background: 'var(--surface)',
        borderRadius: '28px 28px 0 0',
        boxShadow: '0 -20px 50px rgba(40,20,10,0.30)',
        zIndex: 95,
        paddingBottom: 24,
        maxHeight: '90%',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 6px' }}>
          <div style={{ width: 38, height: 4, borderRadius: 4, background: 'var(--ink-4)' }} />
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 22px 12px' }}>
          <div className="t-caps" style={{ color: 'var(--orange)' }}>Plant a flag · Step {step}{mode === 'visited' ? '/3' : '/2'}</div>
          <button onClick={onClose} style={{ color: 'var(--ink-3)', padding: 4 }}>
            <Icon name="close" size={20} />
          </button>
        </div>

        {/* STEP 1 — search/pin */}
        {step === 1 && (
          <div style={{ padding: '0 22px 18px' }}>
            <div className="t-display" style={{ fontSize: 28, fontWeight: 500, lineHeight: 1, letterSpacing: '-0.02em' }}>
              Which restaurant?
            </div>
            <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', background: 'var(--surface-2)', borderRadius: 16 }}>
              <Icon name="search" size={18} color="var(--ink-3)" />
              <input autoFocus value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Type or paste a name..."
                style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 15 }} />
            </div>
            <div style={{ marginTop: 12, display: 'flex', gap: 10 }}>
              <button style={{ flex: 1, padding: 14, borderRadius: 16, background: 'var(--surface-2)', display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 13, fontWeight: 600 }}>
                <Icon name="locate" size={16} color="var(--orange)" />
                Use my location
              </button>
              <button style={{ flex: 1, padding: 14, borderRadius: 16, background: 'var(--surface-2)', display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 13, fontWeight: 600 }}>
                <Icon name="pinFill" size={16} color="var(--orange)" />
                Drop a pin
              </button>
            </div>

            <div className="t-caps" style={{ color: 'var(--ink-3)', marginTop: 18, marginBottom: 10 }}>{query ? 'Matches' : 'Suggested'}</div>
            <div style={{ maxHeight: 260, overflowY: 'auto' }} className="no-scrollbar">
              {filtered.slice(0, 5).map(r => (
                <button key={r.id} onClick={() => { setPicked(r); next(); }}
                  style={{ width: '100%', display: 'flex', gap: 12, padding: 10, textAlign: 'left', borderRadius: 14, background: 'transparent' }}>
                  <ImgPh palette={r.palette} src={r.img} tag="" showTag={false} style={{ width: 48, height: 48, borderRadius: 12, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{r.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>{r.cuisines[0]} · {r.area}, {r.city}</div>
                  </div>
                  <Icon name="chevronRight" size={18} color="var(--ink-3)" style={{ alignSelf: 'center' }} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2 — status toggle */}
        {step === 2 && picked && (
          <div style={{ padding: '0 22px 18px' }}>
            <button onClick={back} style={{ fontSize: 12, color: 'var(--ink-3)', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
              <Icon name="arrowLeft" size={14} /> back
            </button>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16 }}>
              <ImgPh palette={picked.palette} src={picked.img} tag="" showTag={false} style={{ width: 54, height: 54, borderRadius: 14 }} />
              <div>
                <div className="t-display" style={{ fontSize: 18, fontWeight: 600 }}>{picked.name}</div>
                <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>{picked.area}, {picked.city}</div>
              </div>
            </div>
            <div className="t-display" style={{ fontSize: 24, lineHeight: 1.1, fontWeight: 500 }}>
              Where does this <span className="t-italic">go?</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 18 }}>
              <button onClick={() => { setMode('wishlist'); /* finish later */ }} style={{
                textAlign: 'left', padding: 18, borderRadius: 20,
                background: mode === 'wishlist' ? 'var(--coral-soft)' : 'var(--surface-2)',
                border: mode === 'wishlist' ? '2px solid var(--coral)' : '2px solid transparent',
                display: 'flex', alignItems: 'center', gap: 14,
              }}>
                <div style={{ width: 54, height: 54, borderRadius: '50%', background: 'var(--coral)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name="heartFill" size={26} color="#fff" />
                </div>
                <div>
                  <div className="t-display" style={{ fontSize: 18, fontWeight: 600 }}>Add to Wishlist</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-2)' }}>I want to visit this one day</div>
                </div>
              </button>
              <button onClick={() => { setMode('visited'); setStep(3); }} style={{
                textAlign: 'left', padding: 18, borderRadius: 20,
                background: mode === 'visited' ? 'var(--green-soft)' : 'var(--surface-2)',
                border: mode === 'visited' ? '2px solid var(--green)' : '2px solid transparent',
                display: 'flex', alignItems: 'center', gap: 14,
              }}>
                <div style={{ width: 54, height: 54, borderRadius: '50%', background: 'var(--green)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name="check" size={28} stroke={2.6} color="#fff" />
                </div>
                <div>
                  <div className="t-display" style={{ fontSize: 18, fontWeight: 600 }}>Mark as Visited</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-2)' }}>I've eaten here. Stamp it.</div>
                </div>
              </button>
            </div>

            {mode === 'wishlist' && (
              <button onClick={finish} className="btn btn-orange" style={{ width: '100%', marginTop: 18 }}>
                Save to my {state.city} wishlist
              </button>
            )}
          </div>
        )}

        {/* STEP 3 — visited memory */}
        {step === 3 && picked && mode === 'visited' && (
          <div style={{ padding: '0 22px 18px' }}>
            <button onClick={back} style={{ fontSize: 12, color: 'var(--ink-3)', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
              <Icon name="arrowLeft" size={14} /> back
            </button>
            <div className="t-display" style={{ fontSize: 24, lineHeight: 1.1, fontWeight: 500 }}>
              What did you <span className="t-italic">have?</span>
            </div>
            <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {picked.mustOrder.concat([{ name: 'Something else…' }]).map(d => (
                <button key={d.name} onClick={() => setDish(d.name)} className="pill"
                  style={{
                    background: dish === d.name ? 'var(--ink)' : 'var(--surface-2)',
                    color: dish === d.name ? '#fff' : 'var(--ink)',
                    border: 'none', fontWeight: 600, padding: '8px 14px', fontSize: 13,
                  }}>{d.name}</button>
              ))}
            </div>

            <div style={{ marginTop: 20 }}>
              <div className="t-caps" style={{ color: 'var(--ink-3)' }}>How was it?</div>
              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                {['😍', '🙂', '😐', '😕'].map(em => (
                  <button key={em} onClick={() => setSentiment(em)} style={{
                    flex: 1, height: 58, borderRadius: 16,
                    background: sentiment === em ? 'var(--orange-soft)' : 'var(--surface-2)',
                    border: sentiment === em ? '2px solid var(--orange)' : '2px solid transparent',
                    fontSize: 26,
                  }}>{em}</button>
                ))}
              </div>
            </div>

            <button style={{
              marginTop: 16, width: '100%', padding: 18, borderRadius: 18,
              background: 'var(--surface-2)', border: '2px dashed var(--ink-4)',
              color: 'var(--ink-3)', fontSize: 13, fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              <Icon name="camera" size={18} /> Add a photo
            </button>

            <button onClick={finish} className="btn btn-green" style={{ width: '100%', marginTop: 18 }}>
              <Icon name="check" size={16} stroke={2.4} />
              Stamp it · Save to Visited
            </button>
          </div>
        )}
      </div>
    </>
  );
};

// ─────────────────────────────────────────────────────────────
// Pin drop celebration overlay
// ─────────────────────────────────────────────────────────────
const PinDropCelebration = ({ active, mode, restaurant, onDone }) => {
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(onDone, 1800);
    return () => clearTimeout(t);
  }, [active]);
  if (!active) return null;

  const orange = mode === 'wishlist';
  const color = orange ? 'var(--orange)' : 'var(--green)';

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 200,
      background: 'rgba(26,21,18,0.62)',
      backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'scaleIn 200ms both',
    }}>
      <div style={{ position: 'relative', width: 280, height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* mini map */}
        <ImgPh palette={['#F3E6C9','#D9C39A','#5A4530']} tag="" showTag={false}
          style={{ width: 230, height: 230, borderRadius: '50%', overflow: 'hidden' }}>
          {/* concentric rings */}
          {[40, 80, 120].map(s => (
            <div key={s} style={{
              position: 'absolute', left: '50%', top: '50%',
              transform: 'translate(-50%,-50%)',
              width: s, height: s, borderRadius: '50%',
              border: `2px solid ${color}`,
              opacity: 0.25,
              animation: `scaleIn 700ms ${s * 4}ms both`,
            }} />
          ))}
        </ImgPh>
        {/* dropping pin */}
        <div style={{
          position: 'absolute', left: '50%', top: '50%',
          animation: 'pinDrop 800ms cubic-bezier(.2,.7,.3,1) both',
        }}>
          <svg width="62" height="80" viewBox="0 0 62 80" fill="none" style={{ filter: 'drop-shadow(0 10px 14px rgba(60,30,10,0.4))' }}>
            <path d="M31 0 C48 0 62 14 62 30 C62 52 31 80 31 80 C31 80 0 52 0 30 C0 14 14 0 31 0 Z" fill={color} stroke="rgba(255,255,255,0.85)" strokeWidth="3" />
            {orange ? (
              <path d="M31 18 C25 18 22 22 22 28 C22 34 31 44 31 44 C31 44 40 34 40 28 C40 22 37 18 31 18 Z" fill="#fff" />
            ) : (
              <path d="M22 30 l8 8 l14 -14" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            )}
          </svg>
        </div>
        {/* sparkles */}
        {Array.from({ length: 8 }).map((_, i) => {
          const ang = (i / 8) * Math.PI * 2;
          return (
            <span key={i} className="heart-burst-piece"
              style={{
                "--tx": Math.cos(ang) * 90 + 'px',
                "--ty": Math.sin(ang) * 90 + 'px',
                color: color,
                animationDelay: '500ms',
                fontSize: 18,
              }}>{i % 2 === 0 ? '✦' : '·'}</span>
          );
        })}
        {/* label */}
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: -50, textAlign: 'center', color: '#fff', animation: 'fadeUp 400ms 800ms both' }}>
          <div className="t-display" style={{ fontSize: 22, fontWeight: 500 }}>
            {orange ? 'Saved!' : 'Stamped!'}
          </div>
          <div style={{ fontSize: 12, opacity: 0.8, marginTop: 2 }}>
            {restaurant?.name} added to your {orange ? 'wishlist' : 'visited list'}
          </div>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { AddSheet, PinDropCelebration });
