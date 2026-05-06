"use client";

import { useState } from "react";
import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";
import {
  useAdminUsers,
  useInviteUser,
  useUpdateUserRole,
  useToggleUserStatus,
  useSystemConfig,
  useSetConfig,
} from "@/hooks/useAdmin";
import type { AdminUser } from "@/lib/admin.service";

// ── Config section (entity info, etc.) ────────────────────────────────────────
function SystemConfigPanel() {
  const { data: configs, isLoading } = useSystemConfig();
  const { mutate: setConfig, isPending } = useSetConfig();

  const getValue = (key: string) => configs?.find((c) => c.key === key)?.value ?? "";
  const [entityName, setEntityName] = useState<string | null>(null);
  const [nit, setNit] = useState<string | null>(null);
  const [contactEmail, setContactEmail] = useState<string | null>(null);

  if (isLoading) return <div className="flex justify-center py-6"><Spinner size="sm" /></div>;

  const displayEntityName = entityName ?? getValue("entity.name");
  const displayNit = nit ?? getValue("entity.nit");
  const displayContactEmail = contactEmail ?? getValue("entity.contact.email");

  function handleSave() {
    if (entityName !== null) setConfig({ key: "entity.name", value: entityName });
    if (nit !== null) setConfig({ key: "entity.nit", value: nit });
    if (contactEmail !== null) setConfig({ key: "entity.contact.email", value: contactEmail });
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium" style={{ color: "#bdbdbd" }}>Nombre de la entidad</label>
          <input
            value={displayEntityName}
            onChange={(e) => setEntityName(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm outline-none"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid #2d2d2d", color: "#e0e0e0" }}
            placeholder="Ministerio de Tecnologías..."
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium" style={{ color: "#bdbdbd" }}>NIT</label>
          <input
            value={displayNit}
            onChange={(e) => setNit(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm outline-none"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid #2d2d2d", color: "#e0e0e0" }}
            placeholder="900.123.456-7"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium" style={{ color: "#bdbdbd" }}>Email de contacto</label>
          <input
            value={displayContactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            type="email"
            className="px-3 py-2 rounded-lg text-sm outline-none"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid #2d2d2d", color: "#e0e0e0" }}
            placeholder="contacto@entidad.gov.co"
          />
        </div>
      </div>
      <Button variant="brand" size="sm" onClick={handleSave} disabled={isPending}>
        {isPending ? <Spinner size="sm" /> : "Guardar cambios"}
      </Button>
    </div>
  );
}

// ── Users panel ───────────────────────────────────────────────────────────────
function RoleBadge({ role }: { role: string }) {
  const map: Record<string, { bg: string; label: string }> = {
    SuperAdmin: { bg: "#003DA6", label: "Super Admin" },
    Editor: { bg: "#27ae60", label: "Editor" },
    Viewer: { bg: "#828282", label: "Viewer" },
  };
  const s = map[role] ?? { bg: "#333", label: role };
  return (
    <span className="px-2 py-0.5 rounded-full text-xs font-medium text-white" style={{ background: s.bg }}>
      {s.label}
    </span>
  );
}

function UserRow({ user }: { user: AdminUser }) {
  const { mutate: updateRole, isPending: updatingRole } = useUpdateUserRole();
  const { mutate: toggleStatus, isPending: togglingStatus } = useToggleUserStatus();

  return (
    <tr style={{ borderBottom: "1px solid #2d2d2d" }} className="hover:bg-white/3 transition-colors">
      <td className="px-4 py-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-white">{user.firstName} {user.lastName}</span>
          <span className="text-xs" style={{ color: "#828282" }}>{user.email}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <RoleBadge role={user.role} />
      </td>
      <td className="px-4 py-3">
        <span className={`text-xs font-medium ${user.isActive ? "text-[#27ae60]" : "text-[#828282]"}`}>
          {user.isActive ? "Activo" : "Inactivo"}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className="text-xs" style={{ color: "#828282" }}>
          {user.lastLoginAt
            ? new Intl.DateTimeFormat("es-CO", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(user.lastLoginAt))
            : "Nunca"}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-2 items-center">
          <select
            value={user.role}
            onChange={(e) => updateRole({ id: user.id, role: e.target.value })}
            disabled={updatingRole}
            className="text-xs rounded px-2 py-1 outline-none"
            style={{ background: "#2d2d2d", color: "#e0e0e0", border: "1px solid #3d3d3d" }}
          >
            <option value="Viewer">Viewer</option>
            <option value="Editor">Editor</option>
            <option value="SuperAdmin">Super Admin</option>
          </select>
          <button
            onClick={() => toggleStatus({ id: user.id, isActive: !user.isActive })}
            disabled={togglingStatus}
            className="text-xs px-2 py-1 rounded hover:opacity-80 transition-opacity disabled:opacity-40"
            style={{ background: user.isActive ? "#eb5757" : "#27ae60", color: "white" }}
          >
            {user.isActive ? "Desactivar" : "Activar"}
          </button>
        </div>
      </td>
    </tr>
  );
}

function InviteModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("Editor");
  const { mutate: invite, isPending } = useInviteUser();

  function handleInvite() {
    invite({ email, firstName, lastName, role }, { onSuccess: onClose });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.7)" }}>
      <div className="flex flex-col gap-4 p-6 rounded-xl w-[420px]" style={{ background: "#181818", border: "1px solid #2d2d2d" }}>
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-white">Invitar usuario</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-white/10">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#bdbdbd" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {[
            { label: "Email", value: email, set: setEmail, type: "email", placeholder: "usuario@entidad.gov.co" },
            { label: "Nombre", value: firstName, set: setFirstName, type: "text", placeholder: "Juan" },
            { label: "Apellido", value: lastName, set: setLastName, type: "text", placeholder: "Pérez" },
          ].map(({ label, value, set, type, placeholder }) => (
            <div key={label} className="flex flex-col gap-1.5">
              <label className="text-xs font-medium" style={{ color: "#bdbdbd" }}>{label}</label>
              <input
                type={type}
                value={value}
                onChange={(e) => set(e.target.value)}
                className="px-3 py-2 rounded-lg text-sm outline-none"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid #2d2d2d", color: "#e0e0e0" }}
                placeholder={placeholder}
              />
            </div>
          ))}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium" style={{ color: "#bdbdbd" }}>Rol</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm outline-none"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid #2d2d2d", color: "#e0e0e0" }}
            >
              <option value="Viewer">Viewer — Solo lectura</option>
              <option value="Editor">Editor — Puede editar contenido</option>
              <option value="SuperAdmin">Super Admin — Acceso total</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm hover:bg-white/10 border" style={{ borderColor: "#2d2d2d", color: "#e0e0e0" }}>
            Cancelar
          </button>
          <button
            onClick={handleInvite}
            disabled={!email || !firstName || !lastName || isPending}
            className="flex gap-2 items-center px-4 py-2 rounded-lg text-sm text-white font-medium hover:opacity-90 disabled:opacity-40"
            style={{ background: "#2d9cdb" }}
          >
            {isPending ? <><Spinner size="sm" /> Invitando...</> : "Invitar"}
          </button>
        </div>
      </div>
    </div>
  );
}

