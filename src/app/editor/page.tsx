"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { EvolutionLogo } from "@/components/ui/EvolutionLogo";
import { SettingsPanel } from "./_components/SettingsPanel";
// @ts-ignore — JSX component, types not needed
import { BuilderPanel } from "./_components/BuilderPanel";
// @ts-ignore
import { SECTION_REGISTRY } from "@/components/builder/sectionRegistry";
// @ts-ignore — JSX component, types not needed
import { ActivityPanel } from "@/components/builder/ActivityPanel";
import { Activity } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";
import { useSites } from "@/hooks/useSites";
import { usePages, useCreatePage, useDeletePage } from "@/hooks/usePages";
import type { SiteResponse } from "@/types/sites.types";
import type { SitePageResponse } from "@/lib/pages.service";
import { CMSEditorDrawer } from "./_components/CMSEditorDrawer";
import type { ContentItemWithBlocks } from "./_components/CMSEditorDrawer";
import { contentService } from "@/lib/content.service";
import {
  useCollections,
  useCreateCollection,
  useDeleteCollection,
  useContentItems,
  useCreateItem,
  useUpdateItem,
  useDeleteItem,
  useRenameCollection,
  useReorderItems,
} from "@/hooks/useContent";

// ── Page templates ─────────────────────────────────────────────────────────────
const PAGE_TEMPLATES = [
  {
    id: "blank",
    name: "En blanco",
    icon: "📄",
    description: "Página vacía, empieza desde cero",
    sections: [] as string[],
  },
  {
    id: "landing",
    name: "Portada institucional",
    icon: "🏠",
    description: "Portada con slider, accesos rápidos y noticias",
    sections: ["slider", "icon-carousel", "noticias"],
  },
  {
    id: "tramite",
    name: "Trámite o Servicio",
    icon: "📋",
    description: "Pestañas de servicios, tabla y directorio de enlaces",
    sections: ["icon-grid", "table", "links-directory"],
  },
  {
    id: "informe",
    name: "Informe o Reporte",
    icon: "📊",
    description: "Contenido alternado, tabla de datos y video",
    sections: ["zigzag", "table", "video-embed"],
  },
  {
    id: "noticia",
    name: "Noticias",
    icon: "📰",
    description: "Listado de noticias con contenido relacionado",
    sections: ["noticias", "zigzag"],
  },
];

// ── Panel type ─────────────────────────────────────────────────────────────────
type ActivePanel = "pages" | "cms" | "builder" | "settings" | "activity";

