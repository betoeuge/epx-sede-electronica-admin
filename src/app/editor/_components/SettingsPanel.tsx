"use client";

import { useState, useEffect } from "react";
import { useUpdateSite } from "@/hooks/useSites";
import type { SiteResponse, UpdateSiteRequest } from "@/types/sites.types";

type SettingsTab = "general" | "dominio" | "seo" | "analiticas" | "integraciones";

interface EcmApisStatus {
  authUrl: string;
  electronicOfficeUrl: string;
  pqrsUrl: string;
  bpmUrl: string;
  serviceAccountUser: string;
}

interface SetupStatus {
  isInstalled: boolean;
  installedAt?: string;
  entidadNombre?: string;
  entidadNit?: string;
  ecmApis?: EcmApisStatus;
}

const ACCENT_COLORS = [
  "#94bb5f", "#bf363b", "#d19d4d", "#e87148",
  "#415998", "#464289", "#2d9cdb", "#27ae60",
  "#9b59b6", "#e74c3c", "#1abc9c", "#f39c12",
];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-xs font-medium" style={{ color: "#bdbdbd" }}>{label}</label>
      {children}
    </div>
  );
}

function Input({
  value, onChange, placeholder, type = "text",
}: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="px-3 py-2 rounded-lg text-sm outline-none focus:border-[#2d9cdb] transition-colors w-full"
      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid #2d2d2d", color: "#e0e0e0" }}
    />
  );
}

function SectionHeader({ title, onSave, saving }: { title: string; onSave?: () => void; saving?: boolean }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="font-semibold text-base text-white">{title}</h2>
      {onSave && (
        <button
          onClick={onSave}
          disabled={saving}
          className="px-4 py-1.5 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50"
          style={{ background: "#2d9cdb" }}
        >
          {saving ? "Guardando..." : "Guardar"}
        </button>
      )}
    </div>
  );
}

