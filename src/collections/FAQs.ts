import type { CollectionConfig } from 'payload'

import { editorialAccess, keepEditorsInDraft } from '@/access/roles'
import { workflowStatusField } from '@/fields/editorialFields'

export const FAQs: CollectionConfig = {
  slug: 'faqs',
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'test', 'sortOrder', 'workflowStatus'],
    group: 'Public content',
  },
  access: editorialAccess,
  hooks: {
    beforeChange: [keepEditorsInDraft],
  },
  versions: {
    drafts: true,
    maxPerDoc: 50,
  },
  fields: [
    { name: 'question', type: 'text', required: true },
    { name: 'answer', type: 'richText', required: true },
    {
      name: 'test',
      type: 'relationship',
      relationTo: 'tests',
      index: true,
    },
    { name: 'sortOrder', type: 'number', defaultValue: 0, index: true },
    workflowStatusField(),
  ],
}
