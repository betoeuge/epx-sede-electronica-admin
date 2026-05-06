"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCreateSite, useSiteTemplates } from "@/hooks/useSites";
import { updateSiteSettings } from "@/lib/sites.service";
import { pagesService } from "@/lib/pages.service";
import { Modal } from "@/components/ui/Modal";
import { Spinner } from "@/components/ui/Spinner";
import { SiteTemplate } from "@/components/template/SiteTemplate";
import type { SiteSettings } from "@/types/site-settings.types";

interface Template {
  id: string;
  name: string;
  category: string;
  color: string;
  description: string;
  isReal?: boolean;
}

const GOV_SETTINGS: SiteSettings = {
  headerStyle: "blue",
  showLogo: true,
  showSearch: true,
  showLanguageToggle: false,
  sections: [
    { id: "hero",         label: "Hero Banner",        enabled: true, order: 1 },
    { id: "quickaccess",  label: "Accesos Rápidos",     enabled: true, order: 2 },
    { id: "news",         label: "Noticias Destacadas", enabled: true, order: 3 },
    { id: "transparency", label: "Transparencia",       enabled: true, order: 4 },
    { id: "footer",       label: "Footer",              enabled: true, order: 5 },
  ],
};

const DEFAULT_PAGES = [
  { id: "inicio",        label: "Inicio",       slug: "/" },
  { id: "tramites",      label: "Trámites",     slug: "/tramites" },
  { id: "noticias",      label: "Noticias",     slug: "/noticias" },
  { id: "transparencia", label: "Transparencia",slug: "/transparencia" },
  { id: "contacto",      label: "Contacto",     slug: "/contacto" },
];

// Color palette for non-live template cards (cycles by sortOrder)
const TEMPLATE_COLORS = ["#003DA6", "#1A5276", "#154360", "#1B2631", "#6C3483", "#117A65"];

// IDs that have a real visual preview (GOV.CO style)
const REAL_PREVIEW_IDS = new Set(["gov-standard", "gov-co", "municipio", "ministerio"]);


function GovPreviewThumbnail() {
  return (
    <div className="relative w-full overflow-hidden rounded-lg" style={{ height: "165px", background: "white" }}>
      <div style={{ transform: "scale(0.2)", transformOrigin: "top left", width: "500%", pointerEvents: "none" }}>
        <SiteTemplate
          entityName="Entidad Gubernamental"
          accentColor="#003DA6"
          pages={DEFAULT_PAGES}
          settings={GOV_SETTINGS}
        />
      </div>
    </div>
  );
}

