import React from 'react';

const DEFAULT_NETWORK_BG = '/assets/video-section-network-bg.png';

function getEmbedUrl(url = '') {
  const value = String(url || '').trim();
  if (!value) return '';

  const iframeSrc = value.match(/src=["']([^"']+)["']/i)?.[1];
  if (iframeSrc) return iframeSrc;

  try {
    const parsed = new URL(value);
    const host = parsed.hostname.replace(/^www\./, '');

    if (host === 'youtu.be') {
      const id = parsed.pathname.split('/').filter(Boolean)[0];
      return id ? `https://www.youtube.com/embed/${id}` : value;
    }

    if (host.includes('youtube.com')) {
      const id = parsed.searchParams.get('v') || parsed.pathname.split('/').filter(Boolean).pop();
      return id ? `https://www.youtube.com/embed/${id}` : value;
    }

    if (host.includes('vimeo.com')) {
      const id = parsed.pathname.split('/').filter(Boolean).pop();
      return id ? `https://player.vimeo.com/video/${id}` : value;
    }

    return value;
  } catch {
    return value;
  }
}

export function SectionVideoEmbed({ config = {}, theme }) {
  const sectionTitle = config.title ?? 'Programa TV - Conectando Territorios';
  const titleAlign = config.titleAlign || 'center';
  const layout = config.layout || 'text-right';
  const descriptionTitle = config.descriptionTitle || 'EP05: Conectando territorios: Innovación, conectividad y tecnología para las regiones de Colombia';
  const description = config.description || 'En esta emisión de Conectando Territorios, el programa institucional del Ministerio TIC, visitamos el municipio de Cota, Cundinamarca, en una edición especial en el marco del Día Internacional de la Mujer. Conozca los avances del Gobierno Nacional para llevar conectividad, educación digital e innovación tecnológica a diferentes regiones del país.';
  const videoUrl = config.videoUrl || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
  const embedUrl = getEmbedUrl(videoUrl);
  const backgroundType = config.backgroundType || 'image';
  const backgroundColor = config.backgroundColor || '#07031f';
  const backgroundImage = config.backgroundImage ?? DEFAULT_NETWORK_BG;
  const textColor = config.textColor || config.titleColor || config.descriptionTitleColor || config.descriptionColor || '#ffffff';
  const showText = layout !== 'center';
  const tf = theme?.fontTitles ? `'${theme.fontTitles}', sans-serif` : "'Nunito Sans', sans-serif";
  const bf = theme?.fontBody ? `'${theme.fontBody}', sans-serif` : "'Nunito Sans', sans-serif";

  const responsiveStyles = `
    .video-embed-section { --video-section-padding: 3.75rem 1rem; }
    .video-embed-wrapper { width: 70%; }
    .video-embed-title { width: 70%; font-size: var(--site-font-section-title); }
    .video-embed-panel { backdrop-filter: blur(28px); -webkit-backdrop-filter: blur(28px); background: rgba(0,0,0,0.45); border-radius: 0.5rem; padding: 2.5rem; }
    .video-embed-content { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 2.5rem; align-items: flex-start; }
    .video-embed-content.layout-text-right { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); }
    .video-embed-content.layout-center { display: flex; justify-content: center; }
    .video-embed-card { width: 100%; filter: drop-shadow(0 0.875rem 0.75rem rgba(0,0,0,0.15)); }
    .video-embed-frame { aspect-ratio: 16 / 9; }

    @media (max-width: 1024px) {
      .video-embed-section { --video-section-padding: 3.25rem 2rem; }
      .video-embed-wrapper, .video-embed-title { width: 100%; max-width: 64rem; }
      .video-embed-panel { padding: 2rem; }
      .video-embed-content, .video-embed-content.layout-text-right { grid-template-columns: 1fr; gap: 2rem; }
      .video-embed-copy { order: 1; }
      .video-embed-card { order: 2; width: 100%; }
    }

    @media (max-width: 768px) {
      .video-embed-section { --video-section-padding: 2.75rem 24px; }
      .video-embed-wrapper, .video-embed-title { width: 100%; max-width: none; }
      .video-embed-panel { padding: 1.25rem; }
      .video-embed-content, .video-embed-content.layout-text-right { gap: 1.5rem; }
    }

    [data-gov-preview][data-preview-viewport="mobile"] .video-embed-section { --video-section-padding: 2.75rem 24px !important; }
    [data-gov-preview][data-preview-viewport="mobile"] .video-embed-wrapper,
    [data-gov-preview][data-preview-viewport="mobile"] .video-embed-title { width: 100% !important; max-width: none !important; }
    [data-gov-preview][data-preview-viewport="mobile"] .video-embed-panel { padding: 1.25rem !important; }
    [data-gov-preview][data-preview-viewport="mobile"] .video-embed-content,
    [data-gov-preview][data-preview-viewport="mobile"] .video-embed-content.layout-text-right { grid-template-columns: 1fr !important; gap: 1.5rem !important; }
    [data-gov-preview][data-preview-viewport="mobile"] .video-embed-copy { order: 1 !important; }
    [data-gov-preview][data-preview-viewport="mobile"] .video-embed-card { order: 2 !important; width: 100% !important; }
  `;

  const sectionBackground = backgroundType === 'image' && backgroundImage
    ? {
        backgroundImage: `linear-gradient(rgba(6,3,30,0.26), rgba(6,3,30,0.26)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : { background: backgroundColor };

  const video = (
    <div className="video-embed-card" style={{ minWidth: 0 }}>
      <div className="video-embed-frame" style={{ width: '100%', borderRadius: '1rem', overflow: 'hidden', background: '#111827' }}>
        {embedUrl ? (
          <iframe
            title={descriptionTitle || sectionTitle || 'Video'}
            src={embedUrl}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            style={{ width: '100%', height: '100%', border: 0, display: 'block' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: textColor, fontFamily: bf, fontSize: 'var(--site-font-body-sm)', padding: '1rem', textAlign: 'center' }}>
            Agrega una URL de YouTube, Vimeo o iframe.
          </div>
        )}
      </div>
    </div>
  );

  const copy = showText ? (
    <div className="video-embed-copy" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minWidth: 0, color: textColor }}>
      {descriptionTitle && (
        <h3 style={{ fontFamily: tf, fontSize: 'var(--site-font-subsection-title)', fontWeight: 700, color: textColor, margin: 0, lineHeight: 'var(--site-line-title)' }}>
          {descriptionTitle}
        </h3>
      )}
      {description && (
        <p style={{ fontFamily: bf, fontSize: 'var(--site-font-body-sm)', fontWeight: 400, color: textColor, margin: 0, lineHeight: 'var(--site-line-body)', overflowWrap: 'break-word' }}>
          {description}
        </p>
      )}
    </div>
  ) : null;

  return (
    <section className="video-embed-section" style={{ width: '100%', padding: 'var(--video-section-padding)', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2.5rem', ...sectionBackground }}>
      <style>{responsiveStyles}</style>
      {sectionTitle && (
        <h2 className="video-embed-title" style={{ fontFamily: tf, fontWeight: 700, color: textColor, lineHeight: 'var(--site-line-title)', textAlign: titleAlign, margin: 0 }}>
          {sectionTitle}
        </h2>
      )}
      <div className="video-embed-wrapper">
        <div className="video-embed-panel">
          <div className={`video-embed-content layout-${layout}`}>
            {layout === 'text-right' ? <>{video}{copy}</> : <>{copy}{video}</>}
          </div>
        </div>
      </div>
    </section>
  );
}
