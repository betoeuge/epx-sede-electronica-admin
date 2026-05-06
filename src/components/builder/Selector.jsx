export function Selector({ value, options, onChange, displayMap, icon }) {
  return (
    <div style={{
      background: 'var(--bg-hover)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center',
      padding: '0.5rem 1rem 0.5rem 0.5rem', gap: '0.5rem', cursor: 'pointer', width: '100%', boxSizing: 'border-box'
    }}>
      {icon && <div style={{ flexShrink: 0 }}>{icon}</div>}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          flex: 1, background: 'transparent', border: 'none', outline: 'none',
          color: 'var(--text-active)', fontFamily: 'var(--font-editor)', fontSize: '0.875rem',
          cursor: 'pointer', appearance: 'none', minWidth: 0, textOverflow: 'ellipsis'
        }}
      >
        {options.map(o => (
          <option key={o} value={o} style={{ background: 'var(--bg-darker)', color: 'white' }}>
            {displayMap ? (displayMap[o]?.name || displayMap[o]) : o}
          </option>
        ))}
      </select>
      <svg width={8} height={6} fill="none" viewBox="0 0 8 6" style={{ flexShrink: 0 }}>
        <path d="M1 1l3 3 3-3" stroke="var(--text-dim)" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    </div>
  );
}