function UsersPanel() {
  const { data: users, isLoading, error, refetch } = useAdminUsers();
  const [showInvite, setShowInvite] = useState(false);

  if (isLoading) return <div className="flex justify-center py-6"><Spinner /></div>;
  if (error) return (
    <div className="flex flex-col items-center gap-3 py-6 text-center">
      <p className="text-[#eb5757] text-sm">Error al cargar usuarios</p>
      <Button variant="secondary" size="sm" onClick={() => refetch()}>Reintentar</Button>
    </div>
  );

  return (
    <div className="flex flex-col gap-0">
      <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: "#2d2d2d" }}>
        <span className="text-sm font-medium text-white">{users?.length ?? 0} usuarios</span>
        <button
          onClick={() => setShowInvite(true)}
          className="flex gap-2 items-center px-3 py-1.5 rounded-lg text-sm font-medium text-white hover:opacity-90"
          style={{ background: "#2d9cdb" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Invitar usuario
        </button>
      </div>

      {users?.length === 0 ? (
        <p className="text-[#4f4f4f] text-sm text-center py-8">No hay usuarios administradores.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ borderBottom: "1px solid #2d2d2d" }}>
                {["Usuario", "Rol", "Estado", "Último acceso", "Acciones"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wide" style={{ color: "#828282" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users?.map((u) => <UserRow key={u.id} user={u} />)}
            </tbody>
          </table>
        </div>
      )}

      {showInvite && <InviteModal onClose={() => setShowInvite(false)} />}
    </div>
  );
}

// ── Idiomas panel ─────────────────────────────────────────────────────────────
const LANGUAGES = [
  { id: 1, code: "es", name: "Español", flag: "🇨🇴", default: true },
  { id: 2, code: "en", name: "English", flag: "🇺🇸", default: false },
];

