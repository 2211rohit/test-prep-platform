import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import {
  Disclaimer,
  EmbeddedQuizShell,
  HeroSection,
  ScoringExplainer,
  SectionCards,
  TestFactsTable,
  WorkedExample,
} from '@/components/content/ContentSections'
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs'
import { TestCard } from '@/components/navigation/TestCard'
import { BreadcrumbListJsonLd, FAQPageJsonLd, MockPracticeQuiz } from '@/features/public/components'
import { mockCatalogNavigation, mockPracticeGuide } from '@/mocks/testPrepData'

import styles from '../mock-pages.module.css'

type RouteProps = { params: Promise<{ slug: string }> }
const demoBaseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
const practiceSuffix = '-practice-test'

export function generateStaticParams() {
  return [
    { slug: mockPracticeGuide.category.slug },
    { slug: `${mockPracticeGuide.slug}${practiceSuffix}` },
  ]
}

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const { slug } = await params
  if (slug === mockPracticeGuide.category.slug) {
    return {
      title: 'Demo tests',
      description: 'Demo catalog category for client review.',
      robots: { index: false, follow: false },
    }
  }
  if (slug === `${mockPracticeGuide.slug}${practiceSuffix}`) {
    return {
      title: `${mockPracticeGuide.title} — demo practice guide`,
      description: mockPracticeGuide.description,
      robots: { index: false, follow: false },
    }
  }
  return { title: 'Page not found', robots: { index: false, follow: false } }
}

export default async function MockCatalogPage({ params }: RouteProps) {
  const { slug } = await params
  if (slug === mockPracticeGuide.category.slug) return <MockCategoryPage />
  if (slug === `${mockPracticeGuide.slug}${practiceSuffix}`) return <MockPracticeGuidePage />
  notFound()
}

function MockCategoryPage() {
  const category = mockCatalogNavigation.find(
    (item) => item.slug === mockPracticeGuide.category.slug,
  )
  if (!category) notFound()

  return (
    <main className={styles.page}>
      <p className={styles.demoNotice} role="note">
        Demo data only · not a real test catalog
      </p>
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: category.name }]} />
      <header className={styles.pageHeader}>
        <p className={styles.eyebrow}>Demo category</p>
        <h1>{category.name}</h1>
        <p>This category and its sample entry are mock content for client review.</p>
      </header>
      <section aria-labelledby="mock-category-tests" className={styles.testList}>
        <h2 id="mock-category-tests">Sample test pages</h2>
        <ul>
          {category.tests.map((test) => (
            <li key={test.id}>
              <TestCard test={test} />
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}

function MockPracticeGuidePage() {
  const guide = mockPracticeGuide
  const structuredBreadcrumbs = [
    { name: 'Home', url: demoBaseUrl },
    { name: guide.category.name, url: new URL(`/${guide.category.slug}`, demoBaseUrl).toString() },
    { name: guide.title, url: new URL(`/${guide.slug}${practiceSuffix}`, demoBaseUrl).toString() },
  ]

  return (
    <main className={styles.page}>
      <p className={styles.demoNotice} role="note">
        DEMO CONTENT · This page is illustrative and does not describe a real test.
      </p>
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: guide.category.name, href: `/${guide.category.slug}` },
          { label: guide.title },
        ]}
      />
      <HeroSection
        body={<p>{guide.description}</p>}
        eyebrow="Mock practice guide"
        heading={guide.title}
      />
      <TestFactsTable facts={guide.facts} heading="Demo page facts" />
      <SectionCards heading="Example sections" sections={guide.sections} />
      {guide.workedExamples.map((example) => (
        <WorkedExample
          example={<p>{example.example}</p>}
          id={example.id}
          key={example.id}
          questionType={example.questionType}
          reasoning={<p>{example.reasoning}</p>}
          tip={example.tip}
          title={example.title}
        />
      ))}
      <EmbeddedQuizShell intro="This original demo item is interactive, but it does not save or score your response.">
        <MockPracticeQuiz question={guide.quizQuestion} />
      </EmbeddedQuizShell>
      <ScoringExplainer heading={guide.scoringHeading}>
        <p>{guide.scoringCopy}</p>
      </ScoringExplainer>
      <section aria-labelledby="demo-faq-heading" className={styles.section}>
        <h2 id="demo-faq-heading">Frequently asked questions</h2>
        <div className={styles.faqList}>
          {guide.faqs.map((faq) => (
            <details key={faq.question}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
      <section className={styles.courseCallout}>
        <div>
          <h2>Review the sample course outline</h2>
          <p>This course outline is also mock content.</p>
        </div>
        <Link href="/courses/sample-aptitude">View course demo</Link>
      </section>
      <section
        aria-labelledby="sample-course-outline-heading"
        className={styles.section}
        id="sample-course-outline"
      >
        <h2 id="sample-course-outline-heading">{guide.course.title}</h2>
        <p>{guide.course.summary}</p>
        <ol className={styles.moduleList}>
          {guide.course.modules.map((module) => (
            <li key={module.id}>
              <h3>{module.title}</h3>
              <p>{module.summary}</p>
              <ul>
                {module.lessons.map((lesson) => (
                  <li key={lesson.id}>{lesson.title}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>
      <Disclaimer
        content="Mock content for design review. It does not describe a real test or include verified exam facts."
        publisherName="a real exam provider"
      />
      <FAQPageJsonLd items={guide.faqs} />
      <BreadcrumbListJsonLd items={structuredBreadcrumbs} />
    </main>
  )
}
