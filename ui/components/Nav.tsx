'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Run', href: '/run' },
  { label: 'Logs', href: '/logs' },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="navbar">
      <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="nav-brand">
          <div className="brand-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <div>
            <div className="brand-name">Pharos</div>
            <div className="brand-sub">Automation</div>
          </div>
        </div>
      </Link>

      <div className="nav-links">
        {NAV_ITEMS.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className={`nav-link${pathname === href ? ' active' : ''}`}
          >
            {label}
          </Link>
        ))}
      </div>

      <div className="nav-right">
        <div className="status-pill">
          <span className="status-dot" />
          Online
        </div>
        <div className="user-avatar">NB</div>
      </div>
    </nav>
  );
}
