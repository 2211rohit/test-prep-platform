import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { requireEnv, requireSecret } from '@/lib/env'

import { Categories } from './collections/Categories'
import { Courses } from './collections/Courses'
import { FAQs } from './collections/FAQs'
import { Lessons } from './collections/Lessons'
import { Media } from './collections/Media'
import { Modules } from './collections/Modules'
import { Pages } from './collections/Pages'
import { Products } from './collections/Products'
import { Questions } from './collections/Questions'
import { QuizConfigs } from './collections/QuizConfigs'
import { TestChangelog } from './collections/TestChangelog'
import { TestVariants } from './collections/TestVariants'
import { Tests } from './collections/Tests'
import { Users } from './collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const payloadSecret = requireSecret('PAYLOAD_SECRET')
const databaseUrl = requireEnv('DATABASE_URL')

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    Categories,
    Tests,
    TestVariants,
    TestChangelog,
    Pages,
    FAQs,
    Courses,
    Modules,
    Lessons,
    Questions,
    QuizConfigs,
    Products,
  ],
  editor: lexicalEditor(),
  secret: payloadSecret,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    migrationDir: path.resolve(dirname, 'migrations'),
    push: process.env.NODE_ENV !== 'production',
    pool: {
      connectionString: databaseUrl,
    },
  }),
  sharp,
  plugins: [],
})
