type RouteContext = { params: Promise<{ slug?: string[] }> }
type RestMethod = 'GET' | 'POST' | 'DELETE' | 'PATCH' | 'PUT' | 'OPTIONS'

async function handlePayloadRequest(method: RestMethod, request: Request, context: RouteContext) {
  if (process.env.CMS_DEMO_MODE === 'browser') {
    return Response.json(
      { message: 'Payload APIs are disabled in the browser-only CMS demo.' },
      { status: 404 },
    )
  }

  const handlers = await import('./PayloadRestHandlers')
  return handlers[method](request, context)
}

export const GET = (request: Request, context: RouteContext) =>
  handlePayloadRequest('GET', request, context)
export const POST = (request: Request, context: RouteContext) =>
  handlePayloadRequest('POST', request, context)
export const DELETE = (request: Request, context: RouteContext) =>
  handlePayloadRequest('DELETE', request, context)
export const PATCH = (request: Request, context: RouteContext) =>
  handlePayloadRequest('PATCH', request, context)
export const PUT = (request: Request, context: RouteContext) =>
  handlePayloadRequest('PUT', request, context)
export const OPTIONS = (request: Request, context: RouteContext) =>
  handlePayloadRequest('OPTIONS', request, context)
