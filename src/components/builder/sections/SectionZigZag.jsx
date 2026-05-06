import React from 'react';

const DEFAULT_ITEMS = [
  {
    id: 'zigzag-1',
    layout: 'image-left',
    title: 'EP05: Conectando territorios: Innovación, conectividad y tecnología para las regiones de Colombia',
    description: 'En esta emisión de Conectando Territorios, el programa institucional del Ministerio TIC, visitamos el municipio de Cota, Cundinamarca, en una edición especial en el marco del Día Internacional de la Mujer. Conozca los avances del Gobierno Nacional para llevar conectividad, educación digital e innovación tecnológica a diferentes regiones del país.',
    image: '/assets/zigzag-section-image-left.jpg',
    imageAlt: '',
  },
  {
    id: 'zigzag-2',
    layout: 'image-right',
    title: 'EP05: Conectando territorios: Innovación, conectividad y tecnología para las regiones de Colombia',
    description: 'En esta emisión de Conectando Territorios, el programa institucional del Ministerio TIC, visitamos el municipio de Cota, Cundinamarca, en una edición especial en el marco del Día Internacional de la Mujer. Conozca los avances del Gobierno Nacional para llevar conectividad, educación digital e innovación tecnológica a diferentes regiones del país.',
    image: '/assets/zigzag-section-image-right.jpg',
    imageAlt: '',
  },
];

export function SectionZigZag({ config = {}, theme, onItemClick }) {
  const title = config.title || '';
  const subtitle = config.subtitle || '';
  const titleAlign = config.titleAlign || 'left';
  const items = Array.isArray(config.items) && config.items.length > 0 ? config.items : DEFAULT_ITEMS;
  const backgroundColor = config.backgroundColor || '#f4f4f4';
  const titleColor = config.titleColor || theme?.primary || '#004cb0';
  const textColor = config.textColor || '#000000';
  const tf = theme?.fontTitles ? `'${theme.fontTitles}', sans-serif` : "'Nunito Sans', sans-serif";
  const bf = theme?.fontBody ? `'${theme.fontBody}', sans-serif` : "'Nunito Sans', sans-serif";

  const responsiveStyles = `
    .zigzag-section { --zigzag-padding: 3.75rem 1rem; }
    .zigzag-inner { width: 70%; max-width: 77.5rem; }
    .zigzag-header { width: 70%; max-width: 77.5rem; }
    .zigzag-item { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 2.5rem; align-items: center; }
    .zigzag-image-frame { height: 25rem; }

    @media (max-width: 1024px) {
      .zigzag-section { --zigzag-padding: 3.25rem 2rem; }
      .zigzag-inner, .zigzag-header { width: 100%; max-width: 64rem; }
      .zigzag-item { grid-template-columns: 1fr; gap: 2rem; }
      .zigzag-copy { order: 1; }
      .zigzag-image-frame { order: 2; height: auto; aspect-ratio: 16 / 10; }
    }

    @media (max-width: 768px) {
      .zigzag-section { --zigzag-padding: 2.75rem 24px; }
      .zigzag-inner, .zigzag-header { width: 100%; max-width: none; }
      .zigzag-item { gap: 1.5rem; }
    }

    [data-gov-preview][data-preview-viewport="mobile"] .zigzag-section { --zigzag-padding: 2.75rem 24px !important; }
    [data-gov-preview][data-preview-viewport="mobile"] .zigzag-inner,
    [data-gov-preview][data-preview-viewport="mobile"] .zigzag-header { width: 100% !important; max-width: none !important; }
    [data-gov-preview][data-preview-viewport="mobile"] .zigzag-item { grid-template-columns: 1fr !important; gap: 1.5rem !important; }
    [data-gov-preview][data-preview-viewport="mobile"] .zigzag-copy { order: 1 !important; }
    [data-gov-preview][data-preview-viewport="mobile"] .zigzag-image-frame { order: 2 !important; height: auto !important; aspect-ratio: 16 / 10 !important; }
  `;

  return (
    <section className="zigzag-section" style={{ width: '100%', padding: 'var(--zigzag-padding)', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2.5rem', background: backgroundColor }}>
      <style>{responsiveStyles}</style>

      {(title || subtitle) && (
        <div className="zigzag-header" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', textAlign: titleAlign }}>
          {title && (
            <h2 style={{ fontFamily: tf, fontSize: 'var(--site-font-section-title)', lineHeight: 'var(--site-line-title)', fontWeight: 700, color: titleColor, margin: 0 }}>
              {title}
            </h2>
          )}
          {subtitle && (
            <p style={{ fontFamily: bf, fontSize: 'var(--site-font-body)', lineHeight: 'var(--site-line-body)', color: textColor, margin: 0 }}>
              {subtitle}
            </p>
          )}
        </div>
      )}

      <div className="zigzag-inner" style={{ display: 'flex', flexDirection: 'column', gap: '3.75rem' }}>
        {items.map((item, index) => {
          const layout = item.layout || (index % 2 === 0 ? 'image-left' : 'image-right');
          const image = (
            <div className="zigzag-image-frame" style={{ minWidth: 0, borderRadius: '0.5rem', overflow: 'hidden', background: '#ffffff' }}>
              {item.image ? (
                <img src={item.image} alt={item.imageAlt || ''} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', minHeight: '16rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: bf, fontSize: 'var(--site-font-body-sm)', color: '#6b7280', background: '#ffffff' }}>
                  Imagen del contenido
                </div>
              )}
            </div>
          );
          const copy = (
            <div className="zigzag-copy" style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'flex-start', textAlign: 'left' }}>
              {item.title && (
                <h3 style={{ fontFamily: tf, fontSize: 'var(--site-font-subsection-title)', lineHeight: 'var(--site-line-title)', fontWeight: 700, color: titleColor, margin: 0, textDecoration: 'underline', textUnderlineOffset: '0.12em' }}>
                  {item.title}
                </h3>
              )}
              {item.description && (
                <p style={{ fontFamily: bf, fontSize: 'var(--site-font-body-sm)', lineHeight: 'var(--site-line-body)', fontWeight: 400, color: textColor, margin: 0, overflowWrap: 'break-word' }}>
                  {item.description}
                </p>
              )}
            </div>
          );

          const isClickable = typeof onItemClick === 'function';

          return (
            <article className="zigzag-item" key={item.id || index} onClick={isClickable ? () => onItemClick(item) : undefined} style={{ cursor: isClickable ? 'pointer' : 'default' }}>
              {layout === 'image-right' ? <>{copy}{image}</> : <>{image}{copy}</>}
            </article>
          );
        })}
      </div>
    </section>
  );
}