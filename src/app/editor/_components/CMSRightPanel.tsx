"use client";

import { useState } from "react";
import type { SiteSettings, SiteSection } from "@/types/site-settings.types";

interface Page {
  id: string;
  label: string;
  slug: string;
  children?: Page[];
}

interface CMSRightPanelProps {
  settings: SiteSettings;
  onSettingsChange: (s: SiteSettings) => void;
  pages: Page[];
  onPagesChange: (pages: Page[]) => void;
}

// ─── Small helpers ────────────────────────────────────────────────────────────

function ToggleSwitch({ value, onChange }: { value: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className="relative rounded-full transition-colors shrink-0"
      style={{ width: "36px", height: "20px", background: value ? "#2f80ed" : "#333" }}
      aria-pressed={value}
    >
      <div
        className="absolute top-1 rounded-full bg-white transition-transform"
        style={{ width: "12px", height: "12px", transform: value ? "translateX(18px)" : "translateX(4px)" }}
      />
    </button>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2.5"
      style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
    >
      <polyline points="18 15 12 9 6 15" />
    </svg>
  );
}

function AccordionHeader({
  title,
  open,
  onToggle,
  rightAction,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  rightAction?: React.ReactNode;
}) {
  return (
    <button
      onClick={onToggle}
      className="flex w-full items-center justify-between px-3 py-2.5"
      style={{ background: "#000", borderBottom: "1px solid #2d2d2d" }}
    >
      <span className="text-xs font-bold text-white tracking-wide">{title}</span>
      <div className="flex items-center gap-2">
        {rightAction}
        <ChevronIcon open={open} />
      </div>
    </button>
  );
}

function StyledSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="flex-1 px-2 py-1.5 rounded text-xs outline-none appearance-none cursor-pointer"
      style={{
        background: "rgba(255,255,255,0.08)",
        border: "1px solid #3a3a3a",
        color: "#e0e0e0",
        minWidth: 0,
      }}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value} style={{ background: "#222" }}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function StyledInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-2 py-1.5 rounded text-xs outline-none"
      style={{
        background: "rgba(255,255,255,0.08)",
        border: "1px solid #3a3a3a",
        color: "#e0e0e0",
      }}
    />
  );
}

// ─── Accordion section: Menú general ─────────────────────────────────────────

