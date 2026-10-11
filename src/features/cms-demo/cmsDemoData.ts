export type DemoCollectionID =
  | 'categories'
  | 'tests'
  | 'testVariants'
  | 'pages'
  | 'faqs'
  | 'testChangelog'
  | 'courses'
  | 'modules'
  | 'lessons'
  | 'questions'
  | 'quizConfigs'
  | 'products'
  | 'media'
  | 'users'

export type DemoFieldKind = 'text' | 'textarea' | 'number' | 'date' | 'select'

export type DemoField = {
  name: string
  label: string
  kind?: DemoFieldKind
  required?: boolean
  helpText?: string
  options?: string[]
}

export type DemoRecord = {
  id: string
  values: Record<string, string>
  updatedLabel: string
}

export type DemoState = Record<DemoCollectionID, DemoRecord[]>

export type DemoCollection = {
  id: DemoCollectionID
  group: string
  label: string
  singular: string
  titleField: string
  description: string
  fields: DemoField[]
  disabled?: boolean
  disabledReason?: string
}

const pageTypes = ['Home', 'Category hub', 'Free practice', 'Course sales', 'Blog article', 'Legal']
const accessLevels = ['Public', 'Free Starter', 'Full Prep']

export const demoCollections: DemoCollection[] = [
  {
    id: 'categories',
    group: 'Catalog',
    label: 'Categories',
    singular: 'Category',
    titleField: 'name',
    description: 'Group related tests so the catalog is easy to browse.',
    fields: [
      { name: 'name', label: 'Category name', required: true },
      { name: 'slug', label: 'URL slug', required: true },
      { name: 'description', label: 'Description', kind: 'textarea' },
      { name: 'sortOrder', label: 'Display order', kind: 'number' },
    ],
  },
  {
    id: 'tests',
    group: 'Catalog',
    label: 'Tests',
    singular: 'Test',
    titleField: 'name',
    description: 'Manage test information, sections, and the required disclaimer.',
    fields: [
      { name: 'name', label: 'Test name', required: true },
      { name: 'slug', label: 'URL slug', required: true },
      { name: 'category', label: 'Category', required: true, helpText: 'Enter the category name.' },
      { name: 'publisherName', label: 'Publisher name', required: true },
      {
        name: 'shortDescription',
        label: 'Short description',
        kind: 'textarea',
        required: true,
      },
      {
        name: 'formatVerifiedAt',
        label: 'Format last checked',
        kind: 'date',
        required: true,
        helpText: 'Demo records use a placeholder date. Verify it before approval.',
      },
      { name: 'sections', label: 'Sections', kind: 'textarea', required: true },
      { name: 'disclaimer', label: 'Required disclaimer', kind: 'textarea', required: true },
    ],
  },
  {
    id: 'testVariants',
    group: 'Catalog',
    label: 'Test variants',
    singular: 'Test variant',
    titleField: 'name',
    description: 'Optional variants for employer or agency-specific formats.',
    fields: [
      { name: 'name', label: 'Variant name', required: true },
      { name: 'slug', label: 'URL slug', required: true },
      { name: 'test', label: 'Related test', required: true },
      { name: 'overrides', label: 'Format overrides', kind: 'textarea' },
    ],
  },
  {
    id: 'pages',
    group: 'Public content',
    label: 'Pages',
    singular: 'Page',
    titleField: 'title',
    description: 'Build public pages from approved content blocks.',
    fields: [
      { name: 'title', label: 'Page title', required: true },
      { name: 'slug', label: 'URL slug', required: true },
      { name: 'pageType', label: 'Page type', kind: 'select', options: pageTypes, required: true },
      { name: 'test', label: 'Related test' },
      { name: 'content', label: 'Page content', kind: 'textarea', required: true },
      { name: 'disclaimer', label: 'Disclaimer', kind: 'textarea' },
    ],
  },
  {
    id: 'faqs',
    group: 'Public content',
    label: 'FAQs',
    singular: 'FAQ',
    titleField: 'question',
    description: 'Write answers to common test and course questions.',
    fields: [
      { name: 'question', label: 'Question', required: true },
      { name: 'test', label: 'Related test' },
      { name: 'answer', label: 'Answer', kind: 'textarea', required: true },
      { name: 'sortOrder', label: 'Display order', kind: 'number' },
    ],
  },
  {
    id: 'testChangelog',
    group: 'Public content',
    label: 'Test change log',
    singular: 'Change entry',
    titleField: 'title',
    description: 'Record verified changes to test formats over time.',
    fields: [
      { name: 'title', label: 'Change title', required: true },
      { name: 'test', label: 'Related test', required: true },
      { name: 'effectiveOn', label: 'Effective date', kind: 'date', required: true },
      { name: 'summary', label: 'Summary', kind: 'textarea', required: true },
      { name: 'source', label: 'Verification source' },
    ],
  },
  {
    id: 'courses',
    group: 'Learning content',
    label: 'Courses',
    singular: 'Course',
    titleField: 'title',
    description: 'Organize a course and configure its Free Starter content.',
    fields: [
      { name: 'title', label: 'Course title', required: true },
      { name: 'slug', label: 'URL slug', required: true },
      { name: 'test', label: 'Related test', required: true },
      { name: 'summary', label: 'Summary', kind: 'textarea', required: true },
      { name: 'description', label: 'Description', kind: 'textarea' },
      { name: 'starterDurationDays', label: 'Free Starter days', kind: 'number', required: true },
      { name: 'includedModules', label: 'Included modules', kind: 'textarea' },
      { name: 'includedDrills', label: 'Included drills', kind: 'textarea' },
    ],
  },
  {
    id: 'modules',
    group: 'Learning content',
    label: 'Modules',
    singular: 'Module',
    titleField: 'title',
    description: 'Group lessons into ordered course modules.',
    fields: [
      { name: 'title', label: 'Module title', required: true },
      { name: 'course', label: 'Course', required: true },
      { name: 'summary', label: 'Summary', kind: 'textarea' },
      { name: 'sortOrder', label: 'Display order', kind: 'number', required: true },
      { name: 'accessLevel', label: 'Access level', kind: 'select', options: accessLevels },
    ],
  },
  {
    id: 'lessons',
    group: 'Learning content',
    label: 'Lessons',
    singular: 'Lesson',
    titleField: 'title',
    description: 'Add lesson content and set its course access level.',
    fields: [
      { name: 'title', label: 'Lesson title', required: true },
      { name: 'slug', label: 'URL slug', required: true },
      { name: 'module', label: 'Module', required: true },
      { name: 'sortOrder', label: 'Display order', kind: 'number', required: true },
      { name: 'accessLevel', label: 'Access level', kind: 'select', options: accessLevels },
      { name: 'content', label: 'Lesson content', kind: 'textarea', required: true },
    ],
  },
  {
    id: 'questions',
    group: 'Learning content',
    label: 'Questions',
    singular: 'Question',
    titleField: 'internalId',
    description: 'Review sample question structure. Answer keys and explanations are omitted.',
    fields: [
      { name: 'internalId', label: 'Internal ID', required: true },
      { name: 'test', label: 'Related test', required: true },
      { name: 'section', label: 'Section', required: true },
      {
        name: 'type',
        label: 'Question type',
        kind: 'select',
        options: ['Multiple choice', 'Sequence', 'Numeric entry', 'Text entry'],
        required: true,
      },
      { name: 'difficulty', label: 'Difficulty (1–5)', kind: 'number', required: true },
      { name: 'stem', label: 'Question prompt', kind: 'textarea', required: true },
      { name: 'options', label: 'Answer options', kind: 'textarea' },
    ],
  },
  {
    id: 'quizConfigs',
    group: 'Learning content',
    label: 'Quiz configurations',
    singular: 'Quiz configuration',
    titleField: 'title',
    description: 'Configure a demo drill or simulation.',
    fields: [
      { name: 'title', label: 'Configuration title', required: true },
      { name: 'slug', label: 'URL slug', required: true },
      { name: 'test', label: 'Related test', required: true },
      { name: 'mode', label: 'Mode', kind: 'select', options: ['Drill', 'Simulation'] },
      { name: 'navigation', label: 'Navigation', kind: 'select', options: ['Free', 'Sequential'] },
      { name: 'accessLevel', label: 'Access level', kind: 'select', options: accessLevels },
      { name: 'questionCount', label: 'Question count', kind: 'number' },
      { name: 'timeLimitSeconds', label: 'Time limit (seconds)', kind: 'number' },
    ],
  },
  {
    id: 'products',
    group: 'Commerce',
    label: 'Products',
    singular: 'Product',
    titleField: 'name',
    description: 'Product fields are available to inspect; no price or payment setup is prefilled.',
    fields: [
      { name: 'name', label: 'Product name', required: true },
      { name: 'slug', label: 'URL slug', required: true },
      { name: 'test', label: 'Related test', required: true },
      { name: 'courses', label: 'Included courses', kind: 'textarea', required: true },
      {
        name: 'productType',
        label: 'Product type',
        kind: 'select',
        options: ['Full Prep', '30-day extension'],
        required: true,
      },
      { name: 'priceCents', label: 'Price in cents', kind: 'number', required: true },
      { name: 'currency', label: 'Currency', required: true },
      { name: 'durationDays', label: 'Access duration (days)', kind: 'number', required: true },
      { name: 'active', label: 'Available for purchase', kind: 'select', options: ['No', 'Yes'] },
    ],
  },
  {
    id: 'media',
    group: 'Content',
    label: 'Media',
    singular: 'Media item',
    titleField: 'alt',
    description: 'Media uploads require connected file storage.',
    fields: [],
    disabled: true,
    disabledReason: 'File uploads are unavailable in this browser-only preview.',
  },
  {
    id: 'users',
    group: 'Administration',
    label: 'Users',
    singular: 'User',
    titleField: 'email',
    description: 'User accounts and permissions require the real CMS backend.',
    fields: [],
    disabled: true,
    disabledReason: 'Sign-in and role management are unavailable in this preview.',
  },
]

