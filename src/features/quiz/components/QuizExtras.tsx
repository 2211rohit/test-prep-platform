'use client'

import { useState } from 'react'

import { Button } from '@/components/ui'

import styles from './quiz.module.css'

type ReviewQuestion = { id: string; answered: boolean; flagged: boolean }

export function PreSubmitReview({
  questions,
  onSelect,
  onReturn,
  onSubmit,
}: {
  questions: ReviewQuestion[]
  onSelect: (id: string) => void
  onReturn: () => void
  onSubmit: () => void
}) {
  const unanswered = questions.filter((question) => !question.answered).length
  const flagged = questions.filter((question) => question.flagged).length
  return (
    <section aria-labelledby="pre-submit-review-heading" className={styles.instructions}>
      <p className={styles.questionType}>Review before submit</p>
      <h1 id="pre-submit-review-heading">Check your answers</h1>
      <p>
        {unanswered} unanswered · {flagged} flagged for review
      </p>
      <ol className={styles.reviewQuestionList}>
        {questions.map((question, index) => (
          <li key={question.id}>
            <span>
              Question {index + 1}: {question.answered ? 'Answered' : 'Not answered'}
              {question.flagged ? ', flagged' : ''}
            </span>
            <Button onClick={() => onSelect(question.id)} variant="quiet">
              Go to question {index + 1}
            </Button>
          </li>
        ))}
      </ol>
      <div className={styles.quizControls}>
        <Button onClick={onReturn} variant="secondary">
          Return to quiz
        </Button>
        <Button onClick={onSubmit}>Submit answers</Button>
      </div>
    </section>
  )
}

export function CalculatorPad() {
  const [first, setFirst] = useState('')
  const [second, setSecond] = useState('')
  const [operator, setOperator] = useState<'+' | '−' | '×' | '÷'>('+')
  const [result, setResult] = useState('')
  function calculate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const a = Number(first)
    const b = Number(second)
    if (!first || !second || (operator === '÷' && b === 0)) {
      setResult(operator === '÷' && b === 0 ? 'Cannot divide by zero.' : 'Enter two numbers.')
      return
    }
    const answer =
      operator === '+' ? a + b : operator === '−' ? a - b : operator === '×' ? a * b : a / b
    setResult(String(Number.isInteger(answer) ? answer : Number(answer.toFixed(6))))
  }
  return (
    <form className={styles.calculator} onSubmit={calculate}>
      <label>
        First number
        <input
          inputMode="decimal"
          onChange={(event) => setFirst(event.target.value)}
          type="number"
          value={first}
        />
      </label>
      <label>
        Operation
        <select
          onChange={(event) => setOperator(event.target.value as typeof operator)}
          value={operator}
        >
          <option value="+">Add</option>
          <option value="−">Subtract</option>
          <option value="×">Multiply</option>
          <option value="÷">Divide</option>
        </select>
      </label>
      <label>
        Second number
        <input
          inputMode="decimal"
          onChange={(event) => setSecond(event.target.value)}
          type="number"
          value={second}
        />
      </label>
      <Button type="submit" variant="secondary">
        Calculate
      </Button>
      <output aria-live="polite">{result}</output>
    </form>
  )
}

export function QuizUtilities({
  calculatorAllowed,
  scratchpadAllowed,
}: {
  calculatorAllowed: boolean
  scratchpadAllowed: boolean
}) {
  if (!calculatorAllowed && !scratchpadAllowed) return null
  return (
    <aside aria-label="Quiz tools" className={styles.quizUtilities}>
      {calculatorAllowed ? (
        <details>
          <summary>Calculator</summary>
          <CalculatorPad />
        </details>
      ) : null}
      {scratchpadAllowed ? (
        <details>
          <summary>Scratchpad</summary>
          <label className={styles.srOnly} htmlFor="quiz-scratchpad">
            Scratchpad notes
          </label>
          <textarea id="quiz-scratchpad" rows={8} />
        </details>
      ) : null}
    </aside>
  )
}
