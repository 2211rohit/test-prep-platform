import type { CollectionConfig } from 'payload'

import { isStaffField, keepEditorsInDraft, privateContentAccess } from '@/access/roles'
import { workflowStatusField } from '@/fields/editorialFields'

const itemTypes = [
  'mcq_single',
  'mcq_multi',
  'numeric_entry',
  'text_entry',
  'image_mcq',
  'passage_group',
  'memorization',
  'likert',
  'sjt_rank',
  'grammar_select',
  'attention_detail',
  'sequence',
]

export const Questions: CollectionConfig = {
  slug: 'questions',
  admin: {
    useAsTitle: 'internalId',
    defaultColumns: ['internalId', 'test', 'section', 'type', 'difficulty', 'visibility'],
    group: 'Learning content',
  },
  access: privateContentAccess,
  hooks: {
    beforeChange: [keepEditorsInDraft],
  },
  versions: {
    drafts: true,
    maxPerDoc: 200,
  },
  fields: [
    {
      name: 'internalId',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'Stable content ID used in imports and reports.' },
    },
    {
      name: 'test',
      type: 'relationship',
      relationTo: 'tests',
      required: true,
      index: true,
    },
    { name: 'section', type: 'text', required: true, index: true },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: itemTypes.map((value) => ({ label: value.replaceAll('_', ' '), value })),
    },
    {
      name: 'skills',
      type: 'array',
      minRows: 1,
      fields: [{ name: 'skill', type: 'text', required: true }],
    },
    {
      name: 'difficulty',
      type: 'number',
      required: true,
      min: 1,
      max: 5,
    },
    { name: 'groupId', type: 'text', index: true },
    {
      name: 'originalContentAttested',
      type: 'checkbox',
      required: true,
      defaultValue: false,
      admin: {
        description: 'Confirm this is original material and does not reproduce a proprietary test.',
      },
    },
    { name: 'stem', type: 'richText', required: true },
    {
      name: 'itemData',
      type: 'json',
      admin: {
        description:
          'Type-specific presentation data for the selected item type. Keep answer keys in the separate private answer field.',
      },
    },
    {
      name: 'media',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
    },
    {
      name: 'options',
      type: 'array',
      fields: [
        { name: 'id', type: 'text', required: true },
        { name: 'text', type: 'textarea' },
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'whyWrong', type: 'textarea' },
        {
          name: 'errorType',
          type: 'select',
          options: [
            { label: 'Misread', value: 'misread' },
            { label: 'Calculation slip', value: 'calculation' },
            { label: 'Concept gap', value: 'concept' },
            { label: 'Trap answer', value: 'trap' },
          ],
        },
      ],
    },
    {
      name: 'answer',
      type: 'json',
      required: true,
      access: {
        read: isStaffField,
      },
      admin: {
        description: 'Private answer key. Never send this field to a learner before submit.',
      },
    },
    { name: 'explanation', type: 'richText', required: true },
    { name: 'timeLimitSec', type: 'number', min: 0 },
    {
      name: 'visibility',
      type: 'select',
      required: true,
      defaultValue: 'paid',
      options: [
        { label: 'Free', value: 'free' },
        { label: 'Full Prep', value: 'paid' },
      ],
    },
    workflowStatusField(),
  ],
}
