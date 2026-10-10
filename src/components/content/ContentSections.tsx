import Image from 'next/image'
import type { ReactNode } from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'

import type { Faq, Media, Page, TestChangelog } from '@/payload-types'
import { ButtonLink } from '@/components/ui'

import styles from './content-sections.module.css'

type PageBlock = Page['content'][number]
type RichTextData = Extract<PageBlock, { blockType: 'rich-text' }>['content']

export function RichTextContent({ data }: { data: RichTextData }) {
  return <RichText className={styles.richText} data={data} />
}

export function HeroSection({
  eyebrow,
  heading,
  body,
  image,
  action,
}: {
  eyebrow?: string | null
  heading: string
  body?: ReactNode
  image?: Media | null
  action?: { label?: string | null; href?: string | null }
}) {
  const actionHref = safeInternalHref(action?.href)

  return (
    <section className={styles.hero}>
      <div className={styles.heroCopy}>
        {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
        <h1>{heading}</h1>
        {body ? <div className={styles.heroBody}>{body}</div> : null}
        {action?.label && actionHref ? (
          <ButtonLink className={styles.heroAction} href={actionHref} size="large">
            {action.label}
          </ButtonLink>
        ) : null}
      </div>
      {image?.url && image.width && image.height ? (
        <div className={styles.heroMedia}>
          <Image
            alt={image.alt}
            className={styles.heroImage}
            height={image.height}
            src={image.url}
            width={image.width}
          />
        </div>
      ) : null}
    </section>
  )
}

export function TestFactsTable({
  facts,
  heading = 'Test overview',
}: {
  facts: Array<{ label: string; value: string }>
  heading?: string
}) {
  if (facts.length === 0) return null

  return (
    <section aria-labelledby="test-facts-heading" className={styles.section}>
      <h2 id="test-facts-heading">{heading}</h2>
      <dl className={styles.factsGrid}>
        {facts.map((fact) => (
          <div className={styles.fact} key={`${fact.label}-${fact.value}`}>
            <dt>{fact.label}</dt>
            <dd>{fact.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

export function SectionCards({
  sections,
  heading = 'Test sections',
}: {
  sections: Array<{ title: string; anchor: string; description?: string | null }>
  heading?: string
}) {
  if (sections.length === 0) return null

  return (
    <nav aria-label={heading} className={styles.section}>
      <h2>{heading}</h2>
      <ul className={styles.sectionGrid}>
        {sections.map((section) => (
          <li key={section.anchor}>
            <a className={styles.sectionCard} href={`#${section.anchor}`}>
              <span className={styles.cardHeading}>{section.title}</span>
              {section.description ? <span>{section.description}</span> : null}
              <span className={styles.textLink}>Jump to worked example</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export function WorkedExample({
  id,
  title,
  questionType,
  example,
  reasoning,
  tip,
  tryIt,
}: {
  id?: string
  title: string
  questionType?: string | null
  example: ReactNode
  reasoning: ReactNode
  tip?: string | null
  tryIt?: ReactNode
}) {
  return (
    <section
      aria-labelledby={`${id ?? 'worked-example'}-heading`}
      className={styles.example}
      id={id}
    >
      <div className={styles.exampleHeader}>
        <div>
          <p className={styles.eyebrow}>Worked example</p>
          <h2 id={`${id ?? 'worked-example'}-heading`}>{title}</h2>
        </div>
        {questionType ? <span className={styles.typeTag}>{questionType}</span> : null}
      </div>
      <div className={styles.exampleGrid}>
        <div>
          <h3>Example</h3>
          {example}
        </div>
        <div>
          <h3>How to solve it</h3>
          {reasoning}
        </div>
      </div>
      {tip ? (
        <p className={styles.tip}>
          <strong>Tip:</strong> {tip}
        </p>
      ) : null}
      {tryIt ? <div className={styles.tryIt}>{tryIt}</div> : null}
    </section>
  )
}

export function ScoringExplainer({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section className={styles.scoring}>
      <h2>{heading}</h2>
      {children}
    </section>
  )
}

export function FAQList({
  faqs,
  heading = 'Frequently asked questions',
}: {
  faqs: Faq[]
  heading?: string
}) {
  const visibleFAQs = faqs.filter(
    (faq) => faq._status === 'published' && faq.workflowStatus === 'approved',
  )

  if (visibleFAQs.length === 0) return null

  return (
    <section aria-labelledby="faq-heading" className={styles.section}>
      <h2 id="faq-heading">{heading}</h2>
      <div className={styles.faqList}>
        {visibleFAQs.map((faq) => (
          <details className={styles.faqItem} key={faq.id}>
            <summary>{faq.question}</summary>
            <RichTextContent data={faq.answer as RichTextData} />
          </details>
        ))}
      </div>
    </section>
  )
}

export function CourseCTA({
  heading,
  body,
  label,
  href,
}: {
  heading: string
  body?: string | null
  label: string
  href: string
}) {
  const safeHref = safeInternalHref(href)

  return (
    <section className={styles.courseCTA}>
      <div>
        <h2>{heading}</h2>
        {body ? <p>{body}</p> : null}
      </div>
      {safeHref ? <ButtonLink href={safeHref}>{label}</ButtonLink> : null}
    </section>
  )
}

export function TestimonialStrip({
  items,
  heading = 'Candidate experiences',
}: {
  items: Array<{
    id?: string | null
    quote: string
    name: string
    context?: string | null
    consentConfirmed: boolean
  }>
  heading?: string
}) {
  const consentedItems = items.filter((item) => item.consentConfirmed)
  if (consentedItems.length === 0) return null

  return (
    <section aria-labelledby="testimonials-heading" className={styles.section}>
      <h2 id="testimonials-heading">{heading}</h2>
      <ul className={styles.testimonialGrid}>
        {consentedItems.map((item, index) => (
          <li className={styles.testimonial} key={item.id ?? `${item.name}-${index}`}>
            <blockquote>
              <p>{item.quote}</p>
              <footer>
                <cite>{item.name}</cite>
                {item.context ? <span>{item.context}</span> : null}
              </footer>
            </blockquote>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function Disclaimer({ publisherName, content }: { publisherName: string; content: string }) {
  return (
    <aside aria-label="Test independence disclaimer" className={styles.disclaimer}>
      <p>{content}</p>
      <p>
        This preparation material is independent and is not affiliated with or endorsed by{' '}
        {publisherName}.
      </p>
    </aside>
  )
}

export function FreshnessLog({ entries }: { entries: TestChangelog[] }) {
  const visibleEntries = entries
    .filter((entry) => entry._status === 'published' && entry.workflowStatus === 'approved')
    .sort((a, b) => b.effectiveOn.localeCompare(a.effectiveOn))

  if (visibleEntries.length === 0) return null

  return (
    <section aria-labelledby="freshness-heading" className={styles.section}>
      <h2 id="freshness-heading">Test format updates</h2>
      <ol className={styles.freshnessList}>
        {visibleEntries.map((entry) => (
          <li key={entry.id}>
            <time dateTime={entry.effectiveOn}>
              {new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeZone: 'UTC' }).format(
                new Date(entry.effectiveOn),
              )}
            </time>
            <h3>{entry.title}</h3>
            <RichTextContent data={entry.summary as RichTextData} />
            {entry.source ? (
              <p className={styles.source}>Verification reference: {entry.source}</p>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  )
}

export function EmbeddedQuizShell({
  intro,
  children,
}: {
  intro?: string | null
  children?: ReactNode
}) {
  return (
    <section
      aria-labelledby="embedded-quiz-heading"
      className={styles.quizShell}
      id="free-practice-quiz"
    >
      <p className={styles.eyebrow}>Free practice</p>
      <h2 id="embedded-quiz-heading">Try a timed practice quiz</h2>
      {intro ? <p>{intro}</p> : null}
      {children}
    </section>
  )
}

export function ContentBlockRenderer({
  blocks,
  renderEmbeddedQuiz,
  renderTryIt,
}: {
  blocks: PageBlock[]
  renderEmbeddedQuiz?: (quizConfigId: number) => ReactNode
  renderTryIt?: (questionId: number) => ReactNode
}) {
  return (
    <div className={styles.contentBlocks}>
      {blocks.map((block, index) => {
        const key = block.id ?? `${block.blockType}-${index}`

        switch (block.blockType) {
          case 'hero':
            return (
              <HeroSection
                body={block.body ? <RichTextContent data={block.body as RichTextData} /> : null}
                eyebrow={block.eyebrow}
                heading={block.heading}
                image={typeof block.image === 'object' ? block.image : null}
                action={block.primaryAction}
                key={key}
              />
            )
          case 'rich-text':
            return <RichTextContent data={block.content} key={key} />
          case 'test-facts-table':
            return <TestFactsTable facts={block.facts ?? []} key={key} />
          case 'section-cards':
            return <SectionCards key={key} sections={block.sections ?? []} />
          case 'walkthrough': {
            const questionId =
              typeof block.tryItItem === 'number' ? block.tryItItem : block.tryItItem?.id

            return (
              <WorkedExample
                example={<RichTextContent data={block.example as RichTextData} />}
                id={block.id ?? undefined}
                key={key}
                questionType={block.questionType}
                reasoning={<RichTextContent data={block.reasoning as RichTextData} />}
                title={block.title}
                tip={block.tip}
                tryIt={questionId ? renderTryIt?.(questionId) : undefined}
              />
            )
          }
          case 'embedded-quiz': {
            const quizConfigId =
              typeof block.quizConfig === 'number' ? block.quizConfig : block.quizConfig.id

            return (
              <EmbeddedQuizShell intro={block.intro} key={key}>
                {renderEmbeddedQuiz?.(quizConfigId)}
              </EmbeddedQuizShell>
            )
          }
          case 'scoring-explainer':
            return (
              <ScoringExplainer heading={block.heading} key={key}>
                <RichTextContent data={block.content as RichTextData} />
              </ScoringExplainer>
            )
          case 'faq-references':
            return (
              <FAQList
                faqs={block.faqs.filter((faq): faq is Faq => typeof faq === 'object')}
                key={key}
              />
            )
          case 'cta':
            return (
              <CourseCTA
                body={block.body}
                heading={block.heading}
                href={block.href}
                key={key}
                label={block.label}
              />
            )
          case 'testimonials':
            return <TestimonialStrip items={block.items ?? []} key={key} />
          case 'disclaimer':
            return (
              <Disclaimer content={block.content} key={key} publisherName={block.publisherName} />
            )
          default:
            return null
        }
      })}
    </div>
  )
}

function safeInternalHref(href?: string | null): string | undefined {
  if (!href || !href.startsWith('/') || href.startsWith('//') || href.includes('\\')) {
    return undefined
  }

  return href
}
