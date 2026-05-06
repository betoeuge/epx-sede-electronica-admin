'use client';
import { useState, useEffect, useRef } from 'react';
import { InlineEdit } from './InlineEdit';
import { SECTION_REGISTRY } from './sectionRegistry';
import { DEFAULT_FOOTER_DATA } from './editorConstants';
import { NewsPageTemplate } from './sections/NewsPageTemplate';
import { AccessibilityBar } from './common/AccessibilityBar';
import { LeftLinksBar } from './common/LeftLinksBar';
import { MaskIcon } from './MaskIcon';

const templatePreview1 = '/template-preview-1.png';
const templatePreview2 = '/template-preview-2.png';
const templatePreview3 = '/template-preview-3.png';
const facebookIcon = '/builder-icons/facebook-f.svg';
const twitterIcon = '/builder-icons/twitter-x.svg';
const instagramIcon = '/builder-icons/instagram.svg';
const youtubeIcon = '/builder-icons/youtube.svg';
const linkedinIcon = '/builder-icons/linkedin.svg';
const tiktokIcon = '/builder-icons/tiktok.svg';


// Default theme (same as Ambiente preset)
const DEFAULT_THEME = {
  primary: '#003DA6',
  primaryDark: '#002D7C',
  accent: '#F5A623',
  navBg: '#f4f4f4',

  navBorder: '#ffa741',
  heroLeft: '#005384',
  fontTitles: 'Nunito Sans',
  fontBody: 'Verdana',
};

const NAV_COMPACT_THRESHOLD = 7;

// News card component
function NewsVerticalCard({ img, theme }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start', width: '100%', flexShrink: 0 }}>
      <div style={{ width: '100%', height: '13.75rem', borderRadius: '0.75rem', overflow: 'hidden', background: '#ccc', flexShrink: 0 }}>
        <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
        <p style={{ fontFamily: `'${theme.fontBody}', sans-serif`, fontSize: 'var(--site-font-caption)', color: '#333' }}>Mar 17 2026</p>
        <p style={{ fontFamily: `'${theme.fontBody}', sans-serif`, fontSize: 'var(--site-font-card-title)', fontWeight: 700, color: theme.primary, textDecoration: 'underline', lineHeight: 'var(--site-line-title)' }}>
          La Superintendencia Financiera de Colombia invita a los ciudadanos a consultar el Menú de transparencia y acceso a la información pública.
        </p>
        <p style={{ fontFamily: `'${theme.fontBody}', sans-serif`, fontSize: 'var(--site-font-caption)', color: '#333' }}>Nacional</p>
      </div>
    </div>
  );
}

