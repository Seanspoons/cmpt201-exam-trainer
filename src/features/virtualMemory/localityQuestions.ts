import { randomPick } from '../../lib/random'
import type { NetworkingQuestion } from '../networkingShared/networkingDrills'

const LOCALITY_BASICS_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'vm-locality-definition',
    kind: 'text',
    prompt: 'What is locality in memory access patterns?',
    requiredConcepts: [
      { label: 'Small working set / subset accessed often', keywords: ['small portion', 'subset', 'working set', 'accessed more often'] },
      { label: 'Not all memory used equally', keywords: ['not all memory', 'uneven access', 'some regions more frequent'] },
    ],
    answerDisplay:
      'Locality means programs tend to access a relatively small working set of memory much more frequently than the rest.',
    explanationSteps: [
      'Real programs usually focus on active code/data regions.',
      'Many memory regions are touched rarely compared with hot regions.',
      'This uneven pattern is why caches and paging can be effective.',
    ],
    conceptSummary: 'Locality = concentrated reuse of a subset of memory.',
  },
  {
    id: 'vm-locality-why-matters',
    kind: 'mcq',
    prompt: 'Why does locality make virtual memory practical?',
    options: [
      'Because only a small active set often needs to stay in RAM at once',
      'Because all pages are accessed equally frequently',
      'Because page tables remove need for physical memory',
      'Because swap is always faster than RAM',
    ],
    correctOption: 0,
    explanationSteps: [
      'If current working set fits in memory, most accesses hit resident pages.',
      'OS can defer loading inactive pages and keep hot pages resident.',
      'This is the foundation behind demand paging efficiency.',
    ],
    conceptSummary: 'Working-set behavior enables demand paging.',
  },
]

const TEMPORAL_LOCALITY_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'vm-temporal-locality-definition',
    kind: 'text',
    prompt: 'What is temporal locality?',
    requiredConcepts: [
      { label: 'Recently accessed data/code', keywords: ['recently accessed', 'recent access', 'used recently'] },
      { label: 'Likely accessed again soon', keywords: ['again soon', 'near future', 'reused'] },
    ],
    answerDisplay:
      'Temporal locality means recently accessed memory is likely to be accessed again soon.',
    explanationSteps: [
      'Loops and repeated variable reuse are classic temporal patterns.',
      'Recent-use history is a strong predictor of near-future use.',
      'Replacement policies like LRU are motivated by this behavior.',
    ],
    conceptSummary: 'Temporal locality = reuse over time.',
  },
  {
    id: 'vm-temporal-example',
    kind: 'mcq',
    prompt: 'Which example best demonstrates temporal locality?',
    options: [
      'A loop repeatedly updating the same counter variable',
      'One-time sequential scan across a huge array only once',
      'Randomly jumping to far-apart pages each access',
      'Loading every file block exactly one time',
    ],
    correctOption: 0,
    explanationSteps: [
      'Same variable reused repeatedly indicates near-time reuse.',
      'That is temporal locality, not primarily spatial adjacency.',
      'Random jumps typically reduce both temporal and spatial locality.',
    ],
    conceptSummary: 'Repeated reuse of same location is temporal locality.',
  },
]

const SPATIAL_LOCALITY_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'vm-spatial-locality-definition',
    kind: 'text',
    prompt: 'What is spatial locality?',
    requiredConcepts: [
      { label: 'Nearby/adjacent addresses', keywords: ['nearby memory', 'adjacent', 'near recently accessed'] },
      { label: 'Likely next access', keywords: ['accessed next', 'soon after', 'likely next'] },
    ],
    answerDisplay:
      'Spatial locality means addresses near a recently accessed location are likely to be accessed soon.',
    explanationSteps: [
      'Sequential data structures often exhibit neighbor access.',
      'Fetching one memory block often benefits nearby future reads.',
      'Hardware caches and VM pages exploit this adjacency.',
    ],
    conceptSummary: 'Spatial locality = reuse by address proximity.',
  },
  {
    id: 'vm-spatial-array-scan',
    kind: 'mcq',
    prompt: 'Why does sequential array traversal often show spatial locality?',
    options: [
      'Because consecutive elements are stored near each other in memory',
      'Because arrays always stay in CPU registers',
      'Because each element is on a different random page',
      'Because array access disables paging',
    ],
    correctOption: 0,
    explanationSteps: [
      'Contiguous storage places neighbors close in address space.',
      'Reading one element often implies upcoming reads of adjacent elements.',
      'That pattern is exactly spatial locality.',
    ],
    conceptSummary: 'Contiguous layout drives spatial locality.',
  },
]

const TEMPORAL_VS_SPATIAL_COMPARE_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'vm-temp-vs-spatial-match',
    kind: 'match',
    prompt: 'Match each scenario to the dominant locality type.',
    pairs: [
      { left: 'Same variable read repeatedly in short time', right: 'Temporal locality' },
      { left: 'Iterating arr[i], arr[i+1], arr[i+2]...', right: 'Spatial locality' },
      { left: 'Jumping widely across random pages', right: 'Poor locality' },
    ],
    explanationSteps: [
      'Temporal focuses on reuse of same item over time.',
      'Spatial focuses on nearby addresses after an access.',
      'Random page jumps undermine both kinds of locality.',
    ],
    conceptSummary: 'Different locality types predict different next accesses.',
  },
]

