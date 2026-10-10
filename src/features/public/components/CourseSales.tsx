import Link from 'next/link'
import type { ReactNode } from 'react'

import { ButtonLink } from '@/components/ui'

import styles from './course-sales.module.css'

export type CourseModuleSummary = {
  id: string | number
  title: string
  summary?: string | null
  lessons: Array<{ id: string | number; title: string; durationLabel?: string | null }>
}

export function CourseOverview({
  title,
  summary,
  detail,
  children,
}: {
  title: string
  summary: string
  detail?: ReactNode
  children?: ReactNode
}) {
  return (
    <section aria-labelledby="course-overview-title" className={styles.overview}>
      <p className={styles.eyebrow}>Course overview</p>
      <h1 id="course-overview-title">{title}</h1>
      <p className={styles.lead}>{summary}</p>
      {detail ? <div className={styles.detail}>{detail}</div> : null}
      {children}
    </section>
  )
}

export function SyllabusOutline({
  modules,
  heading = 'What you will study',
}: {
  modules: CourseModuleSummary[]
  heading?: string
}) {
  return (
    <section aria-labelledby="syllabus-heading" className={styles.section}>
      <h2 id="syllabus-heading">{heading}</h2>
      {modules.length === 0 ? (
        <p className={styles.muted}>The course outline is being prepared.</p>
      ) : (
        <ol className={styles.moduleList}>
          {modules.map((module, index) => (
            <li className={styles.module} key={module.id}>
              <div className={styles.moduleHeading}>
                <span className={styles.moduleNumber} aria-hidden="true">
                  {index + 1}
                </span>
                <div>
                  <h3>{module.title}</h3>
                  {module.summary ? <p>{module.summary}</p> : null}
                </div>
              </div>
              {module.lessons.length > 0 ? (
                <ul className={styles.lessonList}>
                  {module.lessons.map((lesson) => (
                    <li key={lesson.id}>
                      <span>{lesson.title}</span>
                      {lesson.durationLabel ? <span>{lesson.durationLabel}</span> : null}
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}

export function SampleLesson({
  title,
  children,
  label = 'Sample lesson',
}: {
  title: string
  children: ReactNode
  label?: string
}) {
  return (
    <section aria-labelledby="sample-lesson-title" className={styles.sample}>
      <p className={styles.eyebrow}>{label}</p>
      <h2 id="sample-lesson-title">{title}</h2>
      <div className={styles.lessonContent}>{children}</div>
    </section>
  )
}

export function PriceAndAccessPanel({
  productName,
  priceLabel,
  durationDays,
  purchaseHref,
  freeStartHref,
  currency = 'USD',
  priceCents,
}: {
  productName: string
  priceLabel?: string
  priceCents?: number
  currency?: string
  durationDays: number
  purchaseHref: string
  freeStartHref?: string
}) {
  const displayedPrice =
    priceLabel ??
    (typeof priceCents === 'number'
      ? new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(priceCents / 100)
      : null)

  return (
    <section aria-labelledby="price-access-heading" className={styles.pricePanel}>
      <div>
        <p className={styles.eyebrow}>Full Prep access</p>
        <h2 id="price-access-heading">{productName}</h2>
        <p className={styles.price}>{displayedPrice ?? 'Price shown at checkout'}</p>
        <p className={styles.muted}>{durationDays} days of access after purchase.</p>
        <p className={styles.refundNote}>
          You can request a refund within 7 days of purchase. Requests are reviewed by the support
          team.
        </p>
      </div>
      <div className={styles.actions}>
        <ButtonLink href={purchaseHref} size="large">
          Continue to checkout
        </ButtonLink>
        {freeStartHref ? <Link href={freeStartHref}>Start free access</Link> : null}
      </div>
    </section>
  )
}

export function CourseCTA({
  title,
  description,
  href,
  label,
}: {
  title: string
  description: string
  href: string
  label: string
}) {
  return (
    <aside className={styles.courseCTA}>
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <ButtonLink href={href}>{label}</ButtonLink>
    </aside>
  )
}
