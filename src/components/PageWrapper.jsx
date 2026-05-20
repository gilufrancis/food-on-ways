export default function PageWrapper({ children, className = '' }) {
  return (
    <div
      className={`p-4 md:p-6 max-w-2xl w-full ${className}`}
      style={{ paddingBottom: 'calc(80px + env(safe-area-inset-bottom))' }}
    >
      {children}
    </div>
  );
}
