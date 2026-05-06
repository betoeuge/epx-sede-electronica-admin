import React, { useState } from 'react';

// ── Chevron SVG ──
function ChevronIcon({ open }) {
  return (
    <svg
      width={17} height={17} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      style={{ transition: 'transform 0.25s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0, color: '#666' }}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

// ── Checkbox SVG ──
function Checkbox({ checked, color }) {
  if (checked) {
    return (
      <div style={{
        width: '1rem', height: '1rem', borderRadius: '0.125rem', flexShrink: 0,
        background: color, border: `0.125rem solid ${color}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
    );
  }
  return (
    <div style={{
      width: '1rem', height: '1rem', borderRadius: '0.125rem', flexShrink: 0,
      background: 'white', border: `0.125rem solid ${color}`,
    }} />
  );
}

// ── Sort icon ──
function SortIcon({ color = '#afc8e7' }) {
  return (
    <div style={{
      width: '1rem', height: '1rem', borderRadius: '0.125rem', flexShrink: 0,
      background: color, display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 15l6-6 6 6" />
      </svg>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// Variant: EXPANDIBLE
// ════════════════════════════════════════════════════════════
function TableExpandible({ config, theme, tf, bf }) {
  const { columns = [], rows = [], showCheckbox } = config;
  const primary = theme?.primary || '#2677c4';
  const [openRows, setOpenRows] = useState({});

  const toggleRow = (rowId) => {
    setOpenRows(prev => ({ ...prev, [rowId]: !prev[rowId] }));
  };

  return (
    <div style={{ width: '100%', border: '0.0625rem solid #e3edf7', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', background: primary, width: '100%',
      }}>
        {columns.map((col, ci) => (
          <div key={col.id} style={{
            display: 'flex', alignItems: 'center', gap: '0.625rem',
            padding: '1rem', flexShrink: ci < columns.length - 1 ? 0 : undefined,
            flex: ci === columns.length - 1 ? '1 0 0' : undefined,
            width: col.width || 'auto', minWidth: 0,
            justifyContent: col.align === 'right' ? 'flex-end' : 'flex-start',
          }}>
            {col.sortable && <SortIcon />}
            <span style={{
              fontFamily: tf, fontSize: 'var(--site-font-body-sm)', fontWeight: 700, color: 'white',
              whiteSpace: ci < columns.length - 1 ? 'nowrap' : undefined,
            }}>
              {col.header}
            </span>
          </div>
        ))}
        {/* Expand column space */}
        <div style={{ width: '3.1875rem', flexShrink: 0 }} />
      </div>

      {/* Rows */}
      {rows.map((row) => {
        const isOpen = openRows[row.id] || false;
        return (
          <div key={row.id} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            {/* Main Row */}
            <div style={{
              display: 'flex', alignItems: 'center', background: 'white',
              borderBottom: '0.0625rem solid #e3edf7', width: '100%', cursor: 'pointer',
            }} onClick={() => row.expandable && toggleRow(row.id)}>
              {showCheckbox && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', width: '3.1875rem', flexShrink: 0 }}>
                  <Checkbox checked={false} color={primary} />
                </div>
              )}
              {columns.map((col, ci) => (
                <div key={col.id} style={{
                  padding: '1rem',
                  flexShrink: ci < columns.length - 1 ? 0 : undefined,
                  flex: ci === columns.length - 1 ? '1 0 0' : undefined,
                  width: col.width || 'auto', minWidth: 0,
                  textAlign: col.align || 'left',
                  display: 'flex', alignItems: 'center',
                  justifyContent: col.align === 'right' ? 'flex-end' : 'flex-start',
                }}>
                  <span style={{
                    fontFamily: bf, fontSize: 'var(--site-font-body-sm)', color: 'black',
                    lineHeight: '1.4',
                  }}>
                    {row.cells?.[col.id] || ''}
                  </span>
                </div>
              ))}
              {/* Expand toggle */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', width: '3.1875rem', flexShrink: 0 }}>
                {row.expandable && <ChevronIcon open={isOpen} />}
              </div>
            </div>

            {/* Expanded Content */}
            {isOpen && row.expandable && (
              <div style={{
                background: '#e3edf7', padding: '2rem', width: '100%', boxSizing: 'border-box',
                display: 'flex', flexDirection: 'column', gap: '1.5rem',
              }}>
                {row.expandable.subtitle && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <span style={{ fontFamily: tf, fontSize: 'var(--site-font-card-title)', fontWeight: 700, color: 'black' }}>
                      {row.expandable.subtitle}
                    </span>
                    {row.expandable.description && (
                      <span style={{ fontFamily: bf, fontSize: 'var(--site-font-body-sm)', color: 'black' }}>
                        {row.expandable.description}
                      </span>
                    )}
                  </div>
                )}
                {/* Sub-table */}
                {row.expandable.subRows && row.expandable.subRows.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    {/* Sub-header */}
                    <div style={{
                      display: 'flex', alignItems: 'center',
                      borderBottom: '0.0625rem solid white', width: '100%',
                    }}>
                      {showCheckbox && (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', width: '3.1875rem', flexShrink: 0 }}>
                          <Checkbox checked={true} color={primary} />
                        </div>
                      )}
                      {columns.map((col, ci) => (
                        <div key={col.id} style={{
                          padding: '1rem',
                          flexShrink: ci < columns.length - 1 ? 0 : undefined,
                          flex: ci === columns.length - 1 ? '1 0 0' : undefined,
                          width: col.width || 'auto', minWidth: 0,
                        }}>
                          <span style={{ fontFamily: tf, fontSize: 'var(--site-font-body-sm)', fontWeight: 700, color: primary }}>
                            {col.header}
                          </span>
                        </div>
                      ))}
                    </div>
                    {/* Sub-rows */}
                    {row.expandable.subRows.map((sr, si) => (
                      <div key={si} style={{
                        display: 'flex', alignItems: 'center',
                        borderBottom: si < row.expandable.subRows.length - 1 ? '0.0625rem solid white' : 'none',
                        width: '100%',
                      }}>
                        {showCheckbox && (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', width: '3.1875rem', flexShrink: 0 }}>
                            <Checkbox checked={true} color={primary} />
                          </div>
                        )}
                        {columns.map((col, ci) => (
                          <div key={col.id} style={{
                            padding: '1rem',
                            flexShrink: ci < columns.length - 1 ? 0 : undefined,
                            flex: ci === columns.length - 1 ? '1 0 0' : undefined,
                            width: col.width || 'auto', minWidth: 0,
                            textAlign: col.align || 'left',
                          }}>
                            <span style={{ fontFamily: bf, fontSize: 'var(--site-font-body-sm)', color: 'black' }}>
                              {sr.cells?.[col.id] || ''}
                            </span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// Variant: NUMÉRICA
// ════════════════════════════════════════════════════════════
function TableNumerica({ config, theme, tf, bf }) {
  const { columns = [], rows = [], showTotals } = config;
  const primary = theme?.primary || '#2677c4';

  // Compute totals for numeric columns
  const totals = {};
  if (showTotals) {
    columns.forEach(col => {
      if (col.type === 'number') {
        totals[col.id] = rows.reduce((sum, row) => {
          const val = parseFloat(row.cells?.[col.id]) || 0;
          return sum + val;
        }, 0);
      }
    });
  }

  return (
    <div style={{ width: '100%', border: '0.0625rem solid #e3edf7', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', background: primary, width: '100%' }}>
        {columns.map((col, ci) => (
          <div key={col.id} style={{
            display: 'flex', alignItems: 'center', gap: '0.625rem',
            padding: '1rem',
            width: ci === 0 ? (col.width || '15.625rem') : undefined,
            flex: ci > 0 ? '1 0 0' : undefined,
            flexShrink: ci === 0 ? 0 : undefined,
            minWidth: 0,
            justifyContent: col.align === 'right' ? 'flex-end' : 'flex-start',
          }}>
            {ci === 0 && col.sortable && <SortIcon />}
            <span style={{
              fontFamily: tf, fontSize: 'var(--site-font-body-sm)', fontWeight: 700, color: 'white',
              textAlign: col.align || 'left',
              flex: '1 0 0', minWidth: 0,
            }}>
              {col.header}
            </span>
          </div>
        ))}
      </div>

      {/* Data rows */}
      {rows.map((row, ri) => (
        <div key={row.id} style={{
          display: 'flex', alignItems: 'center', background: 'white',
          borderBottom: '0.0625rem solid #e3edf7', width: '100%',
        }}>
          {columns.map((col, ci) => (
            <div key={col.id} style={{
              padding: '1rem',
              width: ci === 0 ? (col.width || '15.625rem') : undefined,
              flex: ci > 0 ? '1 0 0' : undefined,
              flexShrink: ci === 0 ? 0 : undefined,
              minWidth: 0,
              textAlign: col.align || 'left',
              display: 'flex', alignItems: 'center',
              justifyContent: col.align === 'right' ? 'flex-end' : 'flex-start',
            }}>
              <span style={{ fontFamily: bf, fontSize: 'var(--site-font-body-sm)', color: 'black', flex: '1 0 0', minWidth: 0, textAlign: col.align || 'left' }}>
                {row.cells?.[col.id] || ''}
              </span>
            </div>
          ))}
        </div>
      ))}

      {/* Totals row */}
      {showTotals && (
        <div style={{
          display: 'flex', alignItems: 'center', background: '#f4f4f4',
          borderBottom: '0.0625rem solid #e3edf7', width: '100%',
        }}>
          {columns.map((col, ci) => (
            <div key={col.id} style={{
              padding: '1rem',
              width: ci === 0 ? (col.width || '15.625rem') : undefined,
              flex: ci > 0 ? '1 0 0' : undefined,
              flexShrink: ci === 0 ? 0 : undefined,
              minWidth: 0,
              textAlign: col.align || 'left',
              display: 'flex', alignItems: 'center',
              justifyContent: col.align === 'right' ? 'flex-end' : 'flex-start',
            }}>
              <span style={{ fontFamily: bf, fontSize: 'var(--site-font-body-sm)', color: 'black', flex: '1 0 0', minWidth: 0, textAlign: col.align || 'left' }}>
                {ci === 0 ? 'Total' : (col.type === 'number' ? (totals[col.id]?.toLocaleString('es-CO') || '') : '')}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// Variant: SIMPLE
// ════════════════════════════════════════════════════════════
function TableSimple({ config, theme, tf, bf }) {
  const { columns = [], rows = [], showCheckbox } = config;
  const primary = theme?.primary || '#2677c4';

  return (
    <div style={{ width: '100%', border: '0.0625rem solid #e3edf7', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', background: primary, width: '100%' }}>
        {showCheckbox && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', width: '3.1875rem', flexShrink: 0 }}>
            <Checkbox checked={false} color="white" />
          </div>
        )}
        {columns.map((col, ci) => (
          <div key={col.id} style={{
            display: 'flex', alignItems: 'center', gap: '0.625rem',
            padding: '1rem',
            flexShrink: ci < columns.length - 1 ? 0 : undefined,
            flex: ci === columns.length - 1 ? '1 0 0' : undefined,
            width: col.width || 'auto', minWidth: 0,
            justifyContent: col.align === 'right' ? 'flex-end' : 'flex-start',
          }}>
            {col.sortable && <SortIcon />}
            <span style={{ fontFamily: tf, fontSize: 'var(--site-font-body-sm)', fontWeight: 700, color: 'white' }}>
              {col.header}
            </span>
          </div>
        ))}
      </div>

      {/* Rows */}
      {rows.map((row, ri) => (
        <div key={row.id} style={{
          display: 'flex', alignItems: 'center',
          background: ri % 2 === 0 ? '#e3edf7' : 'white',
          borderBottom: '0.0625rem solid #e3edf7', width: '100%',
        }}>
          {showCheckbox && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', width: '3.1875rem', flexShrink: 0 }}>
              <Checkbox checked={false} color={primary} />
            </div>
          )}
          {columns.map((col, ci) => (
            <div key={col.id} style={{
              padding: '1rem',
              flexShrink: ci < columns.length - 1 ? 0 : undefined,
              flex: ci === columns.length - 1 ? '1 0 0' : undefined,
              width: col.width || 'auto', minWidth: 0,
              textAlign: col.align || 'left',
              display: 'flex', alignItems: 'center',
              justifyContent: col.align === 'right' ? 'flex-end' : 'flex-start',
            }}>
              <span style={{ fontFamily: bf, fontSize: 'var(--site-font-body-sm)', color: 'black', lineHeight: 'var(--site-line-body)' }}>
                {row.cells?.[col.id] || ''}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// MAIN EXPORT
// ════════════════════════════════════════════════════════════
export function SectionTable({ config = {}, theme, fullWidth = false }) {
  const variant = config.variant ?? 'simple';
  const sectionTitle = config.title;
  const sectionSubtitle = config.subtitle;

  const tf = theme?.fontTitles ? `'${theme.fontTitles}', sans-serif` : "'Nunito Sans', sans-serif";
  const bf = theme?.fontBody ? `'${theme.fontBody}', sans-serif` : "'Nunito Sans', sans-serif";
  const titleAlign = config.titleAlign || 'left';

  // When fullWidth (inside a template), skip centering + 70% wrapper
  if (fullWidth) {
    return (
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
        {variant === 'expandible' && <TableExpandible config={config} theme={theme} tf={tf} bf={bf} />}
        {variant === 'numerica' && <TableNumerica config={config} theme={theme} tf={tf} bf={bf} />}
        {variant === 'simple' && <TableSimple config={config} theme={theme} tf={tf} bf={bf} />}
      </div>
    );
  }

  const responsiveStyles = `
    .section-table { --table-title-size: var(--site-font-section-title); --table-padding: 3.75rem 0; }
    .section-table-wrapper { width: 70%; }
    @media (max-width: 1024px) {
      .section-table { --table-padding: 3.25rem 2rem; }
      .section-table-wrapper { width: 100%; max-width: 64rem; }
    }
    @media (max-width: 768px) {
      .section-table { --table-padding: 2.75rem 24px; }
      .section-table-wrapper { width: 100%; max-width: none; }
    }
  `;

  return (
    <div className="section-table" style={{
      width: '100%', background: 'white',
      padding: 'var(--table-padding)', display: 'flex', flexDirection: 'column',
      alignItems: 'center', gap: '1.5rem', boxSizing: 'border-box',
    }}>
      <style>{responsiveStyles}</style>

      {/* Title + Subtitle */}
      {(sectionTitle || sectionSubtitle) && (
        <div className="section-table-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: titleAlign }}>
          {sectionTitle && (
            <p style={{
              fontFamily: tf, fontSize: 'var(--table-title-size)', fontWeight: 700,
              color: 'black', margin: 0, lineHeight: 'var(--site-line-title)',
            }}>
              {sectionTitle}
            </p>
          )}
          {sectionSubtitle && (
            <p style={{
              fontFamily: bf, fontSize: 'var(--site-font-body)', fontWeight: 400,
              color: '#4c4c4c', margin: 0, lineHeight: 'var(--site-line-body)',
            }}>
              {sectionSubtitle}
            </p>
          )}
        </div>
      )}

      {/* Table content */}
      <div className="section-table-wrapper">
        {variant === 'expandible' && <TableExpandible config={config} theme={theme} tf={tf} bf={bf} />}
        {variant === 'numerica' && <TableNumerica config={config} theme={theme} tf={tf} bf={bf} />}
        {variant === 'simple' && <TableSimple config={config} theme={theme} tf={tf} bf={bf} />}
      </div>
    </div>
  );
}

