"use client";

import { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Spinner } from "@/components/ui/Spinner";
import { testConnection } from "@/lib/setup.service";
import type { DatabaseProvider, WizardData } from "@/types/setup.types";
import { cn } from "@/lib/utils";

const PROVIDERS: { value: DatabaseProvider; label: string; desc: string; bg: string; badge: string }[] = [
  { value: "PostgreSQL", label: "PostgreSQL", desc: "Open source · v14+",  bg: "#336791", badge: "PG"  },
  { value: "SqlServer",  label: "SQL Server",  desc: "Microsoft · 2019+", bg: "#0078D4", badge: "MS"  },
  { value: "Oracle",     label: "Oracle",      desc: "Oracle DB · 19c+",  bg: "#C74634", badge: "ORA" },
];

const DEFAULTS: Record<DatabaseProvider, Record<string, string>> = {
  PostgreSQL: { host: "localhost", port: "5432",  database: "sede_electronica", username: "postgres", password: "", sslMode: "Prefer" },
  SqlServer:  { server: "localhost", port: "1433", database: "SedeElectronica", username: "",          password: "" },
  Oracle:     { host: "localhost", port: "1521",  serviceName: "ORCL",          username: "",          password: "" },
};

function buildConnStr(provider: DatabaseProvider, f: Record<string, string>): string {
  switch (provider) {
    case "PostgreSQL":
      return `Host=${f.host};Port=${f.port};Database=${f.database};Username=${f.username};Password=${f.password};SSL Mode=${f.sslMode}`;
    case "SqlServer":
      return `Server=${f.server},${f.port};Database=${f.database};User Id=${f.username};Password=${f.password};TrustServerCertificate=True`;
    case "Oracle":
      return `Data Source=${f.host}:${f.port}/${f.serviceName};User Id=${f.username};Password=${f.password}`;
  }
}

function canSubmit(provider: DatabaseProvider, f: Record<string, string>): boolean {
  switch (provider) {
    case "PostgreSQL": return !!(f.host && f.port && f.database && f.username);
    case "SqlServer":  return !!(f.server && f.port && f.database && f.username);
    case "Oracle":     return !!(f.host && f.port && f.serviceName && f.username);
  }
}

interface Props {
  data: WizardData["database"];
  apiUrl: string;
  onNext: (data: WizardData["database"]) => void;
  onBack: () => void;
}

type TestStatus = "idle" | "loading" | "ok" | "error";

