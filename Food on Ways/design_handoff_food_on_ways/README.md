# Handoff: Food on Ways — Hi-fi MVP

## Overview

**Food on Ways** is a food explorer's mobile companion that turns the joy of discovering, saving, and visiting great restaurants into a beautiful, social, map-first experience. This handoff covers the MVP — 11 mobile screens across discovery, retention, social proof, and the core "save / visit / stamp" loop.

The design is currently presented as a React-based HTML prototype running 11 fully-interactive mobile artboards on a single pan/zoom canvas. The artboards share state and components — bottom-nav tab switching, hearts, the Add-a-Place flow, and the cuisine-stamp animation are all wired end-to-end.

## About the Design Files

The files in `reference/` are **design references**, not production code to copy directly. They were built as a single-file React prototype (Babel-in-browser + inline JSX) so a non-developer can interact with the designs in a browser.

**Your task is to recreate these designs in your React codebase using your existing patterns and libraries** — your router, your state management (Redux/Zustand/Context), your form library, your styled-components / Tailwind / CSS modules, your icon system, your real map provider, etc. Treat the HTML as the visual + behavioral spec, not the implementation.

In particular **do not** copy across:
- The `<script type="text/babel">` Babel-in-browser setup — use proper JSX compilation
- The `design-canvas.jsx` and `tweaks-panel.jsx` files — these are presentation chrome, not part of the app
- The hand-drawn SVG map in `screens-map.jsx` — wire your real map SDK (Mapbox / MapLibre / Google Maps) with the custom tile styling described below
- The `<img-ph>` gradient-placeholder component — replace with your real `<Image>` component
- Tags like `data-screen-label` — these were for the design canvas only

## Fidelity

**High-fidelity (hifi).** The mocks are pixel-perfect. Exact colors, typography, spacing, radii, shadows, and animations are documented below and codified in `reference/styles.css`. Match them precisely.

## Tech notes for implementation

