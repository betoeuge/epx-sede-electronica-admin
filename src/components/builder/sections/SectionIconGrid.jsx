import React, { useState, useRef, useEffect } from 'react';
import { GOV_ICONS } from '../GovIcons';

/**
 * SectionIconGrid — Grid of icon+text items organized by tabs.
 *
 * Layout: max 5 items per row, wrapping to the next row if more.
 * Tabs let the user categorize items into groups.
 * Responsive via ResizeObserver (container-aware).
 */
export function SectionIconGrid({ config = {}, theme, onPageChange }) {
  const tf = theme?.fontTitles ? `'${theme.fontTitles}', sans-serif` : "'Nunito Sans', sans-serif";

  const showTitle    = config.showTitle !== false;
  const title        = config.title || 'Tramites y Servicios';
  const subtitle     = config.subtitle || '';
  const iconColor    = config.iconColor || theme?.primary || '#004cb0';
  const textColor    = config.textColor || '#000000';
  const bgColor      = config.bgColor || '#f5f5f5';
  const bgImage      = config.bgImage || '';
  const itemImageSize = Number(config.itemImageSize) || 100;
  const itemImageFit = config.itemImageFit || 'contain';
  const itemImageRadius = config.itemImageRadius || 'soft';
  const tabs         = config.tabs || [{ id: 'tab-1', label: 'Tab', items: [] }];

  // ── Responsive ──────────────────────────────────────────────────────────────
  const containerRef = useRef(null);
  const [cw, setCw] = useState(1200);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setCw(entry.contentRect.width));
    ro.observe(el);
    setCw(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, []);

  const isMobile = cw < 480;
  const isSmall  = cw < 640;
  const isMedium = cw < 900;
  const isLarge  = cw < 1200;

  const colsPerRow = isMobile ? 2 : isSmall ? 3 : isMedium ? 3 : isLarge ? 4 : 5;
  const innerWidth = isMobile ? '100%' : isSmall ? '95%' : isMedium ? '90%' : isLarge ? '80%' : '70%';
  const iconSize   = isMobile ? '2.25rem' : isSmall ? '2.5rem' : isMedium ? '3rem' : isLarge ? '3.25rem' : '3.75rem';
  const iconPx     = isMobile ? 28 : isSmall ? 32 : isMedium ? 40 : isLarge ? 44 : 60;
  const titleSize  = 'var(--site-font-section-title)';
  const subSize    = 'var(--site-font-body)';
  const labelSize  = 'var(--site-font-body)';
  const vPad       = isMobile ? '2rem 0' : isSmall ? '2.5rem 0' : '5rem 0';
  const cardGap    = isMobile ? '0.75rem' : '1.625rem';
  const tabPad     = isMobile ? '0.5rem 0.75rem' : '0.75rem 1rem';
  const maxImageSize = isMobile ? 128 : isSmall ? 140 : 160;
  const customImageSize = `${Math.max(100, Math.min(itemImageSize, maxImageSize))}px`;
  const customImageRadius = {
    square: '0',
    soft: '0.75rem',
    rounded: '1.5rem',
    circle: '999px',
  }[itemImageRadius] || '0.75rem';

  // ── Active tab ──────────────────────────────────────────────────────────────
  const [activeTabId, setActiveTabId] = useState(tabs[0]?.id || '');

  // Ensure active tab exists
  useEffect(() => {
    if (!tabs.find(t => t.id === activeTabId) && tabs.length > 0) {
      setActiveTabId(tabs[0].id);
    }
  }, [tabs, activeTabId]);

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0] || { items: [] };
  const items = activeTab.items || [];

  // ── Background ──────────────────────────────────────────────────────────────
  const bgStyle = bgImage
    ? { backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: bgColor };

  // ── Icon renderer ───────────────────────────────────────────────────────────
  const renderIcon = (item) => {
    if (item.customImage) {
      return (
        <div style={{ width: customImageSize, height: customImageSize, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, borderRadius: customImageRadius, overflow: 'hidden' }}>
          <img src={item.customImage} alt={item.label || ''} style={{ width: '100%', height: '100%', objectFit: itemImageFit, display: 'block' }} />
        </div>
      );
    }
    if (item.icon && GOV_ICONS[item.icon]) {
      const IconComp = GOV_ICONS[item.icon].icon;
      return (
        <div style={{ width: iconSize, height: iconSize, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <IconComp size={iconPx} color={iconColor} />
        </div>
      );
    }
    return (
      <div style={{ width: iconSize, height: iconSize, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, opacity: 0.3 }}>
        <svg width={iconPx * 0.8} height={iconPx * 0.8} viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth={1.5}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      </div>
    );
  };

  const handleItemClick = (item) => {
    if (item.target === 'external' && item.url) window.open(item.url, '_blank');
    else if (item.target === 'page' && item.pageId && onPageChange) onPageChange(item.pageId);
  };

  return (
    <div
      ref={containerRef}
      style={{
        ...bgStyle,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: vPad,
        gap: '2.5rem',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ width: innerWidth, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2.5rem' }}>

        {/* Title + subtitle */}
        {showTitle && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', textAlign: 'center', width: '100%' }}>
            <p style={{ fontFamily: tf, fontWeight: 700, fontSize: titleSize, color: textColor, margin: 0, lineHeight: 'var(--site-line-title)' }}>
              {title}
            </p>
            {subtitle && (
              <p style={{ fontFamily: tf, fontWeight: 600, fontSize: subSize, color: textColor, margin: 0, opacity: 0.8, lineHeight: 'var(--site-line-body)' }}>
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Tabs */}
        {tabs.length > 1 && (
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {tabs.map(tab => {
              const isActive = tab.id === activeTabId;
              return (
                <div
                  key={tab.id}
                  onClick={() => setActiveTabId(tab.id)}
                  style={{
                    backgroundColor: '#ffffff',
                    border: `0.0625rem solid ${iconColor}`,
                    borderRadius: '0.5rem',
                    padding: '0.125rem', // 2px padding
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    minWidth: isMobile ? '3.5rem' : '5rem',
                  }}
                >
                  <div
                    style={{
                      background: isActive ? iconColor : `${iconColor}1A`, // 1A is ~10% opacity
                      borderRadius: '0.5rem',
                      padding: tabPad,
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxSizing: 'border-box',
                      transition: 'all 0.2s',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: tf,
                        fontWeight: 700,
                        fontSize: 'var(--site-font-nav)',
                        color: isActive ? '#ffffff' : iconColor,
                        textAlign: 'center',
                        lineHeight: 'var(--site-line-title)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {tab.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Items grid */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: items.length < colsPerRow ? 'center' : 'flex-start',
          gap: '2rem 0',
          width: '100%',
          maxWidth: '77.5rem',
        }}>
          {items.map((item, i) => (
            <div
              key={item.id || i}
              onClick={() => handleItemClick(item)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: cardGap,
                padding: '1rem 0.5rem',
                width: `${100 / colsPerRow}%`,
                boxSizing: 'border-box',
                cursor: (item.url || item.pageId) ? 'pointer' : 'default',
              }}
            >
              {renderIcon(item)}
              {item.showLabel !== false && item.label && (
                <p style={{
                  fontFamily: tf,
                  fontWeight: 700,
                  fontSize: labelSize,
                  color: textColor,
                  textAlign: 'center',
                  margin: 0,
                  lineHeight: 'var(--site-line-title)',
                  width: '100%',
                  wordBreak: 'break-word',
                }}>
                  {item.label}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Empty state */}
        {items.length === 0 && (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#999', fontFamily: tf, fontSize: 'var(--site-font-body-sm)', lineHeight: 'var(--site-line-body)' }}>
            No hay items en este tab. Agrega items desde el editor.
          </div>
        )}
      </div>
    </div>
  );
}