export const demoInitialState: DemoState = {
  categories: [
    {
      id: 'category-demo-tests',
      updatedLabel: 'Demo record',
      values: {
        name: 'Demo tests',
        slug: 'demo-tests',
        description: 'Sample category for the CMS walkthrough. No real test catalog is included.',
        sortOrder: '1',
      },
    },
  ],
  tests: [
    {
      id: 'test-sample-aptitude',
      updatedLabel: 'Demo record',
      values: {
        name: 'Sample Aptitude Test (Demo)',
        slug: 'sample-aptitude',
        category: 'Demo tests',
        publisherName: 'Demo content only — no real publisher',
        shortDescription:
          'Mock record for reviewing the CMS fields. It does not describe a real exam format.',
        formatVerifiedAt: '2026-01-01',
        sections: 'Number patterns (demo) — one original sequence example',
        disclaimer:
          'Demo content only. This is not a real test guide. Verify details before approval.',
      },
    },
  ],
  testVariants: [],
  pages: [
    {
      id: 'page-sample-guide',
      updatedLabel: 'Demo record',
      values: {
        title: 'Sample Aptitude Test Guide (Demo)',
        slug: 'sample-aptitude-practice-test',
        pageType: 'Free practice',
        test: 'Sample Aptitude Test (Demo)',
        content: 'Demo page content. The full block editor is represented by this text field.',
        disclaimer: 'This record is mock content and has not been fact-checked.',
      },
    },
  ],
  faqs: [
    {
      id: 'faq-demo-real-exam',
      updatedLabel: 'Demo record',
      values: {
        question: 'DEMO — Is this based on a real exam?',
        test: 'Sample Aptitude Test (Demo)',
        answer: 'No. This sample record is mock content for the team demo.',
        sortOrder: '1',
      },
    },
    {
      id: 'faq-demo-progress',
      updatedLabel: 'Demo record',
      values: {
        question: 'DEMO — Are answers or progress saved?',
        test: 'Sample Aptitude Test (Demo)',
        answer: 'No. This browser-only demo does not track learner answers or progress.',
        sortOrder: '2',
      },
    },
  ],
  testChangelog: [],
  courses: [
    {
      id: 'course-sample-aptitude',
      updatedLabel: 'Demo record',
      values: {
        title: 'Sample Aptitude Course (Demo)',
        slug: 'sample-aptitude',
        test: 'Sample Aptitude Test (Demo)',
        summary: 'Mock course record for reviewing course relationships and fields.',
        description: 'Demo only. No lessons are delivered and no learner progress is tracked.',
        starterDurationDays: '10',
        includedModules: 'Getting Started (Demo)',
        includedDrills: 'Sample Sequence Practice (Demo)',
      },
    },
  ],
  modules: [
    {
      id: 'module-getting-started',
      updatedLabel: 'Demo record',
      values: {
        title: 'Getting Started (Demo)',
        course: 'Sample Aptitude Course (Demo)',
        summary: 'A mock module showing how course sections are organized.',
        sortOrder: '1',
        accessLevel: 'Free Starter',
      },
    },
    {
      id: 'module-practice-examples',
      updatedLabel: 'Demo record',
      values: {
        title: 'Practice Examples (Demo)',
        course: 'Sample Aptitude Course (Demo)',
        summary: 'A mock module for previewing the course outline.',
        sortOrder: '2',
        accessLevel: 'Full Prep',
      },
    },
  ],
  lessons: [
    {
      id: 'lesson-how-to-use-demo',
      updatedLabel: 'Demo record',
      values: {
        title: 'How to use this demo',
        slug: 'how-to-use-this-demo',
        module: 'Getting Started (Demo)',
        sortOrder: '1',
        accessLevel: 'Free Starter',
        content: 'Placeholder lesson content for the team demo. It is not a learner lesson.',
      },
    },
    {
      id: 'lesson-practice-layout',
      updatedLabel: 'Demo record',
      values: {
        title: 'Practice layout preview',
        slug: 'practice-layout-preview',
        module: 'Practice Examples (Demo)',
        sortOrder: '1',
        accessLevel: 'Full Prep',
        content: 'This mock lesson previews the content field only.',
      },
    },
  ],
  questions: [
    {
      id: 'question-demo-sequence',
      updatedLabel: 'Demo record',
      values: {
        internalId: 'DEMO-SEQ-001',
        test: 'Sample Aptitude Test (Demo)',
        section: 'number-patterns',
        type: 'Sequence',
        difficulty: '1',
        stem: 'Which number comes next in this original demo sequence: 3, 6, 9, ___?',
        options: '10\n11\n12\n15',
      },
    },
  ],
  quizConfigs: [
    {
      id: 'quiz-sample-sequence',
      updatedLabel: 'Demo record',
      values: {
        title: 'Sample Sequence Practice (Demo)',
        slug: 'sample-sequence-practice',
        test: 'Sample Aptitude Test (Demo)',
        mode: 'Drill',
        navigation: 'Free',
        accessLevel: 'Public',
        questionCount: '1',
        timeLimitSeconds: '60',
      },
    },
  ],
  products: [],
  media: [],
  users: [],
}

export function getDemoCollection(id: DemoCollectionID): DemoCollection {
  const collection = demoCollections.find((item) => item.id === id)
  if (!collection) throw new Error(`Unknown CMS demo collection: ${id}`)
  return collection
}

export function getDemoRecordTitle(collectionID: DemoCollectionID, record: DemoRecord): string {
  const collection = getDemoCollection(collectionID)
  return (
    record.values[collection.titleField]?.trim() || `Untitled ${collection.singular.toLowerCase()}`
  )
}
