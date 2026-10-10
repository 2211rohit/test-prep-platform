import Link from 'next/link'

import type { CatalogTestLink } from '@/features/catalog/types'

import styles from './catalog.module.css'

export function TestCard({ test }: { test: CatalogTestLink }) {
  return (
    <article className={styles.testCard}>
      <h3 className={styles.title}>{test.name}</h3>
      <p className={styles.description}>{test.shortDescription}</p>
      <div className={styles.actions}>
        <Link href={`/${test.slug}-practice-test`}>Free practice</Link>
        <Link href={`/courses/${test.slug}`}>Full Prep course</Link>
      </div>
    </article>
  )
}
