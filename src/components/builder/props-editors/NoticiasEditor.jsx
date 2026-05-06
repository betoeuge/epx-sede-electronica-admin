import React, { useState } from 'react';
import { Accordion } from '../Accordion';
import { ControlGroup, EmptyText, EditorCard, SectionHeader, Selector, TitleBlock } from '../EditorControls';

const NOTICIAS_VARIANTS = {
  'Destacado': { name: 'Destacado' },
  'Lista Horizontal': { name: 'Lista' },
  'Cuadrícula Vertical': { name: 'Tarjetas' },
  'Blog': { name: 'Blog' }
};

export function NoticiasEditor({ config, onChange, editorState }) {
  const [openPanels, setOpenPanels] = useState({ content: true, data: true, layout: true });
  
  const togglePanel = (key) => setOpenPanels(p => ({ ...p, [key]: !p[key] }));

  const updateConfig = (key, value) => {
    onChange({ ...config, [key]: value });
  };

  const variant = config.variant ?? 'Destacado';
  const title = config.title ?? 'Noticias';
  const cmsCollection = config.cmsCollection || 'noticias';

  // Read available collections from editorState
  const cmsData = editorState?.cmsData;
  const collections = cmsData?._collections
    || (cmsData ? Object.keys(cmsData).filter(k => k !== '_collections').map(k => ({ id: k, label: k.charAt(0).toUpperCase() + k.slice(1) })) : []);

  const collectionOptions = collections.map(c => c.id);
  const collectionDisplayMap = collections.reduce((acc, c) => ({ ...acc, [c.id]: { name: c.label } }), {});

  // Count items in selected collection
  const itemCount = cmsData?.[cmsCollection]?.length || 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Accordion title="Contenido" isOpen={openPanels.content} onToggle={() => togglePanel('content')}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <TitleBlock
            title={title}
            subtitle={config.subtitle || ''}
            titleAlign={config.titleAlign || 'left'}
            onChange={(key, val) => updateConfig(key, val)}
          />
        </div>
      </Accordion>

      <Accordion title="Fuente de datos" isOpen={openPanels.data} onToggle={() => togglePanel('data')}>
        <SectionHeader>Colección CMS</SectionHeader>
        <ControlGroup title="Colección">
          {collectionOptions.length > 0 ? (
            <Selector value={cmsCollection} options={collectionOptions} displayMap={collectionDisplayMap} onChange={v => updateConfig('cmsCollection', v)} />
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
      </Accordion>

      <Accordion title="Diseño" isOpen={openPanels.layout} onToggle={() => togglePanel('layout')}>
        <ControlGroup title="Estilo">
          <Selector value={variant} options={Object.keys(NOTICIAS_VARIANTS)} displayMap={NOTICIAS_VARIANTS} onChange={v => updateConfig('variant', v)} />
        </ControlGroup>
      </Accordion>
    </div>
  );
}
