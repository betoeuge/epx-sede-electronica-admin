const SAMPLE_NEWS = [
  {
    id: '1',
    category: 'Institucional',
    title: 'La entidad lanza nuevo portal de trámites en línea para ciudadanos',
    date: '15 Mar 2026',
    excerpt: 'El nuevo portal permite realizar más de 50 trámites sin necesidad de desplazarse a las oficinas.',
    imageColor: '#1a4d9e',
  },
  {
    id: '2',
    category: 'Servicios',
    title: 'Amplían horario de atención virtual para consultas ciudadanas',
    date: '10 Mar 2026',
    excerpt: 'Ahora podrá solicitar citas y resolver dudas a través del chat oficial de lunes a sábado.',
    imageColor: '#2c7a4b',
  },
  {
    id: '3',
    category: 'Transparencia',
    title: 'Publicación del informe de gestión del primer trimestre 2026',
    date: '5 Mar 2026',
    excerpt: 'El informe detalla los avances en contratación pública, presupuesto ejecutado y metas cumplidas.',
    imageColor: '#7a3c1a',
  },
];

export function NewsGrid() {
  return (
    <section
      style={{
        background: '#ffffff',
        padding: '48px 32px',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      {/* Section header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '32px',
        }}
      >
        <div>
          <h2
            style={{
              fontSize: '24px',
              fontWeight: 800,
              color: '#003DA6',
              margin: 0,
              letterSpacing: '-0.3px',
            }}
          >
            Últimas Noticias
          </h2>
          <div
            style={{
              width: '48px',
              height: '3px',
              background: '#F0A500',
              borderRadius: '2px',
              marginTop: '8px',
            }}
          />
        </div>
        <a
          href="/noticias"
          style={{
            fontSize: '13px',
            color: '#003DA6',
            textDecoration: 'none',
            fontWeight: 600,
            border: '1px solid #003DA6',
            borderRadius: '4px',
            padding: '7px 16px',
          }}
        >
          Ver más noticias
        </a>
      </div>

      {/* News grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px',
        }}
      >
        {SAMPLE_NEWS.map((news) => (
          <article
            key={news.id}
            style={{
              borderRadius: '8px',
              overflow: 'hidden',
              border: '1px solid #e8e8e8',
              background: '#fff',
              display: 'flex',
              flexDirection: 'column',
              cursor: 'pointer',
            }}
          >
            {/* Image */}
            <div
              style={{
                height: '160px',
                background: `linear-gradient(135deg, ${news.imageColor} 0%, ${news.imageColor}99 100%)`,
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="1.5"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>

            {/* Content */}
            <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  color: '#003DA6',
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                }}
              >
                {news.category}
              </span>
              <h3
                style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#1a1a1a',
                  margin: 0,
                  lineHeight: 1.4,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {news.title}
              </h3>
              <span style={{ fontSize: '11px', color: '#999' }}>{news.date}</span>
              <p
                style={{
                  fontSize: '12px',
                  color: '#666',
                  margin: 0,
                  lineHeight: 1.5,
                  flex: 1,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {news.excerpt}
              </p>
              <a
                href={`/noticias/${news.id}`}
                style={{
                  fontSize: '12px',
                  color: '#003DA6',
                  textDecoration: 'none',
                  fontWeight: 600,
                  marginTop: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                Leer más
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
