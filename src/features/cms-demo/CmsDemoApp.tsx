'use client'

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ChangeEvent,
  type FormEvent,
} from 'react'

import {
  demoCollections,
  demoInitialState,
  getDemoCollection,
  getDemoRecordTitle,
  type DemoCollection,
  type DemoCollectionID,
  type DemoField,
  type DemoRecord,
  type DemoState,
} from './cmsDemoData'
import {
  cloneDemoState,
  readStoredDemoState,
  resetStoredDemoState,
  writeStoredDemoState,
} from './cmsDemoStorage'
import styles from './cms-demo.module.css'

const navigationGroups = [
  'Catalog',
  'Public content',
  'Learning content',
  'Commerce',
  'Content',
  'Administration',
]

function makeRecordID() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `demo-${Date.now()}-${Math.round(Math.random() * 1_000_000)}`
}

function blankRecord(collection: DemoCollection): DemoRecord {
  const values = Object.fromEntries(
    collection.fields.map((field) => [
      field.name,
      field.kind === 'select' ? (field.options?.[0] ?? '') : '',
    ]),
  )

  return { id: makeRecordID(), values, updatedLabel: 'New draft' }
}

function fieldValue(record: DemoRecord, fieldName: string) {
  return record.values[fieldName] ?? ''
}

