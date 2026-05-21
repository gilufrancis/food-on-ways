// Home Feed screen
const { restaurants: RESTS, creators: CRS, posts: POSTS, events: EVS } = window.FOW_DATA;
const byId = (arr) => Object.fromEntries(arr.map(x => [x.id, x]));
const restById = byId(RESTS);
const creatorById = byId(CRS);

// ─────────────────────────────────────────────────────────────
// Hero card — "Your next great meal"
// ─────────────────────────────────────────────────────────────
const HeroCard = ({ r, isWishlisted, onWishlist, onOpen, creators }) => (
  <div className="fade-up" style={{ margin: '0 16px 22px', borderRadius: 26, overflow: 'hidden', boxShadow: 'var(--shadow-md)', background: 'var(--surface)' }}>
    <ImgPh palette={r.palette} src={r.img} tag={r.heroTag} style={{ height: 380, position: 'relative' }} onClick={() => onOpen(r.id)}>
      {/* top-right wishlist */}
      <div style={{ position: 'absolute', top: 14, right: 14, zIndex: 4 }}>
        <HeartButton filled={isWishlisted} onChange={onWishlist} size={42} />
      </div>
      {/* top-left pinned editor pick */}
      <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 4 }}>
        <Pill variant="dark"><Icon name="sparkle" size={11} stroke={2.4} color="#FFD9B3" />Picked for you</Pill>
      </div>
      {/* gradient overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(20,10,5,0.78) 0%, rgba(20,10,5,0.0) 55%)', pointerEvents: 'none' }} />
      {/* bottom content */}
      <div style={{ position: 'absolute', left: 18, right: 18, bottom: 16, color: '#fff', zIndex: 3 }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
          {r.cuisines.slice(0, 2).map(c => <Pill key={c} variant="dark">{c}</Pill>)}
          <Pill variant="dark"><Icon name="pin" size={11} stroke={2.4} />{r.distance}</Pill>
        </div>
        <div className="t-display" style={{ fontSize: 38, lineHeight: 0.98, fontWeight: 500, letterSpacing: '-0.025em', textWrap: 'pretty' }}>
          {r.name}
        </div>
        <div style={{ marginTop: 6, fontSize: 13, opacity: 0.9 }}>{r.area} · {r.city}</div>
      </div>
    </ImgPh>
    {/* below the image */}
    <div style={{ padding: '16px 18px 18px' }}>
      <div style={{ fontSize: 14, lineHeight: 1.45, color: 'var(--ink-2)', textWrap: 'pretty' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 16, color: 'var(--ink)', marginRight: 6 }}>"</span>
        Known for their pepper crab and the view of Fort Kochi at sunset.
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex' }}>
            {creators.slice(0, 3).map((c, i) => (
              <div key={c.id} style={{ marginLeft: i === 0 ? 0 : -10 }}>
                <Avatar creator={c} size={26} ring="var(--surface)" />
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}><b style={{ color: 'var(--ink)' }}>3 creators</b> have been here</div>
        </div>
        <button onClick={() => onOpen(r.id)} className="btn btn-dark" style={{ padding: '10px 14px', fontSize: 13 }}>
          View details <Icon name="arrowRight" size={14} stroke={2.4} />
        </button>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────
// Creator Post Card — feed staple
// ─────────────────────────────────────────────────────────────
const PostCard = ({ post, restaurant, creator, isWishlisted, isVisited, onWishlist, onOpenRest, onOpenCreator, hideCreator, idx }) => {
  return (
    <div className="fade-up" style={{
      animationDelay: `${100 + (idx % 5) * 60}ms`,
      margin: '0 16px 26px', background: 'var(--surface)',
      borderRadius: 24, overflow: 'hidden', border: '1px solid var(--line)',
    }}>
      {/* creator header */}
      {!hideCreator && (
        <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => onOpenCreator(creator.id)} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Avatar creator={creator} size={36} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                {creator.name}
                {creator.tier === 'Tastemaker' && (
                  <span style={{ fontSize: 10, padding: '2px 6px', background: 'var(--amber-soft)', color: '#6E4A0F', borderRadius: 999, fontWeight: 700 }}>
                    Tastemaker
                  </span>
                )}
              </div>
              <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>{creator.handle} · {post.timeAgo}</div>
            </div>
          </button>
          <button style={{ marginLeft: 'auto', padding: 6, color: 'var(--ink-3)' }}>
            <Icon name="chevronRight" size={18} />
          </button>
        </div>
      )}

      {/* media */}
      <div style={{ position: 'relative' }}>
        <ImgPh palette={post.mediaPalette} src={post.mediaImg} tag={post.mediaTag} style={{ aspectRatio: '4 / 5' }}>
          {/* watch indicator */}
          <div style={{ position: 'absolute', top: 12, left: 12 }}>
            <Pill variant="dark"><Icon name="play" size={10} color="#fff" />0:42</Pill>
          </div>
          {/* visited overlay */}
          {isVisited && (
            <div style={{ position: 'absolute', top: 12, right: 12 }}>
              <Pill variant="green"><Icon name="check" size={12} stroke={2.5} />You've been</Pill>
            </div>
          )}
        </ImgPh>
        {/* restaurant tag pill — anchored over bottom of media */}
        <button onClick={() => onOpenRest(restaurant.id)} style={{
          position: 'absolute', left: 14, bottom: 14,
          background: 'rgba(253,250,246,0.95)', backdropFilter: 'blur(12px)',
          borderRadius: 999, padding: '8px 14px 8px 10px',
          display: 'inline-flex', alignItems: 'center', gap: 8,
          boxShadow: 'var(--shadow-md)',
          border: '1px solid rgba(255,255,255,0.6)',
        }}>
          <span style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--orange)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="pinFill" size={14} color="#fff" />
          </span>
          <span style={{ textAlign: 'left' }}>
            <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, lineHeight: 1 }}>{restaurant.name}</span>
            <span style={{ display: 'block', fontSize: 10.5, color: 'var(--ink-3)', marginTop: 2 }}>{restaurant.area}, {restaurant.city}</span>
          </span>
        </button>
      </div>

      {/* caption + actions */}
      <div style={{ padding: '14px 16px 16px' }}>
        <div style={{ fontSize: 14, lineHeight: 1.45, color: 'var(--ink)', textWrap: 'pretty' }}>
          {post.caption}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 14 }}>
          <div onClick={(e)=>e.stopPropagation()}>
            <HeartButton filled={isWishlisted} onChange={onWishlist} size={38} color="var(--ink)" />
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-2)' }}>{post.saves + (isWishlisted ? 1 : 0)}</span>

          <button style={{ marginLeft: 10, width: 38, height: 38, borderRadius: '50%', background: 'var(--surface-2)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="map" size={18} />
          </button>
          <button style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--surface-2)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="share" size={16} />
          </button>
          {isWishlisted && (
            <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--green)', fontWeight: 600 }}>Already saved ✓</span>
          )}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Event card (horizontal scroll)