export function StepDatabase({ data, apiUrl, onNext, onBack }: Props) {
  const [provider, setProvider] = useState<DatabaseProvider>(data.provider);
  const [fields, setFields] = useState<Record<string, string>>(
    data.fields && Object.keys(data.fields).length > 0 ? data.fields : DEFAULTS[data.provider],
  );
  const [testStatus, setTestStatus] = useState<TestStatus>(data.connectionTested ? "ok" : "idle");
  const [testError, setTestError] = useState("");

  function setField(key: string, val: string) {
    setFields((prev) => ({ ...prev, [key]: val }));
    setTestStatus("idle");
    setTestError("");
  }

  function handleProviderChange(p: DatabaseProvider) {
    setProvider(p);
    setFields(DEFAULTS[p]);
    setTestStatus("idle");
    setTestError("");
  }

  async function handleTest() {
    const connStr = buildConnStr(provider, fields);
    setTestStatus("loading");
    setTestError("");
    try {
      const res = await testConnection(apiUrl, { databaseProvider: provider, connectionString: connStr });
      setTestStatus(res.success ? "ok" : "error");
      if (!res.success) setTestError(res.error ?? "La conexión falló");
    } catch (e) {
      setTestStatus("error");
      setTestError(e instanceof Error ? e.message : "Error al probar la conexión");
    }
  }

  function handleNext() {
    onNext({
      provider,
      connectionString: buildConnStr(provider, fields),
      connectionTested: true,
      fields,
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-[#bdbdbd] text-sm leading-relaxed">
        Seleccione el motor de base de datos y complete los datos de conexión.
        Debe probar la conexión antes de continuar.
      </p>

      {/* Provider cards */}
      <div className="grid grid-cols-3 gap-3">
        {PROVIDERS.map((p) => (
          <button
            key={p.value}
            type="button"
            onClick={() => handleProviderChange(p.value)}
            className={cn(
              "flex flex-col items-center gap-2.5 p-4 rounded-xl border transition-all",
              provider === p.value
                ? "border-[#003DA6] bg-[#003DA6]/10"
                : "border-[#2d2d2d] bg-[#111] hover:border-[#444]",
            )}
          >
            <div
              className="size-10 rounded-lg flex items-center justify-center text-white text-[11px] font-bold tracking-wide"
              style={{ backgroundColor: p.bg }}
            >
              {p.badge}
            </div>
            <div className="text-center">
              <p className={cn("text-sm font-semibold", provider === p.value ? "text-white" : "text-[#bdbdbd]")}>
                {p.label}
              </p>
              <p className="text-[10px] text-[#828282] mt-0.5">{p.desc}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Connection fields */}
      <div className="border-t border-[#2d2d2d] pt-5 flex flex-col gap-4">
        {provider === "PostgreSQL" && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Host"
                value={fields.host ?? ""}
                onChange={(e) => setField("host", e.target.value)}
                placeholder="localhost"
              />
              <Input
                label="Puerto"
                value={fields.port ?? ""}
                onChange={(e) => setField("port", e.target.value)}
                placeholder="5432"
                type="number"
              />
            </div>
            <Input
              label="Base de datos"
              value={fields.database ?? ""}
              onChange={(e) => setField("database", e.target.value)}
              placeholder="sede_electronica"
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Usuario"
                value={fields.username ?? ""}
                onChange={(e) => setField("username", e.target.value)}
                placeholder="postgres"
              />
              <Input
                label="Contraseña"
                value={fields.password ?? ""}
                onChange={(e) => setField("password", e.target.value)}
                type="password"
                placeholder="••••••••"
              />
            </div>
            <Select
              label="Modo SSL"
              value={fields.sslMode ?? "Prefer"}
              onChange={(e) => setField("sslMode", e.target.value)}
              options={[
                { value: "Prefer",  label: "Prefer — usar SSL si el servidor lo soporta" },
                { value: "Require", label: "Require — SSL obligatorio" },
                { value: "Disable", label: "Disable — sin cifrado" },
              ]}
            />
          </>
        )}

        {provider === "SqlServer" && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Servidor"
                value={fields.server ?? ""}
                onChange={(e) => setField("server", e.target.value)}
                placeholder="localhost"
              />
              <Input
                label="Puerto"
                value={fields.port ?? ""}
                onChange={(e) => setField("port", e.target.value)}
                placeholder="1433"
                type="number"
              />
            </div>
            <Input
              label="Base de datos"
              value={fields.database ?? ""}
              onChange={(e) => setField("database", e.target.value)}
              placeholder="SedeElectronica"
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Usuario"
                value={fields.username ?? ""}
                onChange={(e) => setField("username", e.target.value)}
                placeholder="sa"
              />
              <Input
                label="Contraseña"
                value={fields.password ?? ""}
                onChange={(e) => setField("password", e.target.value)}
                type="password"
                placeholder="••••••••"
              />
            </div>
            <p className="text-[11px] text-[#828282]">
              TrustServerCertificate se habilita automáticamente para entornos de desarrollo.
            </p>
          </>
        )}

        {provider === "Oracle" && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Host"
                value={fields.host ?? ""}
                onChange={(e) => setField("host", e.target.value)}
                placeholder="localhost"
              />
              <Input
                label="Puerto"
                value={fields.port ?? ""}
                onChange={(e) => setField("port", e.target.value)}
                placeholder="1521"
                type="number"
              />
            </div>
            <Input
              label="Nombre del servicio / SID"
              value={fields.serviceName ?? ""}
              onChange={(e) => setField("serviceName", e.target.value)}
              placeholder="ORCL"
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Usuario"
                value={fields.username ?? ""}
                onChange={(e) => setField("username", e.target.value)}
                placeholder="sede"
              />
              <Input
                label="Contraseña"
                value={fields.password ?? ""}
                onChange={(e) => setField("password", e.target.value)}
                type="password"
                placeholder="••••••••"
              />
            </div>
          </>
        )}
      </div>

      {/* Test connection */}
      <div className="flex items-center gap-3">
        <Button
          variant="secondary"
          onClick={handleTest}
          disabled={!canSubmit(provider, fields) || testStatus === "loading"}
        >
          {testStatus === "loading" ? <Spinner size="sm" /> : null}
          Probar conexión
        </Button>

        {testStatus === "ok" && (
          <span className="flex items-center gap-1.5 text-[#27ae60] text-sm">
            <CheckCircle size={15} /> Conexión exitosa
          </span>
        )}
        {testStatus === "error" && (
          <span className="flex items-center gap-1.5 text-[#eb5757] text-sm">
            <XCircle size={15} /> {testError}
          </span>
        )}
      </div>

      <div className="flex justify-between pt-2">
        <Button variant="ghost" onClick={onBack}>Anterior</Button>
        <Button variant="brand" disabled={testStatus !== "ok"} onClick={handleNext}>
          Siguiente
        </Button>
      </div>
    </div>
  );
}