function ImageUploadBox({ label, size, dark = false }: { label: string; size: string; dark?: boolean }) {
  return (
    <div className="flex flex-col gap-2 items-center">
      <div
        className="flex flex-col items-center justify-center rounded-lg cursor-pointer hover:border-[#2d9cdb]/60 transition-colors"
        style={{
          width: "140px", height: "100px",
          background: dark ? "#111" : "rgba(255,255,255,0.04)",
          border: "1px dashed #2d2d2d",
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4f4f4f" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      </div>
      <button
        className="px-4 py-1.5 rounded text-xs font-medium text-[#e0e0e0] hover:bg-white/10 transition-colors border"
        style={{ background: "rgba(255,255,255,0.06)", borderColor: "#2d2d2d" }}
      >
        Subir
      </button>
      <span className="text-xs" style={{ color: "#4f4f4f" }}>{label}</span>
    </div>
  );
}

function GeneralTab({ site, onSaved }: { site: SiteResponse; onSaved: () => void }) {
  const [name, setName] = useState(site.name);
  const [description, setDescription] = useState(site.description ?? "");
  const [language, setLanguage] = useState("es");
  const [accentColor, setAccentColor] = useState(site.accentColor ?? "#2d9cdb");
  const [gaId, setGaId] = useState("");
  const [savingMain, setSavingMain] = useState(false);
  const [savingGa, setSavingGa] = useState(false);
  const [setupStatus, setSetupStatus] = useState<SetupStatus | null>(null);

  const { mutateAsync: updateSite } = useUpdateSite();

  useEffect(() => {
    fetch("/api/proxy?_path=" + encodeURIComponent("/api/v1/setup/status"))
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setSetupStatus(d))
      .catch(() => {});
  }, []);

  async function handleSaveMain() {
    setSavingMain(true);
    try {
      const payload: UpdateSiteRequest = { name, description: description || undefined, accentColor };
      await updateSite({ id: site.id, data: payload });
      onSaved();
    } finally {
      setSavingMain(false);
    }
  }

  async function handleSaveGa() {
    setSavingGa(true);
    await new Promise((r) => setTimeout(r, 600));
    setSavingGa(false);
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Entity info — read-only from setup */}
      {setupStatus?.entidadNombre && (
        <div className="flex flex-col gap-3 p-5 rounded-xl" style={{ background: "#181818", border: "1px solid #2d2d2d" }}>
          <div className="flex items-center gap-2 mb-1">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2d9cdb" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span className="text-sm font-semibold text-white">Información de la entidad</span>
            <span className="ml-auto text-xs px-2 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.06)", color: "#4f4f4f" }}>Configurado en Setup</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-xs" style={{ color: "#828282" }}>Nombre de la entidad</span>
              <span className="text-sm px-3 py-2 rounded-lg" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid #2d2d2d", color: "#e0e0e0" }}>
                {setupStatus.entidadNombre}
              </span>
            </div>
            {setupStatus.entidadNit && (
              <div className="flex flex-col gap-1">
                <span className="text-xs" style={{ color: "#828282" }}>NIT</span>
                <span className="text-sm px-3 py-2 rounded-lg" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid #2d2d2d", color: "#e0e0e0" }}>
                  {setupStatus.entidadNit}
                </span>
              </div>
            )}
          </div>
          <p className="text-xs" style={{ color: "#4f4f4f" }}>
            Para modificar estos datos, ejecuta nuevamente el asistente de configuración inicial.
          </p>
        </div>
      )}

      {/* Main config */}
      <div className="flex flex-col gap-5 p-6 rounded-xl" style={{ background: "#181818", border: "1px solid #2d2d2d" }}>
        <SectionHeader title="Configuraciones del Sitio" onSave={handleSaveMain} saving={savingMain} />

        <div className="grid grid-cols-2 gap-4">
          <Field label="Título">
            <Input value={name} onChange={setName} placeholder="Mi Evolution Site" />
          </Field>
          <Field label="Lenguaje del Sitio">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm outline-none transition-colors"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid #2d2d2d", color: "#e0e0e0" }}
            >
              <option value="es">Español</option>
              <option value="en">English</option>
              <option value="pt">Português</option>
              <option value="fr">Français</option>
            </select>
          </Field>
        </div>

        <Field label="Descripción">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Describe tu sitio web..."
            className="px-3 py-2 rounded-lg text-sm outline-none resize-none"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid #2d2d2d", color: "#e0e0e0" }}
          />
        </Field>

        {/* Color accent */}
        <Field label="Color de Acento">
          <div className="flex gap-2 flex-wrap">
            {ACCENT_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setAccentColor(c)}
                className="rounded-full size-7 transition-transform hover:scale-110"
                style={{
                  background: c,
                  outline: accentColor === c ? `2px solid white` : "none",
                  outlineOffset: "2px",
                }}
              />
            ))}
            <label
              className="rounded-full size-7 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform border"
              style={{ borderColor: "#2d2d2d", background: accentColor }}
              title="Color personalizado"
            >
              <input
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="opacity-0 absolute w-0 h-0"
              />
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </label>
          </div>
        </Field>
      </div>

      {/* Images */}
      <div className="flex flex-col gap-5 p-6 rounded-xl" style={{ background: "#181818", border: "1px solid #2d2d2d" }}>
        <SectionHeader title="Imágenes del Sitio" />

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-white">Favicon</p>
            <p className="text-xs" style={{ color: "#828282" }}>64 × 64 px</p>
            <div className="flex gap-6">
              <ImageUploadBox label="Light" size="64x64" />
              <ImageUploadBox label="Dark" size="64x64" dark />
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <p className="text-sm font-medium text-white">Social Preview</p>
            <p className="text-xs" style={{ color: "#828282" }}>1200 × 630 px</p>
            <div
              className="flex flex-col items-center justify-center rounded-lg cursor-pointer hover:border-[#2d9cdb]/60 transition-colors"
              style={{ height: "140px", background: "rgba(255,255,255,0.04)", border: "1px dashed #2d2d2d" }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4f4f4f" strokeWidth="1.5">
                <polyline points="16 16 12 12 8 16" />
                <line x1="12" y1="12" x2="12" y2="21" />
                <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
              </svg>
              <p className="text-xs mt-2" style={{ color: "#4f4f4f" }}>Arrastra una imagen o haz clic para subir</p>
              <button
                className="mt-3 px-4 py-1.5 rounded text-xs font-medium text-[#e0e0e0] hover:bg-white/10 transition-colors border"
                style={{ background: "rgba(255,255,255,0.06)", borderColor: "#2d2d2d" }}
              >
                Subir
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Google Analytics */}
      <div className="flex flex-col gap-5 p-6 rounded-xl" style={{ background: "#181818", border: "1px solid #2d2d2d" }}>
        <SectionHeader title="Google Analytics" onSave={handleSaveGa} saving={savingGa} />

        <div
          className="flex gap-2 p-3 rounded-lg text-xs leading-relaxed"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid #2d2d2d", color: "#828282" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f2994a" strokeWidth="2" className="shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          Integra directamente Google Analytics en tu sitio de Framer. Ten en cuenta que, como propietario del sitio, eres responsable de asegurarte de que tu sitio gestione los datos de manera acorde con las leyes de privacidad, como el GDPR.
        </div>

        <Field label="ID de Medición">
          <Input value={gaId} onChange={setGaId} placeholder="G-XXXXXXXXXX" />
        </Field>
      </div>
    </div>
  );
}

