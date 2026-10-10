import type { CollectionConfig } from 'payload'

import { editorialAccess, keepEditorsInDraft } from '@/access/roles'
import { workflowStatusField } from '@/fields/editorialFields'

export const TestChangelog: CollectionConfig = {
  slug: 'test-changelog',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'test', 'effectiveOn', 'workflowStatus'],
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
    { name: 'title', type: 'text', required: true },
    {
      name: 'test',
      type: 'relationship',
      relationTo: 'tests',
      required: true,
      index: true,
    },
    {
      name: 'effectiveOn',
      type: 'date',
      required: true,
      admin: { date: { displayFormat: 'yyyy-MM-dd' } },
    },
    { name: 'summary', type: 'richText', required: true },
    {
      name: 'source',
      type: 'text',
      admin: { description: 'Reference used to verify this format change.' },
    },
    workflowStatusField(),
  ],
}
