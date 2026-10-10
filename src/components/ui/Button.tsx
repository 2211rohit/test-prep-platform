import Link from 'next/link'
import type { ButtonHTMLAttributes, ComponentProps } from 'react'

import styles from './button.module.css'

export type ButtonVariant = 'primary' | 'secondary' | 'quiet'
export type ButtonSize = 'small' | 'medium' | 'large'

type SharedButtonProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  className?: string
}

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & SharedButtonProps

export type ButtonLinkProps = Omit<ComponentProps<typeof Link>, 'className'> & SharedButtonProps

const variantClass: Record<ButtonVariant, string> = {
  primary: styles.primary,
  secondary: styles.secondary,
  quiet: styles.quiet,
}

const sizeClass: Record<ButtonSize, string> = {
  small: styles.small,
  medium: styles.medium,
  large: styles.large,
}

function classes({
  variant,
  size,
  fullWidth,
  className,
}: Required<Pick<SharedButtonProps, 'variant' | 'size' | 'fullWidth'>> &
  Pick<SharedButtonProps, 'className'>): string {
  return [
    styles.button,
    variantClass[variant],
    sizeClass[size],
    fullWidth ? styles.fullWidth : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')
}

export function Button({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button className={classes({ variant, size, fullWidth, className })} type={type} {...props} />
  )
}

export function ButtonLink({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  className,
  ...props
}: ButtonLinkProps) {
  return <Link className={classes({ variant, size, fullWidth, className })} {...props} />
}