function DominioTab() {
  const [domain, setDomain] = useState("");

  function copy(text: string) {
    navigator.clipboard.writeText(text).catch(() => {});
  }

  return (
    <div className="flex flex-col gap-5 p-6 rounded-xl" style={{ background: "#181818", border: "1px solid #2d2d2d" }}>
      <div className="flex flex-col gap-1">
        <h2 className="font-semibold text-base text-white">Dominio Personalizado</h2>
        <p className="text-sm" style={{ color: "#828282" }}>Conecta tu propio dominio a este sitio</p>
      </div>

      <Field label="Dominio principal">
        <div className="flex items-center rounded-lg overflow-hidden" style={{ border: "1px solid #2d2d2d" }}>
          <span className="px-3 py-2 text-sm shrink-0" style={{ background: "rgba(255,255,255,0.04)", color: "#828282", borderRight: "1px solid #2d2d2d" }}>
            https://
          </span>
          <input
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="dominio.com"
            className="flex-1 px-3 py-2 text-sm bg-transparent outline-none"
            style={{ color: "#e0e0e0" }}
          />
        </div>
      </Field>

      <div
        className="text-xs px-3 py-2 rounded-lg"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid #2d2d2d", color: "#828282" }}
      >
        El dominio debe apuntar a nuestros servidores con un registro CNAME o A.
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium" style={{ color: "#bdbdbd" }}>Registro DNS requeridos</p>
        <div className="rounded-lg overflow-hidden" style={{ border: "1px solid #2d2d2d" }}>
          {[
            { type: "A", name: "@", value: "76.76.21.21" },
            { type: "CNAME", name: "www", value: "cname.evolution.app" },
          ].map((rec) => (
            <div
              key={rec.type}
              className="flex items-center gap-4 px-4 py-3"
              style={{ borderBottom: "1px solid #2d2d2d" }}
            >
              <span className="text-xs font-mono font-semibold text-white w-14">{rec.type}</span>
              <span className="text-xs font-mono w-10" style={{ color: "#828282" }}>{rec.name}</span>
              <span className="text-xs font-mono flex-1" style={{ color: "#bdbdbd" }}>{rec.value}</span>
              <button
                onClick={() => copy(rec.value)}
                className="p-1.5 rounded hover:bg-white/10 transition-colors"
                title="Copiar"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#828282" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {domain && (
        <div className="flex gap-2 items-center">
          <div className="size-2 rounded-full" style={{ background: "#27ae60" }} />
          <span className="text-xs" style={{ color: "#27ae60" }}>SSL activo — certificado válido hasta Nov 2026</span>
        </div>
      )}

      {domain && (
        <button
          className="px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity self-start"
          style={{ background: "#2d9cdb" }}
        >
          Conectar Dominio
        </button>
      )}
    </div>
  );
}

function SeoTab() {
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [keywords, setKeywords] = useState("");

  return (
    <div className="flex flex-col gap-5 p-6 rounded-xl" style={{ background: "#181818", border: "1px solid #2d2d2d" }}>
      <SectionHeader title="SEO" />

      <Field label="Meta Título">
        <Input value={metaTitle} onChange={setMetaTitle} placeholder="Título para motores de búsqueda" />
      </Field>
      <Field label="Meta Descripción">
        <textarea
          value={metaDesc}
          onChange={(e) => setMetaDesc(e.target.value)}
          rows={3}
          placeholder="Descripción breve para resultados de búsqueda (máx. 160 caracteres)"
          className="px-3 py-2 rounded-lg text-sm outline-none resize-none"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid #2d2d2d", color: "#e0e0e0" }}
        />
        <p className="text-xs mt-1 text-right" style={{ color: "#4f4f4f" }}>{metaDesc.length}/160</p>
      </Field>
      <Field label="Palabras Clave">
        <Input value={keywords} onChange={setKeywords} placeholder="ej: gobierno, trámites, servicios" />
      </Field>

      <button
        className="px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity self-start"
        style={{ background: "#2d9cdb" }}
      >
        Guardar SEO
      </button>
    </div>
  );
}

function AnaliticasTab() {
  return (
    <div className="flex flex-col gap-5 p-6 rounded-xl" style={{ background: "#181818", border: "1px solid #2d2d2d" }}>
      <SectionHeader title="Analíticas" />
      <div className="flex flex-col gap-3">
        {[
          { label: "Visitas totales", value: "—" },
          { label: "Visitantes únicos", value: "—" },
          { label: "Tiempo promedio en sitio", value: "—" },
          { label: "Tasa de rebote", value: "—" },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="flex items-center justify-between px-4 py-3 rounded-lg"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid #2d2d2d" }}
          >
            <span className="text-sm" style={{ color: "#bdbdbd" }}>{label}</span>
            <span className="text-sm font-medium text-white">{value}</span>
          </div>
        ))}
      </div>
      <p className="text-xs" style={{ color: "#4f4f4f" }}>
        Conecta Google Analytics en la pestaña General para ver métricas reales.
      </p>
    </div>
  );
}

