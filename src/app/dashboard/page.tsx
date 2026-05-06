"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";
import { CreateSiteModal } from "@/components/dashboard/CreateSiteModal";
import { CreateGroupModal } from "@/components/dashboard/CreateGroupModal";
import {
  useSites,
  useDeleteSite,
  useArchiveSite,
  useActivateSite,
  useSetDraftSite,
  useUpdateSite,
  useDeleteSiteGroup,
} from "@/hooks/useSites";
import type { SiteResponse, SiteGroupResponse } from "@/types/sites.types";
import { SiteTemplateThumbnail } from "@/components/template/SiteTemplateThumbnail";

const FALLBACK_COLORS = [
  "#94bb5f",
  "#bf363b",
  "#d19d4d",
  "#e87148",
  "#415998",
  "#464289",
];

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

function StatusBadge({ status }: { status: SiteResponse["status"] }) {
  if (status === "Active")
    return (
      <div
        className="flex gap-1 items-center pl-1 pr-2 py-0.5 rounded-full bg-white border-2 shadow-sm"
        style={{ borderColor: "#27ae60" }}
      >
        <div className="size-2 rounded-full shrink-0" style={{ background: "#27ae60" }} />
        <span className="font-semibold text-[#333] text-xs leading-none">Live</span>
      </div>
    );
  if (status === "Draft")
    return (
      <div
        className="flex gap-1 items-center pl-1 pr-2 py-0.5 rounded-full bg-white border-2 shadow-sm"
        style={{ borderColor: "#828282" }}
      >
        <div className="size-2 rounded-full shrink-0" style={{ background: "#828282" }} />
        <span className="font-semibold text-[#555] text-xs leading-none">Borrador</span>
      </div>
    );
  if (status === "Archived")
    return (
      <div
        className="flex gap-1 items-center pl-1 pr-2 py-0.5 rounded-full bg-white border-2 shadow-sm"
        style={{ borderColor: "#f2994a" }}
      >
        <div className="size-2 rounded-full shrink-0" style={{ background: "#f2994a" }} />
        <span className="font-semibold text-[#555] text-xs leading-none">Archivado</span>
      </div>
    );
  return null;
}

