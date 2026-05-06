import { SiteTemplate } from "./SiteTemplate";
import type { SiteSettings } from "@/types/site-settings.types";

const DEFAULT_SETTINGS: SiteSettings = {
  headerStyle: "blue",
  showLogo: true,
  showSearch: true,
  showLanguageToggle: false,
  sections: [
    { id: "hero",         label: "Hero Banner",        enabled: true, order: 1 },
    { id: "quickaccess",  label: "Accesos Rápidos",     enabled: true, order: 2 },
    { id: "news",         label: "Noticias Destacadas", enabled: true, order: 3 },
    { id: "transparency", label: "Transparencia",       enabled: false, order: 4 },
    { id: "footer",       label: "Footer",              enabled: false, order: 5 },
  ],
};

const DEFAULT_PAGES = [
  { id: "inicio",        label: "Inicio",       slug: "/" },
  { id: "tramites",      label: "Trámites",      slug: "/tramites" },
  { id: "noticias",      label: "Noticias",      slug: "/noticias" },
  { id: "transparencia", label: "Transparencia", slug: "/transparencia" },
  { id: "contacto",      label: "Contacto",      slug: "/contacto" },
];

export function SiteTemplateThumbnail({ entityName }: { entityName: string }) {
  return (
    <SiteTemplate
      entityName={entityName}
      accentColor="#003DA6"
      pages={DEFAULT_PAGES}
      settings={DEFAULT_SETTINGS}
    />
  );
}
