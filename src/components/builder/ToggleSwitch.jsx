export function ToggleSwitch({ label, checked, onChange, activeColor = 'var(--color-success)' }) {
  return (
    <div 
      onClick={() => onChange(!checked)} 
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0.375rem 0', cursor: 'pointer', userSelect: 'none'
      }}
    >
      {label && <span style={{ fontFamily: 'var(--font-editor)', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{label}</span>}
      <div style={{
        width: '2.25rem', height: '1.25rem', borderRadius: 'var(--radius-pill)',
        background: checked ? activeColor : 'var(--bg-active)',
        position: 'relative', transition: 'background 0.2s ease',
        flexShrink: 0
      }}>
        <div style={{
          width: '1rem', height: '1rem', borderRadius: '50%', background: 'white',
          position: 'absolute', top: '0.125rem',
          left: checked ? 18 : 2,
          transition: 'left 0.2s ease',
          boxShadow: '0 0.0625rem 0.1875rem rgba(0,0,0,0.3)'
        }} />
      </div>
    </div>
  );
}
