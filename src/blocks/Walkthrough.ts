import type { Block } from 'payload'

export const WalkthroughBlock: Block = {
  slug: 'walkthrough',
  labels: { singular: 'Worked example', plural: 'Worked examples' },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'questionType', type: 'text' },
    { name: 'example', type: 'richText', required: true },
    { name: 'reasoning', type: 'richText', required: true },
    { name: 'tip', type: 'textarea' },
    {
      name: 'tryItItem',
      type: 'relationship',
      relationTo: 'questions',
      admin: {
        description: 'A short practice item. Deliver its answer only after the learner responds.',
      },
    },
  ],
}
