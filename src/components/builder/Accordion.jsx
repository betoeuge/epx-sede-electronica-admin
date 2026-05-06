import { useState } from 'react';

export function Accordion({ title, isOpen, onToggle, children }) {
  return (
    <div style={{ width: '100%', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
      <div 
        onClick={onToggle} 
        style={{ 
          background: 'var(--bg-darker)', 
          borderBottom: '0.0625rem solid var(--border-subtle)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          padding: '0.75rem 1rem', 
          cursor: 'pointer', 
          gap: '0.625rem'}}
      >
        <span style={{ fontFamily: 'var(--font-editor)', fontSize: '0.875rem', fontWeight: 400, color: 'var(--text-active)', flex: 1 }}>{title}</span>
        <svg 
          width={8} height={6} fill="none" viewBox="0 0 8 6" 
          style={{ 
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', 
            flexShrink: 0,
            transition: 'transform 0.2s ease'
          }}
        >
          <path d="M1 1l3 3 3-3" stroke="var(--text-active)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      {isOpen && (
        <div style={{ background: 'var(--bg-main)', borderBottom: '0.0625rem solid var(--border-subtle)', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem'}}>
          {children}
        </div>
      )}
    </div>
  );
}

export function NavAccordion({ title, isOpen, onToggle, onRemove, onDragStart, onDragOver, onDrop, children }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ width: '100%', flexShrink: 0, display: 'flex', flexDirection: 'column', position: 'relative' }}
    >
      <div 
        onClick={onToggle} 
        style={{ 
          background: 'var(--bg-darker)', 
          borderBottom: '0.0625rem solid var(--border-subtle)', 
          display: 'flex', 
          alignItems: 'center', 
          padding: '0.75rem 1rem', 
          cursor: 'pointer', 
          gap: '0.625rem'}}
      >
        <svg width={7} height={16} viewBox="0 0 7 16" fill="none" style={{ flexShrink: 0, cursor: 'grab' }}>
          <circle cx="2" cy="2" r="1.5" fill="var(--text-dim)"/>
          <circle cx="2" cy="8" r="1.5" fill="var(--text-dim)"/>
          <circle cx="2" cy="14" r="1.5" fill="var(--text-dim)"/>
          <circle cx="6" cy="2" r="1.5" fill="var(--text-dim)"/>
          <circle cx="6" cy="8" r="1.5" fill="var(--text-dim)"/>
          <circle cx="6" cy="14" r="1.5" fill="var(--text-dim)"/>
        </svg>
        <span style={{ fontFamily: 'var(--font-editor)', fontSize: '0.875rem', fontWeight: 400, color: 'var(--text-active)', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</span>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
          {isHovered && onRemove && (
            <button 
              type="button"
              onClick={(e) => { e.stopPropagation(); onRemove(); }}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.25rem'}}
            >
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/>
              </svg>
            </button>
          )}
          <svg 
            width={8} height={6} fill="none" viewBox="0 0 8 6" 
            style={{ 
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', 
              flexShrink: 0,
              transition: 'transform 0.2s ease'
            }}
          >
            <path d="M1 1l3 3 3-3" stroke="var(--text-active)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      {isOpen && (
        <div style={{ background: 'var(--bg-main)', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem'}}>
          {children}
        </div>
      )}
    </div>
  );
}
