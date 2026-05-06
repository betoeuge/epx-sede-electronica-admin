import React from 'react';

// Reusable news image placeholder
function NewsImg({ url, style, className }) {
  return (
    <div className={className} style={{ background: '#e8e8e8', borderRadius: '1rem', overflow: 'hidden', position: 'relative', ...style }}>
      <img
        src={url || "https://images.unsplash.com/photo-1585829365234-781fcd04c8.jpg?q=80&w=400&auto=format&fit=crop"}
        alt=""
        style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
        onError={e => { e.target.style.display = 'none'; }}
      />
    </div>
  );
}

function getItemSummary(item) {
  return item.description || item.summary || item.excerpt || item.body || '';
}

function getItemCategory(item) {
  return item.status || item.category || item.tag || 'Publicado';
}

// Reusable news text block (vertical card style)
function VerticalCard({ item, tf, bf, theme, onClick }) {
  return (
    <div onClick={onClick} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', minWidth: 0, cursor: 'pointer' }}>
      <NewsImg url={item.img} style={{ height: 'var(--news-vertical-img-height)', width: '100%' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: 0 }}>
        <p style={{ fontFamily: bf, fontSize: 'var(--news-meta-size)', fontWeight: 400, color: '#000', margin: 0 }}>
          {item.date}
        </p>
        <p style={{
          fontFamily: tf, fontSize: 'var(--news-card-title-size)', fontWeight: 700, color: theme?.primary || '#004cb0',
          textDecoration: 'underline', margin: 0, lineHeight: 1.4,
          wordBreak: 'break-word', overflowWrap: 'break-word',
        }}>
          {item.title}
        </p>
        <p style={{ fontFamily: bf, fontSize: 'var(--news-meta-size)', fontWeight: 400, color: '#000', margin: 0 }}>
          {item.category}
        </p>
      </div>
    </div>
  );
}

// Reusable horizontal card (thumbnail left + text right)
function HorizontalCard({ item, tf, bf, theme, onClick }) {
  return (
    <div className="noticias-horizontal-card" onClick={onClick}>
      <NewsImg className="noticias-horizontal-img" url={item.img} style={{ flexShrink: 0 }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: 0, justifyContent: 'center' }}>
        <p style={{ fontFamily: bf, fontSize: 'var(--news-meta-size)', fontWeight: 400, color: '#000', margin: 0 }}>
          {item.date}
        </p>
        <p style={{
          fontFamily: tf, fontSize: 'var(--news-card-title-size)', fontWeight: 700, color: theme?.primary || '#004cb0',
          textDecoration: 'underline', margin: 0, lineHeight: 1.4,
          wordBreak: 'break-word', overflowWrap: 'break-word',
        }}>
          {item.title}
        </p>
        <p style={{ fontFamily: bf, fontSize: 'var(--news-meta-size)', fontWeight: 400, color: '#000', margin: 0 }}>
          {item.category}
        </p>
      </div>
    </div>
  );
}

function BlogCard({ item, tf, bf, theme, onClick }) {
  const summary = getItemSummary(item);
  const status = getItemCategory(item);
  const secondaryDate = item.endDate || item.closeDate || item.closingDate || '';

  return (
    <div className="noticias-blog-card" onClick={onClick}>
      <NewsImg className="noticias-blog-img" url={item.img} style={{ borderRadius: 0 }} />
      <div className="noticias-blog-body">
        <p className="noticias-blog-meta" style={{ fontFamily: bf }}>{item.date}</p>
        <p className="noticias-blog-title" style={{ fontFamily: tf, color: theme?.primary || '#004cb0' }}>
          {item.title}
        </p>
        {summary && (
          <p className="noticias-blog-summary" style={{ fontFamily: bf }}>{summary}</p>
        )}
        {secondaryDate && (
          <p className="noticias-blog-meta" style={{ fontFamily: bf }}>{secondaryDate}</p>
        )}
        {status && (
          <span className="noticias-blog-tag" style={{ fontFamily: tf }}>{status}</span>
        )}
      </div>
    </div>
  );
}

