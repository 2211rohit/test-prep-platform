import type { Block } from 'payload'

export const TestFactsTableBlock: Block = {
  slug: 'test-facts-table',
  labels: { singular: 'Test facts table', plural: 'Test facts tables' },
  fields: [
    {
      name: 'facts',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
      ],
    },
  ],
}
