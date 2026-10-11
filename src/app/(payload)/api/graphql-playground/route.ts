export async function GET(request: Request) {
  if (process.env.CMS_DEMO_MODE === 'browser') {
    return Response.json(
      { message: 'The Payload GraphQL playground is disabled in the browser-only CMS demo.' },
      { status: 404 },
    )
  }

  const { GET: payloadPlayground } = await import('./PayloadPlaygroundHandler')
  return payloadPlayground(request)
}
