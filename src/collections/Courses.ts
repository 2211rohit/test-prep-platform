import type { CollectionConfig } from 'payload'

import { editorialAccess, keepEditorsInDraft } from '@/access/roles'
import { workflowStatusField } from '@/fields/editorialFields'
import { seoFields } from '@/fields/seoFields'
import { slugField } from '@/fields/slugField'

export const Courses: CollectionConfig = {
  slug: 'courses',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'test', 'workflowStatus', 'updatedAt'],
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
    slugField('title'),
    {
      name: 'test',
      type: 'relationship',
      relationTo: 'tests',
      required: true,
      unique: true,
      index: true,
    },
    { name: 'summary', type: 'textarea', required: true, maxLength: 280 },
    { name: 'description', type: 'richText' },
    {
      name: 'freeStarter',
      type: 'group',
      label: 'Free Starter limits',
      admin: {
        description: 'Select the content included in this test’s 10-day starter access.',
      },
      fields: [
        { name: 'durationDays', type: 'number', required: true, min: 1, defaultValue: 10 },
        {
          name: 'includedModules',
          type: 'relationship',
          relationTo: 'modules',
          hasMany: true,
        },
        {
          name: 'includedDrills',
          type: 'relationship',
          relationTo: 'quiz-configs',
          hasMany: true,
        },
        {
          name: 'includedSimulations',
          type: 'relationship',
          relationTo: 'quiz-configs',
          hasMany: true,
        },
      ],
    },
    seoFields(),
    workflowStatusField(),
  ],
}
