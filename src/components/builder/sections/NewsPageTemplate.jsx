import React from 'react';
import { SectionTable } from './SectionTable';
import { SectionLinksDirectory } from './SectionLinksDirectory';

// ─── Breadcrumb Chevron ───
function ChevronRight() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4c4c4c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, transform: 'rotate(-90deg)' }}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

/**
 * NewsPageTemplate — renders a full news/blog detail page.
 *
 * Props:
 *  - title: string
 *  - breadcrumbs: [{ label, link? }]  (last item = current page, no link)
 *  - blocks: [{ type: 'text'|'image'|'table'|'links', content: string|object }]
 *  - theme: { primary, fontTitles, fontBody }
 *  - cmsData: object (optional, for links blocks)
 *  - onItemClick: function (optional, for navigating from links blocks)
 */
export function NewsPageTemplate({ title, breadcrumbs = [], blocks = [], theme = {}, cmsData, onItemClick }) {
  const tf = theme.fontTitles ? `'${theme.fontTitles}', sans-serif` : "'Nunito Sans', sans-serif";
  const bf = theme.fontBody ? `'${theme.fontBody}', sans-serif` : "'Nunito Sans', sans-serif";
  const primary = theme.primary ?? '#004cb0';
  const visibleBreadcrumbs = breadcrumbs.filter((crumb, index) => {
    const isLast = index === breadcrumbs.length - 1;
    const hasRealLink = crumb.link && crumb.link !== '#';
    return isLast || crumb.onNavigate || hasRealLink;
  });

  const responsiveStyles = `
    .template-content-wrapper { width: 70%; }
    .template-page-title { font-size: var(--site-font-page-title); }
    .template-body-text { font-size: var(--site-font-body); }
    @media (max-width: 1024px) {
      .template-content-wrapper { width: 100%; max-width: 64rem; }
    }
    @media (max-width: 768px) {
      .template-content-wrapper { width: 100%; max-width: none; }
    }
  `;

  return (
    <div style={{ width: '100%', background: 'white', display: 'flex', justifyContent: 'center', padding: '0 clamp(24px, 3.125vw, 40px)', boxSizing: 'border-box' }}>
      <style>{responsiveStyles}</style>
      <div className="template-content-wrapper" style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', padding: '3.75rem 0', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>

          {/* ─── Breadcrumb ─── */}
          {visibleBreadcrumbs.length > 0 && (
            <div style={{ paddingBottom: '1.5rem', width: '100%' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap', padding: '1rem 0' }}>
                {visibleBreadcrumbs.map((crumb, i) => {
                  const isLast = i === visibleBreadcrumbs.length - 1;
                  return (
                    <React.Fragment key={i}>
                      {isLast ? (
                        <span style={{
                          fontFamily: bf, fontSize: 'var(--site-font-caption)', fontWeight: 400,
                          color: '#000', textDecoration: 'underline', overflowWrap: 'break-word', wordBreak: 'break-word'
                        }}>
                          {crumb.label}
                        </span>
                      ) : (
                        <>
                          <a
                            href={crumb.link || '#'}
                            onClick={e => {
                              if (crumb.onNavigate) {
                                e.preventDefault();
                                crumb.onNavigate();
                              }
                            }}
                            style={{
                              fontFamily: bf, fontSize: 'var(--site-font-caption)', fontWeight: 400,
                              color: primary, textDecoration: 'underline',
                              cursor: 'pointer', overflowWrap: 'break-word', wordBreak: 'break-word'
                            }}
                          >
                            {crumb.label}
                          </a>
                          <ChevronRight />
                        </>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          )}

          {/* ─── Content Blocks ─── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', paddingBottom: '2.5rem' }}>
            {/* Title */}
            <h1 className="template-page-title" style={{
              fontFamily: tf, fontWeight: 700,
              color: '#000', margin: 0, lineHeight: 'var(--site-line-title)', width: '100%',
              overflowWrap: 'break-word', wordBreak: 'break-word'
            }}>
              {title}
            </h1>

            {/* Dynamic blocks */}
            {blocks.map((block, i) => {
              if (block.type === 'image') {
                return (
                  <div key={i} style={{ width: '100%', overflow: 'hidden', background: '#f4f4f4' }}>
                    <img
                      src={block.content}
                      alt=""
                      style={{ width: '100%', height: '15.625rem', objectFit: 'cover', display: 'block' }}
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                  </div>
                );
              }
              if (block.type === 'table' && typeof block.content === 'object') {
                return (
                  <div key={i} style={{ width: '100%', margin: '1rem 0' }}>
                    <SectionTable config={block.content} theme={theme} fullWidth />
                  </div>
                );
              }
              if (block.type === 'links' && typeof block.content === 'object') {
                return (
                  <div key={i} style={{ width: '100%', margin: '1rem 0' }}>
                    <SectionLinksDirectory config={block.content} theme={theme} cmsData={cmsData} onItemClick={onItemClick} fullWidth />
                  </div>
                );
              }
              if (block.type === 'text') {
                return (
                  <div key={i} style={{ width: '100%' }}>
                    {block.content.split('\n\n').map((para, j) => (
                      <p key={j} className="template-body-text" style={{
                        fontFamily: bf, fontWeight: 400,
                        color: '#000', margin: 0, lineHeight: 'var(--site-line-body)',
                        marginBottom: j < block.content.split('\n\n').length - 1 ? '0.875rem' : 0,
                        overflowWrap: 'break-word', wordBreak: 'break-word'
                      }}
                        dangerouslySetInnerHTML={{ __html: para }}
                      />
                    ))}
                  </div>
                );
              }
              return null;
            })}

            {/* If there's a table block, it renders at 70% width inside the 60rem content via SectionTable */}
          </div>
        </div>
      </div>
    </div>
  );
}
