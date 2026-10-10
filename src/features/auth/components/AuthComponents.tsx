import Link from 'next/link'
import type { FormHTMLAttributes, ReactNode } from 'react'

import { Button } from '@/components/ui'

import styles from './auth.module.css'

type FormAction = FormHTMLAttributes<HTMLFormElement>['action']

export function AuthPanel({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <main className={styles.panel}>
      <div className={styles.panelHeader}>
        <p className={styles.eyebrow}>Test Prep Platform</p>
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </div>
      {children}
    </main>
  )
}

export function EmailPasswordForm({
  mode,
  action,
  errorMessage,
  magicLinkHref,
  googleHref,
  resetHref,
}: {
  mode: 'sign-in' | 'sign-up'
  action: FormAction
  errorMessage?: string
  magicLinkHref?: string
  googleHref?: string
  resetHref?: string
}) {
  const isSignUp = mode === 'sign-up'
  return (
    <form action={action} className={styles.form}>
      {errorMessage ? (
        <p className={styles.formError} role="alert">
          {errorMessage}
        </p>
      ) : null}
      {isSignUp ? (
        <label>
          Full name
          <input autoComplete="name" name="name" required />
        </label>
      ) : null}
      <label>
        Email address
        <input autoComplete="email" name="email" required type="email" />
      </label>
      <label>
        Password
        <input
          autoComplete={isSignUp ? 'new-password' : 'current-password'}
          minLength={8}
          name="password"
          required
          type="password"
        />
      </label>
      <Button fullWidth type="submit">
        {isSignUp ? 'Create account' : 'Sign in'}
      </Button>
      {resetHref && !isSignUp ? <Link href={resetHref}>Forgot password?</Link> : null}
      {magicLinkHref || googleHref ? (
        <div className={styles.alternatives}>
          <p>Or continue another way</p>
          {magicLinkHref ? (
            <Link className={styles.alternativeLink} href={magicLinkHref}>
              Email me a sign-in link
            </Link>
          ) : null}
          {googleHref ? (
            <Link className={styles.alternativeLink} href={googleHref}>
              Continue with Google
            </Link>
          ) : null}
        </div>
      ) : null}
    </form>
  )
}

export function MagicLinkForm({
  action,
  errorMessage,
  successMessage,
}: {
  action: FormAction
  errorMessage?: string
  successMessage?: string
}) {
  return (
    <form action={action} className={styles.form}>
      {errorMessage ? (
        <p className={styles.formError} role="alert">
          {errorMessage}
        </p>
      ) : null}
      {successMessage ? (
        <p className={styles.formSuccess} role="status">
          {successMessage}
        </p>
      ) : null}
      <label>
        Email address
        <input autoComplete="email" name="email" required type="email" />
      </label>
      <Button fullWidth type="submit">
        Send sign-in link
      </Button>
    </form>
  )
}

export function SetPasswordForm({
  action,
  errorMessage,
}: {
  action: FormAction
  errorMessage?: string
}) {
  return (
    <form action={action} className={styles.form}>
      {errorMessage ? (
        <p className={styles.formError} role="alert">
          {errorMessage}
        </p>
      ) : null}
      <label>
        New password
        <input autoComplete="new-password" minLength={8} name="password" required type="password" />
      </label>
      <label>
        Confirm new password
        <input
          autoComplete="new-password"
          minLength={8}
          name="passwordConfirmation"
          required
          type="password"
        />
      </label>
      <Button fullWidth type="submit">
        Save password
      </Button>
    </form>
  )
}
