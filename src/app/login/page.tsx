import { redirect } from "next/navigation";
import { LoginForm } from "./_components/LoginForm";
import { RedirectToSetup } from "./_components/RedirectToSetup";

const BACKEND = (process.env.BACKEND_URL ?? "http://localhost:5212").replace(/\/$/, "");

export default async function LoginPage() {
  // Verify the real install state from the backend.
  // If not installed, render a client component that clears the stale cookie
  // and redirects via window.location (proxy-safe, no absolute URL issues).
  let needsSetup = false;
  try {
    const res = await fetch(`${BACKEND}/api/v1/setup/status`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (!data.isInstalled) needsSetup = true;
    }
  } catch {
    // Backend unreachable — render login anyway
  }

  if (needsSetup) return <RedirectToSetup />;

  // If already authenticated, go straight to dashboard
  return <LoginForm />;
}
