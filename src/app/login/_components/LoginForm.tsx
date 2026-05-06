"use client";

import { useState, useEffect, useRef, FormEvent, Suspense, lazy } from "react";
import { useRouter } from "next/navigation";
import { EvolutionLogo } from "@/components/ui/EvolutionLogo";

const UnicornScene = lazy(() => import("unicornstudio-react"));

/* ── testimonials ─────────────────────────────────────────────────────── */
const TESTIMONIALS = [
  {
    name: "Jesus Bueno",
    text: "Antes de Evolution, crear nuestro sitio web era lento y confuso. Con sus plantillas, conectamos nuestro contenido y tuvimos un sitio funcional en segundos, con un diseño adaptable que se ve increíble.",
    avatar: "https://ui-avatars.com/api/?name=Jesus+Bueno&background=333&color=fff&size=100",
  },
  {
    name: "Elena Rodríguez",
    text: "La facilidad para gestionar grupos de proyectos y la fluidez del editor superaron mis expectativas. Es la herramienta definitiva para equipos que buscan rapidez sin sacrificar calidad profesional.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
  },
  {
    name: "Marco Chen",
    text: "Evolution transformó nuestra forma de trabajar. El sistema de diseño integrado nos permite mantener una consistencia visual perfecta en todos nuestros productos digitales con un solo clic.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marco",
  },
  {
    name: "Sarah Jenkins",
    text: "Increíble soporte y una interfaz intuitiva. Pude lanzar mi portafolio profesional en una tarde. Lo que más me gusta es la libertad creativa que ofrecen sus componentes atómicos.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  },
  {
    name: "David Smith",
    text: "Como desarrollador, valoro la limpieza del código generado y la robustez de la plataforma. Evolution es, sin duda, el estándar de oro para el prototipado rápido en 2026.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
  },
];

/* ─────────────────────────────────────────────────────────────────────── */

export function LoginForm() {
  const router = useRouter();

  /* form state */
  const [email, setEmail] = useState(() => {
    try { return localStorage.getItem("rememberedEmail") || ""; } catch { return ""; }
  });
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(() => {
    try { return !!localStorage.getItem("rememberedEmail"); } catch { return false; }
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [entidadNombre, setEntidadNombre] = useState<string | null>(null);

  /* carousel state */
  const [current, setCurrent] = useState(0);
  const [exiting, setExiting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch("/api/proxy?_path=/api/v1/setup/status")
      .then((r) => r.json())
      .then((d) => d.entidadNombre && setEntidadNombre(d.entidadNombre))
      .catch(() => {});
  }, []);

  /* auto-advance carousel */
  useEffect(() => {
    const tick = () => {
      setExiting(true);
      timerRef.current = setTimeout(() => {
        setCurrent((p) => (p + 1) % TESTIMONIALS.length);
        setExiting(false);
      }, 500);
    };
    const id = setInterval(tick, 5000);
    return () => { clearInterval(id); if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  /* manual dot navigation */
  const goTo = (idx: number) => {
    if (idx === current) return;
    setExiting(true);
    setTimeout(() => { setCurrent(idx); setExiting(false); }, 500);
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/proxy?_path=/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName: email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Credenciales incorrectas");
      }

      const data = await res.json();
      const token = data.accessToken || data.token || data.access_token || "";

      if (remember) {
        try { localStorage.setItem("rememberedEmail", email); } catch {}
      } else {
        try { localStorage.removeItem("rememberedEmail"); } catch {}
      }

      localStorage.setItem("sede_token", token);
      if (data.user) localStorage.setItem("sede_user", JSON.stringify(data.user));

      const maxAge = remember ? 60 * 60 * 24 * 30 : 60 * 60 * 8;
      document.cookie = `sede_token=${token}; path=/; max-age=${maxAge}; SameSite=Lax`;

      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  }

  const t = TESTIMONIALS[current];
  const isDisabled = !email.trim() || !password.trim() || loading;

  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex", backgroundColor: "#0a0a0a", fontFamily: "'Inter', sans-serif", overflow: "hidden" }} className="login-fade-in">

      <style>{`
        @keyframes loginFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .login-fade-in { animation: loginFadeIn 0.8s ease-out; }
        .slide-up-1 { animation: slideUp 0.6s ease-out 0.2s both; }
        .slide-up-2 { animation: slideUp 0.6s ease-out 0.4s both; }
        .slide-up-3 { animation: slideUp 0.6s ease-out 0.6s both; }
        .login-input-wrap:focus-within { border-color: #56ccf2 !important; }
        .login-submit:hover:not(:disabled) { background: #1a7bbb !important; }
        .login-google:hover { background: #1a1a1a !important; }
        .eye-btn:hover { opacity: 1 !important; }
        .dot-btn { transition: background 0.3s ease; }
      `}</style>

      {/* ── LEFT: Visual panel ──────────────────────────────────────────────── */}
      <div style={{ flex: 1, position: "relative", display: "flex", flexDirection: "column", justifyContent: "flex-end", minWidth: 0, overflow: "hidden" }}>

        {/* UnicornStudio WebGL animation */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0, overflow: "hidden" }}>
          <Suspense fallback={<div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #0d1b2a 0%, #1a2a4a 40%, #050d18 100%)" }} />}>
            {/* @ts-ignore — style not in UnicornSceneProps but accepted at runtime */}
            <UnicornScene
              key="XI3Za9sAfpM52djNtSbx"
              projectId="XI3Za9sAfpM52djNtSbx"
              width="100%"
              height="100%"
              scale={1}
              dpi={1.5}
              sdkUrl="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@2.1.5/dist/unicornStudio.umd.js"
              className="w-full h-full block"
            />
          </Suspense>
        </div>

        {/* Gradient overlay (bottom fade to black) */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0) 38%, rgba(0,0,0,0.92) 100%)", zIndex: 2, pointerEvents: "none" }} />

        {/* Hero text */}
        <div style={{ position: "relative", zIndex: 10, padding: "0 3.75rem", color: "white", maxWidth: "37.5rem", marginBottom: "1rem" }} className="slide-up-1">
          <h1 style={{ fontSize: "3.125rem", fontWeight: 400, lineHeight: 1.1, margin: "0 0 1.5rem 0" }}>
            Construye el<br />futuro, hoy.
          </h1>
          <p style={{ fontSize: "1.125rem", fontWeight: 300, lineHeight: "1.875rem", opacity: 0.9, margin: 0 }}>
            Toma el control total de tu presencia digital con herramientas de gestión inteligente y diseño adaptable.
          </p>
        </div>

        {/* Testimonial carousel */}
        <div style={{ position: "relative", zIndex: 10, padding: "0 3.75rem 3.75rem" }} className="slide-up-2">
          <div style={{
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(37px)",
            WebkitBackdropFilter: "blur(37px)",
            borderRadius: "1.5rem",
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
            transition: "opacity 0.5s ease-in-out, transform 0.5s ease-in-out",
            opacity: exiting ? 0 : 1,
            transform: exiting ? "translateY(10px)" : "translateY(0)",
          }}>
            {/* Avatar + name */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <img
                src={t.avatar}
                alt={t.name}
                style={{ width: "3.125rem", height: "3.125rem", borderRadius: "50%", objectFit: "cover", background: "rgba(255,255,255,0.15)", flexShrink: 0 }}
              />
              <span style={{ color: "white", fontSize: "1.25rem", fontWeight: 400 }}>{t.name}</span>
            </div>

            {/* Quote */}
            <p style={{ color: "white", opacity: 0.85, fontSize: "1.0625rem", fontWeight: 300, lineHeight: "1.75rem", margin: 0, minHeight: "5rem" }}>
              {t.text}
            </p>

            {/* Dots */}
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {TESTIMONIALS.map((_, idx) => (
                <button
                  key={idx}
                  className="dot-btn"
                  onClick={() => goTo(idx)}
                  style={{ width: "1.5rem", height: "0.25rem", borderRadius: "0.25rem", border: "none", cursor: "pointer", padding: 0, background: current === idx ? "white" : "rgba(255,255,255,0.25)" }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT: Form panel ───────────────────────────────────────────────── */}
      <div style={{ width: "40%", minWidth: "420px", maxWidth: "630px", background: "#181818", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", padding: "2rem" }}>

        {/* Grid background */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0, opacity: 0.06, overflow: "hidden" }}>
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="lgrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#lgrid)" />
          </svg>
        </div>

        {/* Form content */}
        <div style={{ width: "100%", maxWidth: "380px", display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem", position: "relative", zIndex: 1 }} className="slide-up-3">

          {/* Logo + entity name */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
            <EvolutionLogo className="w-[56px] h-[50px]" />
            {entidadNombre && (
              <p style={{ color: "white", fontSize: "0.9375rem", fontWeight: 600, textAlign: "center", letterSpacing: "0.03em", margin: 0 }}>
                {entidadNombre}
              </p>
            )}
          </div>

          {/* Heading */}
          <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%" }}>
            <h2 style={{ color: "white", fontSize: "1.5rem", fontWeight: 400, margin: 0 }}>Iniciar Sesión</h2>
            <p style={{ color: "#828282", fontSize: "1rem", fontWeight: 300, margin: 0 }}>¡Bienvenido! Por favor, ingresa tus datos.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ width: "100%", display: "flex", flexDirection: "column", gap: "1.5rem" }}>

            {/* Email */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
              <label style={{ color: "#bdbdbd", fontSize: "0.875rem", fontWeight: 500 }}>Usuario o Correo</label>
              <div className="login-input-wrap" style={{ display: "flex", alignItems: "center", background: "black", border: "1px solid #2d2d2d", borderRadius: "0.5rem", padding: "0.625rem 0.875rem", transition: "border-color 0.2s" }}>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (error) setError(""); }}
                  placeholder="Ingresa tu usuario"
                  required
                  autoComplete="username"
                  style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#e0e0e0", fontSize: "1rem", fontFamily: "'Inter', sans-serif" }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
              <label style={{ color: "#bdbdbd", fontSize: "0.875rem", fontWeight: 500 }}>Contraseña</label>
              <div className="login-input-wrap" style={{ display: "flex", alignItems: "center", background: "black", border: "1px solid #2d2d2d", borderRadius: "0.5rem", padding: "0.625rem 0.875rem", transition: "border-color 0.2s" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if (error) setError(""); }}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#e0e0e0", fontSize: "1rem", fontFamily: "'Inter', sans-serif" }}
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPassword((v) => !v)}
                  style={{ background: "transparent", border: "none", padding: 0, cursor: "pointer", display: "flex", alignItems: "center", opacity: 0.5, transition: "opacity 0.2s", color: "white" }}
                >
                  {showPassword ? (
                    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  style={{ accentColor: "#56ccf2", width: "1rem", height: "1rem" }}
                />
                <span style={{ color: "#bdbdbd", fontSize: "0.875rem", fontWeight: 500 }}>Recuerda durante 30 días</span>
              </label>
              <button type="button" style={{ background: "none", border: "none", cursor: "pointer", color: "#56ccf2", fontSize: "0.875rem", fontWeight: 600, padding: 0 }}>
                Forgot password
              </button>
            </div>

            {/* Error */}
            {error && (
              <div style={{ padding: "0.625rem 0.875rem", borderRadius: "0.5rem", background: "rgba(235,87,87,0.12)", border: "1px solid rgba(235,87,87,0.3)" }}>
                <p style={{ color: "#eb5757", fontSize: "0.875rem", fontWeight: 500, margin: 0 }}>{error}</p>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
              <button
                type="submit"
                disabled={isDisabled}
                className="login-submit"
                style={{ background: isDisabled ? "#1d2d3a" : "#2d9cdb", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "0.5rem", padding: "0.75rem 1rem", color: isDisabled ? "#4f6070" : "white", fontSize: "1rem", fontWeight: 600, cursor: isDisabled ? "default" : "pointer", fontFamily: "'Inter', sans-serif", transition: "background 0.2s, color 0.2s", width: "100%" }}
              >
                {loading ? "Iniciando sesión..." : "Sign in"}
              </button>

              <button
                type="button"
                className="login-google"
                style={{ background: "black", border: "1px solid #2d2d2d", borderRadius: "0.5rem", padding: "0.625rem 1rem", color: "white", fontSize: "1rem", fontWeight: 600, cursor: "pointer", fontFamily: "'Inter', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", transition: "background 0.2s", width: "100%" }}
              >
                <svg width={20} height={20} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21.8055 10.0415H21V10H12V14H17.6515C16.827 16.3285 14.6115 18 12 18C8.6865 18 6 15.3135 6 12C6 8.6865 8.6865 6 12 6C13.5295 6 14.912 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C6.4775 2 2 6.4775 2 12C2 17.5225 6.4775 22 12 22C17.5225 22 22 17.5225 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z" fill="#FFC107"/>
                  <path d="M3.15283 7.3455L6.43833 9.755C7.32733 7.554 9.48033 6 11.9998 6C13.5293 6 14.9118 6.577 15.9803 7.5195L18.8088 4.691C17.0228 3.0265 14.6338 2 11.9998 2C8.15883 2 4.82783 4.1685 3.15283 7.3455Z" fill="#FF3D00"/>
                  <path d="M11.9998 22C14.5828 22 16.9308 21.0115 18.7043 19.404L15.6093 16.785C14.5716 17.5742 13.3035 18.001 11.9998 18C9.39883 18 7.19033 16.3415 6.35833 14.027L3.09733 16.5395C4.75233 19.778 8.11333 22 11.9998 22Z" fill="#4CAF50"/>
                  <path d="M21.8055 10.0415H21V10H12V14H17.6515C17.2571 15.108 16.5467 16.076 15.608 16.7855L18.703 19.4045C18.4855 19.6025 22 17 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z" fill="#1976D2"/>
                </svg>
                Sign in with Google
              </button>
            </div>
          </form>

          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.75rem", fontWeight: 300, textAlign: "center", margin: 0 }}>
            Copyright © 2026 evolution-it.com.co
          </p>
        </div>
      </div>
    </div>
  );
}