function IntegracionesTab() {
  const [setupStatus, setSetupStatus] = useState<SetupStatus | null>(null);
  const [authUrl, setAuthUrl] = useState("");
  const [officeUrl, setOfficeUrl] = useState("");
  const [pqrsUrl, setPqrsUrl] = useState("");
  const [bpmUrl, setBpmUrl] = useState("");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/proxy?_path=" + encodeURIComponent("/api/v1/setup/status"))
      .then((r) => (r.ok ? r.json() : null))
      .then((d: SetupStatus | null) => {
        if (!d) return;
        setSetupStatus(d);
        if (d.ecmApis) {
          setAuthUrl(d.ecmApis.authUrl ?? "");
          setOfficeUrl(d.ecmApis.electronicOfficeUrl ?? "");
          setPqrsUrl(d.ecmApis.pqrsUrl ?? "");
          setBpmUrl(d.ecmApis.bpmUrl ?? "");
          setUser(d.ecmApis.serviceAccountUser ?? "");
        }
      })
      .catch(() => {});
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/proxy?_path=" + encodeURIComponent("/api/v1/setup/configure-ecm"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authUrl,
          electronicOfficeUrl: officeUrl,
          pqrsUrl,
          bpmUrl,
          serviceAccountUser: user,
          serviceAccountPassword: password,
        }),
      });
      if (res.ok) setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  const ecmFields: { label: string; value: string; set: (v: string) => void; placeholder: string; type?: string }[] = [
    { label: "URL Autenticación (Auth)", value: authUrl, set: setAuthUrl, placeholder: "https://auth.example.gov.co" },
    { label: "URL Sede Electrónica", value: officeUrl, set: setOfficeUrl, placeholder: "https://sede.example.gov.co" },
    { label: "URL PQRS", value: pqrsUrl, set: setPqrsUrl, placeholder: "https://pqrs.example.gov.co" },
    { label: "URL BPM / Trámites", value: bpmUrl, set: setBpmUrl, placeholder: "https://bpm.example.gov.co" },
    { label: "Usuario cuenta de servicio", value: user, set: setUser, placeholder: "service@entidad.gov.co" },
    { label: "Contraseña cuenta de servicio", value: password, set: setPassword, placeholder: "••••••••", type: "password" },
  ];

  return (
    <div className="flex flex-col gap-5 p-6 rounded-xl" style={{ background: "#181818", border: "1px solid #2d2d2d" }}>
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="font-semibold text-base text-white">Integración ECM</h2>
          <p className="text-xs mt-1" style={{ color: "#828282" }}>
            URLs de los servicios externos de la plataforma ECM
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-1.5 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50"
          style={{ background: "#2d9cdb" }}
        >
          {saving ? "Guardando..." : "Guardar"}
        </button>
      </div>

      {saved && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs" style={{ background: "rgba(39,174,96,0.12)", border: "1px solid rgba(39,174,96,0.3)", color: "#27ae60" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Configuración ECM guardada correctamente
        </div>
      )}

      <div className="flex flex-col gap-4">
        {ecmFields.map(({ label, value, set, placeholder, type }) => (
          <div key={label} className="flex flex-col gap-1.5">
            <label className="text-xs font-medium" style={{ color: "#bdbdbd" }}>{label}</label>
            <input
              type={type ?? "text"}
              value={value}
              onChange={(e) => { set(e.target.value); setSaved(false); }}
              placeholder={placeholder}
              className="px-3 py-2 rounded-lg text-sm outline-none focus:border-[#2d9cdb] transition-colors w-full"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid #2d2d2d", color: "#e0e0e0" }}
            />
          </div>
        ))}
      </div>

      <div className="flex gap-2 p-3 rounded-lg text-xs leading-relaxed mt-1" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid #2d2d2d", color: "#828282" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f2994a" strokeWidth="2" className="shrink-0 mt-0.5">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        La contraseña solo se actualiza si se escribe un nuevo valor. Déjala vacía para mantener la contraseña actual.
      </div>
    </div>
  );
}

