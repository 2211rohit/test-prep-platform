'use client'

import styles from './learner.module.css'

export function RoadmapChecklist({
  stages,
  onToggle,
}: {
  stages: Array<{ id: string; title: string; description?: string; completed: boolean }>
  onToggle: (stageId: string, completed: boolean) => void
}) {
  return (
    <section aria-labelledby="roadmap-heading" className={styles.section}>
      <h2 id="roadmap-heading">Hiring process roadmap</h2>
      <ol className={styles.roadmap}>
        {stages.map((stage, index) => (
          <li key={stage.id}>
            <span aria-hidden="true" className={styles.roadmapNumber}>
              {index + 1}
            </span>
            <div>
              <h3>{stage.title}</h3>
              {stage.description ? <p>{stage.description}</p> : null}
              <label>
                <input
                  checked={stage.completed}
                  onChange={(event) => onToggle(stage.id, event.target.checked)}
                  type="checkbox"
                />{' '}
                Mark this step complete
              </label>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
