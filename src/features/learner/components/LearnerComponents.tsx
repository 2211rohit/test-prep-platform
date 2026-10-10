import Link from 'next/link'
import type { ReactNode } from 'react'

import { ButtonLink } from '@/components/ui'

import styles from './learner.module.css'

export type LearnerCourseSummary = {
  id: string | number
  title: string
  href: string
  completionPercent: number
  latestScoreLabel?: string | null
  nextStep?: { label: string; href: string } | null
  daysRemaining?: number | null
}

function safePercent(value: number) {
  return Math.min(100, Math.max(0, Math.round(value)))
}

export function DashboardHeading({
  name,
  testDateLabel,
}: {
  name: string
  testDateLabel?: string | null
}) {
  return (
    <header className={styles.dashboardHeading}>
      <div>
        <p className={styles.eyebrow}>Your learning dashboard</p>
        <h1>Welcome, {name}</h1>
      </div>
      {testDateLabel ? (
        <p className={styles.datePill}>
          Test date: <strong>{testDateLabel}</strong>
        </p>
      ) : null}
    </header>
  )
}

export function OwnedCourseCard({ course }: { course: LearnerCourseSummary }) {
  const completion = safePercent(course.completionPercent)
  return (
    <article className={styles.courseCard}>
      <div className={styles.courseCardHeading}>
        <h2>
          <Link href={course.href}>{course.title}</Link>
        </h2>
        {course.daysRemaining != null ? <span>{course.daysRemaining} days remaining</span> : null}
      </div>
      <label htmlFor={`course-progress-${course.id}`}>Course progress: {completion}%</label>
      <progress id={`course-progress-${course.id}`} max="100" value={completion}>
        {completion}%
      </progress>
      {course.latestScoreLabel ? (
        <p className={styles.muted}>Latest simulation: {course.latestScoreLabel}</p>
      ) : null}
      {course.nextStep ? (
        <div className={styles.nextStep}>
          <p>
            <strong>Next step</strong>
            <br />
            {course.nextStep.label}
          </p>
          <ButtonLink href={course.nextStep.href} size="small">
            Continue
          </ButtonLink>
        </div>
      ) : null}
    </article>
  )
}

export function OwnedCourses({
  courses,
  heading = 'Your courses',
}: {
  courses: LearnerCourseSummary[]
  heading?: string
}) {
  return (
    <section aria-labelledby="owned-courses-heading" className={styles.section}>
      <h2 id="owned-courses-heading">{heading}</h2>
      {courses.length ? (
        <div className={styles.courseGrid}>
          {courses.map((course) => (
            <OwnedCourseCard course={course} key={course.id} />
          ))}
        </div>
      ) : (
        <p className={styles.emptyState}>Your courses will appear here after you start one.</p>
      )}
    </section>
  )
}

export function ReadinessIndicator({
  status,
  scoreLabel,
  description,
}: {
  status: 'Not ready' | 'Borderline' | 'Ready'
  scoreLabel?: string
  description?: string
}) {
  return (
    <section aria-labelledby="readiness-heading" className={styles.readiness}>
      <p className={styles.eyebrow}>Readiness estimate</p>
      <h2 id="readiness-heading">{status}</h2>
      {scoreLabel ? <p className={styles.readinessScore}>{scoreLabel}</p> : null}
      <p>
        {description ??
          'This estimate is based on recent timed practice. It is not a guarantee of a test result.'}
      </p>
    </section>
  )
}

export function SectionMastery({
  sections,
}: {
  sections: Array<{
    id: string
    name: string
    accuracyPercent: number
    averageSecondsLabel: string
  }>
}) {
  return (
    <section aria-labelledby="section-mastery-heading" className={styles.section}>
      <h2 id="section-mastery-heading">Section mastery</h2>
      {sections.length ? (
        <div className={styles.masteryList}>
          {sections.map((section) => {
            const accuracy = safePercent(section.accuracyPercent)
            return (
              <div className={styles.masteryItem} key={section.id}>
                <div className={styles.masteryHeading}>
                  <strong>{section.name}</strong>
                  <span>
                    {accuracy}% accuracy · {section.averageSecondsLabel} average per item
                  </span>
                </div>
                <progress
                  aria-label={`${section.name}: ${accuracy}% accuracy`}
                  max="100"
                  value={accuracy}
                >
                  {accuracy}%
                </progress>
              </div>
            )
          })}
        </div>
      ) : (
        <p className={styles.emptyState}>
          Complete a practice attempt to see your section progress.
        </p>
      )}
    </section>
  )
}

export function TestDatePlan({
  testDateLabel,
  tasks,
}: {
  testDateLabel: string
  tasks: Array<{ id: string; dateLabel: string; title: string; href?: string; complete?: boolean }>
}) {
  return (
    <section aria-labelledby="test-date-plan-heading" className={styles.section}>
      <div className={styles.sectionHeading}>
        <div>
          <h2 id="test-date-plan-heading">Plan for {testDateLabel}</h2>
          <p className={styles.muted}>Your study plan, day by day.</p>
        </div>
      </div>
      {tasks.length ? (
        <ol className={styles.planList}>
          {tasks.map((task) => (
            <li key={task.id}>
              <span
                className={task.complete ? styles.taskComplete : styles.taskMarker}
                aria-hidden="true"
              >
                {task.complete ? '✓' : '•'}
              </span>
              <time>{task.dateLabel}</time>
              {task.href ? <Link href={task.href}>{task.title}</Link> : <span>{task.title}</span>}
            </li>
          ))}
        </ol>
      ) : (
        <p className={styles.emptyState}>No study tasks are scheduled yet.</p>
      )}
    </section>
  )
}

