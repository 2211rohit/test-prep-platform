import type { Field } from 'payload'

export function seoFields(): Field {
  return {
    name: 'seo',
    type: 'group',
    fields: [
      {
        name: 'title',
        type: 'text',
        maxLength: 70,
        admin: { description: 'Search result title, up to 70 characters.' },
      },
      {
        name: 'description',
        type: 'textarea',
        maxLength: 160,
        admin: { description: 'Search result summary, up to 160 characters.' },
      },
      {
        name: 'canonicalUrl',
        type: 'text',
      },
      {
        name: 'socialImage',
        type: 'upload',
        relationTo: 'media',
      },
      {
        name: 'noIndex',
        type: 'checkbox',
        defaultValue: false,
      },
    ],
  }
}
