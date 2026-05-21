/**
 * Circular avatar — gradient background with Fraunces initial.
 * size: number (px). ring: bool. color: hex for the gradient.
 */
export default function Avatar({ name, color = '#F5622D', size = 36, ring = false, style }) {
  const initial = name ? name[0].toUpperCase() : '?';
  return (
    <div
      style={{
        width: size, height: size,
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${color}cc, ${color})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
        outline: ring ? '2px solid var(--surface)' : 'none',
        outlineOffset: 1,
        fontFamily: 'var(--font-display)',
        fontSize: size * 0.42,
        fontWeight: 600,
        color: '#fff',
        letterSpacing: '-0.02em',
        userSelect: 'none',
        ...style,
      }}
    >
      {initial}
    </div>
  );
}
