type BreadcrumbItem = { name: string; url: string }
type FAQItem = { question: string; answer: string }

function jsonLdScript(value: Record<string, unknown>, key: string) {
  const json = JSON.stringify(value).replace(/</g, '\\u003c').replace(/>/g, '\\u003e')
  return <script key={key} type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
}

export function BreadcrumbListJsonLd({ items }: { items: BreadcrumbItem[] }) {
  if (items.length === 0) return null
  return jsonLdScript(
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    },
    'breadcrumbs',
  )
}

export function FAQPageJsonLd({ items }: { items: FAQItem[] }) {
  const visibleItems = items.filter((item) => item.question.trim() && item.answer.trim())
  if (visibleItems.length === 0) return null
  return jsonLdScript(
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: visibleItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    },
    'faq',
  )
}

export function CourseJsonLd({
  name,
  description,
  providerName = 'Test Prep Platform',
  url,
}: {
  name: string
  description: string
  providerName?: string
  url: string
}) {
  return jsonLdScript(
    {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name,
      description,
      url,
      provider: { '@type': 'Organization', name: providerName },
    },
    'course',
  )
}
