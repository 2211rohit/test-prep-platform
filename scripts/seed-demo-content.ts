import 'dotenv/config'

import { getPayload } from 'payload'

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
  throw new Error('Set DATABASE_URL in .env before seeding demo content.')
}

if (process.env.NODE_ENV === 'production') {
  throw new Error('Demo content can only be seeded outside production.')
}

const databaseHost = new URL(databaseUrl).hostname
if (!['localhost', '127.0.0.1', '::1'].includes(databaseHost)) {
  throw new Error('Demo seeding is restricted to a local PostgreSQL database.')
}

const { default: config } = await import('../src/payload.config')
const payload = await getPayload({ config })

type SlugCollection = 'categories' | 'tests' | 'courses' | 'lessons' | 'pages' | 'quiz-configs'

function richText(text: string) {
  return {
    root: {
      type: 'root',
      version: 1,
      direction: 'ltr',
      format: '',
      indent: 0,
      children: text.split('\n').map((line) => ({
        type: 'paragraph',
        version: 1,
        direction: 'ltr',
        format: '',
        indent: 0,
        children: [
          {
            type: 'text',
            version: 1,
            text: line,
            format: 0,
            detail: 0,
            mode: 'normal',
            style: '',
          },
        ],
      })),
    },
  }
}

async function upsertBySlug<C extends SlugCollection>(
  collection: C,
  slug: string,
  data: Record<string, unknown>,
) {
  const existingResult = await payload.find({
    collection,
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  const existing = existingResult.docs[0]
  const draftData = { ...data, _status: 'draft', workflowStatus: 'draft' }

  if (existing) {
    return payload.update({
      collection,
      id: existing.id,
      data: draftData as never,
      draft: true,
      overrideAccess: true,
    })
  }

  return payload.create({
    collection,
    data: draftData as never,
    draft: true,
    overrideAccess: true,
  })
}

async function upsertModule(title: string, data: Record<string, unknown>) {
  const existingResult = await payload.find({
    collection: 'modules',
    where: { title: { equals: title } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  const existing = existingResult.docs[0]
  const draftData = { ...data, _status: 'draft', workflowStatus: 'draft' }

  if (existing) {
    return payload.update({
      collection: 'modules',
      id: existing.id,
      data: draftData as never,
      draft: true,
      overrideAccess: true,
    })
  }

  return payload.create({
    collection: 'modules',
    data: draftData as never,
    draft: true,
    overrideAccess: true,
  })
}

async function upsertFaq(question: string, data: Record<string, unknown>) {
  const existingResult = await payload.find({
    collection: 'faqs',
    where: { question: { equals: question } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  const existing = existingResult.docs[0]
  const draftData = { ...data, workflowStatus: 'draft' }

  if (existing) {
    return payload.update({
      collection: 'faqs',
      id: existing.id,
      data: draftData as never,
      draft: true,
      overrideAccess: true,
    })
  }

  return payload.create({
    collection: 'faqs',
    data: draftData as never,
    draft: true,
    overrideAccess: true,
  })
}

async function upsertQuestion(internalId: string, data: Record<string, unknown>) {
  const existingResult = await payload.find({
    collection: 'questions',
    where: { internalId: { equals: internalId } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  const existing = existingResult.docs[0]
  const draftData = { ...data, workflowStatus: 'draft' }

  if (existing) {
    return payload.update({
      collection: 'questions',
      id: existing.id,
      data: draftData as never,
      draft: true,
      overrideAccess: true,
    })
  }

  return payload.create({
    collection: 'questions',
    data: draftData as never,
    draft: true,
    overrideAccess: true,
  })
}

async function seedDemoContent() {
  const category = await upsertBySlug('categories', 'demo-tests', {
    name: 'Demo tests',
    slug: 'demo-tests',
    description: 'Mock category for internal product review. This is not a real exam catalog.',
    sortOrder: 1,
  })

  const test = await upsertBySlug('tests', 'sample-aptitude', {
    name: 'Sample Aptitude Test (Demo)',
    slug: 'sample-aptitude',
    category: category.id,
    publisherName: 'Demo content only — no real publisher',
    shortDescription:
      'Mock record for team review. It does not describe a real test or verified exam format.',
    formatVerifiedAt: new Date().toISOString(),
    sections: [
      {
        key: 'number-patterns',
        name: 'Number patterns (demo)',
        overview: 'One original sequence example used only to preview the CMS structure.',
        typicalQuestionCount: 1,
        typicalTimeMinutes: 1,
      },
    ],
    disclaimer:
      'Demo content only. This record is not a real exam and the format date is a placeholder. Replace and verify all details before approval.',
  })

  const course = await upsertBySlug('courses', 'sample-aptitude', {
    title: 'Sample Aptitude Course (Demo)',
    slug: 'sample-aptitude',
    test: test.id,
    summary: 'Mock course record for reviewing course relationships and CMS fields.',
    description: richText(
      'Demo only. No lessons are delivered and no learner progress is tracked in this preview.',
    ),
    freeStarter: { durationDays: 10 },
  })

  const gettingStartedModule = await upsertModule('Getting Started (Demo)', {
    title: 'Getting Started (Demo)',
    course: course.id,
    summary: 'A mock module showing how course sections are organized.',
    sortOrder: 1,
    accessLevel: 'free',
  })
  const practiceModule = await upsertModule('Practice Examples (Demo)', {
    title: 'Practice Examples (Demo)',
    course: course.id,
    summary: 'A mock module for previewing the course outline.',
    sortOrder: 2,
    accessLevel: 'full',
  })

  await upsertBySlug('lessons', 'how-to-use-this-demo', {
    title: 'How to use this demo',
    slug: 'how-to-use-this-demo',
    module: gettingStartedModule.id,
    sortOrder: 1,
    accessLevel: 'free',
    content: richText(
      'This is placeholder lesson content for the team demo. It is not a learner lesson.',
    ),
  })
  await upsertBySlug('lessons', 'practice-layout-preview', {
    title: 'Practice layout preview',
    slug: 'practice-layout-preview',
    module: practiceModule.id,
    sortOrder: 1,
    accessLevel: 'full',
    content: richText(
      'This mock lesson previews the content field only. No real study material is included.',
    ),
  })

  const question = await upsertQuestion('DEMO-SEQ-001', {
    internalId: 'DEMO-SEQ-001',
    test: test.id,
    section: 'number-patterns',
    type: 'sequence',
    skills: [{ skill: 'Number patterns (demo)' }],
    difficulty: 1,
    originalContentAttested: true,
    stem: richText('Which number comes next in this original demo sequence: 3, 6, 9, ___?'),
    itemData: {},
    options: [
      { id: 'a', text: '10' },
      { id: 'b', text: '11' },
      { id: 'c', text: '12' },
      { id: 'd', text: '15' },
    ],
    answer: { correctOptionIds: ['c'] },
    explanation: richText('The sequence increases by 3 each time, so the next number is 12.'),
    timeLimitSec: 60,
    visibility: 'free',
  })

  const quiz = await upsertBySlug('quiz-configs', 'sample-sequence-practice', {
    title: 'Sample Sequence Practice (Demo)',
    slug: 'sample-sequence-practice',
    test: test.id,
    mode: 'drill',
    navigation: 'free',
    accessLevel: 'public',
    configuration: {
      demoOnly: true,
      questionIds: [question.id],
      questionCount: 1,
      timeLimitSeconds: 60,
    },
  })

  await payload.update({
    collection: 'courses',
    id: course.id,
    data: {
      freeStarter: {
        durationDays: 10,
        includedModules: [gettingStartedModule.id],
        includedDrills: [quiz.id],
        includedSimulations: [],
      },
      _status: 'draft',
      workflowStatus: 'draft',
    } as never,
    draft: true,
    overrideAccess: true,
  })

  const faqs = [
    {
      question: 'DEMO — Is this based on a real exam?',
      answer: richText('No. This sample record is mock content for a team demo.'),
    },
    {
      question: 'DEMO — Are answers or progress saved?',
      answer: richText('No. This local preview does not save learner answers or progress.'),
    },
  ]

  for (const faq of faqs) {
    await upsertFaq(faq.question, {
      ...faq,
      test: test.id,
      sortOrder: faqs.indexOf(faq) + 1,
    })
  }

  await upsertBySlug('pages', 'sample-aptitude-practice-test', {
    title: 'Sample Aptitude Test Guide (Demo)',
    slug: 'sample-aptitude-practice-test',
    pageType: 'practice',
    test: test.id,
    content: [
      {
        blockType: 'hero',
        eyebrow: 'Demo practice guide',
        heading: 'Sample Aptitude Test (Demo)',
        body: richText('Mock page content for reviewing the CMS and public page structure.'),
        primaryAction: { label: 'View demo course', href: '/courses/sample-aptitude' },
      },
      {
        blockType: 'disclaimer',
        publisherName: 'Demo content only',
        content: 'This record is not a real test guide and has not been fact-checked.',
      },
    ],
  })

  console.info('Seeded or refreshed demo drafts in Payload:')
  console.info(
    '  1 category, 1 test, 1 page, 2 FAQs, 1 course, 2 modules, 2 lessons, 1 question, 1 quiz',
  )
  console.info('All records are drafts. No product pricing, testimonials, or media were invented.')
}

try {
  await seedDemoContent()
} finally {
  await payload.destroy()
}
