'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { GovWebPreview } from '@/components/builder/GovWebPreview';
import { PropsPanel } from '@/components/builder/PropsPanel';
import { ActivityBar } from '@/components/builder/ActivityBar';
import { SiteSettingsPanel } from '@/components/builder/SiteSettingsPanel';
import { SECTION_REGISTRY } from '@/components/builder/sectionRegistry';
import { THEMES, DEFAULT_EDITOR_STATE, DEFAULT_FOOTER_DATA, DEFAULT_HEADER_CONFIG, DEFAULT_ACCESSIBILITY_DATA, DEFAULT_LEFT_LINKS_DATA } from '@/components/builder/editorConstants';
import { usePages, useUpdatePage, useCreatePage, useDeletePage } from '@/hooks/usePages';
import { updateSiteSettings } from '@/lib/sites.service';
import { EditMenu } from '@/components/builder/EditMenu';
import { Spinner } from '@/components/ui/Spinner';
import { EditorToolbar } from '@/components/builder/EditorToolbar';
import { AIChatPanel } from '@/components/builder/AIChatPanel';


// ── BuilderPanel ─────────────────────────────────────────────────────────────

const PAGE_TEMPLATES = [
  { id: 'landing', name: 'Inicio / Landing',  desc: 'Hero, accesos rápidos, noticias y transparencia', color: '#003DA6' },
  { id: 'tramite', name: 'Trámite',            desc: 'Detalle de trámite o servicio ciudadano',          color: '#27ae60' },
  { id: 'informe', name: 'Informe',            desc: 'Reporte o documento institucional',                color: '#f2994a' },
  { id: 'noticia', name: 'Noticia',            desc: 'Artículo o nota de prensa',                        color: '#9b59b6' },
  { id: 'blank',   name: 'En blanco',          desc: 'Página vacía sin secciones predefinidas',          color: '#2d2d2d' },
];

