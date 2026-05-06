interface GovHeaderProps {
  entityName?: string;
  pages: { id: string; label: string; slug: string }[];
  headerStyle: 'blue' | 'white' | 'transparent';
  showLogo: boolean;
  showSearch: boolean;
  showLanguageToggle: boolean;
  accentColor?: string;
}

export function GovHeader({
  entityName = 'Entidad Gubernamental',
  pages,
  headerStyle,
  showLogo,
  showSearch,
  showLanguageToggle,
  accentColor = '#F0A500',
}: GovHeaderProps) {
  const isBlue = headerStyle === 'blue';
  const isWhite = headerStyle === 'white';

  const bgColor = isBlue ? '#003DA6' : isWhite ? '#ffffff' : 'transparent';
  const textColor = isBlue ? '#ffffff' : '#1a1a1a';
  const borderBottom = isWhite ? '1px solid #e5e7eb' : 'none';

  const navPages = pages.length > 0 ? pages.slice(0, 5) : [
    { id: 'inicio', label: 'Inicio', slug: '/' },
    { id: 'tramites', label: 'Trámites', slug: '/tramites' },
    { id: 'noticias', label: 'Noticias', slug: '/noticias' },
    { id: 'transparencia', label: 'Transparencia', slug: '/transparencia' },
    { id: 'contacto', label: 'Contacto', slug: '/contacto' },
  ];

  return (
    <header style={{ fontFamily: 'system-ui, sans-serif' }}>
      {/* Accessibility bar */}
      <div
        style={{
          background: isBlue ? '#002d7a' : '#f0f0f0',
          padding: '4px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11px', color: isBlue ? 'rgba(255,255,255,0.7)' : '#666' }}>
            Colombia
          </span>
          <span style={{ fontSize: '11px', color: isBlue ? 'rgba(255,255,255,0.5)' : '#ccc' }}>|</span>
          <span style={{ fontSize: '11px', color: isBlue ? 'rgba(255,255,255,0.7)' : '#666' }}>
            gov.co
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            style={{
              fontSize: '11px',
              padding: '2px 6px',
              border: `1px solid ${isBlue ? 'rgba(255,255,255,0.3)' : '#ccc'}`,
              borderRadius: '3px',
              background: 'transparent',
              color: isBlue ? 'rgba(255,255,255,0.7)' : '#666',
              cursor: 'pointer',
            }}
          >
            A-
          </button>
          <button
            style={{
              fontSize: '13px',
              padding: '2px 6px',
              border: `1px solid ${isBlue ? 'rgba(255,255,255,0.3)' : '#ccc'}`,
              borderRadius: '3px',
              background: 'transparent',
              color: isBlue ? 'rgba(255,255,255,0.7)' : '#666',
              cursor: 'pointer',
            }}
          >
            A+
          </button>
          {showLanguageToggle && (
            <button
              style={{
                fontSize: '11px',
                padding: '2px 8px',
                border: `1px solid ${isBlue ? 'rgba(255,255,255,0.3)' : '#ccc'}`,
                borderRadius: '3px',
                background: 'transparent',
                color: isBlue ? 'rgba(255,255,255,0.7)' : '#666',
                cursor: 'pointer',
              }}
            >
              ES | EN
            </button>
          )}
        </div>
      </div>

      {/* Main header */}
      <div
        style={{
          background: bgColor,
          borderBottom,
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        {/* Logo + entity name */}
        {showLogo && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: isBlue ? 'rgba(255,255,255,0.25)' : '#003DA6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                  stroke={isBlue ? '#003DA6' : 'white'}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: textColor,
                  lineHeight: 1.2,
                  maxWidth: '180px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {entityName}
              </div>
              <div
                style={{
                  fontSize: '11px',
                  color: isBlue ? 'rgba(255,255,255,0.6)' : '#666',
                  marginTop: '2px',
                }}
              >
                Colombia
              </div>
            </div>
          </div>
        )}

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Navigation */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {navPages.map((page, idx) => (
            <a
              key={page.id}
              href={page.slug}
              style={{
                fontSize: '13px',
                fontWeight: idx === 0 ? 600 : 400,
                color: idx === 0 ? (isBlue ? '#ffffff' : '#003DA6') : (isBlue ? 'rgba(255,255,255,0.85)' : '#333'),
                padding: '6px 10px',
                borderRadius: '4px',
                textDecoration: 'none',
                borderBottom: idx === 0 ? `2px solid ${accentColor}` : '2px solid transparent',
                whiteSpace: 'nowrap',
              }}
            >
              {page.label}
            </a>
          ))}
        </nav>

        {/* Search */}
        {showSearch && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: isBlue ? 'rgba(255,255,255,0.15)' : '#f5f5f5',
              border: `1px solid ${isBlue ? 'rgba(255,255,255,0.2)' : '#ddd'}`,
              borderRadius: '20px',
              padding: '6px 12px',
              flexShrink: 0,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isBlue ? 'rgba(255,255,255,0.6)' : '#888'} strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span style={{ fontSize: '12px', color: isBlue ? 'rgba(255,255,255,0.5)' : '#aaa', minWidth: '80px' }}>
              Buscar...
            </span>
          </div>
        )}

        {/* Login button */}
        <button
          style={{
            background: accentColor,
            color: '#1a1a1a',
            border: 'none',
            borderRadius: '4px',
            padding: '8px 18px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          Ingresar
        </button>
      </div>
    </header>
  );
}
