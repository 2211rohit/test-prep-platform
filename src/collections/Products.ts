import type { CollectionConfig } from 'payload'

import { editorialAccess, keepEditorsInDraft, staffOrActiveProduct } from '@/access/roles'
import { workflowStatusField } from '@/fields/editorialFields'
import { slugField } from '@/fields/slugField'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'test', 'priceCents', 'durationDays', 'workflowStatus'],
    group: 'Commerce',
  },
  access: { ...editorialAccess, read: staffOrActiveProduct },
  hooks: {
    beforeChange: [keepEditorsInDraft],
  },
  versions: {
    drafts: true,
    maxPerDoc: 50,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    slugField('name'),
    {
      name: 'test',
      type: 'relationship',
      relationTo: 'tests',
      required: true,
      index: true,
    },
    {
      name: 'courses',
      type: 'relationship',
      relationTo: 'courses',
      required: true,
      hasMany: true,
    },
    {
      name: 'productType',
      type: 'select',
      required: true,
      defaultValue: 'full-prep',
      options: [
        { label: 'Full Prep', value: 'full-prep' },
        { label: '30-day extension', value: 'extension' },
      ],
    },
    {
      name: 'tier',
      type: 'select',
      required: true,
      options: [{ label: 'Full Prep', value: 'full' }],
    },
    {
      name: 'priceCents',
      type: 'number',
      required: true,
      min: 0,
      admin: { description: 'Store money in cents; 2900 means $29.00.' },
    },
    {
      name: 'currency',
      type: 'text',
      required: true,
      defaultValue: 'USD',
      maxLength: 3,
    },
    { name: 'durationDays', type: 'number', required: true, min: 1, defaultValue: 60 },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Only active, approved, published products may be sold.' },
    },
    workflowStatusField(),
  ],
}
