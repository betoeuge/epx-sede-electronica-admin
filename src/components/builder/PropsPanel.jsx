'use client';
import React, { useState, useEffect } from 'react';
import { HEADER_STYLES, FOOTER_STYLES, DEFAULT_FOOTER_DATA, THEMES, TITLE_FONTS, BODY_FONTS } from './editorConstants';
import { Accordion, NavAccordion } from './Accordion';
import { Selector } from './Selector';
import { ToggleSwitch } from './ToggleSwitch';
import { SECTION_REGISTRY } from './sectionRegistry';
import { ImageUploader } from './EditorControls';
import { CustomColorPicker } from './CustomColorPicker';

function loadGoogleFont(fontName) {
  if (!fontName || typeof window === 'undefined') return;
  const id = `gf-${fontName.replace(/\s+/g, '-').toLowerCase()}`;
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id; link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, '+')}:wght@300;400;500;600;700&display=swap`;
  document.head.appendChild(link);
}

function LogoUploader({ label, toggleValue, onToggle, imageUrl, defaultImage, onUpload, defaultLabel }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
      <ToggleSwitch 
        label={label} 
        checked={toggleValue} 
        onChange={onToggle} 
        activeColor="var(--color-selection)"
      />
      <ImageUploader
        imageUrl={imageUrl || defaultImage || ''}
        onUpload={onUpload}
        defaultLabel={defaultLabel || 'Logo'}
        previewFit="contain"
        placeholder="URL del logo..."
      />
    </div>
  );
}

const SM_PLATFORMS = {
  twitter:   { label: 'X / Twitter', color: '#1D9BF0', icon: <svg width={13} height={13} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
  instagram: { label: 'Instagram',   color: '#E1306C', icon: <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg> },
  facebook:  { label: 'Facebook',    color: '#1877F2', icon: <svg width={13} height={13} viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073C24 5.406 18.627 0 12 0S0 5.406 0 12.073C0 18.1 4.388 23.095 10.125 24v-8.437H7.078v-3.49h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.095 24 18.1 24 12.073z"/></svg> },
  youtube:   { label: 'YouTube',     color: '#FF0000', icon: <svg width={13} height={13} viewBox="0 0 24 24" fill="currentColor"><path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg> },
  linkedin:  { label: 'LinkedIn',    color: '#0A66C2', icon: <svg width={13} height={13} viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
  tiktok:    { label: 'TikTok',      color: '#69C9D0', icon: <svg width={13} height={13} viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z"/></svg> },
};

function SocialMediaCard({ sm, i, fd, onFooterDataChange, inputSt, delBtnSt, hoverDel, TrashIcon, addBtnSt }) {
  const [open, setOpen] = useState(false);
  const plat = SM_PLATFORMS[sm.platform] || SM_PLATFORMS.twitter;
  return (
    <div style={{ background: 'var(--bg-hover)', borderRadius: '0.5rem', overflow: 'visible', border: '0.0625rem solid var(--border-subtle)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.625rem', borderBottom: '0.0625rem solid var(--border-subtle)', background: 'rgba(0,0,0,0.2)', borderRadius: '0.5rem 0.5rem 0 0' }}>
        <div style={{ width: '1.5rem', height: '1.5rem', borderRadius: '0.375rem', background: plat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>{plat.icon}</div>
        {/* Custom dropdown trigger */}
        <button onClick={() => setOpen(o => !o)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.05)', border: '0.0625rem solid var(--border-subtle)', borderRadius: '0.375rem', padding: '0.25rem 0.5rem', cursor: 'pointer', color: 'var(--text-active)', fontFamily: "'Inter', sans-serif", fontSize: '0.8125rem', fontWeight: 500 }}>
          <span>{plat.label}</span>
          <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s', flexShrink: 0 }}><path d="M6 9l6 6 6-6"/></svg>
        </button>
        <button style={delBtnSt} onClick={() => onFooterDataChange('socialMedia', fd.socialMedia.filter(x => x.id !== sm.id))} onMouseEnter={e => hoverDel(e, true)} onMouseLeave={e => hoverDel(e, false)}><TrashIcon size={12} /></button>
      </div>
      {/* Dropdown menu */}
      {open && (
        <div style={{ position: 'relative', zIndex: 50 }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, background: 'var(--bg-main)', border: '0.0625rem solid var(--border-subtle)', borderRadius: '0.5rem', boxShadow: '0 0.5rem 1.5rem rgba(0,0,0,0.4)', overflow: 'hidden' }}>
            {Object.entries(SM_PLATFORMS).map(([key, p]) => (
              <button key={key} onClick={() => { const ns = [...fd.socialMedia]; ns[i] = { ...sm, platform: key }; onFooterDataChange('socialMedia', ns); setOpen(false); }}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', background: sm.platform === key ? 'rgba(255,255,255,0.06)' : 'transparent', border: 'none', cursor: 'pointer', transition: 'background 0.1s', color: sm.platform === key ? 'var(--text-active)' : 'var(--text-dim)', fontFamily: "'Inter', sans-serif", fontSize: '0.8125rem', textAlign: 'left' }}
                onMouseEnter={e => { if (sm.platform !== key) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { if (sm.platform !== key) e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ width: '1.25rem', height: '1.25rem', borderRadius: '0.25rem', background: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>{p.icon}</div>
                {p.label}
                {sm.platform === key && <svg style={{ marginLeft: 'auto' }} width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>}
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Handle + URL */}
      <div style={{ padding: '0.625rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-darker)', borderRadius: '0.5rem', border: '0.0625rem solid var(--border-subtle)', overflow: 'hidden' }}>
          <span style={{ padding: '0 0.5rem', color: 'var(--text-dim)', fontSize: '0.875rem', fontFamily: "'Inter', sans-serif", borderRight: '0.0625rem solid var(--border-subtle)', height: '100%', display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.03)', flexShrink: 0, userSelect: 'none' }}>@</span>
          <input value={(sm.handle || '').replace(/^@/, '')} onChange={e => { const ns = [...fd.socialMedia]; ns[i] = { ...sm, handle: '@' + e.target.value.replace(/^@/, '') }; onFooterDataChange('socialMedia', ns); }} style={{ ...inputSt, border: 'none', borderRadius: 0, background: 'transparent', outline: 'none', flex: 1, padding: '0.5rem 0.625rem' }} placeholder="entidad" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-darker)', borderRadius: '0.5rem', border: '0.0625rem solid var(--border-subtle)', overflow: 'hidden' }}>
          <span style={{ padding: '0 0.5rem', color: 'var(--text-dim)', fontSize: '0.75rem', borderRight: '0.0625rem solid var(--border-subtle)', height: '100%', display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.03)', flexShrink: 0, userSelect: 'none' }}>
            <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
          </span>
          <input value={sm.url || ''} onChange={e => { const ns = [...fd.socialMedia]; ns[i] = { ...sm, url: e.target.value }; onFooterDataChange('socialMedia', ns); }} style={{ ...inputSt, border: 'none', borderRadius: 0, background: 'transparent', outline: 'none', flex: 1, padding: '0.5rem 0.625rem', fontSize: '0.8125rem' }} placeholder="https://..." />
        </div>
      </div>
    </div>
  );
}

export function PropsPanel({
  editorState,
  onFontTitles,
  onFontBody,
  onTheme,
  onPrimary,
  onAccent,
  onPageTemplateChange,
  onNavigationChange,
  onHeaderStyleChange,
  onHeaderConfigChange,
  onHeaderTextsChange,
  onFooterStyleChange,
  onFooterDataChange,
  onAccessibilityDataChange,
  onLeftLinksDataChange,
  onSectionConfigChange,
  selectedSectionId,
  width = 300
}) {
  const [currentView, setCurrentView] = useState('main'); // 'main' or 'navigation'
  const [openPanels, setOpenPanels] = useState({
    menu: true,
    headerType: true,
    headerLogos: true,
    footerType: true,
    footerVisibility: false,
    footerMain: false,
    footerSedes: false,
    footerContacts: false,
    footerSocial: false,
    footerLinks: false,
    accessibility: false,
    leftLinks: false,
    fuentes: false,
    tema: false,
  });
  const [openNavId, setOpenNavId] = useState(null);
  const [draggingId, setDraggingId] = useState(null);

  useEffect(() => {
    if (selectedSectionId && selectedSectionId !== 'header' && selectedSectionId !== 'footer') {
      setCurrentView('main');
    }
  }, [selectedSectionId]);

  const togglePanel = (key) => setOpenPanels(p => ({ ...p, [key]: !p[key] }));

  const handleDragStart = (id) => {
    setDraggingId(id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (targetId) => {
    if (draggingId === null || draggingId === targetId) return;
    
    const newNav = [...editorState.navigation];
    const dragIndex = newNav.findIndex(n => n.id === draggingId);
    const dropIndex = newNav.findIndex(n => n.id === targetId);
    
    const [draggedItem] = newNav.splice(dragIndex, 1);
    newNav.splice(dropIndex, 0, draggedItem);
    
    onNavigationChange(newNav);
    setDraggingId(null);
  };

  const removeNavTab = (id) => {
    const newNav = (editorState.navigation || []).filter(n => n.id !== id);
    onNavigationChange(newNav);
  };

  if (currentView === 'navigation') {
    const inputStyle = { background: 'var(--bg-darker)', border: '0.0625rem solid var(--border-subtle)', borderRadius: '0.5rem', padding: '0.5rem 0.875rem', color: 'var(--text-dim)', fontSize: '1rem', fontFamily: "'Inter', sans-serif", width: '100%', boxSizing: 'border-box', outline: 'none' };
    const selectStyle = { ...inputStyle, appearance: 'none', cursor: 'pointer', paddingRight: '2rem', backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23828282' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '0.625rem' };
    const lblStyle = { fontFamily: "'Inter', sans-serif", fontSize: '0.875rem', fontWeight: 400, color: 'var(--text-muted)' };

    const updateNavItem = (navId, updates) => {
      const newNav = editorState.navigation.map(n => n.id === navId ? { ...n, ...updates } : n);
      onNavigationChange(newNav);
    };
    const addChildToDropdown = (navId) => {
      const newNav = editorState.navigation.map(n => {
        if (n.id !== navId) return n;
        return { ...n, children: [...(n.children || []), { id: `child-${Date.now()}`, label: 'Sub-item', target: '' }] };
      });
      onNavigationChange(newNav);
    };
    const removeChild = (navId, childId) => {
      const newNav = editorState.navigation.map(n => {
        if (n.id !== navId) return n;
        return { ...n, children: (n.children || []).filter(c => c.id !== childId) };
      });
      onNavigationChange(newNav);
    };
    const updateChild = (navId, childId, updates) => {
      const newNav = editorState.navigation.map(n => {
        if (n.id !== navId) return n;
        return { ...n, children: (n.children || []).map(c => c.id === childId ? { ...c, ...updates } : c) };
      });
      onNavigationChange(newNav);
    };

    return (
       <div style={{ width: width, flexShrink: 0, background: 'var(--bg-main)', borderLeft: '0.0625rem solid var(--border-subtle)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          {/* Header */}
          <div style={{ background: 'var(--bg-darker)', borderBottom: '0.0625rem solid var(--border-subtle)', display: 'flex', alignItems: 'center', padding: '0 1rem', gap: '0.75rem', height: '3.125rem', boxSizing: 'border-box', flexShrink: 0 }}>
             <button onClick={() => setCurrentView('main')} style={{ background: 'rgba(255,255,255,0.08)', border: '0.0625rem solid var(--border-subtle)', borderRadius: '0.25rem', width: '1.75rem', height: '1.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, padding: 0 }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}>
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
             </button>
             <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.9375rem', fontWeight: 500, color: 'var(--text-active)', flex: 1 }}>Menú de Navegación</span>
             <button onClick={() => {
                const newId = 'n-' + Date.now();
                onNavigationChange([...(editorState.navigation || []), { id: newId, label: 'Nuevo Tab', type: 'simple', target: '' }]);
                setOpenNavId(newId);
             }} style={{ background: 'rgba(255,255,255,0.25)', border: 'none', borderRadius: '0.25rem', width: '1.75rem', height: '1.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round"/></svg>
             </button>
          </div>
          {/* List of tabs */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {(editorState.navigation || []).map((nav, index) => {
              const navType = nav.type || 'simple';
              return (
              <NavAccordion 
                 key={nav.id} 
                 title={nav.label || `Tab ${index + 1}`} 
                 isOpen={openNavId === nav.id} 
                 onToggle={() => setOpenNavId(openNavId === nav.id ? null : nav.id)}
                 onRemove={() => removeNavTab(nav.id)}
                 onDragStart={() => handleDragStart(nav.id)}
                 onDragOver={handleDragOver}
                 onDrop={() => handleDrop(nav.id)}
              >
                 {/* Tipo */}
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem'}}>
                   <span style={lblStyle}>Tipo</span>
                   <select
                     value={navType}
                     onChange={e => {
                       const newType = e.target.value;
                       if (newType === 'dropdown') {
                         updateNavItem(nav.id, { type: 'dropdown', target: null, children: nav.children || [] });
                       } else {
                         updateNavItem(nav.id, { type: 'simple', target: nav.target || '', children: undefined });
                       }
                     }}
                     style={selectStyle}
                   >
                     <option value="simple">Simple</option>
                     <option value="dropdown">Dropdown</option>
                   </select>
                 </div>
                 
                 {/* Nombre */}
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem'}}>
                   <span style={lblStyle}>Nombre</span>
                   <input 
                     value={nav.label} 
                     onChange={e => updateNavItem(nav.id, { label: e.target.value })}
                     style={inputStyle}
                   />
                 </div>

                 {/* Hyper Vinculo (solo Simple) */}
                 {navType === 'simple' && (
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem'}}>
                     <span style={lblStyle}>Hyper Vinculo</span>
                     <div style={{ position: 'relative' }}>
                       <select 
                         value={nav.target || ''} 
                         onChange={e => updateNavItem(nav.id, { target: e.target.value })}
                         style={selectStyle}
                       >
                         <option value="">Añadir vinculo</option>
                         {editorState.pages.map(p => (
                           <option key={p.id} value={p.id}>/{p.label}</option>
                         ))}
                       </select>
                     </div>
                   </div>
                 )}

                 {/* Children (solo Dropdown) */}
                 {navType === 'dropdown' && (
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                     <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                       <span style={lblStyle}>Sub-items</span>
                       <button 
                         onClick={() => addChildToDropdown(nav.id)}
                         style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '0.25rem', width: '1.5rem', height: '1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                       >
                         <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="var(--text-active)" strokeWidth="2.5"><path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round"/></svg>
                       </button>
                     </div>
                     {(nav.children || []).length === 0 && (
                       <div style={{ padding: '0.75rem', background: 'var(--bg-hover)', borderRadius: '0.375rem', textAlign: 'center' }}>
                         <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', color: 'var(--text-dim)' }}>Sin sub-items. Clic en + para agregar.</span>
                       </div>
                     )}
                     {(nav.children || []).map(child => (
                       <div key={child.id} style={{ background: 'var(--bg-hover)', borderRadius: '0.375rem', padding: '0.5rem 0.625rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                         {/* Header row: label + trash */}
                         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                           <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.6875rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Sub-item</span>
                           <div
                             onClick={() => removeChild(nav.id, child.id)}
                             style={{ padding: '0.25rem', borderRadius: '0.25rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)' }}
                             onMouseEnter={e => { e.currentTarget.style.background = 'rgba(235,87,87,0.15)'; e.currentTarget.style.color = '#eb5757'; }}
                             onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-dim)'; }}
                             title="Eliminar sub-item"
                           >
                             <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                           </div>
                         </div>
                         <input
                           value={child.label}
                           onChange={e => updateChild(nav.id, child.id, { label: e.target.value })}
                           placeholder="Nombre"
                           style={{ ...inputStyle, fontSize: '0.8125rem', padding: '0.375rem 0.625rem' }}
                         />
                         <select
                           value={child.target || ''}
                           onChange={e => updateChild(nav.id, child.id, { target: e.target.value })}
                           style={{ ...selectStyle, fontSize: '0.8125rem', padding: '0.375rem 0.625rem' }}
                         >
                           <option value="">Añadir vinculo</option>
                           {editorState.pages.map(p => (
                             <option key={p.id} value={p.id}>/{p.label}</option>
                           ))}
                         </select>
                       </div>
                     ))}
                   </div>
                 )}
              </NavAccordion>
              );
            })}
          </div>
       </div>
    );
  }

  if (selectedSectionId === 'header') {
    const hasRightLogo = !(editorState.headerConfig?.loginLink === true);

    return (
      <div style={{ width: width, flexShrink: 0, background: 'var(--bg-main)', borderLeft: '0.0625rem solid var(--border-subtle)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <div style={{ background: 'var(--bg-darker)', borderBottom: '0.0625rem solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 1rem', height: '3.125rem', boxSizing: 'border-box', flexShrink: 0 }}>
           <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.9375rem', fontWeight: 500, color: 'var(--text-active)' }}>Header</span>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Accordion title="Tipo de Header" isOpen={openPanels.headerType ?? true} onToggle={() => togglePanel('headerType')}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.875rem', color: 'var(--text-active)' }}>Variaciones</span>
              <Selector
                value={editorState.headerStyle || 'sedes-electronicas'}
                options={Object.keys(HEADER_STYLES)}
                onChange={onHeaderStyleChange}
                displayMap={HEADER_STYLES}
              />
            </div>
          </Accordion>

          <Accordion title="Logos" isOpen={openPanels.headerLogos ?? true} onToggle={() => togglePanel('headerLogos')}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              {/* Logo izquierda */}
              <LogoUploader 
                label="Logo izquierda"
                toggleValue={editorState.headerConfig?.logos ?? true}
                onToggle={(val) => onHeaderConfigChange('logos', val)}
                imageUrl={editorState.headerConfig?.logoLeftUrl}
                defaultImage="https://i.ibb.co/3s4KqXq/potencia.png"
                defaultLabel="Logo Gov"
                onUpload={(url) => onHeaderConfigChange('logoLeftUrl', url)}
              />

              {/* Logo derecha (hide if loginLink = true) */}
              {hasRightLogo && (
                <LogoUploader 
                  label="Logo derecha"
                  toggleValue={editorState.headerConfig?.rightLogo ?? true}
                  onToggle={(val) => onHeaderConfigChange('rightLogo', val)}
                  imageUrl={editorState.headerConfig?.logoRightUrl}
                  defaultImage="https://i.ibb.co/68ZJpKx/min.png"
                  defaultLabel="Logo Min"
                  onUpload={(url) => onHeaderConfigChange('logoRightUrl', url)}
                />
              )}
            </div>
          </Accordion>

          <Accordion title="Navegación" isOpen={openPanels.menu ?? true} onToggle={() => togglePanel('menu')}>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', color: 'var(--text-dim)', margin: 0, marginBottom: '0.5rem' }}>
              Agrega y edita los nombres del menú de navegación.
            </p>
            <div 
               onClick={() => setCurrentView('navigation')}
               style={{ background: 'var(--bg-hover)', borderRadius: '0.25rem', padding: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
            >
               <span style={{ flex: 1, fontFamily: "'Nunito Sans', sans-serif", fontSize: '0.875rem', color: 'var(--text-active)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                 {(editorState.navigation || []).length} Tabs
               </span>
               <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="var(--text-active)" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            </div>
          </Accordion>
        </div>
      </div>
    );
  }

  if (selectedSectionId === 'footer') {
    const fd = { ...DEFAULT_FOOTER_DATA, ...(editorState.footerData || {}) };
    const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    // ── Unified style tokens (matches navigation editor) ──
    const inputSt = { background: 'var(--bg-darker)', border: '0.0625rem solid var(--border-subtle)', borderRadius: '0.5rem', padding: '0.5rem 0.875rem', color: 'var(--text-dim)', fontSize: '0.875rem', fontFamily: "'Inter', sans-serif", width: '100%', boxSizing: 'border-box', outline: 'none', transition: 'border-color 0.15s' };
    const labelInputSt = { ...inputSt, fontSize: '0.8125rem', color: 'var(--text-muted)', background: 'var(--bg-darker)' };
    const cardSt = { background: 'var(--bg-hover)', borderRadius: '0.5rem', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' };
    const addBtnSt = { background: 'transparent', border: '0.0625rem dashed var(--border-subtle)', borderRadius: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'border-color 0.15s, background 0.15s' };
    const addBtnSmSt = { ...addBtnSt, height: '1.5rem', width: '1.5rem', border: 'none', background: 'rgba(255,255,255,0.06)', borderRadius: '0.25rem' };
    const delBtnSt = { padding: '0.375rem', borderRadius: '0.375rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)', background: 'none', border: 'none', transition: 'background 0.15s, color 0.15s' };
    const hoverDel = (e, enter) => { e.currentTarget.style.background = enter ? 'rgba(235,87,87,0.15)' : 'transparent'; e.currentTarget.style.color = enter ? '#eb5757' : 'var(--text-dim)'; };
    const TrashIcon = ({ size = 14 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>;
    const PlusIcon = () => <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    const SectionLabel = ({ text }) => <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.8125rem', fontWeight: 400, color: 'var(--text-muted)' }}>{text}</span>;

    return (
      <div style={{ width: width, flexShrink: 0, background: 'var(--bg-main)', borderLeft: '0.0625rem solid var(--border-subtle)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <div style={{ background: 'var(--bg-darker)', borderBottom: '0.0625rem solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 1rem', height: '3.125rem', boxSizing: 'border-box', flexShrink: 0 }}>
           <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.9375rem', fontWeight: 500, color: 'var(--text-active)' }}>Footer</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Tipo de Footer */}
          <Accordion title="Tipo de Footer" isOpen={openPanels.footerType ?? true} onToggle={() => togglePanel('footerType')}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
              <Selector
                value={editorState.footerStyle || 'version01'}
                options={Object.keys(FOOTER_STYLES)}
                onChange={onFooterStyleChange}
                displayMap={FOOTER_STYLES}
              />
            </div>
          </Accordion>

          {/* Version badge */}
          {(() => {
            const isV1 = (editorState.footerStyle || 'version01') === 'version01';
            return (
              <>
                {/* Visibilidad — differs per version */}
                <Accordion title="Secciones Visibles" isOpen={openPanels.footerVisibility ?? false} onToggle={() => togglePanel('footerVisibility')}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {isV1 && <ToggleSwitch label="Sedes adicionales" checked={fd.showSedes ?? true} onChange={v => onFooterDataChange('showSedes', v)} />}
                    <ToggleSwitch label="Contacto" checked={fd.showContacts ?? true} onChange={v => onFooterDataChange('showContacts', v)} />
                    <ToggleSwitch label="Redes sociales" checked={fd.showSocialMedia ?? true} onChange={v => onFooterDataChange('showSocialMedia', v)} />
                    {isV1 && <ToggleSwitch label="Links del footer" checked={fd.showFooterLinks ?? true} onChange={v => onFooterDataChange('showFooterLinks', v)} />}
                  </div>
                </Accordion>
              </>
            );
          })()}

          {/* Info Principal */}
          {(() => {
            const isV1b = (editorState.footerStyle || 'version01') === 'version01';
            const v2Hint = !isV1b && <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', color: 'var(--text-dim)', margin: 0, marginBottom: '0.25rem' }}>El footer compacto muestra máximo 3 campos de información.</p>;
            return (
          <Accordion title="Información Principal" isOpen={openPanels.footerMain ?? false} onToggle={() => togglePanel('footerMain')}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {v2Hint}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                <SectionLabel text="Nombre de entidad" />
                <input value={fd.entityFullName || ''} onChange={e => onFooterDataChange('entityFullName', e.target.value)} style={inputSt} placeholder="Nombre de la entidad" />
              </div>
              {isV1b && <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                <SectionLabel text="Título sede principal" />
                <input value={fd.mainOfficeTitle || ''} onChange={e => onFooterDataChange('mainOfficeTitle', e.target.value)} style={inputSt} placeholder="Sede principal" />
              </div>}

              {/* Campos dinámicos */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.25rem' }}>
                <SectionLabel text="Campos de información" />
                <button style={addBtnSmSt} onClick={() => onFooterDataChange('mainFields', [...(fd.mainFields || []), { id: uid(), value: '' }])}><PlusIcon /></button>
              </div>
              {(fd.mainFields || []).map((f, i) => (
                <div key={f.id} style={{ display: 'flex', gap: '0.375rem', alignItems: 'center' }}>
                  <input value={f.value} onChange={e => { const nf = [...fd.mainFields]; nf[i] = { ...f, value: e.target.value }; onFooterDataChange('mainFields', nf); }} style={{ ...inputSt, flex: 1 }} placeholder="Campo de texto..." />
                  <button style={delBtnSt} onClick={() => onFooterDataChange('mainFields', fd.mainFields.filter(x => x.id !== f.id))} onMouseEnter={e => hoverDel(e, true)} onMouseLeave={e => hoverDel(e, false)}><TrashIcon /></button>
                </div>
              ))}

              {isV1b && <>
              {/* Emails — V1 only */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                <SectionLabel text="Correos electrónicos" />
                <button style={addBtnSmSt} onClick={() => onFooterDataChange('mainEmails', [...(fd.mainEmails || []), { id: uid(), label: 'Correo', value: '' }])}><PlusIcon /></button>
              </div>
              {(fd.mainEmails || []).map((em, i) => (
                <div key={em.id} style={cardSt}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.6875rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Etiqueta</span>
                    <button style={delBtnSt} onClick={() => onFooterDataChange('mainEmails', fd.mainEmails.filter(x => x.id !== em.id))} onMouseEnter={e => hoverDel(e, true)} onMouseLeave={e => hoverDel(e, false)}><TrashIcon size={12} /></button>
                  </div>
                  <input value={em.label} onChange={e => { const ne = [...fd.mainEmails]; ne[i] = { ...em, label: e.target.value }; onFooterDataChange('mainEmails', ne); }} style={labelInputSt} placeholder="Ej: Correo institucional" />
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.6875rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.03em', marginTop: '0.125rem' }}>Dirección</span>
                  <input value={em.value} onChange={e => { const ne = [...fd.mainEmails]; ne[i] = { ...em, value: e.target.value }; onFooterDataChange('mainEmails', ne); }} style={inputSt} placeholder="correo@entidad.gov.co" />
                </div>
              ))}
              </>}
            </div>
          </Accordion>
            );
          })()}

          {/* Sedes — V1 only */}
          {(editorState.footerStyle || 'version01') === 'version01' && <Accordion title={`Sedes (${(fd.sedes || []).length})`} isOpen={openPanels.footerSedes ?? false} onToggle={() => togglePanel('footerSedes')}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {(fd.sedes || []).map((sede, si) => (
                <div key={sede.id} style={cardSt}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.6875rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{`Sede ${si + 1}`}</span>
                    <button style={delBtnSt} onClick={() => onFooterDataChange('sedes', fd.sedes.filter(x => x.id !== sede.id))} onMouseEnter={e => hoverDel(e, true)} onMouseLeave={e => hoverDel(e, false)}><TrashIcon size={12} /></button>
                  </div>
                  <input value={sede.title} onChange={e => { const ns = [...fd.sedes]; ns[si] = { ...sede, title: e.target.value }; onFooterDataChange('sedes', ns); }} style={inputSt} placeholder="Título de la sede" />
                  {(sede.fields || []).map((f, fi) => (
                    <div key={f.id} style={{ display: 'flex', gap: '0.375rem', alignItems: 'center' }}>
                      <input value={f.value} onChange={e => { const ns = [...fd.sedes]; const nf = [...sede.fields]; nf[fi] = { ...f, value: e.target.value }; ns[si] = { ...sede, fields: nf }; onFooterDataChange('sedes', ns); }} style={{ ...inputSt, flex: 1 }} placeholder="Campo..." />
                      <button style={delBtnSt} onClick={() => { const ns = [...fd.sedes]; ns[si] = { ...sede, fields: sede.fields.filter(x => x.id !== f.id) }; onFooterDataChange('sedes', ns); }} onMouseEnter={e => hoverDel(e, true)} onMouseLeave={e => hoverDel(e, false)}><TrashIcon size={12} /></button>
                    </div>
                  ))}
                  <button onClick={() => { const ns = [...fd.sedes]; ns[si] = { ...sede, fields: [...(sede.fields || []), { id: uid(), value: '' }] }; onFooterDataChange('sedes', ns); }} style={{ ...addBtnSt, width: '100%', padding: '0.375rem', fontSize: '0.75rem', fontFamily: "'Inter', sans-serif", color: 'var(--text-dim)' }}>+ Campo</button>
                </div>
              ))}
              <button onClick={() => onFooterDataChange('sedes', [...(fd.sedes || []), { id: uid(), title: `Sede ${(fd.sedes || []).length + 1}`, fields: [{ id: uid(), value: 'Dirección: ...' }] }])} style={{ ...addBtnSt, width: '100%', padding: '0.625rem', fontSize: '0.8125rem', fontFamily: "'Inter', sans-serif", color: 'var(--text-active)' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>+ Agregar sede</button>
            </div>
          </Accordion>}

          {/* Contactos */}
          <Accordion title={`Contacto (${(fd.contacts || []).length})`} isOpen={openPanels.footerContacts ?? false} onToggle={() => togglePanel('footerContacts')}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {(fd.contacts || []).map((ct, ci) => (
                <div key={ct.id} style={cardSt}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.6875rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{`Contacto ${ci + 1}`}</span>
                    <button style={delBtnSt} onClick={() => onFooterDataChange('contacts', fd.contacts.filter(x => x.id !== ct.id))} onMouseEnter={e => hoverDel(e, true)} onMouseLeave={e => hoverDel(e, false)}><TrashIcon size={12} /></button>
                  </div>
                  <input value={ct.title} onChange={e => { const nc = [...fd.contacts]; nc[ci] = { ...ct, title: e.target.value }; onFooterDataChange('contacts', nc); }} style={inputSt} placeholder="Título" />
                  {(ct.fields || []).map((f, fi) => (
                    <div key={f.id} style={{ display: 'flex', gap: '0.375rem', alignItems: 'center' }}>
                      <input value={f.value} onChange={e => { const nc = [...fd.contacts]; const nf = [...ct.fields]; nf[fi] = { ...f, value: e.target.value }; nc[ci] = { ...ct, fields: nf }; onFooterDataChange('contacts', nc); }} style={{ ...inputSt, flex: 1 }} placeholder="Campo..." />
                      <button style={delBtnSt} onClick={() => { const nc = [...fd.contacts]; nc[ci] = { ...ct, fields: ct.fields.filter(x => x.id !== f.id) }; onFooterDataChange('contacts', nc); }} onMouseEnter={e => hoverDel(e, true)} onMouseLeave={e => hoverDel(e, false)}><TrashIcon size={12} /></button>
                    </div>
                  ))}
                  <button onClick={() => { const nc = [...fd.contacts]; nc[ci] = { ...ct, fields: [...(ct.fields || []), { id: uid(), value: '' }] }; onFooterDataChange('contacts', nc); }} style={{ ...addBtnSt, width: '100%', padding: '0.375rem', fontSize: '0.75rem', fontFamily: "'Inter', sans-serif", color: 'var(--text-dim)' }}>+ Campo</button>
                  {/* Email */}
                  <div style={{ borderTop: '0.0625rem solid var(--border-subtle)', paddingTop: '0.5rem', marginTop: '0.25rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.6875rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Etiqueta del correo</span>
                    <input value={ct.email?.label || ''} onChange={e => { const nc = [...fd.contacts]; nc[ci] = { ...ct, email: { ...(ct.email || {}), label: e.target.value } }; onFooterDataChange('contacts', nc); }} style={labelInputSt} placeholder="Ej: Correo institucional" />
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.6875rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Dirección de correo</span>
                    <input value={ct.email?.value || ''} onChange={e => { const nc = [...fd.contacts]; nc[ci] = { ...ct, email: { ...(ct.email || {}), value: e.target.value } }; onFooterDataChange('contacts', nc); }} style={inputSt} placeholder="correo@entidad.gov.co" />
                  </div>
                </div>
              ))}
              <button onClick={() => onFooterDataChange('contacts', [...(fd.contacts || []), { id: uid(), title: 'Contacto', fields: [{ id: uid(), value: '' }], email: { label: 'Correo institucional', value: '' } }])} style={{ ...addBtnSt, width: '100%', padding: '0.625rem', fontSize: '0.8125rem', fontFamily: "'Inter', sans-serif", color: 'var(--text-active)' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>+ Agregar contacto</button>
            </div>
          </Accordion>

          {/* Redes Sociales */}
          <Accordion title="Redes Sociales" isOpen={openPanels.footerSocial ?? false} onToggle={() => togglePanel('footerSocial')}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {(fd.socialMedia || []).map((sm, i) => (
                <SocialMediaCard key={sm.id} sm={sm} i={i} fd={fd} onFooterDataChange={onFooterDataChange} inputSt={inputSt} delBtnSt={delBtnSt} hoverDel={hoverDel} TrashIcon={TrashIcon} addBtnSt={addBtnSt} />
              ))}
              <button onClick={() => onFooterDataChange('socialMedia', [...(fd.socialMedia || []), { id: uid(), platform: 'twitter', handle: '@', url: '' }])} style={{ ...addBtnSt, width: '100%', padding: '0.625rem', fontSize: '0.8125rem', fontFamily: "'Inter', sans-serif", color: 'var(--text-active)' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>+ Agregar red social</button>
            </div>
          </Accordion>

          {/* Links */}
          <Accordion title={`Links (${(fd.footerLinks || []).length})`} isOpen={openPanels.footerLinks ?? false} onToggle={() => togglePanel('footerLinks')}>
            {(editorState.footerStyle || 'version01') === 'version02' && (
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', color: 'var(--text-dim)', margin: '0 0 0.5rem' }}>
                En este footer aparecen dentro de la columna de Contacto.
              </p>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {(fd.footerLinks || []).map((lnk, i) => (
                <div key={lnk.id} style={cardSt}>
                  <div style={{ display: 'flex', gap: '0.375rem', alignItems: 'center' }}>
                    <input value={lnk.label} onChange={e => { const nl = [...fd.footerLinks]; nl[i] = { ...lnk, label: e.target.value }; onFooterDataChange('footerLinks', nl); }} style={{ ...inputSt, flex: 1 }} placeholder="Texto del link" />
                    <button style={delBtnSt} onClick={() => onFooterDataChange('footerLinks', fd.footerLinks.filter(x => x.id !== lnk.id))} onMouseEnter={e => hoverDel(e, true)} onMouseLeave={e => hoverDel(e, false)}><TrashIcon size={12} /></button>
                  </div>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.6875rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>URL</span>
                  <input value={lnk.url} onChange={e => { const nl = [...fd.footerLinks]; nl[i] = { ...lnk, url: e.target.value }; onFooterDataChange('footerLinks', nl); }} style={labelInputSt} placeholder="URL (ej: /pagina o https://...)" />
                </div>
              ))}
              <button onClick={() => onFooterDataChange('footerLinks', [...(fd.footerLinks || []), { id: uid(), label: '', url: '#' }])} style={{ ...addBtnSt, width: '100%', padding: '0.625rem', fontSize: '0.8125rem', fontFamily: "'Inter', sans-serif", color: 'var(--text-active)' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>+ Agregar link</button>
            </div>
          </Accordion>

          {/* Reset */}
          <div style={{ padding: '1rem', display: 'flex', justifyContent: 'center' }}>
            <button
              onClick={() => onFooterDataChange('RESET_ALL', null)}
              style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', color: 'var(--text-dim)', background: 'var(--bg-hover)', border: '0.0625rem solid var(--border-subtle)', borderRadius: '0.375rem', padding: '0.5rem 1rem', cursor: 'pointer', transition: 'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-active)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-hover)'}
            >
              Restaurar valores por defecto
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Check if it's a dynamic section from the registry
  if (selectedSectionId && selectedSectionId !== 'header' && selectedSectionId !== 'footer') {
    const activePage = editorState.pages.find(p => p.id === editorState.activePageId);
    const section = activePage?.sections?.find(s => s.id === selectedSectionId);
    
    if (section && SECTION_REGISTRY[section.type]) {
      const SectionEditor = SECTION_REGISTRY[section.type].PropsEditor;
      return (
        <div style={{ width: width, flexShrink: 0, background: 'var(--bg-main)', borderLeft: '0.0625rem solid var(--border-subtle)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          <div style={{ background: 'var(--bg-darker)', borderBottom: '0.0625rem solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 1rem', height: '3.125rem', boxSizing: 'border-box', flexShrink: 0 }}>
             <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.9375rem', fontWeight: 500, color: 'white' }}>
               Editar {section.name}
             </span>
          </div>
          {SectionEditor ? (
            <SectionEditor 
              config={section.config || {}} 
              onChange={(newConfig) => onSectionConfigChange(section.id, newConfig)}
              editorState={editorState}
            />
          ) : (
            <div style={{ padding: '1rem', color: 'var(--text-dim)', fontSize: '0.875rem' }}>
              Esta sección no tiene propiedades editables.
            </div>
          )}
        </div>
      );
    }
  }

  const THEME_NAMES = Object.keys(THEMES);

  // Default: nothing selected — show general site style settings
  return (
    <div style={{ width, flexShrink: 0, background: 'var(--bg-main)', borderLeft: '0.0625rem solid var(--border-subtle)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>

      <Accordion title="Accesibilidad" isOpen={openPanels.accessibility} onToggle={() => togglePanel('accessibility')}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.8125rem', color: 'var(--text-active)' }}>Mostrar barra de accesibilidad</span>
            <ToggleSwitch
              checked={(editorState.accessibilityData?.enabled) !== false}
              onChange={v => onAccessibilityDataChange?.('enabled', v)}
            />
          </div>
        </div>
      </Accordion>

      <Accordion title="Barra Izquierda (Enlaces)" isOpen={openPanels.leftLinks} onToggle={() => togglePanel('leftLinks')}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.8125rem', color: 'var(--text-active)' }}>Mostrar barra izquierda</span>
            <ToggleSwitch
              checked={(editorState.leftLinksData?.enabled) === true}
              onChange={v => onLeftLinksDataChange?.('enabled', v)}
            />
          </div>
        </div>
      </Accordion>

      <Accordion title="Fuentes del sitio" isOpen={openPanels.fuentes} onToggle={() => togglePanel('fuentes')}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.875rem', color: 'var(--text-active)' }}>Títulos</span>
          <Selector
            value={editorState.fontTitles || 'Nunito Sans'}
            options={TITLE_FONTS}
            onChange={v => { loadGoogleFont(v); onFontTitles?.(v); }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.75rem' }}>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.875rem', color: 'var(--text-active)' }}>Textos</span>
          <Selector
            value={editorState.fontBody || 'Verdana'}
            options={BODY_FONTS}
            onChange={v => { loadGoogleFont(v); onFontBody?.(v); }}
          />
        </div>
      </Accordion>

      <Accordion title="Tema del sitio" isOpen={openPanels.tema} onToggle={() => togglePanel('tema')}>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', color: 'var(--text-active)', margin: '0 0 0.5rem' }}>
          Selecciona un tema relacionado a la entidad del sitio
        </p>
        <Selector
          value={editorState.themeName || 'GOV.CO'}
          options={[...THEME_NAMES, 'Costumizado']}
          onChange={onTheme}
        />
        {editorState.themeName === 'Costumizado' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.75rem' }}>
            <CustomColorPicker label="Color principal" value={editorState.primary} onChange={onPrimary} />
            <CustomColorPicker label="Color complementario" value={editorState.accent} onChange={onAccent} />
          </div>
        )}
      </Accordion>
    </div>
  );
}
