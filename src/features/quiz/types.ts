export const questionTypes = [
  'mcq_single',
  'mcq_multi',
  'numeric_entry',
  'text_entry',
  'image_mcq',
  'passage_group',
  'memorization',
  'likert',
  'sjt_rank',
  'grammar_select',
  'attention_detail',
  'sequence',
] as const

export type QuestionType = (typeof questionTypes)[number]
export type QuizAnswer = string | string[] | number | Record<string, string> | null

export type QuizOption = {
  id: string
  label: string
  image?: { src: string; alt: string } | null
}

/**
 * Safe presentation DTO. Build it on the server from validated public item data;
 * never pass a Payload Question or its `answer`/`explanation` fields here.
 */
export type QuizQuestionDTO = {
  id: string
  number?: number
  type: QuestionType
  prompt: string
  options?: QuizOption[]
  media?: { src: string; alt: string }[]
  passage?: string | null
  children?: QuizQuestionDTO[]
  studyText?: string | null
  studyMedia?: { src: string; alt: string }[]
  studyPhase?: boolean
  studyDurationSec?: number | null
  scale?: { min: number; max: number; minLabel?: string; maxLabel?: string }
  segments?: { id: string; text: string }[]
  comparison?: { leftLabel: string; leftText: string; rightLabel: string; rightText: string }
}

export type QuestionAnswerChange = (questionId: string, answer: QuizAnswer) => void
