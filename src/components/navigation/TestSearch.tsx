'use client'

import { useMemo, useState } from 'react'

import type { CatalogCategoryLink } from '@/features/catalog/types'

import { TestCard } from './TestCard'
import styles from './test-search.module.css'

export function TestSearch({ categories }: { categories: CatalogCategoryLink[] }) {
  const [query, setQuery] = useState('')
  const tests = useMemo(() => categories.flatMap((category) => category.tests), [categories])
  const normalizedQuery = query.trim().toLocaleLowerCase()
  const filteredTests = normalizedQuery
    ? tests.filter((test) =>
        `${test.name} ${test.shortDescription}`.toLocaleLowerCase().includes(normalizedQuery),
      )
    : tests

  return (
    <section aria-labelledby="test-search-heading" className={styles.search}>
      <h2 id="test-search-heading">Find your test</h2>
      <label className={styles.label} htmlFor="test-search-input">
        Search by test name
      </label>
      <input
        autoComplete="off"
        className={styles.input}
        id="test-search-input"
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Try a test name"
        type="search"
        value={query}
      />
      <p aria-live="polite" className={styles.resultCount}>
        {filteredTests.length} {filteredTests.length === 1 ? 'test' : 'tests'}
      </p>
      {filteredTests.length > 0 ? (
        <ul className={styles.results}>
          {filteredTests.map((test) => (
            <li key={test.id}>
              <TestCard test={test} />
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.empty}>No tests match that search.</p>
      )}
    </section>
  )
}