export function SectionNoticias({ config = {}, theme, onItemClick }) {
  const variant = config.variant ?? 'Destacado';
  const sectionTitle = config.title ?? 'Noticias';
  const sectionSubtitle = config.subtitle || '';
  const titleAlign = config.titleAlign || 'left';
  const items = config.items ?? [];
  
  const tf = theme?.fontTitles ? `'${theme.fontTitles}', sans-serif` : "'Nunito Sans', sans-serif";
  const bf = theme?.fontBody ? `'${theme.fontBody}', sans-serif` : "'Nunito Sans', sans-serif";
  const primary = theme?.primary ?? '#004cb0';

  const responsiveStyles = `
    .noticias-section { --news-title-size: var(--site-font-section-title); --news-card-title-size: var(--site-font-card-title); --news-meta-size: var(--site-font-caption); --news-subtitle-size: var(--site-font-body); --news-vertical-img-height: 15.625rem; --news-section-padding: 3.75rem 0; }
    .noticias-section-wrapper { width: 70%; }
    .noticias-section-title { width: 70%; font-size: var(--news-title-size); text-align: left; }
    .noticias-grid-destacado { display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem; align-items: flex-start; }
    .noticias-grid-lista { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
    .noticias-horizontal-card { display: flex; flex-direction: row; gap: 1.5rem; align-items: stretch; width: 100%; min-width: 0; cursor: pointer; }
    .noticias-horizontal-img { width: 40%; min-height: 10rem; }
    .noticias-blog-wrapper { width: 70%; }
    .noticias-blog-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 2.5rem; align-items: stretch; }
    .noticias-blog-card { display: flex; flex-direction: column; min-width: 0; overflow: hidden; border: 1px solid #b9b9b9; border-radius: 0.25rem; background: #fff; cursor: pointer; }
    .noticias-blog-img { width: 100%; height: 15.625rem; flex-shrink: 0; }
    .noticias-blog-body { display: flex; flex-direction: column; align-items: flex-start; gap: 1rem; padding: 1.5rem 1rem; flex: 1; }
    .noticias-blog-meta { width: 100%; margin: 0; font-size: var(--news-meta-size); font-weight: 400; color: #000; line-height: 1.2; }
    .noticias-blog-title { width: 100%; margin: 0; font-size: var(--news-card-title-size); font-weight: 700; line-height: 1.2; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; word-break: break-word; overflow-wrap: break-word; }
    .noticias-blog-summary { width: 100%; margin: 0; font-size: var(--news-meta-size); font-weight: 400; color: #000; line-height: 1.35; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; word-break: break-word; overflow-wrap: break-word; }
    .noticias-blog-tag { display: inline-flex; align-items: center; justify-content: center; min-height: 2rem; padding: 0.5rem 1rem; border-radius: 6.1875rem; background: #f4f4f4; color: #4c4c4c; font-size: var(--site-font-body-sm); font-weight: 700; line-height: 1; margin-top: auto; max-width: 100%; }
    
    @media (max-width: 1024px) {
      .noticias-section { --news-section-padding: 3.25rem 2rem; }
      .noticias-section-wrapper { width: 100%; max-width: 64rem; }
      .noticias-section-title { width: 100%; max-width: 64rem; }
      .noticias-grid-lista { grid-template-columns: 1fr; }
      .noticias-blog-wrapper { max-width: 64rem; }
      .noticias-blog-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    @media (max-width: 768px) {
      .noticias-section { --news-vertical-img-height: clamp(12rem, 52vw, 16rem); --news-section-padding: 2.75rem 24px; gap: 2rem; }
      .noticias-section-wrapper { width: 100%; max-width: none; }
      .noticias-section-title { width: 100%; text-align: center; }
      .noticias-grid-destacado, .noticias-grid-lista, .noticias-blog-grid { grid-template-columns: 1fr; gap: 2rem; }
      .noticias-horizontal-card { flex-direction: column; gap: 1.25rem; }
      .noticias-horizontal-img { width: 100%; min-height: 13.5rem; }
      .noticias-blog-img { height: clamp(12rem, 52vw, 16rem); }
    }
  `;

  return (
    <div className="noticias-section" style={{
      width: '100%', background: 'white',
      padding: 'var(--news-section-padding)', display: 'flex', flexDirection: 'column',
      alignItems: 'center', gap: '2.5rem', boxSizing: 'border-box'
    }}>
      <style>{responsiveStyles}</style>
      <div className="noticias-section-title" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <p style={{
          fontFamily: tf, fontWeight: 700, color: '#000', margin: 0, lineHeight: 1,
          textAlign: titleAlign,
        }}>
          {sectionTitle}
        </p>
        {sectionSubtitle && (
          <p style={{
            fontFamily: bf, fontSize: 'var(--news-subtitle-size)', fontWeight: 400, color: '#4c4c4c', margin: 0, lineHeight: 'var(--site-line-body)',
            textAlign: titleAlign,
          }}>
            {sectionSubtitle}
          </p>
        )}
      </div>

      <div className={`noticias-section-wrapper${variant === 'Blog' ? ' noticias-blog-wrapper' : ''}`}>
        {variant === 'Destacado' && (
          <div className="noticias-grid-destacado">
            {/* Left side (Up to 3 large vertical cards) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', minWidth: 0 }}>
              {items.slice(0, 3).map((n, i) => (
                <VerticalCard key={`v-${i}`} item={n} tf={tf} bf={bf} theme={theme} onClick={() => onItemClick?.(n)} />
              ))}
            </div>
            {/* Right side (Remaining horizontal cards) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', minWidth: 0 }}>
              {items.slice(3, 8).map((n, i) => (
                <HorizontalCard key={`h-${i}`} item={n} tf={tf} bf={bf} theme={theme} onClick={() => onItemClick?.(n)} />
              ))}
            </div>
          </div>
        )}

        {variant === 'Lista Horizontal' && (
          <div className="noticias-grid-lista">
            {items.map((n, i) => (
              <HorizontalCard key={`h-${i}`} item={n} tf={tf} bf={bf} theme={theme} onClick={() => onItemClick?.(n)} />
            ))}
          </div>
        )}

        {variant === 'Cuadrícula Vertical' && (
          <div className="noticias-grid-lista">
            {items.map((n, i) => (
              <VerticalCard key={`v-${i}`} item={n} tf={tf} bf={bf} theme={theme} onClick={() => onItemClick?.(n)} />
            ))}
          </div>
        )}

        {variant === 'Blog' && (
          <div className="noticias-blog-grid">
            {items.map((n, i) => (
              <BlogCard key={`b-${i}`} item={n} tf={tf} bf={bf} theme={theme} onClick={() => onItemClick?.(n)} />
            ))}
          </div>
        )}
      </div>

      <div style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        padding: '0.75rem 2rem', borderRadius: '2.5rem',
        background: primary, cursor: 'pointer', flexShrink: 0, marginTop: '1rem',
        transition: 'opacity 0.2s'
      }}
      onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
      onMouseLeave={e => e.currentTarget.style.opacity = '1'}
      >
        <span style={{ fontFamily: tf, fontSize: 'var(--site-font-body-sm)', fontWeight: 400, color: 'white', whiteSpace: 'nowrap' }}>
          Más Noticias
        </span>
      </div>
    </div>
  );
}
