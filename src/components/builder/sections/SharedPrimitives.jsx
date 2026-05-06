import React from 'react';

export function NavArrow({ onClick, direction }) {
  return (
    <button
      onClick={e => { e.stopPropagation(); onClick(); }}
      style={{
        width: '3.5rem', height: '3.5rem', /* 56px */
        borderRadius: '99px',
        background: 'rgba(8,8,8,0.4)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, zIndex: 2, padding: 0
      }}
    >
      <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        <path
          d={direction === 'left' ? 'M15 18l-6-6 6-6' : 'M9 18l6-6-6-6'}
          stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

export function CarouselDots({ total, current, onSelect, compact = false }) {
  return (
    <div style={{
      display: 'flex', gap: compact ? '0.375rem' : '0.5rem', padding: compact ? '0.375rem' : '0.5rem',
      borderRadius: '99px',
      background: 'rgba(8,8,8,0.4)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
    }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          onClick={() => onSelect(i)}
          style={{
            width: compact ? '0.75rem' : '1rem', height: compact ? '0.75rem' : '1rem', borderRadius: '50%',
            background: i === current ? 'white' : 'rgba(255,255,255,0.5)',
            cursor: 'pointer', transition: 'background 0.2s',
          }}
        />
      ))}
    </div>
  );
}

export function PauseButton({ isPaused, onClick, bf, compact = false }) {
  return (
    <button
      onClick={e => { e.stopPropagation(); onClick(); }}
      style={{
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        padding: compact ? '0.5rem' : '0.5rem 1rem', borderRadius: '99px',
        background: 'rgba(8,8,8,0.4)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        border: 'none', cursor: 'pointer', flexShrink: 0,
      }}
    >
      <svg width={18} height={18} viewBox="0 0 24 24" fill="white">
        {isPaused
          ? <polygon points="5,3 19,12 5,21" />
          : <><rect x="6" y="4" width={4} height={16} rx="1" /><rect x="14" y="4" width={4} height={16} rx="1" /></>
        }
      </svg>
      {!compact && <span style={{
        fontFamily: bf || "'Nunito Sans', sans-serif",
        fontSize: 'var(--site-font-body-sm)', fontWeight: 400, color: 'white',
        textDecoration: 'underline', whiteSpace: 'nowrap',
      }}>
        {isPaused ? 'Reproducir' : 'Pausar'}
      </span>}
    </button>
  );
}
