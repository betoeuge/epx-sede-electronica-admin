"use client";

import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";
import { useSites, useDeleteSite, useArchiveSite, useActivateSite, useSetDraftSite } from "@/hooks/useSites";
import { SiteTemplateThumbnail } from "@/components/template/SiteTemplateThumbnail";
import type { SiteResponse } from "@/types/sites.types";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso));
}

function DraftCard({ site }: { site: SiteResponse }) {
  const router = useRouter();
  const { mutate: deleteSite, isPending: isDeleting } = useDeleteSite();
  const { mutate: archiveSite, isPending: isArchiving } = useArchiveSite();
  const { mutate: activateSite, isPending: isActivating } = useActivateSite();

  function handleDelete() {
    if (window.confirm(`¿Eliminar el sitio "${site.name}"? Esta acción no se puede deshacer.`)) {
      deleteSite(site.id);
    }
  }

  function handlePublish() {
    if (window.confirm(`¿Publicar "${site.name}" como Live?\nEl sitio será visible públicamente.`)) {
      activateSite(site.id);
    }
  }

  return (
    <div className="flex flex-col items-start overflow-hidden rounded-2xl w-full">
      <div className="flex flex-col items-start overflow-hidden pt-2 px-2 w-full" style={{ background: "#181818" }}>
        <div className="relative rounded-lg w-full overflow-hidden" style={{ aspectRatio: "234/132", background: "white" }}>
          <div style={{ transform: "scale(0.195)", transformOrigin: "top left", width: "513%", pointerEvents: "none" }}>
            <SiteTemplateThumbnail entityName={site.name} />
          </div>
          <div className="absolute top-2 left-2 z-10">
            <div className="flex gap-1 items-center pl-1 pr-2 py-0.5 rounded-full bg-white border-2 shadow-sm" style={{ borderColor: "#828282" }}>
              <div className="size-2 rounded-full shrink-0" style={{ background: "#828282" }} />
              <span className="font-semibold text-[#555] text-xs leading-none">Borrador</span>
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
            Editado {formatDate(site.updatedAt ?? site.createdAt)}
          </p>
        </div>

        <div className="flex gap-2 w-full">
          <button
            onClick={handlePublish}
            disabled={isActivating}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded text-white text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-40"
            style={{ background: "#27ae60" }}
            title="Publicar como Live"
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
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded text-white text-sm font-medium hover:opacity-80 transition-opacity"
            style={{ background: "#2d9cdb" }}
          >
            Continuar
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
          <button
            onClick={() => { if (window.confirm(`¿Archivar "${site.name}"?`)) archiveSite(site.id); }}
            disabled={isArchiving}
            className="px-3 py-2 rounded text-[#e0e0e0] text-sm hover:bg-white/10 transition-colors border disabled:opacity-40"
            style={{ background: "rgba(255,255,255,0.05)", borderColor: "#2d2d2d" }}
            title="Archivar"
          >
            {isArchiving ? <Spinner size="sm" /> : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#bdbdbd" strokeWidth="2">
                <polyline points="21 8 21 21 3 21 3 8" />
                <rect x="1" y="3" width="22" height="5" />
                <line x1="10" y1="12" x2="14" y2="12" />
              </svg>
            )}
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-3 py-2 rounded text-[#e0e0e0] text-sm hover:bg-white/10 transition-colors border disabled:opacity-40"
            style={{ background: "rgba(255,255,255,0.05)", borderColor: "#2d2d2d" }}
            title="Eliminar"
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

export default function DraftPage() {
  const { data, isLoading, error, refetch } = useSites();

  const allSites = [
    ...(data?.ungrouped ?? []),
    ...(data?.groups ?? []).flatMap((g) => g.sites),
  ];
  const drafts = allSites.filter((s) => s.status === "Draft");

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
          <h1 className="font-medium text-lg text-white">Borradores</h1>
          {drafts.length > 0 && (
            <span
              className="px-2 py-0.5 rounded-full text-white text-xs font-medium"
              style={{ background: "#828282" }}
            >
              {drafts.length}
            </span>
          )}
        </div>
        <button
          onClick={() => window.location.href = "/dashboard"}
          className="flex gap-2 items-center px-4 py-3 rounded-lg text-[#e0e0e0] text-sm font-medium border hover:bg-white/10 transition-colors"
          style={{ background: "rgba(255,255,255,0.05)", borderColor: "#828282" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="12" y1="18" x2="12" y2="12" />
            <line x1="9" y1="15" x2="15" y2="15" />
          </svg>
          Nuevo Proyecto
        </button>
      </div>

      <div className="flex flex-col gap-10 items-start overflow-auto p-10 w-full flex-1 relative" style={{ background: "black" }}>
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="draft-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#draft-grid)" />
          </svg>
        </div>

        {drafts.length === 0 ? (
          <div className="relative flex flex-col items-center justify-center flex-1 w-full gap-6 text-center">
            <div
              className="flex flex-col items-center max-w-[450px] rounded-2xl w-full p-8 gap-6"
              style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(4px)" }}
            >
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#828282" strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <div className="flex flex-col gap-3 text-white">
                <p className="font-medium text-lg">No hay borradores</p>
                <p className="font-light text-base leading-6" style={{ color: "#bdbdbd" }}>
                  Los sitios que crees sin publicar aparecerán aquí para que puedas continuar editándolos.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative grid grid-cols-3 gap-6 w-full">
            {drafts.map((site) => (
              <DraftCard key={site.id} site={site} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
