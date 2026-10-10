import type { CollectionConfig } from 'payload'

import { editorialAccess, keepEditorsInDraft } from '@/access/roles'
import { workflowStatusField } from '@/fields/editorialFields'
import { seoFields } from '@/fields/seoFields'
import { slugField } from '@/fields/slugField'

export const Tests: CollectionConfig = {
  slug: 'tests',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'formatVerifiedAt', 'workflowStatus'],
    group: 'Catalog',
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
    { name: 'name', type: 'text', required: true },
    slugField('name'),
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      index: true,
    },
    { name: 'publisherName', type: 'text', required: true },
    { name: 'shortDescription', type: 'textarea', required: true, maxLength: 280 },
    {
      name: 'formatVerifiedAt',
      type: 'date',
      required: true,
      admin: {
        date: { displayFormat: 'yyyy-MM-dd' },
        description:
          'Last date the exam format was checked against a reliable source. Demo drafts use a placeholder; replace it with a verified date before approval.',
      },
    },
    {
      name: 'sections',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'key', type: 'text', required: true },
        { name: 'name', type: 'text', required: true },
        { name: 'overview', type: 'textarea' },
        { name: 'typicalQuestionCount', type: 'number', min: 0 },
        { name: 'typicalTimeMinutes', type: 'number', min: 0 },
        { name: 'cutScore', type: 'number', min: 0, max: 100 },
      ],
    },
    {
      name: 'variants',
      type: 'join',
      collection: 'test-variants',
      on: 'test',
    },
    {
      name: 'changeLog',
      type: 'join',
      collection: 'test-changelog',
      on: 'test',
    },
    { name: 'disclaimer', type: 'textarea', required: true },
    seoFields(),
    workflowStatusField(),
  ],
}
