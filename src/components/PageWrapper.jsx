/**
 * Wraps scrollable page content. On mobile adds bottom padding to clear the
 * fixed bottom nav (56 px) + iOS home-bar safe area.
 */
export default function PageWrapper({ children, className = '' }) {
  return (
    <div
      className={`p-4 md:p-6 max-w-2xl w-full ${className}`}
      style={{ paddingBottom: 'calc(72px + env(safe-area-inset-bottom))' }}
    >
      {children}
    </div>
  );
}
