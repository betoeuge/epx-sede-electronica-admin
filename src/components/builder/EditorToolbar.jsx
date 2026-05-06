'use client';
import { useState } from 'react';
import { Monitor, Smartphone, Tablet, Undo2, Redo2, Sparkles, Globe, Eye } from 'lucide-react';

/**
 * EditorToolbar — top bar of the page builder.
 *
 * Props:
 *   siteName          {string}   — displayed project name (editable)
 *   onSiteNameChange  {fn}       — called with new name string
 *   previewMode       {string}   — 'desktop' | 'tablet' | 'mobile'
 *   onPreviewModeChange {fn}     — called with new mode string
 *   onPublish         {fn}       — publish button click handler
 *   siteSlug          {string}   — used by "Visualizar" to open the site
 *   canUndo           {boolean}
 *   canRedo           {boolean}
 *   onUndo            {fn}
 *   onRedo            {fn}
 *   aiChatOpen        {boolean}
 *   onToggleAiChat    {fn}
 */
export function EditorToolbar({
  siteName,
  onSiteNameChange,
  previewMode = 'desktop',
  onPreviewModeChange,
  onPublish,
  siteSlug,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
  aiChatOpen = false,
  onToggleAiChat,
}) {
  const [isEditing, setIsEditing] = useState(false);

  const previewModes = [
    { id: 'desktop', label: 'Escritorio', Icon: Monitor },
    { id: 'tablet', label: 'Tablet', Icon: Tablet },
    { id: 'mobile', label: 'Móvil', Icon: Smartphone },
  ];

  const handleVisualizar = () => {
    if (siteSlug) {
      window.open(`/${siteSlug}`, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1rem',
        height: '3.5rem',
        background: '#181818',
        borderBottom: '1px solid #2d2d2d',
        flexShrink: 0,
        gap: '0.75rem',
      }}
    >
      {/* LEFT: Project name + undo/redo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0, flex: '0 0 auto' }}>
        {/* Project name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          {!isEditing ? (
            <span
              onClick={() => setIsEditing(true)}
              title="Haz clic para editar el nombre"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#e0e0e0',
                cursor: 'text',
                padding: '0.125rem 0.25rem',
                borderRadius: '0.25rem',
                maxWidth: '12rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {siteName || 'Sin título'}
            </span>
          ) : (
            <input
              type="text"
              value={siteName || ''}
              autoFocus
              onBlur={() => setIsEditing(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === 'Escape') setIsEditing(false);
              }}
              onChange={(e) => onSiteNameChange?.(e.target.value)}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#e0e0e0',
                background: '#2d2d2d',
                border: '1px solid #4a4a4a',
                borderRadius: '0.25rem',
                outline: 'none',
                padding: '0.125rem 0.375rem',
                minWidth: '7.5rem',
                maxWidth: '14rem',
              }}
            />
          )}
          {/* Pencil icon */}
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              title="Editar nombre"
              style={{
                border: 'none',
                background: 'transparent',
                color: '#4f4f4f',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
          )}
        </div>

        {/* Divider */}
        <div style={{ width: '1px', height: '1.25rem', background: '#2d2d2d' }} />

        {/* Undo / Redo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <button
            onClick={onUndo}
            disabled={!canUndo}
            title="Deshacer (Ctrl+Z)"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '2rem',
              height: '2rem',
              border: 'none',
              borderRadius: '0.375rem',
              background: 'transparent',
              color: canUndo ? '#bdbdbd' : '#3a3a3a',
              cursor: canUndo ? 'pointer' : 'not-allowed',
              transition: 'background 0.15s, color 0.15s',
            }}
            onMouseEnter={(e) => { if (canUndo) e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            <Undo2 size={16} strokeWidth={1.8} />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            title="Rehacer (Ctrl+Y / Ctrl+Shift+Z)"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '2rem',
              height: '2rem',
              border: 'none',
              borderRadius: '0.375rem',
              background: 'transparent',
              color: canRedo ? '#bdbdbd' : '#3a3a3a',
              cursor: canRedo ? 'pointer' : 'not-allowed',
              transition: 'background 0.15s, color 0.15s',
            }}
            onMouseEnter={(e) => { if (canRedo) e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            <Redo2 size={16} strokeWidth={1.8} />
          </button>
        </div>
      </div>

      {/* CENTER: Device preview mode toggle */}
      <div
        role="group"
        aria-label="Tamaño del preview"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          padding: '0.25rem',
          background: '#0d0d0d',
          border: '1px solid #2d2d2d',
          borderRadius: '0.625rem',
        }}
      >
        {previewModes.map(({ id, label, Icon }) => {
          const active = previewMode === id;
          return (
            <button
              key={id}
              type="button"
              title={label}
              aria-label={label}
              aria-pressed={active}
              onClick={() => onPreviewModeChange?.(id)}
              style={{
                width: '2.125rem',
                height: '2.125rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: active ? '1px solid #2d9cdb' : '1px solid transparent',
                borderRadius: '0.5rem',
                background: active ? 'rgba(45,156,219,0.15)' : 'transparent',
                color: active ? '#2d9cdb' : '#828282',
                cursor: 'pointer',
                transition: 'background 0.15s, border-color 0.15s, color 0.15s',
              }}
            >
              <Icon size={17} strokeWidth={1.8} />
            </button>
          );
        })}
      </div>

      {/* RIGHT: AI chat, Visualizar, Publicar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '0 0 auto' }}>
        {/* AI Chat toggle */}
        <button
          onClick={onToggleAiChat}
          title={aiChatOpen ? 'Cerrar asistente IA' : 'Abrir asistente IA'}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.375rem',
            padding: '0 0.75rem',
            height: '2.25rem',
            border: aiChatOpen ? '1px solid rgba(86,204,242,0.5)' : '1px solid #2d2d2d',
            borderRadius: '0.5rem',
            background: aiChatOpen ? 'rgba(86,204,242,0.12)' : 'rgba(255,255,255,0.04)',
            color: aiChatOpen ? '#56ccf2' : '#828282',
            cursor: 'pointer',
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.8125rem',
            fontWeight: 500,
            transition: 'background 0.15s, border-color 0.15s, color 0.15s',
          }}
        >
          <Sparkles size={15} strokeWidth={1.8} />
          IA
        </button>

        {/* Visualizar */}
        <button
          onClick={handleVisualizar}
          title="Abrir el sitio en una nueva pestaña"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem',
            padding: '0 0.875rem',
            height: '2.25rem',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid #2d2d2d',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            color: '#bdbdbd',
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.8125rem',
            fontWeight: 500,
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
        >
          <Eye size={15} strokeWidth={1.8} />
          Visualizar
        </button>

        {/* Publicar */}
        <button
          onClick={onPublish}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem',
            padding: '0 0.875rem',
            height: '2.25rem',
            background: '#003DA6',
            border: '1px solid rgba(0,61,166,0.8)',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            color: '#ffffff',
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.8125rem',
            fontWeight: 600,
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#0049c8'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#003DA6'; }}
        >
          <Globe size={15} strokeWidth={1.8} />
          Publicar
        </button>
      </div>
    </div>
  );
}
