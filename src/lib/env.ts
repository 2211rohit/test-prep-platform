export function requireEnv(name: string): string {
  const value = process.env[name]

  if (!value) {
    throw new Error(`${name} must be set in the environment.`)
  }

  return value
}

export function requireSecret(name: string, minimumLength = 32): string {
  const value = requireEnv(name)

  if (value.length < minimumLength) {
    throw new Error(`${name} must contain at least ${minimumLength} characters.`)
  }

  return value
}
