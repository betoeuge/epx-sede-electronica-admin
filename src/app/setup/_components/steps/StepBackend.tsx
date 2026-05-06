"use client";

import { useState } from "react";
import { Globe, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { getSetupStatus } from "@/lib/setup.service";

interface Props {
  apiUrl: string;
  onNext: (apiUrl: string) => void;
}

type Status = "idle" | "loading" | "ok" | "installed" | "error";

export function StepBackend({ apiUrl: initialUrl, onNext }: Props) {
  const [url, setUrl] = useState(initialUrl);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleVerify() {
    const trimmed = url.trim().replace(/\/$/, "");
    if (!trimmed) return;
    setStatus("loading");
    setErrorMsg("");
    try {
      const data = await getSetupStatus(trimmed);
      if (data.isInstalled) {
        document.cookie = "sede_installed=true; path=/; max-age=31536000; SameSite=Strict";
      }
      setStatus(data.isInstalled ? "installed" : "ok");
    } catch (e) {
      setStatus("error");
      setErrorMsg(e instanceof Error ? e.message : "No se pudo conectar");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <p className="text-[#bdbdbd] text-sm leading-relaxed">
          Ingrese la URL base donde está desplegado el backend de la Sede Electrónica.
          Se verificará la conectividad antes de continuar.
        </p>
      </div>

      <div className="flex gap-3 items-end">
        <Input
          label="URL del backend"
          placeholder="https://api.mientidad.gov.co"
          value={url}
          onChange={(e) => { setUrl(e.target.value); setStatus("idle"); }}
          hint="Sin barra final. Ej: https://api.entidad.gov.co"
          error={status === "error" ? errorMsg : undefined}
          className="flex-1"
          type="url"
          onKeyDown={(e) => e.key === "Enter" && handleVerify()}
        />
        <Button
          variant="secondary"
          onClick={handleVerify}
          disabled={!url.trim() || status === "loading"}
          className="shrink-0 mb-[22px]"
        >
          {status === "loading" ? <Spinner size="sm" /> : <Globe size={15} />}
          Verificar
        </Button>
      </div>

      {status === "ok" && (
        <div className="flex items-center gap-2 text-[#27ae60] text-sm">
          <CheckCircle size={16} />
          Conexión exitosa — el sistema aún no está instalado.
        </div>
      )}

      {status === "installed" && (
        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-3 bg-[#F0A500]/10 border border-[#F0A500]/30 rounded-lg p-4">
            <XCircle size={18} className="text-[#F0A500] shrink-0 mt-0.5" />
            <div>
              <p className="text-[#F0A500] text-sm font-medium">El sistema ya está instalado</p>
              <p className="text-[#bdbdbd] text-xs mt-1">
                Este backend ya fue configurado. Si necesita reinstalar, elimine el archivo de
                configuración en el servidor y reinicie el servicio.
              </p>
            </div>
          </div>
          <div className="flex justify-end">
            <Button variant="brand" onClick={() => {
              document.cookie = "sede_token=; path=/; max-age=0; SameSite=Lax";
              localStorage.removeItem("sede_token");
              localStorage.removeItem("sede_refresh_token");
              window.location.href = "/login";
            }}>
              Ir al inicio de sesión
            </Button>
          </div>
        </div>
      )}

      <div className="flex justify-end pt-2">
        <Button
          variant="brand"
          onClick={() => onNext(url.trim().replace(/\/$/, ""))}
          disabled={status !== "ok"}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}
