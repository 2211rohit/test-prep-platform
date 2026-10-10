import type { CollectionConfig } from 'payload'

import { editorialAccess, keepEditorsInDraft } from '@/access/roles'
import { workflowStatusField } from '@/fields/editorialFields'
import { slugField } from '@/fields/slugField'

export const TestVariants: CollectionConfig = {
  slug: 'test-variants',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'test', 'workflowStatus', 'updatedAt'],
    group: 'Catalog',
    description: 'Optional agency or employer-specific overrides for a test.',
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
      name: 'test',
      type: 'relationship',
      relationTo: 'tests',
      required: true,
      index: true,
    },
    {
      name: 'overrides',
      type: 'group',
      fields: [
        {
          name: 'sections',
          type: 'json',
          admin: { description: 'Optional section list and order for this variant.' },
        },
        {
          name: 'cutScores',
          type: 'json',
          admin: { description: 'Optional overall or per-section cut score overrides.' },
        },
        {
          name: 'timing',
          type: 'json',
          admin: { description: 'Optional section and test timing overrides in seconds.' },
        },
        { name: 'testDayInfo', type: 'richText' },
      ],
    },
    workflowStatusField(),
  ],
}
