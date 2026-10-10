import type { CollectionConfig } from 'payload'

import { pageContentBlocks } from '@/blocks'
import { editorialAccess, keepEditorsInDraft } from '@/access/roles'
import { workflowStatusField } from '@/fields/editorialFields'
import { seoFields } from '@/fields/seoFields'
import { slugField } from '@/fields/slugField'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'pageType', 'test', 'workflowStatus', 'updatedAt'],
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
    slugField('title'),
    {
      name: 'pageType',
      type: 'select',
      required: true,
      options: [
        { label: 'Home', value: 'home' },
        { label: 'Category hub', value: 'category' },
        { label: 'Free practice', value: 'practice' },
        { label: 'Course sales', value: 'course-sales' },
        { label: 'Blog article', value: 'blog' },
        { label: 'Legal', value: 'legal' },
        { label: 'Hiring roadmap', value: 'roadmap' },
      ],
    },
    {
      name: 'test',
      type: 'relationship',
      relationTo: 'tests',
      index: true,
    },
    {
      name: 'content',
      type: 'blocks',
      blocks: pageContentBlocks,
      required: true,
      minRows: 1,
    },
    seoFields(),
    workflowStatusField(),
  ],
}
