import { randomInt, randomPick } from '../../lib/random'

export type PageReplacementAlgorithm = 'FIFO' | 'LRU'

export type PageReplacementQuestion = {
  algorithm: PageReplacementAlgorithm
  frameCount: number
  referenceString: number[]
}

export type PageReplacementStep = {
  step: number
  page: number
  frames: Array<number | null>
  pageFault: boolean
  evictedPage: number | null
  reason: string
}

export type PageReplacementSolution = {
  steps: PageReplacementStep[]
  totalFaults: number
  finalFrames: Array<number | null>
}

export function generatePageReplacementQuestion(): PageReplacementQuestion {
  const frameCount = randomPick([3, 4])
  const length = randomInt(6, 10)
  const maxPage = randomPick([5, 7])
  const referenceString = Array.from({ length }, () => randomInt(1, maxPage))

  return {
    algorithm: randomPick(['FIFO', 'LRU']),
    frameCount,
    referenceString,
  }
}

export function solvePageReplacement(
  question: PageReplacementQuestion,
): PageReplacementSolution {
  return question.algorithm === 'FIFO' ? solveFifo(question) : solveLru(question)
}

function solveFifo(question: PageReplacementQuestion): PageReplacementSolution {
  const frames: Array<number | null> = Array.from(
    { length: question.frameCount },
    () => null,
  )
  let nextToReplace = 0
  let totalFaults = 0
  const steps: PageReplacementStep[] = []

  question.referenceString.forEach((page, index) => {
    const hitIndex = frames.indexOf(page)
    if (hitIndex >= 0) {
      steps.push({
        step: index + 1,
        page,
        frames: [...frames],
        pageFault: false,
        evictedPage: null,
        reason: `Hit: page ${page} is already in a frame.`,
      })
      return
    }

    totalFaults += 1
    const emptyIndex = frames.indexOf(null)
    if (emptyIndex >= 0) {
      frames[emptyIndex] = page
      steps.push({
        step: index + 1,
        page,
        frames: [...frames],
        pageFault: true,
        evictedPage: null,
        reason: `Fault: placed page ${page} into empty frame ${emptyIndex + 1}.`,
      })
      return
    }

    const evictedPage = frames[nextToReplace]
    frames[nextToReplace] = page
    steps.push({
      step: index + 1,
      page,
      frames: [...frames],
      pageFault: true,
      evictedPage,
      reason: `Fault: FIFO evicts page ${evictedPage} from frame ${nextToReplace + 1} because it was loaded earliest.`,
    })
    nextToReplace = (nextToReplace + 1) % question.frameCount
  })

  return {
    steps,
    totalFaults,
    finalFrames: [...frames],
  }
}

function solveLru(question: PageReplacementQuestion): PageReplacementSolution {
  const frames: Array<number | null> = Array.from(
    { length: question.frameCount },
    () => null,
  )
  const lastUsedStep = new Map<number, number>()
  let totalFaults = 0
  const steps: PageReplacementStep[] = []

  question.referenceString.forEach((page, index) => {
    const currentStep = index + 1
    const hitIndex = frames.indexOf(page)
    if (hitIndex >= 0) {
      lastUsedStep.set(page, currentStep)
      steps.push({
        step: currentStep,
        page,
        frames: [...frames],
        pageFault: false,
        evictedPage: null,
        reason: `Hit: page ${page} was recently used and remains in memory.`,
      })
      return
    }

    totalFaults += 1
    const emptyIndex = frames.indexOf(null)
    if (emptyIndex >= 0) {
      frames[emptyIndex] = page
      lastUsedStep.set(page, currentStep)
      steps.push({
        step: currentStep,
        page,
        frames: [...frames],
        pageFault: true,
        evictedPage: null,
        reason: `Fault: placed page ${page} into empty frame ${emptyIndex + 1}.`,
      })
      return
    }

    let replaceIndex = 0
    let leastRecentStep = Number.POSITIVE_INFINITY

    frames.forEach((framePage, frameIndex) => {
      const usedAt = framePage === null ? -1 : (lastUsedStep.get(framePage) ?? -1)
      if (usedAt < leastRecentStep) {
        leastRecentStep = usedAt
        replaceIndex = frameIndex
      }
    })

    const evictedPage = frames[replaceIndex]
    frames[replaceIndex] = page
    if (evictedPage !== null) {
      lastUsedStep.delete(evictedPage)
    }
    lastUsedStep.set(page, currentStep)

    steps.push({
      step: currentStep,
      page,
      frames: [...frames],
      pageFault: true,
      evictedPage,
      reason: `Fault: LRU evicts page ${evictedPage} because it was used least recently (last used at step ${leastRecentStep}).`,
    })
  })

  return {
    steps,
    totalFaults,
    finalFrames: [...frames],
  }
}

export function formatFrames(frames: Array<number | null>): string {
  return `[${frames.map((value) => (value === null ? '-' : value)).join(', ')}]`
}
