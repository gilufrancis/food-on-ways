/**
 * Scroll container only — no padding.
 * Each page section controls its own horizontal padding and top spacing.
 * Bottom clearance accounts for the fixed bottom nav + iOS safe area.
 */
export default function PageWrapper({ children }) {
  return (
    <div
      className="w-full max-w-2xl"
      style={{ paddingBottom: 'calc(90px + env(safe-area-inset-bottom))' }}
    >
      {children}
    </div>
  );
}
