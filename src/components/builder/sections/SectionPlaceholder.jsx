import React from 'react';

/**
 * GENERIC PLACEHOLDER — for unsupported types
 */
export function SectionPlaceholder({ name, type }) {
  return (
    <div style={{
      width: '100%', padding: '3.75rem 2rem',
      background: '#f8f8f8', 
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '4rem', height: '4rem', borderRadius: '0.75rem', background: '#e0e0e0',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1rem',
        }}>
          <svg width={32} height={32} viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width={18} height={18} rx="2" stroke="#aaa" strokeWidth="1.5"/>
            <path d="M12 8v8M8 12h8" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 'var(--site-font-body-sm)', color: '#aaa', margin: 0 }}>
          {name || type}
        </p>
      </div>
    </div>
  );
}
