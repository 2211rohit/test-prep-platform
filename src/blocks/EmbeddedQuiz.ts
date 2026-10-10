import type { Block } from 'payload'

export const EmbeddedQuizBlock: Block = {
  slug: 'embedded-quiz',
  labels: { singular: 'Embedded quiz', plural: 'Embedded quizzes' },
  fields: [
    {
      name: 'quizConfig',
      type: 'relationship',
      relationTo: 'quiz-configs',
      required: true,
    },
    { name: 'intro', type: 'textarea' },
  ],
}
