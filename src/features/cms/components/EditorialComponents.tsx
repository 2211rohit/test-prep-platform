import Link from 'next/link'
import type { FormHTMLAttributes } from 'react'

import { Button } from '@/components/ui'
import { QuestionCard } from '@/features/quiz/components/QuestionCard'
import type { QuizQuestionDTO } from '@/features/quiz/types'

import styles from './editorial.module.css'

type FormAction = FormHTMLAttributes<HTMLFormElement>['action']

export function WorkflowStatus({
  status,
}: {
  status: 'draft' | 'in-review' | 'approved' | 'published'
}) {
  const labels = {
    draft: 'Draft',
    'in-review': 'In review',
    approved: 'Approved',
    published: 'Published',
  }
  return <span className={styles.status}>{labels[status]}</span>
}

export function EditorialWorkflowPanel({
  status,
  previewHref,
  submitForReviewAction,
  publishAction,
  canPublish = false,
}: {
  status: 'draft' | 'in-review' | 'approved' | 'published'
  previewHref?: string
  submitForReviewAction?: FormAction
  publishAction?: FormAction
  canPublish?: boolean
}) {
  return (
    <section aria-labelledby="workflow-title" className={styles.panel}>
      <div className={styles.panelHeading}>
        <h2 id="workflow-title">Editorial workflow</h2>
        <WorkflowStatus status={status} />
      </div>
      {previewHref ? (
        <p>
          <Link href={previewHref}>Open content preview</Link>
        </p>
      ) : null}
      <div className={styles.workflowActions}>
        {submitForReviewAction && status === 'draft' ? (
          <form action={submitForReviewAction}>
            <Button type="submit" variant="secondary">
              Submit for review
            </Button>
          </form>
        ) : null}
        {canPublish && publishAction && status === 'approved' ? (
          <form action={publishAction}>
            <Button type="submit">Publish approved content</Button>
          </form>
        ) : null}
      </div>
      <p className={styles.helpText}>
        Editors submit drafts for review. Only an administrator can publish approved content.
      </p>
    </section>
  )
}

export type ImportRowResult = {
  row: number
  status: 'valid' | 'invalid'
  fields: Array<{ field: string; error: string }>
}

