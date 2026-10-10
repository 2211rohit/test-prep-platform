import type { CollectionConfig } from 'payload'

import { editorialAccess, keepEditorsInDraft } from '@/access/roles'
import { workflowStatusField } from '@/fields/editorialFields'

export const Modules: CollectionConfig = {
  slug: 'modules',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'course', 'sortOrder', 'workflowStatus'],
    group: 'Learning content',
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
    { name: 'title', type: 'text', required: true },
    {
      name: 'course',
      type: 'relationship',
      relationTo: 'courses',
      required: true,
      index: true,
    },
    { name: 'summary', type: 'textarea' },
    { name: 'sortOrder', type: 'number', required: true, defaultValue: 0, index: true },
    {
      name: 'accessLevel',
      type: 'select',
      required: true,
      defaultValue: 'full',
      options: [
        { label: 'Public', value: 'public' },
        { label: 'Free Starter', value: 'free' },
        { label: 'Full Prep', value: 'full' },
      ],
    },
    {
      name: 'lessons',
      type: 'join',
      collection: 'lessons',
      on: 'module',
    },
    workflowStatusField(),
  ],
}
