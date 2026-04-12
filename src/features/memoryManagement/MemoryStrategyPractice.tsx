import { useMemo, useState } from 'react'
import { NetworkingDrillPractice } from '../networkingShared/networkingDrills'
import type { NetworkingQuestion } from '../networkingShared/networkingDrills'

type StrategyMode =
  | 'Random'
  | 'Allocation Trace'
  | 'First Fit'
  | 'Best Fit'
  | 'Worst Fit'
  | 'Strategy Compare'

type MemoryStrategyPracticeProps = {
  title: string
  generators: {
    random: () => NetworkingQuestion
    allocationTrace: () => NetworkingQuestion
    firstFit: () => NetworkingQuestion
    bestFit: () => NetworkingQuestion
    worstFit: () => NetworkingQuestion
    strategyCompare: () => NetworkingQuestion
  }
}

export function MemoryStrategyPractice({
  title,
  generators,
}: MemoryStrategyPracticeProps) {
  const [selectedMode, setSelectedMode] = useState<StrategyMode>('Random')

  const generateQuestion = useMemo(() => {
    switch (selectedMode) {
      case 'Allocation Trace':
        return generators.allocationTrace
      case 'First Fit':
        return generators.firstFit
      case 'Best Fit':
        return generators.bestFit
      case 'Worst Fit':
        return generators.worstFit
      case 'Strategy Compare':
        return generators.strategyCompare
      case 'Random':
      default:
        return generators.random
    }
  }, [generators, selectedMode])

  return (
    <div>
      <div className="nested-choice-panel nested-choice-panel--memory">
        <p className="nested-choice-label">Allocation Strategy</p>
        <div className="nested-choice-row" role="tablist" aria-label="Memory allocation strategy">
          {(
            [
              'Random',
              'Allocation Trace',
              'First Fit',
              'Best Fit',
              'Worst Fit',
              'Strategy Compare',
            ] as const
          ).map((mode) => (
            <button
              key={mode}
              role="tab"
              aria-selected={selectedMode === mode}
              className={`nested-choice-button nested-choice-button--memory ${
                selectedMode === mode ? 'nested-choice-button--active' : ''
              }`}
              onClick={() => setSelectedMode(mode)}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>
      <NetworkingDrillPractice
        key={`memory-strategy-${selectedMode}`}
        title={title}
        generateQuestion={generateQuestion}
      />
    </div>
  )
}
