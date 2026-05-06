'use client';
import { useState, useEffect, useMemo } from 'react';
import { MessageSquare, Plus, Send, Sparkles, Trash2, X } from 'lucide-react';
import { SECTION_REGISTRY } from '@/components/builder/sectionRegistry';

const FONT = "'Inter', sans-serif";

const ambientStyles = `
  @keyframes ai-chat-orbit {
    0% { transform: translate3d(-4%, -2%, 0) scale(1); opacity: 0.5; }
    50% { transform: translate3d(4%, 3%, 0) scale(1.08); opacity: 0.72; }
    100% { transform: translate3d(-4%, -2%, 0) scale(1); opacity: 0.5; }
  }

  @keyframes ai-chat-grid-drift {
    0% { transform: translate3d(0, 0, 0); opacity: 0.22; }
    50% { transform: translate3d(-1.5rem, 1rem, 0); opacity: 0.34; }
    100% { transform: translate3d(0, 0, 0); opacity: 0.22; }
  }

  .ai-chat-panel-sede {
    position: relative;
    isolation: isolate;
  }

  .ai-chat-panel-sede::before,
  .ai-chat-panel-sede::after {
    content: '';
    position: absolute;
    pointer-events: none;
    z-index: 0;
  }

  .ai-chat-panel-sede::before {
    inset: -18%;
    background:
      radial-gradient(circle at 28% 35%, rgba(86,204,242,0.18), transparent 28%),
      radial-gradient(circle at 74% 58%, rgba(111,207,151,0.10), transparent 30%),
      radial-gradient(circle at 50% 112%, rgba(47,128,237,0.14), transparent 34%);
    filter: blur(3rem);
    animation: ai-chat-orbit 14s ease-in-out infinite;
  }

  .ai-chat-panel-sede::after {
    inset: 0;
    background:
      linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
    background-size: 4.5rem 4.5rem;
    animation: ai-chat-grid-drift 18s ease-in-out infinite;
  }

  .ai-chat-content-sede {
    position: relative;
    z-index: 1;
  }

  .ai-chat-history-scroll-sede::-webkit-scrollbar,
  .ai-chat-message-list-sede::-webkit-scrollbar {
    width: 0.375rem;
  }

  .ai-chat-history-scroll-sede::-webkit-scrollbar-thumb,
  .ai-chat-message-list-sede::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.16);
    border-radius: 999px;
  }

  .ai-chat-conversation-row-sede {
    position: relative;
  }

  .ai-chat-conversation-trigger-sede {
    width: 100%;
    min-width: 0;
    min-height: 2.75rem;
    border: 1px solid transparent;
    border-radius: 0.375rem;
    background: transparent;
    color: #e0e0e0;
    cursor: pointer;
    text-align: left;
    padding: 0.5rem 2.25rem 0.5rem 0.625rem;
    font-family: ${FONT};
    transition: background 0.16s ease, border-color 0.16s ease;
  }

  .ai-chat-conversation-trigger-sede:hover {
    background: rgba(255,255,255,0.05);
  }

  .ai-chat-conversation-trigger-sede.is-active {
    background: linear-gradient(180deg, rgba(255,255,255,0.055), rgba(255,255,255,0.025));
    border-color: rgba(86,204,242,0.46);
  }

  .ai-chat-conversation-delete-sede {
    position: absolute;
    top: 0.375rem;
    right: 0.25rem;
    width: 1.75rem;
    height: 1.75rem;
    border: none;
    border-radius: 0.25rem;
    background: transparent;
    color: #828282;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.16s ease, background 0.16s ease;
  }

  .ai-chat-conversation-row-sede:hover .ai-chat-conversation-delete-sede {
    opacity: 1;
    pointer-events: auto;
  }

  .ai-chat-conversation-delete-sede:hover {
    background: rgba(255,255,255,0.08);
    color: #e0e0e0;
  }

  @media (prefers-reduced-motion: reduce) {
    .ai-chat-panel-sede::before,
    .ai-chat-panel-sede::after {
      animation: none;
    }
  }
`;

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildComponentCatalog() {
  return Object.values(SECTION_REGISTRY).map((r) => ({ id: r.id, name: r.name }));
}

function getEditorSummary(editorState) {
  return {
    pages: Object.keys(editorState?.pages || {}),
    activePageId: editorState?.activePageId,
  };
}

