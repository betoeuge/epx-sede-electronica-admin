"use client";

import { useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Props {
  entidadNombre: string;
}

export function StepDone({ entidadNombre }: Props) {
  useEffect(() => {
    document.cookie = "sede_installed=true; path=/; max-age=31536000; SameSite=Strict";
    // Clear any stale auth session so the user must log in with the new admin account
    document.cookie = "sede_token=; path=/; max-age=0; SameSite=Lax";
    localStorage.removeItem("sede_token");
    localStorage.removeItem("sede_refresh_token");
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 py-8 text-center">
      <div className="size-20 rounded-full bg-[#27ae60]/15 border border-[#27ae60]/30 flex items-center justify-center">
        <CheckCircle size={40} className="text-[#27ae60]" strokeWidth={1.5} />
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-white">¡Instalación completada!</h2>
        <p className="text-[#bdbdbd] text-sm max-w-sm">
          <strong className="text-[#e0e0e0]">{entidadNombre}</strong> ya tiene su Sede Electrónica
          configurada y lista para operar.
        </p>
      </div>

      <div className="bg-[#181818] border border-[#2d2d2d] rounded-xl p-4 text-left w-full max-w-sm flex flex-col gap-2">
        <p className="text-xs font-semibold text-[#828282] uppercase tracking-widest mb-1">Próximos pasos</p>
        <p className="text-sm text-[#bdbdbd]">1. Inicie sesión con las credenciales del administrador.</p>
        <p className="text-sm text-[#bdbdbd]">2. Configure el logo e información de la entidad.</p>
        <p className="text-sm text-[#bdbdbd]">3. Active los módulos del portal ciudadano.</p>
      </div>

      <Button variant="brand" size="lg" onClick={() => window.location.href = "/login"}>
        Ir al inicio de sesión
      </Button>
    </div>
  );
}
