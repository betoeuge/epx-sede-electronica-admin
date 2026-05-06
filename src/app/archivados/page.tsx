"use client";

import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";
import { useSites, useDeleteSite, useActivateSite, useSetDraftSite } from "@/hooks/useSites";
import { SiteTemplateThumbnail } from "@/components/template/SiteTemplateThumbnail";
import type { SiteResponse } from "@/types/sites.types";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso));
}

function ArchivedCard({ site }: { site: SiteResponse }) {
  const router = useRouter();
  const { mutate: deleteSite, isPending: isDeleting } = useDeleteSite();
  const { mutate: activateSite, isPending: isActivating } = useActivateSite();
  const { mutate: setDraft, isPending: isSettingDraft } = useSetDraftSite();

  function handleDelete() {
    if (window.confirm(`¿Eliminar el sitio "${site.name}"? Esta acción no se puede deshacer.`)) {
      deleteSite(site.id);
    }
  }

  return (
    <div className="flex flex-col items-start overflow-hidden rounded-2xl w-full opacity-75 hover:opacity-100 transition-opacity">
      <div className="flex flex-col items-start overflow-hidden pt-2 px-2 w-full" style={{ background: "#181818" }}>
        <div className="relative rounded-lg w-full overflow-hidden" style={{ aspectRatio: "234/132", background: "white" }}>
          <div style={{ transform: "scale(0.195)", transformOrigin: "top left", width: "513%", pointerEvents: "none" }}>
            <SiteTemplateThumbnail entityName={site.name} />
          </div>
          <div className="absolute top-2 left-2 z-10">
            <div className="flex gap-1 items-center pl-1 pr-2 py-0.5 rounded-full bg-white border-2 shadow-sm" style={{ borderColor: "#f2994a" }}>
              <div className="size-2 rounded-full shrink-0" style={{ background: "#f2994a" }} />
              <span className="font-semibold text-[#555] text-xs leading-none">Archivado</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 items-start p-4 w-full" style={{ background: "#181818" }}>
        <div className="flex flex-col gap-2 items-start text-white w-full">
          <p className="font-medium overflow-hidden text-lg text-ellipsis w-full whitespace-nowrap" title={site.name}>
            {site.name}
          </p>
          <p className="font-light text-xs w-full" style={{ color: "#bdbdbd" }}>
            Archivado {formatDate(site.updatedAt ?? site.createdAt)}
          </p>
        </div>

        <div className="flex gap-2 w-full">
          <button
            onClick={() => { if (window.confirm(`¿Restaurar "${site.name}" como Borrador?`)) setDraft(site.id); }}
            disabled={isSettingDraft}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded text-white text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-40"
            style={{ background: "#828282" }}
            title="Mover a Borrador"
          >
            {isSettingDraft ? <Spinner size="sm" /> : (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M3 12h18M3 12l6-6M3 12l6 6" />
              </svg>
            )}
            Borrador
          </button>
          <button
            onClick={() => { if (window.confirm(`¿Publicar "${site.name}" directamente como Live?`)) activateSite(site.id); }}
            disabled={isActivating}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded text-white text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-40"
            style={{ background: "#27ae60" }}
          >
            {isActivating ? <Spinner size="sm" /> : (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
            Publicar
          </button>
          <button
            onClick={() => router.push(`/editor?site=${site.id}`)}
            className="px-3 py-2 rounded text-[#e0e0e0] text-sm hover:bg-white/10 transition-colors border"
            style={{ background: "rgba(255,255,255,0.05)", borderColor: "#2d2d2d" }}
            title="Editar"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-3 py-2 rounded text-[#e0e0e0] text-sm hover:bg-white/10 transition-colors border disabled:opacity-40"
            style={{ background: "rgba(255,255,255,0.05)", borderColor: "#2d2d2d" }}
            title="Eliminar permanentemente"
          >
            {isDeleting ? <Spinner size="sm" /> : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#eb5757" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ArchivadosPage() {
  const { data, isLoading, error, refetch } = useSites();

  const allSites = [
    ...(data?.ungrouped ?? []),
    ...(data?.groups ?? []).flatMap((g) => g.sites),
  ];
  const archived = allSites.filter((s) => s.status === "Archived");

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center" style={{ background: "black" }}>
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4" style={{ background: "black" }}>
        <p className="text-[#eb5757] text-sm">Error al cargar los proyectos</p>
        <Button variant="secondary" onClick={() => refetch()}>Reintentar</Button>
      </div>
    );
  }

  return (
    <>
      <div
        className="flex items-center justify-between px-6 py-2 w-full shrink-0"
        style={{ background: "#181818", borderBottom: "1px solid #2d2d2d" }}
      >
        <div className="flex items-center gap-3">
          <h1 className="font-medium text-lg text-white">Archivados</h1>
          {archived.length > 0 && (
            <span
              className="px-2 py-0.5 rounded-full text-white text-xs font-medium"
              style={{ background: "#828282" }}
            >
              {archived.length}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-10 items-start overflow-auto p-10 w-full flex-1 relative" style={{ background: "black" }}>
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="arch-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#arch-grid)" />
          </svg>
        </div>

        {archived.length === 0 ? (
          <div className="relative flex flex-col items-center justify-center flex-1 w-full gap-6 text-center">
            <div
              className="flex flex-col items-center max-w-[450px] overflow-hidden rounded-2xl w-full p-8 gap-6"
              style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(4px)" }}
            >
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#828282" strokeWidth="1.5">
                <polyline points="21 8 21 21 3 21 3 8" />
                <rect x="1" y="3" width="22" height="5" />
                <line x1="10" y1="12" x2="14" y2="12" />
              </svg>
              <div className="flex flex-col gap-3 text-white">
                <p className="font-medium text-lg">No hay proyectos archivados</p>
                <p className="font-light text-base leading-6" style={{ color: "#bdbdbd" }}>
                  Los proyectos que archives aparecerán aquí para que puedas recuperarlos cuando lo necesites.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative grid grid-cols-3 gap-6 w-full">
            {archived.map((site) => (
              <ArchivedCard key={site.id} site={site} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
