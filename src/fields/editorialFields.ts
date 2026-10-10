import type { Field } from 'payload'

import { setReviewStatus } from '@/access/roles'

export function workflowStatusField(): Field {
  return {
    name: 'workflowStatus',
    type: 'select',
    defaultValue: 'draft',
    required: true,
    options: [
      { label: 'Draft', value: 'draft' },
      { label: 'In review', value: 'in-review' },
      { label: 'Approved', value: 'approved' },
    ],
    access: {
      create: setReviewStatus,
      update: setReviewStatus,
    },
    admin: {
      position: 'sidebar',
      description: 'An administrator must approve content before it is published.',
    },
  }
}
