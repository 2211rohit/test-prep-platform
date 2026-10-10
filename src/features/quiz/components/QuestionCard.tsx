'use client'

import Image from 'next/image'
import { useEffect, useId, useRef, useState, type ReactNode } from 'react'

import type { QuestionAnswerChange, QuizAnswer, QuizQuestionDTO, QuestionType } from '../types'
import styles from './quiz.module.css'

type ItemProps = {
  question: QuizQuestionDTO
  value: QuizAnswer
  answers?: Record<string, QuizAnswer>
  onAnswerChange?: QuestionAnswerChange
  onStudyComplete?: () => void
  controlId: string
}

function OptionList({
  question,
  value,
  onAnswerChange,
  controlId,
  multiple = false,
  images = false,
}: ItemProps & { multiple?: boolean; images?: boolean }) {
  const selected = Array.isArray(value) ? value : value === null ? [] : [String(value)]
  const inputType = multiple ? 'checkbox' : 'radio'
  const options = question.options ?? []

  return (
    <fieldset className={styles.questionFieldset}>
      <legend className={styles.srOnly}>
        {multiple ? 'Select all answers that apply' : 'Choose one answer'}
      </legend>
      {multiple ? <p className={styles.helper}>Select all that apply.</p> : null}
      <div className={images ? styles.imageOptions : styles.optionList}>
        {options.map((option, index) => {
          const inputId = `${controlId}-${option.id}`
          return (
            <label className={styles.option} htmlFor={inputId} key={option.id}>
              <input
                checked={selected.includes(option.id)}
                id={inputId}
                name={controlId}
                onChange={(event) => {
                  if (!onAnswerChange) return
                  if (multiple) {
                    const next = event.target.checked
                      ? [...selected, option.id]
                      : selected.filter((id) => id !== option.id)
                    onAnswerChange(question.id, next)
                  } else {
                    onAnswerChange(question.id, option.id)
                  }
                }}
                type={inputType}
                value={option.id}
              />
              <span className={styles.optionLetter} aria-hidden="true">
                {String.fromCharCode(65 + index)}
              </span>
              <span className={styles.optionContent}>
                {option.image ? (
                  <Image alt={option.image.alt} height={150} src={option.image.src} width={220} />
                ) : null}
                <span>{option.label}</span>
              </span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

function MCQSingle(props: ItemProps) {
  return <OptionList {...props} />
}
function MCQMulti(props: ItemProps) {
  return <OptionList {...props} multiple />
}
function ImageMCQ(props: ItemProps) {
  return <OptionList {...props} images />
}
function SequenceItem(props: ItemProps) {
  return <OptionList {...props} />
}

function NumericEntry({ question, value, onAnswerChange, controlId }: ItemProps) {
  return (
    <label className={styles.inputField} htmlFor={controlId}>
      <span>Your answer</span>
      <input
        autoComplete="off"
        id={controlId}
        inputMode="decimal"
        onChange={(event) =>
          onAnswerChange?.(
            question.id,
            event.target.value === '' ? null : Number(event.target.value),
          )
        }
        step="any"
        type="number"
        value={typeof value === 'number' ? value : typeof value === 'string' ? value : ''}
      />
    </label>
  )
}

function TextEntry({ question, value, onAnswerChange, controlId }: ItemProps) {
  return (
    <label className={styles.inputField} htmlFor={controlId}>
      <span>Your answer</span>
      <input
        autoComplete="off"
        id={controlId}
        onChange={(event) => onAnswerChange?.(question.id, event.target.value || null)}
        type="text"
        value={typeof value === 'string' ? value : ''}
      />
    </label>
  )
}

function PassageGroup({ question, answers = {}, onAnswerChange, controlId }: ItemProps) {
  return (
    <div className={styles.passageGroup}>
      {question.passage ? (
        <article className={styles.passage}>
          <h3>Passage</h3>
          <p>{question.passage}</p>
        </article>
      ) : null}
      <div className={styles.childQuestions}>
        {(question.children ?? []).map((child) => (
          <QuestionCard
            answers={answers}
            key={child.id}
            onAnswerChange={onAnswerChange}
            question={child}
            value={answers[child.id] ?? null}
          />
        ))}
      </div>
      {!question.children?.length ? (
        <p className={styles.helper}>No passage questions are available.</p>
      ) : null}
      <span className={styles.srOnly} id={`${controlId}-group-label`}>
        Questions about the passage
      </span>
    </div>
  )
}

function MemorizationItem({
  question,
  answers,
  onAnswerChange,
  onStudyComplete,
  controlId,
}: ItemProps) {
  if (question.studyPhase) {
    return (
      <MemorizationStudyPhase
        durationSeconds={question.studyDurationSec ?? null}
        media={question.studyMedia ?? []}
        onComplete={onStudyComplete}
        text={question.studyText}
      />
    )
  }
  return (
    <PassageGroup
      question={question}
      answers={answers}
      onAnswerChange={onAnswerChange}
      value={null}
      controlId={controlId}
    />
  )
}

function MemorizationStudyPhase({
  durationSeconds,
  media,
  text,
  onComplete,
}: {
  durationSeconds: number | null
  media: Array<{ src: string; alt: string }>
  text?: string | null
  onComplete?: () => void
}) {
  const [startedAt] = useState(() => Date.now())
  const [now, setNow] = useState(startedAt)
  const completed = useRef(false)
  useEffect(() => {
    if (durationSeconds === null) return
    const interval = window.setInterval(() => setNow(Date.now()), 500)
    return () => window.clearInterval(interval)
  }, [durationSeconds])
  const remaining =
    durationSeconds === null
      ? null
      : Math.max(0, durationSeconds - Math.floor((now - startedAt) / 1000))
  useEffect(() => {
    if (remaining === 0 && !completed.current) {
      completed.current = true
      onComplete?.()
    }
  }, [onComplete, remaining])

  if (remaining === 0) {
    return (
      <section aria-label="Study phase ended" className={styles.studyMaterial}>
        <p role="status">Study time is over. Questions will follow.</p>
      </section>
    )
  }

  return (
    <section aria-label="Study material" className={styles.studyMaterial}>
      {durationSeconds !== null && remaining !== null ? (
        <p>
          <strong>Study time:</strong> <time>{remaining} seconds remaining</time>
        </p>
      ) : null}
      {text ? <p>{text}</p> : null}
      {media.map((item, index) => (
        <Image
          alt={item.alt}
          height={360}
          key={`${item.src}-${index}`}
          src={item.src}
          width={640}
        />
      ))}
      <p className={styles.helper}>Study this material while it is visible.</p>
    </section>
  )
}

function LikertItem({ question, value, onAnswerChange, controlId }: ItemProps) {
  const min = Math.max(1, Math.min(7, Math.trunc(question.scale?.min ?? 1)))
  const max = Math.max(min, Math.min(7, Math.trunc(question.scale?.max ?? 5)))
  const values = Array.from({ length: Math.max(0, max - min + 1) }, (_, index) => min + index)
  return (
    <fieldset className={styles.questionFieldset}>
      <legend className={styles.srOnly}>{question.prompt}</legend>
      <div className={styles.likertScale}>
        {values.map((scaleValue) => (
          <label className={styles.scaleOption} key={scaleValue}>
            <input
              checked={value === scaleValue}
              name={controlId}
              onChange={() => onAnswerChange?.(question.id, scaleValue)}
              type="radio"
              value={scaleValue}
            />
            <span>{scaleValue}</span>
          </label>
        ))}
      </div>
      <div className={styles.scaleLabels}>
        <span>{question.scale?.minLabel ?? 'Least like me'}</span>
        <span>{question.scale?.maxLabel ?? 'Most like me'}</span>
      </div>
    </fieldset>
  )
}

function SJTRank({ question, value, onAnswerChange, controlId }: ItemProps) {
  const ranks = value && !Array.isArray(value) && typeof value === 'object' ? value : {}
  const count = question.options?.length ?? 0
  function changeRank(optionId: string, rank: string) {
    const next = { ...ranks, [optionId]: rank }
    const occupiedRank = Object.entries(ranks).find(
      ([otherOptionId, otherRank]) =>
        otherOptionId !== optionId && rank !== '' && otherRank === rank,
    )
    if (occupiedRank) next[occupiedRank[0]] = ranks[optionId] ?? ''
    onAnswerChange?.(question.id, next)
  }
  return (
    <fieldset className={styles.questionFieldset}>
      <legend className={styles.helper}>
        Choose a rank for each response. You can use the keyboard.
      </legend>
      <ol className={styles.rankList}>
        {(question.options ?? []).map((option) => (
          <li key={option.id}>
            <span>{option.label}</span>
            <label htmlFor={`${controlId}-${option.id}`}>Rank</label>
            <select
              id={`${controlId}-${option.id}`}
              onChange={(event) => changeRank(option.id, event.target.value)}
              value={ranks[option.id] ?? ''}
            >
              <option value="">Choose rank</option>
              {Array.from({ length: count }, (_, index) => (
                <option key={index + 1} value={String(index + 1)}>
                  {index + 1}
                </option>
              ))}
            </select>
          </li>
        ))}
      </ol>
    </fieldset>
  )
}

function GrammarSelect({ question, value, onAnswerChange, controlId }: ItemProps) {
  const segments = question.segments ?? []
  return (
    <fieldset className={styles.questionFieldset}>
      <legend className={styles.helper}>
        Select the word or sentence segment requested in the question.
      </legend>
      <div className={styles.segmentList}>
        {segments.map((segment) => (
          <label className={styles.segment} key={segment.id}>
            <input
              checked={value === segment.id}
              name={controlId}
              onChange={() => onAnswerChange?.(question.id, segment.id)}
              type="radio"
            />
            <span>{segment.text}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

function AttentionDetail(props: ItemProps) {
  const { question } = props
  const { comparison } = question
  return (
    <div className={styles.attentionLayout}>
      {comparison ? (
        <div className={styles.comparison}>
          <div>
            <h3>{comparison.leftLabel}</h3>
            <pre>{comparison.leftText}</pre>
          </div>
          <div>
            <h3>{comparison.rightLabel}</h3>
            <pre>{comparison.rightText}</pre>
          </div>
        </div>
      ) : null}
      <OptionList {...props} />
      {!comparison ? <p className={styles.helper}>Compare the details carefully.</p> : null}
      <span className={styles.srOnly}>Attention to detail item {question.id}</span>
    </div>
  )
}

const itemRenderers: Record<QuestionType, (props: ItemProps) => ReactNode> = {
  mcq_single: (props) => <MCQSingle {...props} />,
  mcq_multi: (props) => <MCQMulti {...props} />,
  numeric_entry: (props) => <NumericEntry {...props} />,
  text_entry: (props) => <TextEntry {...props} />,
  image_mcq: (props) => <ImageMCQ {...props} />,
  passage_group: (props) => <PassageGroup {...props} />,
  memorization: (props) => <MemorizationItem {...props} />,
  likert: (props) => <LikertItem {...props} />,
  sjt_rank: (props) => <SJTRank {...props} />,
  grammar_select: (props) => <GrammarSelect {...props} />,
  attention_detail: (props) => <AttentionDetail {...props} />,
  sequence: (props) => <SequenceItem {...props} />,
}

export function QuestionCard({
  question,
  value = null,
  answers: initialAnswers = {},
  onAnswerChange,
  onStudyComplete,
}: {
  question: QuizQuestionDTO
  value?: QuizAnswer
  answers?: Record<string, QuizAnswer>
  onAnswerChange?: QuestionAnswerChange
  onStudyComplete?: () => void
}) {
  const reactId = useId()
  const [localAnswer, setLocalAnswer] = useState(value)
  const [localAnswers, setLocalAnswers] = useState(initialAnswers)
  const controlId = `question-${question.id}-${reactId}`
  const Item = itemRenderers[question.type]
  const changeAnswer: QuestionAnswerChange = (questionId, answer) => {
    if (onAnswerChange) {
      onAnswerChange(questionId, answer)
    } else if (questionId === question.id) {
      setLocalAnswer(answer)
    } else {
      setLocalAnswers((current) => ({ ...current, [questionId]: answer }))
    }
  }
  return (
    <section aria-labelledby={`${controlId}-prompt`} className={styles.questionCard}>
      <div className={styles.questionHeader}>
        <span className={styles.questionType}>{question.type.replaceAll('_', ' ')}</span>
        <span>{question.number ? `Question ${question.number}` : 'Practice item'}</span>
      </div>
      <h2 className={styles.questionPrompt} id={`${controlId}-prompt`}>
        {question.prompt}
      </h2>
      {question.media?.length ? (
        <div className={styles.stemMedia}>
          {question.media.map((media, index) => (
            <Image
              alt={media.alt}
              height={360}
              key={`${media.src}-${index}`}
              src={media.src}
              width={640}
            />
          ))}
        </div>
      ) : null}
      <Item
        answers={onAnswerChange ? initialAnswers : localAnswers}
        controlId={controlId}
        onAnswerChange={changeAnswer}
        onStudyComplete={onStudyComplete}
        question={question}
        value={onAnswerChange ? value : localAnswer}
      />
    </section>
  )
}
