import type { Block } from 'payload'

export const FAQReferencesBlock: Block = {
  slug: 'faq-references',
  labels: { singular: 'FAQ list', plural: 'FAQ lists' },
  fields: [
    {
      name: 'faqs',
      type: 'relationship',
      relationTo: 'faqs',
      hasMany: true,
      required: true,
    },
  ],
}
