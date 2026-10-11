import type { ReactNode } from 'react'

type Props = { children: ReactNode }

export default async function PayloadRouteLayout({ children }: Props) {
  if (process.env.CMS_DEMO_MODE === 'browser') {
    return (
      <html lang="en">
        <body style={{ margin: 0, minWidth: 320, background: '#f4f6fa' }}>{children}</body>
      </html>
    )
  }

  const { PayloadAdminLayout } = await import('./PayloadAdminLayout')
  return <PayloadAdminLayout>{children}</PayloadAdminLayout>
}
