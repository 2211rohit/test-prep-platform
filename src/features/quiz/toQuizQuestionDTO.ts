import 'server-only'

import type { Question } from '@/payload-types'

import type { QuizQuestionDTO } from './types'

export type QuizItemPresentation = {
  number?: number
  passage?: string | null
  children?: QuizQuestionDTO[]
  studyText?: string | null
  studyMedia?: Array<{ src: string; alt: string }>
  studyPhase?: boolean
  studyDurationSec?: number | null
  scale?: { min: number; max: number; minLabel?: string; maxLabel?: string }
  segments?: Array<{ id: string; text: string }>
  comparison?: { leftLabel: string; leftText: string; rightLabel: string; rightText: string }
}

/**
 * Convert a private Payload question into an explicit learner-safe object.
 * `itemData`, `answer`, `explanation`, and option diagnostics are never copied.
 */
export function toQuizQuestionDTO(
  question: Question,
  presentation: QuizItemPresentation = {},
): QuizQuestionDTO {
  const options = (question.options ?? []).map((option, index) => {
    const image =
      option.image && typeof option.image === 'object'
        ? safeMedia(option.image.url, option.image.alt)
        : null
    return {
      id: option.id,
      label: option.text?.trim() || (image ? `Image option ${index + 1}` : `Option ${index + 1}`),
      image,
    }
  })
  const media = (question.media ?? []).flatMap((entry) => {
    if (typeof entry !== 'object') return []
    const safe = safeMedia(entry.url, entry.alt)
    return safe ? [safe] : []
  })

  return sanitizeDTO({
    id: String(question.id),
    number: presentation.number,
    type: question.type,
    prompt: lexicalText(question.stem),
    options,
    media,
    passage: presentation.passage,
    children: presentation.children,
    studyText: presentation.studyText,
    studyMedia: presentation.studyMedia,
    studyPhase: presentation.studyPhase,
    studyDurationSec: presentation.studyDurationSec,
    scale: presentation.scale,
    segments: presentation.segments,
    comparison: presentation.comparison,
  })
}

function sanitizeDTO(input: QuizQuestionDTO): QuizQuestionDTO {
  return {
    id: input.id,
    ...(typeof input.number === 'number' ? { number: input.number } : {}),
    type: input.type,
    prompt: input.prompt,
    ...(input.options
      ? {
          options: input.options.map((option) => ({
            id: option.id,
            label: option.label,
            ...(option.image ? { image: { src: option.image.src, alt: option.image.alt } } : {}),
          })),
        }
      : {}),
    ...(input.media
      ? {
          media: input.media.flatMap((media) => {
            const safe = safeMedia(media.src, media.alt)
            return safe ? [safe] : []
          }),
        }
      : {}),
    ...(typeof input.passage === 'string' ? { passage: input.passage } : {}),
    ...(input.children ? { children: input.children.map(sanitizeDTO) } : {}),
    ...(typeof input.studyText === 'string' ? { studyText: input.studyText } : {}),
    ...(input.studyMedia
      ? {
          studyMedia: input.studyMedia.flatMap((media) => {
            const safe = safeMedia(media.src, media.alt)
            return safe ? [safe] : []
          }),
        }
      : {}),
    ...(typeof input.studyPhase === 'boolean' ? { studyPhase: input.studyPhase } : {}),
    ...(typeof input.studyDurationSec === 'number'
      ? { studyDurationSec: input.studyDurationSec }
      : {}),
    ...(input.scale
      ? {
          scale: {
            min: input.scale.min,
            max: input.scale.max,
            minLabel: input.scale.minLabel,
            maxLabel: input.scale.maxLabel,
          },
        }
      : {}),
    ...(input.segments ? { segments: input.segments.map(({ id, text }) => ({ id, text })) } : {}),
    ...(input.comparison
      ? {
          comparison: {
            leftLabel: input.comparison.leftLabel,
            leftText: input.comparison.leftText,
            rightLabel: input.comparison.rightLabel,
            rightText: input.comparison.rightText,
          },
        }
      : {}),
  }
}

function safeMedia(src: unknown, alt: unknown): { src: string; alt: string } | null {
  if (
    typeof src !== 'string' ||
    !src.startsWith('/api/media/file/') ||
    src.startsWith('//') ||
    src.includes('\\')
  ) {
    return null
  }
  return { src, alt: typeof alt === 'string' ? alt : '' }
}

function lexicalText(value: unknown): string {
  const pieces: string[] = []
  const visit = (node: unknown) => {
    if (Array.isArray(node)) {
      node.forEach(visit)
      return
    }
    if (!node || typeof node !== 'object') return
    const record = node as Record<string, unknown>
    if (typeof record.text === 'string') pieces.push(record.text)
    if (record.type === 'linebreak') pieces.push('\n')
    if (Array.isArray(record.children)) {
      const start = pieces.length
      visit(record.children)
      if (
        pieces.length > start &&
        ['paragraph', 'heading', 'listitem', 'quote'].includes(String(record.type))
      ) {
        pieces.push('\n')
      }
    }
  }
  visit(value)
  return pieces
    .join('')
    .replace(/[\t ]+/g, ' ')
    .replace(/ +\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}
