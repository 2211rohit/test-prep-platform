import Link from 'next/link'

import type { CatalogCategoryLink } from '@/features/catalog/types'

import styles from './catalog.module.css'

export function CategoryTile({ category }: { category: CatalogCategoryLink }) {
  return (
    <Link className={styles.tile} href={`/${category.slug}`}>
      <span className={styles.title}>{category.name}</span>
      <span className={styles.description}>
        {category.tests.length} {category.tests.length === 1 ? 'test' : 'tests'}
      </span>
    </Link>
  )
}