function createConversation(title = 'Nueva conversación', messages = []) {
  const now = new Date().toISOString();
  return {
    id: `chat-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    title,
    messages,
    createdAt: now,
    updatedAt: now,
  };
}

function getConversationTitle(prompt) {
  const clean = prompt.replace(/\s+/g, ' ').trim();
  if (!clean) return 'Nueva conversación';
  return clean.length > 46 ? `${clean.slice(0, 43)}...` : clean;
}

function getStorageKey(siteId) {
  return `sede-ai-chat:${siteId || 'default'}`;
}

function normalizeChatStore(value) {
  const conversations = Array.isArray(value?.conversations)
    ? value.conversations.filter((c) => c?.id)
    : [];
  if (conversations.length === 0) {
    const c = createConversation();
    return { activeConversationId: c.id, conversations: [c] };
  }
  const activeConversationId = conversations.some((c) => c.id === value?.activeConversationId)
    ? value.activeConversationId
    : conversations[0].id;
  return { activeConversationId, conversations };
}

function loadChatStore(storageKey) {
  if (typeof window === 'undefined') return normalizeChatStore(null);
  try {
    return normalizeChatStore(JSON.parse(window.localStorage.getItem(storageKey)));
  } catch {
    return normalizeChatStore(null);
  }
}

function saveChatStore(storageKey, store) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(storageKey, JSON.stringify({
      activeConversationId: store.activeConversationId,
      conversations: store.conversations,
    }));
  } catch {}
}

function formatDate(value) {
  if (!value) return '';
  return new Intl.DateTimeFormat('es-CO', { month: 'short', day: 'numeric' }).format(new Date(value));
}

// ── Sub-components ────────────────────────────────────────────────────────────

function MessageBubble({ role, children }) {
  const isUser = role === 'user';
  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', width: '100%' }}>
      <div
        style={{
          maxWidth: '78%',
          padding: '0.875rem 1rem',
          borderRadius: isUser ? '1rem 1rem 0.25rem 1rem' : '1rem 1rem 1rem 0.25rem',
          background: isUser ? 'rgba(86,204,242,0.13)' : '#1d1e1f',
          border: '1px solid rgba(255,255,255,0.05)',
          color: '#e0e0e0',
          fontFamily: FONT,
          fontSize: '0.9375rem',
          lineHeight: 1.45,
          whiteSpace: 'pre-line',
        }}
      >
        {children}
      </div>
    </div>
  );
}

function ChatInput({ value, onChange, onSubmit, disabled }) {
  const hasPrompt = value.trim().length > 0;
  return (
    <form
      onSubmit={onSubmit}
      style={{
        width: '100%',
        minHeight: '4rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.875rem 1rem',
        boxSizing: 'border-box',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '1rem',
        background: 'rgba(29,30,31,0.92)',
        backdropFilter: 'blur(1.125rem)',
        WebkitBackdropFilter: 'blur(1.125rem)',
        boxShadow: '0 1rem 2.75rem rgba(0,0,0,0.28)',
        flexShrink: 0,
      }}
    >
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={disabled ? 'Procesando...' : 'Pregúntame sobre el sitio...'}
        style={{
          flex: 1,
          minWidth: 0,
          border: 'none',
          outline: 'none',
          background: 'transparent',
          color: '#e0e0e0',
          fontFamily: FONT,
          fontSize: '0.9375rem',
          fontWeight: 300,
        }}
      />
      <button
        type={hasPrompt ? 'submit' : 'button'}
        disabled={disabled || !hasPrompt}
        title="Enviar"
        style={{
          width: '2rem',
          height: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          border: 'none',
          borderRadius: '0.5rem',
          background: hasPrompt ? 'rgba(86,204,242,0.14)' : 'transparent',
          color: hasPrompt ? '#56ccf2' : '#4f4f4f',
          cursor: disabled || !hasPrompt ? 'default' : 'pointer',
          opacity: disabled ? 0.55 : 1,
          transition: 'background 0.15s, color 0.15s',
        }}
      >
        <Send size={17} strokeWidth={1.8} />
      </button>
    </form>
  );
}

function ChatHistorySidebar({ conversations, activeConversationId, onSelectConversation, onNewConversation, onDeleteConversation }) {
  return (
    <aside
      style={{
        width: '15rem',
        flexShrink: 0,
        borderRight: '1px solid #2d2d2d',
        background: '#141414',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
      }}
    >
      <header style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', borderBottom: '1px solid #2d2d2d' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MessageSquare size={15} color="#828282" strokeWidth={1.8} />
          <span style={{ fontFamily: FONT, fontSize: '0.875rem', fontWeight: 500, color: '#e0e0e0' }}>
            Conversaciones
          </span>
        </div>
        <button
          type="button"
          onClick={onNewConversation}
          style={{
            width: '100%',
            minHeight: '2.125rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
            border: '1px solid #2d2d2d',
            borderRadius: '0.375rem',
            background: 'rgba(255,255,255,0.04)',
            color: '#bdbdbd',
            cursor: 'pointer',
            fontFamily: FONT,
            fontSize: '0.8125rem',
            fontWeight: 500,
          }}
        >
          <Plus size={14} strokeWidth={1.9} />
          Nueva conversación
        </button>
      </header>
      <div
        className="ai-chat-history-scroll-sede"
        style={{ flex: 1, overflowY: 'auto', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}
      >
        {conversations.map((conv) => {
          const isActive = conv.id === activeConversationId;
          return (
            <div key={conv.id} className="ai-chat-conversation-row-sede">
              <button
                type="button"
                className={`ai-chat-conversation-trigger-sede${isActive ? ' is-active' : ''}`}
                onClick={() => onSelectConversation(conv.id)}
              >
                <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.8125rem', fontWeight: 500 }}>
                  {conv.title || 'Nueva conversación'}
                </span>
                <span style={{ display: 'block', marginTop: '0.2rem', color: '#828282', fontSize: '0.75rem' }}>
                  {formatDate(conv.updatedAt)} · {conv.messages?.length || 0} mensajes
                </span>
              </button>
              <button
                type="button"
                className="ai-chat-conversation-delete-sede"
                onClick={() => onDeleteConversation(conv.id)}
                title="Eliminar conversación"
              >
                <Trash2 size={14} strokeWidth={1.8} />
              </button>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

/**
 * AIChatPanel — sliding AI assistant panel for the page builder.
 *
 * Props:
 *   siteId       {string}
 *   editorState  {object}
 *   onApplyPlan  {fn(plan)}  — called when AI returns an actionable plan
 *   isOpen       {boolean}
 *   onClose      {fn}
 */
export function AIChatPanel({ siteId, editorState, onApplyPlan, isOpen, onClose }) {
  const storageKey = useMemo(() => getStorageKey(siteId), [siteId]);
  const [chatStore, setChatStore] = useState(() => loadChatStore(getStorageKey(siteId)));
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Reload chat store when siteId changes
  useEffect(() => {
    setChatStore(loadChatStore(storageKey));
  }, [storageKey]);

  // Persist chat store to localStorage
  useEffect(() => {
    saveChatStore(storageKey, chatStore);
  }, [chatStore, storageKey]);

  const conversations = chatStore.conversations || [];
  const activeConversation = conversations.find((c) => c.id === chatStore.activeConversationId) || conversations[0];
  const messages = activeConversation?.messages || [];
  const hasMessages = messages.length > 0;

  const updateConversation = (convId, updater) => {
    setChatStore((curr) => {
      const targetId = convId || curr.activeConversationId || curr.conversations[0]?.id;
      const now = new Date().toISOString();
      return {
        ...curr,
        conversations: curr.conversations.map((c) =>
          c.id !== targetId ? c : { ...c, ...updater(c), updatedAt: now }
        ),
      };
    });
  };

  const handleNewConversation = () => {
    const c = createConversation();
    setPrompt('');
    setChatStore((curr) => ({
      ...curr,
      activeConversationId: c.id,
      conversations: [c, ...curr.conversations],
    }));
  };

  const handleSelectConversation = (id) => {
    setPrompt('');
    setChatStore((curr) => ({ ...curr, activeConversationId: id }));
  };

  const handleDeleteConversation = (id) => {
    setChatStore((curr) => {
      const remaining = curr.conversations.filter((c) => c.id !== id);
      const list = remaining.length > 0 ? remaining : [createConversation()];
      const activeId = curr.activeConversationId === id ? list[0].id : curr.activeConversationId;
      return { ...curr, activeConversationId: activeId, conversations: list };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanPrompt = prompt.trim();
    if (!cleanPrompt || isLoading) return;

    const convId = activeConversation?.id || chatStore.activeConversationId;
    const userMessage = { id: `user-${Date.now()}`, role: 'user', text: cleanPrompt };
    const nextMessages = [...messages, userMessage];

    updateConversation(convId, (c) => ({
      title: c.messages.length === 0 ? getConversationTitle(cleanPrompt) : c.title,
      messages: nextMessages,
    }));
    setPrompt('');
    setIsLoading(true);

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('sede_token') : null;

      const response = await fetch(`/api/proxy?_path=${encodeURIComponent(`/api/v1/sites/${siteId}/ai-chat`)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          prompt: cleanPrompt,
          messages: nextMessages,
          componentCatalog: buildComponentCatalog(),
          editorSummary: getEditorSummary(editorState),
        }),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const aiResult = await response.json();

      let appliedText = '';
      if (aiResult.plan && aiResult.plan.action !== 'none' && typeof onApplyPlan === 'function') {
        const result = onApplyPlan(aiResult.plan);
        appliedText = result?.pageLabel
          ? `\n\nListo: construí la página "${result.pageLabel}" con componentes del sistema.`
          : '\n\nListo: apliqué la propuesta en el editor.';
      }

      updateConversation(convId, (c) => ({
        messages: [
          ...(c.messages || []),
          {
            id: `assistant-${Date.now()}`,
            role: 'assistant',
            text: `${aiResult.reply || 'Listo, revisé tu solicitud.'}${appliedText}`,
          },
        ],
      }));
    } catch (err) {
      updateConversation(convId, (c) => ({
        messages: [
          ...(c.messages || []),
          {
            id: `assistant-error-${Date.now()}`,
            role: 'assistant',
            text: err?.message
              ? `No pude procesar el prompt con la IA: ${err.message}`
              : 'No pude procesar el prompt con la IA en este momento.',
          },
        ],
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{ambientStyles}</style>
      {/* Sliding panel container */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '56rem',
          maxWidth: '100vw',
          zIndex: 100,
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-8px 0 32px rgba(0,0,0,0.6)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 1.25rem',
            height: '3.5rem',
            background: '#0d0d0d',
            borderBottom: '1px solid #2d2d2d',
            flexShrink: 0,
            zIndex: 2,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={18} color="#56ccf2" strokeWidth={1.8} />
            <span style={{ fontFamily: FONT, fontSize: '0.9375rem', fontWeight: 600, color: '#e0e0e0' }}>
              Asistente IA
            </span>
          </div>
          <button
            onClick={onClose}
            title="Cerrar"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '2rem',
              height: '2rem',
              border: 'none',
              borderRadius: '0.375rem',
              background: 'transparent',
              color: '#828282',
              cursor: 'pointer',
              transition: 'background 0.15s, color 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#e0e0e0'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#828282'; }}
          >
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        {/* Body */}
        <div
          className="ai-chat-panel-sede"
          style={{ flex: 1, display: 'flex', background: '#0a0a0a', overflow: 'hidden' }}
        >
          <ChatHistorySidebar
            conversations={conversations}
            activeConversationId={chatStore.activeConversationId}
            onSelectConversation={handleSelectConversation}
            onNewConversation={handleNewConversation}
            onDeleteConversation={handleDeleteConversation}
          />

          {/* Chat area */}
          <div
            className="ai-chat-content-sede"
            style={{
              flex: 1,
              minWidth: 0,
              maxWidth: '48rem',
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: hasMessages ? 'space-between' : 'center',
              gap: '1.5rem',
              padding: hasMessages ? '2rem 1.5rem 1.5rem' : '1rem 1.5rem',
              boxSizing: 'border-box',
              overflow: 'hidden',
            }}
          >
            {!hasMessages ? (
              <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
                <header style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Sparkles size={22} color="#56ccf2" strokeWidth={1.8} />
                    <p style={{ margin: 0, fontFamily: FONT, fontSize: '1.375rem', fontWeight: 400, color: '#e0e0e0' }}>
                      Hola, soy tu asistente IA
                    </p>
                  </div>
                  <h1 style={{ margin: 0, fontFamily: FONT, fontSize: '1.75rem', fontWeight: 600, lineHeight: 1.2, color: '#ffffff' }}>
                    ¿Qué construimos hoy?
                  </h1>
                </header>
                <ChatInput value={prompt} onChange={setPrompt} onSubmit={handleSubmit} disabled={isLoading} />
              </section>
            ) : (
              <>
                <section
                  className="ai-chat-message-list-sede"
                  style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.875rem', overflowY: 'auto', paddingRight: '0.25rem' }}
                >
                  {messages.map((msg) => (
                    <MessageBubble key={msg.id} role={msg.role}>{msg.text}</MessageBubble>
                  ))}
                  {isLoading && (
                    <MessageBubble role="assistant">Pensando la mejor respuesta...</MessageBubble>
                  )}
                </section>
                <ChatInput value={prompt} onChange={setPrompt} onSubmit={handleSubmit} disabled={isLoading} />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Backdrop (click to close) */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99,
            background: 'rgba(0,0,0,0.4)',
          }}
        />
      )}
    </>
  );
}
