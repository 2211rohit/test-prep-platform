import Link from 'next/link'
import type { ReactNode } from 'react'

import styles from './quiz.module.css'

export function ScoreSummary({
  scoreLabel,
  passLabel,
  children,
}: {
  scoreLabel: string
  passLabel?: string
  children?: ReactNode
}) {
  return (
    <section aria-labelledby="score-summary-title" className={styles.resultSummary}>
      <p className={styles.questionType}>Your result</p>
      <h1 id="score-summary-title">{scoreLabel}</h1>
      {passLabel ? <p className={styles.resultStatus}>{passLabel}</p> : null}
      {children}
    </section>
  )
}

export function SectionScoreBreakdown({
  sections,
}: {
  sections: Array<{ id: string; name: string; scoreLabel: string; statusLabel?: string }>
}) {
  return (
    <section aria-labelledby="section-scores-title" className={styles.resultSection}>
      <h2 id="section-scores-title">Section scores</h2>
      <ul className={styles.scoreList}>
        {sections.map((section) => (
          <li key={section.id}>
            <span>{section.name}</span>
            <strong>{section.scoreLabel}</strong>
            {section.statusLabel ? <span>{section.statusLabel}</span> : null}
          </li>
        ))}
      </ul>
    </section>
  )
}

export function WeakestSectionCTA({ section, href }: { section: string; href: string }) {
  return (
    <aside className={styles.weakestCTA}>
      <div>
        <p className={styles.questionType}>Suggested next step</p>
        <h2>Practice {section}</h2>
        <p>Focus on this section in your next study session.</p>
      </div>
      <Link className={styles.actionLink} href={href}>
        Practice this section
      </Link>
    </aside>
  )
}

export function AnswerFeedback({
  status,
  heading,
  explanation,
  children,
}: {
  status: 'correct' | 'incorrect' | 'unscored'
  heading: string
  explanation: ReactNode
  children?: ReactNode
}) {
  const statusLabel =
    status === 'correct' ? 'Correct' : status === 'incorrect' ? 'Needs another look' : 'Not scored'
  return (
    <section
      aria-labelledby="answer-feedback-title"
      className={styles.feedback}
      data-status={status}
    >
      <p className={styles.questionType}>{statusLabel}</p>
      <h2 id="answer-feedback-title">{heading}</h2>
      <div>{explanation}</div>
      {children}
    </section>
  )
}

export function QuestionReviewCard({
  number,
  prompt,
  learnerAnswer,
  correctAnswer,
  explanation,
  flagged = false,
  secondsSpent,
}: {
  number: number
  prompt: ReactNode
  learnerAnswer: ReactNode
  correctAnswer: ReactNode
  explanation: ReactNode
  flagged?: boolean
  secondsSpent?: number
}) {
  return (
    <article className={styles.reviewCard}>
      <header>
        <h3>Question {number}</h3>
        {flagged ? <span className={styles.reviewFlag}>Flagged for review</span> : null}
        {typeof secondsSpent === 'number' ? <span>{secondsSpent} seconds</span> : null}
      </header>
      <div className={styles.reviewPrompt}>{prompt}</div>
      <dl>
        <div>
          <dt>Your answer</dt>
          <dd>{learnerAnswer}</dd>
        </div>
        <div>
          <dt>Correct answer</dt>
          <dd>{correctAnswer}</dd>
        </div>
      </dl>
      <div className={styles.explanation}>
        <h4>Explanation</h4>
        {explanation}
      </div>
    </article>
  )
}

export function ErrorTypeGroups({
  groups,
}: {
  groups: Array<{ errorType: string; section: string; count: number; href?: string }>
}) {
  if (groups.length === 0) return null
  return (
    <section aria-labelledby="error-patterns-title" className={styles.resultSection}>
      <h2 id="error-patterns-title">Patterns in your answers</h2>
      <ul className={styles.errorGroups}>
        {groups.map((group) => (
          <li key={`${group.section}-${group.errorType}`}>
            <div>
              <strong>
                {group.count} {group.errorType} errors
              </strong>
              <span>{group.section}</span>
            </div>
            {group.href ? <Link href={group.href}>Practice this section</Link> : null}
          </li>
        ))}
      </ul>
    </section>
  )
}

export function TimePaceTable({
  rows,
}: {
  rows: Array<{
    question: string
    secondsSpent: number
    targetSeconds: number
    resultLabel: string
  }>
}) {
  return (
    <section aria-labelledby="pace-table-title" className={styles.resultSection}>
      <h2 id="pace-table-title">Time per question</h2>
      <div className={styles.tableScroll}>
        <table>
          <thead>
            <tr>
              <th scope="col">Question</th>
              <th scope="col">Your time</th>
              <th scope="col">Target</th>
              <th scope="col">Result</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.question}>
                <th scope="row">{row.question}</th>
                <td>{row.secondsSpent}s</td>
                <td>{row.targetSeconds}s</td>
                <td>{row.resultLabel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export function ReviewFilters({
  value,
  onChange,
}: {
  value: 'all' | 'wrong' | 'flagged' | 'slow'
  onChange: (value: 'all' | 'wrong' | 'flagged' | 'slow') => void
}) {
  return (
    <fieldset className={styles.reviewFilters}>
      <legend>Filter questions</legend>
      {(['all', 'wrong', 'flagged', 'slow'] as const).map((filter) => (
        <label key={filter}>
          <input
            checked={value === filter}
            name="review-filter"
            onChange={() => onChange(filter)}
            type="radio"
            value={filter}
          />
          {filter === 'all' ? 'All' : filter[0].toUpperCase() + filter.slice(1)}
        </label>
      ))}
    </fieldset>
  )
}
