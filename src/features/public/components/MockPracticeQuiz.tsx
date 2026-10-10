'use client'

import { useState } from 'react'

import { Button } from '@/components/ui'
import { QuestionCard } from '@/features/quiz/components/QuestionCard'
import type { QuizAnswer, QuizQuestionDTO } from '@/features/quiz/types'

import styles from './mock-practice-quiz.module.css'

export function MockPracticeQuiz({ question }: { question: QuizQuestionDTO }) {
  const [answer, setAnswer] = useState<QuizAnswer>(null)
  const [submitted, setSubmitted] = useState(false)
  const selectedLabel = question.options?.find((option) => option.id === answer)?.label

  if (submitted) {
    return (
      <div aria-live="polite" className={styles.result}>
        <h3>Demo response complete</h3>
        <p>Your selection: {selectedLabel ?? 'No answer selected'}.</p>
        <p>This preview does not score or save answers.</p>
        <Button
          onClick={() => {
            setAnswer(null)
            setSubmitted(false)
          }}
          variant="secondary"
        >
          Try the demo again
        </Button>
      </div>
    )
  }

  return (
    <div className={styles.quiz}>
      <p className={styles.label}>Interactive demo · no score is recorded</p>
      <QuestionCard
        onAnswerChange={(questionId, nextAnswer) => {
          if (questionId === question.id) setAnswer(nextAnswer)
        }}
        question={question}
        value={answer}
      />
      <Button disabled={answer === null} onClick={() => setSubmitted(true)}>
        Submit demo response
      </Button>
    </div>
  )
}
