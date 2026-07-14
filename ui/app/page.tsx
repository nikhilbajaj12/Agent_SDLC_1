'use client';

import { useState, useEffect, useRef, useCallback, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [isOn, setIsOn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [shake, setShake] = useState(false);
  const [authError, setAuthError] = useState('');
  const dustInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const sceneRef = useRef<HTMLDivElement>(null);

  const toggleLamp = useCallback(() => {
    setIsOn((p) => !p);
  }, []);

  const pull = useCallback(() => {
    const chain = document.getElementById('lamp-chain');
    if (!chain) return;
    chain.classList.add('pulled');
    setTimeout(() => chain.classList.remove('pulled'), 700);
    toggleLamp();
  }, [toggleLamp]);

  // Dust particles
  useEffect(() => {
    if (!isOn) {
      if (dustInterval.current) { clearInterval(dustInterval.current); dustInterval.current = null; }
      return;
    }
    const spawn = () => {
      const dust = document.createElement('div');
      dust.className = 'dust';
      const startX = 22 + Math.random() * 12;
      const startY = 38 + Math.random() * 8;
      const driftX = (Math.random() - 0.3) * 6;
      const driftY = 25 + Math.random() * 20;
      const duration = 6 + Math.random() * 6;
      const size = 1.5 + Math.random() * 2;
      dust.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: #fff5e0;
        border-radius: 50%;
        pointer-events: none;
        box-shadow: 0 0 4px rgba(255, 210, 130, 0.8);
        left: ${startX}%;
        top: ${startY}%;
      `;
      sceneRef.current?.appendChild(dust);
      const anim = dust.animate(
        [
          { transform: 'translate(0, 0)', opacity: 0 },
          { opacity: 0.9, offset: 0.15 },
          { opacity: 0.9, offset: 0.7 },
          { transform: `translate(${driftX}vw, ${driftY}vh)`, opacity: 0 },
        ],
        { duration: duration * 1000, easing: 'ease-in-out' }
      );
      anim.onfinish = () => dust.remove();
    };
    for (let i = 0; i < 25; i++) setTimeout(() => spawn(), i * 80);
    dustInterval.current = setInterval(spawn, 220);
    return () => { if (dustInterval.current) { clearInterval(dustInterval.current); dustInterval.current = null; } };
  }, [isOn]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!email || !password) {
      setShake(true);
      setTimeout(() => setShake(false), 350);
      return;
    }
    if (email !== 'admin' || password !== 'admin') {
      setAuthError('Invalid credentials. Use admin / admin.');
      setShake(true);
      setTimeout(() => setShake(false), 350);
      return;
    }
    setSubmitted(true);
    setTimeout(() => {
      router.push('/dashboard');
    }, 1200);
  };

  return (
    <div
      ref={sceneRef}
      className={`scene ${isOn ? 'on' : ''}`}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: '#000',
      }}
    >
      {/* Wall */}
      <div
        className="wall"
        style={{
          position: 'absolute',
          inset: 0,
          background: '#000',
          transition: 'background 1.8s ease',
        }}
      />
      {isOn && (
        <style>{`
          .wall {
            background:
              radial-gradient(ellipse 50% 80% at 28% 45%, #1a0f06 0%, #0a0604 30%, #000 70%) !important;
          }
        `}</style>
      )}
      <div
        className="wall-grain"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'repeating-linear-gradient(90deg, rgba(255,180,80,0.015) 0 1px, transparent 1px 3px), repeating-linear-gradient(0deg, rgba(0,0,0,0.2) 0 1px, transparent 1px 4px)',
          opacity: 0.5,
          pointerEvents: 'none',
        }}
      />

      {/* Glow */}
      <div
        className="glow"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 28% 42%, rgba(255, 200, 100, 0.32) 0%, rgba(255, 160, 60, 0.16) 18%, rgba(255, 110, 40, 0.05) 40%, transparent 60%)',
          opacity: isOn ? 1 : 0,
          transition: 'opacity 1.4s ease 0.1s',
          pointerEvents: 'none',
        }}
      />

      {/* Light cone */}
      <div
        style={{
          position: 'absolute',
          top: '38%',
          left: '28%',
          transform: 'translateX(-50%)',
          width: 600,
          height: '70vh',
          background:
            'linear-gradient(to bottom, rgba(255, 210, 130, 0.28) 0%, rgba(255, 180, 80, 0.14) 35%, rgba(255, 150, 60, 0.04) 70%, transparent 100%)',
          clipPath: 'polygon(43% 0%, 57% 0%, 100% 100%, 0% 100%)',
          opacity: isOn ? 1 : 0,
          transition: 'opacity 1.4s ease 0.3s',
          pointerEvents: 'none',
          filter: 'blur(1px)',
          mixBlendMode: 'screen',
        }}
      />

      {/* Bulb core */}
      <div
        style={{
          position: 'absolute',
          top: '37%',
          left: '28%',
          transform: 'translateX(-50%)',
          width: 140,
          height: 140,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(255, 248, 220, 0.95) 0%, rgba(255, 210, 120, 0.7) 25%, rgba(255, 160, 60, 0.3) 50%, transparent 75%)',
          opacity: isOn ? 1 : 0,
          transition: 'opacity 0.5s ease 0.2s',
          filter: 'blur(3px)',
          pointerEvents: 'none',
        }}
        className={isOn ? 'animate-flicker' : ''}
      />

      {/* Brand */}
      <div
        className="brand"
        style={{
          position: 'absolute',
          top: 30,
          left: 40,
          zIndex: 15,
          transition: 'color 1s',
        }}
      >
        Zensar
      </div>

      {/* Divider */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          bottom: '20%',
          left: '56%',
          width: 1,
          background:
            'linear-gradient(to bottom, transparent 0%, rgba(200, 151, 96, 0.15) 30%, rgba(200, 151, 96, 0.15) 70%, transparent 100%)',
          opacity: isOn ? 1 : 0,
          transition: 'opacity 1.4s ease 0.8s',
          zIndex: 10,
        }}
      />

      {/* Lamp */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '28%',
          transform: 'translateX(-50%)',
          width: 280,
          zIndex: 5,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 4,
            height: 160,
            background:
              'linear-gradient(to right, #0a0604 0%, #2a1a10 50%, #0a0604 100%)',
            borderRadius: 2,
          }}
        />
        <svg
          width="280"
          height="170"
          viewBox="0 0 280 170"
          style={{
            position: 'absolute',
            top: 158,
            left: '50%',
            transform: 'translateX(-50%)',
            filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.9))',
          }}
        >
          <defs>
            <linearGradient id="brassGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3a2515" />
              <stop offset="25%" stopColor="#8a6535" />
              <stop offset="50%" stopColor="#d4a574" />
              <stop offset="75%" stopColor="#8a6535" />
              <stop offset="100%" stopColor="#3a2515" />
            </linearGradient>
            <linearGradient id="shadeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#000000" />
              <stop offset="50%" stopColor="#1a100a" />
              <stop offset="100%" stopColor="#000000" />
            </linearGradient>
            <linearGradient id="shadeInner" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#000" />
              <stop offset="100%" stopColor="#0a0604" />
            </linearGradient>
            <radialGradient id="bulbLit" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fff8dc" />
              <stop offset="40%" stopColor="#ffd27a" />
              <stop offset="80%" stopColor="#ff9a3c" />
              <stop offset="100%" stopColor="#8a4a15" />
            </radialGradient>
            <radialGradient id="bulbDark" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#2a1a10" />
              <stop offset="100%" stopColor="#000000" />
            </radialGradient>
          </defs>

          {/* Ceiling fixture */}
          <ellipse cx="140" cy="6" rx="22" ry="4" fill="url(#brassGrad)" />
          <rect x="118" y="0" width="44" height="8" fill="url(#brassGrad)" />

          {/* Shade */}
          <path d="M 75 18 L 205 18 L 250 145 L 30 145 Z" fill="url(#shadeGrad)" stroke="#000" strokeWidth="1" />
          <path d="M 80 22 L 200 22 L 240 142 L 40 142 Z" fill="url(#shadeInner)" />
          <path d="M 78 18 L 202 18" stroke="rgba(212, 165, 116, 0.4)" strokeWidth="0.5" fill="none" />

          {/* Bottom rim */}
          <ellipse cx="140" cy="145" rx="110" ry="6" fill="url(#brassGrad)" />
          <ellipse cx="140" cy="145" rx="110" ry="3" fill="#3a2515" />
          <ellipse cx="140" cy="143" rx="108" ry="2" fill="rgba(212, 165, 116, 0.5)" />

          {/* Socket */}
          <rect x="128" y="22" width="24" height="18" fill="#0a0604" stroke="#3a2515" strokeWidth="0.5" />
          <rect x="130" y="22" width="20" height="3" fill="url(#brassGrad)" />

          {/* Bulb */}
          <ellipse id="bulb" cx="140" cy="75" rx="16" ry="22" fill={isOn ? 'url(#bulbLit)' : 'url(#bulbDark)'} />
          <path
            id="filament"
            d="M 134 75 Q 137 65 140 75 Q 143 85 146 75"
            stroke={isOn ? '#fff8dc' : '#3a2515'}
            strokeWidth="0.8"
            fill="none"
            opacity={isOn ? 0.9 : 0.6}
          />
          <rect x="134" y="92" width="12" height="6" fill="url(#brassGrad)" />
          <rect x="135" y="96" width="10" height="2" fill="#3a2515" />
        </svg>

        {/* Chain */}
        <div
          id="lamp-chain"
          onClick={() => { pull(); }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pull(); }
          }}
          tabIndex={0}
          role="button"
          aria-label="Pull lamp chain"
          style={{
            position: 'absolute',
            top: 290,
            left: '50%',
            marginLeft: -8,
            width: 16,
            height: 140,
            cursor: 'grab',
            zIndex: 20,
            transformOrigin: '8px 0px',
          }}
          className="animate-sway"
        >
          <svg width="16" height="140" viewBox="0 0 16 140">
            <defs>
              <linearGradient id="linkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3a2515" />
                <stop offset="50%" stopColor="#c89760" />
                <stop offset="100%" stopColor="#3a2515" />
              </linearGradient>
              <radialGradient id="knobGrad" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#f0d4a0" />
                <stop offset="40%" stopColor="#c89760" />
                <stop offset="100%" stopColor="#3a2515" />
              </radialGradient>
            </defs>
            <g fill="url(#linkGrad)" stroke="#000" strokeWidth="0.5">
              {[6, 17, 28, 39, 50, 61, 72, 83, 94].map((cy) => (
                <ellipse key={cy} cx="8" cy={cy} rx="3.5" ry="4.5" />
              ))}
            </g>
            <circle cx="8" cy="115" r="11" fill="url(#knobGrad)" stroke="#000" strokeWidth="1" />
            <circle cx="8" cy="115" r="7" fill="none" stroke="#3a2515" strokeWidth="0.8" />
            <circle cx="4" cy="111" r="2" fill="rgba(255, 240, 200, 0.6)" />
            <line x1="8" y1="100" x2="8" y2="104" stroke="#3a2515" strokeWidth="1.5" />
          </svg>
        </div>
      </div>

      {/* Hint */}
      <div
        style={{
          position: 'absolute',
          top: '70%',
          left: '28%',
          transform: 'translateX(-50%)',
          color: 'rgba(255, 210, 122, 0.5)',
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 13,
          letterSpacing: '0.45em',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          zIndex: 15,
          opacity: isOn ? 0 : undefined,
          transition: 'opacity 0.6s',
        }}
        className={isOn ? '' : 'animate-hintPulse'}
      >
        <span style={{ display: 'inline-block', width: 24, height: 1, background: 'rgba(255, 210, 122, 0.3)', verticalAlign: 'middle', margin: '0 14px' }} />
        Pull the chain
        <span style={{ display: 'inline-block', width: 24, height: 1, background: 'rgba(255, 210, 122, 0.3)', verticalAlign: 'middle', margin: '0 14px' }} />
      </div>

      {/* Login form */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          right: '6%',
          transform: isOn
            ? 'translateY(-50%) translateX(0)'
            : 'translateY(-50%) translateX(40px)',
          width: '92%',
          maxWidth: 400,
          opacity: isOn ? 1 : 0,
          transition: 'opacity 1.2s ease 0.7s, transform 1.2s ease 0.7s',
          zIndex: 30,
          pointerEvents: isOn ? 'auto' : 'none',
        }}
      >
        <div className="card p-12 pb-9">
          {!submitted ? (
            <>
              <p className="ornament mb-2">&loz;</p>
              <h1 className="font-serif text-[34px] text-warm text-center tracking-[0.08em] mb-1">
                Greetings
              </h1>
              <p className="text-[12px] tracking-[0.4em] uppercase text-center text-warm/50 mb-8">
                Jira SDLC
              </p>

              <form onSubmit={handleSubmit}>
                <div className="mb-5 relative">
                  <label className="label-brass">Email Address</label>
                  <input
                    type="text"
                    className="input-brass"
                    placeholder="admin"
                    autoComplete="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <div style={{ position: 'absolute', bottom: 0, left: '50%', width: 0, height: 1, background: 'var(--color-warm)', transition: 'width 0.4s ease, left 0.4s ease' }} />
                </div>

                <div className="mb-5 relative">
                  <label className="label-brass">Password</label>
                  <input
                    type="password"
                    className="input-brass"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div style={{ position: 'absolute', bottom: 0, left: '50%', width: 0, height: 1, background: 'var(--color-warm)', transition: 'width 0.4s ease, left 0.4s ease' }} />
                </div>

                {authError && (
                  <p className="text-[#ff7a6b] text-[11px] tracking-[0.05em] mb-5 text-center">
                    {authError}
                  </p>
                )}

                <div className="flex items-center justify-between mb-6 text-[11px]">
                  <label className="flex items-center gap-2 text-brass-light/70 cursor-pointer tracking-[0.1em]">
                    <input type="checkbox" className="hidden" />
                    <span style={{ width: 13, height: 13, border: '1px solid rgba(200, 151, 96, 0.4)', display: 'inline-block', position: 'relative' }} />
                    Remember me
                  </label>
                  <a href="#" className="text-brass-light/70 no-underline tracking-[0.1em] hover:text-warm transition-colors">
                    Forgot?
                  </a>
                </div>

                <button
                  type="submit"
                  className="btn-brass w-full"
                  style={shake ? { transform: 'translateX(-8px)' } : undefined}
                >
                  Authenticate
                </button>

                <p className="text-center mt-5 text-[11px] tracking-[0.15em] text-brass-light/55">
                  Need access?{' '}
                  <a href="#" className="text-warm no-underline border-b border-transparent hover:border-warm transition-colors">
                    Contact admin
                  </a>
                </p>
              </form>
            </>
          ) : (
            <div className="text-center py-16" style={{ opacity: 1, transition: 'opacity 1s ease' }}>
              <h2
                className="font-serif text-[32px] text-warm-bright tracking-[0.05em] font-normal"
                style={{ textShadow: '0 0 30px rgba(255, 210, 130, 0.6)' }}
              >
                Welcome to Jira SDLC
              </h2>
              <p className="text-brass-light text-[11px] tracking-[0.35em] uppercase mt-4">
                Authentication Successful
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
