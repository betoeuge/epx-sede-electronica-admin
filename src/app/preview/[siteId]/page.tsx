// Public route — no auth required. Renders the GOV.CO site template for citizens.
"use client";

import { useState, useEffect } from "react";
import { use } from "react";
import { SiteTemplate } from "@/components/template/SiteTemplate";
import type { SiteSettings } from "@/types/site-settings.types";

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

const DEFAULT_PAGES = [
  { id: "inicio", label: "Inicio", slug: "/" },
  { id: "tramites", label: "Trámites", slug: "/tramites" },
  { id: "noticias", label: "Noticias", slug: "/noticias" },
  { id: "transparencia", label: "Transparencia", slug: "/transparencia" },
  { id: "contacto", label: "Contacto", slug: "/contacto" },
];

export default function PreviewPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = use(params);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [siteName, setSiteName] = useState("Entidad Gubernamental");

  useEffect(() => {
    // Load settings persisted by the editor
    try {
      const stored = localStorage.getItem(`site_settings_${siteId}`);
      if (stored) {
        const parsed = JSON.parse(stored) as SiteSettings;
        setSettings(parsed);
      }
    } catch {
      // use defaults
    }

    // Try to load site name from sites cache
    try {
      const sitesCache = localStorage.getItem("sites_cache");
      if (sitesCache) {
        const data = JSON.parse(sitesCache) as { id: string; name: string }[];
        const found = data.find((s) => s.id === siteId);
        if (found) setSiteName(found.name);
      }
    } catch {
      // use default name
    }
  }, [siteId]);

  return (
    <div style={{ minHeight: "100vh", background: "#ffffff" }}>
      <SiteTemplate
        entityName={siteName}
        pages={DEFAULT_PAGES}
        settings={settings}
      />
    </div>
  );
}
