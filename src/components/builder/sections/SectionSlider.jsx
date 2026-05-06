import React, { useState, useEffect, useRef } from 'react';
import { NavArrow, CarouselDots, PauseButton } from './SharedPrimitives';
import { GOV_ICONS } from '../GovIcons';

/**
 * SECTION SLIDER — variants: Hero, Complex
 */
export function SectionSlider({ config = {}, theme, isPreview = false }) {
  const rawVariant = config.variant || 'Hero';
  const variant = rawVariant === 'Complex' ? 'Complex' : 'Hero';
  const SLIDES = config.slides || [
    { title: 'Título', subtitle: 'Descripción', bg: '#005384', img: '' }
  ];

  const tf = theme?.fontTitles ? `'${theme.fontTitles}', sans-serif` : "'Nunito Sans', sans-serif";
  const bf = theme?.fontBody ? `'${theme.fontBody}', sans-serif` : "'Nunito Sans', sans-serif";

  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef(null);
  const [cw, setCw] = useState(1200);
  const autoplay = config.autoplay !== false;
  const intervalMs = Number(config.intervalMs) || 5000;
  const showArrows = config.showArrows !== false;
  const showDots = config.showDots !== false;
  const showPause = config.showPause !== false;

  useEffect(() => {
    if (!autoplay || isPaused || isPreview) return;
    const t = setInterval(() => setCurrent(c => (c + 1) % SLIDES.length), intervalMs);
    return () => clearInterval(t);
  }, [autoplay, intervalMs, isPaused, SLIDES.length, isPreview]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setCw(entry.contentRect.width));
    ro.observe(el);
    setCw(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, [variant]);

  const prev = () => setCurrent(c => (c - 1 + SLIDES.length) % SLIDES.length);
  const next = () => setCurrent(c => (c + 1) % SLIDES.length);

  const slide = SLIDES[current] || SLIDES[0];
  const isMobile = cw < 640;
  const isTablet = cw < 900;
  const sliderHeight = isMobile ? (config.mobileHeight || '34rem') : isTablet ? (config.tabletHeight || '28rem') : (config.desktopHeight || '28.125rem');
  const titleSize = 'var(--site-font-hero-title)';
  const compactTitleSize = 'var(--site-font-section-title)';
  const subtitleSize = 'var(--site-font-hero-subtitle)';
  const sidePadding = isMobile ? '1.5rem' : isTablet ? '6rem' : '7rem';
  const controlsBottom = isMobile ? '1.25rem' : '1.5rem';
  const canShowSideArrows = showArrows && !isMobile && SLIDES.length > 1;
  const textAlign = config.textAlign || 'left';
  const textColor = config.textColor || '#ffffff';
  const overlayOpacity = typeof config.overlayOpacity === 'number' ? config.overlayOpacity : 0.9;
  const splitImageWidth = Math.min(70, Math.max(30, Number(config.splitImageWidth) || 60));
  const splitTextWidth = 100 - splitImageWidth;

  const renderBottomControls = () => {
    if (!showPause && !showDots) return null;
    return (
      <div style={{
        position: 'absolute',
        left: isMobile ? '1rem' : '1.5rem',
        right: isMobile ? '1rem' : '1.5rem',
        bottom: controlsBottom,
        zIndex: 5,
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr auto 1fr',
        alignItems: 'center',
        justifyItems: 'center',
        gap: '0.75rem',
        pointerEvents: 'none',
      }}>
        <div style={{ justifySelf: isMobile ? 'center' : 'start', pointerEvents: 'auto' }}>
          {showPause && <PauseButton isPaused={isPaused} onClick={() => setIsPaused(p => !p)} bf={bf} compact={isMobile} />}
        </div>
        <div style={{ pointerEvents: 'auto' }}>
          {showDots && <CarouselDots total={SLIDES.length} current={current} onSelect={setCurrent} compact={isMobile} />}
        </div>
        {!isMobile && <div />}
      </div>
    );
  };

  const renderSideArrows = () => {
    if (!canShowSideArrows) return null;
    return (
      <>
        <div style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', zIndex: 5 }}>
          <NavArrow onClick={prev} direction="left" />
        </div>
        <div style={{ position: 'absolute', right: '1.25rem', top: '50%', transform: 'translateY(-50%)', zIndex: 5 }}>
          <NavArrow onClick={next} direction="right" />
        </div>
      </>
    );
  };

  const renderButtonIcon = (button) => {
    if (!button?.showIcon || !button.icon) return null;
    const Icon = GOV_ICONS[button.icon]?.icon;
    return Icon ? <Icon size={16} color="currentColor" /> : null;
  };

  const renderSlideButtons = () => {
    const buttons = (slide.buttons || []).filter(button => button?.label).slice(0, 2);
    if (!buttons.length) return null;

    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: textAlign === 'center' ? 'center' : textAlign === 'right' ? 'flex-end' : 'flex-start' }}>
        {buttons.map((button, index) => {
          const styleType = button.style || (index === 0 ? 'primary' : 'secondary');
          const isPrimary = styleType === 'primary';
          const background = button.backgroundColor || (isPrimary ? (theme?.primary || '#0057B8') : 'transparent');
          const color = button.textColor || (isPrimary ? '#ffffff' : textColor);
          const borderColor = button.borderColor || (isPrimary ? background : 'rgba(255,255,255,0.72)');
          const content = (
            <>
              {renderButtonIcon(button)}
              <span>{button.label}</span>
            </>
          );

          const buttonStyle = {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            minHeight: '2.75rem',
            padding: '0.75rem 1.125rem',
            borderRadius: button.radius || '0.25rem',
            border: `0.0625rem solid ${borderColor}`,
            background,
            color,
            fontFamily: bf,
            fontSize: 'var(--site-font-body-sm)',
            fontWeight: 700,
            lineHeight: 1,
            textDecoration: 'none',
            cursor: button.url ? 'pointer' : 'default',
            boxShadow: isPrimary ? '0 0.5rem 1.25rem rgba(0,0,0,0.2)' : 'none',
            whiteSpace: 'nowrap',
          };

          return button.url ? (
            <a key={`${button.label}-${index}`} href={button.url} style={buttonStyle} onClick={event => event.stopPropagation()}>
              {content}
            </a>
          ) : (
            <span key={`${button.label}-${index}`} style={buttonStyle}>
              {content}
            </span>
          );
        })}
      </div>
    );
  };



  /* ── 1. Variant: Complex (Split Background) ── */
  if (variant === 'Complex') {
    return (
      <div ref={containerRef} style={{ width: '100%', minHeight: sliderHeight, display: 'flex', flexDirection: isMobile ? 'column' : 'row', position: 'relative', overflow: 'hidden' }}>
        {/* Left solid panel */}
        <div style={{
          flex: isMobile ? '0 0 auto' : `0 0 ${splitTextWidth}%`,
          background: slide.bg || theme?.primary || '#005384',
          display: 'flex', alignItems: 'center',
          padding: isMobile ? '3rem 1.5rem' : `2rem 3.75rem 2rem ${sidePadding}`,
          position: 'relative', zIndex: 1,
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '37.5rem', textAlign }}>
            <h2 style={{ fontFamily: tf, fontSize: compactTitleSize, fontWeight: 700, color: textColor, margin: 0, lineHeight: 'var(--site-line-title)' }}>
              {slide.title}
            </h2>
            <p style={{ fontFamily: bf, fontSize: subtitleSize, fontWeight: 400, color: textColor, margin: 0, lineHeight: 'var(--site-line-body)' }}>
              {slide.subtitle}
            </p>
            {renderSlideButtons()}
          </div>
        </div>
        
        {/* Right image area */}
        <div style={{ flex: 1, minHeight: isMobile ? '14rem' : 'auto', position: 'relative', background: '#cde8f5', overflow: 'hidden' }}>
          {slide.img ? (
            <img src={slide.img} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.2 }}>
              <svg width={100} height={100} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
            </div>
          )}
        </div>

        {renderSideArrows()}
        {renderBottomControls()}
      </div>
    );
  }

  /* ── 2. Variant: Hero (image or solid background with optional buttons) ── */
  return (
    <div ref={containerRef} style={{
      width: '100%', minHeight: sliderHeight,
      position: 'relative', overflow: 'hidden',
      background: slide.bg || theme?.primaryDark || '#1f2122',
      display: 'flex', alignItems: 'center',
    }}>
      {slide.img && (
        <img src={slide.img} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }} />
      )}
      <div style={{ position: 'absolute', inset: 0, background: `rgba(20,22,24,${overlayOpacity})`, zIndex: 1 }} />
      <div style={{
        position: 'relative', zIndex: 2,
        width: '100%',
        boxSizing: 'border-box',
        padding: isMobile ? '3.5rem 1.5rem' : `3rem ${sidePadding}`,
        display: 'flex',
        justifyContent: textAlign === 'center' ? 'center' : textAlign === 'right' ? 'flex-end' : 'flex-start',
      }}>
        <div style={{ maxWidth: '44rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign }}>
          <h2 style={{ fontFamily: tf, fontSize: titleSize, fontWeight: 700, color: textColor, margin: 0, lineHeight: 'var(--site-line-tight)', textShadow: '0 0.125rem 0.5rem rgba(0,0,0,0.45)' }}>
            {slide.title}
          </h2>
          <p style={{ fontFamily: bf, fontSize: subtitleSize, fontWeight: 400, color: textColor, margin: 0, lineHeight: 'var(--site-line-body)', textShadow: '0 0.125rem 0.5rem rgba(0,0,0,0.45)' }}>
            {slide.subtitle}
          </p>
          {renderSlideButtons()}
        </div>
      </div>

      {renderSideArrows()}
      {renderBottomControls()}
    </div>
  );
}
