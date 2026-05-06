import React, { useState } from 'react';
import { Accordion } from '../Accordion';
import { AddButton, ControlGroup, DrillHeader, TextInput, ImageUploader, ListEditor, Selector, CustomColorPicker, ToggleSwitch, AlignmentPicker, EditorCard, EmptyText, GhostButton } from '../EditorControls';
import { IconSelector } from '../IconSelector';

const SLIDER_VARIANTS = {
  Hero: { name: 'Fondo completo' },
  Complex: { name: 'Dividido' }
};

const BUTTON_STYLES = {
  primary: { name: 'Primario' },
  secondary: { name: 'Secundario' }
};

const parseRem = (value, fallback) => {
  if (typeof value === 'number') return value;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const parseRadius = (value, fallback = 4) => {
  if (typeof value === 'number') return value;
  if (typeof value !== 'string') return fallback;
  const parsed = Number.parseFloat(value);
  if (!Number.isFinite(parsed)) return fallback;
  return value.includes('rem') ? Math.round(parsed * 16) : parsed;
};

function RangeControl({ value, min, max, step = 1, onChange, valueLabel }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', color: 'var(--text-dim)' }}>
        <span>{min}</span>
        <span style={{ color: 'var(--text-active)' }}>{valueLabel ? valueLabel(value) : value}</span>
        <span>{max}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={event => onChange(Number(event.target.value))}
        style={{ width: '100%', accentColor: 'var(--color-selection)', cursor: 'pointer' }}
      />
    </div>
  );
}

