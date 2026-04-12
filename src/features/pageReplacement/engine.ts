import { randomInt, randomPick } from '../../lib/random'

export type PageReplacementAlgorithm = 'FIFO' | 'LRU' | 'Second Chance'

export type PageReplacementQuestion = {
  algorithm: PageReplacementAlgorithm
  frameCount: number
  referenceString: number[]
}

export type PageReplacementStep = {
  step: number
  page: number
  frames: Array<number | null>
  referenceBits?: number[]
  victimPointer?: number
  pageFault: boolean
  evictedPage: number | null
  reason: string
}

export type PageReplacementSolution = {
  steps: PageReplacementStep[]
  totalFaults: number
  finalFrames: Array<number | null>
}

export function generatePageReplacementQuestion(
  algorithm?: PageReplacementAlgorithm,
): PageReplacementQuestion {
  const frameCount = randomPick([3, 4])
  const length = randomInt(6, 10)
  const maxPage = randomPick([5, 7])
  const referenceString = Array.from({ length }, () => randomInt(1, maxPage))

  return {
    algorithm: algorithm ?? randomPick(['FIFO', 'LRU', 'Second Chance']),
    frameCount,
    referenceString,
  }
}

export function solvePageReplacement(
  question: PageReplacementQuestion,
): PageReplacementSolution {
  switch (question.algorithm) {
    case 'FIFO':
      return solveFifo(question)
    case 'LRU':
      return solveLru(question)
    case 'Second Chance':
      return solveSecondChance(question)
    default:
      return solveFifo(question)
  }
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

function solveSecondChance(
  question: PageReplacementQuestion,
): PageReplacementSolution {
  const frameCount = question.frameCount
  const frames: Array<number | null> = Array.from({ length: frameCount }, () => null)
  const referenceBits: number[] = Array.from({ length: frameCount }, () => 0)
  let victimPointer = 0
  let totalFaults = 0
  const steps: PageReplacementStep[] = []

  question.referenceString.forEach((page, index) => {
    const step = index + 1
    const hitIndex = frames.indexOf(page)

    if (hitIndex >= 0) {
      referenceBits[hitIndex] = 1
      steps.push({
        step,
        page,
        frames: [...frames],
        referenceBits: [...referenceBits],
        victimPointer,
        pageFault: false,
        evictedPage: null,
        reason: `Hit: page ${page} already in frame ${hitIndex + 1}, set its reference bit to 1.`,
      })
      return
    }

    totalFaults += 1
    let evictedPage: number | null = null
    const scans: string[] = []

    while (true) {
      if (frames[victimPointer] === null) {
        frames[victimPointer] = page
        referenceBits[victimPointer] = 1
        scans.push(
          `Fault: frame ${victimPointer + 1} was empty, inserted page ${page}.`,
        )
        victimPointer = (victimPointer + 1) % frameCount
        break
      }

      if (referenceBits[victimPointer] === 0) {
        evictedPage = frames[victimPointer]
        frames[victimPointer] = page
        referenceBits[victimPointer] = 1
        scans.push(
          `Fault: evicted page ${evictedPage} from frame ${victimPointer + 1} because reference bit was 0.`,
        )
        victimPointer = (victimPointer + 1) % frameCount
        break
      }

      referenceBits[victimPointer] = 0
      scans.push(
        `Fault: frame ${victimPointer + 1} had reference bit 1, cleared it and advanced pointer.`,
      )
      victimPointer = (victimPointer + 1) % frameCount
    }

    steps.push({
      step,
      page,
      frames: [...frames],
      referenceBits: [...referenceBits],
      victimPointer,
      pageFault: true,
      evictedPage,
      reason: scans.join(' '),
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

export function formatReferenceBits(bits?: number[]): string {
  if (!bits) return '-'
  return `[${bits.join(', ')}]`
}
