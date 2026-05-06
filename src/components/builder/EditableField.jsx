export function EditableField({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem'}}>
      {label && <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', color: 'var(--text-dim)' }}>{label}</span>}
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder || ''}
        style={{
          background: 'var(--bg-darker)', border: '0.0625rem solid var(--border-subtle)', borderRadius: '0.375rem',
          padding: '0.375rem 0.625rem', color: 'var(--text-active)', fontSize: '0.8125rem',
          fontFamily: "'Inter', sans-serif", width: '100%', boxSizing: 'border-box',
          outline: 'none'
        }}
      />
    </div>
  );
}
