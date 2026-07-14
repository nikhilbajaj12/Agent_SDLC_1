export type StepState = 'pending' | 'in-progress' | 'success' | 'failed' | 'error' | 'human';

export type Step = {
  key: string;
  label: string;
};

const DEFAULT_STEPS: Step[] = [
  { key: 'fetch', label: 'Fetch Ticket' },
  { key: 'gate', label: 'Clarity Gate' },
  { key: 'agent', label: 'Agent Run' },
  { key: 'verify', label: 'Verify' },
  { key: 'pr', label: 'Create PR' },
  { key: 'report', label: 'Report' },
];

// props for use in Run / Logs pages (data-driven)
type ListProps = {
  steps: Step[];
  states: StepState[];
  logs?: Record<string, string[]>;
};

// props for use in sidebar / mini tracker (index-based)
type IndexProps = {
  current: number;
};

export default function StepTracker(props: ListProps | IndexProps) {
  if ('current' in props) {
    return <IndexTracker current={props.current} />;
  }
  return <ListTracker steps={props.steps} states={props.states} logs={props.logs} />;
}

function IndexTracker({ current }: { current: number }) {
  return (
    <div className="steps">
      {DEFAULT_STEPS.map(({ label }, i) => {
        const state = i < current ? 'done' : i === current ? 'active' : '';
        return (
          <div key={label}>
            <div className={`step-item-dash ${state}`}>
              <div className="step-dot">
                {i < current ? (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : null}
              </div>
              <div className="step-label">
                {label}
              </div>
            </div>
            {i < DEFAULT_STEPS.length - 1 && <div className="step-line" />}
          </div>
        );
      })}
    </div>
  );
}

function LogLine({ text, type }: { text: string; type?: string }) {
  const cls = type === 'success' ? 'success' : type === 'error' ? 'error' : type === 'info' ? 'info' : '';
  return <div className={`log-line-dash ${cls}`}>{text}</div>;
}

function ListTracker({ steps, states, logs }: ListProps) {
  return (
    <div className="steps">
      {steps.map(({ key, label }, i) => {
        const s = states[i] || 'pending';
        const state = s === 'success' ? 'done' : s === 'failed' || s === 'error' ? 'done' : s === 'in-progress' ? 'active' : '';
        const isActive = s === 'in-progress';
        const dotBg = state === 'done'
          ? { background: s === 'failed' || s === 'error' ? 'var(--color-red)' : 'var(--color-accent-purple)', borderColor: s === 'failed' || s === 'error' ? 'var(--color-red)' : 'var(--color-accent-purple)' }
          : isActive ? { borderColor: 'var(--color-accent-purple)' } : {};

        return (
          <div key={key}>
            <div className={`step-item-dash ${state} ${isActive ? 'active' : ''}`} style={{ opacity: s === 'pending' ? 0.45 : 1 }}>
              <div className="step-dot" style={dotBg}>
                {state === 'done' ? (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : null}
              </div>
              <div style={{ flex: 1 }}>
                <div className="step-label" style={isActive ? { color: 'var(--color-accent-purple)' } : state === 'done' ? { opacity: 0.7 } : {}}>
                  {label}
                </div>
                {logs?.[key] && (
                  <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {logs[key].map((t, j) => (
                      <LogLine key={j} text={t} />
                    ))}
                  </div>
                )}
              </div>
            </div>
            {i < steps.length - 1 && <div className="step-line" />}
          </div>
        );
      })}
    </div>
  );
}
