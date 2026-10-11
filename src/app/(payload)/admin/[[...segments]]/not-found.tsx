import type { Metadata } from 'next'
import Link from 'next/link'

type Props = {
  params: Promise<{ segments: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] }>
}

const isBrowserDemo = () => process.env.CMS_DEMO_MODE === 'browser'

export async function generateMetadata(props: Props): Promise<Metadata> {
  if (isBrowserDemo()) {
    return { title: 'Page not found | CMS browser demo', robots: { index: false, follow: false } }
  }

  const { generatePayloadNotFoundMetadata } = await import('./PayloadAdminNotFound')
  return generatePayloadNotFoundMetadata(props)
}

export default async function AdminNotFound(props: Props) {
  if (isBrowserDemo()) {
    return (
      <main
        style={{
          maxWidth: 620,
          margin: '12vh auto',
          padding: 24,
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <p>CMS demo</p>
        <h1>That admin page isn’t in this preview.</h1>
        <p>Use the demo navigation to review the sample collections.</p>
        <Link href="/admin">Return to the CMS demo</Link>
      </main>
    )
  }

  const { renderPayloadAdminNotFound } = await import('./PayloadAdminNotFound')
  return renderPayloadAdminNotFound(props)
}
