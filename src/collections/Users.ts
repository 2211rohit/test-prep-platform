import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminField, isAdminUser, isStaffUser } from '@/access/roles'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    group: 'Administration',
  },
  auth: {
    tokenExpiration: 60 * 60 * 24 * 7,
  },
  access: {
    admin: ({ req }) => isStaffUser(req.user),
    create: () => true,
    read: ({ req }) => {
      if (!req.user) return false
      return isAdminUser(req.user) ? true : { id: { equals: req.user.id } }
    },
    update: ({ req }) => {
      if (!req.user) return false
      return isAdminUser(req.user) ? true : { id: { equals: req.user.id } }
    },
    delete: isAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      index: true,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'learner',
      saveToJWT: true,
      options: [
        { label: 'Learner', value: 'learner' },
        { label: 'Editor', value: 'editor' },
        { label: 'Administrator', value: 'admin' },
      ],
      access: {
        create: isAdminField,
        update: isAdminField,
      },
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