const DEMAND_PAGING_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'vm-demand-paging-definition',
    kind: 'text',
    prompt: 'What is demand paging?',
    requiredConcepts: [
      { label: 'Load page only when needed', keywords: ['only when needed', 'on demand', 'when accessed'] },
      { label: 'Not all pages upfront', keywords: ['not all pages at startup', 'defer loading', 'lazy loading'] },
    ],
    answerDisplay:
      'Demand paging loads pages into physical memory only when they are actually needed/accessed.',
    explanationSteps: [
      'OS avoids loading entire process image into RAM immediately.',
      'First access to absent page triggers page fault handling.',
      'This works well when working set is smaller than full virtual space.',
    ],
    conceptSummary: 'Demand paging is lazy page loading based on actual access.',
  },
  {
    id: 'vm-demand-paging-works-why',
    kind: 'mcq',
    prompt: 'Why does demand paging usually work well in practice?',
    options: [
      'Programs usually need only a limited working set at a given time',
      'Disk is faster than RAM for page access',
      'Page faults never happen after startup',
      'All processes use identical page patterns',
    ],
    correctOption: 0,
    explanationSteps: [
      'Active pages are a subset of total virtual pages.',
      'Inactive pages can stay on disk until needed.',
      'This improves memory utilization across many processes.',
    ],
    conceptSummary: 'Demand paging depends on locality and working sets.',
  },
]

const PAGE_FAULT_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'vm-page-fault-definition',
    kind: 'text',
    prompt: 'What is a page fault?',
    requiredConcepts: [
      { label: 'Page not currently in physical memory', keywords: ['not in memory', 'missing page', 'not in physical memory'] },
      { label: 'OS loads page into frame', keywords: ['load page', 'bring into frame', 'fetch page'] },
    ],
    answerDisplay:
      'A page fault occurs when referenced virtual page is not in RAM; OS must load it into a physical frame before continuing.',
    explanationSteps: [
      'CPU reference misses resident mapping for needed page.',
      'Trap/page-fault handler runs in kernel.',
      'OS retrieves page (possibly evicting another) and resumes process.',
    ],
    conceptSummary: 'Page fault = missing resident page + OS load path.',
  },
  {
    id: 'vm-page-fault-why-pause',
    kind: 'mcq',
    prompt: 'Why can a page fault visibly pause program execution?',
    options: [
      'Handling may require slow disk I/O before execution can resume',
      'Because process must be permanently terminated',
      'Because CPU cannot switch to kernel mode on faults',
      'Because page faults skip instruction retry',
    ],
    correctOption: 0,
    explanationSteps: [
      'Page-in path can involve storage latency.',
      'Process waits while OS resolves missing page.',
      'After mapping is updated, faulting instruction is retried.',
    ],
    conceptSummary: 'Fault handling latency often comes from storage access.',
  },
]

const SWAP_THRASHING_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'vm-swap-space-definition',
    kind: 'mcq',
    prompt: 'What is swap space used for?',
    options: [
      'Disk-backed storage for pages moved out of RAM',
      'CPU register overflow storage',
      'Executable code compilation cache only',
      'Network packet buffering only',
    ],
    correctOption: 0,
    explanationSteps: [
      'Swap extends apparent memory via disk-backed page storage.',
      'OS can swap out less-needed pages to free frames.',
      'Swapped pages can be brought back on later access.',
    ],
    conceptSummary: 'Swap is backing store for paged-out memory.',
  },
  {
    id: 'vm-thrashing-definition',
    kind: 'text',
    prompt: 'What is thrashing in virtual memory?',
    requiredConcepts: [
      { label: 'Constant page in/out activity', keywords: ['swapping', 'page in and out', 'constant page faults', 'constant replacement'] },
      { label: 'Little useful CPU work / bad performance', keywords: ['poor performance', 'little useful work', 'spends time paging'] },
    ],
    answerDisplay:
      'Thrashing is when the system spends most of its time paging/swapping pages rather than doing useful CPU work.',
    explanationSteps: [
      'Working set exceeds effective memory availability.',
      'Frequent misses trigger repeated page replacement.',
      'CPU utilization for real progress drops sharply.',
    ],
    conceptSummary: 'Thrashing = paging overhead dominates useful execution.',
  },
  {
    id: 'vm-poor-locality-to-thrashing',
    kind: 'mcq',
    prompt: 'How can poor locality contribute to thrashing?',
    options: [
      'Random wide jumps cause frequent misses, forcing constant page replacement',
      'Poor locality reduces page faults to near zero',
      'Poor locality increases cache speed automatically',
      'Poor locality eliminates need for swap',
    ],
    correctOption: 0,
    explanationSteps: [
      'If accesses span too many pages, active set may exceed frames.',
      'Recently loaded pages are quickly displaced before reuse.',
      'Miss/reload cycle repeats and degrades throughput.',
    ],
    conceptSummary: 'Poor locality inflates fault rate and can trigger thrashing.',
  },
]

export function generateLocalityBasicsQuestion(): NetworkingQuestion {
  return randomPick(LOCALITY_BASICS_QUESTIONS)
}

export function generateTemporalLocalityQuestion(): NetworkingQuestion {
  return randomPick(TEMPORAL_LOCALITY_QUESTIONS)
}

export function generateSpatialLocalityQuestion(): NetworkingQuestion {
  return randomPick(SPATIAL_LOCALITY_QUESTIONS)
}

export function generateTemporalSpatialCompareQuestion(): NetworkingQuestion {
  return randomPick(TEMPORAL_VS_SPATIAL_COMPARE_QUESTIONS)
}

export function generateDemandPagingQuestion(): NetworkingQuestion {
  return randomPick(DEMAND_PAGING_QUESTIONS)
}

export function generatePageFaultQuestion(): NetworkingQuestion {
  return randomPick(PAGE_FAULT_QUESTIONS)
}

export function generateSwapThrashingQuestion(): NetworkingQuestion {
  return randomPick(SWAP_THRASHING_QUESTIONS)
}

export const VM_LOCALITY_QUESTION_COUNT = 13
