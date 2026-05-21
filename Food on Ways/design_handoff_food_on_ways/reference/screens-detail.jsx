// Restaurant Detail screen
const RestaurantDetail = ({ restaurant, state, actions }) => {
  const r = restaurant;
  const [photoIdx, setPhotoIdx] = useState(0);
  const isWishlisted = state.wishlist.includes(r.id);
  const isVisited = state.visited.includes(r.id);
  const photoRef = useRef(null);

  // Pick a few creators who "posted about" this place — for social proof
  const postedBy = window.FOW_DATA.creators.slice(0, 4);

  return (
    <div className="screen-enter" style={{ position: 'absolute', inset: 0, overflowY: 'auto', paddingBottom: 110, background: 'var(--surface)' }}>
      {/* Hero photo carousel */}
      <div style={{ position: 'relative', height: 440 }}>
        <div
          ref={photoRef}
          onScroll={(e) => {
            const i = Math.round(e.currentTarget.scrollLeft / 390);
            setPhotoIdx(i);
          }}
          className="no-scrollbar"
          style={{ display: 'flex', overflowX: 'auto', height: '100%', scrollSnapType: 'x mandatory' }}
        >
          {r.photos.map((p, i) => (
            <div key={i} style={{ width: 390, height: '100%', flexShrink: 0, scrollSnapAlign: 'start' }}>
              <ImgPh palette={p.palette} src={p.img} tag={p.tag} style={{ width: '100%', height: '100%' }} />
            </div>
          ))}
        </div>

        {/* gradient overlays */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 110, background: 'linear-gradient(to bottom, rgba(0,0,0,0.42), transparent)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, background: 'linear-gradient(to top, rgba(0,0,0,0.32), transparent)', pointerEvents: 'none' }} />

        {/* Status bar passthrough (light) */}
        <StatusBar light />

        {/* Top controls */}
        <div style={{ position: 'absolute', top: 50, left: 14, right: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
          <button onClick={actions.back} style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(253,250,246,0.92)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}>
            <Icon name="arrowLeft" size={20} stroke={2.2} />
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            <Pill variant="dark">{photoIdx + 1} / {r.photos.length}</Pill>
            <button style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(26,21,18,0.42)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.18)' }}>
              <Icon name="share" size={18} />
            </button>
          </div>
        </div>

        {/* Floating wishlist */}
        <div style={{ position: 'absolute', right: 16, bottom: -22, zIndex: 20 }}>
          <HeartButton filled={isWishlisted} onChange={() => actions.toggleWishlist(r.id)} size={52} style={{ boxShadow: 'var(--shadow-md)' }} />
        </div>
      </div>

      {/* Identity block */}
      <div style={{ padding: '24px 22px 6px' }}>
        {r.since && (
          <div className="t-mono" style={{ color: 'var(--ink-3)', marginBottom: 6 }}>EST. {r.since}</div>
        )}
        <div className="t-display" style={{ fontSize: 38, lineHeight: 0.98, fontWeight: 500, letterSpacing: '-0.03em' }}>
          {r.name}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
          {r.cuisines.map(c => <Pill key={c} variant="outline">{c}</Pill>)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14, fontSize: 13, color: 'var(--ink-2)' }}>
          <Icon name="pinFill" size={14} color="var(--orange)" />
          <span>{r.area}, {r.city}</span>
          <span style={{ color: 'var(--ink-4)' }}>·</span>
          <button style={{ color: 'var(--orange)', fontWeight: 600 }}>See on map</button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 8, fontSize: 13, color: 'var(--ink-2)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: r.open ? 'var(--green)' : 'var(--coral)' }} />
            {r.hours}
          </span>
          <span style={{ color: 'var(--ink-4)' }}>·</span>
          <span>{r.distance} away</span>
        </div>
      </div>

      {/* Social proof strip */}
      <div style={{ padding: '22px 22px 8px' }}>
        <div className="t-caps" style={{ color: 'var(--ink-3)', marginBottom: 10 }}>Visited by 4 creators you follow</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {postedBy.map((c, i) => (
            <button key={c.id} style={{ position: 'relative' }}>
              <Avatar creator={c} size={44} ring="var(--surface)" />
              {i === 0 && <span style={{ position: 'absolute', bottom: -2, right: -2, background: 'var(--amber)', color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 5px', borderRadius: 999, border: '2px solid var(--surface)' }}>T</span>}
            </button>
          ))}
          <button style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--surface-2)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-3)', fontSize: 12, fontWeight: 700 }}>+8</button>
        </div>
      </div>

      {/* Flavour note (editorial highlight) */}
      <div style={{ margin: '18px 16px 0', padding: 22, borderRadius: 22, background: 'var(--amber-soft)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 16, top: 4, fontFamily: 'var(--font-display)', fontSize: 72, color: 'rgba(110,42,30,0.18)', fontStyle: 'italic', lineHeight: 1 }}>"</div>
        <div className="t-caps" style={{ color: '#6E4A0F', marginBottom: 8 }}>The flavour note</div>
        <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 17, lineHeight: 1.42, color: '#3D2607', textWrap: 'pretty' }}>
          {r.flavour}
        </div>
        <div style={{ fontSize: 11, color: '#9D7A47', marginTop: 12 }}>— Editorial team</div>
      </div>

      {/* Must order */}
      <div style={{ marginTop: 28 }}>
        <SectionHead kicker="What to order" title="The three to try" />
        <div className="no-scrollbar" style={{ display: 'flex', gap: 12, overflowX: 'auto', padding: '14px 16px 8px' }}>
          {r.mustOrder.map((d, i) => (
            <div key={d.name} style={{ width: 180, flexShrink: 0, borderRadius: 20, overflow: 'hidden', background: 'var(--surface)', border: '1px solid var(--line)' }}>
              <ImgPh palette={d.palette} src={d.img} tag={d.tag} style={{ height: 130 }} />
              <div style={{ padding: '12px 14px 14px' }}>
                <div className="t-display" style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.1 }}>{d.name}</div>
                <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 6 }}>{d.note}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Creator posts mini list */}
      <div style={{ marginTop: 22 }}>
        <SectionHead kicker="What creators are saying" title="Recent posts" action="See all" />
        <div style={{ padding: '12px 16px 0' }}>
          {window.FOW_DATA.posts.slice(0, 2).map(p => {
            const c = window.FOW_DATA.creators.find(x => x.id === p.creator);
            return (
              <div key={p.id} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--line)' }}>
                <ImgPh palette={p.mediaPalette} src={p.mediaImg} tag={p.mediaTag} style={{ width: 72, height: 72, borderRadius: 14, flexShrink: 0 }} showTag={false}/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <Avatar creator={c} size={18} />
                    <span style={{ fontSize: 12, fontWeight: 700 }}>{c.name}</span>
                    <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>· {p.timeAgo}</span>
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.4 }}>{p.caption}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Practical info */}
      <div style={{ margin: '22px 16px 0', padding: 18, borderRadius: 22, background: 'var(--surface-2)' }}>
        <div className="t-caps" style={{ color: 'var(--ink-3)', marginBottom: 12 }}>How to get there</div>
        <div style={{ borderRadius: 14, overflow: 'hidden', height: 130, position: 'relative', background: 'var(--ink)' }}>
          {/* mini map */}
          <ImgPh palette={['#E4D8C0','#A88D6C','#5A4530']} tag="map · this restaurant" showTag={false} style={{ width: '100%', height: '100%' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.04) 0 1px, transparent 1px 14px), repeating-linear-gradient(90deg, rgba(0,0,0,0.04) 0 1px, transparent 1px 14px)' }} />
            {/* Pin */}
            <div style={{ position: 'absolute', left: '50%', top: '54%', transform: 'translate(-50%, -100%)' }}>
              <Icon name="pinFill" size={36} color="var(--orange)" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }} />
            </div>
          </ImgPh>
        </div>
        <div style={{ marginTop: 14, fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.5 }}>
          {r.area}, {r.city}, Kerala
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          <button className="btn btn-outline" style={{ flex: 1, padding: '10px 12px', fontSize: 12 }}>
            <Icon name="phone" size={14} />Call
          </button>
          <button className="btn btn-outline" style={{ flex: 1, padding: '10px 12px', fontSize: 12 }}>
            <Icon name="map" size={14} />Directions
          </button>
        </div>
      </div>

      {/* Bottom CTA bar (fixed within frame) */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        padding: '14px 16px 24px',
        background: 'linear-gradient(to top, var(--surface) 65%, rgba(253,250,246,0))',
        display: 'flex', gap: 10, zIndex: 30,
      }}>
        <button
          onClick={() => actions.toggleWishlist(r.id)}
          className="btn"
          style={{
            flex: 1, padding: '14px 12px', fontSize: 14,
            background: isWishlisted ? 'var(--green-soft)' : 'transparent',
            color: isWishlisted ? 'var(--green)' : 'var(--ink)',
            border: `1.5px solid ${isWishlisted ? 'var(--green)' : 'var(--ink)'}`,
          }}
        >
          <Icon name={isWishlisted ? 'check' : 'heart'} size={16} stroke={2.2} />
          {isWishlisted ? 'Wishlisted' : 'Save to Wishlist'}
        </button>
        <button
          onClick={() => actions.toggleVisited(r.id)}
          className="btn"
          style={{
            flex: 1.05, padding: '14px 12px', fontSize: 14,
            background: isVisited ? 'var(--green)' : 'var(--orange)',
            color: '#fff',
          }}
        >
          <Icon name="check" size={16} stroke={2.4} />
          {isVisited ? 'Visited ✓' : 'Mark as Visited'}
        </button>
      </div>
    </div>
  );
};

Object.assign(window, { RestaurantDetail });
