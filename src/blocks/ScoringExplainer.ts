import type { Block } from 'payload'

export const ScoringExplainerBlock: Block = {
  slug: 'scoring-explainer',
  labels: { singular: 'Scoring explainer', plural: 'Scoring explainers' },
  fields: [
    { name: 'heading', type: 'text', required: true },
    { name: 'content', type: 'richText', required: true },
  ],
}
