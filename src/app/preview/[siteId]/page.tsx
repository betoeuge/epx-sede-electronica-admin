"use client";

import { useState, useEffect, use } from "react";
import { SiteTemplate } from "@/components/template/SiteTemplate";
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
    { id: "transparency", label: "Transparencia",       enabled: true, order: 4 },
    { id: "footer",       label: "Footer",              enabled: true, order: 5 },
  ],
};

interface ApiPage {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  sortOrder: number;
}

export default function PreviewPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = use(params);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [siteName, setSiteName] = useState("Cargando…");
  const [pages, setPages] = useState<{ id: string; label: string; slug: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("sede_token");
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const proxyPath = (path: string) => `/api/proxy?_path=${encodeURIComponent(path)}`;

    Promise.all([
      fetch(proxyPath(`/api/v1/sites/${siteId}`), { headers }),
      fetch(proxyPath(`/api/v1/sites/${siteId}/pages`), { headers }),
    ])
      .then(async ([siteRes, pagesRes]) => {
        if (siteRes.ok) {
          const site = await siteRes.json();
          setSiteName(site.name ?? "Sin nombre");

          // Parse settingsJson — supports both old flat format and new {theme,header,footer,nav}
          if (site.settingsJson) {
            try {
              const parsed = JSON.parse(site.settingsJson);
              // Map new schema fields to SiteSettings if needed
              setSettings((prev) => ({
                ...prev,
                ...(parsed.headerStyle ? parsed : {}),
                ...(parsed.header?.variant ? { headerStyle: parsed.header.variant } : {}),
              }));
            } catch { /* keep defaults */ }
          }
        }

        if (pagesRes.ok) {
          const rawPages: ApiPage[] = await pagesRes.json();
          setPages(
            rawPages
              .filter((p) => !p.parentId)
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((p) => ({ id: p.id, label: p.name, slug: `/${p.slug}` }))
          );
        }
      })
      .catch(() => { /* keep defaults */ })
      .finally(() => setLoading(false));
  }, [siteId]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f4f4" }}>
        <span style={{ color: "#555", fontFamily: "sans-serif" }}>Cargando vista previa…</span>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#ffffff" }}>
      <SiteTemplate
        entityName={siteName}
        pages={pages.length > 0 ? pages : [{ id: "inicio", label: "Inicio", slug: "/" }]}
        settings={settings}
      />
    </div>
  );
}
