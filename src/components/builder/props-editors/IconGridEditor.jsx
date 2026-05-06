import React, { useState } from 'react';
import { Accordion } from '../Accordion';
import { AddButton, ControlGroup, DrillHeader, EditorCard, EmptyText, GhostButton, ImageUploader, ListEditor, SectionHeader, TextInput, Selector } from '../EditorControls';
import { ToggleSwitch } from '../ToggleSwitch';
import { IconSelector } from '../IconSelector';
import { CustomColorPicker } from '../CustomColorPicker';
import { GOV_ICONS } from '../GovIcons';

export function IconGridEditor({ config, onChange, editorState }) {
  const [editingTabIndex, setEditingTabIndex] = useState(null);
  const [editingItemIndex, setEditingItemIndex] = useState(null);
  const [openPanels, setOpenPanels] = useState({ config: true, tabs: true });
  const [editingIcon, setEditingIcon] = useState(false);

  const togglePanel = (key) => setOpenPanels(p => ({ ...p, [key]: !p[key] }));
  const updateConfig = (key, value) => onChange({ ...config, [key]: value });

  const tabs = config.tabs || [{ id: 'tab-1', label: 'Tab', items: [] }];
  const showTitle = config.showTitle !== false;
  const pages = editorState?.pages || [];
  const itemImageSize = String(config.itemImageSize || 100);
  const itemImageRadius = config.itemImageRadius || 'soft';
  const itemImageFit = config.itemImageFit || 'contain';
  const imageRadiusPreview = {
    square: '0',
    soft: '0.75rem',
    rounded: '1.5rem',
    circle: '999px',
  }[itemImageRadius] || '0.75rem';

  const currentTab = editingTabIndex !== null ? (tabs[editingTabIndex] || tabs[0]) : null;
  const items = currentTab?.items || [];

  const updateTabs = (newTabs) => updateConfig('tabs', newTabs);
  const updateTabItems = (newItems) => {
    const newTabs = tabs.map((t, i) => i === editingTabIndex ? { ...t, items: newItems } : t);
    updateTabs(newTabs);
  };
  const updateItem = (index, patch) => {
    const newItems = items.map((item, i) => i === index ? { ...item, ...patch } : item);
    updateTabItems(newItems);
  };
  const handleAddItem = () => {
    const newItem = { id: 'ig-' + Date.now(), icon: 'link', customImage: '', showLabel: true, label: 'Texto descriptivo', target: 'none', url: '', pageId: '' };
    updateTabItems([...items, newItem]);
    setEditingItemIndex(items.length);
    setEditingIcon(false);
  };
  const handleAddTab = () => {
    const newTab = { id: 'tab-' + Date.now(), label: 'Nuevo Tab', items: [] };
    updateTabs([...tabs, newTab]);
    setEditingTabIndex(tabs.length);
  };
  const handleDeleteTab = (index) => {
    if (tabs.length <= 1) return;
    const newTabs = tabs.filter((_, i) => i !== index);
    updateTabs(newTabs);
  };
  const handleRenameTab = (label) => {
    const newTabs = tabs.map((t, i) => i === editingTabIndex ? { ...t, label } : t);
    updateTabs(newTabs);
  };
  const inputStyle = {
    background: 'var(--bg-darker)', border: '0.0625rem solid var(--border-subtle)',
    borderRadius: '0.5rem', padding: '0.5rem 0.875rem', color: 'var(--text-dim)',
    fontSize: '0.875rem', fontFamily: "'Inter', sans-serif", width: '100%', boxSizing: 'border-box', outline: 'none',
  };

  // ── Level 3: Item detail ─────────────────────────────────────────────────────
  if (editingItemIndex !== null && currentTab) {
    const item = items[editingItemIndex];
    if (!item) { setEditingItemIndex(null); return null; }
    const iconData = item.icon ? GOV_ICONS[item.icon] : null;
    const IconComp = iconData ? iconData.icon : null;
    const hasCustomImage = !!item.customImage;
    const hasSystemIcon = !!IconComp && !hasCustomImage;
    const showLabel = item.showLabel !== false;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <DrillHeader
          onBack={() => { setEditingItemIndex(null); setEditingIcon(false); }}
          title={item.label || `Item ${editingItemIndex + 1}`}
          subtitle={`Item ${editingItemIndex + 1} de ${items.length} — Tab: ${currentTab.label}`}
        />
        <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', overflowY: 'auto' }}>
          <div>
            <SectionHeader>Ícono / Imagen</SectionHeader>
            <EditorCard>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: hasCustomImage ? '6.25rem' : '4rem', height: hasCustomImage ? '6.25rem' : '4rem', borderRadius: hasCustomImage ? imageRadiusPreview : '0.75rem', background: hasCustomImage ? 'transparent' : 'rgba(255,255,255,0.06)', border: '0.0625rem solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                  {hasCustomImage ? <img src={item.customImage} alt="" style={{ width: '100%', height: '100%', objectFit: itemImageFit, display: 'block' }} />
                  : IconComp ? <IconComp size={28} color={item.iconColor || '#60a5fa'} />
                  : <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="var(--text-dim)" strokeWidth={1.5}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.875rem', color: 'white', fontWeight: 500 }}>{hasCustomImage ? 'Imagen personalizada' : (iconData?.name || 'Sin ícono')}</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.6875rem', color: 'var(--text-dim)', marginTop: '0.125rem' }}>{hasCustomImage ? 'PNG, SVG o JPG' : hasSystemIcon ? 'Ícono del sistema' : 'Ninguno seleccionado'}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <GhostButton onClick={() => setEditingIcon(!editingIcon)} active={editingIcon}>
                  <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                  {editingIcon ? 'Cerrar selector' : 'Elegir ícono'}
                </GhostButton>
              </div>
              <ImageUploader
                imageUrl={item.customImage || ''}
                onUpload={value => updateItem(editingItemIndex, { customImage: value, icon: value ? '' : item.icon })}
                defaultLabel="Imagen personalizada"
                previewFit="contain"
                placeholder="URL de la imagen personalizada..."
              />
              {editingIcon && <div style={{ marginTop: '0.25rem' }}><IconSelector value={item.icon} onChange={newIcon => { updateItem(editingItemIndex, { icon: newIcon, customImage: '' }); setEditingIcon(false); }} /></div>}
            </EditorCard>
          </div>
          <div>
            <SectionHeader>Texto</SectionHeader>
            <EditorCard>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.8125rem', color: 'white', fontWeight: 500 }}>Mostrar texto</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.6875rem', color: 'var(--text-dim)', marginTop: '0.125rem' }}>El texto es opcional</div>
                </div>
                <ToggleSwitch checked={showLabel} onChange={v => updateItem(editingItemIndex, { showLabel: v })} />
              </div>
              {showLabel && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                  <label style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 500 }}>Contenido del texto</label>
                  <TextInput value={item.label || ''} onChange={v => updateItem(editingItemIndex, { label: v })} placeholder="Ej: Texto descriptivo" />
                </div>
              )}
            </EditorCard>
          </div>
          <div>
            <SectionHeader>Enlace</SectionHeader>
            <EditorCard>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                <label style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 500 }}>Tipo de enlace</label>
                <Selector value={item.target || 'none'} options={['none', 'external', 'page']} displayMap={{ none: { name: 'Sin enlace' }, external: { name: 'URL externa' }, page: { name: 'Página interna' } }} onChange={v => updateItem(editingItemIndex, { target: v, url: '', pageId: '' })} />
              </div>
              {item.target === 'external' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                  <label style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 500 }}>URL</label>
                  <input value={item.url || ''} onChange={e => updateItem(editingItemIndex, { url: e.target.value })} style={inputStyle} placeholder="https://..." />
                </div>
              )}
              {item.target === 'page' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                  <label style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 500 }}>Página del proyecto</label>
                  {pages.length > 0 ? (
                    <Selector value={item.pageId || ''} options={['', ...pages.map(p => p.id)]} displayMap={{ '': { name: '— Seleccionar página —' }, ...pages.reduce((acc, p) => ({ ...acc, [p.id]: { name: p.label || p.name || p.id } }), {}) }} onChange={v => updateItem(editingItemIndex, { pageId: v })} />
                  ) : (
                    <EmptyText>No hay páginas creadas.</EmptyText>
                  )}
                </div>
              )}
            </EditorCard>
          </div>
        </div>
      </div>
    );
  }

  // ── Level 2: Tab detail (items list) ────────────────────────────────────────
  if (editingTabIndex !== null && currentTab) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <DrillHeader
          onBack={() => { setEditingTabIndex(null); setEditingItemIndex(null); }}
          title={currentTab.label}
          subtitle={`${items.length} ${items.length === 1 ? 'item' : 'items'} en este tab`}
        />
        <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', overflowY: 'auto' }}>
          {/* Tab name */}
          <div>
            <SectionHeader>Nombre del Tab</SectionHeader>
            <TextInput
              value={currentTab.label}
              onChange={v => handleRenameTab(v)}
              placeholder="Nombre del tab"
            />
          </div>

          {/* Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <SectionHeader>Items</SectionHeader>
            <ListEditor
              items={items}
              onItemsChange={updateTabItems}
              renderItemPreview={(item, index) => {
                const iconData2 = item.icon ? GOV_ICONS[item.icon] : null;
                const IconComp2 = iconData2 ? iconData2.icon : null;
                return (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', overflow: 'hidden' }} onClick={() => { setEditingItemIndex(index); setEditingIcon(false); }}>
                    <div style={{ width: '1.5rem', height: '1.5rem', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: '0.25rem', background: 'rgba(255,255,255,0.06)' }}>
                      {item.customImage ? <img src={item.customImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      : IconComp2 ? <IconComp2 size={13} color={config.iconColor || '#60a5fa'} />
                      : <span style={{ fontSize: '0.5rem', color: 'var(--text-dim)' }}>?</span>}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.8125rem', color: 'var(--text-active)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.showLabel !== false && item.label ? item.label : `Item ${index + 1}`}
                      </div>
                    </div>
                    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="var(--text-dim)" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
                  </div>
                );
              }}
            />
            <AddButton onClick={handleAddItem} label="Agregar item" />
          </div>
        </div>
      </div>
    );
  }

  // ── Level 1: Main view (tab list + general config) ──────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Accordion title="Contenido y apariencia" isOpen={openPanels.config} onToggle={() => togglePanel('config')}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.8125rem', color: 'white' }}>Mostrar título</span>
            <ToggleSwitch checked={showTitle} onChange={v => updateConfig('showTitle', v)} />
          </div>
          {showTitle && (
            <>
              <ControlGroup title="Título"><TextInput value={config.title || ''} onChange={v => updateConfig('title', v)} placeholder="Título" /></ControlGroup>
              <ControlGroup title="Subtítulo"><TextInput value={config.subtitle || ''} onChange={v => updateConfig('subtitle', v)} placeholder="Descripción breve" /></ControlGroup>
            </>
          )}
          <div style={{ borderTop: '0.0625rem solid var(--border-subtle)', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.6875rem', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-dim)' }}>Apariencia</span>
            <ControlGroup title="Color de íconos"><CustomColorPicker label="" value={config.iconColor || '#004cb0'} onChange={v => updateConfig('iconColor', v)} /></ControlGroup>
            <ControlGroup title="Color del texto"><CustomColorPicker label="" value={config.textColor || '#000000'} onChange={v => updateConfig('textColor', v)} /></ControlGroup>
          </div>
          <div style={{ borderTop: '0.0625rem solid var(--border-subtle)', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.6875rem', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-dim)' }}>Estilo de elementos</span>
            <ControlGroup title="Tamaño">
              <Selector
                value={itemImageSize}
                options={['100', '120', '140', '160']}
                displayMap={{
                  '100': { name: '100 x 100 px' },
                  '120': { name: '120 x 120 px' },
                  '140': { name: '140 x 140 px' },
                  '160': { name: '160 x 160 px' },
                }}
                onChange={v => updateConfig('itemImageSize', Number(v))}
              />
            </ControlGroup>
            <ControlGroup title="Forma">
              <Selector
                value={itemImageRadius}
                options={['square', 'soft', 'rounded', 'circle']}
                displayMap={{
                  square: { name: 'Cuadrada' },
                  soft: { name: 'Borde suave' },
                  rounded: { name: 'Redondeada' },
                  circle: { name: 'Circular' },
                }}
                onChange={v => updateConfig('itemImageRadius', v)}
              />
            </ControlGroup>
            <ControlGroup title="Ajuste">
              <Selector
                value={itemImageFit}
                options={['contain', 'cover']}
                displayMap={{ contain: { name: 'Contener imagen' }, cover: { name: 'Rellenar cuadro' } }}
                onChange={v => updateConfig('itemImageFit', v)}
              />
            </ControlGroup>
          </div>
          <div style={{ borderTop: '0.0625rem solid var(--border-subtle)', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.6875rem', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-dim)' }}>Fondo</span>
            <ControlGroup title="Color de fondo"><CustomColorPicker label="" value={config.bgColor || '#f5f5f5'} onChange={v => updateConfig('bgColor', v)} /></ControlGroup>
            <ControlGroup title="Imagen de fondo (opcional)">
              <ImageUploader imageUrl={config.bgImage || ''} onUpload={value => updateConfig('bgImage', value)} defaultLabel="Imagen de fondo" placeholder="URL de imagen de fondo..." />
            </ControlGroup>
          </div>
        </div>
      </Accordion>

      <Accordion title={`Tabs y elementos (${tabs.length})`} isOpen={openPanels.tabs} onToggle={() => togglePanel('tabs')}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {tabs.map((tab, i) => (
            <div
              key={tab.id}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 0.75rem', background: 'var(--bg-darker)', border: '0.0625rem solid var(--border-subtle)', borderRadius: '0.5rem', cursor: 'pointer', transition: 'background 0.15s' }}
              onClick={() => setEditingTabIndex(i)}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-darker)'}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.875rem', color: 'white', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tab.label}</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.6875rem', color: 'var(--text-dim)', marginTop: '0.125rem' }}>{(tab.items || []).length} items</div>
              </div>
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="var(--text-dim)" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
            </div>
          ))}

          <AddButton onClick={handleAddTab} label="Agregar tab" />
        </div>
      </Accordion>
    </div>
  );
}
