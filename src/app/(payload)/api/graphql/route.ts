type GraphqlMethod = 'POST' | 'OPTIONS'

async function handleGraphqlRequest(method: GraphqlMethod, request: Request) {
  if (process.env.CMS_DEMO_MODE === 'browser') {
    return Response.json(
      { message: 'Payload APIs are disabled in the browser-only CMS demo.' },
      { status: 404 },
    )
  }

  const handlers = await import('./PayloadGraphqlHandlers')
  if (method === 'POST') return handlers.POST(request)
  return handlers.OPTIONS(request, { params: Promise.resolve({}) })
}

export const POST = (request: Request) => handleGraphqlRequest('POST', request)
export const OPTIONS = (request: Request) => handleGraphqlRequest('OPTIONS', request)