function Button({
  children,
  className,
  kind = 'secondary',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { kind?: 'primary' | 'secondary' | 'quiet' }) {
  const kindClass =
    kind === 'primary'
      ? styles.primaryButton
      : kind === 'quiet'
        ? styles.quietButton
        : styles.secondaryButton

  return (
    <button {...props} className={[styles.button, kindClass, className].filter(Boolean).join(' ')}>
      {children}
    </button>
  )
}

function StatusPill() {
  return <span className={styles.statusPill}>Draft</span>
}

function FieldControl({
  collection,
  field,
  record,
  onChange,
}: {
  collection: DemoCollection
  field: DemoField
  record: DemoRecord
  onChange: (name: string, value: string) => void
}) {
  const fieldID = `${collection.id}-${record.id}-${field.name}`
  const value = fieldValue(record, field.name)
  const commonProps = {
    id: fieldID,
    name: field.name,
    required: field.required,
    value,
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      onChange(field.name, event.currentTarget.value),
  }

  return (
    <div className={styles.field}>
      <label htmlFor={fieldID}>
        {field.label}
        {field.required ? (
          <span aria-hidden="true" className={styles.requiredMark}>
            *
          </span>
        ) : null}
      </label>
      {field.kind === 'textarea' ? (
        <textarea {...commonProps} rows={4} />
      ) : field.kind === 'select' ? (
        <select {...commonProps}>
          <option value="">Choose an option</option>
          {field.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          {...commonProps}
          type={field.kind === 'number' ? 'number' : field.kind === 'date' ? 'date' : 'text'}
          min={field.kind === 'number' ? '0' : undefined}
        />
      )}
      {field.helpText ? <small>{field.helpText}</small> : null}
    </div>
  )
}

export function CmsDemoApp() {
  const [activeCollectionID, setActiveCollectionID] = useState<DemoCollectionID | null>(null)
  const [records, setRecords] = useState<DemoState>(() => cloneDemoState())
  const [hydrated, setHydrated] = useState(false)
  const [storageReady, setStorageReady] = useState(true)
  const [search, setSearch] = useState('')
  const [editorDraft, setEditorDraft] = useState<DemoRecord | null>(null)
  const [editorCollectionID, setEditorCollectionID] = useState<DemoCollectionID | null>(null)
  const [formError, setFormError] = useState('')
  const [notice, setNotice] = useState('')
  const [noticeID, setNoticeID] = useState(0)
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const stored = readStoredDemoState()
      if (stored) setRecords(stored)
      setStorageReady(writeStoredDemoState(stored ?? demoInitialState))
      setHydrated(true)
    }, 0)

    return () => window.clearTimeout(timer)
  }, [])

  const activeCollection = activeCollectionID ? getDemoCollection(activeCollectionID) : null
  const filteredRecords = useMemo(() => {
    if (!activeCollectionID) return []
    const activeRecords = records[activeCollectionID]
    if (!search.trim()) return activeRecords
    const query = search.trim().toLowerCase()
    return activeRecords.filter((record) => {
      const searchable = [
        getDemoRecordTitle(activeCollectionID, record),
        ...Object.values(record.values),
      ]
      return searchable.some((value) => value.toLowerCase().includes(query))
    })
  }, [activeCollectionID, records, search])

  const announce = (message: string) => {
    setNotice(message)
    setNoticeID((previous) => previous + 1)
  }

  const openEditor = (collection: DemoCollection, record?: DemoRecord) => {
    if (collection.disabled) return
    setActiveCollectionID(collection.id)
    setEditorCollectionID(collection.id)
    setEditorDraft(record ? { ...record, values: { ...record.values } } : blankRecord(collection))
    setFormError('')
    dialogRef.current?.showModal()
  }

  const updateField = (name: string, value: string) => {
    setEditorDraft((previous) =>
      previous ? { ...previous, values: { ...previous.values, [name]: value } } : previous,
    )
  }

  const saveDraft = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!editorDraft || !editorCollectionID) return

    const collection = getDemoCollection(editorCollectionID)
    const missingRequired = collection.fields.find(
      (field) => field.required && !editorDraft.values[field.name]?.trim(),
    )
    if (missingRequired) {
      setFormError(`${missingRequired.label} is required.`)
      return
    }

    const wasExisting = records[editorCollectionID].some((record) => record.id === editorDraft.id)
    const savedRecord = { ...editorDraft, updatedLabel: 'Saved just now' }
    const nextRecords = {
      ...records,
      [editorCollectionID]: wasExisting
        ? records[editorCollectionID].map((record) =>
            record.id === savedRecord.id ? savedRecord : record,
          )
        : [savedRecord, ...records[editorCollectionID]],
    }
    setRecords(nextRecords)
    setStorageReady(writeStoredDemoState(nextRecords))
    dialogRef.current?.close()
    announce(`${collection.singular} saved as a draft in this browser.`)
  }

  const deleteRecord = (collection: DemoCollection, record: DemoRecord) => {
    if (
      !window.confirm(
        `Delete “${getDemoRecordTitle(collection.id, record)}” from this browser demo?`,
      )
    )
      return
    const nextRecords = {
      ...records,
      [collection.id]: records[collection.id].filter((item) => item.id !== record.id),
    }
    setRecords(nextRecords)
    setStorageReady(writeStoredDemoState(nextRecords))
    announce(`${collection.singular} removed from this browser demo.`)
  }

  const resetDemo = () => {
    if (!window.confirm('Reset all browser demo content to the original sample records?')) return
    const resetSucceeded = resetStoredDemoState()
    setRecords(cloneDemoState(demoInitialState))
    setStorageReady(resetSucceeded)
    setSearch('')
    setActiveCollectionID(null)
    announce('Demo content reset in this browser.')
  }

  const navigateTo = (collectionID: DemoCollectionID | null) => {
    setActiveCollectionID(collectionID)
    setSearch('')
  }

  const startQuickCreate = (collectionID: DemoCollectionID) => {
    const collection = getDemoCollection(collectionID)
    navigateTo(collectionID)
    openEditor(collection)
  }

  const recentRecords = demoCollections
    .filter((collection) => !collection.disabled)
    .flatMap((collection) =>
      records[collection.id].map((record) => ({
        collection,
        record,
        key: `${collection.id}-${record.id}`,
      })),
    )
    .slice(0, 5)

  const collectionCounts = [
    { label: 'Tests', collectionID: 'tests' as const },
    { label: 'Pages', collectionID: 'pages' as const },
    { label: 'Courses', collectionID: 'courses' as const },
    { label: 'Questions', collectionID: 'questions' as const },
  ]

  return (
    <div className={styles.shell}>
      <div className={styles.frame}>
        <aside className={styles.sidebar} aria-label="CMS demo navigation">
          <div className={styles.brand}>
            <span className={styles.brandMark} aria-hidden="true">
              T
            </span>
            <span>
              <strong>Test Prep</strong>
              <small>Content studio</small>
            </span>
          </div>

          <nav className={styles.navigation}>
            <button
              type="button"
              className={`${styles.navItem} ${activeCollectionID === null ? styles.navItemActive : ''}`}
              aria-current={activeCollectionID === null ? 'page' : undefined}
              onClick={() => navigateTo(null)}
            >
              <span className={styles.navIcon} aria-hidden="true">
                ⌂
              </span>
              Overview
            </button>
            {navigationGroups.map((group) => {
              const groupCollections = demoCollections.filter(
                (collection) => collection.group === group,
              )
              if (!groupCollections.length) return null
              return (
                <div className={styles.navGroup} key={group}>
                  <p className={styles.navGroupLabel}>{group}</p>
                  {groupCollections.map((collection) => (
                    <button
                      type="button"
                      key={collection.id}
                      className={`${styles.navItem} ${activeCollectionID === collection.id ? styles.navItemActive : ''} ${collection.disabled ? styles.navItemDisabled : ''}`}
                      aria-current={activeCollectionID === collection.id ? 'page' : undefined}
                      onClick={() => navigateTo(collection.id)}
                    >
                      <span className={styles.navIcon} aria-hidden="true">
                        {collection.label.slice(0, 1)}
                      </span>
                      <span className={styles.navLabel}>{collection.label}</span>
                      {collection.disabled ? <span className={styles.navLock}>Preview</span> : null}
                    </button>
                  ))}
                </div>
              )
            })}
          </nav>

          <div className={styles.sidebarNote}>
            <span className={styles.sidebarNoteDot} aria-hidden="true" />
            <span>
              <strong>Browser demo</strong>
              <small>Personal to this browser</small>
            </span>
          </div>
        </aside>

        <div className={styles.mainColumn}>
          <header className={styles.topbar}>
            <div className={styles.breadcrumb}>
              <span>Workspace</span>
              <span aria-hidden="true">/</span>
              <strong>{activeCollection?.label ?? 'Overview'}</strong>
            </div>
            <div className={styles.topbarActions}>
              <span className={styles.saveIndicator}>
                <span
                  className={storageReady ? styles.saveDot : styles.saveDotWarning}
                  aria-hidden="true"
                />
                {hydrated
                  ? storageReady
                    ? 'Saved in this browser'
                    : 'Browser storage unavailable'
                  : 'Loading demo…'}
              </span>
              <Button kind="quiet" onClick={resetDemo}>
                Reset demo
              </Button>
              <span className={styles.avatar} aria-label="Demo editor">
                D
              </span>
            </div>
          </header>

          <main className={styles.content}>
            <div className={styles.demoNotice} role="note">
              <span className={styles.noticeIcon} aria-hidden="true">
                i
              </span>
              <p>
                <strong>Browser-only CMS demo.</strong> Your edits are saved on this device only.
                They are not shared with other reviewers or connected to the public site. Don’t
                enter real or sensitive data.
              </p>
            </div>

            {activeCollection ? (
              <section aria-labelledby="collection-heading">
                {activeCollection.disabled ? (
                  <div className={styles.disabledPanel}>
                    <span className={styles.disabledIcon} aria-hidden="true">
                      —
                    </span>
                    <p className={styles.eyebrow}>{activeCollection.group}</p>
                    <h1 id="collection-heading">{activeCollection.label}</h1>
                    <p>{activeCollection.disabledReason}</p>
                    <p className={styles.mutedCopy}>
                      This feature will be available when the real CMS backend is connected.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className={styles.pageHeading}>
                      <div>
                        <p className={styles.eyebrow}>{activeCollection.group}</p>
                        <h1 id="collection-heading">{activeCollection.label}</h1>
                        <p className={styles.pageDescription}>{activeCollection.description}</p>
                      </div>
                      <Button kind="primary" onClick={() => openEditor(activeCollection)}>
                        <span aria-hidden="true">＋</span> Add{' '}
                        {activeCollection.singular.toLowerCase()}
                      </Button>
                    </div>

                    {activeCollectionID === 'questions' ? (
                      <div className={styles.inlineHint}>
                        Answer keys and explanations are hidden in this public demo. They remain
                        staff-only in the real CMS.
                      </div>
                    ) : null}

                    <div className={styles.collectionToolbar}>
                      <label className={styles.searchBox}>
                        <span aria-hidden="true">⌕</span>
                        <span className={styles.visuallyHidden}>
                          Search {activeCollection.label.toLowerCase()}
                        </span>
                        <input
                          type="search"
                          value={search}
                          onChange={(event) => setSearch(event.currentTarget.value)}
                          placeholder={`Search ${activeCollection.label.toLowerCase()}…`}
                        />
                        {search ? (
                          <Button kind="quiet" onClick={() => setSearch('')}>
                            Clear
                          </Button>
                        ) : null}
                      </label>
                      <span className={styles.recordCount}>
                        {filteredRecords.length}{' '}
                        {filteredRecords.length === 1 ? 'record' : 'records'}
                      </span>
                    </div>

                    {filteredRecords.length ? (
                      <div className={styles.tableWrap}>
                        <table className={styles.table}>
                          <thead>
                            <tr>
                              <th scope="col">Name</th>
                              <th scope="col">Status</th>
                              <th scope="col">Last saved</th>
                              <th scope="col">
                                <span className={styles.visuallyHidden}>Actions</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredRecords.map((record) => (
                              <tr key={record.id}>
                                <td>
                                  <div className={styles.recordName}>
                                    {getDemoRecordTitle(activeCollection.id, record)}
                                  </div>
                                  <div className={styles.recordSlug}>
                                    {record.values.slug ||
                                      record.values.internalId ||
                                      'Mock record'}
                                  </div>
                                </td>
                                <td>
                                  <StatusPill />
                                </td>
                                <td className={styles.savedText}>{record.updatedLabel}</td>
                                <td className={styles.rowActions}>
                                  <Button
                                    kind="quiet"
                                    onClick={() => openEditor(activeCollection, record)}
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    kind="quiet"
                                    onClick={() => deleteRecord(activeCollection, record)}
                                  >
                                    Delete
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className={styles.emptyState}>
                        <span className={styles.emptyIcon} aria-hidden="true">
                          ＋
                        </span>
                        <h2>
                          {search
                            ? 'No matching records'
                            : `No ${activeCollection.label.toLowerCase()} yet`}
                        </h2>
                        <p>
                          {search
                            ? 'Try another search term.'
                            : 'Add a draft record to explore the editor.'}
                        </p>
                        {!search ? (
                          <Button kind="primary" onClick={() => openEditor(activeCollection)}>
                            Add {activeCollection.singular.toLowerCase()}
                          </Button>
                        ) : null}
                      </div>
                    )}
                  </>
                )}
              </section>
            ) : (
              <section aria-labelledby="overview-heading">
                <div className={styles.pageHeading}>
                  <div>
                    <p className={styles.eyebrow}>Content workspace</p>
                    <h1 id="overview-heading">Good morning, Demo editor</h1>
                    <p className={styles.pageDescription}>
                      A sample workspace to review how test content could be organized.
                    </p>
                  </div>
                  <Button kind="primary" onClick={() => startQuickCreate('tests')}>
                    <span aria-hidden="true">＋</span> Create a test
                  </Button>
                </div>

                <div className={styles.summaryGrid}>
                  {collectionCounts.map((item) => {
                    const collection = getDemoCollection(item.collectionID)
                    return (
                      <button
                        type="button"
                        className={styles.summaryCard}
                        key={item.collectionID}
                        onClick={() => navigateTo(item.collectionID)}
                      >
                        <span className={styles.summaryLabel}>{item.label}</span>
                        <strong>{records[item.collectionID].length}</strong>
                        <span className={styles.summaryFoot}>
                          {collection.group} <span aria-hidden="true">↗</span>
                        </span>
                      </button>
                    )
                  })}
                </div>

                <div className={styles.overviewGrid}>
                  <section className={styles.panel} aria-labelledby="recent-heading">
                    <div className={styles.panelHeading}>
                      <div>
                        <p className={styles.eyebrow}>Your workspace</p>
                        <h2 id="recent-heading">Sample content</h2>
                      </div>
                      <span className={styles.panelBadge}>Drafts only</span>
                    </div>
                    <div className={styles.recentList}>
                      {recentRecords.map(({ collection, record, key }) => (
                        <button
                          type="button"
                          className={styles.recentRow}
                          key={key}
                          onClick={() => {
                            navigateTo(collection.id)
                            openEditor(collection, record)
                          }}
                        >
                          <span className={styles.recentType}>{collection.label.slice(0, 1)}</span>
                          <span className={styles.recentInfo}>
                            <strong>{getDemoRecordTitle(collection.id, record)}</strong>
                            <small>
                              {collection.label} · {record.updatedLabel}
                            </small>
                          </span>
                          <StatusPill />
                        </button>
                      ))}
                    </div>
                  </section>

                  <section
                    className={`${styles.panel} ${styles.nextStepsPanel}`}
                    aria-labelledby="next-steps-heading"
                  >
                    <p className={styles.eyebrow}>Demo guide</p>
                    <h2 id="next-steps-heading">Explore the content workflow</h2>
                    <ol className={styles.stepsList}>
                      <li>
                        <span>1</span>
                        <p>Open a sample test and review its fields.</p>
                      </li>
                      <li>
                        <span>2</span>
                        <p>Edit a draft or create a new test.</p>
                      </li>
                      <li>
                        <span>3</span>
                        <p>Refresh this page to see your local changes remain.</p>
                      </li>
                    </ol>
                    <p className={styles.smallNote}>
                      Publishing, uploads, user accounts, and website updates are disabled in this
                      preview.
                    </p>
                  </section>
                </div>
              </section>
            )}
          </main>
        </div>
      </div>

      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-labelledby="editor-heading"
        onClose={() => {
          setEditorDraft(null)
          setEditorCollectionID(null)
          setFormError('')
        }}
      >
        {editorDraft && editorCollectionID ? (
          <form className={styles.editorForm} onSubmit={saveDraft}>
            <div className={styles.dialogHeader}>
              <div>
                <p className={styles.eyebrow}>{getDemoCollection(editorCollectionID).label}</p>
                <h2 id="editor-heading">
                  {records[editorCollectionID].some((record) => record.id === editorDraft.id)
                    ? `Edit ${getDemoCollection(editorCollectionID).singular.toLowerCase()}`
                    : `New ${getDemoCollection(editorCollectionID).singular.toLowerCase()}`}
                </h2>
              </div>
              <button
                type="button"
                className={styles.closeButton}
                aria-label="Close editor"
                onClick={() => dialogRef.current?.close()}
              >
                ×
              </button>
            </div>

            <div className={styles.dialogDemoNote}>
              This draft saves to this browser only. It won’t publish to the website.
            </div>

            <div className={styles.fieldsGrid}>
              {getDemoCollection(editorCollectionID).fields.map((field) => (
                <FieldControl
                  key={field.name}
                  collection={getDemoCollection(editorCollectionID)}
                  field={field}
                  record={editorDraft}
                  onChange={updateField}
                />
              ))}
            </div>

            {formError ? (
              <p className={styles.formError} role="alert">
                {formError}
              </p>
            ) : null}
            <div className={styles.dialogFooter}>
              <Button type="button" kind="secondary" onClick={() => dialogRef.current?.close()}>
                Cancel
              </Button>
              <Button type="submit" kind="primary">
                Save draft
              </Button>
            </div>
          </form>
        ) : null}
      </dialog>

      <div className={styles.srOnly} aria-live="polite" key={noticeID}>
        {notice}
      </div>
    </div>
  )
}
