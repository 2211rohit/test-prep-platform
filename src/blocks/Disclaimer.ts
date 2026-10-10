import type { Block } from 'payload'

export const DisclaimerBlock: Block = {
  slug: 'disclaimer',
  labels: { singular: 'Disclaimer', plural: 'Disclaimers' },
  fields: [
    { name: 'publisherName', type: 'text', required: true },
    { name: 'content', type: 'textarea', required: true },
  ],
}
