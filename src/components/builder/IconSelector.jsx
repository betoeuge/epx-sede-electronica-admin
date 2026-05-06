import React, { useState, useMemo } from 'react';
import { GOV_ICONS } from './GovIcons';

export const IconSelector = ({ value, onChange }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredIcons = useMemo(() => {
    if (!searchTerm) return Object.entries(GOV_ICONS);
    const term = searchTerm.toLowerCase();
    return Object.entries(GOV_ICONS).filter(([id, data]) => 
      data.name.toLowerCase().includes(term) || 
      data.tags.some(tag => tag.toLowerCase().includes(term))
    );
  }, [searchTerm]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      background: 'rgba(0, 0, 0, 0.2)',
      border: '0.0625rem solid var(--border-subtle)',
      borderRadius: '0.5rem',
      overflow: 'hidden',
      width: '100%',
    }}>
      {/* Search Bar */}
      <div style={{ padding: '0.5rem', borderBottom: '0.0625rem solid var(--border-subtle)' }}>
        <input
          type="text"
          placeholder="Buscar ícono..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            background: 'var(--bg-darker)',
            border: '0.0625rem solid var(--border-subtle)',
            color: 'white',
            padding: '0.5rem 0.75rem',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            outline: 'none',
            boxSizing: 'border-box'
          }}
        />
      </div>

      {/* Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(2.5rem, 1fr))', 
        gap: '0.5rem', 
        padding: '0.75rem',
        overflowY: 'auto',
        maxHeight: '12.5rem'
      }}>
        {filteredIcons.map(([id, data]) => {
          const IconComponent = data.icon;
          const isSelected = value === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              title={data.name}
              style={{
                background: isSelected ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                border: isSelected ? '0.0625rem solid #3b82f6' : '0.0625rem solid transparent',
                borderRadius: '0.375rem',
                color: isSelected ? '#3b82f6' : 'var(--text-active)',
                padding: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                aspectRatio: '1/1'
              }}
              onMouseEnter={e => {
                if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              }}
              onMouseLeave={e => {
                if (!isSelected) e.currentTarget.style.background = 'transparent';
              }}
            >
              <IconComponent size={18} />
            </button>
          );
        })}
      </div>
      
      {filteredIcons.length === 0 && (
        <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          No se encontraron íconos
        </div>
      )}
    </div>
  );
};
