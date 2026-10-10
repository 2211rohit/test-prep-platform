import Link from 'next/link'

import { ButtonLink } from '@/components/ui'
import type { CatalogCategoryLink } from '@/features/catalog/types'

import styles from './site-header.module.css'

export function CatalogMegaMenu({ categories }: { categories: CatalogCategoryLink[] }) {
  return (
    <details className={styles.catalogMenu}>
      <summary className={styles.menuTrigger}>Explore tests</summary>
      <div className={styles.menuPanel}>
        {categories.length === 0 ? (
          <p className={styles.emptyCatalog}>No tests are published yet.</p>
        ) : (
          <ul className={styles.categoryGrid}>
            {categories.map((category) => (
              <li className={styles.category} key={category.id}>
                <Link className={styles.categoryLink} href={`/${category.slug}`}>
                  {category.name}
                </Link>
                <ul className={styles.testList}>
                  {category.tests.map((test) => (
                    <li className={styles.testItem} key={test.id}>
                      <Link href={`/${test.slug}-practice-test`}>{test.name}</Link>
                      <Link
                        aria-label={`View ${test.name} course`}
                        className={styles.courseLink}
                        href={`/courses/${test.slug}`}
                      >
                        Course
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>
    </details>
  )
}

export function SiteHeader({
  categories,
  showAccountLinks = true,
}: {
  categories: CatalogCategoryLink[]
  showAccountLinks?: boolean
}) {
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link aria-label="Test Prep Platform home" className={styles.wordmark} href="/">
          Test Prep Platform
        </Link>
        <nav aria-label="Main navigation" className={styles.navigation}>
          <CatalogMegaMenu categories={categories} />
          {showAccountLinks ? (
            <>
              <Link className={styles.signIn} href="/login">
                Sign in
              </Link>
              <ButtonLink href="/signup" size="small">
                Start free
              </ButtonLink>
            </>
          ) : (
            <span className={styles.demoMode}>Demo preview</span>
          )}
        </nav>
      </div>
    </header>
  )
}
