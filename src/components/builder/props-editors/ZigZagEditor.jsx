import React, { useState } from 'react';
import { Accordion } from '../Accordion';
import { AddButton, AlignmentPicker, ControlGroup, DrillHeader, EditorCard, EmptyText, ImageUploader, ListEditor, SectionHeader, Selector, TextInput } from '../EditorControls';
import { CustomColorPicker } from '../CustomColorPicker';

const LAYOUTS = {
  'image-left': { name: 'Imagen primero' },
  'image-right': { name: 'Texto primero' },
};

const SOURCE_MODES = {
  cms: { name: 'Colección CMS' },
  manual: { name: 'Manual' },
};

const DEFAULT_LEFT_IMAGE = '/assets/zigzag-section-image-left.jpg';
const DEFAULT_RIGHT_IMAGE = '/assets/zigzag-section-image-right.jpg';

function createDefaultItem(index = 0) {
  const isRight = index % 2 === 1;
  return {
    id: 'zigzag-' + Date.now(),
    layout: isRight ? 'image-right' : 'image-left',
    title: 'EP05: Conectando territorios: Innovación, conectividad y tecnología para las regiones de Colombia',
    description: 'En esta emisión de Conectando Territorios, el programa institucional del Ministerio TIC, visitamos el municipio de Cota, Cundinamarca, en una edición especial en el marco del Día Internacional de la Mujer. Conozca los avances del Gobierno Nacional para llevar conectividad, educación digital e innovación tecnológica a diferentes regiones del país.',
    image: isRight ? DEFAULT_RIGHT_IMAGE : DEFAULT_LEFT_IMAGE,
    imageAlt: '',
  };
}

