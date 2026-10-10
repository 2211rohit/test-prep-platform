import type { Block } from 'payload'

import { CTABlock } from './CTA'
import { DisclaimerBlock } from './Disclaimer'
import { EmbeddedQuizBlock } from './EmbeddedQuiz'
import { FAQReferencesBlock } from './FAQReferences'
import { HeroBlock } from './Hero'
import { RichTextBlock } from './RichText'
import { ScoringExplainerBlock } from './ScoringExplainer'
import { SectionCardsBlock } from './SectionCards'
import { TestimonialsBlock } from './Testimonials'
import { TestFactsTableBlock } from './TestFactsTable'
import { WalkthroughBlock } from './Walkthrough'

export const pageContentBlocks: Block[] = [
  HeroBlock,
  RichTextBlock,
  TestFactsTableBlock,
  SectionCardsBlock,
  WalkthroughBlock,
  EmbeddedQuizBlock,
  ScoringExplainerBlock,
  FAQReferencesBlock,
  CTABlock,
  TestimonialsBlock,
  DisclaimerBlock,
]
