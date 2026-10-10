import Link from 'next/link'

import { CategoryTile } from '@/components/navigation/CategoryTile'
import { TestSearch } from '@/components/navigation/TestSearch'
import { ButtonLink } from '@/components/ui'
import { getCatalogNavigation } from '@/features/catalog/getCatalogNavigation'

import styles from './home.module.css'

export const metadata = {
  title: 'Demo catalog',
  description: 'A mock test preparation catalog for client review.',
  robots: { index: false, follow: false },
}

export default async function HomePage() {
  const categories = await getCatalogNavigation()
  const tests = categories.flatMap((category) => category.tests)
  const featuredTest = tests[0]
  const featuredTestHref = featuredTest ? `/${featuredTest.slug}-practice-test` : '/demo-tests'

  return (
    <main className={styles.home}>
      <p className={styles.demoNotice} role="note">
        <span aria-hidden="true" className={styles.noticeMark}>
          i
        </span>
        <span>
          <strong>Preview environment</strong>
          <span className={styles.noticeDivider} aria-hidden="true">
            ·
          </span>
          Sample content is for client review and does not describe real exams.
        </span>
      </p>
      <section aria-labelledby="home-title" className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>
              <span aria-hidden="true" className={styles.brandMark}>
                T
              </span>
              Test prep platform preview
            </p>
            <h1 id="home-title">Your next step in test prep starts here.</h1>
            <p className={styles.heroLead}>
              Explore a sample test guide, try an original practice question, and review a course
              outline.
            </p>
            <div className={styles.heroActions}>
              <ButtonLink href={featuredTestHref} size="large">
                Explore the sample test <span aria-hidden="true">↗</span>
              </ButtonLink>
              <Link className={styles.secondaryAction} href="#catalog">
                Browse the catalog <span aria-hidden="true">↓</span>
              </Link>
            </div>
            <p className={styles.heroFootnote}>Mock content · No sign-in or saved progress</p>
          </div>

          <article aria-label="Featured sample test" className={styles.featureCard}>
            <div className={styles.cardTopline}>
              <span className={styles.previewBadge}>Sample content</span>
              <span className={styles.cardType}>Guide · Practice · Course</span>
            </div>
            <div aria-hidden="true" className={styles.cardArtwork}>
              <span className={styles.artworkLabel}>YOUR STUDY SPACE</span>
              <span className={styles.artworkNumber}>01</span>
              <span className={styles.artworkLine} />
              <span className={styles.artworkLineShort} />
              <span className={styles.artworkDot} />
            </div>
            <div className={styles.featureContent}>
              <p className={styles.featureEyebrow}>Featured demo</p>
              <h2>{featuredTest?.name ?? 'Sample test guide'}</h2>
              <p>
                {featuredTest?.shortDescription ?? 'Mock guide and practice content for review.'}
              </p>
              <Link className={styles.featureLink} href={featuredTestHref}>
                Open sample guide <span aria-hidden="true">→</span>
              </Link>
            </div>
            <span aria-hidden="true" className={styles.cardStamp}>
              DEMO
            </span>
          </article>
        </div>
      </section>

      <section aria-labelledby="catalog-heading" className={styles.catalog} id="catalog">
        <div className={styles.catalogHeader}>
          <div>
            <p className={styles.sectionEyebrow}>Explore the mock catalog</p>
            <h2 id="catalog-heading">Find a place to start</h2>
            <p>Browse the sample category or search for a test by name.</p>
          </div>
          <span className={styles.catalogCount}>
            {categories.length} {categories.length === 1 ? 'category' : 'categories'}
          </span>
        </div>

        <div className={styles.catalogGrid}>
          {categories.length ? (
            <section aria-labelledby="category-heading" className={styles.categoryPanel}>
              <div className={styles.panelHeading}>
                <span aria-hidden="true" className={styles.panelIcon}>
                  01
                </span>
                <div>
                  <p className={styles.panelEyebrow}>Browse</p>
                  <h3 id="category-heading">Categories</h3>
                </div>
              </div>
              <ul className={styles.categoryList}>
                {categories.map((category) => (
                  <li key={category.id}>
                    <CategoryTile category={category} />
                  </li>
                ))}
              </ul>
            </section>
          ) : (
            <section aria-labelledby="empty-catalog-heading" className={styles.emptyCatalog}>
              <p className={styles.panelEyebrow}>Catalog</p>
              <h3 id="empty-catalog-heading">The test catalog is being prepared</h3>
              <p>Published tests will appear here.</p>
            </section>
          )}

          <div className={styles.searchPanel}>
            <TestSearch categories={categories} />
          </div>
        </div>
      </section>

      <aside className={styles.previewNote}>
        <span aria-hidden="true" className={styles.previewNoteMark}>
          ✓
        </span>
        <p>
          <strong>This is a design preview.</strong> Search and practice interactions are local to
          this page. No answers, progress, or account details are saved.
        </p>
      </aside>
    </main>
  )
}
