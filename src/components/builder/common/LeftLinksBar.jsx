'use client';
import React, { useState } from 'react';
import { GOV_ICONS } from '../GovIcons';
import { FaLink } from 'react-icons/fa';

/**
 * LeftLinksBar — Lives INSIDE the website (GovWebPreview), NOT the editor UI.
 * Mirror of AccessibilityBar, but for custom links only.
 */
export function LeftLinksBar({ data = {}, themeColor = '#004cb0', readOnly = false }) {
  const [hoveredId, setHoveredId] = useState(null);
  const activeId = hoveredId;

  if (!data || data.enabled === false) return null;

  // ── Items ──
  const items = (data.customItems || []).map(item => {
    const iconData = GOV_ICONS[item.icon];
    return {
      id: item.id,
      label: item.label,
      icon: iconData ? iconData.icon : GOV_ICONS['link']?.icon || FaLink,
      onClick: () => {
        if (item.url && item.target === 'external') window.open(item.url, '_blank');
      },
    };
  });

  if (items.length === 0) return null;

  const outerPosition = readOnly
    ? { position: 'fixed', left: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 9999 }
    : { position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 100 };

  const HOVER_BG = '#2677c4';
  const ICON_SIZE = 'var(--floating-bar-icon-size)';
  const ICON_INNER = 'var(--floating-bar-icon-inner)';
  const COL_PAD_X = 'var(--floating-bar-pad-x)';
  const COL_PAD_Y = 'var(--floating-bar-pad-y)';
  const COL_WRAP_Y = 'var(--floating-bar-wrap-y)';

  return (
    <>
      <style>{`
        .floating-left-links-bar {
          --floating-bar-icon-size: 40px;
          --floating-bar-icon-inner: 22px;
          --floating-bar-pad-x: 8px;
          --floating-bar-pad-y: 6px;
          --floating-bar-wrap-y: 8px;
        }

        @media (max-width: 1024px) {
          .floating-left-links-bar {
            --floating-bar-icon-size: 36px;
            --floating-bar-icon-inner: 20px;
            --floating-bar-pad-x: 6px;
            --floating-bar-pad-y: 5px;
            --floating-bar-wrap-y: 6px;
          }
        }

        @media (max-width: 768px) {
          .floating-left-links-bar {
            left: 1rem !important;
            bottom: 1rem !important;
            top: auto !important;
            transform: none !important;
            max-width: calc(50vw - 1.5rem);
          }
          .floating-left-links-column {
            flex-direction: row !important;
            border-radius: 0.75rem !important;
            box-shadow: 0 0.5rem 1.5rem rgba(0,0,0,0.18);
            overflow-x: auto !important;
            overflow-y: visible !important;
            max-width: 100%;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }
          .floating-left-links-column::-webkit-scrollbar { display: none; }
          .floating-left-links-item { border-radius: 0.5rem !important; }
          .floating-left-links-label {
            left: 0 !important;
            right: auto !important;
            top: auto !important;
            bottom: calc(100% + 0.375rem) !important;
            border-radius: 0.5rem !important;
            max-width: min(12rem, 72vw) !important;
            min-height: 2rem;
          }
        }
      `}</style>
      <div className="floating-left-links-bar" style={{ ...outerPosition }}>
      {/* The fixed-width dark blue column */}
      <div className="floating-left-links-column" style={{
        background: themeColor,
        borderRadius: '0 0.25rem 0.25rem 0',
        paddingTop: COL_WRAP_Y,
        paddingBottom: COL_WRAP_Y,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        overflow: 'visible',  // labels pop out to the right without clipping
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
              className="floating-left-links-item"
              style={{
                position: 'relative',
                background: isHovered ? HOVER_BG : 'transparent',
                padding: `${COL_PAD_Y} ${COL_PAD_X}`,
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                transition: 'background 0.2s ease',
                borderRadius: isHovered ? '0 0.25rem 0.25rem 0' : 0,
                border: 'none',
              }}
            >
              {/* ── Label — absolutely to the RIGHT of the column ── */}
              <div className="floating-left-links-label" style={{
                position: 'absolute',
                left: `calc(100% - ${COL_PAD_X})`, // flush with item right edge
                top: 0,
                bottom: 0,
                background: HOVER_BG,
                borderRadius: '0 0.25rem 0.25rem 0',
                display: 'flex',
                alignItems: 'center',
                paddingRight: '0.75rem',
                paddingLeft: '0.625rem',
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
                <IconComp size={ICON_INNER} color={themeColor} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
    </>
  );
}
