import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { SiteFooter } from '@/components/navigation/SiteFooter'
import { SiteHeader } from '@/components/navigation/SiteHeader'
import { getCatalogNavigation } from '@/features/catalog/getCatalogNavigation'

import './styles.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: {
    default: 'Test Prep Platform',
    template: '%s | Test Prep Platform',
  },
  description: 'Practice and prepare for your next test.',
  robots: { index: true, follow: true },
}

export default async function FrontendLayout(props: { children: ReactNode }) {
  const { children } = props
  const categories = await getCatalogNavigation()

  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <div className="public-site-shell">
          <SiteHeader categories={categories} showAccountLinks={false} />
          <div id="main-content">{children}</div>
          <SiteFooter showLegalLinks={false} />
        </div>
      </body>
    </html>
  )
}
