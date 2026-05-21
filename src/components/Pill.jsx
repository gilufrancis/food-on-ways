/**
 * Reusable chip/pill with design-token variants.
 * variant: 'default' | 'dark' | 'orange' | 'amber' | 'green' | 'coral' | 'outline'
 */
export default function Pill({ children, variant = 'default', style, ...props }) {
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    padding: '4px 10px',
    borderRadius: 'var(--r-pill)',
    fontSize: 12,
    fontWeight: 500,
    whiteSpace: 'nowrap',
    lineHeight: 1,
    fontFamily: 'var(--font-ui)',
  };

  const variants = {
    default: {
      background: 'rgba(253,250,246,0.88)',
      color: 'var(--ink)',
      backdropFilter: 'blur(8px)',
      border: '1px solid rgba(255,255,255,0.6)',
    },
    dark: {
      background: 'rgba(26,21,18,0.58)',
      color: '#fff',
      backdropFilter: 'blur(8px)',
      border: '1px solid rgba(255,255,255,0.18)',
    },
    orange: {
      background: 'var(--orange)',
      color: '#fff',
      border: 'none',
    },
    amber: {
      background: 'var(--amber-soft)',
      color: '#6E4A0F',
      border: 'none',
    },
    green: {
      background: 'var(--green-soft)',
      color: 'var(--green)',
      border: 'none',
    },
    coral: {
      background: 'var(--coral-soft)',
      color: 'var(--coral)',
      border: 'none',
    },
    outline: {
      background: 'transparent',
      color: 'var(--ink-2)',
      border: '1px solid var(--line)',
    },
  };

  return (
    <span style={{ ...base, ...(variants[variant] || variants.default), ...style }} {...props}>
      {children}
    </span>
  );
}
