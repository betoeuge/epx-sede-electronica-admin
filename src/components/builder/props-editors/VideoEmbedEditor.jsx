import React, { useState } from 'react';
import { Accordion } from '../Accordion';
import { AlignmentPicker, ControlGroup, GhostButton, ImageUploader, Selector, TextInput } from '../EditorControls';
import { CustomColorPicker } from '../CustomColorPicker';

const DEFAULT_NETWORK_BG = '/assets/video-section-network-bg.png';

const LAYOUTS = {
  'text-left': { name: 'Texto primero' },
  'text-right': { name: 'Video primero' },
  center: { name: 'Centrado' },
};

const BACKGROUND_TYPES = {
  color: { name: 'Color' },
  image: { name: 'Imagen' },
};

export function VideoEmbedEditor({ config, onChange }) {
  const [openPanels, setOpenPanels] = useState({ layout: true, content: true, video: true, appearance: true });
  const togglePanel = (key) => setOpenPanels(prev => ({ ...prev, [key]: !prev[key] }));
  const updateConfig = (key, value) => onChange({ ...config, [key]: value });

  const layout = config.layout || 'text-right';
  const backgroundType = config.backgroundType || 'image';
  const titleAlign = config.titleAlign || 'center';

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Accordion title="Diseño" isOpen={openPanels.layout} onToggle={() => togglePanel('layout')}>
        <ControlGroup title="Diseño del contenido">
          <Selector value={layout} options={Object.keys(LAYOUTS)} displayMap={LAYOUTS} onChange={value => updateConfig('layout', value)} />
        </ControlGroup>
      </Accordion>

      <Accordion title="Contenido" isOpen={openPanels.content} onToggle={() => togglePanel('content')}>
        <ControlGroup title="Título de la sección">
          <TextInput value={config.title || ''} onChange={value => updateConfig('title', value)} placeholder="Ej: Video institucional" />
        </ControlGroup>
        <ControlGroup title="Alineación del título">
          <AlignmentPicker value={titleAlign} onChange={value => updateConfig('titleAlign', value)} />
        </ControlGroup>
        <ControlGroup title="Color del texto">
          <CustomColorPicker label="" value={config.textColor || config.titleColor || config.descriptionTitleColor || config.descriptionColor || '#ffffff'} onChange={value => updateConfig('textColor', value)} />
        </ControlGroup>
        {layout !== 'center' && (
          <>
            <ControlGroup title="Título descriptivo">
              <TextInput value={config.descriptionTitle || ''} onChange={value => updateConfig('descriptionTitle', value)} placeholder="Ej: Conoce nuestra gestión" />
            </ControlGroup>
            <ControlGroup title="Texto descriptivo">
              <TextInput isTextArea value={config.description || ''} onChange={value => updateConfig('description', value)} placeholder="Agrega una descripción breve del video..." />
            </ControlGroup>
          </>
        )}
      </Accordion>

      <Accordion title="Video" isOpen={openPanels.video} onToggle={() => togglePanel('video')}>
        <ControlGroup title="URL de YouTube, Vimeo o iframe">
          <TextInput value={config.videoUrl || ''} onChange={value => updateConfig('videoUrl', value)} placeholder="https://www.youtube.com/watch?v=..." />
        </ControlGroup>
      </Accordion>

      <Accordion title="Apariencia" isOpen={openPanels.appearance} onToggle={() => togglePanel('appearance')}>
        <ControlGroup title="Tipo de fondo">
          <Selector value={backgroundType} options={Object.keys(BACKGROUND_TYPES)} displayMap={BACKGROUND_TYPES} onChange={value => updateConfig('backgroundType', value)} />
        </ControlGroup>
        {backgroundType === 'color' ? (
          <CustomColorPicker label="Color de fondo" value={config.backgroundColor || '#07031f'} onChange={value => updateConfig('backgroundColor', value)} />
        ) : (
          <>
            <ImageUploader imageUrl={config.backgroundImage ?? DEFAULT_NETWORK_BG} onUpload={value => updateConfig('backgroundImage', value)} defaultLabel="Imagen de fondo" previewFit="cover" placeholder="URL de la imagen de fondo..." />
            <GhostButton onClick={() => updateConfig('backgroundImage', DEFAULT_NETWORK_BG)} style={{ flex: 'none' }}>
              Usar fondo del diseño
            </GhostButton>
          </>
        )}
      </Accordion>
    </div>
  );
}
