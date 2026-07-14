export default function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 14,
        padding: '20px 24px',
        boxShadow: '0 1px 3px rgba(0,0,0,.04), 0 8px 24px rgba(0,0,0,.04)',
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: 'var(--color-text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.6px',
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 30,
          fontWeight: 800,
          color: accent ?? 'var(--color-text)',
          fontFamily: 'var(--font-mono)',
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>
    </div>
  );
}
