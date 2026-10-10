import type { CollectionConfig } from 'payload'

import { keepEditorsInDraft, privateContentAccess } from '@/access/roles'
import { workflowStatusField } from '@/fields/editorialFields'
import { slugField } from '@/fields/slugField'

export const QuizConfigs: CollectionConfig = {
  slug: 'quiz-configs',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'test', 'mode', 'workflowStatus', 'updatedAt'],
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
      name: 'test',
      type: 'relationship',
      relationTo: 'tests',
      required: true,
      index: true,
    },
    {
      name: 'mode',
      type: 'select',
      required: true,
      options: [
        { label: 'Learn', value: 'learn' },
        { label: 'Drill', value: 'drill' },
        { label: 'Timed', value: 'timed' },
        { label: 'Simulation', value: 'simulation' },
      ],
    },
    {
      name: 'navigation',
      type: 'select',
      required: true,
      options: [
        { label: 'Free navigation', value: 'free' },
        { label: 'Forward only', value: 'forward-only' },
        { label: 'Section locked', value: 'section-locked' },
      ],
    },
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
      name: 'configuration',
      type: 'json',
      required: true,
      admin: {
        description:
          'Selection, timing, section rules, and scoring config. This collection is staff-only.',
      },
    },
    workflowStatusField(),
  ],
}
