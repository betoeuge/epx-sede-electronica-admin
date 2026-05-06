interface GovFooterProps {
  entityName?: string;
  pages: { id: string; label: string; slug: string }[];
}

export function GovFooter({ entityName = 'Entidad Gubernamental', pages }: GovFooterProps) {
  const navPages = pages.length > 0 ? pages : [
    { id: 'inicio', label: 'Inicio', slug: '/' },
    { id: 'tramites', label: 'Trámites', slug: '/tramites' },
    { id: 'noticias', label: 'Noticias', slug: '/noticias' },
    { id: 'transparencia', label: 'Transparencia', slug: '/transparencia' },
    { id: 'contacto', label: 'Contacto', slug: '/contacto' },
  ];

  return (
    <footer
      style={{
        background: '#003DA6',
        borderTop: '4px solid #F0A500',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <div style={{ padding: '48px 32px 32px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.5fr 1fr 1fr',
            gap: '48px',
          }}
        >
          {/* Column 1: Logo + entity info + social */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'white' }}>{entityName}</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>Colombia</div>
              </div>
            </div>

            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.6 }}>
              Calle 7 No. 6-54, Bogotá D.C.
              <br />
              NIT: 899.999.001-4
              <br />
              Código Postal: 111711
            </p>

            {/* Social icons */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
              {[
                // Twitter/X
                <svg key="twitter" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                </svg>,
                // Facebook
                <svg key="facebook" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>,
                // YouTube
                <svg key="youtube" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                  <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
                </svg>,
              ].map((icon, i) => (
                <a
                  key={i}
                  href="#"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textDecoration: 'none',
                  }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Navigation links */}
          <div>
            <h4
              style={{
                fontSize: '13px',
                fontWeight: 700,
                color: '#F0A500',
                margin: '0 0 16px 0',
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
              }}
            >
              Navegación
            </h4>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {navPages.map((page) => (
                <li key={page.id}>
                  <a
                    href={page.slug}
                    style={{
                      fontSize: '13px',
                      color: 'rgba(255,255,255,0.8)',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="3">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                    {page.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact + GOV.CO logo */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4
              style={{
                fontSize: '13px',
                fontWeight: 700,
                color: '#F0A500',
                margin: '0 0 0 0',
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
              }}
            >
              Contacto
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { icon: 'phone', text: '(601) 381 7000' },
                { icon: 'mail', text: 'contacto@entidad.gov.co' },
                { icon: 'clock', text: 'Lun - Vie: 8am - 5pm' },
              ].map(({ icon, text }) => (
                <div key={icon} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '16px', flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
                    {icon === 'phone' && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.43h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    )}
                    {icon === 'mail' && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    )}
                    {icon === 'clock' && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    )}
                  </div>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.75)' }}>{text}</span>
                </div>
              ))}
            </div>

            {/* GOV.CO logo placeholder */}
            <div
              style={{
                marginTop: '8px',
                padding: '10px 14px',
                background: 'rgba(255,255,255,0.12)',
                borderRadius: '6px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                width: 'fit-content',
              }}
            >
              <span style={{ fontSize: '16px', fontWeight: 800, color: 'white', letterSpacing: '-0.5px' }}>
                GOV.CO
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          borderTop: '1px solid rgba(255,255,255,0.12)',
          padding: '14px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>
          © 2026 {entityName}. Todos los derechos reservados.
        </span>
        <div style={{ display: 'flex', gap: '16px' }}>
          {['Política de privacidad', 'Términos de uso', 'Accesibilidad'].map((link) => (
            <a
              key={link}
              href="#"
              style={{
                fontSize: '11px',
                color: 'rgba(255,255,255,0.5)',
                textDecoration: 'none',
              }}
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
