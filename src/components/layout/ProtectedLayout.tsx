import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/cms/Sidebar";
import { TopBar } from "@/components/cms/TopBar";

const BACKEND = (process.env.BACKEND_URL ?? "http://localhost:5212").replace(/\/$/, "");

type SiteEntry = { id: string; name: string; slug: string; status: string };
type SitesResponse = {
  groups: { id: string; name: string; sites: SiteEntry[] }[];
  ungrouped: SiteEntry[];
};

export async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const token = (await cookies()).get("sede_token")?.value;

  if (!token) {
    redirect("/login");
  }

  // Verify the token is still valid and parse user info from /me.
  // redirect() throws internally, so we must NOT call it inside a catch block.
  let tokenValid = true;
  let userName: string | undefined;
  let email: string | undefined;
  let firstName: string | undefined;
  let lastName: string | undefined;

  try {
    const res = await fetch(`${BACKEND}/api/v1/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (res.status === 401) {
      tokenValid = false;
    } else if (res.ok) {
      const me = await res.json();
      userName = me.userName;
      email = me.email;
      firstName = me.firstName;
      lastName = me.lastName;
    }
  } catch {
    // Backend unreachable — still allow access so a restart doesn't lock the admin out
  }

  if (!tokenValid) redirect("/login");

  const rawName = `${firstName ?? ""} ${lastName ?? ""}`.trim();
  const displayName = rawName || userName;

  // Fetch entity name for the sidebar logo.
  let entidadNombre: string | undefined;
  try {
    const statusRes = await fetch(`${BACKEND}/api/v1/setup/status`, {
      cache: "no-store",
    });
    if (statusRes.ok) {
      const status = await statusRes.json();
      entidadNombre = status.entidadNombre ?? undefined;
    }
  } catch {
    // Non-fatal
  }

  // Fetch active sites for TopBar tabs.
  let activeSites: { id: string; name: string }[] = [];
  try {
    const sitesRes = await fetch(`${BACKEND}/api/v1/sites`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (sitesRes.ok) {
      const sitesData: SitesResponse = await sitesRes.json();
      const allSites: SiteEntry[] = [
        ...sitesData.groups.flatMap((g) => g.sites),
        ...sitesData.ungrouped,
      ];
      activeSites = allSites
        .filter((s) => s.status === "Active")
        .map((s) => ({ id: s.id, name: s.name }));
    }
  } catch {
    // Non-fatal — TopBar will show empty state
  }

  return (
    <div
      className="flex flex-col items-start overflow-hidden w-full h-screen"
      style={{ background: "black" }}
    >
      <TopBar sites={activeSites} />
      <div className="flex items-start w-full flex-1 overflow-hidden">
        <Sidebar user={{ name: displayName, email }} />
        <main className="flex flex-col flex-1 min-w-0 h-full overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
