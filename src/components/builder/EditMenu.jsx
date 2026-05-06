'use client';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { SECTION_REGISTRY } from './sectionRegistry';

function SectionTypeCard({ sectionType, onAdd }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onAdd}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? '#242424' : '#1c1c1c',
        border: `1px solid ${hovered ? '#003DA6' : '#2d2d2d'}`,
        borderRadius: '0.375rem',
        padding: '0.375rem',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.3rem',
        transition: 'border-color 0.15s, background 0.15s',
        overflow: 'hidden',
      }}
    >
      <div style={{ borderRadius: '0.2rem', overflow: 'hidden', width: '100%', background: '#111', pointerEvents: 'none' }}>
        {sectionType.preview}
      </div>
      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.7rem', color: hovered ? '#e0e0e0' : '#828282', textAlign: 'center', lineHeight: 1.2, fontWeight: 500 }}>
        {sectionType.name}
      </span>
    </div>
  );
}

// Simple inline search input (no external dependency)
function SearchInput({ value, onChange, placeholder }) {
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <svg
        width={14}
        height={14}
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--text-dim, #4f4f4f)"
        strokeWidth="2"
        style={{ position: 'absolute', left: '0.625rem', pointerEvents: 'none', flexShrink: 0 }}
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          background: 'var(--bg-hover, #242424)',
          border: '1px solid var(--border-subtle, #2d2d2d)',
          borderRadius: '0.25rem',
          padding: '0.375rem 0.625rem 0.375rem 2rem',
          color: 'var(--text-active, #e0e0e0)',
          fontFamily: "'Inter', sans-serif",
          fontSize: '0.8125rem',
          outline: 'none',
        }}
      />
    </div>
  );
}

