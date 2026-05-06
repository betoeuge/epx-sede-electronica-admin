import React, { useState } from 'react';

// ════════════════════════════════════════════════════════════
// SectionLinksDirectory
//
// Two display modes matching Gov.CO design system:
//   1. "default"  — flat numbered list with section headers
//   2. "accordion" — collapsible panels grouped by category
//
// Data structure:
//   config.sections = [
//     { id, title: "Información de la Entidad", collection: "blog" },
//     { id, title: "Evaluación de Impacto", collection: "noticias" },
//   ]
// Each section pulls ALL items from its CMS collection.
// ════════════════════════════════════════════════════════════

// ─── Chevron Icon ───
function ChevronDown({ rotated }) {
  return (
    <svg
      width={16} height={16} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      style={{
        transition: 'transform 0.25s ease',
        transform: rotated ? 'rotate(180deg)' : 'rotate(0deg)',
        flexShrink: 0,
      }}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

// ─── Single link row ───
function LinkItem({ sectionIndex, itemIndex, label, theme, onClick }) {
  const [hovered, setHovered] = useState(false);
  const bf = theme?.fontBody ? `'${theme.fontBody}', sans-serif` : "'Nunito Sans', sans-serif";
  const primary = theme?.primary ?? '#004cb0';

  return (
    <div
      style={{
        display: 'flex', gap: '0.5rem', alignItems: 'center',
        cursor: 'pointer',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <span style={{
        fontFamily: bf, fontSize: 'var(--links-item-size, var(--site-font-body))', fontWeight: 400,
        color: '#4c4c4c', whiteSpace: 'nowrap', flexShrink: 0,
      }}>
        {sectionIndex}.{itemIndex}
      </span>
      <span style={{
        fontFamily: bf, fontSize: 'var(--links-item-size, var(--site-font-body))', fontWeight: 400,
        color: hovered ? primary : primary,
        textDecoration: 'underline',
        opacity: hovered ? 0.7 : 1,
        transition: 'opacity 0.15s',
        minWidth: 0,
        overflowWrap: 'anywhere',
      }}>
        {label}
      </span>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// DEFAULT VARIANT — Flat numbered list
// ════════════════════════════════════════════════════════════
function LinksDefault({ groups, theme, onItemClick }) {
  const tf = theme?.fontTitles ? `'${theme.fontTitles}', sans-serif` : "'Nunito Sans', sans-serif";

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {groups.map((group, gi) => (
        <div
          key={gi}
          style={{
            display: 'flex', flexDirection: 'column', gap: '1.5rem',
            padding: '1.5rem 0',
          }}
        >
          {/* Group title */}
          <p style={{
            fontFamily: tf, fontSize: 'var(--links-group-title-size, 2.125rem)', fontWeight: 700,
            color: 'black', margin: 0, lineHeight: 1.2,
          }}>
            {gi + 1}. {group.title}
          </p>

          {/* Links container */}
          <div style={{
            display: 'flex', flexDirection: 'column', gap: '0.5rem',
            paddingLeft: '2rem',
          }}>
            {group.items.map((item, ii) => (
              <LinkItem
                key={item.id || ii}
                sectionIndex={gi + 1}
                itemIndex={ii + 1}
                label={item.title}
                theme={theme}
                onClick={() => onItemClick?.(item)}
              />
            ))}
            {group.items.length === 0 && (
              <span style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 'var(--links-item-size, var(--site-font-body))', color: '#999', fontStyle: 'italic' }}>
                Sin elementos en esta colección
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// ACCORDION VARIANT — Collapsible panels
// ════════════════════════════════════════════════════════════
function LinksAccordion({ groups, theme, onItemClick }) {
  const [openIndex, setOpenIndex] = useState(0);
  const tf = theme?.fontTitles ? `'${theme.fontTitles}', sans-serif` : "'Nunito Sans', sans-serif";
  const borderColor = '#e3edf7';

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      border: `1px solid ${borderColor}`,
      overflow: 'hidden', width: '100%',
    }}>
      {groups.map((group, gi) => {
        const isOpen = openIndex === gi;

        return (
          <div key={gi}>
            {/* Accordion header */}
            <div
              onClick={() => setOpenIndex(isOpen ? -1 : gi)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                gap: '0.625rem', padding: '1rem',
                background: 'white',
                borderBottom: `2px solid ${borderColor}`,
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => { if (!isOpen) e.currentTarget.style.background = '#f9fbfe'; }}
              onMouseLeave={e => { if (!isOpen) e.currentTarget.style.background = 'white'; }}
            >
              <p style={{
                fontFamily: tf, fontSize: 'var(--site-font-body)', fontWeight: 700,
                color: '#4c4c4c', margin: 0, flex: 1,
              }}>
                {gi + 1}. {group.title}
              </p>
              <ChevronDown rotated={isOpen} />
            </div>

            {/* Accordion content */}
            <div style={{
              maxHeight: isOpen ? `${Math.max(group.items.length, 1) * 2.5 + 3.5}rem` : 0,
              overflow: 'hidden',
              transition: 'max-height 0.3s ease',
            }}>
              <div style={{
                background: borderColor,
                padding: '1.5rem',
                display: 'flex', flexDirection: 'column', gap: '0.5rem',
              }}>
                {group.items.map((item, ii) => (
                  <LinkItem
                    key={item.id || ii}
                    sectionIndex={gi + 1}
                    itemIndex={ii + 1}
                    label={item.title}
                    theme={theme}
                    onClick={() => onItemClick?.(item)}
                  />
                ))}
                {group.items.length === 0 && (
                  <span style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: 'var(--links-item-size, var(--site-font-body))', color: '#666', fontStyle: 'italic' }}>
                    Sin elementos en esta colección
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// MAIN EXPORT
// ════════════════════════════════════════════════════════════
export function SectionLinksDirectory({ config = {}, theme, cmsData, onItemClick, fullWidth = false }) {
  const variant = config.variant ?? 'default';
  const sectionTitle = config.title;
  const sectionSubtitle = config.subtitle;
  const sections = config.sections || [];

  const tf = theme?.fontTitles ? `'${theme.fontTitles}', sans-serif` : "'Nunito Sans', sans-serif";
  const bf = theme?.fontBody ? `'${theme.fontBody}', sans-serif` : "'Nunito Sans', sans-serif";
  const titleAlign = config.titleAlign || 'left';

  // ── Build groups from config.sections ──
  // Each section specifies a collection; we pull ALL items from that collection
  let groups = sections.map(sec => {
    const collectionItems = (cmsData && sec.collection) ? (cmsData[sec.collection] || []) : [];
    return {
      title: sec.title || 'Sin título',
      items: collectionItems,
    };
  });

  // Fallback demo data when there are no sections configured
  if (groups.length === 0) {
    groups = [
      {
        title: 'Información de la Entidad',
        items: [
          { id: 'demo-1', title: 'Información de la Entidad' },
          { id: 'demo-2', title: 'Datos de Contacto' },
          { id: 'demo-3', title: 'Detalles de la Ubicación' },
        ],
      },
      {
        title: 'Evaluación de Impacto',
        items: [
          { id: 'demo-4', title: 'Metodología de Evaluación' },
          { id: 'demo-5', title: 'Indicadores de Éxito' },
          { id: 'demo-6', title: 'Análisis de Sostenibilidad' },
        ],
      },
    ];
  }

  const VariantComponent = variant === 'accordion' ? LinksAccordion : LinksDefault;

  // ── fullWidth mode (inside templates) ──
  if (fullWidth) {
    return (
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem', '--links-group-title-size': 'var(--site-font-subsection-title)', '--links-item-size': 'var(--site-font-body)' }}>
        {(sectionTitle || sectionSubtitle) && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: titleAlign }}>
            {sectionTitle && (
              <p style={{ fontFamily: tf, fontSize: 'var(--site-font-subsection-title)', fontWeight: 700, color: 'black', margin: 0, lineHeight: 'var(--site-line-title)' }}>
                {sectionTitle}
              </p>
            )}
            {sectionSubtitle && (
              <p style={{ fontFamily: bf, fontSize: 'var(--site-font-body)', fontWeight: 400, color: '#4c4c4c', margin: 0, lineHeight: 'var(--site-line-body)' }}>
                {sectionSubtitle}
              </p>
            )}
          </div>
        )}
        <VariantComponent groups={groups} theme={theme} onItemClick={onItemClick} />
      </div>
    );
  }

  // ── Standalone section mode (70% width) ──
  const responsiveStyles = `
    .section-links { --links-title-size: var(--site-font-section-title); --links-group-title-size: var(--site-font-subsection-title); --links-item-size: var(--site-font-body); --links-padding: 3.75rem 0; }
    .section-links-wrapper { width: 70%; }
    @media (max-width: 1024px) { .section-links { --links-padding: 3.25rem 2rem; } .section-links-wrapper { width: 100%; max-width: 64rem; } }
    @media (max-width: 768px) { .section-links { --links-group-title-size: var(--site-font-card-title); --links-padding: 2.75rem 24px; } .section-links-wrapper { width: 100%; max-width: none; } }
  `;

  return (
    <div className="section-links" style={{
      width: '100%', background: 'white',
      padding: 'var(--links-padding)', display: 'flex', flexDirection: 'column',
      alignItems: 'center', gap: '1.5rem', boxSizing: 'border-box',
    }}>
      <style>{responsiveStyles}</style>

      {(sectionTitle || sectionSubtitle) && (
        <div className="section-links-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: titleAlign }}>
          {sectionTitle && (
            <p style={{ fontFamily: tf, fontSize: 'var(--links-title-size)', fontWeight: 700, color: 'black', margin: 0, lineHeight: 1.15 }}>
              {sectionTitle}
            </p>
          )}
          {sectionSubtitle && (
            <p style={{ fontFamily: bf, fontSize: 'var(--site-font-body)', fontWeight: 400, color: '#4c4c4c', margin: 0, lineHeight: 'var(--site-line-body)' }}>
              {sectionSubtitle}
            </p>
          )}
        </div>
      )}

      <div className="section-links-wrapper">
        <VariantComponent groups={groups} theme={theme} onItemClick={onItemClick} />
      </div>
    </div>
  );
}
