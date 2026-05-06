"use client";

import { Spinner } from "@/components/ui/Spinner";
import {
  useNotifications,
  useMarkAsRead,
  useMarkAllAsRead,
  useDeleteNotification,
} from "@/hooks/useNotifications";
import type { AdminNotification } from "@/lib/notifications.service";

const TYPE_COLORS: Record<AdminNotification["type"], string> = {
  info: "#2d9cdb",
  success: "#27ae60",
  warning: "#f2994a",
  error: "#eb5757",
};

function typeIcon(type: AdminNotification["type"]) {
  switch (type) {
    case "success":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      );
    case "error":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10.29 3.86 1.82 18h20.36L10.29 3.86z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      );
    case "warning":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      );
    default:
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      );
  }
}

function formatTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Ahora";
  if (diffMin < 60) return `Hace ${diffMin} min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `Hace ${diffH}h`;
  const diffD = Math.floor(diffH / 24);
  if (diffD === 1) return "Ayer";
  return new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "short" }).format(d);
}

export default function NotificacionesPage() {
  const { data, isLoading } = useNotifications();
  const { mutate: markRead, isPending: isMarkingRead } = useMarkAsRead();
  const { mutate: markAll, isPending: isMarkingAll } = useMarkAllAsRead();
  const { mutate: deleteNotif } = useDeleteNotification();

  const notifications = data?.items ?? [];
  const unread = data?.unread ?? 0;

  return (
    <>
      <div
        className="flex items-center justify-between px-6 py-2 w-full shrink-0"
        style={{ background: "#181818", borderBottom: "1px solid #2d2d2d" }}
      >
        <div className="flex items-center gap-3">
          <h1 className="font-medium text-lg text-white">Notificaciones</h1>
          {unread > 0 && (
            <span
              className="flex items-center justify-center px-2 py-0.5 rounded-full text-white text-sm font-medium"
              style={{ background: "#eb5757" }}
            >
              {unread}
            </span>
          )}
        </div>
        {unread > 0 && (
          <button
            onClick={() => markAll(undefined)}
            disabled={isMarkingAll}
            className="text-sm font-medium hover:text-white transition-colors disabled:opacity-40"
            style={{ color: "#56ccf2" }}
          >
            {isMarkingAll ? "Marcando..." : "Marcar todas como leídas"}
          </button>
        )}
      </div>

      <div className="flex flex-col w-full relative flex-1" style={{ background: "black" }}>
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="notif-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#notif-grid)" />
          </svg>
        </div>

        <div className="relative flex flex-col gap-0 w-full max-w-[800px] mx-auto p-6">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Spinner size="lg" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-20 text-center">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#828282" strokeWidth="1.5">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <p className="font-medium text-white text-lg">Sin notificaciones</p>
              <p className="font-light text-[#bdbdbd]">No tienes notificaciones pendientes.</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className="flex gap-4 items-start p-4 border-b transition-colors"
                style={{
                  borderColor: "#2d2d2d",
                  background: notif.isRead ? "transparent" : "rgba(255,255,255,0.03)",
                }}
              >
                <div
                  className="rounded-full shrink-0 size-10 flex items-center justify-center mt-1"
                  style={{
                    background: `${TYPE_COLORS[notif.type]}22`,
                    color: TYPE_COLORS[notif.type],
                  }}
                >
                  {typeIcon(notif.type)}
                </div>

                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-white text-sm">{notif.title}</p>
                    {!notif.isRead && (
                      <div className="rounded-full size-2 shrink-0" style={{ background: "#2d9cdb" }} />
                    )}
                  </div>
                  <p className="text-sm leading-5" style={{ color: "#bdbdbd" }}>{notif.message}</p>
                  <p className="text-xs" style={{ color: "#828282" }}>{formatTime(notif.createdAt)}</p>
                </div>

                <div className="flex gap-2 items-center shrink-0">
                  {!notif.isRead && (
                    <button
                      onClick={() => markRead(notif.id)}
                      disabled={isMarkingRead}
                      className="px-3 py-1.5 rounded text-xs font-medium hover:opacity-80 transition-opacity disabled:opacity-40"
                      style={{ background: "#2d9cdb", color: "white" }}
                    >
                      Leída
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotif(notif.id)}
                    className="p-1.5 rounded hover:bg-white/10 transition-colors"
                    style={{ color: "#828282" }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
