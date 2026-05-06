import React, { useState } from 'react';
import { Accordion } from '../Accordion';
import { AddButton, ControlGroup, EmptyText, GhostButton, InlineBadge, TextInput, Selector, TitleBlock } from '../EditorControls';

const LINKS_VARIANTS = {
  default: { name: 'Lista' },
  accordion: { name: 'Acordeón' },
};

const font = "'Inter', sans-serif";

function EmptyCmsNotice() {
  return (
    <EmptyText>
      No hay colecciones CMS disponibles todavía. Abre el panel CMS para crear o inicializar las colecciones.
    </EmptyText>
  );
}

function SectionCard({ section, index, collections, collectionDisplayMap, collectionOptions, onUpdate, onRemove }) {
  const [expanded, setExpanded] = useState(false);
  const itemCount = collections.find(collection => collection.id === section.collection)?.count || 0;
  const collectionName = collectionDisplayMap[section.collection]?.name || 'Sin colección';

  return (
    <div style={{
      background: 'var(--bg-darker)',
      border: '0.0625rem solid var(--border-subtle)',
      borderRadius: '0.5rem',
      overflow: 'hidden',
    }}>
      <div
        onClick={() => setExpanded(value => !value)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 0.75rem',
          cursor: 'pointer',
        }}
      >
        <InlineBadge style={{ fontWeight: 500, minWidth: '1.5rem', textAlign: 'center' }}>
          {index + 1}
        </InlineBadge>

        <span style={{
          fontFamily: font,
          fontSize: '0.8125rem',
          fontWeight: 500,
          color: section.title ? 'var(--text-active)' : 'var(--text-dim)',
          flex: 1,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          fontStyle: section.title ? 'normal' : 'italic',
        }}>
          {section.title || 'Sección sin título'}
        </span>

        <InlineBadge>
          {itemCount} items
        </InlineBadge>

        <svg
          width={10} height={10} viewBox="0 0 24 24" fill="none"
          stroke="var(--text-dim)" strokeWidth="2.5" strokeLinecap="round"
          style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s', flexShrink: 0 }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>

      {expanded && (
        <div style={{
          borderTop: '0.0625rem solid var(--border-subtle)',
          padding: '0.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.625rem',
          background: 'var(--bg-main)',
        }}>
          <ControlGroup title="Título de la sección">
            <TextInput value={section.title || ''} onChange={value => onUpdate(index, { title: value })} placeholder="Ej. Información de la entidad" />
          </ControlGroup>

          <ControlGroup title="Colección CMS">
            {collectionOptions.length > 0 ? (
              <Selector
                value={section.collection || collectionOptions[0]}
                options={collectionOptions}
                displayMap={collectionDisplayMap}
                onChange={value => onUpdate(index, { collection: value })}
              />
            ) : (
              <EmptyCmsNotice />
            )}
          </ControlGroup>

          <p style={{ fontFamily: font, fontSize: '0.6875rem', color: 'var(--text-dim)', margin: 0, lineHeight: 1.4 }}>
            Fuente actual: {collectionName}
          </p>

          <GhostButton danger onClick={() => onRemove(index)} style={{ width: '100%' }}>Eliminar sección</GhostButton>
        </div>
      )}
    </div>
  );
}

export function LinksDirectoryEditor({ config, onChange, editorState }) {
  const [openPanels, setOpenPanels] = useState({ content: true, layout: true, sections: true });
  const cmsData = editorState?.cmsData;
  const rawCollections = cmsData?._collections
    || (cmsData ? Object.keys(cmsData).filter(key => key !== '_collections' && Array.isArray(cmsData[key])).map(key => ({ id: key, label: key.charAt(0).toUpperCase() + key.slice(1) })) : []);

  const collections = rawCollections.map(collection => ({
    ...collection,
    count: cmsData?.[collection.id]?.length || 0,
  }));
  const collectionOptions = collections.map(collection => collection.id);
  const collectionDisplayMap = collections.reduce((displayMap, collection) => ({
    ...displayMap,
    [collection.id]: { name: `${collection.label} (${collection.count})` },
  }), {});

  const sections = config.sections || [];
  const variant = config.variant || 'default';

  const togglePanel = panel => setOpenPanels(current => ({ ...current, [panel]: !current[panel] }));
  const updateConfig = (key, value) => onChange({ ...config, [key]: value });
  const updateSections = nextSections => updateConfig('sections', nextSections);

  const addSection = () => {
    const firstCollection = collections[0];
    updateSections([
      ...sections,
      {
        id: `links-section-${Date.now()}`,
        title: firstCollection?.label || 'Nueva sección',
        collection: firstCollection?.id || '',
      },
    ]);
  };

  const updateSection = (index, patch) => {
    updateSections(sections.map((section, sectionIndex) => (
      sectionIndex === index ? { ...section, ...patch } : section
    )));
  };

  const removeSection = index => updateSections(sections.filter((section, sectionIndex) => sectionIndex !== index));

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Accordion title="Contenido" isOpen={openPanels.content} onToggle={() => togglePanel('content')}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <TitleBlock
            title={config.title || ''}
            subtitle={config.subtitle || ''}
            titleAlign={config.titleAlign || 'left'}
            onChange={(key, value) => updateConfig(key, value)}
          />
        </div>
      </Accordion>

      <Accordion title="Diseño" isOpen={openPanels.layout} onToggle={() => togglePanel('layout')}>
        <ControlGroup title="Visualización">
          <Selector value={variant} options={Object.keys(LINKS_VARIANTS)} displayMap={LINKS_VARIANTS} onChange={value => updateConfig('variant', value)} />
        </ControlGroup>
      </Accordion>

      <Accordion title={`Fuente de datos (${sections.length})`} isOpen={openPanels.sections} onToggle={() => togglePanel('sections')}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {collectionOptions.length === 0 && <EmptyCmsNotice />}

          {sections.map((section, index) => (
            <SectionCard
              key={section.id || index}
              section={section}
              index={index}
              collections={collections}
              collectionDisplayMap={collectionDisplayMap}
              collectionOptions={collectionOptions}
              onUpdate={updateSection}
              onRemove={removeSection}
            />
          ))}

          {sections.length === 0 && collectionOptions.length > 0 && (
            <EmptyText>
              Agrega una sección para listar todos los elementos de una colección CMS como enlaces.
            </EmptyText>
          )}

          <AddButton onClick={addSection} label="Agregar sección CMS" disabled={collectionOptions.length === 0} />
        </div>
      </Accordion>
    </div>
  );
}