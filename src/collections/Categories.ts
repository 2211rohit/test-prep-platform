import type { CollectionConfig } from 'payload'

import { editorialAccess, keepEditorsInDraft } from '@/access/roles'
import { workflowStatusField } from '@/fields/editorialFields'
import { seoFields } from '@/fields/seoFields'
import { slugField } from '@/fields/slugField'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'workflowStatus', 'updatedAt'],
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
    { name: 'name', type: 'text', required: true, unique: true },
    slugField('name'),
    { name: 'description', type: 'textarea' },
    { name: 'sortOrder', type: 'number', defaultValue: 0, index: true },
    seoFields(),
    workflowStatusField(),
  ],
}
