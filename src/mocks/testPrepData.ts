import type { CatalogCategoryLink } from '@/features/catalog/types'
import type { QuizQuestionDTO } from '@/features/quiz/types'

/** Clearly labeled, original fixtures for frontend review before client approval. */
export const mockCatalogNavigation: CatalogCategoryLink[] = [
  {
    id: 1,
    name: 'Demo tests',
    slug: 'demo-tests',
    tests: [
      {
        id: 1,
        name: 'Sample Aptitude Test',
        slug: 'sample-aptitude',
        shortDescription:
          'Illustrative content for reviewing the platform layout. Not a real exam guide.',
      },
    ],
  },
]

export const mockPracticeGuide = {
  title: 'Sample Aptitude Test',
  slug: 'sample-aptitude',
  category: { name: 'Demo tests', slug: 'demo-tests' },
  description:
    'This page uses mock content to review the product layout. It does not describe a real test or exam provider.',
  facts: [
    { label: 'Page status', value: 'Demo content' },
    { label: 'Sections shown', value: '2 examples' },
    { label: 'Practice quiz', value: '1 original sample item' },
    { label: 'Official test details', value: 'Not supplied' },
  ],
  sections: [
    {
      title: 'Number patterns',
      anchor: 'number-patterns',
      description: 'A short illustrative sequence example.',
    },
    {
      title: 'Reading practice',
      anchor: 'reading-practice',
      description: 'A placeholder section for a future content example.',
    },
  ],
  workedExamples: [
    {
      id: 'number-patterns',
      title: 'Find the next number',
      questionType: 'Sequence',
      example: '2, 4, 6, ___',
      reasoning:
        'In this original demo sequence, each number increases by 2. Add 2 to 6 to get the next number.',
      tip: 'For a number sequence, compare the change between neighboring numbers first.',
    },
    {
      id: 'reading-practice',
      title: 'Reading example placeholder',
      questionType: 'Reading comprehension',
      example:
        'A reading passage and question will be added here as approved content becomes available.',
      reasoning: 'This placeholder does not represent a real test item.',
      tip: 'Demo content only.',
    },
  ],
  quizQuestion: {
    id: 'demo-sequence-1',
    number: 1,
    type: 'sequence',
    prompt: 'Which number comes next in this original demo sequence: 3, 6, 9, ___?',
    options: [
      { id: 'a', label: '10' },
      { id: 'b', label: '11' },
      { id: 'c', label: '12' },
      { id: 'd', label: '15' },
    ],
  } satisfies QuizQuestionDTO,
  faqs: [
    {
      question: 'Is this based on a real exam?',
      answer: 'No. This is a mock page for client review and does not describe a real exam.',
    },
    {
      question: 'Are quiz results saved?',
      answer: 'No. This preview runs in your browser and does not save or score answers.',
    },
  ],
  scoringHeading: 'Scoring details are not set up in this demo',
  scoringCopy:
    'Scoring rules and result explanations will be connected after the backend is approved.',
  course: {
    title: 'Sample course outline',
    summary: 'A mock outline to review the course layout. No lessons or paid access are available.',
    modules: [
      {
        id: 'module-1',
        title: 'Getting started',
        summary: 'Placeholder module content.',
        lessons: [
          { id: 'lesson-1', title: 'How to use this demo' },
          { id: 'lesson-2', title: 'Practice layout preview' },
        ],
      },
      {
        id: 'module-2',
        title: 'Practice examples',
        summary: 'Illustrative outline only.',
        lessons: [{ id: 'lesson-3', title: 'Example lesson placeholder' }],
      },
    ],
  },
}