// ── SVG icons ──────────────────────────────────────────────────────────────────
function IconPage({ active }: { active?: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "white" : "#828282"} strokeWidth="1.8">
      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
      <polyline points="13 2 13 9 20 9" />
    </svg>
  );
}
function IconDatabase({ active }: { active?: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "white" : "#828282"} strokeWidth="1.8">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  );
}
function IconLayout({ active }: { active?: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "white" : "#828282"} strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="9" y1="21" x2="9" y2="9" />
    </svg>
  );
}
function IconSettings({ active }: { active?: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "white" : "#828282"} strokeWidth="1.8">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

// ── Pages panel ────────────────────────────────────────────────────────────────
function PagesPanel({ siteId }: { siteId: string }) {
  const { data: rawPages, isLoading } = usePages(siteId);
  const { mutate: createPage, isPending: isCreating } = useCreatePage(siteId);
  const { mutate: deletePage } = useDeletePage(siteId);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [showNewPageForm, setShowNewPageForm] = useState(false);
  const [newPageName, setNewPageName] = useState("");
  const [newPageSlug, setNewPageSlug] = useState("");
  const [newPageParentId, setNewPageParentId] = useState<string>("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [newPageStep, setNewPageStep] = useState<1 | 2>(1);
  const [newPageTemplate, setNewPageTemplate] = useState<string>("blank");

  // Select first page when data loads
  useEffect(() => {
    if (rawPages && rawPages.length > 0 && !activeId) {
      setActiveId(rawPages[0].id);
    }
  }, [rawPages, activeId]);

  const pages = rawPages ?? [];
  const roots = pages.filter((p) => !p.parentId).sort((a, b) => a.sortOrder - b.sortOrder);

  function toggleExpanded(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function slugify(v: string) {
    return v.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  }

  function closeNewPageModal() {
    setShowNewPageForm(false);
    setNewPageName("");
    setNewPageSlug("");
    setNewPageParentId("");
    setSlugTouched(false);
    setNewPageStep(1);
    setNewPageTemplate("blank");
  }

  function handleCreatePage() {
    if (!newPageName.trim() || !newPageSlug.trim()) return;
    const template = PAGE_TEMPLATES.find((t) => t.id === newPageTemplate)!;
    const registry = SECTION_REGISTRY as Record<string, { defaultConfig?: unknown }>;
    const sections = template.sections.map((sectionType: string) => ({
      id: `${sectionType}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type: sectionType,
      config: registry[sectionType]?.defaultConfig ?? {},
    }));
    const sectionsJson = sections.length > 0 ? JSON.stringify(sections) : null;
    createPage(
      { name: newPageName.trim(), slug: newPageSlug.trim(), parentId: newPageParentId || undefined, sortOrder: pages.length, isHome: false, sectionsJson },
      { onSuccess: (p) => { setActiveId(p.id); closeNewPageModal(); } }
    );
  }

  function handleDeletePage(id: string) {
    const page = pages.find((p) => p.id === id);
    if (!window.confirm(`¿Eliminar la página "${page?.name}"?`)) return;
    deletePage(id, { onSuccess: () => { if (activeId === id) setActiveId(pages.find((p) => p.id !== id)?.id ?? null); } });
  }

  const activePage = pages.find((p) => p.id === activeId) ?? null;

  function renderPageRow(page: SitePageResponse, depth = 0) {
    const children = pages.filter((p) => p.parentId === page.id).sort((a, b) => a.sortOrder - b.sortOrder);
    const hasChildren = children.length > 0;
    const isActive = activeId === page.id;
    const isExpanded = expandedIds.has(page.id);
    return (
      <div key={page.id}>
        <div
          className="group flex items-center gap-1 rounded-lg mx-2 pr-1 transition-colors cursor-pointer"
          style={{ paddingLeft: `${8 + depth * 16}px`, background: isActive ? "rgba(255,255,255,0.12)" : "transparent" }}
          onClick={() => setActiveId(page.id)}
        >
          <span
            role="button"
            onClick={(e) => { e.stopPropagation(); if (hasChildren) toggleExpanded(page.id); }}
            className="flex items-center justify-center shrink-0 w-4 h-4"
            style={{ opacity: hasChildren ? 1 : 0, pointerEvents: hasChildren ? "auto" : "none" }}
          >
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#828282" strokeWidth="2.5"
              style={{ transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.15s" }}>
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </span>
          <div className="flex items-center gap-2 flex-1 py-1.5 min-w-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isActive ? "white" : "#828282"} strokeWidth="1.8" className="shrink-0">
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><polyline points="13 2 13 9 20 9" />
            </svg>
            <span className="text-sm overflow-hidden text-ellipsis whitespace-nowrap" style={{ color: isActive ? "white" : "#bdbdbd" }}>
              {page.name}
            </span>
            {!page.isVisible && <span className="text-xs text-[#4f4f4f]">(oculta)</span>}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); handleDeletePage(page.id); }}
            className="opacity-0 group-hover:opacity-100 flex items-center justify-center size-5 rounded hover:bg-white/10 transition-all shrink-0"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#828282" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        {isExpanded && children.map((child) => renderPageRow(child, depth + 1))}
      </div>
    );
  }

  const SECTION_BLOCKS = [
    { id: "hero", label: "Hero / Slider", icon: "🖼", color: "#1a3a6b" },
    { id: "quickaccess", label: "Accesos Rápidos", icon: "⚡", color: "#0d4a2e" },
    { id: "news", label: "Noticias Destacadas", icon: "📰", color: "#4a1a0d" },
    { id: "transparency", label: "Transparencia", icon: "🔍", color: "#1a1a4a" },
    { id: "services", label: "Trámites y Servicios", icon: "📋", color: "#2a0d4a" },
    { id: "banner", label: "Banner Informativo", icon: "📢", color: "#4a3a0d" },
    { id: "contact", label: "Datos de Contacto", icon: "📍", color: "#0d3a4a" },
    { id: "footer", label: "Pie de Página", icon: "📄", color: "#1a1a1a" },
  ];

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Left: page tree */}
      <div className="flex flex-col h-full shrink-0 overflow-hidden" style={{ width: "240px", background: "#181818", borderRight: "1px solid #2d2d2d" }}>
        <div className="flex items-center justify-between px-3 py-3 shrink-0" style={{ borderBottom: "1px solid #2d2d2d" }}>
          <span className="font-semibold text-sm text-white">Páginas</span>
          <button
            onClick={() => setShowNewPageForm(true)}
            className="flex items-center justify-center size-6 rounded hover:bg-white/10 transition-colors"
            title="Nueva página"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col flex-1 overflow-y-auto py-2 gap-0.5">
          {isLoading && <div className="flex justify-center py-4"><Spinner size="sm" /></div>}
          {!isLoading && pages.length === 0 && (
            <p className="text-xs text-[#4f4f4f] text-center px-3 py-4">
              Sin páginas.{" "}
              <button className="text-[#2d9cdb] hover:underline" onClick={() => setShowNewPageForm(true)}>Crear primera</button>
            </p>
          )}
          {roots.map((page) => renderPageRow(page))}
        </nav>
        <div className="p-3 shrink-0" style={{ borderTop: "1px solid #2d2d2d" }}>
          <button
            onClick={() => setShowNewPageForm(true)}
            className="flex gap-2 items-center w-full px-3 py-2 rounded-lg text-sm text-[#828282] hover:bg-white/5 hover:text-[#e0e0e0] transition-colors border border-dashed"
            style={{ borderColor: "#2d2d2d" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Nueva página
          </button>
        </div>
      </div>

      {/* Center */}
      <div className="flex flex-col flex-1 h-full overflow-hidden" style={{ background: "#0f0f0f" }}>
        <div className="flex items-center gap-3 px-5 py-3 shrink-0" style={{ background: "#181818", borderBottom: "1px solid #2d2d2d" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2d9cdb" strokeWidth="2">
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><polyline points="13 2 13 9 20 9" />
          </svg>
          <span className="font-medium text-sm text-white">{activePage?.name ?? "Selecciona una página"}</span>
          <span className="text-xs text-[#4f4f4f] font-mono">{activePage?.slug}</span>
        </div>

        {activePage ? (
          <div className="flex flex-col flex-1 overflow-y-auto p-6 gap-4">
            <p className="text-xs text-[#4f4f4f] uppercase tracking-wider font-medium">Secciones activas</p>
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2d2d2d" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>
              </svg>
              <p className="text-[#4f4f4f] text-sm text-center">Arrastra bloques desde el panel derecho<br/>para agregar secciones a esta página</p>
            </div>
            <button
              className="flex gap-2 items-center justify-center w-full px-4 py-3 rounded-xl text-sm text-[#828282] hover:text-[#e0e0e0] hover:bg-white/5 transition-colors border border-dashed mt-2"
              style={{ borderColor: "#2d2d2d" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Agregar sección
            </button>
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-[#4f4f4f] text-sm">Selecciona o crea una página</p>
          </div>
        )}
      </div>

      {/* Right: blocks palette */}
      <div className="flex flex-col h-full shrink-0 overflow-hidden" style={{ width: "220px", background: "#181818", borderLeft: "1px solid #2d2d2d" }}>
        <div className="px-3 py-3 shrink-0" style={{ borderBottom: "1px solid #2d2d2d" }}>
          <p className="text-xs text-[#828282] font-medium uppercase tracking-wider">Bloques disponibles</p>
        </div>
        <div className="flex flex-col gap-2 p-3 overflow-y-auto">
          {SECTION_BLOCKS.map((block) => (
            <div
              key={block.id}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg cursor-grab active:cursor-grabbing hover:bg-white/10 transition-colors"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid #2d2d2d" }}
              draggable
            >
              <div className="flex items-center justify-center size-7 rounded text-base shrink-0" style={{ background: block.color }}>
                {block.icon}
              </div>
              <span className="text-xs text-[#bdbdbd] leading-tight">{block.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* New page modal — 2-step flow */}
      {showNewPageForm && (
        <QuickModal
          title={newPageStep === 1 ? "Nueva Página" : "Elige una plantilla"}
          onClose={closeNewPageModal}
        >
          {newPageStep === 1 ? (
            /* ── Step 1: name + slug ── */
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#bdbdbd]">Nombre *</label>
                <input
                  value={newPageName}
                  onChange={(e) => { setNewPageName(e.target.value); if (!slugTouched) setNewPageSlug(slugify(e.target.value)); }}
                  className="px-3 py-2 rounded-lg text-sm text-[#e0e0e0] outline-none"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid #2d2d2d" }}
                  placeholder="Inicio, Trámites, Noticias..."
                  autoFocus
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#bdbdbd]">Slug *</label>
                <input
                  value={newPageSlug}
                  onChange={(e) => { setSlugTouched(true); setNewPageSlug(slugify(e.target.value)); }}
                  className="px-3 py-2 rounded-lg text-sm text-[#e0e0e0] outline-none font-mono"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid #2d2d2d" }}
                  placeholder="inicio"
                />
              </div>
              {pages.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-[#bdbdbd]">Página padre (opcional)</label>
                  <select
                    value={newPageParentId}
                    onChange={(e) => setNewPageParentId(e.target.value)}
                    className="px-3 py-2 rounded-lg text-sm text-[#e0e0e0] outline-none"
                    style={{ background: "#1e1e1e", border: "1px solid #2d2d2d" }}
                  >
                    <option value="">— Ninguna —</option>
                    {pages.filter((p) => !p.parentId).map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="flex gap-2 justify-end pt-1">
                <button
                  onClick={closeNewPageModal}
                  className="px-4 py-2 rounded-lg text-sm text-[#e0e0e0] hover:bg-white/10 border"
                  style={{ borderColor: "#2d2d2d" }}
                >
                  Cancelar
                </button>
                <button
                  onClick={() => { if (newPageName.trim()) setNewPageStep(2); }}
                  disabled={!newPageName.trim() || !newPageSlug.trim()}
                  className="px-4 py-2 rounded-lg text-sm text-white font-medium hover:opacity-90 disabled:opacity-40"
                  style={{ background: "#003DA6" }}
                >
                  Siguiente →
                </button>
              </div>
            </div>
          ) : (
            /* ── Step 2: template picker ── */
            <div className="flex flex-col gap-4">
              <button
                onClick={() => setNewPageStep(1)}
                className="flex items-center gap-1 text-xs text-[#828282] hover:text-[#e0e0e0] transition-colors self-start"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Volver
              </button>
              <div className="grid grid-cols-2 gap-2">
                {PAGE_TEMPLATES.map((tpl) => {
                  const isSelected = newPageTemplate === tpl.id;
                  return (
                    <button
                      key={tpl.id}
                      onClick={() => setNewPageTemplate(tpl.id)}
                      className="flex flex-col gap-1.5 p-3 rounded-lg text-left transition-all hover:border-[#003DA6]/60"
                      style={{
                        background: isSelected ? "rgba(0,61,166,0.15)" : "rgba(255,255,255,0.04)",
                        border: `1px solid ${isSelected ? "#003DA6" : "#2d2d2d"}`,
                      }}
                    >
                      <span className="text-xl leading-none">{tpl.icon}</span>
                      <span className="text-xs font-medium text-[#e0e0e0] leading-tight">{tpl.name}</span>
                      <span className="text-[11px] text-[#828282] leading-tight">{tpl.description}</span>
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-2 justify-end pt-1">
                <button
                  onClick={closeNewPageModal}
                  className="px-4 py-2 rounded-lg text-sm text-[#e0e0e0] hover:bg-white/10 border"
                  style={{ borderColor: "#2d2d2d" }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreatePage}
                  disabled={isCreating}
                  className="px-4 py-2 rounded-lg text-sm text-white font-medium hover:opacity-90 disabled:opacity-40"
                  style={{ background: "#003DA6" }}
                >
                  {isCreating ? "Creando..." : "Crear página"}
                </button>
              </div>
            </div>
          )}
        </QuickModal>
      )}
    </div>
  );
}

// ── CMS helpers ────────────────────────────────────────────────────────────────

function DbIcon({ color = "#bdbdbd" }: { color?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  );
}

function CmsFileIcon({ color = "#bdbdbd" }: { color?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function CmsDragHandle() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="12" r="1" /><circle cx="9" cy="5" r="1" /><circle cx="9" cy="19" r="1" />
      <circle cx="15" cy="12" r="1" /><circle cx="15" cy="5" r="1" /><circle cx="15" cy="19" r="1" />
    </svg>
  );
}

function CmsOptionsMenu({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const cmsFont = "'Inter', sans-serif";

  return (
    <div ref={ref} style={{ position: "relative", flexShrink: 0 }}>
      <div
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        style={{ cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", width: "1.75rem", height: "1.75rem", borderRadius: "0.375rem", border: "0.0625rem solid transparent" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLDivElement).style.borderColor = "#2d2d2d"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = "transparent"; (e.currentTarget as HTMLDivElement).style.borderColor = "transparent"; }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="5" r="1.5" fill="#bdbdbd" />
          <circle cx="12" cy="12" r="1.5" fill="#bdbdbd" />
          <circle cx="12" cy="19" r="1.5" fill="#bdbdbd" />
        </svg>
      </div>
      {open && (
        <div style={{ position: "absolute", right: 0, top: "100%", marginTop: "0.25rem", background: "#000", border: "0.0625rem solid #2d2d2d", borderRadius: "0.5rem", boxShadow: "0 4px 12px rgba(0,0,0,0.5)", zIndex: 100, minWidth: "8rem", overflow: "hidden" }}>
          <div
            onClick={(e) => { e.stopPropagation(); onEdit(); setOpen(false); }}
            style={{ padding: "0.5rem 1rem", cursor: "pointer", color: "#e0e0e0", fontFamily: cmsFont, fontSize: "0.8125rem" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.08)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
          >
            Editar
          </div>
          <div
            onClick={(e) => { e.stopPropagation(); onDelete(); setOpen(false); }}
            style={{ padding: "0.5rem 1rem", cursor: "pointer", color: "#e57373", fontFamily: cmsFont, fontSize: "0.8125rem" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.08)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
          >
            Eliminar
          </div>
        </div>
      )}
    </div>
  );
}

const RANDOM_IMAGES = [
  "photo-1495020689067-958852a7765e", "photo-1504711434969-e33886168d6c",
  "photo-1432821596592-e2c18b78144f", "photo-1454165804606-c3d57bc86b40",
  "photo-1551288049-bebda4e38f71", "photo-1449034446853-66c86144b0ad",
  "photo-1497366216548-37526070297c", "photo-1486312338219-ce68d2c6f44d",
  "photo-1531482615713-2afd69097998", "photo-1517245386807-bb43f82c33c4",
];

function pickImg() {
  return RANDOM_IMAGES[Math.floor(Math.random() * RANDOM_IMAGES.length)];
}

function parseBlocks(bodyJson?: string): ContentItemWithBlocks["blocks"] {
  if (!bodyJson) return [];
  try { return JSON.parse(bodyJson); } catch { return []; }
}

// ── CMS panel ─────────────────────────────────────────────────────────────────
function CMSPanel({ siteId }: { siteId: string }) {
  const cmsFont = "'Inter', sans-serif";

  // ── Collections state ──
  const { data: collectionsData, isLoading: collectionsLoading } = useCollections(siteId);
  const collections = collectionsData ?? [];

  const [activeCollectionId, setActiveCollectionId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const renameInputRef = useRef<HTMLInputElement>(null);

  // Auto-select first collection
  useEffect(() => {
    if (collections.length > 0 && (!activeCollectionId || !collections.find((c) => c.id === activeCollectionId))) {
      setActiveCollectionId(collections[0].id);
    }
  }, [collections, activeCollectionId]);

  const activeCollection = collections.find((c) => c.id === activeCollectionId) ?? null;
  const collectionLabel = activeCollection?.name ?? "Elemento";

  // ── Collection mutations ──
  const { mutate: createCollection } = useCreateCollection(siteId);
  const { mutate: deleteCollection } = useDeleteCollection(siteId);
  const { mutate: renameCollection } = useRenameCollection(siteId);

  // ── Items state ──
  const { data: itemsData, isLoading: itemsLoading } = useContentItems(siteId, activeCollectionId);
  const rawItems = itemsData ?? [];

  const [search, setSearch] = useState("");
  const [editingItem, setEditingItem] = useState<ContentItemWithBlocks | null>(null);
  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const [localOrder, setLocalOrder] = useState<string[]>([]);

  // Keep local order in sync with server data
  useEffect(() => {
    setLocalOrder(rawItems.map((i) => i.id));
  }, [rawItems]);

  const orderedItems = localOrder
    .map((id) => rawItems.find((i) => i.id === id))
    .filter((i): i is NonNullable<typeof i> => !!i);

  const filteredItems = search.trim()
    ? orderedItems.filter(
        (i) =>
          i.title.toLowerCase().includes(search.toLowerCase()) ||
          (i.slug ?? "").toLowerCase().includes(search.toLowerCase()) ||
          (i.tag ?? "").toLowerCase().includes(search.toLowerCase()) ||
          (i.description ?? "").toLowerCase().includes(search.toLowerCase())
      )
    : orderedItems;

  // ── Item mutations ──
  const { mutate: createItem } = useCreateItem(siteId, activeCollectionId ?? "");
  const { mutate: updateItem } = useUpdateItem(siteId, activeCollectionId ?? "");
  const { mutate: deleteItem } = useDeleteItem(siteId, activeCollectionId ?? "");
  const { mutate: reorderItems } = useReorderItems(siteId, activeCollectionId ?? "");

  // ── Collection handlers ──
  const handleCreateCollection = () => {
    const base = "nueva-coleccion";
    let slug = base;
    let n = 1;
    while (collections.some((c) => c.slug === slug)) { slug = `${base}-${n++}`; }
    const name = `Nueva Colección${n > 1 ? ` ${n - 1}` : ""}`;
    createCollection(
      { name, slug },
      {
        onSuccess: (col) => {
          setActiveCollectionId(col.id);
          setTimeout(() => { setRenamingId(col.id); setRenameValue(col.name); }, 50);
        },
      }
    );
  };

  const handleRenameCollection = (colId: string, newName: string) => {
    if (!newName.trim()) { setRenamingId(null); return; }
    renameCollection({ id: colId, name: newName.trim() });
    setRenamingId(null);
  };

  const handleDeleteCollection = (colId: string) => {
    if (collections.length <= 1) return;
    deleteCollection(colId, {
      onSuccess: () => {
        const remaining = collections.filter((c) => c.id !== colId);
        if (remaining.length > 0) setActiveCollectionId(remaining[0].id);
      },
    });
  };

  // ── Item handlers ──
  const handleCreate = () => {
    if (!activeCollectionId) return;
    const now = new Date();
    const dateStr = `${String(now.getDate()).padStart(2, "0")} / ${String(now.getMonth() + 1).padStart(2, "0")} / ${String(now.getFullYear()).slice(2)}`;
    const imgId = pickImg();
    const thumb = `https://images.unsplash.com/${imgId}?w=400&q=80`;
    const banner = `https://images.unsplash.com/${imgId}?w=800&q=80`;
    createItem(
      {
        title: `Nuevo ${collectionLabel}`,
        slug: `nuevo-${activeCollectionId.slice(0, 8)}-${Date.now().toString(36)}`,
        tag: "General",
        description: "Descripción breve de esta publicación. Edita este texto para personalizar.",
        thumbnailUrl: thumb,
        date: dateStr,
        bodyJson: JSON.stringify([
          { type: "image", content: banner },
          { type: "text", content: "Este es el primer párrafo de tu publicación." },
        ]),
      },
      {
        onSuccess: (newItem) => {
          const withBlocks: ContentItemWithBlocks = {
            ...newItem,
            blocks: parseBlocks(newItem.bodyJson),
          };
          setEditingItem(withBlocks);
        },
      }
    );
  };

  const handleSave = (updated: ContentItemWithBlocks) => {
    updateItem({
      itemId: updated.id,
      data: {
        title: updated.title,
        slug: updated.slug,
        tag: updated.tag,
        description: updated.description,
        thumbnailUrl: updated.thumbnailUrl,
        bodyJson: JSON.stringify(updated.blocks),
        date: updated.date,
      },
    });
    setEditingItem(null);
  };

  const handleDelete = (itemId: string) => {
    deleteItem(itemId);
    if (editingItem?.id === itemId) setEditingItem(null);
  };

  const handleOpenItem = async (itemId: string) => {
    if (!activeCollectionId) return;
    setLoadingItemId(itemId);
    try {
      const detail = await contentService.getItem(siteId, activeCollectionId, itemId);
      setEditingItem({ ...detail, blocks: parseBlocks(detail.bodyJson) });
    } finally {
      setLoadingItemId(null);
    }
  };

  // ── Drag handlers ──
  const handleDragEnd = () => { setDraggedIdx(null); setDragOverIdx(null); };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedIdx === null || dragOverIdx === null || draggedIdx === dragOverIdx) { handleDragEnd(); return; }
    const newOrder = [...localOrder];
    const [moved] = newOrder.splice(draggedIdx, 1);
    newOrder.splice(dragOverIdx, 0, moved);
    setLocalOrder(newOrder);
    reorderItems(newOrder);
    handleDragEnd();
  };

  // ── Shared styles ──
  const cellStyle: React.CSSProperties = {
    flex: 1, minWidth: 0, padding: "0.75rem 0.875rem", display: "flex", alignItems: "center",
  };
  const cellText: React.CSSProperties = {
    fontFamily: cmsFont, fontSize: "0.8125rem", fontWeight: 400, color: "#bdbdbd",
    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", margin: 0,
  };
  const headerText: React.CSSProperties = {
    ...cellText, fontWeight: 500, fontSize: "0.6875rem", letterSpacing: "0.08em",
    textTransform: "uppercase", color: "#828282",
  };

  return (
    <div style={{ display: "flex", flex: 1, height: "100%", overflow: "hidden", position: "relative" }}>

      {/* ── Collections Sidebar ── */}
      <div style={{
        width: 250, flexShrink: 0, height: "100%",
        background: "#181818", borderRight: "0.0625rem solid #2d2d2d",
        display: "flex", flexDirection: "column", padding: "1rem",
      }}>
        <p style={{ fontFamily: cmsFont, fontSize: "1rem", fontWeight: 500, color: "#e0e0e0", margin: "0 0 1rem 0" }}>
          Colecciones
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", flex: 1, overflowY: "auto" }}>
          {collectionsLoading && <Spinner size="sm" />}
          {collections.map((col) => {
            const isActive = activeCollectionId === col.id;
            const isRenaming = renamingId === col.id;
            return (
              <div
                key={col.id}
                onClick={() => { if (!isRenaming) { setActiveCollectionId(col.id); setSearch(""); } }}
                style={{
                  display: "flex", alignItems: "center", gap: "0.5rem",
                  padding: "0.625rem 0.5rem 0.625rem 0.75rem", borderRadius: "0.5rem", cursor: "pointer",
                  background: isActive ? "rgba(255,255,255,0.05)" : "transparent",
                  border: `0.0625rem solid ${isActive ? "#2d2d2d" : "transparent"}`,
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.05)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = isActive ? "rgba(255,255,255,0.05)" : "transparent"; }}
              >
                <DbIcon color={isActive ? "white" : "#bdbdbd"} />
                {isRenaming ? (
                  <input
                    ref={renameInputRef}
                    autoFocus
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onBlur={() => handleRenameCollection(col.id, renameValue)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleRenameCollection(col.id, renameValue);
                      if (e.key === "Escape") setRenamingId(null);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      flex: 1, minWidth: 0, background: "#000", border: "0.0625rem solid #2d2d2d",
                      borderRadius: "0.25rem", padding: "0.125rem 0.375rem", color: "#e0e0e0",
                      fontFamily: cmsFont, fontSize: "0.875rem", fontWeight: 500, outline: "none",
                    }}
                  />
                ) : (
                  <span style={{
                    fontFamily: cmsFont, fontSize: "0.875rem", fontWeight: 500,
                    color: isActive ? "#e0e0e0" : "#bdbdbd", flex: 1, minWidth: 0,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {col.name}
                  </span>
                )}
                {isActive && !isRenaming && (
                  <div style={{ display: "flex", gap: "0.125rem", flexShrink: 0 }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); setRenamingId(col.id); setRenameValue(col.name); }}
                      title="Renombrar"
                      style={{ background: "transparent", border: "none", cursor: "pointer", padding: "0.25rem", display: "flex", alignItems: "center" }}
                    >
                      <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#bdbdbd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    {collections.length > 1 && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteCollection(col.id); }}
                        title="Eliminar colección"
                        style={{ background: "transparent", border: "none", cursor: "pointer", padding: "0.25rem", display: "flex", alignItems: "center" }}
                      >
                        <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#e57373" strokeWidth="2" strokeLinecap="round">
                          <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          {!collectionsLoading && collections.length === 0 && (
            <p style={{ fontFamily: cmsFont, fontSize: "0.8125rem", color: "#4f4f4f", margin: 0, padding: "0.5rem" }}>
              Sin colecciones. Crea una.
            </p>
          )}
        </div>

        <div style={{ marginTop: "0.75rem" }}>
          <button
            onClick={handleCreateCollection}
            style={{
              display: "flex", alignItems: "center", gap: "0.5rem", width: "100%",
              padding: "0.5rem 0.75rem", borderRadius: "0.5rem", cursor: "pointer",
              background: "transparent", border: "0.0625rem dashed #2d2d2d",
              fontFamily: cmsFont, fontSize: "0.8125rem", color: "#828282", transition: "all 0.15s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)"; (e.currentTarget as HTMLButtonElement).style.color = "#e0e0e0"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "#828282"; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Nueva Colección
          </button>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#181818", overflow: "hidden", position: "relative" }}>

        {/* ── Header Bar ── */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "1rem", borderBottom: "0.0625rem solid #2d2d2d", flexShrink: 0, gap: "1rem",
        }}>
          <button
            onClick={handleCreate}
            disabled={!activeCollectionId}
            style={{
              display: "flex", alignItems: "center", gap: "0.375rem", flexShrink: 0,
              padding: "0.5rem 1rem", borderRadius: "0.5rem", cursor: "pointer",
              background: "rgba(255,255,255,0.04)", border: "0.0625rem solid #2d2d2d",
              fontFamily: cmsFont, fontSize: "0.8125rem", fontWeight: 500, color: "#e0e0e0",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.08)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)"; }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e0e0e0" strokeWidth="2" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Crear Nuevo {collectionLabel}
          </button>

          {/* Search */}
          <div style={{
            display: "flex", alignItems: "center", gap: "0.5rem",
            background: "#000", border: "0.0625rem solid #2d2d2d", borderRadius: "0.5rem",
            padding: "0.5rem 0.875rem", width: "min(22rem, 45%)",
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#bdbdbd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar..."
              style={{
                background: "transparent", border: "none", outline: "none", color: "#e0e0e0",
                fontFamily: cmsFont, fontSize: "0.875rem", width: "100%",
              }}
            />
          </div>
        </div>

        {/* ── Table ── */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 1rem 1rem" }}>

          {/* Table Header */}
          <div style={{ display: "flex", borderBottom: "0.0625rem solid #2d2d2d", position: "sticky", top: 0, background: "#181818", zIndex: 1 }}>
            {!search && <div style={{ width: "2rem", flexShrink: 0 }} />}
            <div style={cellStyle}><p style={headerText}>Titulo</p></div>
            <div style={cellStyle}><p style={headerText}>Slug</p></div>
            <div style={cellStyle}><p style={headerText}>Tag</p></div>
            <div style={cellStyle}><p style={headerText}>Imagen Principal</p></div>
            <div style={cellStyle}><p style={headerText}>Fecha</p></div>
            <div style={{ ...cellStyle, flex: 1.5 }}><p style={headerText}>Descripción</p></div>
          </div>

          {/* Loading */}
          {itemsLoading && (
            <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}>
              <Spinner size="sm" />
            </div>
          )}

          {/* Rows */}
          {!itemsLoading && filteredItems.map((item, index) => {
            const isDragging = draggedIdx === index;
            const isDragOver = dragOverIdx === index;
            const isEditing = editingItem?.id === item.id;
            const isLoadingDetail = loadingItemId === item.id;
            return (
              <div
                key={item.id}
                draggable={!search}
                onDragStart={() => setDraggedIdx(index)}
                onDragEnter={() => setDragOverIdx(index)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => handleOpenItem(item.id)}
                style={{
                  display: "flex", alignItems: "center",
                  transition: "background 0.15s", cursor: search ? "pointer" : "grab",
                  background: isDragging ? "rgba(255,255,255,0.1)" : isDragOver ? "rgba(255,255,255,0.08)" : isEditing || isLoadingDetail ? "rgba(255,255,255,0.05)" : "transparent",
                  opacity: isLoadingDetail ? 0.7 : isDragging ? 0.5 : 1,
                  borderTop: isDragOver && draggedIdx !== null && draggedIdx > index ? "2px solid #004cb0" : "none",
                  borderBottom: isDragOver && draggedIdx !== null && draggedIdx < index ? "2px solid #004cb0" : "0.0625rem solid #2d2d2d",
                }}
                onMouseEnter={(e) => {
                  if (!isDragging && !isDragOver) {
                    (e.currentTarget as HTMLDivElement).style.background = isEditing ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.03)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isDragging && !isDragOver) {
                    (e.currentTarget as HTMLDivElement).style.background = isEditing ? "rgba(255,255,255,0.05)" : "transparent";
                  }
                }}
              >
                {/* Drag handle */}
                {!search && (
                  <div style={{ width: "2rem", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", cursor: "grab", opacity: 0.5, color: "#bdbdbd" }}>
                    <CmsDragHandle />
                  </div>
                )}

                {/* Title */}
                <div style={{ ...cellStyle, gap: "0.625rem", paddingLeft: search ? "1rem" : "0.5rem" }}>
                  <CmsFileIcon color="#bdbdbd" />
                  <p style={cellText}>{item.title}</p>
                </div>

                {/* Slug */}
                <div style={cellStyle}><p style={cellText}>{item.slug}</p></div>

                {/* Tag */}
                <div style={cellStyle}><p style={cellText}>{item.tag}</p></div>

                {/* Image */}
                <div style={cellStyle}>
                  {item.thumbnailUrl ? (
                    <div style={{ width: "6.25rem", height: "2.5625rem", borderRadius: "0.25rem", overflow: "hidden", background: "#000", flexShrink: 0 }}>
                      <img src={item.thumbnailUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    </div>
                  ) : (
                    <div style={{ width: "6.25rem", height: "2.5625rem", borderRadius: "0.25rem", background: "#000", flexShrink: 0 }} />
                  )}
                </div>

                {/* Date */}
                <div style={cellStyle}><p style={cellText}>{item.date}</p></div>

                {/* Description + Options */}
                <div style={{ ...cellStyle, flex: 1.5, justifyContent: "space-between", gap: "0.5rem" }}>
                  <p style={{ ...cellText, flex: 1 }}>{item.description}</p>
                  <CmsOptionsMenu
                    onEdit={() => handleOpenItem(item.id)}
                    onDelete={() => handleDelete(item.id)}
                  />
                </div>
              </div>
            );
          })}

          {/* Empty state */}
          {!itemsLoading && filteredItems.length === 0 && (
            <div style={{ padding: "3rem", textAlign: "center" }}>
              <p style={{ fontFamily: cmsFont, fontSize: "0.875rem", color: "#4f4f4f", margin: 0 }}>
                {search ? "No se encontraron resultados." : `No hay ${collectionLabel.toLowerCase()} creados aún.`}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Editor Drawer ── */}
      {editingItem && (
        <CMSEditorDrawer
          item={editingItem}
          collectionLabel={collectionLabel}
          siteId={siteId}
          collectionId={activeCollectionId ?? ""}
          cmsCollections={collections.map((c) => ({ id: c.id, name: c.name }))}
          onClose={() => setEditingItem(null)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function QuickModal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.7)" }}>
      <div className="flex flex-col gap-4 p-6 rounded-xl w-[420px]" style={{ background: "#181818", border: "1px solid #2d2d2d" }}>
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-white">{title}</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-white/10">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#bdbdbd" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Main editor component ─────────────────────────────────────────────────────
function EditorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const siteId = searchParams.get("site") ?? "";

  useEffect(() => {
    if (!siteId) router.replace("/dashboard");
  }, [siteId, router]);

  const { data: sitesData } = useSites();
  const site: SiteResponse | null = sitesData
    ? [
        ...(sitesData.ungrouped ?? []),
        ...(sitesData.groups ?? []).flatMap((g) => g.sites),
      ].find((s) => s.id === siteId) ?? null
    : null;

  const [activePanel, setActivePanel] = useState<ActivePanel>("builder");
  const [languageId, setLanguageId] = useState<number>(() => {
    if (typeof window !== "undefined") return Number(localStorage.getItem("editor_languageId") ?? "1");
    return 1;
  });
  const LANGUAGES = [{ id: 1, label: "ES 🇨🇴" }, { id: 2, label: "EN 🇺🇸" }];

  const LEFT_NAV: { panel: ActivePanel; title: string; icon: (active: boolean) => React.ReactNode }[] = [
    { panel: "pages", title: "Páginas", icon: (a) => <IconPage active={a} /> },
    { panel: "cms", title: "CMS / Contenido", icon: (a) => <IconDatabase active={a} /> },
    { panel: "builder", title: "Constructor visual", icon: (a) => <IconLayout active={a} /> },
    { panel: "settings", title: "Configuración", icon: (a) => <IconSettings active={a} /> },
    { panel: "activity", title: "Actividad", icon: (a) => <Activity size={22} strokeWidth={1.8} color={a ? "white" : "#828282"} /> },
  ];

  const statusLabel: Record<string, string> = { Active: "Live", Draft: "Borrador", Archived: "Archivado" };
  const statusColor: Record<string, string> = { Active: "#27ae60", Draft: "#828282", Archived: "#f2994a" };

  return (
    <div className="flex flex-col w-full h-screen overflow-hidden" style={{ background: "black" }}>
      {/* ── TOP BAR ── */}
      <div className="flex items-center w-full shrink-0" style={{ height: "51px", background: "black", borderBottom: "1px solid #2d2d2d" }}>
        {/* Logo */}
        <div className="flex gap-3 items-center px-5 shrink-0" style={{ width: "300px", height: "51px", borderRight: "1px solid #2d2d2d" }}>
          <EvolutionLogo style={{ width: "35px", height: "18px" }} preserveAspectRatio="xMidYMin slice" />
          <span className="font-medium text-sm text-[#bdbdbd] tracking-wide">Evolution</span>
        </div>

        {/* Home button */}
        <div
          className="flex items-center justify-center shrink-0 hover:bg-white/5 cursor-pointer transition-colors"
          style={{ width: "50px", height: "51px", borderRight: "1px solid #2d2d2d" }}
          onClick={() => router.push("/dashboard")}
          title="Volver al dashboard"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#bdbdbd" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </div>

        {/* Site tab */}
        <div className="flex gap-2 items-center px-4 shrink-0 border-b-2" style={{ height: "51px", borderRight: "1px solid #2d2d2d", borderBottomColor: "white", minWidth: "200px" }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
            <polyline points="13 2 13 9 20 9" />
          </svg>
          <span className="font-medium text-sm text-white overflow-hidden text-ellipsis whitespace-nowrap">
            {site ? site.name : <span className="text-[#4f4f4f]">Cargando…</span>}
          </span>
          {site && (
            <span className="text-xs px-1.5 py-0.5 rounded font-medium ml-1" style={{ background: "rgba(255,255,255,0.1)", color: statusColor[site.status] ?? "#828282" }}>
              {statusLabel[site.status] ?? site.status}
            </span>
          )}
        </div>

        <div className="flex-1" />

        {/* Language + actions */}
        <div className="flex gap-3 items-center px-4 shrink-0">
          <div className="flex gap-1 items-center">
            {LANGUAGES.map((lang) => (
              <button key={lang.id} onClick={() => { setLanguageId(lang.id); localStorage.setItem("editor_languageId", String(lang.id)); }}
                className="px-2.5 py-1 rounded text-xs font-medium transition-colors"
                style={{ background: languageId === lang.id ? "rgba(45,156,219,0.2)" : "transparent", color: languageId === lang.id ? "#2d9cdb" : "#828282", border: languageId === lang.id ? "1px solid #2d9cdb" : "1px solid transparent" }}>
                {lang.label}
              </button>
            ))}
          </div>
          <button className="flex gap-2 items-center px-4 py-1.5 rounded-lg text-sm font-medium text-[#e0e0e0] hover:bg-white/10 transition-colors border" style={{ background: "rgba(255,255,255,0.05)", borderColor: "#2d2d2d" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3" /></svg>
            Vista previa
          </button>
          <button className="flex gap-2 items-center px-4 py-1.5 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity" style={{ background: "#2d9cdb" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
            Publicar
          </button>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="flex items-start w-full flex-1 overflow-hidden">
        {/* ── LEFT ICON SIDEBAR — hidden when builder is active (BuilderPanel has its own ActivityBar) ── */}
        <div className="flex flex-col items-center gap-1 py-3 shrink-0 h-full" style={{ width: "56px", background: "#181818", borderRight: "1px solid #2d2d2d", display: activePanel === "builder" ? "none" : "flex" }}>
          {LEFT_NAV.map(({ panel, title, icon }) => {
            const isActive = activePanel === panel;
            return (
              <button
                key={panel}
                title={title}
                onClick={() => setActivePanel(panel)}
                className="flex items-center justify-center rounded-lg size-10 hover:bg-white/10 transition-colors"
                style={{ background: isActive ? "#2f2f2f" : "transparent" }}
              >
                {icon(isActive)}
              </button>
            );
          })}
        </div>

        {/* ── PANEL CONTENT ── */}
        {!siteId ? (
          <div className="flex flex-1 items-center justify-center"><Spinner size="lg" /></div>
        ) : (
          <>
            {/* Lightweight panels — mount on demand */}
            {activePanel === "pages" && <PagesPanel siteId={siteId} />}
            {activePanel === "cms" && <CMSPanel siteId={siteId} />}
            {activePanel === "settings" && (site ? <SettingsPanel site={site} onSaved={() => {}} /> : <div className="flex flex-1 items-center justify-center"><Spinner size="lg" /></div>)}
            {activePanel === "activity" && <ActivityPanel siteId={siteId} />}

            {/* BuilderPanel — always mounted once site is ready, hidden when inactive to preserve all editor state */}
            <div
              style={{
                display: activePanel === "builder" ? "flex" : "none",
                flex: 1,
                minWidth: 0,
                height: "100%",
                overflow: "hidden",
              }}
            >
              {site ? <BuilderPanel site={site} /> : <div className="flex flex-1 items-center justify-center"><Spinner size="lg" /></div>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense>
      <EditorContent />
    </Suspense>
  );
}
