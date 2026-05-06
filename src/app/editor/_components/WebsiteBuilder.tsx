"use client";

import { useState, useEffect } from "react";
import type { SiteResponse } from "@/types/sites.types";
import type { SiteSettings } from "@/types/site-settings.types";
import { SiteTemplate } from "@/components/template/SiteTemplate";
import { CMSRightPanel } from "./CMSRightPanel";

interface Page {
  id: string;
  label: string;
  slug: string;
  children?: Page[];
}

const DEFAULT_PAGES: Page[] = [
  {
    id: "inicio",
    label: "Inicio",
    slug: "/",
    children: [
      { id: "pagina-1", label: "Página 1", slug: "/pagina-1" },
      { id: "pagina-2", label: "Página 2", slug: "/pagina-2" },
    ],
  },
  { id: "tramites", label: "Trámites", slug: "/tramites" },
  { id: "noticias", label: "Noticias", slug: "/noticias" },
  { id: "transparencia", label: "Transparencia", slug: "/transparencia" },
  { id: "contacto", label: "Contacto", slug: "/contacto" },
];

const DEFAULT_SETTINGS: SiteSettings = {
  headerStyle: "blue",
  showLogo: true,
  showSearch: true,
  showLanguageToggle: false,
  sections: [
    { id: "hero", label: "Hero Banner", enabled: true, order: 1 },
    { id: "quickaccess", label: "Accesos Rápidos", enabled: true, order: 2 },
    { id: "news", label: "Noticias Destacadas", enabled: true, order: 3 },
    { id: "transparency", label: "Transparencia", enabled: true, order: 4 },
    { id: "footer", label: "Footer", enabled: true, order: 5 },
  ],
};

