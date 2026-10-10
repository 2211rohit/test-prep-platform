import type { CollectionConfig } from 'payload'

import { privateContentAccess, keepEditorsInDraft } from '@/access/roles'
import { workflowStatusField } from '@/fields/editorialFields'
import { slugField } from '@/fields/slugField'

export const Lessons: CollectionConfig = {
  slug: 'lessons',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'module', 'accessLevel', 'workflowStatus'],
    group: 'Learning content',
  },
  access: privateContentAccess,
  hooks: {
    beforeChange: [keepEditorsInDraft],
  },
  versions: {
    drafts: true,
    maxPerDoc: 100,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField('title'),
    {
      name: 'module',
      type: 'relationship',
      relationTo: 'modules',
      required: true,
      index: true,
    },
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
    { name: 'content', type: 'richText', required: true },
    {
      name: 'drill',
      type: 'relationship',
      relationTo: 'quiz-configs',
      admin: { description: 'Optional drill shown at the end of this lesson.' },
    },
    workflowStatusField(),
  ],
}