function MenuGeneralSection({
  open,
  onToggle,
  onOpenMenuConfig,
}: {
  open: boolean;
  onToggle: () => void;
  onOpenMenuConfig: () => void;
}) {
  return (
    <div>
      <AccordionHeader
        title="Menú general"
        open={open}
        onToggle={onToggle}
        rightAction={
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenMenuConfig();
            }}
            className="p-0.5 rounded hover:bg-white/10 transition-colors"
            title="Configurar menú"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#bdbdbd" strokeWidth="2">
              <line x1="9" y1="6" x2="20" y2="6" />
              <line x1="9" y1="12" x2="20" y2="12" />
              <line x1="9" y1="18" x2="20" y2="18" />
              <circle cx="4" cy="6" r="1" fill="#bdbdbd" />
              <circle cx="4" cy="12" r="1" fill="#bdbdbd" />
              <circle cx="4" cy="18" r="1" fill="#bdbdbd" />
            </svg>
          </button>
        }
      />
      {open && (
        <div className="px-3 py-3" style={{ background: "#181818" }}>
          <p className="text-xs mb-2" style={{ color: "#828282" }}>
            Agrega y edita los nombres del menú de navegación principal.
          </p>
          <button
            onClick={onOpenMenuConfig}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors hover:bg-white/10"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid #3a3a3a",
              color: "#bdbdbd",
            }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
            Gestionar pestañas
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Accordion section: Estilo de la página ───────────────────────────────────

function EstiloPaginaSection({
  open,
  onToggle,
  settings,
  onSettingsChange,
}: {
  open: boolean;
  onToggle: () => void;
  settings: SiteSettings;
  onSettingsChange: (s: SiteSettings) => void;
}) {
  const [pageVariation, setPageVariation] = useState("opcion1");

  return (
    <div>
      <AccordionHeader title="Estilo de la página" open={open} onToggle={onToggle} />
      {open && (
        <div className="px-3 py-3 flex flex-col gap-2" style={{ background: "#181818" }}>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs shrink-0" style={{ color: "#bdbdbd" }}>
              Template de página
            </span>
            <StyledSelect
              value={settings.headerStyle}
              onChange={(v) =>
                onSettingsChange({ ...settings, headerStyle: v as SiteSettings["headerStyle"] })
              }
              options={[
                { value: "blue", "label": "Landing Page" },
                { value: "white", "label": "Página Estándar" },
                { value: "transparent", "label": "Página Completa" },
              ]}
            />
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs shrink-0" style={{ color: "#bdbdbd" }}>
              Variaciones
            </span>
            <StyledSelect
              value={pageVariation}
              onChange={setPageVariation}
              options={[
                { value: "opcion1", label: "Opción 1" },
                { value: "opcion2", label: "Opción 2" },
                { value: "opcion3", label: "Opción 3" },
              ]}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Accordion section: Fuentes del sitio ─────────────────────────────────────

function FuentesSitioSection({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  const [fontTitles, setFontTitles] = useState("nunito");
  const [fontBody, setFontBody] = useState("verdana");

  const fontOptions = [
    { value: "nunito", label: "Nunito Sans" },
    { value: "verdana", label: "Verdana" },
    { value: "roboto", label: "Roboto" },
    { value: "opensans", label: "Open Sans" },
    { value: "montserrat", label: "Montserrat" },
    { value: "lato", label: "Lato" },
  ];

  return (
    <div>
      <AccordionHeader title="Fuentes del sitio" open={open} onToggle={onToggle} />
      {open && (
        <div className="px-3 py-3 flex flex-col gap-2" style={{ background: "#181818" }}>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 shrink-0">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#bdbdbd" strokeWidth="2">
                <path d="M4 7V4h16v3" />
                <path d="M9 20h6" />
                <path d="M12 4v16" />
              </svg>
              <span className="text-xs" style={{ color: "#bdbdbd" }}>
                Títulos
              </span>
            </div>
            <StyledSelect value={fontTitles} onChange={setFontTitles} options={fontOptions} />
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 shrink-0">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#828282" strokeWidth="2">
                <path d="M4 7V4h16v3" />
                <path d="M9 20h6" />
                <path d="M12 4v16" />
              </svg>
              <span className="text-xs" style={{ color: "#bdbdbd" }}>
                Textos
              </span>
            </div>
            <StyledSelect value={fontBody} onChange={setFontBody} options={fontOptions} />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Accordion section: Tema del sitio ───────────────────────────────────────

function TemaSitioSection({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  const [theme, setTheme] = useState("azul");

  const themes = [
    { value: "azul", label: "Azul Institucional", color: "#003DA6" },
    { value: "verde", label: "Verde Colombia", color: "#27ae60" },
    { value: "rojo", label: "Rojo Gobierno", color: "#bf363b" },
    { value: "naranja", label: "Naranja Cívico", color: "#e87148" },
  ];

  const selected = themes.find((t) => t.value === theme) ?? themes[0];

  return (
    <div>
      <AccordionHeader title="Tema del sitio" open={open} onToggle={onToggle} />
      {open && (
        <div className="px-3 py-3" style={{ background: "#181818" }}>
          <div className="flex items-center gap-2">
            <div
              className="size-5 rounded-full shrink-0 border-2"
              style={{ background: selected.color, borderColor: "#555" }}
            />
            <StyledSelect
              value={theme}
              onChange={setTheme}
              options={themes.map((t) => ({ value: t.value, label: t.label }))}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Site config view ─────────────────────────────────────────────────────────

function SiteConfigView({
  settings,
  onSettingsChange,
  onOpenMenuConfig,
}: {
  settings: SiteSettings;
  onSettingsChange: (s: SiteSettings) => void;
  onOpenMenuConfig: () => void;
}) {
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(["menu", "estilo", "fuentes", "tema"])
  );

  function toggle(id: string) {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="flex flex-col overflow-y-auto flex-1">
      <MenuGeneralSection
        open={openSections.has("menu")}
        onToggle={() => toggle("menu")}
        onOpenMenuConfig={onOpenMenuConfig}
      />
      <EstiloPaginaSection
        open={openSections.has("estilo")}
        onToggle={() => toggle("estilo")}
        settings={settings}
        onSettingsChange={onSettingsChange}
      />
      <FuentesSitioSection
        open={openSections.has("fuentes")}
        onToggle={() => toggle("fuentes")}
      />
      <TemaSitioSection
        open={openSections.has("tema")}
        onToggle={() => toggle("tema")}
      />

      {/* Section toggles */}
      <div>
        <div
          className="px-3 py-2.5 flex items-center justify-between"
          style={{ background: "#000", borderBottom: "1px solid #2d2d2d" }}
        >
          <span className="text-xs font-bold text-white tracking-wide">Secciones activas</span>
        </div>
        <div className="px-3 py-3 flex flex-col gap-2" style={{ background: "#181818" }}>
          {[...settings.sections]
            .sort((a, b) => a.order - b.order)
            .map((section) => (
              <div
                key={section.id}
                className="flex items-center gap-2 px-2.5 py-2 rounded-md"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid #2d2d2d" }}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#4f4f4f"
                  strokeWidth="2"
                  className="cursor-move shrink-0"
                >
                  <line x1="4" y1="8" x2="20" y2="8" />
                  <line x1="4" y1="14" x2="20" y2="14" />
                  <line x1="4" y1="20" x2="20" y2="20" />
                </svg>
                <span
                  className="text-xs flex-1 truncate"
                  style={{ color: section.enabled ? "#e0e0e0" : "#4f4f4f" }}
                >
                  {section.label}
                </span>
                <ToggleSwitch
                  value={section.enabled}
                  onChange={() =>
                    onSettingsChange({
                      ...settings,
                      sections: settings.sections.map((s) =>
                        s.id === section.id ? { ...s, enabled: !s.enabled } : s
                      ),
                    })
                  }
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

// ─── Menu config sub-panel ────────────────────────────────────────────────────

interface EditableMenuItem {
  id: string;
  label: string;
  slug: string;
  tipo: string;
}

function MenuConfigView({
  pages,
  onPagesChange,
  onBack,
}: {
  pages: Page[];
  onPagesChange: (pages: Page[]) => void;
  onBack: () => void;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [items, setItems] = useState<EditableMenuItem[]>(
    pages.map((p) => ({ id: p.id, label: p.label, slug: p.slug, tipo: "Simple" }))
  );

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  function updateItem(id: string, field: "label" | "slug" | "tipo", value: string) {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  }

  function addItem() {
    const newItem: EditableMenuItem = {
      id: `nav-${Date.now()}`,
      label: "Nueva página",
      slug: "/nueva-pagina",
      tipo: "Simple",
    };
    setItems((prev) => [...prev, newItem]);
    const newPage: Page = { id: newItem.id, label: newItem.label, slug: newItem.slug };
    onPagesChange([...pages, newPage]);
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
    onPagesChange(pages.filter((p) => p.id !== id));
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Sub-panel header */}
      <div
        className="flex items-center gap-2 px-3 py-2.5 shrink-0"
        style={{ background: "#000", borderBottom: "1px solid #2d2d2d" }}
      >
        <button
          onClick={onBack}
          className="flex items-center justify-center size-6 rounded hover:bg-white/10 transition-colors shrink-0"
          title="Volver"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <span className="text-sm font-semibold text-white flex-1">Menu</span>
        <button
          onClick={addItem}
          className="flex items-center justify-center size-6 rounded hover:bg-white/10 transition-colors shrink-0"
          title="Agregar ítem"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>

      {/* Items list */}
      <div className="flex flex-col flex-1 overflow-y-auto" style={{ background: "#181818" }}>
        {items.map((item, idx) => {
          const isOpen = expandedId === item.id;
          return (
            <div key={item.id} style={{ borderBottom: "1px solid #2d2d2d" }}>
              {/* Item row */}
              <div className="flex items-center gap-2 px-3 py-2.5">
                {/* Drag handle */}
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#4f4f4f"
                  strokeWidth="2"
                  className="cursor-move shrink-0"
                >
                  <line x1="4" y1="8" x2="20" y2="8" />
                  <line x1="4" y1="14" x2="20" y2="14" />
                  <line x1="4" y1="20" x2="20" y2="20" />
                </svg>
                <span className="flex-1 text-xs text-white truncate">{item.label}</span>
                <button
                  onClick={() => toggleExpand(item.id)}
                  className="p-0.5 rounded hover:bg-white/10 transition-colors shrink-0"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#828282"
                    strokeWidth="2"
                    style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.15s" }}
                  >
                    <polyline points="18 15 12 9 6 15" />
                  </svg>
                </button>
              </div>

              {/* Expanded form */}
              {isOpen && (
                <div
                  className="flex flex-col gap-2 px-4 pb-3"
                  style={{ background: "rgba(0,0,0,0.3)" }}
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-xs" style={{ color: "#828282" }}>Tipo</span>
                    <StyledSelect
                      value={item.tipo}
                      onChange={(v) => updateItem(item.id, "tipo", v)}
                      options={[
                        { value: "Simple", label: "Simple" },
                        { value: "Desplegable", label: "Desplegable" },
                        { value: "Externo", label: "Externo" },
                      ]}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs" style={{ color: "#828282" }}>Nombre</span>
                    <StyledInput
                      value={item.label}
                      onChange={(v) => updateItem(item.id, "label", v)}
                      placeholder="Nombre del ítem"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs" style={{ color: "#828282" }}>Hiper Vínculo</span>
                    <StyledInput
                      value={item.slug}
                      onChange={(v) => updateItem(item.id, "slug", v)}
                      placeholder="/ruta o https://..."
                    />
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="self-end text-xs px-2 py-1 rounded transition-colors hover:bg-red-500/20"
                    style={{ color: "#eb5757" }}
                  >
                    Eliminar
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Blocks panel ─────────────────────────────────────────────────────────────

const BLOCK_CATALOG = [
  {
    id: "hero",
    name: "Slider",
    gradient: "linear-gradient(135deg, #003DA6 0%, #2d9cdb 100%)",
    description: "Banner principal con imágenes",
  },
  {
    id: "quickaccess",
    name: "Carrusel",
    gradient: "linear-gradient(135deg, #415998 0%, #464289 100%)",
    description: "Carrusel de elementos",
  },
  {
    id: "news",
    name: "Noticias",
    gradient: "linear-gradient(135deg, #27ae60 0%, #1abc9c 100%)",
    description: "Grid de noticias destacadas",
  },
  {
    id: "video",
    name: "Sección con video",
    gradient: "linear-gradient(135deg, #e87148 0%, #d19d4d 100%)",
    description: "Bloque con video embebido",
  },
  {
    id: "transparency",
    name: "Imagen + Texto",
    gradient: "linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)",
    description: "Columna de imagen con texto",
  },
] as const;

function BlocksPanel({
  settings,
  onSettingsChange,
}: {
  settings: SiteSettings;
  onSettingsChange: (s: SiteSettings) => void;
}) {
  const [search, setSearch] = useState("");

  const filtered = BLOCK_CATALOG.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  function addBlock(blockId: string) {
    const section = settings.sections.find((s) => s.id === blockId);
    if (section) {
      // Toggle enable
      onSettingsChange({
        ...settings,
        sections: settings.sections.map((s) =>
          s.id === blockId ? { ...s, enabled: true } : s
        ),
      });
    } else {
      // Add new section (for blocks not in initial list)
      const maxOrder = Math.max(...settings.sections.map((s) => s.order), 0);
      const blockInfo = BLOCK_CATALOG.find((b) => b.id === blockId);
      const newSection = {
        id: blockId as SiteSection["id"],
        label: blockInfo?.name ?? blockId,
        enabled: true,
        order: maxOrder + 1,
      };
      onSettingsChange({ ...settings, sections: [...settings.sections, newSection] });
    }
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Search bar */}
      <div className="px-3 py-2 shrink-0" style={{ borderBottom: "1px solid #2d2d2d" }}>
        <div
          className="flex items-center gap-2 px-2 py-1.5 rounded-md"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid #3a3a3a" }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#828282" strokeWidth="2" className="shrink-0">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar bloque..."
            className="flex-1 bg-transparent outline-none text-xs"
            style={{ color: "#e0e0e0" }}
          />
          {search && (
            <button onClick={() => setSearch("")} className="shrink-0 hover:text-white transition-colors" style={{ color: "#828282" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Blocks grid */}
      <div className="flex flex-col gap-2 p-3 flex-1 overflow-y-auto" style={{ background: "#181818" }}>
        {filtered.map((block) => {
          const isEnabled = settings.sections.some((s) => s.id === block.id && s.enabled);
          return (
            <button
              key={block.id}
              onClick={() => addBlock(block.id)}
              className="flex flex-col rounded-md overflow-hidden text-left transition-all hover:border-[#2d9cdb]/60"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: `1px solid ${isEnabled ? "#2d9cdb" : "#4f4f4f"}`,
              }}
              title={isEnabled ? "Habilitado — clic para mantener activo" : "Agregar al sitio"}
            >
              {/* Preview area */}
              <div
                className="w-full flex items-center justify-center"
                style={{ height: "56px", background: block.gradient }}
              >
                {isEnabled && (
                  <div
                    className="text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(0,0,0,0.5)", color: "white" }}
                  >
                    Activo
                  </div>
                )}
              </div>
              {/* Label */}
              <div className="px-2 py-1.5">
                <span className="text-xs" style={{ color: "#bdbdbd" }}>
                  {block.name}
                </span>
              </div>
            </button>
          );
        })}

        {filtered.length === 0 && (
          <p className="text-xs text-center py-6" style={{ color: "#4f4f4f" }}>
            No se encontraron bloques
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Tab bar ──────────────────────────────────────────────────────────────────

type RightPanelTab = "configuracion" | "bloques";

function TabBar({
  active,
  onChange,
}: {
  active: RightPanelTab;
  onChange: (t: RightPanelTab) => void;
}) {
  const tabs: { id: RightPanelTab; label: string; icon: React.ReactNode }[] = [
    {
      id: "configuracion",
      label: "Configuración",
      icon: (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
    },
    {
      id: "bloques",
      label: "Bloques",
      icon: (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
        </svg>
      ),
    },
  ];

  return (
    <div
      className="flex shrink-0"
      style={{ background: "#111", borderBottom: "1px solid #2d2d2d" }}
    >
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className="flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors"
            style={{
              color: isActive ? "white" : "#828282",
              borderBottom: isActive ? "2px solid #2f80ed" : "2px solid transparent",
              background: isActive ? "rgba(47,128,237,0.06)" : "transparent",
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function CMSRightPanel({
  settings,
  onSettingsChange,
  pages,
  onPagesChange,
}: CMSRightPanelProps) {
  const [activeTab, setActiveTab] = useState<RightPanelTab>("configuracion");
  const [showMenuConfig, setShowMenuConfig] = useState(false);

  return (
    <div
      className="flex flex-col h-full shrink-0"
      style={{ width: "280px", background: "#181818", borderLeft: "1px solid #2d2d2d" }}
    >
      {/* Tab bar — always visible unless in menu config sub-panel */}
      {!showMenuConfig && (
        <TabBar active={activeTab} onChange={(t) => { setActiveTab(t); }} />
      )}

      {/* Content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {showMenuConfig ? (
          <MenuConfigView
            pages={pages}
            onPagesChange={onPagesChange}
            onBack={() => setShowMenuConfig(false)}
          />
        ) : activeTab === "configuracion" ? (
          <SiteConfigView
            settings={settings}
            onSettingsChange={onSettingsChange}
            onOpenMenuConfig={() => setShowMenuConfig(true)}
          />
        ) : (
          <BlocksPanel settings={settings} onSettingsChange={onSettingsChange} />
        )}
      </div>
    </div>
  );
}