function LanguagesPanel() {
  return (
    <div className="flex flex-col gap-3 p-4">
      <p className="text-xs text-[#828282]">Idiomas disponibles en el portal ciudadano.</p>
      <div className="flex flex-col gap-2">
        {LANGUAGES.map((lang) => (
          <div
            key={lang.id}
            className="flex items-center gap-3 px-4 py-3 rounded-lg"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid #2d2d2d" }}
          >
            <span className="text-xl">{lang.flag}</span>
            <span className="text-sm font-medium text-white flex-1">{lang.name}</span>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: lang.default ? "#003DA6" : "#333", color: "white" }}>
              {lang.default ? "Por defecto" : "Activo"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── ECM connections panel ─────────────────────────────────────────────────────
function EcmPanel() {
  const { data: config, isLoading } = useSystemConfig();
  if (isLoading) return <div className="flex justify-center py-6"><Spinner size="sm" /></div>;

  const connections = [
    { label: "Auth API", key: "ecm.auth.url", icon: "🔐" },
    { label: "Electronic Office", key: "ecm.eo.url", icon: "🏛️" },
    { label: "PQRS Service", key: "ecm.pqrs.url", icon: "📋" },
    { label: "BPM BackOffice", key: "ecm.bpm.url", icon: "⚙️" },
  ];

  return (
    <div className="flex flex-col gap-3 p-4">
      <p className="text-xs text-[#828282]">URLs de los servicios ECM configurados en el wizard de instalación.</p>
      <div className="flex flex-col gap-2">
        {connections.map((conn) => {
          const url = config?.find((c) => c.key === conn.key)?.value ?? "";
          return (
            <div
              key={conn.key}
              className="flex items-center gap-3 px-4 py-3 rounded-lg"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid #2d2d2d" }}
            >
              <span className="text-lg">{conn.icon}</span>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-sm font-medium text-white">{conn.label}</span>
                <span className="text-xs truncate" style={{ color: url ? "#27ae60" : "#828282" }}>
                  {url || "No configurado"}
                </span>
              </div>
              <div
                className="size-2 rounded-full shrink-0"
                style={{ background: url ? "#27ae60" : "#eb5757" }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
type ConfigTab = "entidad" | "usuarios" | "idiomas" | "conexiones";

const TABS: { id: ConfigTab; label: string; icon: React.ReactNode }[] = [
  {
    id: "entidad",
    label: "Entidad",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    id: "usuarios",
    label: "Usuarios",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    id: "idiomas",
    label: "Idiomas",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    id: "conexiones",
    label: "ECM",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
      </svg>
    ),
  },
];

export default function ConfiguracionPage() {
  const [activeTab, setActiveTab] = useState<ConfigTab>("entidad");

  return (
    <>
      <div
        className="flex items-center justify-between px-6 py-2 w-full shrink-0"
        style={{ background: "#181818", borderBottom: "1px solid #2d2d2d" }}
      >
        <h1 className="font-medium text-lg text-white">Configuraciones</h1>
      </div>

      <div className="flex w-full relative flex-1 overflow-hidden" style={{ background: "black" }}>
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="cfg-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cfg-grid)" />
          </svg>
        </div>

        <div className="relative flex gap-6 p-6 w-full overflow-auto">
          {/* Left nav */}
          <div
            className="flex flex-col w-[200px] shrink-0 rounded-lg overflow-hidden border h-fit"
            style={{ background: "#181818", borderColor: "#2d2d2d" }}
          >
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex gap-3 items-center px-4 py-3 text-left transition-colors hover:bg-white/5"
                style={{
                  background: activeTab === tab.id ? "rgba(45,156,219,0.12)" : "transparent",
                  borderLeft: activeTab === tab.id ? "2px solid #2d9cdb" : "2px solid transparent",
                  color: activeTab === tab.id ? "white" : "#bdbdbd",
                }}
              >
                {tab.icon}
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Content panel */}
          <div
            className="flex-1 rounded-lg overflow-hidden border"
            style={{ background: "#181818", borderColor: "#2d2d2d" }}
          >
            <div className="px-4 py-3 border-b" style={{ borderColor: "#2d2d2d" }}>
              <h2 className="font-medium text-sm text-white">
                {TABS.find((t) => t.id === activeTab)?.label}
              </h2>
            </div>

            {activeTab === "entidad" && <SystemConfigPanel />}
            {activeTab === "usuarios" && <UsersPanel />}
            {activeTab === "idiomas" && <LanguagesPanel />}
            {activeTab === "conexiones" && <EcmPanel />}
          </div>
        </div>
      </div>
    </>
  );
}