function NewsHorizontalCard({ img, theme }) {
  return (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', width: '100%', flexShrink: 0 }}>
      <div style={{ width: '12.5rem', height: '7.5rem', borderRadius: '0.625rem', overflow: 'hidden', background: '#ccc', flexShrink: 0 }}>
        <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', flex: 1, minWidth: 0 }}>
        <p style={{ fontFamily: `'${theme.fontBody}', sans-serif`, fontSize: 'var(--site-font-caption)', color: '#555' }}>Mar 17 2026</p>
        <p style={{ fontFamily: `'${theme.fontBody}', sans-serif`, fontSize: 'var(--site-font-body-sm)', fontWeight: 700, color: theme.primary, textDecoration: 'underline', lineHeight: 'var(--site-line-title)', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
          La Superintendencia Financiera de Colombia invita a los ciudadanos a consultar el Menú de transparencia.
        </p>
        <p style={{ fontFamily: `'${theme.fontBody}', sans-serif`, fontSize: 'var(--site-font-caption)', color: '#555' }}>Nacional</p>
      </div>
    </div>
  );
}

function OpportunityCard({ img, theme }) {
  return (
    <div style={{ flex: '1 1 0', minWidth: 0, border: '0.0625rem solid #ddd', borderRadius: '0.5rem', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ width: '100%', height: '11.25rem', background: '#e8e8e8', overflow: 'hidden', flexShrink: 0 }}>
        <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ padding: '1rem 1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
        <div style={{ display: 'inline-block', background: '#f4f4f4', borderRadius: '6.1875rem', padding: '0.25rem 0.75rem', fontSize: 'var(--site-font-caption)', fontFamily: `'${theme.fontBody}', sans-serif`, color: '#4c4c4c', width: 'fit-content' }}>Cerrada</div>
        <p style={{ fontFamily: `'${theme.fontBody}', sans-serif`, fontSize: 'var(--site-font-caption)', color: '#555', margin: 0 }}>Mar 17 2026</p>
        <p style={{ fontFamily: `'${theme.fontBody}', sans-serif`, fontSize: 'var(--site-font-body-sm)', fontWeight: 700, color: theme.primary, textDecoration: 'underline', lineHeight: 'var(--site-line-title)', margin: 0 }}>
          Convocatoria pública para modernización de servicios digitales.
        </p>
        <p style={{ fontFamily: `'${theme.fontBody}', sans-serif`, fontSize: 'var(--site-font-body-sm)', color: '#333', lineHeight: 'var(--site-line-body)', margin: 0 }}>
          El Ministerio de Tecnologías de la Información y las Comunicaciones lanza convocatoria para empresas y emprendedores.
        </p>
      </div>
    </div>
  );
}
function Breadcrumbs({ theme, items }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 0', fontSize: 'var(--site-font-caption)', fontFamily: `'${theme.fontBody}', sans-serif` }}>
      <span style={{ color: theme.primary, textDecoration: 'underline', cursor: 'pointer' }}>Inicio</span>
      {items.map((item, i) => (
        <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
          <span style={{ color: '#888' }}>&gt;</span>
          <span style={{ color: i === items.length - 1 ? '#333' : theme.primary, textDecoration: i === items.length - 1 ? 'none' : 'underline', cursor: 'pointer' }}>{item}</span>
        </span>
      ))}
    </div>
  );
}

function SidebarMenu({ theme }) {
  const items = [
    { label: 'Información general', icon: 'ℹ️' },
    { label: 'Requisitos y documentos', icon: '📄' },
    { label: 'Pasos para el trámite', icon: '🛤️' },
    { label: 'Pagos y costos', icon: '💰' },
    { label: 'Puntos de atención', icon: '📍' },
  ];
  return (
    <div style={{ width: '17.5rem', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '0.0625rem'}}>
      <div style={{ background: theme.primary, color: 'white', padding: '0.75rem 1.25rem', fontWeight: 700, fontSize: 'var(--site-font-body-sm)', fontFamily: `'${theme.fontTitles}', sans-serif` }}>
        EN ESTA SECCIÓN
      </div>
      {items.map((item, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1.25rem',
          background: i === 0 ? '#f0f4ff' : '#fff', borderBottom: '0.0625rem solid #eee',
          fontSize: 'var(--site-font-body-sm)', fontFamily: `'${theme.fontBody}', sans-serif`, color: i === 0 ? theme.primary : '#333',
          cursor: 'pointer', fontWeight: i === 0 ? 700 : 400
        }}>
          <span>{item.icon}</span>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function InfoTable({ theme, type = 'default' }) {
  const rows = [
    ['Concepto', 'Descripción', 'Valor'],
    ['Trámite A', 'Solicitud inicial de documentos', '$50.000'],
    ['Trámite B', 'Renovación de licencia anual', '$120.000'],
    ['Trámite C', 'Certificado de antecedentes', 'Gratis'],
  ];

  const headerBg = type === 'numeric' ? '#f8f9fa' : theme.primary;
  const headerText = type === 'numeric' ? '#333' : 'white';

  return (
    <div style={{ width: '100%', overflow: 'hidden', borderRadius: '0.5rem', border: '0.0625rem solid #ddd', marginBottom: '1.5rem'}}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: `'${theme.fontBody}', sans-serif`, fontSize: 'var(--site-font-body-sm)'}}>
        <thead>
          <tr style={{ background: headerBg, color: headerText }}>
            {rows[0].map((cell, i) => (
              <th key={i} style={{ padding: '0.75rem 1rem', textAlign: 'left', borderBottom: '0.0625rem solid #ddd' }}>{cell}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.slice(1).map((row, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f9f9f9' }}>
              {row.map((cell, j) => (
                <td key={j} style={{ padding: '0.75rem 1rem', borderBottom: '0.0625rem solid #eee' }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ZigZagSection({ theme, img, title, reverse }) {
  return (
    <div style={{
      display: 'flex', gap: '2.5rem', alignItems: 'center', padding: '2.5rem 0',
      flexDirection: reverse ? 'row-reverse' : 'row'
    }}>
      <div style={{ flex: 1, height: '18.75rem', borderRadius: '0.75rem', overflow: 'hidden', background: '#ccc' }}>
        <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem'}}>
        <h3 style={{ fontFamily: `'${theme.fontTitles}', sans-serif`, fontSize: 'var(--site-font-subsection-title)', fontWeight: 700, color: '#333', margin: 0, lineHeight: 'var(--site-line-title)' }}>{title}</h3>
        <p style={{ fontFamily: `'${theme.fontBody}', sans-serif`, fontSize: 'var(--site-font-body)', color: '#555', lineHeight: 'var(--site-line-body)', margin: 0 }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
        <button style={{
          background: '#fff', color: theme.primary, border: `0.125rem solid ${theme.primary}`,
          borderRadius: '2.5rem', padding: '0.625rem 1.5rem', fontWeight: 700, cursor: 'pointer', width: 'fit-content'
        }}>
          Leer más
        </button>
      </div>
    </div>
  );
}

function HighlightContainer({ id, selectedId, onSelect, children, label, readOnly }) {
  if (readOnly) return children;
  const isSelected = id === selectedId;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      data-editor-section-id={id}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.(id);
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'visible',
      }}
    >
      {/* Focus/Hover Overlay for guaranteed visibility over children */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        pointerEvents: 'none',
        boxShadow: isSelected ? 'inset 0 0 0 0.1875rem var(--color-selection)' : (isHovered ? 'inset 0 0 0 0.1875rem var(--color-selection-hover)' : 'none'),
        transition: 'box-shadow 0.2s',
        zIndex: 5,
      }} />

      {/* Badge label (solo en hover/select) */}
      {(isSelected || isHovered) && label && (
        <div style={{
          position: 'absolute',
          top: id === 'header' ? 0 : -22,
          left: '-0.125rem',
          background: 'var(--color-selection)',
          color: 'white',
          padding: '0.125rem 0.5rem',
          fontSize: '0.625rem',
          fontWeight: 700,
          borderRadius: '0.25rem 0.25rem 0 0',
          fontFamily: 'sans-serif',
          textTransform: 'uppercase',
          borderBottomRightRadius: '0.25rem',
          pointerEvents: 'none',
          zIndex: 6,
        }}>
          {label}
        </div>
      )}
      {children}
    </div>
  );
}

export function GovWebPreview({ 
  theme: themeProp, 
  cmsData,
  selectedSectionId, 
  activePage, 
  onPageChange, 
  onSectionSelect,
  onHeaderTextsChange, 
  onFooterDataChange,
  accessibilityData,
  leftLinksData,
  previewMode = 'desktop',
  readOnly = false
}) {
  const theme = { ...DEFAULT_THEME, ...themeProp };
  const images = [templatePreview1, templatePreview2, templatePreview3];
  const tf = `'${theme.fontTitles}', sans-serif`;
  const bf = `'${theme.fontBody}', sans-serif`;

  // ── News detail view state ──
  const [navigationStack, setNavigationStack] = useState([]);
  const activeNewsDetail = navigationStack[navigationStack.length - 1] || null;

  const setActiveNewsDetail = (item) => {
    if (item === null) {
      setNavigationStack([]);
    } else {
      setNavigationStack(prev => [...prev, item]);
    }
  };

  const previewContainerRef = useRef(null);

  const prevPageIdRef = useRef(activePage?.id);
  const prevNewsRef = useRef(activeNewsDetail);

  // ── Dropdown nav hover state ──
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
  const [openNavGroupIds, setOpenNavGroupIds] = useState({});

  useEffect(() => {
    const pageIdChanged = activePage?.id !== prevPageIdRef.current;
    const newsChanged = activeNewsDetail !== prevNewsRef.current;

    if (pageIdChanged || newsChanged) {
      if (previewContainerRef.current) {
        previewContainerRef.current.scrollIntoView({ behavior: 'auto', block: 'start' });
      }
    }
    
    prevPageIdRef.current = activePage?.id;
    prevNewsRef.current = activeNewsDetail;
  }, [activePage?.id, activeNewsDetail]);

  useEffect(() => {
    setIsNavMenuOpen(false);
  }, [previewMode]);

  // ── Search logic state ──
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Intelligent Search Logic
  const allPages = themeProp?.pages || [];
  const searchResults = [];

  if (searchQuery.trim().length > 2) {
    const q = searchQuery.toLowerCase();
    
    // Search CMS Data
    if (cmsData && typeof cmsData === 'object') {
      Object.keys(cmsData).forEach(collection => {
        if (Array.isArray(cmsData[collection])) {
          cmsData[collection].forEach(item => {
            if (
              (item.title && typeof item.title === 'string' && item.title.toLowerCase().includes(q)) ||
              (item.description && typeof item.description === 'string' && item.description.toLowerCase().includes(q))
            ) {
              searchResults.push({
                type: 'CMS',
                collection,
                item,
                label: item.title || 'Item',
                subLabel: `En ${collection}`
              });
            }
          });
        }
      });
    }

    // Search Pages Content
    if (Array.isArray(allPages)) {
      allPages.forEach(page => {
        let pageMatched = false;
        if (page.name && typeof page.name === 'string' && page.name.toLowerCase().includes(q)) {
          pageMatched = true;
        } else {
          // Search inside blocks
          if (Array.isArray(page.sections)) {
            page.sections.forEach(sec => {
              if (Array.isArray(sec.blocks)) {
                sec.blocks.forEach(block => {
                  if (typeof block.content === 'string' && block.content.toLowerCase().includes(q)) {
                    pageMatched = true;
                  }
                });
              }
            });
          }
        }

      if (pageMatched) {
        searchResults.push({
          type: 'PAGE',
          pageId: page.id,
          label: page.name || 'Página',
          subLabel: 'Página'
        });
      }
    });
  }
  }

  if (!activePage) {
    return (
      <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-dim)', background: 'white', height: '100%' }}>
        Seleccione una página para previsualizar el contenido.
      </div>
    );
  }

  const templateId = activePage?.templateId || 'landing';

  // Render user-added dynamic sections (excluding locked ones like header/footer that rendered elsewhere)
  const dynamicSections = (activePage?.sections || []).filter(
    s => s.id !== 'header' && s.id !== 'footer'
  );

  const renderSectionComponent = (section) => {
    let content;
    const registryItem = SECTION_REGISTRY[section.type];
    
    if (registryItem) {
      const SectionComponent = registryItem.Component;
      let config = section.config || registryItem.defaultConfig;

      // Inject CMS data into sections that have a cmsCollection configured
      const collectionId = config.sourceMode !== 'manual'
        ? (config.cmsCollection || (section.type === 'noticias' ? 'noticias' : null))
        : null;
      if (collectionId && cmsData?.[collectionId]?.length > 0) {
        const cmsItems = cmsData[collectionId].map((n, index) => ({
          id: n.id || n.slug || `${collectionId}-${index}`,
          title: n.title,
          date: n.date,
          category: n.tag,
          img: n.img,
          image: n.img,
          imageAlt: n.title,
          description: n.description || n.blocks?.find(block => block.type === 'text')?.content || '',
          layout: index % 2 === 0 ? 'image-left' : 'image-right',
          _cmsItem: n,
        }));
        config = { ...config, items: cmsItems };
      }

      const onItemClick = collectionId
        ? (item) => {
            const fullItem = item._cmsItem || cmsData?.[collectionId]?.find(n => n.title === item.title) || item;
            setActiveNewsDetail(fullItem);
          }
        : section.type === 'links-directory'
          ? (item) => {
              // links-directory items are raw CMS objects, navigate directly to their detail
              setActiveNewsDetail(item);
            }
          : undefined;

      content = <SectionComponent key={section.id} config={config} theme={theme} onItemClick={onItemClick} onPageChange={onPageChange} cmsData={section.type === 'links-directory' ? cmsData : undefined} />;
    } else {
      content = <div key={section.id} style={{ padding: '2rem', textAlign: 'center', background: '#f5f5f5', border: '0.0625rem dashed #ccc', color: '#888' }}>{section.name} (Componente no registrado)</div>;
    }

    return (
      <HighlightContainer
        key={section.id}
        id={section.id}
        selectedId={selectedSectionId}
        onSelect={onSectionSelect}
        label={section.name}
        readOnly={readOnly}
      >
        {content}
      </HighlightContainer>
    );
  };

  const renderLayout = () => {
    if (dynamicSections.length === 0) {
      return (
        <div style={{ flex: 1, minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-hover)', border: '0.125rem dashed var(--border-subtle)', margin: '2rem', borderRadius: '0.5rem'}}>
          <span style={{ color: 'var(--text-dim)', fontFamily: bf, fontSize: 'var(--site-font-body)' }}>Zona de Componentes (Agrega nuevas secciones desde el panel izquierdo)</span>
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {dynamicSections.map(section => renderSectionComponent(section))}
      </div>
    );
  };

  // ── Header/Footer config from theme ──
  const hConfig = theme.headerConfig || {};
  const hTexts = theme.headerTexts || {};
  const fd = { ...DEFAULT_FOOTER_DATA, ...(theme.footerData || {}) };
  const headerStyle = theme.headerStyle || 'sedes-electronicas';
  const footerStyle = theme.footerStyle || 'version01';
  const navigationItems = theme.navigation || [];
  const isMobilePreview = previewMode === 'mobile';
  const useCompactNav = isMobilePreview || navigationItems.length >= NAV_COMPACT_THRESHOLD;

  const activeNavigationLabel = navigationItems.find(item => {
    const itemType = item.type || 'simple';
    if (itemType === 'simple') return !activeNewsDetail && activePage?.id === item.target;
    return (item.children || []).some(child => !activeNewsDetail && activePage?.id === child.target);
  })?.label || activePage?.label || activePage?.name || 'Secciones del sitio';

  const showGovBar = hConfig.govBar !== false;
  const showLogos = hConfig.logos !== false;
  const showSearchBar = hConfig.searchBar !== false;
  const showLoginLink = hConfig.loginLink === true;
  const showNavBar = hConfig.navBar !== false;
  const showLangSwitch = hConfig.languageSwitch !== false;

  const handleNavItemSelect = (target, e) => {
    e?.stopPropagation();
    setActiveNewsDetail(null);
    setOpenDropdownId(null);
    setIsNavMenuOpen(false);
    onPageChange?.(target);
  };

  const toggleNavGroup = (itemId) => {
    setOpenNavGroupIds(prev => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const headerStyles = `
    [data-gov-preview] { --nav-drawer-width: min(22rem, 86%); }
    .gov-preview-content { transition: filter 0.24s ease; }
    .gov-preview-content.is-nav-drawer-open { transform: none; }
    .gov-header-topbar { display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 2rem; background: ${theme.primary}; }
    .gov-header-logos-band { display: grid; grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr); align-items: center; padding: 1rem 2.5rem; border-bottom: 0.0625rem solid #eee; background: white; gap: 1rem; }
    .gov-header-logo-left { display: flex; justify-content: flex-start; }
    .gov-header-logo-center { display: flex; justify-content: center; }
    .gov-header-logo-right { display: flex; justify-content: flex-end; }
    .gov-header-login-block { display: flex; flex-direction: column; align-items: flex-end; gap: 0.5rem; width: 100%; }
    .gov-header-search-input { display: flex; align-items: center; gap: 0.5rem; border: 0.0625rem solid ${theme.primary}; border-radius: 6.1875rem; padding: 0.375rem 0.5rem 0.375rem 1rem; width: 17.5rem; max-width: 100%; }
    .gov-header-nav { display: flex; justify-content: center; overflow: visible; background: ${theme.navBg}; border-bottom: 0.25rem solid ${theme.navBorder}; }
    .gov-header-nav::-webkit-scrollbar { display: none; }
    .gov-header-nav-item { min-width: max-content; padding: 0.75rem 1.25rem; border-right: 0.0625rem solid #c8c8c8; font-size: var(--site-font-nav); color: #4c4c4c; cursor: pointer; text-align: center; line-height: var(--site-line-title); transition: background 0.2s ease; white-space: nowrap; }
    .gov-header-nav-item:hover { background: #e8e8e8; }
    .gov-header-nav > :first-child > .gov-header-nav-item, .gov-header-nav > .gov-header-nav-item:first-child { border-left: 0.0625rem solid #c8c8c8; }
    .gov-header-nav-dropdown-wrapper { position: relative; }
    .gov-header-nav-compact { position: relative; display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 0.625rem 2.5rem; background: ${theme.navBg}; border-bottom: 0.25rem solid ${theme.navBorder}; }
    .gov-header-nav-menu-button { display: inline-flex; align-items: center; gap: 0.625rem; border: 0.0625rem solid #d0d7e2; background: white; color: #243044; border-radius: 0.5rem; padding: 0.625rem 0.875rem; cursor: pointer; font-size: var(--site-font-nav); line-height: 1; box-shadow: 0 0.0625rem 0.125rem rgba(0,0,0,0.06); transition: background 0.18s ease, color 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease; }
    .gov-header-nav-menu-button:hover { background: #f7f9fc; border-color: ${theme.primary}; box-shadow: 0 0.25rem 0.75rem rgba(0,0,0,0.08); }
    .gov-header-nav-menu-button.is-open { background: ${theme.primary}; border-color: ${theme.primary}; color: white; box-shadow: 0 0.375rem 1rem rgba(0,61,166,0.22); }
    .gov-header-nav-active-label { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #344054; font-size: var(--site-font-nav); background: rgba(255,255,255,0.72); border: 0.0625rem solid rgba(0,0,0,0.08); border-radius: 99px; padding: 0.4375rem 0.875rem; }
    .gov-header-nav-drawer-layer { position: sticky; top: 0; left: 0; right: 0; width: 100%; max-width: 100%; height: 100vh; margin-bottom: -100vh; z-index: 80; pointer-events: none; overflow: hidden; }
    .gov-header-nav-scrim { position: absolute; inset: 0; z-index: 1; pointer-events: auto; background: rgba(15,23,42,0.32); backdrop-filter: blur(0.125rem); -webkit-backdrop-filter: blur(0.125rem); }
    .gov-header-nav-panel { position: absolute; top: 0; left: 0; z-index: 2; pointer-events: auto; width: var(--nav-drawer-width); height: 100vh; background: linear-gradient(180deg, ${theme.primary} 0%, ${theme.primaryDark || theme.primary} 100%); border-right: 0.0625rem solid rgba(255,255,255,0.22); border-radius: 0; box-shadow: 1rem 0 2.75rem rgba(16,24,40,0.28); overflow: hidden; animation: govNavDrawerIn 0.24s ease-out; color: white; }
    .gov-header-nav-panel-header { position: relative; z-index: 1; display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; padding: 1.25rem 1.125rem 1rem; background: rgba(0,0,0,0.08); border-bottom: 0.0625rem solid rgba(255,255,255,0.16); }
    .gov-header-nav-panel-title { margin: 0; color: white; font-size: var(--site-font-body); font-weight: 700; line-height: var(--site-line-title); }
    .gov-header-nav-panel-count { margin: 0.25rem 0 0; color: rgba(255,255,255,0.78); font-size: var(--site-font-caption); line-height: var(--site-line-body); }
    .gov-header-nav-panel-close { display: inline-flex; align-items: center; justify-content: center; width: 2rem; height: 2rem; border: 0.0625rem solid rgba(255,255,255,0.3); border-radius: 99px; background: rgba(255,255,255,0.12); color: white; cursor: pointer; flex-shrink: 0; }
    .gov-header-nav-panel-close:hover { background: rgba(255,255,255,0.2); border-color: rgba(255,255,255,0.48); }
    .gov-header-nav-panel-grid { display: flex; flex-direction: column; gap: 0.625rem; padding: 0.875rem; overflow: auto; height: calc(100% - 5.25rem); }
    .gov-header-nav-panel-item { display: flex; flex-direction: column; align-items: stretch; min-width: 0; border: 0.0625rem solid rgba(255,255,255,0.16); border-radius: 0.625rem; background: rgba(255,255,255,0.1); overflow: hidden; box-shadow: inset 0 0.0625rem 0 rgba(255,255,255,0.08); }
    .gov-header-nav-panel-link { position: relative; display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; padding: 0.8125rem 0.875rem; color: rgba(255,255,255,0.92); cursor: pointer; font-size: var(--site-font-body-sm); line-height: var(--site-line-title); text-decoration: none; transition: background 0.16s ease, color 0.16s ease, transform 0.16s ease; }
    .gov-header-nav-panel-link:hover { background: rgba(255,255,255,0.16); color: white; }
    .gov-header-nav-panel-link.is-active { background: white; color: ${theme.primary}; font-weight: 700; }
    .gov-header-nav-panel-link.is-active::before { content: ''; position: absolute; left: 0; top: 0.625rem; bottom: 0.625rem; width: 0.1875rem; border-radius: 99px; background: ${theme.navBorder || theme.accent || '#ffa741'}; }
    .gov-header-nav-panel-children { display: none; background: rgba(255,255,255,0.08); border-top: 0.0625rem solid rgba(255,255,255,0.14); }
    .gov-header-nav-panel-children.is-open { display: flex; flex-direction: column; }
    .gov-header-nav-panel-child { padding-left: 1.625rem; font-size: var(--site-font-caption); background: transparent; border-top: 0.0625rem solid rgba(255,255,255,0.1); }
    .gov-header-nav-panel-child:first-child { border-top: 0; }
    .gov-header-nav-panel-parent { font-weight: 700; }
    .gov-header-nav-panel-parent:hover { background: rgba(255,255,255,0.16); color: white; }
    .gov-header-nav-link-icon { width: 1.125rem; height: 1.125rem; color: currentColor; opacity: 0.72; flex-shrink: 0; transition: transform 0.16s ease, opacity 0.16s ease; }
    .gov-header-nav-panel-link:hover .gov-header-nav-link-icon, .gov-header-nav-panel-link.is-active .gov-header-nav-link-icon { opacity: 1; }
    .gov-header-nav-link-icon.is-expanded { transform: rotate(180deg); }
    @keyframes govNavDrawerIn { from { opacity: 0; transform: translateX(-1rem); } to { opacity: 1; transform: translateX(0); } }
    .gov-footer-version-01 { position: relative; overflow: hidden; background: linear-gradient(to bottom, white 0 8.125rem, #ffc84a 8.125rem 100%); }

    @media (max-width: 768px) {
      .gov-header-topbar { padding: 0.5rem 1rem; }
      .gov-header-logos-band { grid-template-columns: 1fr 1fr; padding: 1rem; }
      .gov-header-logo-center { grid-column: 1 / -1; order: 3; justify-content: center; }
      .gov-header-logo-right.has-login { grid-column: 1 / -1; order: 3; justify-content: center; }
      .gov-header-login-block { align-items: center; }
      .gov-header-search-input { width: 100%; }
      [data-gov-preview] { --nav-drawer-width: min(20rem, 88%); }
      .gov-header-nav-compact { padding: 0.5rem 1rem; }
      .gov-header-nav-panel { border-radius: 0; }
    }

    @media (max-width: 1024px) {
      .gov-header-nav { justify-content: flex-start; overflow-x: auto; -webkit-overflow-scrolling: touch; }
      .gov-header-nav-item { padding: 0.75rem 1rem; }
    }

    @media (max-width: 900px) {
      .gov-footer-card { padding: 1.5rem !important; gap: 2rem !important; }
      .gov-footer-row { flex-direction: column !important; gap: 1.5rem !important; }
      .gov-footer-logos { align-items: flex-start !important; }
      .gov-footer-bottom { padding: 1rem !important; flex-wrap: wrap; }
      .gov-footer-v2-inner { flex-direction: column !important; gap: 1.5rem !important; }
      .gov-footer-v2-logos { width: 100% !important; flex-direction: row !important; flex-wrap: wrap; }
      .gov-footer-divider { display: none !important; }
      .gov-footer-socials { justify-content: flex-start !important; flex-wrap: wrap; gap: 1rem !important; }
    }

    [data-gov-preview][data-preview-viewport="mobile"] .gov-header-topbar { padding: 0.5rem 1rem; }
    [data-gov-preview][data-preview-viewport="mobile"] .gov-header-logos-band { grid-template-columns: 1fr 1fr; padding: 1rem; }
    [data-gov-preview][data-preview-viewport="mobile"] .gov-header-logo-center { grid-column: 1 / -1; order: 3; justify-content: center; }
    [data-gov-preview][data-preview-viewport="mobile"] .gov-header-logo-right.has-login { grid-column: 1 / -1; order: 3; justify-content: center; }
    [data-gov-preview][data-preview-viewport="mobile"] .gov-header-login-block { align-items: center; }
    [data-gov-preview][data-preview-viewport="mobile"] .gov-header-search-input { width: 100%; }
    [data-gov-preview][data-preview-viewport="mobile"] { --nav-drawer-width: min(20rem, 88%); }
    [data-gov-preview][data-preview-viewport="mobile"] .gov-header-nav-compact { padding: 0.5rem 1rem; }
    [data-gov-preview][data-preview-viewport="mobile"] .gov-header-nav-panel { border-radius: 0; }
    [data-gov-preview][data-preview-viewport="mobile"] .gov-header-nav { justify-content: flex-start; overflow-x: auto; -webkit-overflow-scrolling: touch; }
    [data-gov-preview][data-preview-viewport="mobile"] .gov-header-nav-item { padding: 0.75rem 1rem; }
    [data-gov-preview][data-preview-viewport="mobile"] .gov-footer-card { padding: 1.5rem !important; gap: 2rem !important; }
    [data-gov-preview][data-preview-viewport="mobile"] .gov-footer-row { flex-direction: column !important; gap: 1.5rem !important; }
    [data-gov-preview][data-preview-viewport="mobile"] .gov-footer-logos { align-items: flex-start !important; }
    [data-gov-preview][data-preview-viewport="mobile"] .gov-footer-bottom { padding: 1rem !important; flex-wrap: wrap; }
    [data-gov-preview][data-preview-viewport="mobile"] .gov-footer-v2-inner { flex-direction: column !important; gap: 1.5rem !important; }
    [data-gov-preview][data-preview-viewport="mobile"] .gov-footer-v2-logos { width: 100% !important; flex-direction: row !important; flex-wrap: wrap; }
    [data-gov-preview][data-preview-viewport="mobile"] .gov-footer-divider { display: none !important; }
    [data-gov-preview][data-preview-viewport="mobile"] .gov-footer-socials { justify-content: flex-start !important; flex-wrap: wrap; gap: 1rem !important; }

    [data-gov-preview][data-preview-viewport="mobile"] .noticias-section { --news-vertical-img-height: clamp(12rem, 52vw, 16rem) !important; --news-section-padding: 2.75rem 24px !important; gap: 2rem !important; }
    [data-gov-preview][data-preview-viewport="mobile"] .noticias-section-wrapper { width: 100% !important; max-width: none !important; }
    [data-gov-preview][data-preview-viewport="mobile"] .noticias-section-title { width: 100% !important; max-width: none !important; text-align: center !important; }
    [data-gov-preview][data-preview-viewport="mobile"] .noticias-grid-destacado,
    [data-gov-preview][data-preview-viewport="mobile"] .noticias-grid-lista,
    [data-gov-preview][data-preview-viewport="mobile"] .noticias-blog-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
    [data-gov-preview][data-preview-viewport="mobile"] .noticias-horizontal-card { flex-direction: column !important; gap: 1.25rem !important; }
    [data-gov-preview][data-preview-viewport="mobile"] .noticias-horizontal-img { width: 100% !important; min-height: 13.5rem !important; }
    [data-gov-preview][data-preview-viewport="mobile"] .noticias-blog-img { height: clamp(12rem, 52vw, 16rem) !important; }

    [data-gov-preview][data-preview-viewport="mobile"] .section-table { --table-padding: 2.75rem 24px !important; }
    [data-gov-preview][data-preview-viewport="mobile"] .section-table-wrapper { width: 100% !important; max-width: none !important; }
    [data-gov-preview][data-preview-viewport="mobile"] .section-links { --links-group-title-size: var(--site-font-card-title) !important; --links-padding: 2.75rem 24px !important; }
    [data-gov-preview][data-preview-viewport="mobile"] .section-links-wrapper { width: 100% !important; max-width: none !important; }
    [data-gov-preview][data-preview-viewport="mobile"] .template-content-wrapper { width: 100% !important; max-width: none !important; }
  `;

  const renderCompactNavDrawer = () => {
    if (!isNavMenuOpen || !useCompactNav) return null;

    return (
      <div className="gov-header-nav-drawer-layer">
        <div className="gov-header-nav-scrim" onClick={() => setIsNavMenuOpen(false)} />
        <div className="gov-header-nav-panel">
          <div className="gov-header-nav-panel-header">
            <div style={{ minWidth: 0 }}>
              <p className="gov-header-nav-panel-title" style={{ fontFamily: tf }}>Navegación del sitio</p>
              <p className="gov-header-nav-panel-count" style={{ fontFamily: bf }}>{navigationItems.length} enlaces disponibles</p>
            </div>
            <button
              type="button"
              className="gov-header-nav-panel-close"
              aria-label="Cerrar navegación"
              onClick={(e) => { e.stopPropagation(); setIsNavMenuOpen(false); }}
            >
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12" />
                <path d="M18 6L6 18" />
              </svg>
            </button>
          </div>

          <div className="gov-header-nav-panel-grid">
            {navigationItems.map((item, i) => {
              const itemType = item.type || 'simple';
              const isSimpleActive = itemType === 'simple' && !activeNewsDetail && activePage?.id === item.target;

              if (itemType === 'simple') {
                return (
                  <div key={item.id || i} className="gov-header-nav-panel-item">
                    <div
                      className={`gov-header-nav-panel-link ${isSimpleActive ? 'is-active' : ''}`}
                      onClick={(e) => handleNavItemSelect(item.target, e)}
                      style={{ fontFamily: bf }}
                    >
                      <span>{item.label}</span>
                      <svg className="gov-header-nav-link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </div>
                  </div>
                );
              }

              const children = item.children || [];
              const isChildActive = children.some(child => !activeNewsDetail && activePage?.id === child.target);
              const groupId = item.id || `nav-group-${i}`;
              const isGroupOpen = openNavGroupIds[groupId] ?? isChildActive;
              return (
                <div key={groupId} className="gov-header-nav-panel-item">
                  <div
                    className={`gov-header-nav-panel-link gov-header-nav-panel-parent ${isChildActive ? 'is-active' : ''}`}
                    onClick={(e) => { e.stopPropagation(); toggleNavGroup(groupId); }}
                    style={{ fontFamily: bf }}
                    role="button"
                    aria-expanded={isGroupOpen}
                  >
                    <span>{item.label}</span>
                    <svg className={`gov-header-nav-link-icon ${isGroupOpen ? 'is-expanded' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </div>
                  <div className={`gov-header-nav-panel-children ${isGroupOpen ? 'is-open' : ''}`}>
                    {children.length > 0 ? children.map((child, childIndex) => {
                      const isChildSelected = !activeNewsDetail && activePage?.id === child.target;
                      return (
                        <div
                          key={child.id || childIndex}
                          className={`gov-header-nav-panel-link gov-header-nav-panel-child ${isChildSelected ? 'is-active' : ''}`}
                          onClick={(e) => handleNavItemSelect(child.target, e)}
                          style={{ fontFamily: bf }}
                        >
                          <span>{child.label}</span>
                          <svg className="gov-header-nav-link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                            <path d="M9 18l6-6-6-6" />
                          </svg>
                        </div>
                      );
                    }) : (
                      <div className="gov-header-nav-panel-link gov-header-nav-panel-child" style={{ fontFamily: bf, color: 'rgba(255,255,255,0.68)', cursor: 'default' }}>
                        Sin sub-items
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div 
      ref={previewContainerRef}
      onClick={(e) => {
        // Clear selection if clicking the empty background of the site itself
        if (e.target === e.currentTarget) onSectionSelect?.(null);
      }}
      data-gov-preview
      data-preview-viewport={previewMode}
      style={{ fontFamily: bf, background: '#fff', width: '100%', minWidth: 0, minHeight: '100%', height: 'auto', position: 'relative', overflowX: 'hidden' }}
    >
      <style>{headerStyles}</style>

      {/* ═══════════════ ACCESSIBILITY BAR — outside content wrapper so contrast filter doesn't affect its position ═══════════════ */}
      <AccessibilityBar data={accessibilityData} themeColor={theme.primary} readOnly={readOnly} />
      <LeftLinksBar data={leftLinksData} themeColor={theme.primary} readOnly={readOnly} />
      {renderCompactNavDrawer()}

      {/* ═══════════════ PAGE CONTENT — contrast filter targets this wrapper only ═══════════════ */}
      <div
        data-gov-content
        className={`gov-preview-content ${isNavMenuOpen && useCompactNav ? 'is-nav-drawer-open' : ''}`}
        style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}
      >

      {/* ═══════════════ DYNAMIC HEADER ═══════════════ */}
      <HighlightContainer
        id="header"
        selectedId={selectedSectionId}
        onSelect={onSectionSelect}
        label="Header"
        readOnly={readOnly}
      >
        {/* ── GOV.CO TOP BAR ── */}
        {showGovBar && (
          <div className="gov-header-topbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <div style={{ height: '30px', overflow: 'hidden', position: 'relative', flexShrink: 0, width: '149px' }}>
                <div style={{ position: 'absolute', top: '7.14%', right: '84.03%', bottom: '7.15%', left: '-0.02%' }}>
                  <img alt="" style={{ position: 'absolute', display: 'block', top: 0, right: 0, bottom: 0, left: 0, maxWidth: 'none', width: '100%', height: '100%' }} src="/assets/govco_logo1.svg" onError={e => { e.target.style.display = 'none'; }} />
                </div>
                <div style={{ position: 'absolute', display: 'contents', top: '14.28%', right: 0, bottom: '14.29%', left: '25.42%' }}>
                  <div style={{ position: 'absolute', top: '14.28%', right: 0, bottom: '14.29%', left: '25.42%' }}>
                    <img alt="" style={{ position: 'absolute', display: 'block', top: 0, right: 0, bottom: 0, left: 0, maxWidth: 'none', width: '100%', height: '100%' }} src="/assets/govco_logo2.svg" onError={e => { e.target.style.display = 'none'; }} />
                  </div>
                </div>
                <div style={{ position: 'absolute', top: 0, right: '78.79%', bottom: '0.01%', left: '19.66%' }}>
                  <img alt="" style={{ position: 'absolute', display: 'block', top: 0, right: 0, bottom: 0, left: 0, maxWidth: 'none', width: '100%', height: '100%' }} src="/assets/govco_logo3.svg" onError={e => { e.target.style.display = 'none'; }} />
                </div>
              </div>
            </div>
            {showLangSwitch && (
              <div style={{ background: 'white', borderRadius: '0.375rem', padding: '0.25rem 0.625rem' }}>
                <span style={{ color: theme.primary, fontWeight: 700, fontSize: 'var(--site-font-body-sm)', fontFamily: tf }}>ES</span>
              </div>
            )}
          </div>
        )}
      <div className="gov-header-logos-band" style={{ 
        borderBottomColor: headerStyle === 'tramites-servicios' ? '#ffa741' : '#eee',
        borderBottomWidth: headerStyle === 'tramites-servicios' ? '0.25rem' : '0.0625rem'
      }}>
        {/* Left Cell: Main Logo */}
        <div className="gov-header-logo-left">
          <div style={{ height: '2.75rem', width: 'auto', display: 'flex', alignItems: 'center', background: 'transparent', borderRadius: '0.25rem', overflow: 'hidden', visibility: (hConfig.logos !== false) ? 'visible' : 'hidden' }}>
            <img src={hConfig.logoLeftUrl || "/assets/logo_potencia.png"} alt="Colombia Potencia de la Vida" style={{ height: '100%', objectFit: 'contain' }} onError={e => { e.target.style.display = 'none'; }} />
          </div>
        </div>

        {/* Center Cell: Search bar ONLY */}
        <div className="gov-header-logo-center">
          {showSearchBar && !showLoginLink && (
            <div className="gov-header-search-input" style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder={hTexts.searchPlaceholder || 'Buscar por componente'}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(e.target.value.length > 0);
                }}
                onFocus={() => { if (searchQuery) setShowSearchDropdown(true); }}
                onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
                style={{ 
                  flex: 1, fontSize: 'var(--site-font-caption)', color: '#333', fontFamily: bf, 
                  background: 'transparent', border: 'none', outline: 'none', width: '100%' 
                }}
              />
              <div style={{ background: theme.primary, borderRadius: '6.1875rem', width: '1.875rem', height: '1.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width={14} height={14} fill="none" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" stroke="white" strokeWidth="2" /><path d="M20 20l-3-3" stroke="white" strokeWidth="2" strokeLinecap="round" /></svg>
              </div>

              {/* Resultados de búsqueda */}
              {showSearchDropdown && searchQuery.trim().length > 2 && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 0.5rem)', left: 0, right: 0,
                  background: 'white', border: '1px solid #ddd', borderRadius: '0.5rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 50, maxHeight: '300px', overflowY: 'auto'
                }}>
                  {searchResults.length > 0 ? (
                    searchResults.map((res, i) => (
                      <div 
                        key={i}
                        onClick={() => {
                          if (res.type === 'PAGE') {
                            setActiveNewsDetail(null);
                            onPageChange?.(res.pageId);
                          } else if (res.type === 'CMS' && res.collection === 'noticias') {
                            setActiveNewsDetail(res.item);
                          }
                          setShowSearchDropdown(false);
                          setSearchQuery('');
                        }}
                        style={{
                          padding: '0.75rem 1rem', borderBottom: '1px solid #eee', cursor: 'pointer', textAlign: 'left'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#f9f9f9'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <p style={{ margin: 0, fontSize: 'var(--site-font-body-sm)', fontWeight: 700, color: theme.primary }}>{res.label}</p>
                        <p style={{ margin: 0, fontSize: 'var(--site-font-caption)', color: '#666', marginTop: '0.25rem' }}>{res.subLabel}</p>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '1rem', textAlign: 'center', color: '#888', fontSize: 'var(--site-font-body-sm)', fontFamily: bf }}>
                      No se encontraron resultados.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Cell: Ministry logo OR Login Block */}
        <div className={`gov-header-logo-right ${showLoginLink ? 'has-login' : ''}`}>
          {!showLoginLink && (
            <div style={{ height: '2.75rem', width: 'auto', display: 'flex', alignItems: 'center', background: 'transparent', borderRadius: '0.25rem', overflow: 'hidden', visibility: (hConfig.rightLogo !== false) ? 'visible' : 'hidden' }}>
              <img src={hConfig.logoRightUrl || "/assets/logo_mintic_v2.png"} alt="MinTIC" style={{ height: '100%', objectFit: 'contain' }} onError={e => { e.target.style.display = 'none'; }} />
            </div>
          )}

          {showLoginLink && (
            <div className="gov-header-login-block">
              <span style={{ fontFamily: bf, fontSize: 'var(--site-font-body-sm)', color: theme.primary, cursor: 'pointer' }}>{hTexts.loginLabel || 'Iniciar sesión'}</span>
              <div className="gov-header-search-input">
                <span style={{ flex: 1, fontSize: 'var(--site-font-caption)', color: '#888', fontFamily: bf }}>{hTexts.searchPlaceholder || 'Buscar por componente'}</span>
                <div style={{ background: theme.primary, borderRadius: '6.1875rem', width: '1.875rem', height: '1.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width={14} height={14} fill="none" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" stroke="white" strokeWidth="2" /><path d="M20 20l-3-3" stroke="white" strokeWidth="2" strokeLinecap="round" /></svg>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── NAV BAR ── */}
      {showNavBar && useCompactNav && (
        <div className="gov-header-nav-compact">
          <button
            type="button"
            className={`gov-header-nav-menu-button ${isNavMenuOpen ? 'is-open' : ''}`}
            onClick={(e) => { e.stopPropagation(); setIsNavMenuOpen(prev => !prev); }}
            aria-expanded={isNavMenuOpen}
            aria-label="Abrir navegación del sitio"
            style={{ fontFamily: bf }}
          >
            <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" aria-hidden="true">
              <path d="M4 7h16" />
              <path d="M4 12h16" />
              <path d="M4 17h16" />
            </svg>
            <span>Menú</span>
          </button>
          <span className="gov-header-nav-active-label" style={{ fontFamily: bf }}>
            {activeNavigationLabel}
          </span>
        </div>
      )}

      {showNavBar && !useCompactNav && (
        <div className="gov-header-nav" style={{ position: 'relative' }}>
          {navigationItems.map((item, i) => {
            const itemType = item.type || 'simple';
            const isChildActive = itemType === 'dropdown' && (item.children || []).some(c => !activeNewsDetail && activePage?.id === c.target);
            const isActive = itemType === 'simple'
              ? (!activeNewsDetail && activePage?.id === item.target)
              : isChildActive;

            if (itemType === 'simple') {
              return (
                <div key={i}
                  className="gov-header-nav-item"
                  onClick={(e) => handleNavItemSelect(item.target, e)}
                  style={{
                    background: isActive ? '#c8c8c8' : 'transparent',
                    fontFamily: bf,
                  }}
                >
                  {item.label}
                </div>
              );
            }

            // Dropdown type
            const isDropdownOpen = openDropdownId === item.id;
            return (
              <div key={i}
                className="gov-header-nav-dropdown-wrapper"
                onMouseEnter={() => setOpenDropdownId(item.id)}
                onMouseLeave={() => setOpenDropdownId(null)}
              >
                <div
                  className="gov-header-nav-item"
                  style={{
                    background: (isActive || isDropdownOpen) ? '#c8c8c8' : 'transparent',
                    fontFamily: bf,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                  }}
                >
                  {item.label}
                  <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ flexShrink: 0, marginTop: '0.0625rem', transition: 'transform 0.2s', transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                {/* Dropdown panel — controlled via React state */}
                {isDropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    minWidth: '14rem',
                    background: 'white',
                    borderRadius: '0 0 0.5rem 0.5rem',
                    boxShadow: '0 0.25rem 1rem rgba(0,0,0,0.12)',
                    display: 'flex',
                    flexDirection: 'column',
                    zIndex: 50,
                    overflow: 'hidden',
                  }}>
                    {(item.children || []).map((child, ci) => (
                      <div key={ci}
                        onClick={(e) => handleNavItemSelect(child.target, e)}
                        style={{
                          padding: '0.625rem 1.25rem',
                          fontFamily: bf,
                          fontSize: 'var(--site-font-caption)',
                          color: (!activeNewsDetail && activePage?.id === child.target) ? theme.primary : '#333',
                          fontWeight: (!activeNewsDetail && activePage?.id === child.target) ? 700 : 400,
                          cursor: 'pointer',
                          borderBottom: ci < (item.children || []).length - 1 ? '0.0625rem solid #f0f0f0' : 'none',
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#f4f4f4'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                      >
                        {child.label}
                      </div>
                    ))}
                    {(item.children || []).length === 0 && (
                      <div style={{ padding: '0.625rem 1.25rem', fontFamily: bf, fontSize: 'var(--site-font-caption)', color: '#999' }}>
                        Sin sub-items
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      </HighlightContainer>

      {/* ── MAIN CONTENT AREA ── */}
      <div 
        onClick={(e) => {
          if (e.target === e.currentTarget) onSectionSelect?.(null);
        }}
        style={{ background: '#fff', paddingTop: 0, flex: 1, minHeight: '2rem' }}
      >
        {activeNewsDetail ? (
          <NewsPageTemplate
            title={activeNewsDetail.title}
            breadcrumbs={[
              { label: 'Inicio', link: '/', onNavigate: () => setNavigationStack([]) },
              ...navigationStack.map((item, idx) => ({
                label: item.title,
                onNavigate: () => setNavigationStack(prev => prev.slice(0, idx + 1))
              }))
            ]}
            blocks={activeNewsDetail.blocks || []}
            theme={theme}
            cmsData={cmsData}
            onItemClick={(item) => setActiveNewsDetail(item)}
          />
        ) : (
          renderLayout()
        )}
      </div>

      {/* ═══════════════ DYNAMIC FOOTER ═══════════════ */}
      <HighlightContainer
        id="footer"
        selectedId={selectedSectionId}
        onSelect={onSectionSelect}
        label="Footer"
        readOnly={readOnly}
      >
        {footerStyle === 'version01' ? (
          <>
            <div className="gov-footer-version-01" style={{ padding: '2.5rem 1rem' }}>
              <div className="gov-footer-card" style={{ position: 'relative', zIndex: 1, maxWidth: '77.5rem', margin: '0 auto', background: 'white', border: '0.125rem solid #afc8e7', borderRadius: '0.75rem', padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '3.75rem'}}>
                {/* Top: Primary info + Logos */}
                <div className="gov-footer-row" style={{ display: 'flex', gap: '2.5rem'}}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2.5rem'}}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem'}}>
                      <p style={{ fontFamily: tf, fontSize: 'var(--site-font-subsection-title)', fontWeight: 700, color: theme.primary, margin: 0, lineHeight: 'var(--site-line-title)' }}>{fd.entityFullName}</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                        <p style={{ fontFamily: tf, fontSize: 'var(--site-font-card-title)', fontWeight: 700, color: theme.primary, margin: 0, lineHeight: 'var(--site-line-title)' }}>{fd.mainOfficeTitle}</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontFamily: bf, fontSize: 'var(--site-font-body-sm)', color: 'black', lineHeight: 'var(--site-line-body)' }}>
                          {(fd.mainFields || []).filter(f => f.value).map(f => (
                            <p key={f.id} style={{ margin: 0 }}>{f.value}</p>
                          ))}
                          {(fd.mainEmails || []).filter(em => em.value).map(em => (
                            <p key={em.id} style={{ margin: 0 }}>{em.label}: <span style={{ color: theme.primary, textDecoration: 'underline' }}>{em.value}</span></p>
                          ))}
                        </div>
                      </div>
                    </div>
                    {/* Social media */}
                    {fd.showSocialMedia !== false && (fd.socialMedia || []).length > 0 && (
                      <div className="gov-footer-socials" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        {(fd.socialMedia || []).map(sm => (
                          <div key={sm.id} style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '1.125rem', height: '1.125rem' }}>
                              {sm.platform === 'twitter' ? <MaskIcon icon={twitterIcon} size={18} color={theme.primary} /> : 
                               sm.platform === 'instagram' ? <MaskIcon icon={instagramIcon} size={18} color={theme.primary} /> : 
                               sm.platform === 'facebook' ? <MaskIcon icon={facebookIcon} size={18} color={theme.primary} /> : 
                               sm.platform === 'youtube' ? <MaskIcon icon={youtubeIcon} size={18} color={theme.primary} /> : 
                               sm.platform === 'linkedin' ? <MaskIcon icon={linkedinIcon} size={18} color={theme.primary} /> : 
                               <MaskIcon icon={tiktokIcon} size={18} color={theme.primary} />}
                            </div>
                            <span style={{ fontFamily: bf, fontSize: 'var(--site-font-body-sm)', color: theme.primary, textDecoration: 'underline' }}>{sm.handle}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Logos column */}
                  <div className="gov-footer-logos" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'flex-end' }}>
                    <div style={{ width: '8.5625rem', height: '3rem', background: '#f0f0f0', borderRadius: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontFamily: tf, fontSize: '0.625rem', color: '#888' }}>Colombia Potencia</span>
                    </div>
                    <div style={{ width: '11.6875rem', height: '2.125rem', background: '#f0f0f0', borderRadius: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontFamily: tf, fontSize: '0.625rem', color: '#888' }}>Logo MinTIC</span>
                    </div>
                  </div>
                </div>

                {/* Bottom: Sedes + Contacts */}
                {(fd.showSedes !== false || fd.showContacts !== false) && (
                  <div className="gov-footer-row" style={{ display: 'flex', gap: '2.5rem'}}>
                    {fd.showSedes !== false && (fd.sedes || []).length > 0 && (
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                        {(fd.sedes || []).map(sede => (
                          <div key={sede.id} style={{ display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                            <p style={{ fontFamily: tf, fontSize: 'var(--site-font-body)', fontWeight: 700, color: theme.primary, margin: 0, lineHeight: 'var(--site-line-title)' }}>{sede.title}</p>
                            <div style={{ fontFamily: bf, fontSize: 'var(--site-font-body-sm)', color: 'black', display: 'flex', flexDirection: 'column', gap: '0.5rem', lineHeight: 'var(--site-line-body)' }}>
                              {(sede.fields || []).filter(f => f.value).map(f => (
                                <p key={f.id} style={{ margin: 0 }}>{f.value}</p>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {fd.showContacts !== false && (fd.contacts || []).length > 0 && (
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                        {(fd.contacts || []).map(ct => (
                          <div key={ct.id} style={{ display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                            <p style={{ fontFamily: tf, fontSize: 'var(--site-font-body)', fontWeight: 700, color: theme.primary, margin: 0, lineHeight: 'var(--site-line-title)' }}>{ct.title}</p>
                            <div style={{ fontFamily: bf, fontSize: 'var(--site-font-body-sm)', color: 'black', display: 'flex', flexDirection: 'column', gap: '0.5rem', lineHeight: 'var(--site-line-body)' }}>
                              {(ct.fields || []).filter(f => f.value).map(f => (
                                <p key={f.id} style={{ margin: 0 }}>{f.value}</p>
                              ))}
                              {ct.email?.value && (
                                <p style={{ margin: 0 }}>{ct.email.label}: <span style={{ color: theme.primary, textDecoration: 'underline' }}>{ct.email.value}</span></p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Footer links */}
                {fd.showFooterLinks !== false && (fd.footerLinks || []).length > 0 && (
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    {(fd.footerLinks || []).filter(l => l.label).map(lnk => (
                      <span key={lnk.id} style={{ fontFamily: bf, fontSize: 'var(--site-font-body-sm)', color: theme.primary, textDecoration: 'underline', cursor: 'pointer' }}>{lnk.label}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {/* GOV.CO bottom bar */}
            <div className="gov-footer-bottom" style={{ background: theme.primary, padding: '1rem 2rem', display: 'flex', alignItems: 'center', gap: '1rem'}}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <div style={{ background: 'white', borderRadius: '0.25rem', width: '1.5rem', height: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke={theme.primary} strokeWidth="2.5" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke={theme.primary} strokeWidth="2.5" /></svg>
                </div>
                <span style={{ fontWeight: 800, fontSize: 'var(--site-font-body)', letterSpacing: 1, fontFamily: tf, color: 'white' }}>GOV.CO</span>
              </div>
              <div style={{ width: '0.0625rem', height: '1.125rem', background: 'rgba(255,255,255,0.3)' }} />
              <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.2)' }}>
                <span style={{ fontSize: '1rem'}}>🇨🇴</span>
              </div>
            </div>
          </>
        ) : (
          <div style={{ background: theme.primary, padding: '3.75rem 1rem', color: 'white' }}>
            <div className="gov-footer-v2-inner" style={{ maxWidth: '77.5rem', margin: '0 auto', display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
              {/* Logos column */}
              <div className="gov-footer-v2-logos" style={{ width: '8.375rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem', flexShrink: 0 }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ width: '100%', height: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.375rem'}}>
                    <div style={{ background: 'white', borderRadius: '0.125rem', width: '1rem', height: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width={10} height={10} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke={theme.primary} strokeWidth="2.5" /></svg>
                    </div>
                    <span style={{ fontWeight: 800, fontSize: '0.6875rem', letterSpacing: 0.5, fontFamily: tf }}>GOV.CO</span>
                  </div>
                ))}
              </div>

              <div className="gov-footer-divider" style={{ width: '0.0625rem', alignSelf: 'stretch', background: 'rgba(255,255,255,0.3)' }} />

              {/* Info section */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem'}}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                  <p style={{ fontFamily: tf, fontSize: 'var(--site-font-card-title)', fontWeight: 700, margin: 0, lineHeight: 'var(--site-line-title)' }}>{fd.entityFullName}</p>
                  <div style={{ fontFamily: bf, fontSize: 'var(--site-font-body-sm)', display: 'flex', flexDirection: 'column', gap: '0.5rem', lineHeight: 'var(--site-line-body)' }}>
                    {(fd.mainFields || []).filter(f => f.value).map(f => (
                      <p key={f.id} style={{ margin: 0 }}>{f.value}</p>
                    ))}
                  </div>
                </div>
                {fd.showSocialMedia !== false && (fd.socialMedia || []).length > 0 && (
                  <div className="gov-footer-socials" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {(fd.socialMedia || []).map(sm => (
                      <div key={sm.id} style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '1.125rem', height: '1.125rem' }}>
                          {sm.platform === 'twitter' ? <MaskIcon icon={twitterIcon} size={18} color="currentColor" /> : 
                           sm.platform === 'instagram' ? <MaskIcon icon={instagramIcon} size={18} color="currentColor" /> : 
                           sm.platform === 'facebook' ? <MaskIcon icon={facebookIcon} size={18} color="currentColor" /> : 
                           sm.platform === 'youtube' ? <MaskIcon icon={youtubeIcon} size={18} color="currentColor" /> : 
                           sm.platform === 'linkedin' ? <MaskIcon icon={linkedinIcon} size={18} color="currentColor" /> : 
                           <MaskIcon icon={tiktokIcon} size={18} color="currentColor" />}
                        </div>
                        <span style={{ fontFamily: bf, fontSize: 'var(--site-font-body-sm)', textDecoration: 'underline' }}>{sm.handle}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="gov-footer-divider" style={{ width: '0.0625rem', alignSelf: 'stretch', background: 'rgba(255,255,255,0.3)' }} />

              {/* Contact section */}
              {fd.showContacts !== false && (fd.contacts || []).length > 0 && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem'}}>
                  {(fd.contacts || []).map(ct => (
                    <div key={ct.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                      <p style={{ fontFamily: tf, fontSize: 'var(--site-font-body)', fontWeight: 700, margin: 0, lineHeight: 'var(--site-line-title)' }}>{ct.title}</p>
                      <div style={{ fontFamily: bf, fontSize: 'var(--site-font-body-sm)', display: 'flex', flexDirection: 'column', gap: '0.25rem', lineHeight: 'var(--site-line-body)' }}>
                        {(ct.fields || []).filter(f => f.value).map(f => (
                          <p key={f.id} style={{ margin: 0 }}>{f.value}</p>
                        ))}
                        {ct.email?.value && (
                          <p style={{ margin: 0 }}>{ct.email.label}: <span style={{ textDecoration: 'underline' }}>{ct.email.value}</span></p>
                        )}
                      </div>
                    </div>
                  ))}
                  {fd.showFooterLinks !== false && (fd.footerLinks || []).length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem 1rem', alignItems: 'center' }}>
                      {(fd.footerLinks || []).filter(l => l.label).map(lnk => (
                        <span key={lnk.id} style={{ fontFamily: bf, fontSize: 'var(--site-font-body-sm)', textDecoration: 'underline', cursor: 'pointer' }}>{lnk.label}</span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </HighlightContainer>

      </div> {/* data-gov-content */}

    </div>
  );
}
