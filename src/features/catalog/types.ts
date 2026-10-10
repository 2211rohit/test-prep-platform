export type CatalogTestLink = {
  id: number
  name: string
  slug: string
  shortDescription: string
}

export type CatalogCategoryLink = {
  id: number
  name: string
  slug: string
  tests: CatalogTestLink[]
}