export function ZigZagEditor({ config, onChange, editorState }) {
  const [openPanels, setOpenPanels] = useState({ data: true, content: true, style: true, items: true });
  const [editingItemIndex, setEditingItemIndex] = useState(null);
  const togglePanel = (key) => setOpenPanels(prev => ({ ...prev, [key]: !prev[key] }));
  const updateConfig = (key, value) => onChange({ ...config, [key]: value });

  const items = Array.isArray(config.items) ? config.items : [];
  const titleAlign = config.titleAlign || 'left';
  const sourceMode = config.sourceMode || 'cms';
  const cmsData = editorState?.cmsData;
  const collections = cmsData?._collections
    || (cmsData ? Object.keys(cmsData).filter(key => key !== '_collections' && Array.isArray(cmsData[key])).map(key => ({ id: key, label: key.charAt(0).toUpperCase() + key.slice(1) })) : []);
  const collectionOptions = collections.map(collection => collection.id);
  const collectionDisplayMap = collections.reduce((displayMap, collection) => ({
    ...displayMap,
    [collection.id]: { name: `${collection.label} (${cmsData?.[collection.id]?.length || 0})` },
  }), {});
  const cmsCollection = config.cmsCollection || 'blog';
  const itemCount = cmsData?.[cmsCollection]?.length || 0;

  const updateItem = (index, patch) => {
    updateConfig('items', items.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item));
  };

  const handleAddItem = () => {
    const nextItem = createDefaultItem(items.length);
    updateConfig('items', [...items, nextItem]);
    setEditingItemIndex(items.length);
  };

  if (editingItemIndex !== null) {
    const item = items[editingItemIndex];
    if (!item) { setEditingItemIndex(null); return null; }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <DrillHeader onBack={() => setEditingItemIndex(null)} title={item.title || `Bloque ${editingItemIndex + 1}`} subtitle={`Elemento ${editingItemIndex + 1} de ${items.length}`} />
        <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', overflowY: 'auto' }}>
          <ControlGroup title="Layout del elemento">
            <Selector value={item.layout || 'image-left'} options={Object.keys(LAYOUTS)} displayMap={LAYOUTS} onChange={value => updateItem(editingItemIndex, { layout: value })} />
          </ControlGroup>
          <ControlGroup title="Título">
            <TextInput value={item.title || ''} onChange={value => updateItem(editingItemIndex, { title: value })} placeholder="Título del bloque" />
          </ControlGroup>
          <ControlGroup title="Descripción">
            <TextInput isTextArea value={item.description || ''} onChange={value => updateItem(editingItemIndex, { description: value })} placeholder="Texto descriptivo del bloque" />
          </ControlGroup>
          <ControlGroup title="Imagen">
            <ImageUploader imageUrl={item.image || ''} onUpload={value => updateItem(editingItemIndex, { image: value })} defaultLabel="Imagen del bloque" previewFit="cover" placeholder="URL de la imagen..." />
          </ControlGroup>
          <ControlGroup title="Texto alternativo">
            <TextInput value={item.imageAlt || ''} onChange={value => updateItem(editingItemIndex, { imageAlt: value })} placeholder="Descripción breve de la imagen" />
          </ControlGroup>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Accordion title="Fuente de datos" isOpen={openPanels.data} onToggle={() => togglePanel('data')}>
        <ControlGroup title="Fuente de datos">
          <Selector value={sourceMode} options={Object.keys(SOURCE_MODES)} displayMap={SOURCE_MODES} onChange={value => updateConfig('sourceMode', value)} />
        </ControlGroup>
        {sourceMode === 'cms' && (
          <>
            <ControlGroup title="Colección CMS">
              {collectionOptions.length > 0 ? (
                <Selector value={cmsCollection} options={collectionOptions} displayMap={collectionDisplayMap} onChange={value => updateConfig('cmsCollection', value)} />
              ) : (
                <EmptyText>No hay colecciones CMS creadas aún.</EmptyText>
              )}
            </ControlGroup>
            <EditorCard style={{ padding: '0.75rem 1rem', flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <ellipse cx="12" cy="5" rx="9" ry="3" />
                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
              </svg>
              <p style={{ margin: 0, fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', color: 'var(--text-active)', lineHeight: 1.4 }}>
                Conectado a <strong>{collectionDisplayMap[cmsCollection]?.name || cmsCollection}</strong> — {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </p>
            </EditorCard>
          </>
        )}
      </Accordion>

      <Accordion title="Contenido" isOpen={openPanels.content} onToggle={() => togglePanel('content')}>
        <ControlGroup title="Título de la sección">
          <TextInput value={config.title || ''} onChange={value => updateConfig('title', value)} placeholder="Título opcional" />
        </ControlGroup>
        <ControlGroup title="Subheadline">
          <TextInput isTextArea value={config.subtitle || ''} onChange={value => updateConfig('subtitle', value)} placeholder="Texto introductorio opcional" />
        </ControlGroup>
        <ControlGroup title="Alineación del encabezado">
          <AlignmentPicker value={titleAlign} onChange={value => updateConfig('titleAlign', value)} />
        </ControlGroup>
      </Accordion>

      <Accordion title="Apariencia" isOpen={openPanels.style} onToggle={() => togglePanel('style')}>
        <ControlGroup title="Color de fondo">
          <CustomColorPicker label="" value={config.backgroundColor || '#f4f4f4'} onChange={value => updateConfig('backgroundColor', value)} />
        </ControlGroup>
        <ControlGroup title="Color de títulos">
          <CustomColorPicker label="" value={config.titleColor || '#004cb0'} onChange={value => updateConfig('titleColor', value)} />
        </ControlGroup>
        <ControlGroup title="Color del texto">
          <CustomColorPicker label="" value={config.textColor || '#000000'} onChange={value => updateConfig('textColor', value)} />
        </ControlGroup>
      </Accordion>

      {sourceMode === 'manual' ? (
        <Accordion title={`Elementos (${items.length})`} isOpen={openPanels.items} onToggle={() => togglePanel('items')}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <ListEditor
              items={items}
              onItemsChange={value => updateConfig('items', value)}
              emptyLabel="No hay elementos en esta sección"
              renderItemPreview={(item, index) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', cursor: 'pointer', overflow: 'hidden' }} onClick={() => setEditingItemIndex(index)}>
                  <div style={{ width: '2rem', height: '1.5rem', borderRadius: '0.25rem', overflow: 'hidden', background: 'rgba(255,255,255,0.06)', flexShrink: 0 }}>
                    {item.image && <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.8125rem', color: 'var(--text-active)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.title || `Elemento ${index + 1}`}
                    </div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.625rem', color: 'var(--text-dim)', marginTop: '0.0625rem' }}>
                      {LAYOUTS[item.layout || 'image-left']?.name}
                    </div>
                  </div>
                </div>
              )}
            />
            <AddButton onClick={handleAddItem} label="Agregar elemento" />
          </div>
        </Accordion>
      ) : (
        <Accordion title="Elementos" isOpen={openPanels.items} onToggle={() => togglePanel('items')}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <SectionHeader>Generados desde CMS</SectionHeader>
            <EmptyText>Los bloques se crean automáticamente desde la colección seleccionada. Edita el contenido en el panel CMS.</EmptyText>
          </div>
        </Accordion>
      )}
    </div>
  );
}