import type { FormHTMLAttributes, ReactNode } from 'react'
import Link from 'next/link'

import { Button } from '@/components/ui'

import styles from './checkout.module.css'

type FormAction = FormHTMLAttributes<HTMLFormElement>['action']

export function OrderSummary({
  productName,
  durationDays,
  priceLabel,
  discountLabel,
  totalLabel,
}: {
  productName: string
  durationDays: number
  priceLabel: string
  discountLabel?: string | null
  totalLabel: string
}) {
  return (
    <section aria-labelledby="order-summary-heading" className={styles.summary}>
      <h2 id="order-summary-heading">Order summary</h2>
      <dl>
        <div>
          <dt>Product</dt>
          <dd>{productName}</dd>
        </div>
        <div>
          <dt>Access period</dt>
          <dd>{durationDays} days</dd>
        </div>
        <div>
          <dt>Price</dt>
          <dd>{priceLabel}</dd>
        </div>
        {discountLabel ? (
          <div>
            <dt>Discount</dt>
            <dd>{discountLabel}</dd>
          </div>
        ) : null}
        <div className={styles.total}>
          <dt>Total</dt>
          <dd>{totalLabel}</dd>
        </div>
      </dl>
    </section>
  )
}

export function CouponCodeForm({
  action,
  enabled,
  errorMessage,
  appliedLabel,
}: {
  action: FormAction
  enabled: boolean
  errorMessage?: string
  appliedLabel?: string
}) {
  if (!enabled) return null
  return (
    <form action={action} className={styles.couponForm}>
      <label htmlFor="coupon-code">Coupon code</label>
      <div>
        <input autoComplete="off" id="coupon-code" name="code" />
        <Button type="submit" variant="secondary">
          Apply
        </Button>
      </div>
      {errorMessage ? <p role="alert">{errorMessage}</p> : null}
      {appliedLabel ? <p role="status">{appliedLabel}</p> : null}
    </form>
  )
}

export function PayPalButtonsRegion({
  status,
  children,
  message,
}: {
  status: 'loading' | 'ready' | 'error'
  children?: ReactNode
  message?: string
}) {
  const fallback =
    status === 'loading'
      ? 'Loading PayPal checkout…'
      : status === 'error'
        ? (message ?? 'PayPal checkout could not be loaded.')
        : 'Payment options will appear here.'
  return (
    <section aria-labelledby="payment-heading" aria-live="polite" className={styles.payment}>
      <h2 id="payment-heading">Payment</h2>
      <div aria-label="PayPal payment options" className={styles.paymentRegion}>
        {children ?? <p>{fallback}</p>}
      </div>
      <p className={styles.paymentNote}>Your access starts after PayPal confirms the payment.</p>
    </section>
  )
}

export function PaymentStatus({
  status,
  message,
  nextHref,
  nextLabel,
}: {
  status: 'pending' | 'complete' | 'failed'
  message: string
  nextHref?: string
  nextLabel?: string
}) {
  return (
    <section aria-live="polite" className={styles.paymentStatus}>
      <p className={styles.statusLabel}>
        {status === 'complete'
          ? 'Payment complete'
          : status === 'failed'
            ? 'Payment not completed'
            : 'Payment processing'}
      </p>
      <h1>{message}</h1>
      {nextHref && nextLabel ? (
        <Link className={styles.nextLink} href={nextHref}>
          {nextLabel}
        </Link>
      ) : null}
    </section>
  )
}

export function RefundRequestForm({
  action,
  purchases,
  errorMessage,
}: {
  action: FormAction
  purchases: Array<{ id: string; label: string }>
  errorMessage?: string
}) {
  return (
    <form action={action} className={styles.supportForm}>
      <h2>Request a refund</h2>
      <p>
        Refund requests can be sent within 7 days of purchase. The support team reviews each
        request.
      </p>
      {errorMessage ? <p role="alert">{errorMessage}</p> : null}
      <label>
        Purchase
        <select name="purchaseId" required defaultValue="">
          <option disabled value="">
            Choose a purchase
          </option>
          {purchases.map((purchase) => (
            <option key={purchase.id} value={purchase.id}>
              {purchase.label}
            </option>
          ))}
        </select>
      </label>
      <label>
        Reason
        <textarea name="reason" required rows={4} />
      </label>
      <Button type="submit">Send refund request</Button>
    </form>
  )
}

export function ExtensionRequestForm({
  action,
  purchaseLabel,
  errorMessage,
}: {
  action: FormAction
  purchaseLabel: string
  errorMessage?: string
}) {
  return (
    <form action={action} className={styles.supportForm}>
      <h2>Request an access extension</h2>
      <p>
        Ask for a 30-day extension if your test was postponed or you need a retake. The request
        needs admin approval.
      </p>
      <p>
        <strong>Purchase:</strong> {purchaseLabel}
      </p>
      {errorMessage ? <p role="alert">{errorMessage}</p> : null}
      <label>
        Reason
        <select name="reason" required defaultValue="">
          <option disabled value="">
            Choose a reason
          </option>
          <option value="test-postponed">Test postponed</option>
          <option value="retake">Retake</option>
        </select>
      </label>
      <label>
        More details
        <textarea name="details" rows={4} />
      </label>
      <Button type="submit">Send request</Button>
    </form>
  )
}

export function RequestConfirmation({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section aria-live="polite" className={styles.confirmation}>
      <p className={styles.statusLabel}>Request received</p>
      <h2>{title}</h2>
      <div>{children}</div>
    </section>
  )
}