| Concern | Recommendation |
|---|---|
| Routing | React Router with nested routes — one per screen. The Restaurant Detail and Add-a-Place sheets are modal routes layered over the current screen. |
| State | A global store (Zustand recommended for size) holding `wishlist: string[]`, `visited: string[]`, `city: string`. Toggling propagates across feed, detail, map, and wishlist screens. |
| Map | Use [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/) or [MapLibre](https://maplibre.org/) with a warm custom style (see Map View section). Don't ship the SVG map. |
| Animations | [Framer Motion](https://www.framer.com/motion/) for screen transitions, heart-burst, pin-drop, stamp-drop. |
| Images | Use `next/image` (if Next.js) or a thin `<Image>` wrapper that supports `<source>` srcsets. All photography is placeholder — bring your own. |
| Icons | Bring your own icon set ([Lucide](https://lucide.dev/) maps 1:1 to the icons used here). Don't copy the inline SVG `<Icon>` from `components.jsx`. |
| Fonts | **Fraunces** (display, italic supported), **DM Sans** (UI), **JetBrains Mono** (technical/meta labels). All available on Google Fonts. |

---

## Design Tokens

Defined in `reference/styles.css` as CSS custom properties — port these to your token system (Tailwind config, theme object, CSS variables, etc.).

### Colors

| Token | Hex | Usage |
|---|---|---|
| `--orange` | `#F5622D` | Primary. Buttons, active states, the wordmark accent, wishlist pins, FAB. |
| `--orange-soft` | `#FBE2D6` | Tinted backgrounds for orange CTAs and wishlist nudges. |
| `--orange-deep` | `#C84313` | Hover/pressed state for primary buttons. |
| `--surface` | `#FDFAF6` | Warm off-white app background. Never pure white. |
| `--surface-2` | `#F6EFE5` | Card/chip background — sits on `--surface`. |
| `--surface-3` | `#EFE5D5` | Slightly deeper still — used inside image placeholder gradients. |
| `--ink` | `#1A1512` | Primary text. Warm charcoal — never pure black. |
| `--ink-2` | `#4A3F36` | Secondary text. |
| `--ink-3` | `#8B7B6E` | Tertiary text, captions, placeholder. |
| `--ink-4` | `#BCAE9F` | Quaternary — borders, disabled, dashed outlines. |
| `--line` | `#E9DECE` | Card borders, dividers. |
| `--coral` | `#E94B6A` | Wishlist hearts (filled). |
| `--coral-soft` | `#FDE0E6` | Coral-tinted background (e.g. "Saved" state). |
| `--green` | `#2D6A4F` | Visited state, success, "Stamp it" CTA. |
| `--green-soft` | `#D6E8DC` | Green-tinted background ("Visited" pills). |
| `--amber` | `#F2A93D` | Event pins, Tastemaker tier badge, editorial highlight border. |
| `--amber-soft` | `#FBE7BE` | Amber-tinted background — the "flavour note" editorial card. |

### Typography

```
Display:  "Fraunces", "Iowan Old Style", "Apple Garamond", Georgia, serif
UI:       "DM Sans", "Inter", system-ui, -apple-system, sans-serif
Mono:     "JetBrains Mono", "SF Mono", ui-monospace, Menlo, monospace
```

Letter-spacing for display headings: `-0.02em` to `-0.04em` depending on size. Italic Fraunces is used liberally for the second word of two-word headings (e.g. *Places I want* **to eat**).

Type scale (px):

| Use | Family | Size | Weight | Line-height | Letter-spacing |
|---|---|---|---|---|---|
| Display XL (Wishlist title, "Food *on* Ways") | Fraunces | 38 | 500 | 0.96 | -0.03em |
| Display L (Restaurant name) | Fraunces | 38 | 500 | 0.98 | -0.03em |
| Display M (section title, hero name) | Fraunces | 22–28 | 500–600 | 1.05 | -0.02em |
| Display S (card title) | Fraunces | 16–20 | 600 | 1.1 | — |
| Body | DM Sans | 14 | 400 | 1.45 | — |
| Caption | DM Sans | 11–12 | 500 | 1.3 | — |
| Caps kicker | DM Sans | 11 | 600 | 1 | 0.14em (uppercase) |
| Mono meta | JetBrains Mono | 9–11 | 400–500 | 1 | 0.06em |

### Spacing & Radii

| Token | Value | Used for |
|---|---|---|
| `--r-sm` | 10px | Chips |
| `--r-md` | 16px | Inputs, small cards |
| `--r-lg` | 22px | Standard cards, sheet handle area |
| `--r-xl` | 32px | Hero cards, bottom-sheet top |
| `--r-pill` | 999px | All buttons, pills, avatars |

Standard horizontal screen padding: **16–22px**. Card-internal padding: **14–18px**. Most cards are full-width minus 16px gutters. Mobile design width is **390px** (iPhone Pro target).

### Shadows

```
--shadow-sm:  0 2px 6px rgba(40, 20, 10, 0.06)    /* hairline cards */
--shadow-md:  0 8px 24px rgba(40, 20, 10, 0.10)   /* hero card, bottom sheet */
--shadow-lg:  0 22px 48px rgba(40, 20, 10, 0.16)  /* snackbar, celebration overlays */
```

Note shadows are warm-toned (`rgba(40,20,10,…)`), not gray. This matters.

### Animations

All easings: `cubic-bezier(0.2, 0.7, 0.3, 1)` unless noted. Durations:

- Card fade-up: 600ms (stagger by 60ms per index, mod 5)
- Screen enter: 320ms slide-up + fade
- Bottom sheet enter: 420ms slide-up from offscreen
- Heart burst: 700ms — 9 particles fan out 30–44px on randomized angles, rotate ±30°
- Heart pulse: 600ms — scale 1 → 1.45 → 0.95 → 1
- Pin drop: 700ms with one bounce (cubic-bezier(.2,.7,.3,1))
- Cuisine stamp drop: 900ms — scale 2.4→0.95→1.05→1, rotate -12°→-6°, blur 4px→0
- Sheet expand/collapse (Map): 380ms `top` transition

Reference all keyframes in `reference/styles.css`.

---

## Screens

Each screen is one artboard in `reference/Food on Ways.html`. The numbers below match the artboard labels.

### 01 · Home Feed
**Source:** `reference/screens-home.jsx` (`HomeFeed`)
**Route suggestion:** `/`

**Layout (top→bottom):**
1. **iOS status bar passthrough** (44px) — render only if you're not in a PWA / native shell.
2. **Sticky header** — split 3-up: kicker text ("Good taste, / great places.") in mono-caps left, the wordmark center ("Food *on* Ways" with italic orange "on"), notification bell with unread dot top-right.
3. **Location bar** (scrolls away) — pin pill on left (`📍 Kozhikode`), "X wishlisted here" stat on right.
4. **Section heading** — caps kicker "Your next great meal" over display title "Crab, biryani, sunset."
5. **Hero card** (~440px tall total). Full-bleed image with:
   - Pinned "Picked for you" sparkle pill (top-left)
   - Heart button (top-right) — opens to filled coral on tap with burst
   - Bottom dark gradient overlay (40% from bottom)
   - Cuisine + distance pills, then the restaurant name in 38px Fraunces, then area · city in 13px
   - Below the image: italic quote line, creator avatar stack (3 overlapping at -10px), "View details →" filled dark button
6. **"Trending near you 🔥"** section — horizontal scroll of 168×~230 cards. Last card is a dark "See all on map →" with a radial orange glow and large map icon.
7. **"Fresh from creators"** — vertical feed of post cards:
   - Creator header row (avatar, name + Tastemaker chip, handle · timeAgo, chevron)
   - 4:5 aspect-ratio media with play indicator + a floating pill at bottom-left containing a circular orange pin badge + restaurant name + area
   - Caption, then action row: HeartButton + save count + map button + share button. "Already saved ✓" appears right-aligned when wishlisted.
8. **"Happening soon"** events strip — horizontal scroll of 260×~250 cards.
9. **Wishlist nudge** — coral/orange-tinted card with "Planning a Kozhikode crawl?" CTA. Only renders if `wishlist.length >= 1`.

**Cards stagger in** with `fade-up` animation, 60ms delay per index (mod 5).

### 02 · Restaurant Detail
**Source:** `reference/screens-detail.jsx`
**Route suggestion:** `/r/:id`

Modal-style page over the feed. Light status bar over the photo carousel.

**Layout:**
1. **Hero carousel** (440px) — horizontally swipeable, scroll-snap. Top-bottom gradient overlays. Top-left back button (white blur-glass), top-right "1/5" pill + share button. Floating wishlist heart bottom-right, overlapping the next section by 22px.
2. **Identity block** — "EST. 1939" mono kicker, 38px restaurant name, cuisine pills, location row with inline "See on map" link, hours row with green/red dot + distance.
3. **Social proof** — "Visited by 4 creators you follow" caps kicker, avatar row, Tastemaker badge (small "T" chip on first avatar), "+8" overflow chip.
4. **Flavour note** — amber-tinted card with massive `"` decorative quote (rgba 18% opacity), "THE FLAVOUR NOTE" caps, italic Fraunces description, "— Editorial team" sign-off.
5. **What to order** — horizontal strip of 180-wide dish cards.
6. **Creator posts mini-list** — vertical, with `<hr>` separators per post.
7. **How to get there** — tinted card with a mini-map preview and Call/Directions buttons.
8. **Bottom CTA bar** (sticky inside the frame) — two buttons: "Save to Wishlist" (outline → green-tinted when active) and "Mark as Visited" (orange → green-filled when active).

### 03 · Map View
**Source:** `reference/screens-map.jsx`
**Route suggestion:** `/map`

⚠️ The reference uses a hand-drawn warm-tone SVG as a stand-in for a real map. **Wire your real map SDK** (Mapbox/MapLibre/Google) with the custom style described:
- Land: warm sand `#EADAB9`
- Water: muted jade `#BBC9C0`
- Parks: dusty olive `#C8D2A4`
- Roads (cased): outer `#D9C39A`, inner `#F4E7CA`
- Buildings: `#D8C7A6` at 55% opacity

**Pin design** — see SVG in `screens-map.jsx`. 34×44px pin shape with circle marker. Color matrix:

| Pin kind | Fill | Stroke |
|---|---|---|
| Wishlist | `--orange` | white 2px |
| Visited | `--green` | white 2px |
| Creator pick | white | `--orange` 3px |
| Event | `--amber` | white 2px |

Drop shadow: `drop-shadow(0 6px 8px rgba(60,30,10,0.32))`.

**UI overlay:**
- Floating search pill (blur-glass) with filter row beneath ("All / Wishlist / Visited / Events / Near me / [cuisine]…")
- Right-side stack: locate button (44px), zoom +/- card
- "You're in {city}" banner (ink-dark) on initial load
- Bottom sheet — 3 states:
  - **Default:** handle + "N spots on map" + horizontal restaurant strip + legend
  - **Pin selected:** handle + compact restaurant card with Save/Open buttons. Map stays visible behind.
  - **Expanded:** sheet snaps to `top: 44px`. Editorial header, sort toggle, full vertical list with numbered pin-color markers. Tapping the grab handle toggles expanded ↔ default.

### 04 · Wishlist
**Source:** `reference/screens-lists.jsx` (`WishlistScreen`)
**Route suggestion:** `/wishlist`

- Display title "Places I want *to eat*" + count subtitle
- Trip-plan banner (only if any city has ≥ 2 saved spots) — ink-dark card with a large faded map icon at the corner
- **City groupings** — for each city: a header row with a 3-up tilted collage of restaurant thumbnails (rotated -4°/0°/4°, slightly overlapping at -10px, each in a 12px-rounded white-bordered box), city name in 22px Fraunces, count, expand chevron. Below: vertical list of restaurant rows (76px thumb + name + cuisine·area + "Saved from @creator" attribution).
- **Empty state** — a quiet illustration (just dotted trail + fork SVG over surface-2 rounded square), display headline, "Explore the feed →" CTA.

### 05 · Visited + Cuisine Passport
**Source:** `reference/screens-lists.jsx` (`VisitedScreen`)
**Route suggestion:** `/visited`

- "Where I've *eaten*" display title
- **Stats trio** — 3 equal cards in a row. Each has a 32px number in Fraunces in a thematic color (orange / green / amber).
- **Cuisine passport** — horizontal scroll of 108×~140 stamp cards. Unlocked stamps: solid card with 2px black border, gradient roundel showing cuisine initial in Fraunces. Locked: dashed border, no fill, "?" mark, opacity 55%.
- **Diary list** — full-bleed photo cards with a **rotated VISITED stamp** overlay (64px circle, 2px green border, -8° rotation, contains a green check + "VISITED" letterspaced caps). Below the photo: name, "Visited last week" or relative date, optional user micro-review in an orange-left-border italic quote block, "Discovered via @creator" attribution. Cards with no review show an "Add a memory →" prompt.

### 06 · Profile
**Source:** `reference/screens-stamp.jsx` (`ProfileScreen`)
**Route suggestion:** `/profile`

- Cover photo (200px), avatar overlapping with -50px margin, name + city + member-since
- Italic Fraunces bio line
- 4-up stat cards (Saved / Visited / Cities / Cuisines)
- Compact cuisine passport (8 stamps shown)
- "Become a creator" amber CTA card
- Settings list — each row is a tinted button with chevron-right

### 07–08 · Add a Place Flow
**Source:** `reference/screens-add.jsx` (`AddSheet`)
**Route suggestion:** Modal sheet — not a route. Triggered by the FAB.

3-step bottom sheet. Title pattern: "Plant a flag · Step N/3" (orange caps kicker).

- **Step 1:** "Which restaurant?" — large display title, search input in surface-2 pill, two side-by-side buttons ("Use my location" / "Drop a pin"), then "Suggested" list of restaurant rows.
- **Step 2 (wishlist path):** large radio-style choice cards: "Add to Wishlist" (coral roundel) and "Mark as Visited" (green roundel). Selected gets a 2px border. Wishlist completes here.
- **Step 3 (visited path):** dish chip selector, emoji sentiment row (😍 🙂 😐 😕 — 58px buttons that highlight orange when selected), dashed photo-upload slot, green "Stamp it · Save to Visited" CTA.

On completion → **Pin Drop Celebration** (screen 09) plays full-screen.

### 09 · Pin Drop Celebration
**Source:** `reference/screens-add.jsx` (`PinDropCelebration`)

Full-screen overlay, ~1.8s self-dismissing:
- Backdrop: ink-dark at 62% with 8px blur
- Center: 230px circular mini-map (warm sand gradient) with 3 concentric color-themed rings scaling in at staggered delays
- A pin drops from above using the `pinDrop` keyframe (700ms, one bounce)
- 8 sparkle particles burst out at 500ms
- Label "Saved!" or "Stamped!" + sub-line fades up at 800ms

Color theme: orange + wishlist heart inside the pin, green + check inside for visited.

### 10 · Cuisine Stamp Unlock
**Source:** `reference/screens-stamp.jsx` (`StampUnlock`)

Full-screen "achievement" moment when the user visits the first restaurant in a new cuisine.

- Background: a 3-stop radial-gradient washed in the cuisine's palette
- Top label: "NEW STAMP UNLOCKED" caps + "You're now a *{cuisine}* explorer." display headline
- Center: a 240px circular stamp with:
  - 6px white border + inset rim
  - Rotating SVG `<textPath>` ring with cuisine name + "FOOD ON WAYS · EXPLORER"
  - Center: large Fraunces cuisine initial + caps subtitle + "May · 2026" date
- 24 radiating sunburst lines behind the stamp, animated in at 500ms
- 12 sparkle particles
- Bottom CTA "Keep exploring →" — white button with cuisine-themed text color

### 11 · Map Expanded List
**Source:** `reference/screens-map.jsx` (`ExpandedSheet`)

Variant of the map screen — the bottom sheet is snapped to its expanded state. Shows:
- Editorial header "N spots *on this map*" + collapse-to-map button
- Sort toggle (Closest / Most saved)
- Vertical list. Each row: numbered marker (color matches pin type), 66px thumb, name + distance, cuisine · area, pin-type label with colored dot, save count + quick-heart action

---

## Components

Build these as reusable components in your codebase. Source for each is in `reference/components.jsx`.

| Component | Description |
|---|---|
| `<Pill>` | Inline-flex chip with variants `dark` (translucent ink), `orange`, `amber`, `green`, `coral`, `outline`. Backdrop-blurred when over imagery. |
| `<Icon>` | 24px-grid SVG icons. Maps 1:1 to Lucide icons — use Lucide instead. Reference for naming. |
| `<Avatar>` | Circular gradient with the creator's initial in Fraunces. Optional `ring` prop. Sizes 16–92px. |
| `<HeartButton>` | Circular blur-glass button. Filled = coral with surface bg, unfilled = ink at 42% over imagery. On activate: 9 particles fan out + scale pulse. |
| `<ImgPh>` | Warm 3-stop gradient + 45° weave + optional caption tag + optional real `src`. Replace with your `<Image>`. |
| `<BottomNav>` | 5-tab fixed bottom bar with active orange. Supports per-tab badge count. |
| `<FAB>` | 48px orange "+" button, fixed top-right. |
| `<StatusBar>` | iOS status bar mock — remove if you're in a native shell. |
| `<SectionHead>` | Caps kicker + display title row, with optional right-aligned "See all →" link. |
| `<Snackbar>` | Floating ink-dark toast with optional Undo. Auto-dismisses after 3.5s. |

---

## State Management

Recommend a single store with this shape:

```ts
interface AppState {
  city: string;
  wishlist: string[];        // restaurant ids
  visited: string[];         // restaurant ids
  recentlyAdded: string[];   // for "Recently added" suggestion in Add flow

  // actions
  toggleWishlist(id: string): void;
  toggleVisited(id: string): void;
  addWishlist(id: string): void;
  addVisited(id: string): void;
  setCity(city: string): void;
}
```

**Snackbars + celebration overlays** are driven by side effects in `toggleWishlist` / `toggleVisited`. When a new item lands in `visited`, also check if its cuisines unlock a new passport stamp — if so, trigger the `<StampUnlock>` overlay. The reference doesn't wire this automatically; it's worth doing in your real implementation.

---

## Assets

- **Fonts:** Fraunces, DM Sans, JetBrains Mono — all on Google Fonts. CDN line in `reference/Food on Ways.html` head.
- **Icons:** Lucide (drop-in replacement for the inline SVG `<Icon>` map). Names used in the reference: home, map, heart, heart-fill, check, user, bell, plus, share, arrow-left/right, search, map-pin, calendar, flame, sparkles, chevron-right/down, x (close), phone, clock, image, camera, layers, locate, refresh.
- **Photography:** All food photography in the reference is Unsplash placeholder via `images.unsplash.com/photo-XXX`. **Replace with licensed/owned food photography.** Each restaurant in `data.js` has a primary `img` plus a `photos[]` array; each dish and event also has an `img`. The data shape is reusable — just swap the URLs.

---

## Files

All in `reference/`:

| File | What it is |
|---|---|
| `Food on Ways.html` | Entry point — composes the canvas of 11 artboards. The single `<script type="text/babel">` block at the bottom is the canvas wiring; everything above the `Root` component is just sample data + composition glue, not part of the app. |
| `styles.css` | Design tokens (CSS custom properties), utility classes (`.t-display`, `.t-caps`, `.t-mono`, `.pill`, `.btn-*`), keyframes (`fadeUp`, `slideInUp`, `sheetIn`, `pinDrop`, `stampDrop`, `drawCheck`, `burst`, `heart-pulse`). |
| `data.js` | Sample data: 8 restaurants, 5 creators, 12 cuisines, 3 events, 4 posts. Image URLs included. Use as the shape spec for your real data model. |
| `components.jsx` | Shared components — Pill, Icon, Avatar, HeartButton, ImgPh, BottomNav, FAB, StatusBar, SectionHead, TrendingCard, Snackbar. |
| `app.jsx` | The `<App>` shell — wires shared state, renders the active screen, owns the FAB, snackbar, bottom nav, and AddSheet. Use as the spec for your top-level state + layout. |
| `screens-home.jsx` | Home feed — HeroCard, PostCard, EventCard, HomeFeed. |
| `screens-detail.jsx` | RestaurantDetail. |
| `screens-map.jsx` | MapView + ExpandedSheet. |
| `screens-lists.jsx` | WishlistScreen + VisitedScreen. |
| `screens-add.jsx` | AddSheet + PinDropCelebration. |
| `screens-stamp.jsx` | StampUnlock full-screen moment + ProfileScreen. |

---

## Suggested Implementation Order

Mirror the original priority list:

1. Layout shell + bottom nav + theme tokens (the design language)
2. Home Feed — the daily experience, must be exceptional
3. Restaurant Detail — the conversion screen
4. Map View — the spatial differentiator (real map SDK)
5. Wishlist — retention
6. Add-a-Place flow — the core action
7. Visited + Cuisine Passport — the reward layer
8. Polish pass: heart-burst, pin-drop celebration, stamp unlock, card stagger fade-up

---

## Open Questions for Build

- **Map SDK choice** — Mapbox style URL or self-host? The custom warm palette will need a real tile style; recommend a Mapbox Studio fork of "Outdoors" with the color overrides above.
- **Real photography pipeline** — who's sourcing dish photography? The reference uses Unsplash hot-links which won't ship.
- **Auth** — out of scope for this design pass. The spec defers email/password and uses Google/Apple SSO only.
- **Push notifications** — bell icon shows an unread dot but there's no notifications screen designed yet.
