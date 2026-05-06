import { NextResponse } from "next/server";

export async function GET() {
  const res = NextResponse.redirect(
    new URL("/setup", process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000")
  );
  res.cookies.set("sede_installed", "", { path: "/", maxAge: 0 });
  res.cookies.set("sede_token", "", { path: "/", maxAge: 0 });
  return res;
}
