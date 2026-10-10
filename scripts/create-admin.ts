import 'dotenv/config'

import { getPayload } from 'payload'

const { default: config } = await import('../src/payload.config')

const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
const password = process.env.ADMIN_PASSWORD
const name = process.env.ADMIN_NAME?.trim() || 'Platform Administrator'

if (!email || !password) {
  throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD in .env before bootstrapping an admin.')
}

if (password.length < 16) {
  throw new Error('ADMIN_PASSWORD must contain at least 16 characters.')
}

const payload = await getPayload({ config })

try {
  const existingUser = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
    overrideAccess: true,
  })

  if (existingUser.docs[0]) {
    if (existingUser.docs[0].role === 'admin') {
      console.info(`Administrator ${email} already exists.`)
    } else {
      throw new Error(`A non-administrator account already uses ${email}; no changes were made.`)
    }
  } else {
    const administrators = await payload.find({
      collection: 'users',
      where: { role: { equals: 'admin' } },
      limit: 1,
      overrideAccess: true,
    })

    if (administrators.docs.length > 0) {
      throw new Error('An administrator already exists. Create additional staff through the CMS.')
    }

    await payload.create({
      collection: 'users',
      data: { email, password, name, role: 'admin' },
      overrideAccess: true,
    })

    console.info(`Created the first CMS administrator: ${email}`)
  }
} finally {
  await payload.destroy()
}
