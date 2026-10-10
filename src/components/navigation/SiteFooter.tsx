import Link from 'next/link'

import styles from './site-footer.module.css'

const legalLinks = [
  { label: 'Terms', href: '/terms' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Refunds', href: '/refunds' },
  { label: 'Disclaimer', href: '/disclaimer' },
]

export function SiteFooter({ showLegalLinks = true }: { showLegalLinks?: boolean }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <p className={styles.footerName}>Test Prep Platform</p>
        {showLegalLinks ? (
          <nav aria-label="Legal information">
            <ul className={styles.legalLinks}>
              {legalLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </div>
    </footer>
  )
}
