export function CustomColorPicker({ label, value, onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.875rem', color: 'var(--text-active)' }}>{label}</span>
      <label style={{
        display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer',
        background: 'var(--bg-darker)', border: '0.0625rem solid var(--border-light)',
        borderRadius: '0.25rem', padding: '0.5rem 1rem', height: '2.5rem', boxSizing: 'border-box',
        position: 'relative'
      }}>
        <div style={{ width: '1.5rem', height: '1.5rem', borderRadius: '0.125rem', border: '0.125rem solid var(--border-light)', background: value, flexShrink: 0 }} />
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.875rem', color: 'var(--text-active)', flex: 1 }}>{value?.toUpperCase()}</span>
        <input 
          type="color" 
          value={value} 
          onChange={e => onChange(e.target.value)} 
          style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} 
        />
      </label>
    </div>
  );
}