// Inline folder SVG icon
const FolderIcon = ({ active }) => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={active ? '#fff' : 'var(--text-muted, #828282)'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

export function EditMenu({
  width = 240,
  pages = [],
  activePageId,
  selectedSectionId,
  onPageSelect,
  onPageRename,
  onPageSectionsUpdate,
  onSectionSelect,
  onAddSection,
  onSectionDelete,
  onPageAdd,
  onPageDelete,
}) {
  const [tab, setTab] = useState('paginas');
  const [search, setSearch] = useState('');
  const [editingPageId, setEditingPageId] = useState(null);
  const [hoveredPageId, setHoveredPageId] = useState(null);
  const [deletingPageId, setDeletingPageId] = useState(null);
  const [deletingSectionId, setDeletingSectionId] = useState(null);
  const [hoveredSectionId, setHoveredSectionId] = useState(null);

  // Sections dropdown (page selector)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownTriggerRef = useRef(null);
  const dropdownMenuRef = useRef(null);
  const [dropdownRect, setDropdownRect] = useState(null);

  const panelRef = useRef(null);

  // DnD native HTML5
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  useEffect(() => {
    if (!isDropdownOpen) return;
    const handle = (e) => {
      if (!dropdownTriggerRef.current?.contains(e.target) && !dropdownMenuRef.current?.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [isDropdownOpen]);

  useEffect(() => {
    if (!isDropdownOpen) return;
    const update = () => {
      if (dropdownTriggerRef.current) setDropdownRect(dropdownTriggerRef.current.getBoundingClientRect());
    };
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => { window.removeEventListener('resize', update); window.removeEventListener('scroll', update, true); };
  }, [isDropdownOpen]);

  const activePage = pages.find((p) => p.id === activePageId);
  const activeSections = activePage?.sections || [];
  const filteredPages = pages.filter((p) => (p.label || p.name || '').toLowerCase().includes(search.toLowerCase()));
  const filteredSections = activeSections.filter((s) => (s.name || s.type || '').toLowerCase().includes(search.toLowerCase()));

  const SECTION_TYPES = Object.values(SECTION_REGISTRY).map((r) => ({
    id: r.id,
    name: r.name,
    preview: r.Preview ? <r.Preview config={r.defaultConfig} /> : null,
    defaultConfig: r.defaultConfig,
  }));
  const filteredSectionTypes = SECTION_TYPES.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));

  // HTML5 DnD handlers
  const handleDragStart = (e, index, locked) => {
    if (locked) { e.preventDefault(); return; }
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
  };
  const handleDragEnter = (e, index, locked) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index || locked) return;
    setDragOverIndex(index);
  };
  const handleDragOver = (e, locked) => {
    e.preventDefault();
    if (!locked) e.dataTransfer.dropEffect = 'move';
  };
  const handleDragLeave = () => setDragOverIndex(null);
  const handleDrop = (e, index, locked) => {
    e.preventDefault();
    if (locked || draggedIndex === null || draggedIndex === index) { setDraggedIndex(null); setDragOverIndex(null); return; }
    const newSections = [...activeSections];
    const [item] = newSections.splice(draggedIndex, 1);
    newSections.splice(index, 0, item);
    if (onPageSectionsUpdate) onPageSectionsUpdate(activePageId, newSections);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };
  const handleDragEnd = () => { setDraggedIndex(null); setDragOverIndex(null); };

  const renderDeleteAction = ({ isConfirming, isVisible, panelBackground, title, onRequestDelete, onConfirmDelete, onCancelDelete }) => {
    if (!isVisible && !isConfirming) return null;
    if (isConfirming) {
      return (
        <div onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()} style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: '0.25rem', background: panelBackground, padding: '0.25rem 0 0.25rem 0.5rem', boxShadow: `-0.75rem 0 0.75rem ${panelBackground}`, zIndex: 2 }}>
          <button type="button" onClick={onConfirmDelete} style={{ padding: '0.2rem 0.45rem', borderRadius: '0.25rem', border: 'none', cursor: 'pointer', color: '#fff', background: '#eb5757', fontSize: '0.625rem', fontWeight: 500 }}>Eliminar</button>
          <button type="button" onClick={onCancelDelete} style={{ padding: '0.2rem 0.45rem', borderRadius: '0.25rem', border: 'none', cursor: 'pointer', color: '#828282', background: 'rgba(255,255,255,0.05)', fontSize: '0.625rem' }}>Cancelar</button>
        </div>
      );
    }
    return (
      <button
        type="button"
        onClick={onRequestDelete}
        onMouseDown={(e) => e.stopPropagation()}
        title={title}
        style={{ padding: '0.25rem', borderRadius: '0.25rem', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#828282', opacity: 0.75, flexShrink: 0 }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(235,87,87,0.15)'; e.currentTarget.style.color = '#eb5757'; e.currentTarget.style.opacity = 1; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#828282'; e.currentTarget.style.opacity = 0.75; }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" />
        </svg>
      </button>
    );
  };

  const S = {
    root: { position: 'relative', display: 'flex', height: '100%', width: '100%', flex: 1 },
    panel: { width, flexShrink: 0, background: '#181818', borderRight: '1px solid #2d2d2d', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
    tabBar: { padding: '0.5rem', borderBottom: '1px solid #2d2d2d', flexShrink: 0 },
    tabGroup: { background: '#111', borderRadius: '0.25rem', display: 'flex', padding: '0.2rem' },
    controls: { padding: '0.5rem', borderBottom: '1px solid #2d2d2d', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' },
    list: { flex: 1, overflowY: 'auto' },
    sectionHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1rem', marginBottom: '0.75rem' },
  };

  return (
    <div style={S.root}>
      <div ref={panelRef} style={S.panel}>
        {/* Tabs */}
        <div style={S.tabBar}>
          <div style={S.tabGroup}>
            {['paginas', 'secciones'].map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setSearch(''); setIsDropdownOpen(false); setDeletingPageId(null); setDeletingSectionId(null); }}
                style={{ flex: 1, padding: '0.3rem 0.75rem', borderRadius: '0.2rem', border: 'none', cursor: 'pointer', fontFamily: "'Inter', sans-serif", fontSize: '0.8125rem', background: tab === t ? '#2d2d2d' : 'transparent', color: tab === t ? '#fff' : '#828282', transition: 'background 0.15s' }}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div style={S.controls}>
          {tab === 'secciones' && (
            <div style={{ position: 'relative' }}>
              <div
                ref={dropdownTriggerRef}
                style={{ background: '#222', borderRadius: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.75rem', cursor: 'pointer', border: isDropdownOpen ? '1px solid #4f4f4f' : '1px solid transparent' }}
                onClick={() => {
                  if (!isDropdownOpen && dropdownTriggerRef.current) setDropdownRect(dropdownTriggerRef.current.getBoundingClientRect());
                  setIsDropdownOpen(!isDropdownOpen);
                }}
              >
                <FolderIcon active />
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.8125rem', color: '#e0e0e0', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{activePage?.label || activePage?.name || 'Seleccionar página'}</span>
                <svg width={8} height={6} fill="none" viewBox="0 0 8 6" style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                  <path d="M1 1l3 3 3-3" stroke="#e0e0e0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              {isDropdownOpen && dropdownRect && createPortal(
                <div ref={dropdownMenuRef} style={{ position: 'fixed', top: dropdownRect.bottom + 4, left: dropdownRect.left, width: dropdownRect.width, background: '#242424', borderRadius: '0.375rem', border: '1px solid #2d2d2d', boxShadow: '0 12px 24px rgba(0,0,0,0.65)', zIndex: 9999, maxHeight: '12rem', overflowY: 'auto', padding: '0.25rem', boxSizing: 'border-box' }}>
                  {pages.map((p) => (
                    <div key={p.id} onClick={() => { onPageSelect && onPageSelect(p.id); setIsDropdownOpen(false); }} style={{ padding: '0.4rem 0.75rem', cursor: 'pointer', fontFamily: "'Inter', sans-serif", fontSize: '0.8rem', color: activePageId === p.id ? '#fff' : '#828282', background: activePageId === p.id ? 'rgba(255,255,255,0.08)' : 'transparent', borderRadius: '0.2rem' }} onMouseEnter={(e) => { if (activePageId !== p.id) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }} onMouseLeave={(e) => { if (activePageId !== p.id) e.currentTarget.style.background = 'transparent'; }}>
                      {p.label || p.name}
                    </div>
                  ))}
                </div>,
                document.body
              )}
            </div>
          )}
          <SearchInput value={search} onChange={setSearch} placeholder="Buscar" />
        </div>

        {/* List */}
        <div style={S.list}>
          {/* PÁGINAS */}
          {tab === 'paginas' && (
            <div style={{ display: 'flex', flexDirection: 'column', paddingTop: '0.75rem' }}>
              <div style={S.sectionHeader}>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.9rem', color: '#e0e0e0' }}>Páginas</span>
                <button onClick={() => onPageAdd && onPageAdd()} style={{ background: 'transparent', border: 'none', cursor: 'pointer', width: '1.5rem', height: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                  <svg width={16} height={16} fill="none" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="#e0e0e0" strokeWidth="2" strokeLinecap="round" /></svg>
                </button>
              </div>
              {filteredPages.map((page) => (
                <div
                  key={page.id}
                  onClick={() => onPageSelect && onPageSelect(page.id)}
                  onDoubleClick={() => setEditingPageId(page.id)}
                  onMouseEnter={(e) => { setHoveredPageId(page.id); if (activePageId !== page.id) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                  onMouseLeave={(e) => { setHoveredPageId(null); if (activePageId !== page.id) e.currentTarget.style.background = 'transparent'; }}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.75rem', border: 'none', cursor: 'pointer', background: activePageId === page.id ? '#222' : 'transparent', borderRadius: '0.2rem', margin: '0 0.5rem', position: 'relative', transition: 'background 0.12s' }}
                >
                  <FolderIcon active={activePageId === page.id} />
                  {editingPageId === page.id ? (
                    <input
                      value={page.label || page.name}
                      onChange={(e) => onPageRename && onPageRename(page.id, e.target.value)}
                      onBlur={() => setEditingPageId(null)}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === 'Escape') setEditingPageId(null); }}
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                      style={{ background: '#2d2d2d', border: '1px solid #4f4f4f', borderRadius: '0.2rem', outline: 'none', color: '#e0e0e0', fontFamily: "'Inter', sans-serif", fontSize: '0.8rem', width: '100%', padding: '0.1rem 0.3rem' }}
                    />
                  ) : (
                    <span style={{ color: activePageId === page.id ? '#fff' : '#828282', flex: 1, fontFamily: "'Inter', sans-serif", fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{page.label || page.name}</span>
                  )}
                  {renderDeleteAction({
                    isConfirming: deletingPageId === page.id,
                    isVisible: hoveredPageId === page.id,
                    panelBackground: activePageId === page.id ? '#222' : '#181818',
                    title: 'Eliminar página',
                    onRequestDelete: (e) => { e.preventDefault(); e.stopPropagation(); setDeletingPageId(page.id); setDeletingSectionId(null); },
                    onConfirmDelete: (e) => { e.stopPropagation(); setDeletingPageId(null); onPageDelete && onPageDelete(page.id); },
                    onCancelDelete: (e) => { e.stopPropagation(); setDeletingPageId(null); },
                  })}
                </div>
              ))}
            </div>
          )}

          {/* SECCIONES */}
          {tab === 'secciones' && (
            <div style={{ display: 'flex', flexDirection: 'column', paddingTop: '0.75rem' }}>

              {/* ── Current page sections ── */}
              <div style={S.sectionHeader}>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#4f4f4f' }}>En esta página</span>
              </div>

              {/* Header (locked) */}
              <div onClick={() => onSectionSelect && onSectionSelect('header')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.75rem', background: selectedSectionId === 'header' ? '#222' : 'transparent', cursor: 'pointer', borderRadius: '0.2rem', margin: '0 0.5rem' }}>
                <svg width={15} height={15} fill="none" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#4f4f4f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.8rem', color: selectedSectionId === 'header' ? '#fff' : '#828282', flex: 1 }}>Header</span>
                <svg width={15} height={15} fill="none" viewBox="0 0 24 24"><rect x="5" y="11" width={14} height={10} rx="2" stroke="#3a3a3a" strokeWidth="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="#3a3a3a" strokeWidth="2" strokeLinecap="round" /></svg>
              </div>

              {filteredSections.filter((s) => s.id !== 'header' && s.id !== 'footer').map((section) => {
                const actualIndex = activeSections.findIndex((s) => s.id === section.id);
                const isDragging = draggedIndex === actualIndex;
                const isOver = dragOverIndex === actualIndex;
                const isSelected = selectedSectionId === section.id;
                return (
                  <div
                    key={section.id}
                    onClick={() => onSectionSelect && onSectionSelect(section.id)}
                    draggable={!section.locked}
                    onDragStart={(e) => handleDragStart(e, actualIndex, section.locked)}
                    onDragEnter={(e) => handleDragEnter(e, actualIndex, section.locked)}
                    onDragOver={(e) => handleDragOver(e, section.locked)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, actualIndex, section.locked)}
                    onDragEnd={handleDragEnd}
                    onMouseEnter={() => !section.locked && setHoveredSectionId(section.id)}
                    onMouseLeave={() => setHoveredSectionId(null)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.75rem', background: isOver ? 'rgba(255,255,255,0.08)' : (isSelected ? '#222' : 'transparent'), opacity: isDragging ? 0.4 : 1, borderTop: isOver && dragOverIndex < draggedIndex ? '2px solid #003DA6' : '2px solid transparent', borderBottom: isOver && dragOverIndex > draggedIndex ? '2px solid #003DA6' : '2px solid transparent', cursor: 'grab', borderRadius: '0.2rem', margin: '0 0.5rem', position: 'relative', transition: 'background 0.12s' }}
                  >
                    <svg width={7} height={14} fill="none" viewBox="0 0 7 16" style={{ flexShrink: 0 }}>
                      <circle cx="2" cy="2" r="1.5" fill="#3a3a3a" /><circle cx="6" cy="2" r="1.5" fill="#3a3a3a" />
                      <circle cx="2" cy="8" r="1.5" fill="#3a3a3a" /><circle cx="6" cy="8" r="1.5" fill="#3a3a3a" />
                      <circle cx="2" cy="14" r="1.5" fill="#3a3a3a" /><circle cx="6" cy="14" r="1.5" fill="#3a3a3a" />
                    </svg>
                    <svg width={14} height={14} fill="none" viewBox="0 0 24 24" style={{ flexShrink: 0 }}><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke={isSelected ? '#fff' : '#4f4f4f'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    <span style={{ flex: 1, color: isSelected ? '#fff' : '#828282', fontFamily: "'Inter', sans-serif", fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{section.name || section.type}</span>
                    {renderDeleteAction({
                      isConfirming: deletingSectionId === section.id,
                      isVisible: hoveredSectionId === section.id || isSelected,
                      panelBackground: isSelected ? '#222' : '#181818',
                      title: 'Eliminar sección',
                      onRequestDelete: (e) => { e.preventDefault(); e.stopPropagation(); setDeletingSectionId(section.id); setDeletingPageId(null); },
                      onConfirmDelete: (e) => { e.stopPropagation(); setDeletingSectionId(null); onSectionDelete && onSectionDelete(section.id); },
                      onCancelDelete: (e) => { e.stopPropagation(); setDeletingSectionId(null); },
                    })}
                  </div>
                );
              })}

              {/* Footer (locked) */}
              <div onClick={() => onSectionSelect && onSectionSelect('footer')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.75rem', background: selectedSectionId === 'footer' ? '#222' : 'transparent', cursor: 'pointer', borderRadius: '0.2rem', margin: '0 0.5rem' }}>
                <svg width={15} height={15} fill="none" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#4f4f4f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.8rem', color: selectedSectionId === 'footer' ? '#fff' : '#828282', flex: 1 }}>Footer</span>
                <svg width={15} height={15} fill="none" viewBox="0 0 24 24"><rect x="5" y="11" width={14} height={10} rx="2" stroke="#3a3a3a" strokeWidth="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="#3a3a3a" strokeWidth="2" strokeLinecap="round" /></svg>
              </div>

              {/* ── Available section types ── */}
              <div style={{ margin: '1rem 0.75rem 0', borderTop: '1px solid #2d2d2d', paddingTop: '0.75rem' }}>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#4f4f4f', display: 'block', marginBottom: '0.5rem' }}>
                  Agregar sección
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.375rem' }}>
                  {filteredSectionTypes.map((sectionType) => (
                    <SectionTypeCard
                      key={sectionType.id}
                      sectionType={sectionType}
                      onAdd={() => {
                        if (onAddSection) onAddSection({ type: sectionType.id, name: sectionType.name, config: sectionType.defaultConfig });
                      }}
                    />
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
