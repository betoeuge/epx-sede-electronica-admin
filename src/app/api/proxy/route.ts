import { NextRequest, NextResponse } from 'next/server'

const BACKEND = (process.env.BACKEND_URL ?? 'http://localhost:5212').replace(/\/$/, '')

async function proxy(req: NextRequest) {
  const path = req.nextUrl.searchParams.get('_path') ?? ''
  const url = `${BACKEND}${path}`

  const headers = new Headers()
  const auth = req.headers.get('authorization')
  if (auth) headers.set('authorization', auth)
  headers.set('content-type', 'application/json')

  const body = req.method !== 'GET' && req.method !== 'HEAD'
    ? await req.text()
    : undefined

  try {
    const res = await fetch(url, {
      method: req.method,
      headers,
      body,
      cache: 'no-store',
      signal: AbortSignal.timeout(60_000),
    })

    const resBody = res.status === 204 ? null : await res.text()
    return new NextResponse(resBody, {
      status: res.status,
      headers: { 'content-type': res.headers.get('content-type') ?? 'application/json' },
    })
  } catch (e) {
    return NextResponse.json(
      { error: `No se pudo conectar al backend: ${url}` },
      { status: 502 }
    )
  }
}

export const GET = proxy
export const POST = proxy
export const PUT = proxy
export const PATCH = proxy
export const DELETE = proxy
