/**
 * Mobile-first page container.
 * Horizontal padding: 16px. Bottom clearance: 80px (bottom nav) + safe area.
 */
export default function PageWrapper({ children }) {
  return (
    <div
      className="w-full max-w-2xl px-4 pt-5"
      style={{ paddingBottom: 'calc(88px + env(safe-area-inset-bottom))' }}
    >
      {children}
    </div>
  );
}
