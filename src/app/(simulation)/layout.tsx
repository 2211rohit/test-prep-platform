import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import '../(frontend)/styles.css'

export const metadata: Metadata = {
  title: 'Practice simulation | Test Prep Platform',
  robots: { index: false, follow: false },
}

/** Full-screen exam routes use this separate root layout without public site navigation. */
export default function SimulationLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#simulation-main">
          Skip to simulation
        </a>
        {children}
      </body>
    </html>
  )
}
