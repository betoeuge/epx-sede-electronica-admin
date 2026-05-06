import { NextRequest, NextResponse } from "next/server";

const BACKEND = (process.env.BACKEND_URL ?? "http://localhost:5212").replace(/\/$/, "");

const isSetup  = (p: string) => p === "/setup" || p.startsWith("/setup/");
const isPublic = (p: string) => isSetup(p) || p === "/login" || p.startsWith("/login/");

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const installedCookie = request.cookies.get("sede_installed")?.value === "true";
  const token = request.cookies.get("sede_token")?.value;

  // ── Setup guard ──────────────────────────────────────────────
  // Always verify with the backend — the cookie is only a cache hint.
  // If the DB was wiped the backend returns isInstalled: false regardless of the cookie.
  let installed = false;
  try {
    const res = await fetch(`${BACKEND}/api/v1/setup/status`, {
      cache: "no-store",
      signal: AbortSignal.timeout(2000),
    });
    if (res.ok) {
      const data = await res.json();
      installed = !!data.isInstalled;
    }
  } catch {
    // Backend unreachable → fall back to cookie so the UI isn't broken
    installed = installedCookie;
  }

  // Not installed → force /setup
  if (!installed && !isSetup(pathname)) {
    const res = NextResponse.redirect(new URL("/setup", request.url));
    res.cookies.set("sede_installed", "", { path: "/", maxAge: 0 });
    return res;
  }

  // Installed but hitting /setup → send away
  if (installed && isSetup(pathname)) {
    const target = token ? "/dashboard" : "/login";
    const res = NextResponse.redirect(new URL(target, request.url));
    res.cookies.set("sede_installed", "true", { path: "/", maxAge: 31536000, sameSite: "strict" });
    return res;
  }

  // ── Auth guard ───────────────────────────────────────────────
  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!isPublic(pathname) && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Restore the cookie when it was verified via API
  if (!installedCookie && installed) {
    const res = NextResponse.next();
    res.cookies.set("sede_installed", "true", { path: "/", maxAge: 31536000, sameSite: "strict" });
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
