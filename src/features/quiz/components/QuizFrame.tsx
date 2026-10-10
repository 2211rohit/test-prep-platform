'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

import { Button } from '@/components/ui'

import styles from './quiz.module.css'

export function QuizInstructions({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section aria-labelledby="quiz-instructions-title" className={styles.instructions}>
      <h1 id="quiz-instructions-title">{title}</h1>
      <div>{children}</div>
    </section>
  )
}

export function QuizProgress({
  current,
  total,
  sectionLabel,
}: {
  current: number
  total: number
  sectionLabel?: string
}) {
  const safeTotal = Math.max(0, total)
  const safeCurrent = Math.min(Math.max(0, current), safeTotal)
  return (
    <div className={styles.progress}>
      {sectionLabel ? <p>{sectionLabel}</p> : null}
      <label htmlFor="quiz-progress">
        Question {safeCurrent} of {safeTotal}
      </label>
      <progress id="quiz-progress" max={safeTotal || 1} value={safeCurrent} />
    </div>
  )
}

export function QuizTimer({
  expiresAt,
  onTimeExpired,
  label = 'Time remaining',
}: {
  /** Server-provided deadline. The server must validate the deadline again on submit. */
  expiresAt: string
  onTimeExpired?: () => void
  label?: string
}) {
  const [now, setNow] = useState(() => Date.now())
  const expiredCallback = useRef(onTimeExpired)
  const fired = useRef(false)
  useEffect(() => {
    expiredCallback.current = onTimeExpired
  }, [onTimeExpired])
  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(interval)
  }, [])

  const deadline = Date.parse(expiresAt)
  const seconds = Number.isFinite(deadline) ? Math.max(0, Math.ceil((deadline - now) / 1000)) : null
  const minutes = seconds === null ? null : Math.floor(seconds / 60)
  const remainingSeconds = seconds === null ? null : seconds % 60
  const warning = seconds !== null && seconds <= 60
  const critical = seconds !== null && seconds <= 10
  useEffect(() => {
    if (seconds === 0 && !fired.current) {
      fired.current = true
      expiredCallback.current?.()
    }
  }, [seconds])
  const announcement =
    seconds === 60 ? 'One minute remaining.' : seconds === 10 ? 'Ten seconds remaining.' : ''

  return (
    <div
      className={`${styles.timer} ${warning ? styles.timerWarning : ''} ${critical ? styles.timerCritical : ''}`}
    >
      <span>{label}</span>
      <time
        dateTime={
          minutes !== null && remainingSeconds !== null
            ? `PT${minutes}M${remainingSeconds}S`
            : undefined
        }
      >
        {minutes !== null && remainingSeconds !== null
          ? `${minutes}:${String(remainingSeconds).padStart(2, '0')}`
          : '—'}
      </time>
      <span aria-live="polite" className={styles.srOnly}>
        {announcement}
      </span>
    </div>
  )
}

export function QuestionNavigator({
  questions,
  currentId,
  onNavigate,
}: {
  questions: Array<{
    id: string
    label: string
    answered: boolean
    flagged: boolean
    canNavigate?: boolean
  }>
  currentId: string
  onNavigate: (id: string) => void
}) {
  return (
    <nav aria-label="Question navigation" className={styles.questionNavigator}>
      <ol>
        {questions.map((question, index) => (
          <li key={question.id}>
            <button
              aria-current={question.id === currentId ? 'step' : undefined}
              aria-label={`Question ${question.label}${question.answered ? ', answered' : ', unanswered'}${question.flagged ? ', flagged for review' : ''}`}
              className={styles.navQuestion}
              disabled={question.canNavigate === false}
              onClick={() => onNavigate(question.id)}
              type="button"
            >
              <span>{index + 1}</span>
              <span className={styles.srOnly}>
                {question.answered ? 'Answered' : 'Not answered'}
                {question.flagged ? ', flagged' : ''}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  )
}

export function QuizControls({
  canGoBack,
  canGoForward,
  flagged,
  onBack,
  onForward,
  onToggleFlag,
  onReview,
  showReview = true,
}: {
  canGoBack: boolean
  canGoForward: boolean
  flagged: boolean
  onBack: () => void
  onForward: () => void
  onToggleFlag: () => void
  onReview?: () => void
  showReview?: boolean
}) {
  return (
    <div className={styles.quizControls}>
      <Button onClick={onBack} variant="secondary" disabled={!canGoBack}>
        Previous
      </Button>
      <Button aria-pressed={flagged} onClick={onToggleFlag} variant="quiet">
        {flagged ? 'Remove flag' : 'Flag for review'}
      </Button>
      {showReview && onReview ? (
        <Button onClick={onReview} variant="secondary">
          Review answers
        </Button>
      ) : null}
      <Button onClick={onForward} disabled={!canGoForward}>
        Next
      </Button>
    </div>
  )
}

export function SectionTransition({
  title,
  instructions,
  onContinue,
}: {
  title: string
  instructions: ReactNode
  onContinue: () => void
}) {
  return (
    <section aria-labelledby="section-transition-title" className={styles.transition}>
      <p className={styles.questionType}>Section complete</p>
      <h1 id="section-transition-title">{title}</h1>
      <div>{instructions}</div>
      <Button onClick={onContinue}>Continue to section</Button>
    </section>
  )
}

export function SimulationShell({
  children,
  active = true,
}: {
  children: ReactNode
  active?: boolean
}) {
  useEffect(() => {
    if (!active) return
    const warnOnExit = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', warnOnExit)
    return () => window.removeEventListener('beforeunload', warnOnExit)
  }, [active])
  return (
    <main className={styles.simulationShell} id="simulation-main">
      {children}
    </main>
  )
}

export function QuizFrame({
  title,
  children,
  timer,
}: {
  title: string
  children: ReactNode
  timer?: ReactNode
}) {
  return (
    <main className={styles.quizFrame}>
      <header className={styles.quizFrameHeader}>
        <p>{title}</p>
        {timer}
      </header>
      {children}
    </main>
  )
}