function SiteCard({
  site,
  colorIndex,
  groups,
}: {
  site: SiteResponse;
  colorIndex: number;
  groups: SiteGroupResponse[];
}) {
  const router = useRouter();
  const { mutate: deleteSite, isPending: isDeleting } = useDeleteSite();
  const { mutate: archiveSite } = useArchiveSite();
  const { mutate: activateSite } = useActivateSite();
  const { mutate: setDraft } = useSetDraftSite();
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const statusMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showStatusMenu) return;
    function handleClick(e: MouseEvent) {
      if (statusMenuRef.current && !statusMenuRef.current.contains(e.target as Node))
        setShowStatusMenu(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showStatusMenu]);
  const { mutate: updateSite } = useUpdateSite();

  const [showMoveMenu, setShowMoveMenu] = useState(false);
  const moveMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showMoveMenu) return;
    function handleOutsideClick(e: MouseEvent) {
      if (moveMenuRef.current && !moveMenuRef.current.contains(e.target as Node)) {
        setShowMoveMenu(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [showMoveMenu]);

  const accentColor = site.accentColor ?? FALLBACK_COLORS[colorIndex % FALLBACK_COLORS.length];
  const displayDate = formatDate(site.updatedAt ?? site.createdAt);

  function handleDelete() {
    if (window.confirm(`¿Eliminar el sitio "${site.name}"? Esta acción no se puede deshacer.`)) {
      deleteSite(site.id);
    }
  }

  function handleMoveToGroup(groupId: string | undefined) {
    updateSite({
      id: site.id,
      data: {
        name: site.name,
        description: site.description,
        accentColor: site.accentColor,
        groupId,
      },
    });
    setShowMoveMenu(false);
  }

  return (
    <div className={`flex flex-col items-start overflow-hidden rounded-2xl w-full transition-shadow duration-200 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.12)] ${site.status === "Archived" ? "opacity-60" : ""}`}>
      <div className="flex flex-col items-start overflow-hidden pt-2 px-2 w-full" style={{ background: "#181818" }}>
        <div className="relative rounded-lg w-full overflow-hidden" style={{ aspectRatio: "234/132", background: "white" }}>
          <div style={{ transform: "scale(0.195)", transformOrigin: "top left", width: "513%", pointerEvents: "none" }}>
            <SiteTemplateThumbnail entityName={site.name} />
          </div>
          <div className="absolute top-2 left-2 z-10">
            <StatusBadge status={site.status} />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 items-start p-4 w-full" style={{ background: "#181818" }}>
        <div className="flex flex-col gap-2 items-start text-white w-full">
          <p className="font-medium overflow-hidden text-lg text-ellipsis w-full whitespace-nowrap" title={site.name}>
            {site.name}
          </p>
          <p className="font-light text-xs w-full" style={{ color: "#bdbdbd" }}>
            Editado {displayDate}
          </p>
        </div>

        <div className="flex items-center justify-between w-full">
          <div
            className="rounded-full size-6 flex items-center justify-center text-white text-xs font-medium"
            style={{ background: accentColor }}
          >
            {site.name[0]?.toUpperCase()}
          </div>

          <div className="flex gap-2 items-center">
            {/* Delete */}
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="overflow-hidden rounded size-8 flex items-center justify-center hover:bg-white/10 transition-colors disabled:opacity-40"
              style={{ background: "rgba(0,0,0,0.4)" }}
              title="Eliminar sitio"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#bdbdbd" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </button>

            {/* Status menu */}
            <div className="relative" ref={statusMenuRef}>
              <button
                onClick={() => setShowStatusMenu((p) => !p)}
                className="overflow-hidden rounded size-8 flex items-center justify-center hover:bg-white/10 transition-colors"
                style={{ background: showStatusMenu ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.4)" }}
                title="Cambiar estado"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#bdbdbd" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </button>
              {showStatusMenu && (
                <div className="absolute right-0 bottom-full mb-1 rounded-lg shadow-lg z-50" style={{ background: "#1e1e1e", border: "1px solid #2d2d2d", minWidth: "150px" }}>
                  <div className="px-3 pt-2 pb-1">
                    <span className="text-xs" style={{ color: "#828282" }}>Cambiar estado</span>
                  </div>
                  <div className="flex flex-col pb-1">
                    {site.status !== "Active" && (
                      <button onClick={() => {
                        setShowStatusMenu(false);
                        if (window.confirm(`¿Publicar "${site.name}" como Live?\nEl sitio será visible públicamente.`)) activateSite(site.id);
                      }} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/10 w-full text-left" style={{ color: "#27ae60" }}>
                        <span className="size-2 rounded-full bg-[#27ae60] shrink-0" /> Publicar (Live)
                      </button>
                    )}
                    {site.status !== "Draft" && (
                      <button onClick={() => {
                        setShowStatusMenu(false);
                        if (window.confirm(`¿Mover "${site.name}" a Borrador?\nEl sitio dejará de estar visible públicamente.`)) setDraft(site.id);
                      }} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/10 w-full text-left" style={{ color: "#bdbdbd" }}>
                        <span className="size-2 rounded-full bg-[#bdbdbd] shrink-0" /> Mover a Borrador
                      </button>
                    )}
                    {site.status !== "Archived" && (
                      <button onClick={() => {
                        setShowStatusMenu(false);
                        if (window.confirm(`¿Archivar "${site.name}"?\nPodrás restaurarlo desde la sección Archivados.`)) archiveSite(site.id);
                      }} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/10 w-full text-left" style={{ color: "#f2994a" }}>
                        <span className="size-2 rounded-full bg-[#f2994a] shrink-0" /> Archivar
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Move to group */}
            <div className="relative" ref={moveMenuRef}>
              <button
                onClick={() => setShowMoveMenu((v) => !v)}
                className="overflow-hidden rounded size-8 flex items-center justify-center hover:bg-white/10 transition-colors"
                style={{ background: showMoveMenu ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.4)" }}
                title="Mover a grupo"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#bdbdbd" strokeWidth="2">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                </svg>
              </button>

              {showMoveMenu && (
                <div
                  className="absolute right-0 bottom-full mb-1 rounded-lg shadow-lg z-50"
                  style={{
                    background: "#1e1e1e",
                    border: "1px solid #2d2d2d",
                    minWidth: "160px",
                  }}
                >
                  <div className="px-3 pt-2 pb-1">
                    <span className="text-xs" style={{ color: "#828282" }}>Mover a grupo</span>
                  </div>
                  <div className="flex flex-col pb-1">
                    {site.groupId && (
                      <button
                        onClick={() => handleMoveToGroup(undefined)}
                        className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/10 transition-colors text-left w-full"
                        style={{ color: "#828282", fontStyle: "italic" }}
                      >
                        Sin grupo
                      </button>
                    )}
                    {groups.map((group) => (
                      <button
                        key={group.id}
                        onClick={() => handleMoveToGroup(group.id)}
                        className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/10 transition-colors text-left w-full"
                        style={{ color: site.groupId === group.id ? "#bdbdbd" : "#e0e0e0" }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
                          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                        </svg>
                        <span className="truncate">{group.name}</span>
                      </button>
                    ))}
                    {groups.length === 0 && !site.groupId && (
                      <p className="px-3 py-2 text-xs" style={{ color: "#4f4f4f" }}>
                        No hay grupos creados
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Edit → navigate to editor */}
            <button
              onClick={() => router.push(`/editor?site=${site.id}`)}
              className="overflow-hidden rounded size-8 flex items-center justify-center hover:bg-white/10 transition-colors"
              style={{ background: "rgba(0,0,0,0.4)" }}
              title="Editar sitio"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#bdbdbd" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SiteGroupSection({
  group,
  groups,
  onCreateSiteInGroup,
}: {
  group: SiteGroupResponse;
  groups: SiteGroupResponse[];
  onCreateSiteInGroup: (groupId: string) => void;
}) {
  const { mutate: deleteGroup, isPending: isDeletingGroup } = useDeleteSiteGroup();

  function handleDeleteGroup() {
    if (group.sites.length > 0) {
      alert("No se puede eliminar un grupo que tiene sitios. Mueva o elimine los sitios primero.");
      return;
    }
    if (window.confirm(`¿Eliminar el grupo "${group.name}"?`)) {
      deleteGroup(group.id);
    }
  }

  const rows: SiteResponse[][] = [];
  for (let i = 0; i < group.sites.length; i += 3) {
    rows.push(group.sites.slice(i, i + 3));
  }

  return (
    <section className="flex flex-col gap-4 w-full">
      {/* Group header */}
      <div className="flex items-center justify-between w-full">
        <div
          className="flex gap-2 items-center px-4 py-2 rounded-full"
          style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(4px)" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#bdbdbd" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
          <span className="font-medium text-[#bdbdbd] text-base">{group.name}</span>
          <span className="text-[#4f4f4f] text-sm">({group.sites.length})</span>
        </div>

        <div className="flex gap-2 items-center">
          {/* Add site to group */}
          <button
            onClick={() => onCreateSiteInGroup(group.id)}
            className="rounded size-11 flex items-center justify-center hover:bg-white/20 transition-colors"
            style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(4px)" }}
            title="Agregar sitio al grupo"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#bdbdbd" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>

          {/* Delete group */}
          <button
            onClick={handleDeleteGroup}
            disabled={isDeletingGroup}
            className="rounded size-11 flex items-center justify-center hover:bg-white/20 transition-colors disabled:opacity-40"
            style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(4px)" }}
            title="Eliminar grupo"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#bdbdbd" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>

      {/* Cards grid */}
      <div
        className="flex flex-col gap-6 items-start p-6 rounded-lg w-full border"
        style={{ background: "rgba(255,255,255,0.05)", borderColor: "#2d2d2d", backdropFilter: "blur(4px)" }}
      >
        {rows.length === 0 ? (
          <p className="text-[#4f4f4f] text-sm w-full text-center py-4">
            No hay sitios en este grupo.{" "}
            <button
              onClick={() => onCreateSiteInGroup(group.id)}
              className="text-[#2d9cdb] hover:underline"
            >
              Crear el primero
            </button>
          </p>
        ) : (
          rows.map((row, ri) => (
            <div key={ri} className="grid grid-cols-3 gap-6 w-full">
              {row.map((site, ci) => (
                <SiteCard key={site.id} site={site} colorIndex={ri * 3 + ci} groups={groups} />
              ))}
            </div>
          ))
        )}
      </div>
    </section>
  );
}

function GridBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number;
    function handleMouseMove(e: MouseEvent) {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        containerRef.current.style.setProperty("--mx", `${e.clientX - rect.left}px`);
        containerRef.current.style.setProperty("--my", `${e.clientY - rect.top}px`);
      });
    }
    window.addEventListener("mousemove", handleMouseMove);
    return () => { window.removeEventListener("mousemove", handleMouseMove); cancelAnimationFrame(rafId); };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
      style={{ "--mx": "0px", "--my": "0px" } as React.CSSProperties}>
      {/* Base grid */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: "linear-gradient(rgba(255,255,255,0.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.3) 1px,transparent 1px)",
        backgroundSize: "80px 80px",
      }} />
      {/* Spotlight grid */}
      <div className="absolute inset-0 opacity-[0.18]" style={{
        backgroundImage: "linear-gradient(rgba(255,255,255,0.35) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.35) 1px,transparent 1px)",
        backgroundSize: "80px 80px",
        maskImage: "radial-gradient(circle 200px at var(--mx) var(--my),black 0%,transparent 100%)",
        WebkitMaskImage: "radial-gradient(circle 200px at var(--mx) var(--my),black 0%,transparent 100%)",
      }} />
      {/* Dots */}
      <div className="absolute inset-0 opacity-[0.06]" style={{
        backgroundImage: "radial-gradient(rgba(255,255,255,0.8) 1.5px,transparent 0)",
        backgroundSize: "80px 80px",
        backgroundPosition: "-1px -1px",
      }} />
      {/* Mouse glow */}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(circle 250px at var(--mx) var(--my),rgba(255,255,255,0.04),transparent 70%)",
      }} />
    </div>
  );
}

function EmptyState({ onCreateSite }: { onCreateSite: () => void }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-10">
      <div
        className="flex flex-col items-center max-w-md w-full overflow-hidden rounded-2xl shadow-2xl z-10"
        style={{ background: "rgba(24,24,24,0.85)", backdropFilter: "blur(8px)", border: "1px solid #2d2d2d" }}
      >
        {/* Preview area */}
        <div className="w-full p-4" style={{ aspectRatio: "16/9" }}>
          <div
            className="w-full h-full rounded-xl flex items-center justify-center overflow-hidden relative"
            style={{ background: "#0d0d0d", border: "1px solid #2d2d2d" }}
          >
            {/* Illustration: browser chrome mockup */}
            <svg width="80%" viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="8" y="8" width="304" height="164" rx="8" fill="#181818" stroke="#2d2d2d" strokeWidth="1.5"/>
              <rect x="8" y="8" width="304" height="28" rx="8" fill="#222"/>
              <circle cx="26" cy="22" r="4" fill="#eb5757" fillOpacity="0.6"/>
              <circle cx="40" cy="22" r="4" fill="#f2994a" fillOpacity="0.6"/>
              <circle cx="54" cy="22" r="4" fill="#27ae60" fillOpacity="0.6"/>
              <rect x="70" y="15" width="160" height="14" rx="4" fill="#2d2d2d"/>
              <rect x="20" y="48" width="88" height="8" rx="4" fill="#2d2d2d" fillOpacity="0.7"/>
              <rect x="20" y="64" width="136" height="6" rx="3" fill="#2d2d2d" fillOpacity="0.4"/>
              <rect x="20" y="78" width="108" height="6" rx="3" fill="#2d2d2d" fillOpacity="0.4"/>
              <rect x="20" y="100" width="64" height="28" rx="6" fill="#003DA6" fillOpacity="0.7"/>
              <rect x="180" y="44" width="116" height="100" rx="8" fill="#1e1e1e" stroke="#2d2d2d"/>
              <rect x="190" y="54" width="96" height="52" rx="4" fill="#2d2d2d" fillOpacity="0.5"/>
              <rect x="190" y="114" width="60" height="6" rx="3" fill="#2d2d2d" fillOpacity="0.6"/>
              <rect x="190" y="126" width="40" height="5" rx="2.5" fill="#2d2d2d" fillOpacity="0.4"/>
            </svg>
            <div className="absolute inset-0 pointer-events-none" style={{
              background: "radial-gradient(circle at 50% 50%,rgba(255,255,255,0.02),transparent 70%)"
            }}/>
          </div>
        </div>
        {/* Text + CTA */}
        <div className="flex flex-col gap-5 items-center justify-center pb-10 pt-2 px-6 w-full text-center">
          <div className="flex flex-col gap-3 items-center">
            <h3 className="text-white font-medium text-lg">Tu lista de proyectos está vacía.</h3>
            <p className="text-[#828282] text-sm leading-6">
              Elige una plantilla predefinida para visualizar tus datos al instante
              o inicia un proyecto en blanco para un control total.
            </p>
          </div>
          <button
            onClick={onCreateSite}
            className="flex gap-2 items-center px-5 py-2.5 rounded-lg text-white text-sm font-medium transition-colors hover:opacity-90"
            style={{ background: "#003DA6" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="12" y1="18" x2="12" y2="12"/>
              <line x1="9" y1="15" x2="15" y2="15"/>
            </svg>
            Nuevo Proyecto
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data, isLoading, error, refetch } = useSites();

  const [showCreateSite, setShowCreateSite] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [defaultGroupId, setDefaultGroupId] = useState<string | undefined>();

  function handleCreateSiteInGroup(groupId: string) {
    setDefaultGroupId(groupId);
    setShowCreateSite(true);
  }

  function handleOpenCreateSite() {
    setDefaultGroupId(undefined);
    setShowCreateSite(true);
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center h-full" style={{ background: "black" }}>
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center h-full gap-4" style={{ background: "black" }}>
        <p className="text-[#eb5757] text-sm">Error al cargar los proyectos</p>
        <Button variant="secondary" onClick={() => refetch()}>
          Reintentar
        </Button>
      </div>
    );
  }

  const groups = data?.groups ?? [];
  const ungrouped = data?.ungrouped ?? [];
  const allSites = [...ungrouped, ...groups.flatMap((g) => g.sites)];
  const activeCount = allSites.filter((s) => s.status === "Active").length;
  const draftCount = allSites.filter((s) => s.status === "Draft").length;
  const archivedCount = allSites.filter((s) => s.status === "Archived").length;

  // Dashboard shows only Active (Live) sites
  const activeUngrouped = ungrouped.filter((s) => s.status === "Active");
  const activeGroups = groups.map((g) => ({
    ...g,
    sites: g.sites.filter((s) => s.status === "Active"),
  }));
  const totallyEmpty = allSites.length === 0 && groups.length === 0;
  const noActiveSites =
    !totallyEmpty &&
    activeUngrouped.length === 0 &&
    activeGroups.every((g) => g.sites.length === 0) &&
    groups.length === 0;

  return (
    <>
      {/* Section header */}
      <div
        className="flex items-center justify-between px-6 py-2 w-full shrink-0"
        style={{ background: "#181818", borderBottom: "1px solid #2d2d2d" }}
      >
        <div className="flex items-center gap-6">
          <h1 className="font-medium text-lg text-white whitespace-nowrap">Proyectos activos</h1>
          {!isLoading && (
            <div className="flex gap-4 items-center">
              <span className="flex items-center gap-1.5 text-xs font-medium" style={{ color: "#27ae60" }}>
                <span className="size-2 rounded-full bg-[#27ae60] shrink-0" />{activeCount} Live
              </span>
              <span className="flex items-center gap-1.5 text-xs font-medium" style={{ color: "#828282" }}>
                <span className="size-2 rounded-full bg-[#828282] shrink-0" />{draftCount} Borradores
              </span>
              <span className="flex items-center gap-1.5 text-xs font-medium" style={{ color: "#f2994a" }}>
                <span className="size-2 rounded-full bg-[#f2994a] shrink-0" />{archivedCount} Archivados
              </span>
            </div>
          )}
        </div>
        <div className="flex gap-4 items-center">
          <button
            onClick={() => setShowCreateGroup(true)}
            className="flex gap-2 items-center px-4 py-3 rounded-lg text-[#e0e0e0] text-sm font-medium hover:bg-white/10 transition-colors border"
            style={{ background: "rgba(255,255,255,0.05)", borderColor: "#828282" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            Crear Grupo
          </button>
          <button
            onClick={handleOpenCreateSite}
            className="flex gap-2 items-center px-4 py-3 rounded-lg text-[#e0e0e0] text-sm font-medium hover:bg-white/10 transition-colors border"
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
      </div>

      {/* Main content */}
      <div
        className="flex flex-col gap-10 items-start p-10 w-full flex-1 relative"
        style={{ background: "black", minHeight: 0 }}
      >
        <GridBackground />

        {totallyEmpty || noActiveSites ? (
          <EmptyState onCreateSite={handleOpenCreateSite} />
        ) : (
          <>
            {/* Grouped sites — only active sites shown */}
            {activeGroups.map((group) => (
              <SiteGroupSection
                key={group.id}
                group={group}
                groups={groups}
                onCreateSiteInGroup={handleCreateSiteInGroup}
              />
            ))}

            {/* Ungrouped active sites */}
            {activeUngrouped.length > 0 && (
              <section className="flex flex-col gap-4 w-full">
                <div
                  className="flex gap-2 items-center px-4 py-2 rounded-full w-fit"
                  style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(4px)" }}
                >
                  <span className="font-medium text-[#828282] text-base">Sin grupo</span>
                  <span className="text-[#4f4f4f] text-sm">({activeUngrouped.length})</span>
                </div>
                <div
                  className="flex flex-col gap-6 items-start p-6 rounded-lg w-full border"
                  style={{ background: "rgba(255,255,255,0.05)", borderColor: "#2d2d2d" }}
                >
                  {Array.from({ length: Math.ceil(activeUngrouped.length / 3) }, (_, ri) => (
                    <div key={ri} className="grid grid-cols-3 gap-6 w-full">
                      {activeUngrouped.slice(ri * 3, ri * 3 + 3).map((site, ci) => (
                        <SiteCard key={site.id} site={site} colorIndex={ri * 3 + ci} groups={groups} />
                      ))}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <CreateSiteModal
        isOpen={showCreateSite}
        onClose={() => { setShowCreateSite(false); setDefaultGroupId(undefined); }}
        groups={groups}
        defaultGroupId={defaultGroupId}
      />
      <CreateGroupModal
        isOpen={showCreateGroup}
        onClose={() => setShowCreateGroup(false)}
      />
    </>
  );
}
