import type { Access, CollectionBeforeChangeHook, FieldAccess, Where } from 'payload'

type UserRole = 'admin' | 'editor' | 'learner'

function roleOf(user: unknown): UserRole | undefined {
  if (!user || typeof user !== 'object' || !('role' in user)) {
    return undefined
  }

  const role = user.role
  return role === 'admin' || role === 'editor' || role === 'learner' ? role : undefined
}

export const isAdminUser = (user: unknown): boolean => roleOf(user) === 'admin'

export const isStaffUser = (user: unknown): boolean => {
  const role = roleOf(user)
  return role === 'admin' || role === 'editor'
}

export const isStaff: Access = ({ req }) => isStaffUser(req.user)

export const isAdmin: Access = ({ req }) => isAdminUser(req.user)

export const isStaffField: FieldAccess = ({ req }) => isStaffUser(req.user)

export const isAdminField: FieldAccess = ({ req }) => isAdminUser(req.user)

const approvedPublishedWhere: Where = {
  and: [
    { _status: { equals: 'published' } },
    { workflowStatus: { equals: 'approved' } },
  ],
}

const activeApprovedProductWhere: Where = {
  and: [
    { _status: { equals: 'published' } },
    { workflowStatus: { equals: 'approved' } },
    { active: { equals: true } },
  ],
}

export const staffOrPublished: Access = ({ req }) =>
  isStaffUser(req.user) ? true : approvedPublishedWhere

export const staffOrActiveProduct: Access = ({ req }) =>
  isStaffUser(req.user) ? true : activeApprovedProductWhere

export const staffOnly: Access = ({ req }) => isStaffUser(req.user)

export const setReviewStatus: FieldAccess = ({ req, data }) => {
  if (isAdminUser(req.user)) {
    return true
  }

  return data?.workflowStatus !== 'approved'
}

export const keepEditorsInDraft: CollectionBeforeChangeHook = ({ data, req }) => {
  if (roleOf(req.user) !== 'editor') {
    return data
  }

  return {
    ...data,
    _status: 'draft',
    workflowStatus: data.workflowStatus === 'in-review' ? 'in-review' : 'draft',
  }
}

export const editorialAccess = {
  create: isStaff,
  read: staffOrPublished,
  update: isStaff,
  delete: isAdmin,
  readVersions: isStaff,
}

export const privateContentAccess = {
  create: isStaff,
  read: staffOnly,
  update: isStaff,
  delete: isAdmin,
  readVersions: isStaff,
}
