export default function PageWrapper({ children }) {
  return (
    <div
      style={{
        paddingBottom: 'calc(72px + env(safe-area-inset-bottom))',
        backgroundColor: 'var(--surface)',
        minHeight: '100dvh',
      }}
    >
      {children}
    </div>
  );
}