interface SettingsPanelProps {
  site: SiteResponse;
  onSaved: () => void;
}

const NAV_ITEMS: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
  {
    id: "general",
    label: "General",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
  {
    id: "dominio",
    label: "Dominio",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    id: "seo",
    label: "SEO",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    id: "analiticas",
    label: "Analíticas",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    id: "integraciones",
    label: "Integraciones",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
  },
];

export function SettingsPanel({ site, onSaved }: SettingsPanelProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");

  return (
    <div className="flex h-full flex-1 overflow-hidden">
      {/* Settings sidebar nav */}
      <div
        className="flex flex-col shrink-0 h-full overflow-y-auto"
        style={{ width: "200px", background: "#181818", borderRight: "1px solid #2d2d2d" }}
      >
        <div className="px-4 py-3 shrink-0" style={{ borderBottom: "1px solid #2d2d2d" }}>
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#4f4f4f" }}>
            Configuración
          </span>
        </div>
        <nav className="flex flex-col gap-0.5 p-2">
          {NAV_ITEMS.map(({ id, label, icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className="flex gap-2.5 items-center px-3 py-2.5 rounded-lg transition-colors text-left w-full"
                style={{
                  background: active ? "rgba(255,255,255,0.12)" : "transparent",
                  color: active ? "white" : "#bdbdbd",
                }}
              >
                {icon}
                <span className="text-sm font-medium">{label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Settings content */}
      <div className="flex flex-col flex-1 overflow-y-auto p-8" style={{ background: "black" }}>
        <div className="max-w-[700px] w-full mx-auto">
          {activeTab === "general" && <GeneralTab site={site} onSaved={onSaved} />}
          {activeTab === "dominio" && <DominioTab />}
          {activeTab === "seo" && <SeoTab />}
          {activeTab === "analiticas" && <AnaliticasTab />}
          {activeTab === "integraciones" && <IntegracionesTab />}
        </div>
      </div>
    </div>
  );
}
