import type { Field } from 'payload'

function toSlug(value: string): string {
  return value
    .normalize('NFKD')
    .toLowerCase()
    .trim()
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function slugField(sourceField: string): Field {
  return {
    name: 'slug',
    type: 'text',
    required: true,
    unique: true,
    index: true,
    admin: {
      position: 'sidebar',
      description: 'URL-friendly address. Set it once the page is ready to publish.',
    },
    hooks: {
      beforeValidate: [
        ({ siblingData, value }) => {
          if (typeof value === 'string' && value.trim().length > 0) {
            return toSlug(value)
          }

          const sourceValue = siblingData?.[sourceField]
          return typeof sourceValue === 'string' ? toSlug(sourceValue) : value
        },
      ],
    },
  }
}
