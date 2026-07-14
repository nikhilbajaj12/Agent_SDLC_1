'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Nav from '@/components/Nav';
import StatCard from '@/components/StatCard';
import StatusBadge from '@/components/StatusBadge';
import { getStats, getRuns, formatDuration, formatTime, type RunStats, type RunRecord } from '@/lib/api';

export default function DashboardPage() {
  const [stats, setStats] = useState<RunStats | null>(null);
  const [runs, setRuns] = useState<RunRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getStats(), getRuns()])
      .then(([s, r]) => { setStats(s); setRuns(r); })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-bg min-h-screen">
      <div className="bg-animation">
        <div className="bg-grid" />
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div className="bg-orb bg-orb-3" />
      </div>

      <Nav />

      <div className="content" style={{ maxWidth: 1200, margin: '0 auto', padding: '84px 32px 48px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 32, letterSpacing: '-0.01em' }}>
          Dashboard
        </h1>

        {loading ? (
          <div style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>Loading...</div>
        ) : error ? (
          <div style={{ color: 'var(--color-red)', fontSize: 14 }}>Error: {error}</div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 48 }}>
              <StatCard label="Total Runs" value={String(stats?.total ?? 0)} />
              <StatCard label="Success" value={String(stats?.success ?? 0)} accent="var(--color-green)" />
              <StatCard label="Failed" value={String(stats?.failed ?? 0)} accent="var(--color-red)" />
              <StatCard label="Needs Human" value={String(stats?.human ?? 0)} accent="#d97706" />
            </div>

            <div className="card-main" style={{ overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px 12px' }}>
                <h2 style={{ fontSize: 18, fontWeight: 700 }}>Recent Runs</h2>
              </div>

              {runs.length === 0 ? (
                <div style={{ padding: '0 24px 24px', color: 'var(--color-text-muted)', fontSize: 14 }}>
                  No runs yet.{' '}
                  <Link href="/run" style={{ color: 'var(--color-accent-purple)', textDecoration: 'underline' }}>
                    Launch your first pipeline
                  </Link>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table className="table-main">
                    <thead>
                      <tr>
                        <th>Ticket</th>
                        <th>Status</th>
                        <th>PR</th>
                        <th>Started</th>
                        <th>Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {runs.map((run) => (
                        <tr key={run.id}>
                          <td style={{ fontWeight: 600 }}>
                            <Link href={`/logs?run=${run.id}`} className="nav-link" style={{ padding: 0 }}>
                              {run.ticket_key}
                            </Link>
                          </td>
                          <td><StatusBadge status={run.status} /></td>
                          <td>
                            {run.pr_url ? (
                              <a href={run.pr_url} target="_blank" rel="noopener noreferrer"
                                style={{ color: 'var(--color-accent-purple)', fontSize: 13, textDecoration: 'none' }}>
                                PR #{run.pr_url.split('/').pop()}
                              </a>
                            ) : <span style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>—</span>}
                          </td>
                          <td style={{ color: 'var(--color-text-secondary)', fontSize: 13 }}>{formatTime(run.started_at)}</td>
                          <td style={{ color: 'var(--color-text-secondary)', fontSize: 13 }}>{formatDuration(run.duration_sec)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
