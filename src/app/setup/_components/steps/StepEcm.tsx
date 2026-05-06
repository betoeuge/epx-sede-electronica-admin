"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Toggle } from "@/components/ui/Toggle";
import type { ConfigureEcmRequest, WizardData } from "@/types/setup.types";

interface Props {
  data: WizardData["ecm"];
  onNext: (data: WizardData["ecm"]) => void;
  onBack: () => void;
}

type Errors = Partial<Record<keyof ConfigureEcmRequest, string>>;

export function StepEcm({ data, onNext, onBack }: Props) {
  const [useEcm, setUseEcm] = useState(data.useEcm);
  const [form, setForm] = useState<ConfigureEcmRequest>({
    authUrl: data.authUrl,
    electronicOfficeUrl: data.electronicOfficeUrl,
    pqrsUrl: data.pqrsUrl,
    bpmUrl: data.bpmUrl,
    serviceAccountUser: data.serviceAccountUser,
    serviceAccountPassword: data.serviceAccountPassword,
  });
  const [errors, setErrors] = useState<Errors>({});

  function set(field: keyof ConfigureEcmRequest, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate(): boolean {
    if (!useEcm) return true;
    const e: Errors = {};
    if (!form.authUrl.trim()) e.authUrl = "Requerido";
    if (!form.electronicOfficeUrl.trim()) e.electronicOfficeUrl = "Requerido";
    if (!form.pqrsUrl.trim()) e.pqrsUrl = "Requerido";
    if (!form.bpmUrl.trim()) e.bpmUrl = "Requerido";
    if (!form.serviceAccountUser.trim()) e.serviceAccountUser = "Requerido";
    if (!form.serviceAccountPassword.trim()) e.serviceAccountPassword = "Requerido";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleNext() {
    if (!validate()) return;
    const ecmData = useEcm
      ? form
      : { authUrl: "", electronicOfficeUrl: "", pqrsUrl: "", bpmUrl: "", serviceAccountUser: "", serviceAccountPassword: "" };
    onNext({ ...ecmData, useEcm });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between bg-[#0d0d0d] border border-[#2d2d2d] rounded-lg px-4 py-3">
        <div>
          <p className="text-sm font-medium text-white">Usar APIs ECM</p>
          <p className="text-xs text-[#828282] mt-0.5">
            Activa si el sistema se integra con las APIs ECM legadas (Auth, Electronic Office, PQRS, BPM).
          </p>
        </div>
        <Toggle checked={useEcm} onChange={setUseEcm} />
      </div>

      {useEcm && (
        <>
          <div className="flex flex-col gap-4">
            <p className="text-xs font-semibold text-[#828282] uppercase tracking-widest">URLs de las APIs</p>
            <Input
              label="Auth API"
              placeholder="https://ecm.entidad.gov.co/api/v2"
              value={form.authUrl}
              onChange={(e) => set("authUrl", e.target.value)}
              error={errors.authUrl}
              type="url"
            />
            <Input
              label="Electronic Office API"
              placeholder="https://ecm.entidad.gov.co/api/v1"
              value={form.electronicOfficeUrl}
              onChange={(e) => set("electronicOfficeUrl", e.target.value)}
              error={errors.electronicOfficeUrl}
              type="url"
            />
            <Input
              label="PQRS API"
              placeholder="https://ecm.entidad.gov.co/pqrs"
              value={form.pqrsUrl}
              onChange={(e) => set("pqrsUrl", e.target.value)}
              error={errors.pqrsUrl}
              type="url"
            />
            <Input
              label="BPM BackOffice API"
              placeholder="https://ecm.entidad.gov.co/bpm/api/v1"
              value={form.bpmUrl}
              onChange={(e) => set("bpmUrl", e.target.value)}
              error={errors.bpmUrl}
              type="url"
            />
          </div>

          <div className="h-px bg-[#2d2d2d]" />

          <div className="flex flex-col gap-4">
            <p className="text-xs font-semibold text-[#828282] uppercase tracking-widest">Cuenta de servicio</p>
            <p className="text-xs text-[#4f4f4f] -mt-2">
              Usuario con permisos para autenticarse en las APIs ECM en nombre del sistema.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Usuario"
                placeholder="servicio@entidad.gov.co"
                value={form.serviceAccountUser}
                onChange={(e) => set("serviceAccountUser", e.target.value)}
                error={errors.serviceAccountUser}
              />
              <Input
                label="Contraseña"
                placeholder="••••••••"
                type="password"
                value={form.serviceAccountPassword}
                onChange={(e) => set("serviceAccountPassword", e.target.value)}
                error={errors.serviceAccountPassword}
              />
            </div>
          </div>
        </>
      )}

      {!useEcm && (
        <p className="text-xs text-[#4f4f4f] bg-[#0d0d0d] border border-[#2d2d2d] rounded-lg px-4 py-3">
          Las integraciones con ECM quedarán desactivadas. Podrás habilitarlas después desde la configuración del sistema.
        </p>
      )}

      <div className="flex justify-between pt-2">
        <Button variant="ghost" onClick={onBack}>Anterior</Button>
        <Button variant="brand" onClick={handleNext}>Siguiente</Button>
      </div>
    </div>
  );
}