export function SliderEditor({ config, onChange }) {
  const [editingSlideIndex, setEditingSlideIndex] = useState(null);
  const [editingButtonIndex, setEditingButtonIndex] = useState(null);
  const [openPanels, setOpenPanels] = useState({ config: true, responsive: false, controls: false, slides: true });
  
  const togglePanel = (key) => setOpenPanels(p => ({ ...p, [key]: !p[key] }));

  const updateConfig = (key, value) => {
    onChange({ ...config, [key]: value });
  };

  const slides = config.slides || [];
  const rawVariant = config.variant || 'Hero';
  const variant = rawVariant === 'Complex' ? 'Complex' : 'Hero';

  const handleAddSlide = () => {
    const newSlide = {
      title: 'Nuevo Slide',
      subtitle: 'Descripción breve del contenido',
      bg: '#005384',
      img: '',
      buttons: [createButton('primary')]
    };
    updateConfig('slides', [...slides, newSlide]);
    setEditingSlideIndex(slides.length);
  };

  const handleSlideChange = (index, key, value) => {
    const newSlides = [...slides];
    newSlides[index] = { ...newSlides[index], [key]: value };
    updateConfig('slides', newSlides);
  };

  const createButton = (style = 'primary') => ({
    label: style === 'primary' ? 'Iniciar trámite' : 'Más información',
    url: '#',
    style,
    showIcon: false,
    icon: 'arrow-right',
    backgroundColor: style === 'primary' ? '#0057B8' : 'transparent',
    textColor: '#ffffff',
    borderColor: style === 'primary' ? '#0057B8' : 'rgba(255,255,255,0.72)',
    radius: '4px'
  });

  const updateButton = (slideIndex, buttonIndex, patch) => {
    const slide = slides[slideIndex];
    const buttons = [...(slide.buttons || [])];
    buttons[buttonIndex] = { ...buttons[buttonIndex], ...patch };
    handleSlideChange(slideIndex, 'buttons', buttons);
  };

  const addButton = (slideIndex) => {
    const slide = slides[slideIndex];
    const buttons = [...(slide.buttons || [])].slice(0, 2);
    if (buttons.length >= 2) return;
    const nextButton = createButton(buttons.length === 0 ? 'primary' : 'secondary');
    handleSlideChange(slideIndex, 'buttons', [...buttons, nextButton]);
    setEditingButtonIndex(buttons.length);
  };

  const removeButton = (slideIndex, buttonIndex) => {
    const slide = slides[slideIndex];
    const buttons = [...(slide.buttons || [])];
    buttons.splice(buttonIndex, 1);
    handleSlideChange(slideIndex, 'buttons', buttons);
    setEditingButtonIndex(null);
  };

  // If editing a specific slide
  if (editingSlideIndex !== null) {
    const slide = slides[editingSlideIndex];
    const buttons = (slide.buttons || []).slice(0, 2);
    const editingButton = editingButtonIndex !== null ? buttons[editingButtonIndex] : null;
    if (!slide) {
      setEditingSlideIndex(null);
      return null;
    }

    if (editingButton) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <DrillHeader onBack={() => setEditingButtonIndex(null)} title={`Botón ${editingButtonIndex + 1}`} subtitle={slide.title || `Slide ${editingSlideIndex + 1}`} />

          <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <ControlGroup title="Texto del botón">
              <TextInput value={editingButton.label} onChange={v => updateButton(editingSlideIndex, editingButtonIndex, { label: v })} placeholder="Ej. Iniciar trámite" />
            </ControlGroup>

            <ControlGroup title="Enlace">
              <TextInput value={editingButton.url} onChange={v => updateButton(editingSlideIndex, editingButtonIndex, { url: v })} placeholder="https://... o #" />
            </ControlGroup>

            <ControlGroup title="Estilo">
              <Selector value={editingButton.style || 'primary'} options={Object.keys(BUTTON_STYLES)} displayMap={BUTTON_STYLES} onChange={v => updateButton(editingSlideIndex, editingButtonIndex, { style: v })} />
            </ControlGroup>

            <EditorCard>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.875rem', color: 'var(--text-active)' }}>Mostrar ícono</span>
                <ToggleSwitch checked={editingButton.showIcon === true} onChange={v => updateButton(editingSlideIndex, editingButtonIndex, { showIcon: v })} />
              </div>
              {editingButton.showIcon && (
                <ControlGroup title="Ícono">
                  <IconSelector value={editingButton.icon || 'arrow-right'} onChange={v => updateButton(editingSlideIndex, editingButtonIndex, { icon: v })} />
                </ControlGroup>
              )}
            </EditorCard>

            <ControlGroup title="Color de fondo">
              <CustomColorPicker label="Fondo" value={editingButton.backgroundColor || '#0057B8'} onChange={v => updateButton(editingSlideIndex, editingButtonIndex, { backgroundColor: v })} />
            </ControlGroup>

            <ControlGroup title="Color de texto">
              <CustomColorPicker label="Texto" value={editingButton.textColor || '#ffffff'} onChange={v => updateButton(editingSlideIndex, editingButtonIndex, { textColor: v })} />
            </ControlGroup>

            <ControlGroup title="Color de borde">
              <CustomColorPicker label="Borde" value={editingButton.borderColor || '#0057B8'} onChange={v => updateButton(editingSlideIndex, editingButtonIndex, { borderColor: v })} />
            </ControlGroup>

            <ControlGroup title="Redondez del botón">
              <RangeControl
                min={0}
                max={32}
                value={parseRadius(editingButton.radius, 4)}
                onChange={v => updateButton(editingSlideIndex, editingButtonIndex, { radius: `${v}px` })}
                valueLabel={v => v === 0 ? 'Recto' : v >= 24 ? 'Muy redondeado' : `${v}px`}
              />
            </ControlGroup>

            <GhostButton danger onClick={() => removeButton(editingSlideIndex, editingButtonIndex)}>Eliminar botón</GhostButton>
          </div>
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <DrillHeader onBack={() => setEditingSlideIndex(null)} title={`Editar Slide ${editingSlideIndex + 1}`} subtitle={`${slides.length} ${slides.length === 1 ? 'slide' : 'slides'}`} />
        
        <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <ControlGroup title="Título">
            <TextInput value={slide.title} onChange={v => handleSlideChange(editingSlideIndex, 'title', v)} placeholder="Título principal" />
          </ControlGroup>
          
          <ControlGroup title="Descripción">
            <TextInput isTextArea value={slide.subtitle} onChange={v => handleSlideChange(editingSlideIndex, 'subtitle', v)} placeholder="Texto secundario" />
          </ControlGroup>

          <ControlGroup title="Imagen de fondo">
            <ImageUploader imageUrl={slide.img} onUpload={v => handleSlideChange(editingSlideIndex, 'img', v)} />
          </ControlGroup>

          <ControlGroup title="Color de fondo">
            <CustomColorPicker label="Color" value={slide.bg} onChange={v => handleSlideChange(editingSlideIndex, 'bg', v)} />
          </ControlGroup>

          <ControlGroup title={`Botones (${buttons.length}/2)`}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {buttons.length === 0 && <EmptyText>Este slide no tiene botones.</EmptyText>}
              {buttons.map((button, index) => (
                <EditorCard key={index} style={{ gap: '0.5rem', cursor: 'pointer' }}>
                  <div onClick={() => setEditingButtonIndex(index)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.8125rem', color: 'var(--text-active)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {button.label || `Botón ${index + 1}`}
                    </span>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.6875rem', color: 'var(--text-dim)' }}>Editar</span>
                  </div>
                </EditorCard>
              ))}
              <AddButton disabled={buttons.length >= 2} onClick={() => addButton(editingSlideIndex)} label={buttons.length >= 2 ? 'Máximo 2 botones' : 'Agregar botón'} />
            </div>
          </ControlGroup>

        </div>
      </div>
    );
  }

  // Main Editor View
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Accordion title="Diseño" isOpen={openPanels.config} onToggle={() => togglePanel('config')}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <ControlGroup title="Tipo de slider">
          <Selector 
            value={variant} 
            options={Object.keys(SLIDER_VARIANTS)} 
            displayMap={SLIDER_VARIANTS} 
            onChange={v => updateConfig('variant', v)} 
          />
          </ControlGroup>

          <ControlGroup title="Alineación del texto">
            <AlignmentPicker value={config.textAlign || 'left'} onChange={v => updateConfig('textAlign', v)} />
          </ControlGroup>

          <ControlGroup title="Color del texto">
            <CustomColorPicker label="Texto" value={config.textColor || '#ffffff'} onChange={v => updateConfig('textColor', v)} />
          </ControlGroup>

          {variant === 'Hero' && (
            <ControlGroup title="Opacidad de capa">
              <RangeControl
                min={0}
                max={100}
                value={Math.round((config.overlayOpacity ?? 0.9) * 100)}
                onChange={v => updateConfig('overlayOpacity', v / 100)}
                valueLabel={v => `${v}%`}
              />
            </ControlGroup>
          )}

          {variant === 'Complex' && (
            <ControlGroup title="Área de imagen">
              <RangeControl
                min={30}
                max={70}
                value={Number(config.splitImageWidth) || 60}
                onChange={v => updateConfig('splitImageWidth', v)}
                valueLabel={v => `${v}% imagen / ${100 - v}% texto`}
              />
            </ControlGroup>
          )}
        </div>
      </Accordion>

      <Accordion title="Responsive" isOpen={openPanels.responsive} onToggle={() => togglePanel('responsive')}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <ControlGroup title="Alto desktop">
            <RangeControl
              min={18}
              max={48}
              value={parseRem(config.desktopHeight, 28)}
              onChange={v => updateConfig('desktopHeight', `${v}rem`)}
              valueLabel={v => v <= 24 ? 'Bajo' : v >= 40 ? 'Alto' : 'Medio'}
            />
          </ControlGroup>
          <ControlGroup title="Alto tablet">
            <RangeControl
              min={18}
              max={44}
              value={parseRem(config.tabletHeight, 28)}
              onChange={v => updateConfig('tabletHeight', `${v}rem`)}
              valueLabel={v => v <= 24 ? 'Bajo' : v >= 38 ? 'Alto' : 'Medio'}
            />
          </ControlGroup>
          <ControlGroup title="Alto móvil">
            <RangeControl
              min={24}
              max={56}
              value={parseRem(config.mobileHeight, 34)}
              onChange={v => updateConfig('mobileHeight', `${v}rem`)}
              valueLabel={v => v <= 30 ? 'Compacto' : v >= 46 ? 'Amplio' : 'Cómodo'}
            />
          </ControlGroup>
        </div>
      </Accordion>

      <Accordion title="Controles" isOpen={openPanels.controls} onToggle={() => togglePanel('controls')}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            ['autoplay', 'Reproducción automática', config.autoplay !== false],
            ['showArrows', 'Mostrar flechas', config.showArrows !== false],
            ['showDots', 'Mostrar indicadores', config.showDots !== false],
            ['showPause', 'Mostrar pausa', config.showPause !== false],
          ].map(([key, label, checked]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.875rem', color: 'var(--text-active)' }}>{label}</span>
              <ToggleSwitch checked={checked} onChange={v => updateConfig(key, v)} />
            </div>
          ))}
          <ControlGroup title="Tiempo entre slides">
            <RangeControl
              min={2}
              max={12}
              value={Math.round((config.intervalMs || 5000) / 1000)}
              onChange={v => updateConfig('intervalMs', v * 1000)}
              valueLabel={v => `${v} segundos`}
            />
          </ControlGroup>
        </div>
      </Accordion>

      <Accordion title={`Elementos (${slides.length})`} isOpen={openPanels.slides} onToggle={() => togglePanel('slides')}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <ListEditor 
            items={slides} 
            onItemsChange={v => updateConfig('slides', v)}
            renderItemPreview={(item, index) => (
              <div 
                style={{ fontSize: '0.8125rem', color: 'var(--text-active)', cursor: 'pointer', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                onClick={() => setEditingSlideIndex(index)}
              >
                {item.title || `Slide ${index + 1}`}
              </div>
            )}
          />
          <AddButton onClick={handleAddSlide} label="Agregar slide" />
        </div>
      </Accordion>
    </div>
  );
}