// ─────────────────────────────────────────────────────────────
const EventCard = ({ ev, host }) => (
  <div style={{ width: 260, flexShrink: 0, borderRadius: 22, overflow: 'hidden', background: 'var(--surface)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--line)' }}>
    <ImgPh palette={ev.palette} src={ev.img} tag={ev.tag} style={{ height: 130, position: 'relative' }}>
      <div style={{ position: 'absolute', left: 12, top: 12 }}>
        <Pill variant="amber"><Icon name="calendar" size={11} stroke={2.4} />{ev.date} · {ev.time}</Pill>
      </div>
    </ImgPh>
    <div style={{ padding: '14px 14px 16px' }}>
      <div className="t-display" style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.1, textWrap: 'pretty' }}>{ev.name}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
        <Avatar creator={host} size={22} />
        <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>Hosted by <b style={{ color: 'var(--ink-2)' }}>{host.name}</b></div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 }}>
        {ev.spotsLeft <= 8 ? (
          <span style={{ fontSize: 11, color: 'var(--coral)', fontWeight: 700 }}>● {ev.spotsLeft} spots left</span>
        ) : <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>{ev.attending} going</span>}
        <button className="btn btn-orange" style={{ padding: '8px 14px', fontSize: 12 }}>Join</button>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────
// HomeFeed
// ─────────────────────────────────────────────────────────────
const HomeFeed = ({ state, actions, hideCreators }) => {
  const heroR = RESTS[0];
  const trending = RESTS.slice(1, 6);
  return (
    <div style={{ position: 'absolute', inset: 0, overflowY: 'auto', paddingBottom: 96 }} className="no-scrollbar">
      {/* status bar spacer */}
      <div style={{ height: 44 }} />

      {/* Sticky header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 18px 6px' }}>
        <div>
          <div className="t-caps" style={{ color: 'var(--orange)' }}>Good taste,</div>
          <div className="t-caps" style={{ color: 'var(--ink-3)', marginTop: 2 }}>great places.</div>
        </div>
        <div className="t-display" style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-0.02em' }}>
          Food <span style={{ fontStyle: 'italic', color: 'var(--orange)' }}>on</span> Ways
        </div>
        <button style={{ position: 'relative', width: 36, height: 36, borderRadius: '50%', background: 'var(--surface-2)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="bell" size={18} />
          <span style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: '50%', background: 'var(--orange)', border: '1.5px solid var(--surface)' }} />
        </button>
      </div>

      {/* Location bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 18px 18px' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Pill variant="outline"><Icon name="pinFill" size={11} color="var(--orange)" />{state.city}</Pill>
          <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>· Switch city</span>
        </div>
        <span style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>
          <b style={{ color: 'var(--orange)' }}>{state.wishlist.length}</b> wishlisted here
        </span>
      </div>

      {/* Hero */}
      <SectionHead kicker="Your next great meal" title="Crab, biryani, sunset." style={{ marginBottom: 14 }} />
      <HeroCard
        r={heroR}
        isWishlisted={state.wishlist.includes(heroR.id)}
        onWishlist={() => actions.toggleWishlist(heroR.id)}
        onOpen={actions.openRestaurant}
        creators={CRS.slice(0, 3)}
      />

      {/* Trending */}
      <SectionHead kicker="Trending near you 🔥" title="What's getting saved" />
      <div className="no-scrollbar" style={{ display: 'flex', gap: 12, overflowX: 'auto', padding: '12px 16px 8px', scrollSnapType: 'x mandatory' }}>
        {trending.map(r => (
          <div key={r.id} style={{ scrollSnapAlign: 'start' }}>
            <TrendingCard r={r}
              savedState={state.visited.includes(r.id) ? 'visited' : state.wishlist.includes(r.id) ? 'saved' : null}
              onOpen={actions.openRestaurant}
            />
          </div>
        ))}
        {/* See all on map card */}
        <button onClick={() => actions.go('map')} style={{
          width: 168, flexShrink: 0, borderRadius: 18, overflow: 'hidden',
          background: 'var(--ink)', color: '#fff', textAlign: 'left',
          position: 'relative', border: '1px solid rgba(255,255,255,0.08)',
        }}>
          <ImgPh palette={['#3A2E26','#1A1512','#0B0807']} tag="map · zoomed out" style={{ height: 130 }} showTag={false}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 60% 40%, rgba(245,98,45,0.4), transparent 50%)' }} />
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
              <Icon name="map" size={42} stroke={1.4} color="#fff" />
            </div>
          </ImgPh>
          <div style={{ padding: '12px 14px' }}>
            <div className="t-display" style={{ fontSize: 16, fontWeight: 600 }}>See all on map</div>
            <div style={{ fontSize: 11, opacity: 0.6, marginTop: 4 }}>Open spatial view →</div>
          </div>
        </button>
      </div>

      {/* Creator feed */}
      {!hideCreators && (
        <>
          <SectionHead kicker="Fresh from creators" title="Three meals worth your appetite" style={{ marginTop: 22 }} />
          <div style={{ marginTop: 16 }}>
            {POSTS.map((p, i) => (
              <PostCard
                key={p.id}
                idx={i}
                post={p}
                restaurant={restById[p.restaurantId]}
                creator={creatorById[p.creator]}
                isWishlisted={state.wishlist.includes(p.restaurantId)}
                isVisited={state.visited.includes(p.restaurantId)}
                onWishlist={() => actions.toggleWishlist(p.restaurantId)}
                onOpenRest={actions.openRestaurant}
                onOpenCreator={() => {}}
              />
            ))}
          </div>
        </>
      )}

      {hideCreators && (
        <div className="fade-up" style={{ margin: '24px 16px', padding: 22, borderRadius: 22, background: 'var(--surface-2)', textAlign: 'center' }}>
          <div className="t-caps" style={{ color: 'var(--orange)' }}>Tweaks · creators hidden</div>
          <div className="t-display" style={{ fontSize: 18, marginTop: 6 }}>Discovery without the creators.</div>
          <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 6 }}>
            Toggle creators back on from the Tweaks panel to see the editorial feed.
          </div>
        </div>
      )}

      {/* Events */}
      <SectionHead kicker="Happening soon" title="Eat with other people" style={{ marginTop: 8 }} />
      <div className="no-scrollbar" style={{ display: 'flex', gap: 12, overflowX: 'auto', padding: '14px 16px 12px' }}>
        {EVS.map(ev => <EventCard key={ev.id} ev={ev} host={creatorById[ev.host]} />)}
      </div>

      {/* Wishlist nudge */}
      {state.wishlist.length >= 1 && (
        <div className="fade-up" style={{
          margin: '20px 16px 28px',
          padding: 20, borderRadius: 22, background: 'var(--orange-soft)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--orange)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="heartFill" size={18} color="#fff" />
            </div>
            <div>
              <div className="t-display" style={{ fontSize: 18, fontWeight: 600 }}>Planning a {state.city} crawl?</div>
              <div style={{ fontSize: 12, color: 'var(--ink-2)' }}>You've saved {state.wishlist.length} spots here</div>
            </div>
          </div>
          <button onClick={() => actions.go('wishlist')} className="btn btn-orange" style={{ width: '100%' }}>Open my {state.city} list →</button>
        </div>
      )}

      {/* Bottom whitespace before nav */}
      <div style={{ height: 12 }} />
    </div>
  );
};

Object.assign(window, { HomeFeed, HeroCard, PostCard, EventCard });
