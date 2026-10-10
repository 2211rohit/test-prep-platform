import type { Block } from 'payload'

export const TestimonialsBlock: Block = {
  slug: 'testimonials',
  labels: { singular: 'Testimonial group', plural: 'Testimonial groups' },
  fields: [
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'quote', type: 'textarea', required: true },
        { name: 'name', type: 'text', required: true },
        { name: 'context', type: 'text' },
        {
          name: 'consentConfirmed',
          type: 'checkbox',
          required: true,
          defaultValue: false,
          admin: { description: 'Confirm written permission before publishing this quote.' },
        },
      ],
    },
  ],
}