function PageTreeItem({
  page,
  depth,
  active,
  onSelect,
  expanded,
  onToggle,
}: {
  page: Page;
  depth: number;
  active: boolean;
  onSelect: (page: Page) => void;
  expanded: boolean;
  onToggle: (id: string) => void;
}) {
  const hasChildren = !!page.children?.length;
  return (
    <div>
      <div
        className="flex w-full items-center gap-2 px-3 py-1.5 text-left transition-colors hover:bg-white/5 rounded-lg mx-1 cursor-pointer"
        style={{
          paddingLeft: `${12 + depth * 16}px`,
          background: active ? "rgba(255,255,255,0.1)" : "transparent",
        }}
        onClick={() => onSelect(page)}
      >
        {hasChildren ? (
          <span
            role="button"
            onClick={(e) => { e.stopPropagation(); onToggle(page.id); }}
            className="p-0.5 rounded hover:bg-white/10 transition-colors shrink-0"
          >
            <svg
              width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#828282" strokeWidth="2"
              className="transition-transform"
              style={{ transform: expanded ? "rotate(90deg)" : "rotate(0deg)" }}
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </span>
        ) : (
          <div style={{ width: "18px" }} />
        )}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={active ? "white" : "#828282"} strokeWidth="1.8">
          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
          <polyline points="13 2 13 9 20 9" />
        </svg>
        <span className="text-sm flex-1 overflow-hidden text-ellipsis whitespace-nowrap" style={{ color: active ? "white" : "#bdbdbd" }}>
          {page.label}
        </span>
      </div>
      {expanded && hasChildren && page.children?.map((child) => (
        <PageTreeItem
          key={child.id}
          page={child}
          depth={depth + 1}
          active={false}
          onSelect={onSelect}
          expanded={false}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}


export function WebsiteBuilder({ site }: { site: SiteResponse }) {
  const storageKey = `site_settings_${site.id}`;

  const [pages, setPages] = useState<Page[]>(DEFAULT_PAGES);
  const [activePage, setActivePage] = useState<Page>(DEFAULT_PAGES[0]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["inicio"]));
  const [activeTab, setActiveTab] = useState<"paginas" | "secciones">("paginas");
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [previewMode, setPreviewMode] = useState<"desktop" | "tablet" | "mobile">("desktop");

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as SiteSettings;
        setSettings(parsed);
      }
    } catch {
      // ignore parse errors
    }
  }, [storageKey]);

  // Save settings to localStorage on change
  function handleSettingsChange(newSettings: SiteSettings) {
    setSettings(newSettings);
    try {
      localStorage.setItem(storageKey, JSON.stringify(newSettings));
    } catch {
      // ignore storage errors
    }
  }

  function toggleExpanded(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleAddPage() {
    const label = window.prompt("Nombre de la nueva página:");
    if (!label || !label.trim()) return;
    const slug = "/" + label.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const id = `page-${Date.now()}`;
    const newPage: Page = { id, label: label.trim(), slug };
    setPages((prev) => [...prev, newPage]);
    setActivePage(newPage);
  }

  // Build flat list of pages for the template nav (top-level only)
  const flatPages = pages.map(({ id, label, slug }) => ({ id, label, slug }));

  const previewUrl = site.slug ? `${site.slug}.gov.co` : `${site.slug}.gov.co`;
  const previewWidths: Record<string, string> = {
    desktop: "100%",
    tablet: "768px",
    mobile: "375px",
  };

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* ── LEFT PANEL: Pages tree ── */}
      <div
        className="flex flex-col h-full shrink-0"
        style={{ width: "250px", background: "#181818", borderRight: "1px solid #2d2d2d" }}
      >
        {/* Tabs */}
        <div className="flex shrink-0" style={{ background: "#333", borderRadius: "6px", margin: "8px" }}>
          {(["paginas", "secciones"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-1 py-1.5 text-sm font-medium rounded-md transition-colors capitalize"
              style={{
                background: activeTab === tab ? "#828282" : "transparent",
                color: activeTab === tab ? "white" : "#bdbdbd",
              }}
            >
              {tab === "paginas" ? "Páginas" : "Secciones"}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between px-3 py-2 shrink-0">
          <span className="font-semibold text-sm text-white">
            {activeTab === "paginas" ? "Páginas" : "Secciones"}
          </span>
          <button
            onClick={handleAddPage}
            className="flex items-center justify-center size-6 rounded hover:bg-white/10 transition-colors"
            title="Nueva página"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col flex-1 overflow-y-auto py-1">
          {pages.map((page) => (
            <PageTreeItem
              key={page.id}
              page={page}
              depth={0}
              active={activePage.id === page.id}
              onSelect={setActivePage}
              expanded={expanded.has(page.id)}
              onToggle={toggleExpanded}
            />
          ))}
        </nav>

        {/* Add page button */}
        <div className="p-3 border-t" style={{ borderColor: "#2d2d2d" }}>
          <button
            onClick={handleAddPage}
            className="flex w-full items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs text-[#bdbdbd] border hover:bg-white/5 transition-colors"
            style={{ borderColor: "#2d2d2d" }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Nueva página
          </button>
        </div>
      </div>

      {/* ── CENTER: Preview ── */}
      <div className="flex flex-col flex-1 h-full overflow-hidden" style={{ background: "#0a0a0a" }}>
        {/* Preview toolbar */}
        <div
          className="flex items-center justify-between px-4 py-2 shrink-0"
          style={{ background: "#181818", borderBottom: "1px solid #2d2d2d" }}
        >
          <div className="flex gap-1 items-center">
            {(["desktop", "tablet", "mobile"] as const).map((mode) => {
              const icons: Record<string, React.ReactNode> = {
                desktop: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                ),
                tablet: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="4" y="2" width="16" height="20" rx="2" />
                    <line x1="12" y1="18" x2="12.01" y2="18" />
                  </svg>
                ),
                mobile: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="5" y="2" width="14" height="20" rx="2" />
                    <line x1="12" y1="18" x2="12.01" y2="18" />
                  </svg>
                ),
              };
              return (
                <button
                  key={mode}
                  onClick={() => setPreviewMode(mode)}
                  className="flex items-center justify-center size-8 rounded transition-colors"
                  style={{
                    background: previewMode === mode ? "rgba(255,255,255,0.1)" : "transparent",
                    color: previewMode === mode ? "white" : "#828282",
                  }}
                  title={mode}
                >
                  {icons[mode]}
                </button>
              );
            })}
          </div>

          <div
            className="flex items-center gap-2 px-3 py-1 rounded"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid #2d2d2d" }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#828282" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <span className="text-xs" style={{ color: "#828282" }}>
              {previewUrl}
            </span>
          </div>

          <button
            onClick={() => window.open(`/preview/${site.id}`, "_blank")}
            className="flex gap-1.5 items-center px-3 py-1.5 rounded text-xs font-medium hover:opacity-90"
            style={{ background: "#2d9cdb", color: "white" }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Vista previa
          </button>
        </div>

        {/* Preview area */}
        <div className="flex-1 overflow-auto flex items-start justify-center p-6">
          <div
            className="rounded-lg overflow-hidden transition-all duration-300"
            style={{
              width: previewWidths[previewMode],
              maxWidth: "100%",
              minHeight: "600px",
              background: "white",
              boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
            }}
          >
            <SiteTemplate
              entityName={site.name}
              accentColor={site.accentColor}
              pages={flatPages}
              settings={settings}
            />
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL: CMS Properties ── */}
      <CMSRightPanel
        settings={settings}
        onSettingsChange={handleSettingsChange}
        pages={pages}
        onPagesChange={setPages}
      />
    </div>
  );
}