export function ImportValidationReport({
  rows,
  retryAction,
}: {
  rows: ImportRowResult[]
  retryAction?: FormAction
}) {
  const invalidRows = rows.filter((row) => row.status === 'invalid')
  return (
    <section aria-labelledby="import-report-title" className={styles.panel}>
      <div className={styles.panelHeading}>
        <h2 id="import-report-title">Import validation</h2>
        <span>{invalidRows.length} rows need attention</span>
      </div>
      {rows.length === 0 ? (
        <p className={styles.helpText}>No validation results to show.</p>
      ) : (
        <div className={styles.tableScroll}>
          <table>
            <thead>
              <tr>
                <th scope="col">Row</th>
                <th scope="col">Status</th>
                <th scope="col">Field</th>
                <th scope="col">Issue</th>
              </tr>
            </thead>
            <tbody>
              {rows.flatMap((row) =>
                row.fields.length ? (
                  row.fields.map((issue, index) => (
                    <tr key={`${row.row}-${issue.field}-${index}`}>
                      <th scope="row">{row.row}</th>
                      <td>{row.status === 'valid' ? 'Valid' : 'Needs correction'}</td>
                      <td>{issue.field}</td>
                      <td>{issue.error}</td>
                    </tr>
                  ))
                ) : (
                  <tr key={row.row}>
                    <th scope="row">{row.row}</th>
                    <td>Valid</td>
                    <td>—</td>
                    <td>No issues found</td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      )}
      {invalidRows.length && retryAction ? (
        <form action={retryAction} className={styles.retryForm}>
          <input
            name="rowNumbers"
            type="hidden"
            value={invalidRows.map((row) => row.row).join(',')}
          />
          <Button type="submit" variant="secondary">
            Retry corrected rows
          </Button>
        </form>
      ) : null}
    </section>
  )
}

export function QuestionImportForm({
  action,
  errorMessage,
}: {
  action: FormAction
  errorMessage?: string
}) {
  return (
    <form action={action} className={styles.panel}>
      <h2>Import questions</h2>
      <p className={styles.helpText}>
        Upload a CSV or JSON file. The server validates each row before saving any question.
      </p>
      {errorMessage ? (
        <p role="alert" className={styles.error}>
          {errorMessage}
        </p>
      ) : null}
      <label className={styles.fileInput}>
        Question file
        <input accept=".csv,.json,text/csv,application/json" name="file" required type="file" />
      </label>
      <Button type="submit">Validate import</Button>
    </form>
  )
}

export function QuestionAuthoringPreview({
  question,
  mode,
}: {
  question: QuizQuestionDTO
  mode: 'learn' | 'drill' | 'timed' | 'simulation'
}) {
  return (
    <section aria-labelledby="author-preview-title" className={styles.preview}>
      <div className={styles.panelHeading}>
        <div>
          <p className={styles.helpText}>Question preview</p>
          <h2 id="author-preview-title">{mode[0].toUpperCase() + mode.slice(1)} mode</h2>
        </div>
        <span className={styles.status}>Answers hidden</span>
      </div>
      <QuestionCard question={question} />
    </section>
  )
}

export function QuestionTagSummary({
  section,
  difficulty,
  skills,
}: {
  section: string
  difficulty: number
  skills: string[]
}) {
  return (
    <dl className={styles.questionMeta}>
      <div>
        <dt>Section</dt>
        <dd>{section}</dd>
      </div>
      <div>
        <dt>Difficulty</dt>
        <dd>{difficulty} of 5</dd>
      </div>
      <div>
        <dt>Skills</dt>
        <dd>{skills.length ? skills.join(', ') : 'No skills assigned'}</dd>
      </div>
    </dl>
  )
}

export function AdminSearchForm({
  action,
  label,
  placeholder = 'Search by email',
}: {
  action: FormAction
  label: string
  placeholder?: string
}) {
  return (
    <form action={action} className={styles.searchForm}>
      <label htmlFor="admin-search">{label}</label>
      <div>
        <input id="admin-search" name="query" placeholder={placeholder} type="search" />
        <Button type="submit" variant="secondary">
          Search
        </Button>
      </div>
    </form>
  )
}

export function EntitlementActionForm({
  action,
  userEmail,
  tests,
  errorMessage,
}: {
  action: FormAction
  userEmail: string
  tests: Array<{ id: string; name: string }>
  errorMessage?: string
}) {
  return (
    <form action={action} className={styles.panel}>
      <h2>Change learner access</h2>
      <p className={styles.helpText}>
        For {userEmail}. Every change needs a reason and is recorded in the audit log.
      </p>
      {errorMessage ? (
        <p className={styles.error} role="alert">
          {errorMessage}
        </p>
      ) : null}
      <label>
        Test
        <select name="testId" required defaultValue="">
          <option disabled value="">
            Choose a test
          </option>
          {tests.map((test) => (
            <option key={test.id} value={test.id}>
              {test.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Action
        <select name="change" required defaultValue="">
          <option disabled value="">
            Choose an action
          </option>
          <option value="grant">Grant access</option>
          <option value="extend">Extend access</option>
          <option value="shorten">Shorten access</option>
          <option value="revoke">Revoke access</option>
        </select>
      </label>
      <label>
        Days to add or remove
        <input min="1" name="days" type="number" />
      </label>
      <label>
        Reason
        <textarea name="reason" required rows={3} />
      </label>
      <Button type="submit">Save access change</Button>
    </form>
  )
}

export function OrdersTable({
  orders,
}: {
  orders: Array<{
    id: string
    email: string
    product: string
    dateLabel: string
    status: string
    amountLabel: string
  }>
}) {
  return (
    <section className={styles.panel}>
      <h2>Orders</h2>
      <div className={styles.tableScroll}>
        <table>
          <thead>
            <tr>
              <th scope="col">Customer</th>
              <th scope="col">Product</th>
              <th scope="col">Date</th>
              <th scope="col">Status</th>
              <th scope="col">Amount</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <th scope="row">{order.email}</th>
                <td>{order.product}</td>
                <td>{order.dateLabel}</td>
                <td>{order.status}</td>
                <td>{order.amountLabel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export function AuditLogTable({
  entries,
}: {
  entries: Array<{
    id: string
    actor: string
    action: string
    record: string
    dateLabel: string
    reason?: string
  }>
}) {
  return (
    <section className={styles.panel}>
      <h2>Change history</h2>
      <div className={styles.tableScroll}>
        <table>
          <thead>
            <tr>
              <th scope="col">When</th>
              <th scope="col">Who</th>
              <th scope="col">Change</th>
              <th scope="col">Record</th>
              <th scope="col">Reason</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id}>
                <td>{entry.dateLabel}</td>
                <th scope="row">{entry.actor}</th>
                <td>{entry.action}</td>
                <td>{entry.record}</td>
                <td>{entry.reason ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export function ContentReviewQueue({
  items,
}: {
  items: Array<{
    id: string
    title: string
    collection: string
    editor: string
    submittedAt: string
    href: string
  }>
}) {
  return (
    <section className={styles.panel}>
      <h2>Waiting for review</h2>
      {items.length ? (
        <ul className={styles.queue}>
          {items.map((item) => (
            <li key={item.id}>
              <div>
                <strong>{item.title}</strong>
                <span>
                  {item.collection} · submitted by {item.editor} · {item.submittedAt}
                </span>
              </div>
              <Link href={item.href}>Review</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.helpText}>There are no items waiting for review.</p>
      )}
    </section>
  )
}
