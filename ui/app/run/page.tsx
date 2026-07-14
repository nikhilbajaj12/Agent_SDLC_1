'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Nav from '@/components/Nav';
import StepTracker from '@/components/StepTracker';
import StatusBadge from '@/components/StatusBadge';
import { runTicket, getRunStatus, formatDuration, type RunRecord, type StepInfo } from '@/lib/api';

const STEPS: StepInfo[] = [
  { key: 'fetch', label: 'Fetching ticket', state: 'pending' },
  { key: 'gate', label: 'Clarity gate', state: 'pending' },
  { key: 'agent', label: 'Agent coding & testing', state: 'pending' },
  { key: 'pr', label: 'Opening PR', state: 'pending' },
  { key: 'jira', label: 'Updating Jira', state: 'pending' },
];

export default function RunPage() {
  const [ticketKey, setTicketKey] = useState('');
  const [runId, setRunId] = useState<string | null>(null);
  const [status, setStatus] = useState<RunRecord['status'] | null>(null);
  const [stepStates, setStepStates] = useState<Array<'pending' | 'in-progress' | 'success' | 'failed' | 'error' | 'human'>>(
    ['pending', 'pending', 'pending', 'pending', 'pending']
  );
  const [logs, setLogs] = useState<Record<string, string[]>>({});
  const [prUrl, setPrUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startPolling = useCallback((id: string) => {
    intervalRef.current = setInterval(async () => {
      try {
        const r = await getRunStatus(id);
        setStatus(r.status);
        setStepStates(r.steps.map((s) => s.state as any));
        setLogs(r.logs);
        setPrUrl(r.pr_url);
        setDuration(r.duration_sec);

        if (['success', 'failed', 'human'].includes(r.status)) {
          if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
          setRunning(false);
        }
      } catch { /* keep polling */ }
    }, 2000);
  }, []);

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const handleRun = async () => {
    if (!ticketKey.trim()) return;
    setError(null); setRunId(null); setStatus(null);
    setStepStates(['pending', 'pending', 'pending', 'pending', 'pending']);
    setLogs({}); setPrUrl(null); setDuration(null);
    setRunning(true);

    try {
      const { run_id } = await runTicket(ticketKey.trim());
      setRunId(run_id);
      startPolling(run_id);
    } catch (e: any) {
      setError(e.message);
      setRunning(false);
    }
  };

  const isTerminal = status && ['success', 'failed', 'human'].includes(status);

  return (
    <div className="bg-bg min-h-screen">
      <div className="bg-animation">
        <div className="bg-grid" />
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div className="bg-orb bg-orb-3" />
      </div>

      <Nav />

      <div className="content" style={{ maxWidth: 900, margin: '0 auto', padding: '84px 32px 48px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 32, letterSpacing: '-0.01em' }}>
          Run Pipeline
        </h1>

        {/* Input */}
        <div className="card-main" style={{ padding: 28, marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <label className="label-main">Jira Ticket Key</label>
              <input
                className="input-main"
                placeholder="e.g. KAN-1"
                value={ticketKey}
                onChange={(e) => setTicketKey(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleRun(); }}
                disabled={running}
              />
            </div>
            <button
              className="btn-primary"
              onClick={handleRun}
              disabled={running || !ticketKey.trim()}
              style={running ? { opacity: 0.5, pointerEvents: 'none', cursor: 'not-allowed' } : {}}
            >
              {running ? 'Running...' : 'Run Pipeline'}
            </button>
          </div>
          {error && <p style={{ marginTop: 12, color: 'var(--color-red)', fontSize: 13 }}>{error}</p>}
        </div>

        {/* Status */}
        {runId && (
          <div className="card-main" style={{ padding: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>{ticketKey}</h2>
              {status && <StatusBadge status={status} />}
            </div>

            <StepTracker
              steps={STEPS.map(({ state, ...rest }) => rest)}
              states={stepStates}
              logs={logs}
            />

            {isTerminal && (
              <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid var(--color-border)' }}>
                {status === 'success' && prUrl && (
                  <div style={{ fontSize: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <p>
                      PR:{' '}
                      <a href={prUrl} target="_blank" rel="noopener noreferrer"
                        style={{ color: 'var(--color-accent-purple)', textDecoration: 'underline' }}>
                        {prUrl}
                      </a>
                    </p>
                    <p style={{ color: 'var(--color-text-secondary)' }}>
                      Duration: {formatDuration(duration)}
                    </p>
                  </div>
                )}
                {status === 'failed' && (
                  <p style={{ color: 'var(--color-red)', fontSize: 14 }}>
                    Pipeline failed. Check logs for details.
                  </p>
                )}
                {status === 'human' && (
                  <p style={{ color: '#d97706', fontSize: 14 }}>
                    Ticket needs human review.
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {!runId && !running && (
          <div style={{ textAlign: 'center', paddingTop: 72 }}>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>
              Enter a Jira ticket key and click Run Pipeline to start.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
