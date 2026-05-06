import { NextRequest, NextResponse } from 'next/server'

// Proxy server-side para todas las llamadas al backend de setup.
// El browser nunca llama al backend directamente — evita CORS y problemas de proxy.

async function proxyTo(backendUrl: string, path: string, init?: RequestInit) {
  const url = `${backendUrl.replace(/\/$/, '')}${path}`
  try {
    const res = await fetch(url, { ...init, cache: 'no-store', signal: AbortSignal.timeout(120_000) })
    // 204 → return 200 with null body so the client can call res.json() safely
    const status = res.status === 204 ? 200 : res.status
    const body   = res.status === 204 ? null : await res.json().catch(() => null)
    return NextResponse.json(body, { status })
  } catch (err) {
    const isTimeout = err instanceof Error && err.name === 'TimeoutError'
    return NextResponse.json(
      { error: isTimeout
          ? `Tiempo de espera agotado al conectar con ${url} (>120s)`
          : `No se pudo conectar a ${url}` },
      { status: 502 }
    )
  }
}

export async function GET(req: NextRequest) {
  const backendUrl = req.nextUrl.searchParams.get('backendUrl')
  const path = req.nextUrl.searchParams.get('path') ?? '/api/v1/setup/status'
  if (!backendUrl) return NextResponse.json({ error: 'backendUrl requerido' }, { status: 400 })
  return proxyTo(backendUrl, path)
}

export async function POST(req: NextRequest) {
  const { backendUrl, path, body } = await req.json()
  if (!backendUrl || !path) return NextResponse.json({ error: 'backendUrl y path requeridos' }, { status: 400 })
  return proxyTo(backendUrl, path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
}
