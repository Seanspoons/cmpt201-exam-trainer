import { useMemo, useState } from 'react'
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

const ALL_TOPICS_ID = '__all-topics' as SubtopicId

export function UnitScaffold({
  unitLabel,
  subtopics,
  defaultSubtopicId,
}: UnitScaffoldProps) {
  const renderedSubtopics = useMemo(
    () => subtopics.filter((subtopic) => Boolean(subtopic.render)),
    [subtopics],
  )
  const hasAllTopics = renderedSubtopics.length > 1

  const initial = defaultSubtopicId ?? subtopics[0]?.id ?? 'overview'
  const [activeSubtopic, setActiveSubtopic] = useState<SubtopicId>(initial)
  const [allTopicsIndex, setAllTopicsIndex] = useState(0)

  const selected = subtopics.find((subtopic) => subtopic.id === activeSubtopic)
  const activeAllTopic =
    renderedSubtopics[allTopicsIndex % Math.max(renderedSubtopics.length, 1)]

  const tabOptions = hasAllTopics
    ? [{ id: ALL_TOPICS_ID, label: 'All Topics' }, ...subtopics]
    : subtopics

  return (
    <div>
      <h2 className="section-title">{unitLabel}</h2>
      <TabNav
        options={tabOptions.map((subtopic) => ({
          id: subtopic.id,
          label: subtopic.label,
        }))}
        activeTab={activeSubtopic}
        onChange={(tab) => {
          setActiveSubtopic(tab)
          if (tab === ALL_TOPICS_ID) {
            setAllTopicsIndex(0)
          }
        }}
        variant="subtopic"
      />

      {activeSubtopic === ALL_TOPICS_ID && hasAllTopics ? (
        <div>
          <div className="all-topics-bar">
            <p className="all-topics-note">
              All Topics mode cycles through all implemented subtopics in this unit.
            </p>
            <button
              className="button-secondary"
              onClick={() =>
                setAllTopicsIndex((index) =>
                  renderedSubtopics.length === 0
                    ? 0
                    : (index + 1) % renderedSubtopics.length,
                )
              }
            >
              Next Topic
            </button>
          </div>
          <p className="small-note">
            Current topic: <strong>{activeAllTopic?.label ?? 'N/A'}</strong>
          </p>
          <div key={activeAllTopic?.id}>
            {activeAllTopic?.render ? activeAllTopic.render() : null}
          </div>
        </div>
      ) : selected?.render ? (
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
