'use client';
import React, { useEffect, useRef, useState } from 'react';
import { ToggleSwitch } from './ToggleSwitch';
import { Selector } from './Selector';
import { CustomColorPicker } from './CustomColorPicker';

export const EDITOR_FONT = 'var(--font-editor)';

const UNSPLASH_IMAGES = [
  { id: 'gov-building', label: 'Edificio institucional', tags: 'gobierno edificio arquitectura ciudad publico', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80&auto=format&fit=crop' },
  { id: 'city-hall', label: 'Ciudad y oficinas', tags: 'ciudad oficinas administracion urbano', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80&auto=format&fit=crop' },
  { id: 'documents', label: 'Documentos y tramite', tags: 'documentos tramite certificado papel oficina', url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80&auto=format&fit=crop' },
  { id: 'meeting', label: 'Reunion de trabajo', tags: 'reunion equipo trabajo oficina personas', url: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200&q=80&auto=format&fit=crop' },
  { id: 'public-service', label: 'Atencion ciudadana', tags: 'servicio ciudadano atencion personas oficina', url: 'https://images.unsplash.com/photo-1573497491208-6b1acb260507?w=1200&q=80&auto=format&fit=crop' },
  { id: 'news', label: 'Noticias y prensa', tags: 'noticias prensa comunicacion periodico informacion', url: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=1200&q=80&auto=format&fit=crop' },
  { id: 'regional', label: 'Actualidad regional', tags: 'regional ciudad calle comunidad territorio', url: 'https://images.unsplash.com/photo-1504711434969-e33886168d6c?w=1200&q=80&auto=format&fit=crop' },
  { id: 'construction', label: 'Infraestructura', tags: 'infraestructura construccion obra permisos ciudad', url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80&auto=format&fit=crop' },
  { id: 'technology', label: 'Transformacion digital', tags: 'tecnologia digital datos computadores futuro', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80&auto=format&fit=crop' },
  { id: 'education', label: 'Educacion y capacitacion', tags: 'educacion capacitacion aula aprendizaje personas', url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=80&auto=format&fit=crop' },
  { id: 'health', label: 'Salud publica', tags: 'salud hospital medicina publico bienestar', url: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1200&q=80&auto=format&fit=crop' },
  { id: 'environment', label: 'Medio ambiente', tags: 'ambiente naturaleza sostenibilidad verde territorio', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80&auto=format&fit=crop' },
];

export function SectionHeader({ children }) {
  return (
    <div style={{ fontFamily: EDITOR_FONT, fontSize: '0.6875rem', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>
      {children}
    </div>
  );
}

export function EditorCard({ children, style }) {
  return (
    <div style={{ background: 'var(--surface-card)', border: '0.0625rem solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', ...style }}>
      {children}
    </div>
  );
}

export function EmptyText({ children }) {
  return (
    <p style={{ fontFamily: EDITOR_FONT, fontSize: '0.8125rem', color: 'var(--text-dim)', margin: 0, fontStyle: 'italic', lineHeight: 1.4 }}>
      {children}
    </p>
  );
}

export function InlineBadge({ children, style }) {
  return (
    <span style={{ fontFamily: EDITOR_FONT, fontSize: '0.625rem', color: 'var(--text-dim)', background: 'var(--bg-hover)', padding: '0.125rem 0.375rem', borderRadius: 'var(--radius-sm)', whiteSpace: 'nowrap', flexShrink: 0, ...style }}>
      {children}
    </span>
  );
}

export function AddButton({ onClick, label, disabled = false }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered && !disabled ? 'var(--surface-card-hover)' : 'var(--surface-card)',
        border: '0.0625rem dashed var(--border-subtle)',
        borderRadius: '0.375rem',
        padding: '0.5rem',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.375rem',
        color: hovered && !disabled ? 'var(--text-active)' : 'var(--text-dim)',
        fontFamily: EDITOR_FONT,
        fontSize: '0.8125rem',
        transition: 'all 0.15s',
        width: '100%',
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M12 5v14M5 12h14" />
      </svg>
      {label}
    </button>
  );
}

export function GhostButton({ onClick, children, active = false, danger = false, style }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: 1,
        background: active ? 'var(--brand-soft)' : danger ? 'var(--color-error-dim)' : hovered ? 'var(--surface-card-hover)' : 'var(--bg-hover)',
        border: `0.0625rem solid ${active ? 'var(--brand-ring)' : danger ? 'rgba(255,77,77,0.3)' : 'var(--border-subtle)'}`,
        borderRadius: 'var(--radius-md)',
        padding: '0.5rem 0.75rem',
        color: active ? 'var(--brand-secondary)' : danger ? 'var(--color-error)' : hovered ? 'var(--text-active)' : 'var(--text-dim)',
        cursor: 'pointer',
        fontFamily: EDITOR_FONT,
        fontSize: '0.75rem',
        fontWeight: 500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.375rem',
        transition: 'all 0.15s',
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function DrillHeader({ onBack, title, subtitle }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1rem', background: 'var(--bg-darker)', borderBottom: '0.0625rem solid var(--border-subtle)', flexShrink: 0 }}>
      <button type="button" onClick={onBack} style={{ background: 'var(--surface-card-hover)', border: '0.0625rem solid var(--border-subtle)', borderRadius: '0.375rem', width: '1.75rem', height: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0, flexShrink: 0 }} title="Volver">
        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
      </button>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: EDITOR_FONT, fontSize: '0.9375rem', fontWeight: 500, color: 'white', lineHeight: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</div>
        {subtitle && <div style={{ fontFamily: EDITOR_FONT, fontSize: '0.6875rem', color: 'var(--text-dim)', marginTop: '0.125rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{subtitle}</div>}
      </div>
    </div>
  );
}

// ─── Alignment Picker ────────────────────────────────────────────
const ALIGN_ICONS = {
  left: (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6"/>
      <line x1="3" y1="10" x2="15" y2="10"/>
      <line x1="3" y1="14" x2="21" y2="14"/>
      <line x1="3" y1="18" x2="13" y2="18"/>
    </svg>
  ),
  center: (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6"/>
      <line x1="6" y1="10" x2="18" y2="10"/>
      <line x1="3" y1="14" x2="21" y2="14"/>
      <line x1="6" y1="18" x2="18" y2="18"/>
    </svg>
  ),
  right: (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6"/>
      <line x1="9" y1="10" x2="21" y2="10"/>
      <line x1="3" y1="14" x2="21" y2="14"/>
      <line x1="11" y1="18" x2="21" y2="18"/>
    </svg>
  ),
};

export function AlignmentPicker({ value = 'left', onChange }) {
  const options = ['left', 'center', 'right'];
  return (
    <div style={{
      display: 'flex', gap: '0.25rem',
      background: 'var(--bg-darker)',
      border: '0.0625rem solid var(--border-subtle)',
      borderRadius: '0.5rem',
      padding: '0.25rem',
    }}>
      {options.map(opt => {
        const isActive = value === opt;
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            title={opt === 'left' ? 'Izquierda' : opt === 'center' ? 'Centro' : 'Derecha'}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '0.375rem',
              background: isActive ? 'var(--bg-active)' : 'transparent',
              border: isActive ? '0.0625rem solid var(--border-focus)' : '0.0625rem solid transparent',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              color: isActive ? 'var(--text-active)' : 'var(--text-dim)',
              transition: 'all 0.15s',
            }}
          >
            {ALIGN_ICONS[opt]}
          </button>
        );
      })}
    </div>
  );
}

// ─── TitleBlock — reusable title+subtitle+alignment group ─────────
export function TitleBlock({ title = '', subtitle = '', titleAlign = 'left', onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {/* Title */}
      <ControlGroup title="Título (opcional)">
        <TextInput value={title} onChange={v => onChange('title', v)} placeholder="Ej. Título de sección" />
      </ControlGroup>
      {/* Subtitle */}
      <ControlGroup title="Subtítulo (opcional)">
        <TextInput value={subtitle} onChange={v => onChange('subtitle', v)} placeholder="Ej. Descripción breve" />
      </ControlGroup>
      {/* Alignment — label stacked above picker */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <span style={{ fontFamily: EDITOR_FONT, fontSize: '0.875rem', color: 'var(--text-active)' }}>
          Alineación del título
        </span>
        <AlignmentPicker value={titleAlign} onChange={v => onChange('titleAlign', v)} />
      </div>
    </div>
  );
}


export function ControlGroup({ title, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <span style={{ fontFamily: EDITOR_FONT, fontSize: '0.875rem', color: 'var(--text-active)' }}>
        {title}
      </span>
      {children}
    </div>
  );
}

export function TextInput({ value, onChange, placeholder, isTextArea = false }) {
  const commonStyle = {
    background: 'var(--bg-darker)',
    border: '0.0625rem solid var(--border-subtle)',
    borderRadius: 'var(--radius-md)',
    padding: '0.5rem 0.875rem',
    color: 'var(--text-dim)',
    fontSize: '0.875rem',
    fontFamily: EDITOR_FONT,
    width: '100%',
    boxSizing: 'border-box',
    outline: 'none',
    resize: isTextArea ? 'vertical' : 'none',
    minHeight: isTextArea ? '4rem' : 'auto'
  };

  if (isTextArea) {
    return <textarea value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={commonStyle} />;
  }
  return <input type="text" value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={commonStyle} />;
}

export function ImageUploader({ label, imageUrl, onUpload, defaultLabel = 'Subir Imagen', previewFit = 'cover', placeholder = 'URL de la imagen...' }) {
  const fileInputRef = useRef(null);
  const [showUnsplash, setShowUnsplash] = useState(false);
  const [search, setSearch] = useState('');
  const [apiImages, setApiImages] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [apiError, setApiError] = useState('');
  const unsplashAccessKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

  const localImages = UNSPLASH_IMAGES.filter(image => {
    const needle = search.trim().toLowerCase();
    if (!needle) return true;
    return `${image.label} ${image.tags}`.toLowerCase().includes(needle);
  });
  const visibleImages = apiImages.length > 0 ? apiImages : localImages;
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => onUpload(ev.target.result);
      reader.readAsDataURL(file);
      e.target.value = '';
    }
  };

  useEffect(() => {
    if (!showUnsplash || !unsplashAccessKey) return;

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      const query = search.trim() || 'government office public service';
      setIsSearching(true);
      setApiError('');

      try {
        const params = new URLSearchParams({
          query,
          per_page: '12',
          orientation: 'landscape',
          content_filter: 'high',
          client_id: unsplashAccessKey,
        });
        const response = await fetch(`https://api.unsplash.com/search/photos?${params.toString()}`, { signal: controller.signal });
        if (!response.ok) throw new Error('Unsplash no respondió correctamente.');
        const payload = await response.json();
        const images = (payload.results || []).map(photo => ({
          id: photo.id,
          label: photo.alt_description || photo.description || photo.user?.name || 'Imagen de Unsplash',
          url: photo.urls?.regular || photo.urls?.full || photo.urls?.small,
          thumb: photo.urls?.small || photo.urls?.thumb || photo.urls?.regular,
          downloadLocation: photo.links?.download_location,
          author: photo.user?.name,
        })).filter(image => Boolean(image.url));
        setApiImages(images);
      } catch (error) {
        if (error.name !== 'AbortError') {
          setApiError('No se pudo consultar Unsplash. Mostrando imágenes sugeridas.');
          setApiImages([]);
        }
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [search, showUnsplash, unsplashAccessKey]);

  const selectUnsplashImage = (image) => {
    onUpload(image.url);
    setShowUnsplash(false);

    if (image.downloadLocation && unsplashAccessKey) {
      const separator = image.downloadLocation.includes('?') ? '&' : '?';
      fetch(`${image.downloadLocation}${separator}client_id=${unsplashAccessKey}`).catch(() => {});
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
      {label && <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.875rem', color: 'var(--text-active)' }}>{label}</span>}
      <div 
        style={{ 
          background: 'var(--bg-hover)', border: '0.0625rem dashed var(--border-subtle)', 
          borderRadius: '0.25rem', height: '6rem', display: 'flex', alignItems: 'center', 
          justifyContent: 'center', overflow: 'hidden', position: 'relative' 
        }}
        title="Vista previa de imagen"
      >
        {imageUrl ? (
          <img src={imageUrl} alt={label || ''} style={{ width: '100%', height: '100%', objectFit: previewFit }} />
        ) : (
          <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem', fontFamily: EDITOR_FONT, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
            <svg width={20} height={20} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            {defaultLabel}
          </div>
        )}
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
      </div>

      <TextInput value={imageUrl || ''} onChange={onUpload} placeholder={placeholder} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '0.5rem' }}>
        <GhostButton onClick={() => fileInputRef.current?.click()} style={{ flex: 'none', padding: '0.45rem 0.5rem' }}>
          Subir
        </GhostButton>
        <GhostButton onClick={() => setShowUnsplash(value => !value)} active={showUnsplash} style={{ flex: 'none', padding: '0.45rem 0.5rem' }}>
          Unsplash
        </GhostButton>
        <GhostButton danger onClick={() => onUpload('')} style={{ flex: 'none', padding: '0.45rem 0.5rem' }}>
          Limpiar
        </GhostButton>
      </div>

      {showUnsplash && (
        <div style={{ background: 'var(--surface-card)', border: '0.0625rem solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '0.625rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-darker)', border: '0.0625rem solid var(--border-subtle)', borderRadius: '0.5rem', padding: '0.45rem 0.625rem' }}>
            <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="var(--text-dim)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input
              value={search}
              onChange={event => setSearch(event.target.value)}
              placeholder="Buscar en Unsplash..."
              style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-active)', fontFamily: EDITOR_FONT, fontSize: '0.8125rem', width: '100%' }}
            />
          </div>

          {!unsplashAccessKey && <EmptyText>Agrega VITE_UNSPLASH_ACCESS_KEY para búsqueda en vivo.</EmptyText>}
          {apiError && <EmptyText>{apiError}</EmptyText>}
          {isSearching && <EmptyText>Buscando imágenes...</EmptyText>}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '0.5rem', maxHeight: '14rem', overflowY: 'auto' }}>
            {visibleImages.map(image => (
              <button
                key={image.id}
                type="button"
                onClick={() => selectUnsplashImage(image)}
                title={image.label}
                style={{ background: 'var(--bg-darker)', border: '0.0625rem solid var(--border-subtle)', borderRadius: '0.375rem', padding: 0, overflow: 'hidden', cursor: 'pointer', textAlign: 'left' }}
              >
                <img src={image.thumb || image.url} alt="" loading="lazy" style={{ width: '100%', height: '4.25rem', objectFit: 'cover', display: 'block' }} />
                <span style={{ display: 'block', padding: '0.3125rem 0.4rem', fontFamily: EDITOR_FONT, fontSize: '0.625rem', color: 'var(--text-dim)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {image.label}
                </span>
              </button>
            ))}
          </div>

          {visibleImages.length === 0 && !isSearching && <EmptyText>No hay imágenes para esa búsqueda.</EmptyText>}
        </div>
      )}
    </div>
  );
}

function ListItem({ item, index, draggingIndex, handleDragStart, handleDragOver, handleDrop, renderItemPreview, deleteItem }) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div 
      draggable
      onDragStart={() => handleDragStart(index)}
      onDragOver={(e) => handleDragOver(e, index)}
      onDrop={() => handleDrop(index)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        background: 'var(--bg-darker)', 
        border: '0.0625rem solid var(--border-subtle)', 
        borderRadius: 'var(--radius-sm)', 
        display: 'flex', 
        alignItems: 'center', 
        padding: '0.5rem 0.75rem', 
        gap: '0.625rem',
        opacity: draggingIndex === index ? 0.5 : 1,
        transition: 'background 0.2s',
        cursor: 'pointer'
      }}
      onMouseOver={e => e.currentTarget.style.background = 'var(--bg-hover)'}
      onMouseOut={e => e.currentTarget.style.background = 'var(--bg-darker)'}
    >
      {/* Grab handle */}
      <svg width={7} height={16} viewBox="0 0 7 16" fill="none" style={{ flexShrink: 0, cursor: 'grab' }}>
        <circle cx="2" cy="2" r="1.5" fill="var(--text-dim)"/>
        <circle cx="2" cy="8" r="1.5" fill="var(--text-dim)"/>
        <circle cx="2" cy="14" r="1.5" fill="var(--text-dim)"/>
        <circle cx="6" cy="2" r="1.5" fill="var(--text-dim)"/>
        <circle cx="6" cy="8" r="1.5" fill="var(--text-dim)"/>
        <circle cx="6" cy="14" r="1.5" fill="var(--text-dim)"/>
      </svg>
      
      {/* Content preview */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {renderItemPreview(item, index)}
      </div>
      
      {/* Delete button (shows on hover) */}
      <div style={{ width: '1.5rem', display: 'flex', justifyContent: 'center' }}>
        {isHovered && (
          <button 
            onClick={(e) => { e.stopPropagation(); deleteItem(index); }}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.25rem'}}
            title="Eliminar"
          >
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export function ListEditor({ items, onItemsChange, renderItemPreview, emptyLabel = 'No hay elementos' }) {
  const [draggingIndex, setDraggingIndex] = React.useState(null);

  const deleteItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    onItemsChange(newItems);
  };

  const handleDragStart = (index) => {
    setDraggingIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
  };

  const handleDrop = (targetIndex) => {
    if (draggingIndex === null || draggingIndex === targetIndex) return;
    const newItems = [...items];
    const [draggedItem] = newItems.splice(draggingIndex, 1);
    newItems.splice(targetIndex, 0, draggedItem);
    onItemsChange(newItems);
    setDraggingIndex(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {items.length === 0 && <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{emptyLabel}</div>}
      {items.map((item, index) => (
        <ListItem 
          key={item.id || index}
          item={item}
          index={index}
          draggingIndex={draggingIndex}
          handleDragStart={handleDragStart}
          handleDragOver={handleDragOver}
          handleDrop={handleDrop}
          renderItemPreview={renderItemPreview}
          deleteItem={deleteItem}
        />
      ))}
    </div>
  );
}

export { ToggleSwitch, Selector, CustomColorPicker };
