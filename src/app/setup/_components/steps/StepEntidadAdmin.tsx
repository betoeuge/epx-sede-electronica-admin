"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { WizardData } from "@/types/setup.types";

interface Props {
  entidad: WizardData["entidad"];
  admin: WizardData["admin"];
  onNext: (data: { entidad: WizardData["entidad"]; admin: WizardData["admin"] }) => void;
  onBack: () => void;
}

interface Errors {
  nombre?: string;
  nit?: string;
  userName?: string;
  email?: string;
  password?: string;
  passwordConfirm?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function StepEntidadAdmin({ entidad, admin, onNext, onBack }: Props) {
  const [ent, setEnt] = useState(entidad);
  const [adm, setAdm] = useState(admin);
  const [errors, setErrors] = useState<Errors>({});

  function setEntField(field: keyof typeof ent, value: string) {
    setEnt((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function setAdmField(field: keyof typeof adm, value: string) {
    setAdm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate(): boolean {
    const e: Errors = {};
    if (!ent.nombre.trim()) e.nombre = "Requerido";
    if (!ent.nit.trim()) e.nit = "Requerido";
    if (!adm.userName.trim()) e.userName = "Requerido";
    if (!adm.email.trim()) e.email = "Requerido";
    else if (!EMAIL_RE.test(adm.email)) e.email = "Correo inválido";
    if (!adm.password) e.password = "Requerido";
    else if (adm.password.length < 8) e.password = "Mínimo 8 caracteres";
    if (!adm.passwordConfirm) e.passwordConfirm = "Requerido";
    else if (adm.password !== adm.passwordConfirm) e.passwordConfirm = "Las contraseñas no coinciden";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleNext() {
    if (validate()) onNext({ entidad: ent, admin: adm });
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Entidad */}
      <div className="flex flex-col gap-4">
        <p className="text-xs font-semibold text-[#828282] uppercase tracking-widest">Información de la entidad</p>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Nombre de la entidad"
            placeholder="Municipio de Ejemplo"
            value={ent.nombre}
            onChange={(e) => setEntField("nombre", e.target.value)}
            error={errors.nombre}
          />
          <Input
            label="NIT"
            placeholder="800.123.456-7"
            value={ent.nit}
            onChange={(e) => setEntField("nit", e.target.value)}
            error={errors.nit}
          />
        </div>
      </div>

      <div className="h-px bg-[#2d2d2d]" />

      {/* Admin */}
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-xs font-semibold text-[#828282] uppercase tracking-widest">Administrador del sistema</p>
          <p className="text-xs text-[#4f4f4f] mt-1">Este será el primer usuario con acceso total al panel.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Nombre de usuario"
            placeholder="admin"
            value={adm.userName}
            onChange={(e) => setAdmField("userName", e.target.value)}
            error={errors.userName}
          />
          <Input
            label="Correo electrónico"
            placeholder="admin@entidad.gov.co"
            type="email"
            value={adm.email}
            onChange={(e) => setAdmField("email", e.target.value)}
            error={errors.email}
          />
          <Input
            label="Contraseña"
            placeholder="••••••••"
            type="password"
            value={adm.password}
            onChange={(e) => setAdmField("password", e.target.value)}
            error={errors.password}
            hint="Mínimo 8 caracteres"
          />
          <Input
            label="Confirmar contraseña"
            placeholder="••••••••"
            type="password"
            value={adm.passwordConfirm}
            onChange={(e) => setAdmField("passwordConfirm", e.target.value)}
            error={errors.passwordConfirm}
          />
          <Input
            label="Nombre (opcional)"
            placeholder="María"
            value={adm.firstName}
            onChange={(e) => setAdmField("firstName", e.target.value)}
          />
          <Input
            label="Apellido (opcional)"
            placeholder="García"
            value={adm.lastName}
            onChange={(e) => setAdmField("lastName", e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-between pt-2">
        <Button variant="ghost" onClick={onBack}>Anterior</Button>
        <Button variant="brand" onClick={handleNext}>Siguiente</Button>
      </div>
    </div>
  );
}
