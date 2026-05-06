"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useNotifications } from "@/hooks/useNotifications";
import { useSites } from "@/hooks/useSites";

interface SidebarProps {
  user?: { name?: string; email?: string };
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: notifData } = useNotifications();
  const unreadCount = notifData?.unread ?? 0;
  const { data: sitesData } = useSites();
  const allSites = [...(sitesData?.ungrouped ?? []), ...(sitesData?.groups ?? []).flatMap((g) => g.sites)];
  const draftCount = allSites.filter((s) => s.status === "Draft").length;
  const archivedCount = allSites.filter((s) => s.status === "Archived").length;

  function handleLogout() {
    localStorage.removeItem("sede_token");
    document.cookie = "sede_token=; path=/; max-age=0";
    router.push("/login");
  }

  const navItems = [
    {
      href: "/dashboard",
      label: "Sitios Activos",
      badge: 0,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      ),
    },
    {
      href: "/templates",
      label: "Templates",
      badge: 0,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="9" y1="21" x2="9" y2="9" />
        </svg>
      ),
    },
    {
      href: "/archivados",
      label: "Archivados",
      badge: archivedCount,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="21 8 21 21 3 21 3 8" />
          <rect x="1" y="3" width="22" height="5" />
          <line x1="10" y1="12" x2="14" y2="12" />
        </svg>
      ),
    },
    {
      href: "/draft",
      label: "Borradores",
      badge: draftCount,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 19l7-7 3 3-7 7-3-3z" />
          <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
          <path d="M2 2l7.586 7.586" />
          <circle cx="11" cy="11" r="2" />
        </svg>
      ),
    },
  ];

  const initial = user?.name?.[0]?.toUpperCase() || "U";

  return (
    <aside
      className="flex flex-col h-full shrink-0 w-[300px]"
      style={{ background: "#181818", borderRight: "1px solid #2d2d2d" }}
    >
      {/* Profile section */}
      <div className="flex flex-col">
        {/* Profile row */}
        <div
          className="flex items-center gap-3 px-4 py-4"
          style={{ background: "black", borderBottom: "1px solid #2d2d2d" }}
        >
          <div
            className="rounded-full shrink-0 size-8 flex items-center justify-center text-white font-medium text-sm"
            style={{ background: "#2d9cdb" }}
          >
            {initial}
          </div>
          <div className="flex flex-col flex-1 overflow-hidden min-w-0">
            <p
              className="font-medium text-sm text-white overflow-hidden text-ellipsis whitespace-nowrap leading-tight"
            >
              {user?.name || "Usuario"}
            </p>
            <p
              className="font-light text-xs overflow-hidden text-ellipsis whitespace-nowrap leading-tight mt-0.5"
              style={{ color: "#828282" }}
            >
              {user?.email || ""}
            </p>
          </div>
          {/* Chevron */}
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className="shrink-0">
            <path d="M1 1L5 5L9 1" stroke="#d9d9d9" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>

        {/* Search */}
        <div
          className="flex gap-2 items-center mx-4 my-3 px-3 py-3 rounded-lg"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid #2d2d2d" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#828282" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span className="text-sm" style={{ color: "#828282" }}>Buscar</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col flex-1 py-2">
        {navItems.map(({ href, label, icon, badge }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex gap-3 items-center px-4 py-3 mx-2 rounded-lg transition-colors ${active ? "" : "hover:bg-white/5"}`}
              style={active ? { background: "rgba(255,255,255,0.12)" } : {}}
            >
              <span style={{ color: active ? "white" : "#e0e0e0" }}>{icon}</span>
              <span
                className="font-medium text-sm flex-1"
                style={{ color: active ? "white" : "#e0e0e0" }}
              >
                {label}
              </span>
              {badge > 0 && (
                <span
                  className="flex items-center justify-center rounded-full text-white text-xs font-semibold min-w-[20px] h-[20px] px-1"
                  style={{ background: "rgba(255,255,255,0.2)" }}
                >
                  {badge > 99 ? "99+" : badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="flex flex-col" style={{ borderTop: "1px solid #2d2d2d" }}>
        {/* Notifications */}
        <Link
          href="/notificaciones"
          className="flex gap-3 items-center px-4 py-3 mx-2 mt-1 rounded-lg hover:bg-white/5 transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e0e0e0" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="font-medium text-sm text-[#e0e0e0] flex-1">Notificaciones</span>
          {unreadCount > 0 && (
            <span
              className="flex items-center justify-center rounded-full text-white text-xs font-semibold min-w-[22px] h-[22px] px-1"
              style={{ background: "#eb5757" }}
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Link>

        {/* Settings */}
        <Link
          href="/configuracion"
          className="flex gap-3 items-center px-4 py-3 mx-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e0e0e0" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          <span className="font-medium text-sm text-[#e0e0e0]">Configuraciones</span>
        </Link>

        {/* Support links + logout */}
        <div className="flex flex-col gap-0 px-6 py-4 mt-1" style={{ borderTop: "1px solid #2d2d2d" }}>
          <a className="text-sm text-white underline hover:text-[#56ccf2] transition-colors py-1" href="#">
            Soporte
          </a>
          <a className="text-sm text-white underline hover:text-[#56ccf2] transition-colors py-1" href="#">
            Términos y Condiciones
          </a>
          <button
            onClick={handleLogout}
            className="text-left text-sm text-[#eb5757] underline hover:text-[#eb5757]/80 transition-colors py-1 mt-1"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </aside>
  );
}
