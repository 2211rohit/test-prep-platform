import type { Block } from 'payload'

export const SectionCardsBlock: Block = {
  slug: 'section-cards',
  labels: { singular: 'Section cards', plural: 'Section card groups' },
  fields: [
    {
      name: 'sections',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'anchor', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
  ],
}