function TemplateCard({
  template,
  onEmpezar,
  onDemo,
  applying,
}: {
  template: Template;
  onEmpezar: (t: Template) => void;
  onDemo: (t: Template) => void;
  applying: boolean;
}) {
  return (
    <div className="flex flex-col items-start overflow-hidden rounded-2xl w-full" style={{ background: "#181818" }}>
      <div className="flex flex-col gap-2 items-start p-2 w-full relative">
        {template.isReal && (
          <div
            className="absolute top-4 right-4 z-10 px-2 py-0.5 rounded-full text-xs font-semibold"
            style={{ background: "#003DA6", color: "white", border: "1px solid #0055CC" }}
          >
            Incluido
          </div>
        )}
        {template.isReal ? (
          <GovPreviewThumbnail />
        ) : (
          <>
            <div
              className="rounded-lg w-full overflow-hidden flex flex-col"
              style={{ height: "165px", background: template.color }}
            >
              <div className="flex flex-col p-3 gap-2 h-full">
                <div className="h-3 rounded bg-white/30 w-3/4" />
                <div className="h-2 rounded bg-white/20 w-1/2" />
                <div className="flex-1 rounded bg-white/10 mt-1" />
              </div>
            </div>
            <div className="flex gap-2 items-center w-full">
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className="flex-1 rounded-lg overflow-hidden flex flex-col p-2 gap-1"
                  style={{ height: "80px", background: `${template.color}88` }}
                >
                  <div className="h-2 rounded bg-white/30 w-full" />
                  <div className="h-1 rounded bg-white/20 w-2/3" />
                  <div className="flex-1 rounded bg-white/10" />
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col gap-6 items-start p-4 w-full">
        <div className="flex flex-col gap-2 text-white w-full">
          <p className="font-medium text-base overflow-hidden text-ellipsis whitespace-nowrap">{template.name}</p>
          <p className="font-light text-xs" style={{ color: "#bdbdbd" }}>{template.category}</p>
        </div>
        <div className="flex gap-2 items-center justify-end w-full">
          <button
            onClick={() => onDemo(template)}
            className="flex flex-1 gap-2 items-center justify-center overflow-hidden p-2 rounded text-white text-sm hover:bg-white/10 transition-colors"
            style={{ background: "rgba(0,0,0,0.4)" }}
          >
            Demo
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
            </svg>
          </button>
          <button
            onClick={() => onEmpezar(template)}
            disabled={applying}
            className="flex flex-1 items-center justify-center gap-1 overflow-hidden p-2 rounded text-white text-sm hover:opacity-80 transition-opacity disabled:opacity-50"
            style={{ background: template.color }}
          >
            {applying ? <Spinner size="sm" /> : (
              <>
                Usar
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Used only when navigating directly to /templates (no existing site)
function EmpezarModal({ template, onClose }: { template: Template; onClose: () => void }) {
  const router = useRouter();
  const [name, setName] = useState(template.name);
  const [slug, setSlug] = useState(template.id);
  const { mutate: createSite, isPending } = useCreateSite();

  function slugify(v: string) {
    return v.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  }

  function handleCreate() {
    createSite(
      { name, slug, description: template.description, accentColor: template.color, templateId: template.id },
      {
        onSuccess: (site) => {
          router.push(`/editor?site=${site.id}`);
        },
      }
    );
  }

  return (
    <Modal isOpen onClose={onClose} title={`Crear sitio desde "${template.name}"`}>
      <div className="flex flex-col gap-4 p-4">
        {template.isReal ? (
          <div className="w-full rounded-lg overflow-hidden" style={{ height: "120px", background: "white" }}>
            <div style={{ transform: "scale(0.19)", transformOrigin: "top left", width: "530%", pointerEvents: "none" }}>
              <SiteTemplate entityName={name || "Entidad Gubernamental"} accentColor="#003DA6" pages={DEFAULT_PAGES} settings={GOV_SETTINGS} />
            </div>
          </div>
        ) : (
          <div className="w-full rounded-lg overflow-hidden" style={{ height: "120px", background: template.color }}>
            <div className="flex flex-col p-4 gap-2 h-full">
              <div className="h-3 rounded bg-white/30 w-3/4" />
              <div className="h-2 rounded bg-white/20 w-1/2" />
              <div className="flex-1 rounded bg-white/10 mt-1" />
            </div>
          </div>
        )}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#bdbdbd]">Nombre del sitio</label>
            <input
              value={name}
              onChange={(e) => { setName(e.target.value); setSlug(slugify(e.target.value)); }}
              className="px-3 py-2 rounded-lg text-sm outline-none"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid #2d2d2d", color: "#e0e0e0" }}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#bdbdbd]">Slug</label>
            <input
              value={slug}
              onChange={(e) => setSlug(slugify(e.target.value))}
              className="px-3 py-2 rounded-lg text-sm font-mono outline-none"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid #2d2d2d", color: "#e0e0e0" }}
            />
          </div>
        </div>
        <div className="flex gap-2 justify-end pt-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-[#e0e0e0] hover:bg-white/10 border" style={{ borderColor: "#2d2d2d" }}>
            Cancelar
          </button>
          <button
            onClick={handleCreate}
            disabled={!name || !slug || isPending}
            className="flex gap-2 items-center px-4 py-2 rounded-lg text-sm text-white font-medium hover:opacity-90 disabled:opacity-40"
            style={{ background: template.color }}
          >
            {isPending ? <><Spinner size="sm" /> Creando...</> : "Crear y abrir editor"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

function DemoModal({ template, onClose }: { template: Template; onClose: () => void }) {
  return (
    <Modal isOpen onClose={onClose} title={`Demo — ${template.name}`}>
      <div className="flex flex-col gap-4 p-4">
        {template.isReal ? (
          <div className="w-full rounded-lg overflow-hidden border border-gray-200" style={{ height: "420px", background: "white" }}>
            <div style={{ transform: "scale(0.42)", transformOrigin: "top left", width: "238%", pointerEvents: "none" }}>
              <SiteTemplate entityName="Entidad Gubernamental" accentColor="#003DA6" pages={DEFAULT_PAGES} settings={GOV_SETTINGS} />
            </div>
          </div>
        ) : (
          <div className="w-full rounded-lg overflow-hidden flex flex-col items-center justify-center" style={{ height: "300px", background: template.color }}>
            <div className="flex flex-col items-center gap-3 text-white text-center px-8">
              <p className="font-semibold text-xl">{template.name}</p>
              <p className="font-light text-sm opacity-80">{template.description}</p>
              <span className="mt-2 px-3 py-1 rounded-full text-xs font-medium" style={{ background: "rgba(255,255,255,0.2)" }}>{template.category}</span>
            </div>
          </div>
        )}
        <div className="flex justify-center">
          <button onClick={onClose} className="px-6 py-2 rounded-lg text-sm text-[#e0e0e0] hover:bg-white/10 border" style={{ borderColor: "#2d2d2d" }}>
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  );
}

function TemplatesPageInner() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [demoTemplate, setDemoTemplate] = useState<Template | null>(null);
  const [applying, setApplying] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pendingSiteId = searchParams.get("site");

  const { data: apiTemplates, isLoading: templatesLoading } = useSiteTemplates();

  // Map API templates to UI Template shape
  const templates: Template[] = (apiTemplates ?? []).map((t, i) => ({
    id: t.id,
    name: t.name,
    category: "Gobierno",
    color: TEMPLATE_COLORS[i % TEMPLATE_COLORS.length],
    description: t.description ?? "",
    isReal: REAL_PREVIEW_IDS.has(t.id),
  }));

  const filtered = templates.filter(
    (t) =>
      !searchQuery ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  async function handleEmpezar(template: Template) {
    if (pendingSiteId) {
      // Applying template to an existing (newly created) site
      setApplying(true);
      try {
        const apiTpl = (apiTemplates ?? []).find((t) => t.id === template.id);

        // Create pages from the template's defaultPagesJson blueprint
        type PageBlueprint = { name: string; slug: string; layout?: string; isHome: boolean };
        const blueprints: PageBlueprint[] = apiTpl
          ? JSON.parse(apiTpl.defaultPagesJson)
          : [];

        const createdPages: { id: string; label: string }[] = [];
        for (let i = 0; i < blueprints.length; i++) {
          const bp = blueprints[i];
          const created = await pagesService.create(pendingSiteId, {
            name: bp.name,
            slug: bp.slug,
            isHome: bp.isHome,
            sortOrder: i + 1,
            layout: bp.layout,
          });
          createdPages.push({ id: created.id, label: bp.name });
        }

        // Apply settings from the template's defaultSettingsJson
        if (apiTpl?.defaultSettingsJson) {
          await updateSiteSettings(pendingSiteId, apiTpl.defaultSettingsJson);
        }
      } catch (e) {
        console.error("Error applying template:", e);
      }
      router.push(`/editor?site=${pendingSiteId}`);
    } else {
      setSelectedTemplate(template);
    }
  }

  return (
    <>
      <div className="flex h-16 items-center justify-between px-6 py-2 w-full shrink-0" style={{ background: "#181818", borderBottom: "1px solid #2d2d2d" }}>
        <div className="flex gap-4 items-center">
          <button
            onClick={() => window.history.back()}
            className="rounded size-8 flex items-center justify-center hover:bg-white/20 transition-colors"
            style={{ background: "rgba(255,255,255,0.15)" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
          <h1 className="font-medium text-lg text-white whitespace-nowrap">Templates</h1>
        </div>
        <div className="flex gap-2 items-center px-4 py-2 rounded w-[350px]" style={{ background: "rgba(255,255,255,0.1)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e0e0e0" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-[#e0e0e0] text-sm placeholder:text-[#828282]"
            placeholder="Buscar template"
          />
        </div>
        <div className="opacity-0 w-8 h-8" />
      </div>

      <div className="flex flex-col gap-15 items-center overflow-auto px-10 py-15 w-full relative flex-1" style={{ background: "black" }}>
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="tpl-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#tpl-grid)" />
          </svg>
        </div>

        {/* Contextual banner when coming from site creation */}
        {pendingSiteId && (
          <div
            className="relative flex items-center gap-3 px-5 py-3 rounded-xl w-full max-w-[1240px]"
            style={{ background: "rgba(0,61,166,0.15)", border: "1px solid rgba(0,61,166,0.4)" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#56ccf2" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p className="text-sm" style={{ color: "#90caf9" }}>
              Elige la plantilla que dará forma a tu nuevo proyecto. Haz clic en <strong>Usar</strong> para aplicarla y abrir el editor.
            </p>
          </div>
        )}

        <div className="relative flex flex-col gap-4 items-start max-w-[600px] text-center text-white w-full">
          <p className="font-medium text-[28px] leading-normal w-full">
            {pendingSiteId ? "Elige una plantilla para tu proyecto" : "Da vida a tu visión con una base sólida."}
          </p>
          <p className="font-light text-base leading-6 w-full" style={{ color: "#e0e0e0" }}>
            Selecciona una plantilla diseñada por expertos de Evolution y personalízala para que cuente tu propia historia.
          </p>
        </div>

        <div className="relative flex flex-col gap-6 items-center max-w-[1240px] w-full">
          <h2 className="font-medium text-xl text-white w-full">Todos los templates</h2>
          {templatesLoading ? (
            <div className="flex items-center justify-center py-16 w-full"><Spinner /></div>
          ) : filtered.length === 0 ? (
            <p className="text-[#828282] text-sm py-10">
              {searchQuery ? `No se encontraron templates para "${searchQuery}"` : "No hay templates disponibles."}
            </p>
          ) : (
            <div className="flex flex-wrap gap-6 w-full">
              {filtered.map((tpl) => (
                <div key={tpl.id} style={{ width: "280px", flexShrink: 0 }}>
                  <TemplateCard
                    template={tpl}
                    onEmpezar={handleEmpezar}
                    onDemo={setDemoTemplate}
                    applying={applying}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* EmpezarModal only shown when creating a brand-new site (no pendingSiteId) */}
      {selectedTemplate && <EmpezarModal template={selectedTemplate} onClose={() => setSelectedTemplate(null)} />}
      {demoTemplate && <DemoModal template={demoTemplate} onClose={() => setDemoTemplate(null)} />}
    </>
  );
}

export default function TemplatesPage() {
  return (
    <Suspense>
      <TemplatesPageInner />
    </Suspense>
  );
}
