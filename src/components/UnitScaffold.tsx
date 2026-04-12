import { useState } from 'react'
import { TabNav } from './TabNav'
import { PlaceholderPanel } from './PlaceholderPanel'
import type { SubtopicId } from '../lib/study'
import type { ReactNode } from 'react'

type SubtopicConfig = {
  id: SubtopicId
  label: string
  render?: () => ReactNode
  plannedDrills?: string[]
}

type UnitScaffoldProps = {
  unitLabel: string
  subtopics: SubtopicConfig[]
  defaultSubtopicId?: SubtopicId
}

export function UnitScaffold({
  unitLabel,
  subtopics,
  defaultSubtopicId,
}: UnitScaffoldProps) {
  const initial = defaultSubtopicId ?? subtopics[0]?.id ?? 'overview'
  const [activeSubtopic, setActiveSubtopic] = useState<SubtopicId>(initial)

  const selected = subtopics.find((subtopic) => subtopic.id === activeSubtopic)

  return (
    <div>
      <h2 className="section-title">{unitLabel}</h2>
      <TabNav
        options={subtopics.map((subtopic) => ({
          id: subtopic.id,
          label: subtopic.label,
        }))}
        activeTab={activeSubtopic}
        onChange={setActiveSubtopic}
        variant="subtopic"
      />
      {selected?.render ? (
        selected.render()
      ) : (
        <PlaceholderPanel
          unitLabel={unitLabel}
          subtopicLabel={selected?.label ?? 'Overview'}
          plannedDrills={selected?.plannedDrills}
        />
      )}
    </div>
  )
}
