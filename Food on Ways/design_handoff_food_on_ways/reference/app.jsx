// App shell — combines all screens with shared state, navigation,
// and Add-a-place sheet + celebration overlays.

const App = ({ initialScreen = 'home', hideCreators = false, mapExpanded = false }) => {
  const [screen, setScreen] = useState(initialScreen);
  const [activeRestaurant, setActiveRestaurant] = useState(null);
  const [history, setHistory] = useState([]);
  const [wishlist, setWishlist] = useState(['paragon', 'appammachi', 'kayees']);
  const [visited, setVisited] = useState(['topform']);
  const [snack, setSnack] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [celebration, setCelebration] = useState(null); // {mode, restaurant}
  const [city] = useState('Kozhikode');

  const state = { wishlist, visited, city };

  const actions = {
    go: (s) => { setScreen(s); setActiveRestaurant(null); },
    openRestaurant: (id) => {
      setHistory(h => [...h, screen]);
      setActiveRestaurant(id);
      setScreen('detail');
    },
    back: () => {
      const last = history[history.length - 1];
      setHistory(h => h.slice(0, -1));
      setActiveRestaurant(null);
      setScreen(last || 'home');
    },
    toggleWishlist: (id) => {
      setWishlist(w => {
        const next = w.includes(id) ? w.filter(x => x !== id) : [...w, id];
        if (!w.includes(id)) {
          const r = window.FOW_DATA.restaurants.find(x => x.id === id);
          setSnack(`Saved “${r.name}” to your ${city} wishlist`);
        }
        return next;
      });
    },
    toggleVisited: (id) => {
      setVisited(v => {
        const had = v.includes(id);
        const next = had ? v.filter(x => x !== id) : [...v, id];
        if (!had) {
          const r = window.FOW_DATA.restaurants.find(x => x.id === id);
          setSnack(`Stamped “${r.name}” as visited ✓`);
        }
        return next;
      });
    },
    addWishlist: (id) => setWishlist(w => w.includes(id) ? w : [...w, id]),
    addVisited: (id) => setVisited(v => v.includes(id) ? v : [...v, id]),
    openAdd: () => setAddOpen(true),
  };

  const restaurant = activeRestaurant
    ? window.FOW_DATA.restaurants.find(r => r.id === activeRestaurant)
    : null;

  const isOverlayScreen = screen === 'detail';

  return (
    <div className="fw-screen">
      <StatusBar light={isOverlayScreen} />

      {/* Main screens */}
      <div style={{ position: 'absolute', inset: 0 }}>
        {screen === 'home'     && <HomeFeed     state={state} actions={actions} hideCreators={hideCreators} />}
        {screen === 'map'      && <MapView      state={state} actions={actions} initialExpanded={mapExpanded} />}
        {screen === 'wishlist' && <WishlistScreen state={state} actions={actions} />}
        {screen === 'visited'  && <VisitedScreen state={state} actions={actions} />}
        {screen === 'profile'  && <ProfileScreen state={state} actions={actions} />}
        {screen === 'detail' && restaurant && (
          <RestaurantDetail restaurant={restaurant} state={state} actions={actions} />
        )}
      </div>

      {/* FAB — top-right on list screens; hidden on map (map has its own controls) and detail */}
      {(screen === 'home' || screen === 'wishlist' || screen === 'visited' || screen === 'profile') && (
        <FAB onClick={actions.openAdd} top={100} />
      )}

      {/* Snackbar */}
      <Snackbar message={snack} onDone={() => setSnack(null)} />

      {/* Bottom Nav — hide on detail */}
      {screen !== 'detail' && (
        <BottomNav
          active={screen}
          onChange={actions.go}
          badges={{ wishlist: wishlist.length }}
        />
      )}

      {/* Add a place sheet */}
      <AddSheet
        open={addOpen}
        onClose={() => setAddOpen(false)}
        state={state}
        actions={actions}
        onComplete={({ restaurant, mode }) => {
          setCelebration({ restaurant, mode });
        }}
      />

      {/* Pin drop celebration */}
      <PinDropCelebration
        active={!!celebration}
        mode={celebration?.mode}
        restaurant={celebration?.restaurant}
        onDone={() => setCelebration(null)}
      />
    </div>
  );
};

// Standalone stamp unlock artboard (no app shell)
const StampArtboard = () => {
  const c = window.FOW_DATA.cuisines.find(x => x.id === 'malabar');
  const [shown, setShown] = useState(true);
  return (
    <div className="fw-screen">
      {shown ? (
        <StampUnlock cuisine={c} onDone={() => setShown(false)} />
      ) : (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 14 }}>
          <div className="t-caps" style={{ color: 'var(--ink-3)' }}>Stamp dismissed</div>
          <button onClick={() => setShown(true)} className="btn btn-orange">Replay animation</button>
        </div>
      )}
    </div>
  );
};

Object.assign(window, { App, StampArtboard });
