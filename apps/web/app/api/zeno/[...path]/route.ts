import { NextRequest, NextResponse } from "next/server"

const ZENO_API_BASE = "https://zenomusic.io/api"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(req, params)
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(req, params)
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(req, params)
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(req, params)
}

async function proxyRequest(
  req: NextRequest,
  params: Promise<{ path: string[] }>
) {
  const { path } = await params
  const pathStr = path.join("/")
  const searchParams = req.nextUrl.searchParams.toString()
  const url = `${ZENO_API_BASE}/${pathStr}${searchParams ? `?${searchParams}` : ""}`

  // Forward headers, excluding host/origin so the API sees a server-side request
  const headers: Record<string, string> = {}
  const authHeader = req.headers.get("authorization")
  if (authHeader) headers["authorization"] = authHeader
  headers["accept"] = req.headers.get("accept") || "application/json"
  headers["content-type"] = req.headers.get("content-type") || "application/json"

  let body: string | undefined
  if (req.method !== "GET" && req.method !== "HEAD") {
    body = await req.text()
  }

  try {
    const res = await fetch(url, {
      method: req.method,
      headers,
      body,
    })

    const data = await res.text()

    const responseHeaders: Record<string, string> = {
      "content-type": res.headers.get("content-type") || "application/json",
    }

    return new NextResponse(data, {
      status: res.status,
      headers: responseHeaders,
    })
  } catch {
    return NextResponse.json(
      { error: "Failed to reach ZenoMusic API" },
      { status: 502 }
    )
  }
}
