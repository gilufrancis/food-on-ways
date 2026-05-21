export default function SectionHead({ kicker, title, action, onAction }) {
  return (
    <div className="flex items-end justify-between">
      <div>
        {kicker && (
          <p className="t-caps mb-1" style={{ color: 'var(--ink-3)' }}>{kicker}</p>
        )}
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          {title}
        </h2>
      </div>
      {action && (
        <button
          onClick={onAction}
          className="t-caps shrink-0 ml-3"
          style={{ color: 'var(--orange)', border: 'none', background: 'none', paddingBottom: 2 }}
        >
          {action} →
        </button>
      )}
    </div>
  );
}
