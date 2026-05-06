'use client';
import React, { useState } from 'react';
import { GOV_ICONS } from '../GovIcons';
import { FaAdjust } from 'react-icons/fa';
import { MaskIcon } from '../MaskIcon';
const aZoom = '/builder-icons/AZoom.svg';
const aZoomPlus = '/builder-icons/AzoomPlus.svg';

/**
 * AccessibilityBar — Lives INSIDE the website (GovWebPreview), NOT the editor UI.
 *
 * Layout (matches Figma 637:24140):
 *   - Fixed-width dark blue column (always visible, right edge)
 *   - Each item: 40×40px white icon box, centered in the column
 *   - On hover: item row turns havelock-blue (#2677c4), label extends
 *     OUTSIDE the column to the LEFT via position:absolute — does NOT
 *     affect the width of the dark blue column or any other items
 *   - Label: Nunito Sans 14px white
 */
export function AccessibilityBar({ data = {}, themeColor = '#004cb0', readOnly = false }) {
  const [hoveredId, setHoveredId] = useState(null);
  const activeId = hoveredId;
  const [highContrast, setHighContrast] = useState(false);
  const [fontScale, setFontScale] = useState(0);

  if (!data || data.enabled === false) return null;

  // ── Contrast — targets data-gov-content wrapper (NOT data-gov-preview)
  // so the CSS filter stacking context never breaks the bar's positioning ——
  const handleContrast = () => {
    setHighContrast(prev => !prev);
    const content = document.querySelector('[data-gov-content]');
    if (content) content.classList.toggle('a11y-high-contrast');
  };

  // ── Font scale ──
  // Scales document.documentElement font-size — all rem values in the page derive from this,
  // so this is the only reliable way to uniformly scale text regardless of how components
  // specify their font sizes.
  const applyFontScale = (scale) => {
    const html = document.documentElement;

    // Store the original browser font-size on first use so we can return to it on reset
    if (!html.dataset.a11yOriginalFontSize) {
      html.dataset.a11yOriginalFontSize = getComputedStyle(html).fontSize;
    }

    if (scale === 0) {
      // Restore original — remove the override
      html.style.removeProperty('font-size');
    } else {
      const originalPx = parseFloat(html.dataset.a11yOriginalFontSize) || 16;
      const multiplier = 1 + scale * 0.125; // ±12.5% per step
      html.style.fontSize = `${(originalPx * multiplier).toFixed(2)}px`;
    }
  };

  const handleFontUp = () => setFontScale(prev => {
    const next = Math.min(prev + 1, 3); applyFontScale(next); return next;
  });
  const handleFontDown = () => setFontScale(prev => {
    const next = Math.max(prev - 1, -2); applyFontScale(next); return next;
  });

  // ── Items ──
  const items = [
    {
      id: '_contrast',
      label: highContrast ? 'Contraste activo' : 'Contraste',
      icon: FaAdjust,
      onClick: handleContrast,
      active: highContrast,
    },
    {
      id: '_font-up',
      label: `Aumentar letra${fontScale > 0 ? ` (+${fontScale})` : ''}`,
      icon: (props) => <MaskIcon icon={aZoomPlus} {...props} />,
      onClick: handleFontUp,
    },
    {
      id: '_font-down',
      label: `Reducir letra${fontScale < 0 ? ` (${fontScale})` : ''}`,
      icon: (props) => <MaskIcon icon={aZoom} {...props} />,
      onClick: handleFontDown,
    },
    ...(data.customItems || []).map(item => {
      const iconData = GOV_ICONS[item.icon];
      return {
        id: item.id,
        label: item.label,
        icon: iconData ? iconData.icon : GOV_ICONS['link']?.icon || FaAdjust,
        onClick: () => {
          if (item.url && item.target === 'external') window.open(item.url, '_blank');
        },
      };
    }),
  ];

  const outerPosition = readOnly
    ? { position: 'fixed', right: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 9999 }
    : { position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 100 };

  const HOVER_BG = '#2677c4';
  const ICON_SIZE = 'var(--floating-bar-icon-size)';
  const ICON_INNER = 'var(--floating-bar-icon-inner)';
  const COL_PAD_X = 'var(--floating-bar-pad-x)';
  const COL_PAD_Y = 'var(--floating-bar-pad-y)';
  const COL_WRAP_Y = 'var(--floating-bar-wrap-y)';

  return (
    <>
      <style>{`
        .floating-accessibility-bar {
          --floating-bar-icon-size: 40px;
          --floating-bar-icon-inner: 22px;
          --floating-bar-pad-x: 8px;
          --floating-bar-pad-y: 6px;
          --floating-bar-wrap-y: 8px;
        }

        /* Contrast filter applies ONLY to page content, not the accessibility bar */
        [data-gov-content].a11y-high-contrast {
          filter: invert(1) hue-rotate(180deg);
        }
        [data-gov-content].a11y-high-contrast img,
        [data-gov-content].a11y-high-contrast video {
          filter: invert(1) hue-rotate(180deg);
        }

        @media (max-width: 1024px) {
          .floating-accessibility-bar {
            --floating-bar-icon-size: 36px;
            --floating-bar-icon-inner: 20px;
            --floating-bar-pad-x: 6px;
            --floating-bar-pad-y: 5px;
            --floating-bar-wrap-y: 6px;
          }
        }

        @media (max-width: 768px) {
          .floating-accessibility-bar {
            right: 1rem !important;
            bottom: 1rem !important;
            top: auto !important;
            transform: none !important;
            max-width: calc(50vw - 1.5rem);
          }
          .floating-accessibility-column {
            flex-direction: row !important;
            border-radius: 0.75rem !important;
            box-shadow: 0 0.5rem 1.5rem rgba(0,0,0,0.18);
            overflow-x: auto !important;
            overflow-y: visible !important;
            max-width: 100%;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }
          .floating-accessibility-column::-webkit-scrollbar { display: none; }
          .floating-accessibility-item { border-radius: 0.5rem !important; }
          .floating-accessibility-label {
            right: 0 !important;
            left: auto !important;
            top: auto !important;
            bottom: calc(100% + 0.375rem) !important;
            border-radius: 0.5rem !important;
            max-width: min(12rem, 72vw) !important;
            min-height: 2rem;
          }
        }
      `}</style>

      {/* Outer wrapper — just for positioning, transparent */}
      <div className="floating-accessibility-bar" style={{ ...outerPosition }}>
        {/* The fixed-width dark blue column */}
        <div className="floating-accessibility-column" style={{
          background: themeColor,
          borderRadius: '0.25rem 0 0 0.25rem',
          paddingTop: COL_WRAP_Y,
          paddingBottom: COL_WRAP_Y,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          overflow: 'visible',  // labels pop out to the left without clipping
          position: 'relative',
        }}>
          {items.map((item) => {
            const isHovered = activeId === item.id;
            const IconComp = item.icon;

            return (
              <button
                key={item.id}
                type="button"
                aria-label={item.label}
                title={item.label}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                onFocus={() => setHoveredId(item.id)}
                onBlur={() => setHoveredId(null)}
                onClick={item.onClick}
                className="floating-accessibility-item"
                style={{
                  position: 'relative',
                  background: isHovered
                    ? HOVER_BG
                    : item.active
                      ? 'rgba(0,0,0,0.25)'
                      : 'transparent',
                  padding: `${COL_PAD_Y} ${COL_PAD_X}`,
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  transition: 'background 0.2s ease',
                  borderRadius: isHovered ? '0.25rem 0 0 0.25rem' : 0,
                  border: 'none',
                }}
              >
                {/* ── Label — absolutely to the LEFT of the column ── */}
                <div className="floating-accessibility-label" style={{
                  position: 'absolute',
                  right: `calc(100% - ${COL_PAD_X})`, // flush with item left edge
                  top: 0,
                  bottom: 0,
                  background: HOVER_BG,
                  borderRadius: '0.25rem 0 0 0.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: '0.75rem',
                  paddingRight: '0.625rem',
                  // animate in/out
                  maxWidth: isHovered ? '14rem' : 0,
                  overflow: 'hidden',
                  opacity: isHovered ? 1 : 0,
                  transition: 'max-width 0.25s ease, opacity 0.2s ease',
                  pointerEvents: 'none',
                  whiteSpace: 'nowrap',
                }}>
                  <span style={{
                    fontFamily: "'Nunito Sans', sans-serif",
                    fontWeight: 400,
                    fontSize: '0.875rem',   // 14px
                    color: 'white',
                    whiteSpace: 'nowrap',
                  }}>
                    {item.label}
                  </span>
                </div>

                {/* ── Icon box: 40×40 white rounded ── */}
                <div style={{
                  width: ICON_SIZE,
                  height: ICON_SIZE,
                  background: 'white',
                  borderRadius: '0.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <IconComp size={ICON_INNER} color={item.active ? '#1a3a6b' : themeColor} />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
