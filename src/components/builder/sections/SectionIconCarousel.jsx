import React, { useState, useRef, useEffect } from 'react';
import { GOV_ICONS } from '../GovIcons';
import { NavArrow, CarouselDots } from './SharedPrimitives';

/**
 * SectionIconCarousel — Responsive Icon + Text carousel section.
 *
 * Breakpoints (based on rendered container width):
 *   xs  < 480px  → 2 cols per page, full width, icon 2.5rem
 *   sm  < 640px  → 2 cols per page, 95% width,  icon 3rem
 *   md  < 900px  → 3 cols per page, 90% width,  icon 3.25rem
 *   lg  < 1200px → 4 cols per page, 80% width,  icon 3.5rem
 *   xl  ≥ 1200px → 5 cols per page, 70% width,  icon 3.75rem
 */
export function SectionIconCarousel({ config = {}, theme, onPageChange }) {
  const tf = theme?.fontTitles ? `'${theme.fontTitles}', sans-serif` : "'Nunito Sans', sans-serif";

  const showTitle = config.showTitle !== false;
  const title     = config.title     || 'Titulo';
  const items     = config.items     || [];
  const iconColor = config.iconColor || theme?.primary || '#003DA6';
  const textColor = config.textColor || '#000000';
  const bgColor   = config.bgColor   || '#ffffff';
  const bgImage   = config.bgImage   || '';
  const itemImageSize = Number(config.itemImageSize) || 100;
  const itemImageFit = config.itemImageFit || 'contain';
  const itemImageRadius = config.itemImageRadius || 'soft';

  // ── Responsive state ──────────────────────────────────────────────────────
  const containerRef = useRef(null);
  const [cw, setCw] = useState(1200); // container width in px

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setCw(entry.contentRect.width);
    });
    ro.observe(el);
    setCw(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, []);

  // Derive responsive values from container width
  const isMobile  = cw < 480;
  const isSmall   = cw < 640;
  const isMedium  = cw < 900;
  const isLarge   = cw < 1200;

  const ITEMS_PER_PAGE = isMobile || isSmall ? 4 : isMedium ? 3 : isLarge ? 4 : 5;
  const COLS_PER_ROW   = isMobile || isSmall ? 2 : isMedium ? 3 : isLarge ? 4 : 5;
  const innerWidth     = isMobile ? '100%' : isSmall ? '95%' : isMedium ? '90%' : isLarge ? '80%' : '70%';
  const iconSize       = isMobile ? '2.5rem' : isSmall ? '3rem' : isMedium ? '3.25rem' : isLarge ? '3.5rem' : '3.75rem';
  const iconPx         = isMobile ? 32 : isSmall ? 36 : isMedium ? 40 : isLarge ? 44 : 48;
  const titleSize      = 'var(--site-font-section-title)';
  const labelSize      = 'var(--site-font-body)';
  const vPad           = isMobile ? '2.5rem 0' : isSmall ? '3rem 0' : '5rem 0';
  const cardGap        = isMobile ? '0.75rem' : '1.625rem';
  const maxImageSize = isMobile ? 128 : isSmall ? 140 : 160;
  const customImageSize = `${Math.max(100, Math.min(itemImageSize, maxImageSize))}px`;
  const customImageRadius = {
    square: '0',
    soft: '0.75rem',
    rounded: '1.5rem',
    circle: '999px',
  }[itemImageRadius] || '0.75rem';

  // ── Carousel state ────────────────────────────────────────────────────────
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages    = Math.ceil(items.length / ITEMS_PER_PAGE);
  const needsCarousel = items.length > ITEMS_PER_PAGE;
  const startIdx      = currentPage * ITEMS_PER_PAGE;
  const visibleItems  = items.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  // Reset page if breakpoint changes ITEMS_PER_PAGE
  const prevItemsPerPage = useRef(ITEMS_PER_PAGE);
  useEffect(() => {
    if (prevItemsPerPage.current !== ITEMS_PER_PAGE) {
      setCurrentPage(0);
      prevItemsPerPage.current = ITEMS_PER_PAGE;
    }
  }, [ITEMS_PER_PAGE]);

  const goLeft  = () => setCurrentPage(p => (p - 1 + totalPages) % totalPages);
  const goRight = () => setCurrentPage(p => (p + 1) % totalPages);

  // ── Background ────────────────────────────────────────────────────────────
  const bgStyle = bgImage
    ? { backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }
    : { background: bgColor };

  // ── Icon renderer ─────────────────────────────────────────────────────────
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

  // ── On mobile/small: use a CSS grid (wraps to 2 cols) ────────────────────
  const useGrid = isMobile || isSmall;

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
      {/* Inner width container */}
      <div style={{ width: innerWidth, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>

        {/* Title */}
        {showTitle && (
          <p style={{ fontFamily: tf, fontWeight: 700, fontSize: titleSize, color: textColor, textAlign: 'center', margin: 0, width: '100%', lineHeight: 'var(--site-line-title)' }}>
            {title}
          </p>
        )}

        {/* ── Carousel row ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%' }}>
          {needsCarousel && !useGrid && <NavArrow onClick={goLeft} direction="left" />}

          {/* Cards area — grid on mobile, flex row on wider */}
          {useGrid ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${COLS_PER_ROW}, 1fr)`,
              gap: '0.5rem',
              width: '100%',
            }}>
              {visibleItems.map((item, i) => (
                <ItemCard
                  key={item.id || i}
                  item={item}
                  iconEl={renderIcon(item)}
                  tf={tf}
                  textColor={textColor}
                  cardGap={cardGap}
                  labelSize={labelSize}
                  onClick={() => handleItemClick(item)}
                />
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flex: '1 0 0', alignItems: 'flex-start', justifyContent: 'space-between', minWidth: 0 }}>
              {visibleItems.map((item, i) => (
                <ItemCard
                  key={item.id || i}
                  item={item}
                  iconEl={renderIcon(item)}
                  tf={tf}
                  textColor={textColor}
                  cardGap={cardGap}
                  labelSize={labelSize}
                  flex="1 0 0"
                  onClick={() => handleItemClick(item)}
                />
              ))}
            </div>
          )}

          {needsCarousel && !useGrid && <NavArrow onClick={goRight} direction="right" />}
        </div>

        {/* Mobile carousel nav */}
        {needsCarousel && useGrid && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <NavArrow onClick={goLeft} direction="left" />
            <CarouselDots total={totalPages} current={currentPage} onSelect={setCurrentPage} />
            <NavArrow onClick={goRight} direction="right" />
          </div>
        )}

        {/* Desktop dots */}
        {needsCarousel && !useGrid && (
          <CarouselDots total={totalPages} current={currentPage} onSelect={setCurrentPage} />
        )}
      </div>
    </div>
  );
}

/** Small extracted card to avoid repetition in both grid & flex branches */
function ItemCard({ item, iconEl, tf, textColor, cardGap, labelSize, flex, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: cardGap,
        padding: '1rem 0.5rem',
        flex: flex || undefined,
        minWidth: 0,
        cursor: (item.url || item.pageId) ? 'pointer' : 'default',
      }}
    >
      {iconEl}
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
  );
}
