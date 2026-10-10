import { mockCatalogNavigation } from '@/mocks/testPrepData'

import type { CatalogCategoryLink, CatalogTestLink } from './types'

/** Demo-only catalog source; replace this function with an approved API loader later. */
export async function getCatalogNavigation(): Promise<CatalogCategoryLink[]> {
  return mockCatalogNavigation.map((category) => ({
    ...category,
    tests: category.tests.map((test): CatalogTestLink => ({ ...test })),
  }))
}
