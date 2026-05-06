interface HeroSliderProps {
  entityName?: string;
  accentColor?: string;
}

export function HeroSlider({ entityName = 'Entidad Gubernamental', accentColor = '#F0A500' }: HeroSliderProps) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '400px',
        background: 'linear-gradient(135deg, #001f6e 0%, #003DA6 50%, #0055cc 100%)',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      {/* Background pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(circle at 70% 50%, rgba(255,255,255,0.05) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />

      {/* Decorative circles */}
      <div
        style={{
          position: 'absolute',
          right: '-60px',
          top: '-60px',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.08)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: '20px',
          bottom: '-80px',
          width: '240px',
          height: '240px',
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.06)',
          pointerEvents: 'none',
        }}
      />

      {/* Content */}
      <div style={{ position: 'relative', padding: '0 60px', maxWidth: '680px' }}>
        {/* Badge */}
        <div
          style={{
            display: 'inline-block',
            background: accentColor,
            color: '#1a1a1a',
            fontSize: '11px',
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: '3px',
            marginBottom: '16px',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
          }}
        >
          Sede Electrónica
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: '36px',
            fontWeight: 800,
            color: '#ffffff',
            margin: '0 0 12px 0',
            lineHeight: 1.2,
            letterSpacing: '-0.5px',
          }}
        >
          Bienvenido a la{' '}
          <br />
          {entityName}
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: '15px',
            color: 'rgba(255,255,255,0.8)',
            margin: '0 0 28px 0',
            lineHeight: 1.6,
            maxWidth: '500px',
          }}
        >
          Accede a todos los trámites y servicios en línea de manera fácil, rápida y segura desde cualquier lugar.
        </p>

        {/* CTA buttons */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            style={{
              background: accentColor,
              color: '#1a1a1a',
              border: 'none',
              borderRadius: '4px',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              letterSpacing: '0.2px',
            }}
          >
            Ver más
          </button>
          <button
            style={{
              background: 'transparent',
              color: '#ffffff',
              border: '2px solid rgba(255,255,255,0.6)',
              borderRadius: '4px',
              padding: '11px 24px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Trámites en Línea
          </button>
        </div>
      </div>

      {/* Slider dots */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '32px',
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: i === 0 ? '24px' : '8px',
              height: '8px',
              borderRadius: i === 0 ? '4px' : '50%',
              background: i === 0 ? accentColor : 'rgba(255,255,255,0.4)',
              cursor: 'pointer',
            }}
          />
        ))}
      </div>

      {/* Arrow indicators */}
      <button
        style={{
          position: 'absolute',
          right: '24px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.15)',
          border: '1px solid rgba(255,255,255,0.25)',
          color: 'white',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  );
}
