"use client";

import { useState } from "react";
import { Stepper } from "./Stepper";
import { StepBackend } from "./steps/StepBackend";
import { StepDatabase } from "./steps/StepDatabase";
import { StepEcm } from "./steps/StepEcm";
import { StepEntidadAdmin } from "./steps/StepEntidadAdmin";
import { StepConfirm } from "./steps/StepConfirm";
import { StepDone } from "./steps/StepDone";
import type { WizardData } from "@/types/setup.types";

const INITIAL: WizardData = {
  apiUrl: "",
  database: { provider: "PostgreSQL", connectionString: "", connectionTested: false, fields: {} },
  ecm: { useEcm: true, authUrl: "", electronicOfficeUrl: "", pqrsUrl: "", bpmUrl: "", serviceAccountUser: "", serviceAccountPassword: "" },
  entidad: { nombre: "", nit: "" },
  admin: { userName: "", password: "", passwordConfirm: "", email: "", firstName: "", lastName: "" },
};

const STEP_TITLES = [
  "Conexión al backend",
  "Base de datos",
  "APIs ECM",
  "Entidad y administrador",
  "Confirmar instalación",
];

const STEP_DESCRIPTIONS = [
  "Indica la URL donde corre el API de Sede Electrónica.",
  "Configura la base de datos donde se almacenarán los datos.",
  "Conecta las APIs del sistema ECM legado si las necesitas.",
  "Crea la cuenta de administrador y configura los datos de la entidad.",
  "Revisa todo antes de iniciar la instalación.",
];

export function SetupWizard() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<WizardData>(INITIAL);
  const [doneEntity, setDoneEntity] = useState("");

  function patch(partial: Partial<WizardData>) {
    setData((prev) => ({ ...prev, ...partial }));
  }

  if (doneEntity) return <StepDone entidadNombre={doneEntity} />;

  return (
    <>
      {/* ── Panel izquierdo ─────────────────────────────────────── */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 relative overflow-hidden p-10"
        style={{
          background: "linear-gradient(160deg, #0a0a1a 0%, #0d1b2a 50%, #0a0a0a 100%)",
        }}
      >
        {/* Grid pattern background */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(#2d2d2d 1px, transparent 1px), linear-gradient(90deg, #2d2d2d 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Glow effect */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #2d9cdb 0%, transparent 70%)" }}
        />

        {/* Logo */}
        <div className="relative flex items-center gap-2.5 z-10">
          <div className="size-9 rounded-lg bg-[#2d9cdb] flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold tracking-wide">SE</span>
          </div>
          <span className="text-white font-semibold text-base">Evolution CMS</span>
        </div>

        {/* Center content */}
        <div className="relative z-10 flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-bold text-white leading-tight mb-3">
              Instala tu<br />sede electrónica.
            </h1>
            <p className="text-[#828282] text-sm leading-relaxed">
              Configura tu plataforma en minutos. Conecta la base de datos, personaliza tu entidad y crea el administrador.
            </p>
          </div>

          {/* Stepper */}
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
            <p className="text-xs font-semibold text-[#828282] uppercase tracking-widest mb-5">
              Pasos de instalación
            </p>
            <Stepper current={step} />
          </div>
        </div>

        {/* Footer */}
        <p className="relative z-10 text-[#4f4f4f] text-xs">
          Copyright © 2026 evolution-it.com.co
        </p>
      </div>

      {/* ── Panel derecho ────────────────────────────────────────── */}
      <div className="flex-1 bg-[#181818] flex flex-col items-center justify-center px-6 py-12 overflow-y-auto">

        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-2 mb-8">
          <div className="size-8 rounded-lg bg-[#2d9cdb] flex items-center justify-center">
            <span className="text-white text-xs font-bold">SE</span>
          </div>
          <span className="text-white font-semibold">Evolution CMS</span>
        </div>

        {/* Step header */}
        <div className="w-full max-w-xl mb-8">
          <p className="text-xs font-semibold text-[#2d9cdb] uppercase tracking-widest mb-1">
            Paso {step + 1} de 5
          </p>
          <h2 className="text-2xl font-bold text-white">{STEP_TITLES[step]}</h2>
          <p className="text-[#828282] text-sm mt-1">{STEP_DESCRIPTIONS[step]}</p>
        </div>

        {/* Step card */}
        <div className="w-full max-w-xl bg-black border border-[#2d2d2d] rounded-2xl p-8"
          style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.04)" }}
        >
          {step === 0 && (
            <StepBackend
              apiUrl={data.apiUrl}
              onNext={(apiUrl) => { patch({ apiUrl }); setStep(1); }}
            />
          )}
          {step === 1 && (
            <StepDatabase
              data={data.database}
              apiUrl={data.apiUrl}
              onNext={(database) => { patch({ database }); setStep(2); }}
              onBack={() => setStep(0)}
            />
          )}
          {step === 2 && (
            <StepEcm
              data={data.ecm}
              onNext={(ecm) => { patch({ ecm }); setStep(3); }}
              onBack={() => setStep(1)}
            />
          )}
          {step === 3 && (
            <StepEntidadAdmin
              entidad={data.entidad}
              admin={data.admin}
              onNext={({ entidad, admin }) => { patch({ entidad, admin }); setStep(4); }}
              onBack={() => setStep(2)}
            />
          )}
          {step === 4 && (
            <StepConfirm
              data={data}
              onBack={() => setStep(3)}
              onDone={(nombre) => setDoneEntity(nombre)}
            />
          )}
        </div>
      </div>
    </>
  );
}
