import { useMemo, useState } from 'react'
import { AllTopicsProvider } from './AllTopicsContext'
import { TopicProvider } from './TopicContext'
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
              All Topics mode rotates automatically when you press New Question.
            </p>
          </div>
          <div key={activeAllTopic?.id}>
            <AllTopicsProvider
              value={{
                isAllTopicsMode: true,
                advanceTopic: () =>
                  setAllTopicsIndex((index) =>
                    renderedSubtopics.length === 0
                      ? 0
                      : (index + 1) % renderedSubtopics.length,
                  ),
              }}
            >
              <TopicProvider
                value={{
                  unitLabel,
                  subtopicLabel: activeAllTopic?.label ?? 'General',
                }}
              >
                {activeAllTopic?.render ? activeAllTopic.render() : null}
              </TopicProvider>
            </AllTopicsProvider>
          </div>
        </div>
      ) : selected?.render ? (
        <TopicProvider
          value={{
            unitLabel,
            subtopicLabel: selected.label,
          }}
        >
          {selected.render()}
        </TopicProvider>
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