export function BuilderPanel({ site }) {
  const { data: pages, isLoading } = usePages(site.id);
  const { mutate: updatePage } = useUpdatePage(site.id);
  const { mutateAsync: createPage } = useCreatePage(site.id);
  const { mutate: deletePage } = useDeletePage(site.id);
  const renameTimers = useRef({});
  const saveTimers = useRef({});
  const settingsSaveTimer = useRef(null);
  const settingsKey = `builder_settings_${site.id}`;

  // ── History (undo/redo) ────────────────────────────────────────────────────
  const historyRef = useRef({ past: [], future: [] });

  // ── Full editor state ──────────────────────────────────────────────────────
  const [editorState, setEditorState] = useState(() => {
    const base = { ...DEFAULT_EDITOR_STATE, projectName: site.name, pages: [] };
    if (typeof window === 'undefined') return base;
    try {
      // Prefer settingsJson from API; fall back to localStorage for backward compat
      const saved = site.settingsJson
        ? JSON.parse(site.settingsJson)
        : JSON.parse(localStorage.getItem(settingsKey) || '{}');
      if (saved && Object.keys(saved).length > 0) return { ...base, ...saved, pages: [] };
    } catch {}
    return base;
  });

  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [previewMode, setPreviewMode] = useState('desktop');
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [activityTab, setActivityTab] = useState('pages');

  // ── New page modal ─────────────────────────────────────────────────────────
  const [showNewPageModal, setShowNewPageModal] = useState(false);
  const [newPageStep, setNewPageStep] = useState(1);
  const [newPageName, setNewPageName] = useState('');
  const [newPageSlug, setNewPageSlug] = useState('');
  const [newPageTemplate, setNewPageTemplate] = useState('landing');
  const [newPageCreating, setNewPageCreating] = useState(false);

  // ── CMS data bridge ────────────────────────────────────────────────────────
  const [cmsData, setCmsData] = useState({});

  useEffect(() => {
    if (!site?.id) return;
    const token = typeof window !== 'undefined' ? localStorage.getItem('sede_token') : null;
    fetch(`/api/proxy?_path=${encodeURIComponent(`/api/v1/sites/${site.id}/content`)}`, {
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) return;
        const map = {};
        (data.collections || []).forEach((col) => {
          map[col.slug] = col.items || [];
        });
        setCmsData(map);
      })
      .catch(() => {});
  }, [site?.id]);

  // ── Sync pages from API ────────────────────────────────────────────────────
  useEffect(() => {
    if (!pages) return;
    const FALLBACK_SECTIONS = [
      { id: 'header', name: 'Header', locked: true },
      { id: 'footer', name: 'Footer', locked: true },
    ];
    const apiPages = pages.map((p) => {
      let parsed = null;
      try { parsed = p.sectionsJson ? JSON.parse(p.sectionsJson) : null; } catch {}
      // Support both legacy array format and new {templateId, sections} object format
      const sections = Array.isArray(parsed) ? parsed : (parsed?.sections ?? null);
      const templateId = (!parsed || Array.isArray(parsed)) ? 'landing' : (parsed.templateId ?? 'landing');
      return {
        id: p.id,
        label: p.name,
        templateId,
        sections: sections ?? FALLBACK_SECTIONS,
      };
    });
    setEditorState((prev) => {
      const activePageId = prev.activePageId || apiPages[0]?.id || null;
      return { ...prev, pages: apiPages, activePageId };
    });
  }, [pages]);

  // ── Debounced API save ─────────────────────────────────────────────────────
  const savePageSections = useCallback(
    (pageId, sections, templateId = 'landing') => {
      const page = pages?.find((p) => p.id === pageId);
      if (!page) return;
      clearTimeout(saveTimers.current[pageId]);
      saveTimers.current[pageId] = setTimeout(() => {
        updatePage({
          id: pageId,
          data: {
            name: page.name,
            slug: page.slug,
            sortOrder: page.sortOrder,
            isVisible: page.isVisible,
            sectionsJson: JSON.stringify({ templateId, sections }),
          },
        });
      }, 1000);
    },
    [pages, updatePage]
  );

  // ── Central state updater ──────────────────────────────────────────────────
  const commitEditorState = useCallback(
    (updater) => {
      setEditorState((prev) => {
        // Push current state to history BEFORE applying the update
        const { past, future } = historyRef.current;
        const newPast = past.length >= 50 ? [...past.slice(1), prev] : [...past, prev];
        historyRef.current = { past: newPast, future: [] };

        const next = typeof updater === 'function' ? updater(prev) : updater;
        if (next === prev) {
          // Revert the history push since nothing changed
          historyRef.current = { past, future };
          return prev;
        }

        // Save changed page sections to API
        if (next.pages !== prev.pages) {
          const prevById = Object.fromEntries(prev.pages.map((p) => [p.id, p]));
          next.pages.forEach((np) => {
            if (np.sections !== prevById[np.id]?.sections) {
              savePageSections(np.id, np.sections, np.templateId || 'landing');
            }
          });
        }

        // Persist non-page settings to localStorage (backup cache)
        const { pages: _pages, ...settings } = next;
        try { localStorage.setItem(settingsKey, JSON.stringify(settings)); } catch {}

        // Debounced API save for settings (primary persistence)
        clearTimeout(settingsSaveTimer.current);
        settingsSaveTimer.current = setTimeout(() => {
          updateSiteSettings(site.id, JSON.stringify(settings)).catch(() => {});
        }, 2000);

        return next;
      });
    },
    [savePageSections, settingsKey]
  );

  // ── Undo / Redo ────────────────────────────────────────────────────────────
  const undo = useCallback(() => {
    const { past, future } = historyRef.current;
    if (past.length === 0) return;
    const prev = past[past.length - 1];
    setEditorState((current) => {
      historyRef.current = { past: past.slice(0, -1), future: [current, ...future] };
      return prev;
    });
    // Save the active page sections from the restored state
    const activePage = prev.pages?.find?.((p) => p.id === prev.activePageId);
    if (activePage && prev.activePageId) {
      const page = pages?.find((p) => p.id === prev.activePageId);
      if (page) {
        clearTimeout(saveTimers.current[prev.activePageId]);
        saveTimers.current[prev.activePageId] = setTimeout(() => {
          updatePage({
            id: prev.activePageId,
            data: {
              name: page.name,
              slug: page.slug,
              sortOrder: page.sortOrder,
              isVisible: page.isVisible,
              sectionsJson: JSON.stringify({ templateId: activePage.templateId || 'landing', sections: activePage.sections || [] }),
            },
          });
        }, 1000);
      }
    }
  }, [pages, updatePage]);

  const redo = useCallback(() => {
    const { past, future } = historyRef.current;
    if (future.length === 0) return;
    const next = future[0];
    setEditorState((current) => {
      historyRef.current = { past: [...past, current], future: future.slice(1) };
      return next;
    });
    // Save the active page sections from the restored state
    const activePage = next.pages?.find?.((p) => p.id === next.activePageId);
    if (activePage && next.activePageId) {
      const page = pages?.find((p) => p.id === next.activePageId);
      if (page) {
        clearTimeout(saveTimers.current[next.activePageId]);
        saveTimers.current[next.activePageId] = setTimeout(() => {
          updatePage({
            id: next.activePageId,
            data: {
              name: page.name,
              slug: page.slug,
              sortOrder: page.sortOrder,
              isVisible: page.isVisible,
              sectionsJson: JSON.stringify({ templateId: activePage.templateId || 'landing', sections: activePage.sections || [] }),
            },
          });
        }, 1000);
      }
    }
  }, [pages, updatePage]);

  // ── Keyboard shortcuts (Ctrl+Z / Ctrl+Y) ──────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, redo]); // eslint-disable-line

  // ── Computed ───────────────────────────────────────────────────────────────
  const activePage =
    editorState.pages.find((p) => p.id === editorState.activePageId) ??
    editorState.pages[0] ??
    null;
  const sections = activePage?.sections ?? [];

  const slugifyPageName = (name) =>
    name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');

  // ── Section actions ────────────────────────────────────────────────────────
  const handleAddSection = (sectionSpec) => {
    // EditMenu passes { type, name, config }; legacy callers may pass a plain string
    const type = typeof sectionSpec === 'string' ? sectionSpec : sectionSpec?.type;
    const def = SECTION_REGISTRY[type];
    if (!def || !editorState.activePageId) return;
    const newSection = {
      id: `${type}-${Date.now()}`,
      type,
      name: def.name,
      locked: false,
      config: JSON.parse(JSON.stringify(def.defaultConfig)),
    };
    commitEditorState((prev) => ({
      ...prev,
      pages: prev.pages.map((p) =>
        p.id === prev.activePageId
          ? {
              ...p,
              sections: [
                ...p.sections.filter((s) => s.id !== 'footer'),
                newSection,
                ...p.sections.filter((s) => s.id === 'footer'),
              ],
            }
          : p
      ),
    }));
    setSelectedSectionId(newSection.id);
  };

  const handleDeleteSection = (sectionId) => {
    commitEditorState((prev) => ({
      ...prev,
      pages: prev.pages.map((p) =>
        p.id === prev.activePageId
          ? { ...p, sections: p.sections.filter((s) => s.id !== sectionId) }
          : p
      ),
    }));
    if (selectedSectionId === sectionId) setSelectedSectionId(null);
  };

  // ── Page rename ───────────────────────────────────────────────────────────
  const handlePageRename = useCallback(
    (pageId, newLabel) => {
      setEditorState((prev) => ({
        ...prev,
        pages: prev.pages.map((p) => (p.id === pageId ? { ...p, label: newLabel } : p)),
      }));
      const page = pages?.find((p) => p.id === pageId);
      if (!page) return;
      clearTimeout(renameTimers.current[pageId]);
      renameTimers.current[pageId] = setTimeout(() => {
        updatePage({ id: pageId, data: { name: newLabel, slug: page.slug, sortOrder: page.sortOrder, isVisible: page.isVisible } });
      }, 800);
    },
    [pages, updatePage]
  );

  // ── Page sections update (from EditMenu DnD) ───────────────────────────────
  const handlePageSectionsUpdate = useCallback(
    (pageId, newSections) => {
      commitEditorState((prev) => ({
        ...prev,
        pages: prev.pages.map((p) => (p.id === pageId ? { ...p, sections: newSections } : p)),
      }));
    },
    [commitEditorState]
  );

  // ── AI plan handler ────────────────────────────────────────────────────────
  const handleApplyPlan = (plan) => {
    if (!plan) return null;

    if (plan.action === 'create_page') {
      const pageData = plan.page || {};
      createPage({
        name: pageData.name || 'Nueva Página',
        slug: pageData.slug || `pagina-${Date.now()}`,
        sortOrder: pageData.sortOrder ?? (editorState.pages.length + 1),
        sectionsJson: JSON.stringify(pageData.sections || []),
      });
      return { pageLabel: pageData.name || 'Nueva Página' };
    }

    if (plan.action === 'update_active_page') {
      const newSections = plan.sections || plan.page?.sections;
      if (!newSections) return null;
      commitEditorState((prev) => ({
        ...prev,
        pages: prev.pages.map((p) =>
          p.id === prev.activePageId ? { ...p, sections: newSections } : p
        ),
      }));
      return { pageLabel: activePage?.label };
    }

    return null;
  };

  // ── Publish ────────────────────────────────────────────────────────────────
  const handlePublish = () => {
    // Placeholder — integrate with sitesService.activate() when needed
    alert('Publicar: integrar con el endpoint de activación del sitio.');
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!pages || pages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 text-[#4f4f4f]">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2d2d2d" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="9" y1="21" x2="9" y2="9" />
        </svg>
        <p className="text-sm text-center px-8">
          Crea páginas desde el panel <strong className="text-[#bdbdbd]">Páginas</strong> para empezar a construir.
        </p>
      </div>
    );
  }

  const canUndo = historyRef.current.past.length > 0;
  const canRedo = historyRef.current.future.length > 0;

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      {/* ── Toolbar ───────────────────────────────────────────────────────── */}
      <EditorToolbar
        siteName={editorState.projectName || site.name}
        onSiteNameChange={(name) => commitEditorState((p) => ({ ...p, projectName: name }))}
        previewMode={previewMode}
        onPreviewModeChange={setPreviewMode}
        onPublish={handlePublish}
        siteSlug={site.slug}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
        aiChatOpen={aiChatOpen}
        onToggleAiChat={() => setAiChatOpen((o) => !o)}
      />

      {/* ── Main layout ───────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── Activity Bar (narrow icon strip) ──────────────────────────── */}
        <ActivityBar activeTab={activityTab} onTabChange={setActivityTab} />

        {activityTab === 'pages' && (
          <>
            {/* ── LEFT: EditMenu (pages + sections) ─────────────────────── */}
            <div className="flex h-full shrink-0" style={{ width: '240px', position: 'relative' }}>
              <EditMenu
                width={240}
                pages={editorState.pages}
                activePageId={editorState.activePageId}
                selectedSectionId={selectedSectionId}
                onPageSelect={(id) => { commitEditorState((prev) => ({ ...prev, activePageId: id })); setSelectedSectionId(null); }}
                onPageRename={handlePageRename}
                onPageSectionsUpdate={handlePageSectionsUpdate}
                onSectionSelect={setSelectedSectionId}
                onAddSection={handleAddSection}
                onSectionDelete={(id) => { handleDeleteSection(id); }}
                onPageAdd={() => {
                  setNewPageName('Nueva Página');
                  setNewPageSlug(`pagina-${Date.now()}`);
                  setNewPageTemplate('landing');
                  setNewPageStep(1);
                  setShowNewPageModal(true);
                }}
                onPageDelete={(id) => { deletePage(id); if (editorState.activePageId === id) commitEditorState((prev) => ({ ...prev, activePageId: prev.pages.find((p) => p.id !== id)?.id ?? null })); }}
              />
            </div>

            {/* ── CENTER: Preview ───────────────────────────────────────── */}
            <div className="flex flex-col flex-1 h-full overflow-hidden" style={{ background: '#0a0a0a' }}>
              <div className="flex flex-1 overflow-auto items-start justify-center p-4">
                <div
                  style={{
                    width:
                      previewMode === 'desktop'
                        ? '100%'
                        : previewMode === 'tablet'
                        ? '768px'
                        : '390px',
                    minHeight: '100%',
                    background: 'white',
                    borderRadius: previewMode === 'desktop' ? '0' : '12px',
                    overflow: 'hidden',
                    boxShadow:
                      previewMode === 'desktop' ? 'none' : '0 0 48px rgba(0,0,0,0.5)',
                    flexShrink: 0,
                  }}
                >
                  <GovWebPreview
                    theme={editorState}
                    cmsData={cmsData}
                    selectedSectionId={selectedSectionId}
                    activePage={activePage}
                    onPageChange={(pageId) => {
                      commitEditorState((prev) => ({ ...prev, activePageId: pageId }));
                      setSelectedSectionId(null);
                    }}
                    onSectionSelect={setSelectedSectionId}
                    onHeaderTextsChange={(texts) =>
                      commitEditorState((prev) => ({ ...prev, headerTexts: texts }))
                    }
                    onFooterDataChange={(fd) =>
                      commitEditorState((prev) => ({ ...prev, footerData: fd }))
                    }
                    accessibilityData={editorState.accessibilityData}
                    leftLinksData={editorState.leftLinksData}
                    previewMode={previewMode}
                  />
                </div>
              </div>
            </div>

            {/* ── RIGHT: PropsPanel (component config only) ─────────────── */}
            <PropsPanel
              editorState={editorState}
              selectedSectionId={selectedSectionId}
              onFontTitles={(v) => commitEditorState((p) => ({ ...p, fontTitles: v }))}
              onFontBody={(v) => commitEditorState((p) => ({ ...p, fontBody: v }))}
              onTheme={(name) =>
                commitEditorState((p) => ({ ...p, themeName: name, ...(THEMES[name] || {}) }))
              }
              onPrimary={(v) =>
                commitEditorState((p) => ({ ...p, primary: v, themeName: 'Costumizado' }))
              }
              onAccent={(v) =>
                commitEditorState((p) => ({ ...p, accent: v, themeName: 'Costumizado' }))
              }
              onPageTemplateChange={(templateId) =>
                commitEditorState((p) => ({
                  ...p,
                  pages: p.pages.map((pg) =>
                    pg.id === p.activePageId ? { ...pg, templateId } : pg
                  ),
                }))
              }
              onNavigationChange={(nav) =>
                commitEditorState((p) => ({ ...p, navigation: nav }))
              }
              onHeaderStyleChange={(style) =>
                commitEditorState((p) => ({ ...p, headerStyle: style }))
              }
              onHeaderConfigChange={(key, value) =>
                commitEditorState((p) => ({ ...p, headerConfig: { ...(p.headerConfig || DEFAULT_HEADER_CONFIG), [key]: value } }))
              }
              onHeaderTextsChange={(texts) =>
                commitEditorState((p) => ({ ...p, headerTexts: texts }))
              }
              onFooterStyleChange={(style) =>
                commitEditorState((p) => ({ ...p, footerStyle: style }))
              }
              onFooterDataChange={(key, value) => {
                if (key === 'RESET_ALL') {
                  commitEditorState((p) => ({ ...p, footerData: { ...DEFAULT_FOOTER_DATA } }));
                } else {
                  commitEditorState((p) => ({ ...p, footerData: { ...(p.footerData || DEFAULT_FOOTER_DATA), [key]: value } }));
                }
              }}
              onAccessibilityDataChange={(key, value) =>
                commitEditorState((p) => ({ ...p, accessibilityData: { ...(p.accessibilityData || DEFAULT_ACCESSIBILITY_DATA), [key]: value } }))
              }
              onLeftLinksDataChange={(key, value) =>
                commitEditorState((p) => ({ ...p, leftLinksData: { ...(p.leftLinksData || DEFAULT_LEFT_LINKS_DATA), [key]: value } }))
              }
              onSectionConfigChange={(sectionId, newConfig) =>
                commitEditorState((p) => ({
                  ...p,
                  pages: p.pages.map((pg) =>
                    pg.id === p.activePageId
                      ? {
                          ...pg,
                          sections: pg.sections.map((s) =>
                            s.id === sectionId ? { ...s, config: newConfig } : s
                          ),
                        }
                      : pg
                  ),
                }))
              }
              width={300}
            />
          </>
        )}

        {activityTab === 'settings' && (
          <SiteSettingsPanel
            editorState={editorState}
            width="100%"
            onFontTitles={(v) => commitEditorState((p) => ({ ...p, fontTitles: v }))}
            onFontBody={(v) => commitEditorState((p) => ({ ...p, fontBody: v }))}
            onTheme={(name) =>
              commitEditorState((p) => ({ ...p, themeName: name, ...(THEMES[name] || {}) }))
            }
            onPrimary={(v) =>
              commitEditorState((p) => ({ ...p, primary: v, themeName: 'Costumizado' }))
            }
            onAccent={(v) =>
              commitEditorState((p) => ({ ...p, accent: v, themeName: 'Costumizado' }))
            }
            onNavigationChange={(nav) =>
              commitEditorState((p) => ({ ...p, navigation: nav }))
            }
            onHeaderStyleChange={(style) =>
              commitEditorState((p) => ({ ...p, headerStyle: style }))
            }
            onHeaderConfigChange={(key, value) =>
              commitEditorState((p) => ({ ...p, headerConfig: { ...(p.headerConfig || DEFAULT_HEADER_CONFIG), [key]: value } }))
            }
            onHeaderTextsChange={(texts) =>
              commitEditorState((p) => ({ ...p, headerTexts: texts }))
            }
            onFooterStyleChange={(style) =>
              commitEditorState((p) => ({ ...p, footerStyle: style }))
            }
            onFooterDataChange={(key, value) => {
              if (key === 'RESET_ALL') {
                commitEditorState((p) => ({ ...p, footerData: { ...DEFAULT_FOOTER_DATA } }));
              } else {
                commitEditorState((p) => ({ ...p, footerData: { ...(p.footerData || DEFAULT_FOOTER_DATA), [key]: value } }));
              }
            }}
            onAccessibilityDataChange={(key, value) =>
              commitEditorState((p) => ({ ...p, accessibilityData: { ...(p.accessibilityData || DEFAULT_ACCESSIBILITY_DATA), [key]: value } }))
            }
            onLeftLinksDataChange={(key, value) =>
              commitEditorState((p) => ({ ...p, leftLinksData: { ...(p.leftLinksData || DEFAULT_LEFT_LINKS_DATA), [key]: value } }))
            }
          />
        )}

        {activityTab === 'cms' && (
          <div className="flex flex-1 items-center justify-center" style={{ background: 'var(--bg-main)', borderLeft: '0.0625rem solid var(--border-subtle)' }}>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.8125rem', color: '#4f4f4f', textAlign: 'center', margin: 0 }}>
              CMS próximamente
            </p>
          </div>
        )}

        {activityTab === 'ai-chat' && (
          <div className="flex flex-1 h-full overflow-hidden" style={{ background: 'var(--bg-main)', borderLeft: '0.0625rem solid var(--border-subtle)' }}>
            <AIChatPanel
              siteId={site.id}
              editorState={editorState}
              isOpen={true}
              inline={true}
              onClose={() => setActivityTab('pages')}
              onApplyPlan={handleApplyPlan}
            />
          </div>
        )}

        {activityTab === 'activity' && (
          <div className="flex flex-1 items-center justify-center" style={{ background: 'var(--bg-main)', borderLeft: '0.0625rem solid var(--border-subtle)' }}>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.8125rem', color: '#4f4f4f', textAlign: 'center', margin: 0 }}>
              Actividad próximamente
            </p>
          </div>
        )}
      </div>

      {/* ── AI Chat Panel (slide-over, only for pages tab) ────────────────── */}
      {activityTab === 'pages' && (
        <AIChatPanel
          siteId={site.id}
          editorState={editorState}
          isOpen={aiChatOpen}
          onClose={() => setAiChatOpen(false)}
          onApplyPlan={handleApplyPlan}
        />
      )}

      {/* ── New Page Modal ────────────────────────────────────────────────── */}
      {showNewPageModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.8)' }}
          onClick={(e) => e.target === e.currentTarget && setShowNewPageModal(false)}
        >
          <div
            className="flex flex-col"
            style={{ background: '#181818', border: '1px solid #2d2d2d', borderRadius: '16px', width: '560px', maxHeight: '85vh', overflow: 'hidden' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 shrink-0" style={{ borderBottom: '1px solid #2d2d2d' }}>
              <div className="flex items-center gap-3">
                <span className="text-white font-medium">Nueva Página</span>
                <div className="flex items-center gap-1">
                  {[1, 2].map(s => (
                    <div key={s} className="flex items-center gap-1">
                      <div
                        className="size-5 rounded-full flex items-center justify-center text-xs font-medium"
                        style={{ background: newPageStep >= s ? '#003DA6' : '#2d2d2d', color: newPageStep >= s ? 'white' : '#4f4f4f' }}
                      >{s}</div>
                      {s < 2 && <div className="w-4 h-px" style={{ background: newPageStep > 1 ? '#003DA6' : '#2d2d2d' }} />}
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={() => setShowNewPageModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#828282', padding: '0.25rem' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            {/* Step 1 — Name */}
            {newPageStep === 1 && (
              <div className="flex flex-col gap-5 p-5">
                <p className="text-sm" style={{ color: '#bdbdbd' }}>¿Cómo se llamará esta página?</p>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium" style={{ color: '#828282' }}>Nombre</label>
                    <input
                      autoFocus
                      value={newPageName}
                      onChange={e => {
                        setNewPageName(e.target.value);
                        setNewPageSlug(slugifyPageName(e.target.value) || `pagina-${Date.now()}`);
                      }}
                      onKeyDown={e => e.key === 'Enter' && newPageName.trim() && setNewPageStep(2)}
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid #2d2d2d', borderRadius: '8px', padding: '0.5rem 0.75rem', color: '#e0e0e0', fontSize: '0.875rem', outline: 'none', width: '100%' }}
                      placeholder="Ej. Trámites en línea"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium" style={{ color: '#828282' }}>Slug (URL)</label>
                    <input
                      value={newPageSlug}
                      onChange={e => setNewPageSlug(slugifyPageName(e.target.value))}
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid #2d2d2d', borderRadius: '8px', padding: '0.5rem 0.75rem', color: '#828282', fontSize: '0.8125rem', fontFamily: 'monospace', outline: 'none', width: '100%' }}
                      placeholder="tramites-en-linea"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button onClick={() => setShowNewPageModal(false)} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #2d2d2d', background: 'transparent', color: '#828282', fontSize: '0.875rem', cursor: 'pointer' }}>Cancelar</button>
                  <button
                    onClick={() => setNewPageStep(2)}
                    disabled={!newPageName.trim()}
                    style={{ padding: '0.5rem 1.25rem', borderRadius: '8px', border: 'none', background: newPageName.trim() ? '#003DA6' : '#1a1a1a', color: newPageName.trim() ? 'white' : '#4f4f4f', fontSize: '0.875rem', cursor: newPageName.trim() ? 'pointer' : 'default' }}
                  >
                    Siguiente →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2 — Template */}
            {newPageStep === 2 && (
              <div className="flex flex-col gap-4 p-5" style={{ overflowY: 'auto' }}>
                <p className="text-sm" style={{ color: '#bdbdbd' }}>Elige una plantilla para <strong style={{ color: '#e0e0e0' }}>{newPageName}</strong></p>
                <div className="grid grid-cols-2 gap-3" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                  {PAGE_TEMPLATES.map(tpl => (
                    <div
                      key={tpl.id}
                      onClick={() => setNewPageTemplate(tpl.id)}
                      style={{
                        border: `2px solid ${newPageTemplate === tpl.id ? tpl.color : '#2d2d2d'}`,
                        borderRadius: '10px', padding: '0.875rem', cursor: 'pointer',
                        background: newPageTemplate === tpl.id ? `${tpl.color}18` : 'rgba(255,255,255,0.03)',
                        transition: 'border-color 0.15s, background 0.15s',
                        display: 'flex', flexDirection: 'column', gap: '0.375rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: tpl.color, flexShrink: 0 }} />
                        <span style={{ color: '#e0e0e0', fontSize: '0.875rem', fontWeight: 500 }}>{tpl.name}</span>
                      </div>
                      <span style={{ color: '#828282', fontSize: '0.75rem', lineHeight: 1.4 }}>{tpl.desc}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between gap-2">
                  <button onClick={() => setNewPageStep(1)} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #2d2d2d', background: 'transparent', color: '#828282', fontSize: '0.875rem', cursor: 'pointer' }}>← Atrás</button>
                  <button
                    disabled={newPageCreating}
                    onClick={async () => {
                      setNewPageCreating(true);
                      try {
                        const tplSections = [
                          { id: 'header', name: 'Header', locked: true },
                          { id: 'footer', name: 'Footer', locked: true },
                        ];
                        const newPage = await createPage({
                          name: newPageName,
                          slug: newPageSlug || slugifyPageName(newPageName) || `pagina-${Date.now()}`,
                          isHome: false,
                          sectionsJson: JSON.stringify({ templateId: newPageTemplate, sections: tplSections }),
                        });
                        commitEditorState((prev) => ({ ...prev, activePageId: newPage.id }));
                        setShowNewPageModal(false);
                      } catch { /* mutation surface errors */ }
                      setNewPageCreating(false);
                    }}
                    style={{ padding: '0.5rem 1.25rem', borderRadius: '8px', border: 'none', background: '#003DA6', color: 'white', fontSize: '0.875rem', cursor: newPageCreating ? 'default' : 'pointer', opacity: newPageCreating ? 0.6 : 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    {newPageCreating && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>}
                    Crear Página
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
