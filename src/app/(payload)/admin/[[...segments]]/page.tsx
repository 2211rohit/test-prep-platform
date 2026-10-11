import type { Metadata } from 'next'

import { CmsDemoApp } from '@/features/cms-demo/CmsDemoApp'

type Props = {
  params: Promise<{ segments: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] }>
}

const isBrowserDemo = () => process.env.CMS_DEMO_MODE === 'browser'

export async function generateMetadata(props: Props): Promise<Metadata> {
  if (isBrowserDemo()) {
    return {
      title: 'CMS browser demo | Test Prep Platform',
      description: 'A browser-only content management demo with sample records.',
      robots: { index: false, follow: false },
    }
  }

  const { generatePayloadAdminMetadata } = await import('./PayloadAdminPage')
  return generatePayloadAdminMetadata(props)
}

export default async function AdminPage(props: Props) {
  if (isBrowserDemo()) return <CmsDemoApp />

  const { renderPayloadAdminPage } = await import('./PayloadAdminPage')
  return renderPayloadAdminPage(props)
}
