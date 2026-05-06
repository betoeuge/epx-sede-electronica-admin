"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { EvolutionLogo } from "@/components/ui/EvolutionLogo";

interface TopBarProps {
  sites?: { id: string; name: string }[];
}

export function TopBar({ sites }: TopBarProps) {
  const pathname = usePathname();
  const openTabs = sites ?? [];

  return (
    <div
      className="flex items-center w-full shrink-0"
      style={{ borderBottom: "1px solid #2d2d2d" }}
    >
      {/* Logo */}
      <div
        className="flex gap-3 items-center px-5 w-[300px]"
        style={{ borderRight: "1px solid #2d2d2d", height: "51px" }}
      >
        <EvolutionLogo
          className="shrink-0"
          style={{ width: "35px", height: "18px" }}
          preserveAspectRatio="xMidYMin slice"
        />
        <span className="font-medium text-[#bdbdbd] text-sm tracking-wide">Evolution</span>
      </div>

      {/* Home tab */}
      <Link
        href="/dashboard"
        className="flex items-center justify-center size-[50px] hover:bg-white/5 transition-colors"
        style={{
          background: pathname === "/dashboard" ? "#1e1e1e" : "#181818",
          borderRight: "1px solid #2d2d2d",
          borderBottom: pathname === "/dashboard" ? "2px solid white" : "2px solid transparent",
        }}
        title="Proyectos"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={pathname === "/dashboard" ? "white" : "#bdbdbd"} strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      </Link>

      {/* Project tabs */}
      {openTabs.length === 0 ? (
        <span
          className="px-4 text-sm"
          style={{ color: "#4f4f4f" }}
        >
          No hay sitios activos
        </span>
      ) : (
        openTabs.map((site) => (
          <Link
            key={site.id}
            href={`/editor?site=${site.id}`}
            className="flex gap-2 items-center p-4 w-[221px] hover:bg-white/5 transition-colors"
            style={{ borderRight: "1px solid #2d2d2d" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#bdbdbd" strokeWidth="2">
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
              <polyline points="13 2 13 9 20 9" />
            </svg>
            <span className="flex-1 font-medium text-[#bdbdbd] text-sm overflow-hidden text-ellipsis whitespace-nowrap">
              {site.name}
            </span>
          </Link>
        ))
      )}

      {/* Add tab */}
      <div className="flex items-center justify-center size-[50px] cursor-pointer hover:bg-white/5 transition-colors">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#bdbdbd" strokeWidth="2">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </div>
    </div>
  );
}
