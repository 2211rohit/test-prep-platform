import {
  demoCollections,
  demoInitialState,
  type DemoCollectionID,
  type DemoRecord,
  type DemoState,
} from './cmsDemoData'

export const cmsDemoStorageKey = 'test-prep-cms-browser-demo-v1'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isDemoRecord(value: unknown): value is DemoRecord {
  if (!isRecord(value) || typeof value.id !== 'string' || typeof value.updatedLabel !== 'string') {
    return false
  }

  if (!isRecord(value.values)) return false
  return Object.values(value.values).every((fieldValue) => typeof fieldValue === 'string')
}

export function isDemoState(value: unknown): value is DemoState {
  if (!isRecord(value)) return false

  return demoCollections.every((collection) => {
    const records = value[collection.id]
    return Array.isArray(records) && records.every(isDemoRecord)
  })
}

export function cloneDemoState(state: DemoState = demoInitialState): DemoState {
  return JSON.parse(JSON.stringify(state)) as DemoState
}

export function getCollectionRecords(
  state: DemoState,
  collectionID: DemoCollectionID,
): DemoRecord[] {
  return state[collectionID]
}

export function readStoredDemoState(): DemoState | null {
  try {
    const stored = window.localStorage.getItem(cmsDemoStorageKey)
    if (!stored) return null

    const parsed: unknown = JSON.parse(stored)
    return isDemoState(parsed) ? parsed : null
  } catch {
    return null
  }
}

export function writeStoredDemoState(state: DemoState): boolean {
  try {
    window.localStorage.setItem(cmsDemoStorageKey, JSON.stringify(state))
    return true
  } catch {
    return false
  }
}

export function resetStoredDemoState(): boolean {
  try {
    window.localStorage.removeItem(cmsDemoStorageKey)
    return true
  } catch {
    return false
  }
}
