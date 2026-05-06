export function TransparencyBlock() {
  return (
    <section
      style={{
        background: '#f5f5f5',
        padding: '56px 32px',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '48px',
          alignItems: 'center',
          maxWidth: '1100px',
          margin: '0 auto',
        }}
      >
        {/* Left: image placeholder */}
        <div
          style={{
            borderRadius: '8px',
            overflow: 'hidden',
            height: '320px',
            background: 'linear-gradient(135deg, #002d7a 0%, #003DA6 60%, #1a5fc8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'radial-gradient(circle at 30% 70%, rgba(255,255,255,0.07) 0%, transparent 50%)',
            }}
          />
          <svg
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1"
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </div>

        {/* Right: text content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#003DA6',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              Transparencia
            </span>
            <div
              style={{
                width: '36px',
                height: '3px',
                background: '#F0A500',
                borderRadius: '2px',
                marginTop: '6px',
              }}
            />
          </div>

          <h2
            style={{
              fontSize: '26px',
              fontWeight: 800,
              color: '#1a1a1a',
              margin: 0,
              lineHeight: 1.3,
              letterSpacing: '-0.3px',
            }}
          >
            Transparencia y Acceso a Información Pública
          </h2>

          <p
            style={{
              fontSize: '14px',
              color: '#555',
              margin: 0,
              lineHeight: 1.7,
            }}
          >
            Garantizamos el derecho de todos los ciudadanos a consultar, conocer y acceder a la
            información pública de la entidad. Aquí encontrará contratos, presupuestos, informes
            de gestión y todos los documentos de interés público.
          </p>

          <ul
            style={{
              margin: 0,
              padding: 0,
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            {['Contratación', 'Planes y presupuestos', 'Informes de gestión', 'Normatividad'].map((item) => (
              <li
                key={item}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '13px',
                  color: '#444',
                }}
              >
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: '#003DA6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                {item}
              </li>
            ))}
          </ul>

          <div>
            <a
              href="/transparencia"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#003DA6',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '4px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 600,
              }}
            >
              Ver información
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
