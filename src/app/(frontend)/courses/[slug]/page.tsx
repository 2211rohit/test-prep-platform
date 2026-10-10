import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Breadcrumbs } from '@/components/navigation/Breadcrumbs'
import { ButtonLink } from '@/components/ui'
import {
  BreadcrumbListJsonLd,
  CourseJsonLd,
  CourseOverview,
  SampleLesson,
  SyllabusOutline,
} from '@/features/public/components'
import { mockPracticeGuide } from '@/mocks/testPrepData'

import styles from '../../mock-pages.module.css'

type RouteProps = { params: Promise<{ slug: string }> }
const demoBaseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export function generateStaticParams() {
  return [{ slug: mockPracticeGuide.slug }]
}

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const { slug } = await params
  if (slug !== mockPracticeGuide.slug) return { title: 'Page not found', robots: { index: false } }
  return {
    title: `${mockPracticeGuide.course.title} — demo course`,
    description: mockPracticeGuide.course.summary,
    robots: { index: false, follow: false },
  }
}

export default async function MockCoursePage({ params }: RouteProps) {
  const { slug } = await params
  if (slug !== mockPracticeGuide.slug) notFound()
  const course = mockPracticeGuide.course
  const courseUrl = new URL(`/courses/${slug}`, demoBaseUrl).toString()
  const breadcrumbItems = [
    { name: 'Home', url: demoBaseUrl },
    {
      name: mockPracticeGuide.title,
      url: new URL(`/${slug}-practice-test`, demoBaseUrl).toString(),
    },
    { name: course.title, url: courseUrl },
  ]

  return (
    <main className={styles.page}>
      <p className={styles.demoNotice} role="note">
        DEMO CONTENT · No lessons, purchase, or paid access are available.
      </p>
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: mockPracticeGuide.title, href: `/${slug}-practice-test` },
          { label: course.title },
        ]}
      />
      <CourseOverview
        detail={<p>This mock course is for reviewing the layout only.</p>}
        summary={course.summary}
        title={course.title}
      />
      <SyllabusOutline modules={course.modules} />
      <SampleLesson label="Sample lesson preview" title="How to use this demo">
        <p>
          This is placeholder lesson copy. Real course material will be added after client approval.
        </p>
      </SampleLesson>
      <section className={styles.courseCallout}>
        <div>
          <h2>No purchase is available in this demo</h2>
          <p>Checkout and access controls will be connected after backend approval.</p>
        </div>
        <ButtonLink href={`/${slug}-practice-test`} variant="secondary">
          Return to practice guide
        </ButtonLink>
      </section>
      <p>
        <Link href="/">Back to the demo catalog</Link>
      </p>
      <CourseJsonLd description={course.summary} name={course.title} url={courseUrl} />
      <BreadcrumbListJsonLd items={breadcrumbItems} />
    </main>
  )
}
