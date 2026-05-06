"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { completeSetup } from "@/lib/setup.service";
import type { WizardData } from "@/types/setup.types";

const DB_LABELS: Record<string, string> = {
  PostgreSQL: "PostgreSQL",
  Oracle: "Oracle",
  SqlServer: "SQL Server",
};

interface Props {
  data: WizardData;
  onBack: () => void;
  onDone: (entidadNombre: string) => void;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-[#2d2d2d] last:border-0">
      <span className="text-[#828282] text-sm shrink-0">{label}</span>
      <span className="text-[#e0e0e0] text-sm text-right break-all">{value}</span>
    </div>
  );
}

function SummaryCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#181818] border border-[#2d2d2d] rounded-xl p-4">
      <p className="text-xs font-semibold text-[#828282] uppercase tracking-widest mb-1">{title}</p>
      {children}
    </div>
  );
}

export function StepConfirm({ data, onBack, onDone }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleInstall() {
    setLoading(true);
    setError("");
    try {
      await completeSetup(data.apiUrl, {
        databaseProvider: data.database.provider,
        connectionString: data.database.connectionString,
        ecmApis: data.ecm,
        entidadNombre: data.entidad.nombre,
        entidadNit: data.entidad.nit,
        admin: {
          userName: data.admin.userName,
          password: data.admin.password,
          email: data.admin.email,
          firstName: data.admin.firstName || undefined,
          lastName: data.admin.lastName || undefined,
        },
      });
      onDone(data.entidad.nombre);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error durante la instalación");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <p className="text-[#bdbdbd] text-sm leading-relaxed">
        Revise la configuración antes de instalar. Una vez iniciado el proceso,
        se aplicarán las migraciones y se creará el usuario administrador.
      </p>

      <SummaryCard title="Backend">
        <Row label="URL del API" value={data.apiUrl} />
      </SummaryCard>

      <SummaryCard title="Base de datos">
        <Row label="Motor" value={DB_LABELS[data.database.provider]} />
        <Row label="Cadena de conexión" value={data.database.connectionString} />
      </SummaryCard>

      <SummaryCard title="APIs ECM">
        {data.ecm.useEcm ? (
          <>
            <Row label="Auth" value={data.ecm.authUrl} />
            <Row label="Electronic Office" value={data.ecm.electronicOfficeUrl} />
            <Row label="PQRS" value={data.ecm.pqrsUrl} />
            <Row label="BPM" value={data.ecm.bpmUrl} />
            <Row label="Cuenta de servicio" value={data.ecm.serviceAccountUser} />
            <Row label="Contraseña" value="••••••••" />
          </>
        ) : (
          <p className="text-sm text-[#4f4f4f] py-2">Desactivadas — no se configurarán integraciones ECM.</p>
        )}
      </SummaryCard>

      <SummaryCard title="Entidad & Administrador">
        <Row label="Entidad" value={data.entidad.nombre} />
        <Row label="NIT" value={data.entidad.nit} />
        <Row label="Usuario admin" value={data.admin.userName} />
        <Row label="Correo admin" value={data.admin.email} />
        <Row label="Contraseña admin" value="••••••••" />
      </SummaryCard>

      {error && (
        <div className="flex items-start gap-3 bg-[#eb5757]/10 border border-[#eb5757]/30 rounded-lg p-4">
          <AlertCircle size={18} className="text-[#eb5757] shrink-0 mt-0.5" />
          <p className="text-[#eb5757] text-sm">{error}</p>
        </div>
      )}

      <div className="flex justify-between pt-2">
        <Button variant="ghost" onClick={onBack} disabled={loading}>Anterior</Button>
        <Button variant="brand" onClick={handleInstall} disabled={loading}>
          {loading ? (
            <>
              <Spinner size="sm" />
              Instalando…
            </>
          ) : (
            "Instalar sistema"
          )}
        </Button>
      </div>
    </div>
  );
}
