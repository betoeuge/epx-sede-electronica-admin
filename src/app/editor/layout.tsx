import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const BACKEND = (process.env.BACKEND_URL ?? "http://localhost:5212").replace(/\/$/, "");

export default async function EditorLayout({ children }: { children: React.ReactNode }) {
  const token = (await cookies()).get("sede_token")?.value;
  if (!token) redirect("/login");

  try {
    const res = await fetch(`${BACKEND}/api/v1/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (res.status === 401) redirect("/login");
  } catch {
    // Backend unreachable — allow access
  }

  return <>{children}</>;
}