export type CourseOutlineModule = {
  id: string | number
  title: string
  lessons: Array<{
    id: string | number
    title: string
    href?: string
    completed: boolean
    locked?: boolean
  }>
}

export function CoursePlayerOutline({
  modules,
  upgradeHref,
}: {
  modules: CourseOutlineModule[]
  upgradeHref: string
}) {
  return (
    <nav aria-label="Course lessons" className={styles.outline}>
      <h2>Course outline</h2>
      {modules.map((module) => (
        <section className={styles.outlineModule} key={module.id}>
          <h3>{module.title}</h3>
          <ol>
            {module.lessons.map((lesson) => (
              <li key={lesson.id}>
                {lesson.locked ? (
                  <details className={styles.lockedLesson}>
                    <summary>
                      <span aria-hidden="true">🔒</span> {lesson.title}{' '}
                      <span className={styles.lockLabel}>Unlock with Full Prep</span>
                    </summary>
                    <div>
                      <p>This lesson is included with Full Prep access.</p>
                      <ButtonLink href={upgradeHref} size="small">
                        View upgrade options
                      </ButtonLink>
                    </div>
                  </details>
                ) : (
                  <>
                    {lesson.completed ? (
                      <span className={styles.completionMark} aria-label="Complete">
                        ✓
                      </span>
                    ) : (
                      <span aria-hidden="true" className={styles.incompleteMark}>
                        ○
                      </span>
                    )}
                    {lesson.href ? (
                      <Link href={lesson.href}>{lesson.title}</Link>
                    ) : (
                      <span>{lesson.title}</span>
                    )}
                  </>
                )}
              </li>
            ))}
          </ol>
        </section>
      ))}
    </nav>
  )
}

export function ContinueLearning({
  href,
  label = 'Continue where you left off',
}: {
  href: string
  label?: string
}) {
  return (
    <ButtonLink href={href} size="large">
      {label}
    </ButtonLink>
  )
}

export function LessonContent({
  title,
  children,
  completed = false,
}: {
  title: string
  children: ReactNode
  completed?: boolean
}) {
  return (
    <article className={styles.lesson}>
      <header>
        <p className={styles.eyebrow}>Lesson</p>
        <h1>{title}</h1>
        {completed ? <p className={styles.completionText}>Lesson complete</p> : null}
      </header>
      <div className={styles.lessonBody}>{children}</div>
    </article>
  )
}

export function DrillRecommendation({
  section,
  href,
  reason,
}: {
  section: string
  href: string
  reason: string
}) {
  return (
    <aside className={styles.recommendation}>
      <div>
        <p className={styles.eyebrow}>Recommended drill</p>
        <h2>{section}</h2>
        <p>{reason}</p>
      </div>
      <ButtonLink href={href}>Start drill</ButtonLink>
    </aside>
  )
}

export function AccessExpiryBanner({
  daysRemaining,
  href,
}: {
  daysRemaining: number
  href: string
}) {
  const lastDay = daysRemaining <= 1
  return (
    <aside aria-label="Access expiration notice" className={styles.expiryBanner}>
      <p>
        {lastDay ? 'Your access ends today.' : `${daysRemaining} days left in your access.`} Your
        completed lessons and scores remain available after expiry.
      </p>
      <Link href={href}>See access options</Link>
    </aside>
  )
}

export function ExpiredAccessState({
  children,
  upgradeHref,
}: {
  children?: ReactNode
  upgradeHref: string
}) {
  return (
    <section className={styles.expiredState}>
      <p className={styles.eyebrow}>Access ended</p>
      <h2>Your past learning is still here</h2>
      <p>
        You can view saved scores and review completed attempts. Start new lessons and attempts
        after renewing access.
      </p>
      {children}
      <ButtonLink href={upgradeHref}>View access options</ButtonLink>
    </section>
  )
}

export function ReceiptList({
  receipts,
}: {
  receipts: Array<{
    id: string
    dateLabel: string
    description: string
    amountLabel: string
    href: string
  }>
}) {
  return (
    <section aria-labelledby="receipts-heading" className={styles.section}>
      <h2 id="receipts-heading">Receipts</h2>
      {receipts.length ? (
        <ul className={styles.receiptList}>
          {receipts.map((receipt) => (
            <li key={receipt.id}>
              <div>
                <strong>{receipt.description}</strong>
                <span>
                  {receipt.dateLabel} · {receipt.amountLabel}
                </span>
              </div>
              <Link href={receipt.href}>Download receipt</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.emptyState}>You do not have any receipts yet.</p>
      )}
    </section>
  )
}

export function AccountDataControls({
  exportHref,
  deletionAction,
}: {
  exportHref: string
  deletionAction: (formData: FormData) => void | Promise<void>
}) {
  return (
    <section aria-labelledby="data-controls-heading" className={styles.section}>
      <h2 id="data-controls-heading">Your data</h2>
      <p>Download a copy of your account data or ask to delete your account.</p>
      <div className={styles.dataActions}>
        <ButtonLink href={exportHref} variant="secondary">
          Download my data
        </ButtonLink>
        <form action={deletionAction}>
          <label htmlFor="delete-confirmation">Type DELETE to confirm account deletion</label>
          <input
            autoComplete="off"
            id="delete-confirmation"
            name="confirmation"
            pattern="DELETE"
            required
            title="Enter DELETE to submit this request."
          />
          <button className={styles.dangerButton} type="submit">
            Request account deletion
          </button>
        </form>
      </div>
    </section>
  )
}
