import { randomPick } from '../../lib/random'
import type { NetworkingQuestion } from '../networkingShared/networkingDrills'

const MEMORY_LAYOUT_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'mm-layout-growth-directions',
    kind: 'mcq',
    prompt: 'In a typical process memory layout, which statement is correct?',
    options: [
      'Heap tends to grow upward, stack tends to grow downward',
      'Heap and stack both grow downward',
      'Heap and stack both grow upward',
      'Text segment grows dynamically during function calls',
    ],
    correctOption: 0,
    explanationSteps: [
      'Text/data/BSS are fixed segments for code and globals.',
      'Heap is used for dynamic allocation and usually grows upward.',
      'Stack tracks call frames and usually grows downward.',
    ],
    conceptSummary: 'Know the standard segment layout and growth directions.',
    comparisonTable: {
      headers: ['Region', 'Typical Role'],
      rows: [
        ['Text', 'Executable instructions'],
        ['Data/BSS', 'Initialized/uninitialized globals/statics'],
        ['Heap', 'Dynamic allocations via malloc/free'],
        ['Stack', 'Function call frames and locals'],
      ],
    },
  },
  {
    id: 'mm-layout-region-identification',
    kind: 'match',
    prompt: 'Match each item to the most likely memory region.',
    pairs: [
      { left: 'Global int g = 7;', right: 'Data segment' },
      { left: 'Global int z; (no initializer)', right: 'BSS segment' },
      { left: 'char *p = malloc(32);', right: 'Heap allocation' },
      { left: 'Local int x inside function', right: 'Stack frame' },
    ],
    explanationSteps: [
      'Initialized globals/statics go to data segment.',
      'Uninitialized globals/statics go to BSS.',
      'malloc allocates from heap-managed space.',
      'Function locals live on per-call stack frames.',
    ],
    conceptSummary: 'Segment classification is common exam quick-check.',
  },
]

const HEAP_PROGRAM_BREAK_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'mm-program-break-definition',
    kind: 'text',
    prompt: 'What is the program break in heap management?',
    requiredConcepts: [
      { label: 'End of heap', keywords: ['end of heap', 'heap boundary', 'end of data segment'] },
      { label: 'Moved by brk/sbrk', keywords: ['sbrk', 'brk', 'move break', 'adjust break'] },
    ],
    answerDisplay:
      'The program break marks the current end of the heap and can be moved (historically) by brk/sbrk to grow or shrink heap space.',
    explanationSteps: [
      'Allocator needs a source of memory for blocks.',
      'Historically it obtains larger heap range by moving break.',
      'malloc then subdivides that range into allocation blocks.',
    ],
    conceptSummary: 'Program break tracks heap extent for classic allocators.',
  },
  {
    id: 'mm-why-malloc-requests-large-chunk',
    kind: 'mcq',
    prompt: 'Why does malloc typically request a larger chunk from OS and split it?',
    options: [
      'To reduce frequent expensive OS memory-growth calls',
      'Because malloc can only allocate powers of two',
      'Because free() cannot return memory to allocator',
      'To force all blocks to equal size',
    ],
    correctOption: 0,
    explanationSteps: [
      'OS memory-growth calls are relatively costly.',
      'Allocator amortizes that overhead by requesting larger chunks.',
      'It splits blocks internally to satisfy many smaller requests.',
    ],
    conceptSummary: 'Allocator amortizes OS calls by internal block management.',
  },
]

const MALLOC_FREE_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'mm-malloc-internal-steps',
    kind: 'match',
    prompt: 'Match each allocator action to a typical malloc() step order.',
    pairs: [
      { left: 'Search free list for suitable block', right: 'Find candidate block' },
      { left: 'Potentially split oversized block', right: 'Produce requested-size allocation + leftover' },
      { left: 'Update free list links', right: 'Remove/replace chosen free block entry' },
      { left: 'Return pointer to payload', right: 'Give caller usable memory region' },
    ],
    explanationSteps: [
      'Allocator first identifies a free block that can satisfy request.',
      'If block is larger, split into allocated portion and remainder.',
      'Free list bookkeeping is updated for removed/split blocks.',
      'Caller gets pointer to payload, not metadata header.',
    ],
    conceptSummary: 'malloc = find, split, relink, return.',
  },
  {
    id: 'mm-free-basic-action',
    kind: 'mcq',
    prompt: 'In a simple free-list allocator, what does free(ptr) commonly do first?',
    options: [
      'Insert block back into free list (often at head)',
      'Immediately return memory to OS always',
      'Zero all heap memory in process',
      'Move stack pointer to reclaimed address',
    ],
    correctOption: 0,
    explanationSteps: [
      'Simple allocators track reusable blocks in a free list.',
      'free commonly prepends block for O(1) insertion.',
      'Returning memory to OS may happen only in specific conditions.',
    ],
    conceptSummary: 'free typically reintroduces block into allocator free structures.',
  },
]

const FREE_LIST_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'mm-free-list-head-pointer',
    kind: 'mcq',
    prompt: 'In a free-list allocator, the head pointer usually points to:',
    options: [
      'The first free block node',
      'The most recently allocated payload',
      'The current stack top',
      'The text segment start',
    ],
    correctOption: 0,
    explanationSteps: [
      'Only free blocks are linked in free list.',
      'Head enables traversal for strategy selection.',
      'Allocated blocks are usually not in free list structure.',
    ],
    conceptSummary: 'Free list tracks free nodes only.',
  },
  {
    id: 'mm-inplace-list-headers',
    kind: 'text',
    prompt: 'What does “in-place linked list allocator metadata” mean?',
    requiredConcepts: [
      { label: 'Header inside block', keywords: ['inside block', 'header', 'metadata in block'] },
      { label: 'Stores size/next pointer', keywords: ['size', 'next pointer', 'link'] },
    ],
    answerDisplay:
      'Allocator metadata is stored within memory blocks themselves (header fields like size and next pointer), not in a separate external list.',
    explanationSteps: [
      'Each free block carries its own management metadata.',
      'Typical fields include block size and pointer to next free block.',
      'This enables linked-list traversal without separate node allocation.',
    ],
    conceptSummary: 'In-place metadata makes blocks self-describing for allocator operations.',
  },
  {
    id: 'mm-free-insert-head-trace',
    kind: 'text',
    prompt:
      'Trace free-list insertion at head:\nBefore: [80] -> [40] -> [20]\nFreed block size: [32]\nWhat is new list order?',
    requiredConcepts: [
      { label: 'Freed block becomes new head', keywords: ['32', 'new head', 'at front'] },
      { label: 'Old list follows', keywords: ['80', '40', '20', '32 -> 80'] },
    ],
    answerDisplay: '[32] -> [80] -> [40] -> [20]',
    explanationSteps: [
      'Head insertion prepends freed block.',
      'newBlock.next points to old head.',
      'Head pointer is updated to newBlock.',
    ],
    conceptSummary: 'Head insertion is O(1) and easy to trace.',
  },
]

const ALLOCATION_TRACING_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'mm-trace-first-fit-split-1',
    kind: 'mcq',
    prompt:
      'First Fit tracing:\nFree list: [100] -> [50] -> [200]\nRequest: 60 bytes\nWhich block is selected?',
    code: `Strategy: First Fit
Traverse from head; choose first block with size >= request.`,
    options: ['[100]', '[50]', '[200]', 'No block fits'],
    correctOption: 0,
    explanationSteps: [
      'First Fit picks first sufficiently large block encountered.',
      '100 >= 60, so search stops at first block.',
      'No need to inspect later blocks for First Fit decision.',
    ],
    conceptSummary: 'First Fit decision depends on list order.',
  },
  {
    id: 'mm-trace-first-fit-split-2',
    kind: 'text',
    prompt:
      'Continue trace:\nFree list before: [100] -> [50] -> [200]\nRequest: 60 using First Fit\nAfter split, what leftover block size remains from selected block?',
    requiredConcepts: [{ label: 'Leftover 40', keywords: ['40'] }],
    answerDisplay: '40 bytes leftover from the original 100-byte block.',
    explanationSteps: [
      'Selected block size = 100.',
      'Allocated payload = 60 (ignoring metadata for this conceptual drill).',
      'Leftover free portion is 100 - 60 = 40.',
    ],
    conceptSummary: 'Split arithmetic is core allocator tracing skill.',
  },
  {
    id: 'mm-trace-new-list-after-allocation',
    kind: 'text',
    prompt:
      'Assume selected block [100] at head is split for request 60 and remainder stays free.\nOriginal: [100] -> [50] -> [200]\nWhat is a valid resulting free list by size order?',
    requiredConcepts: [
      { label: '40 remainder present', keywords: ['40'] },
      { label: '50 and 200 remain', keywords: ['50', '200'] },
    ],
    answerDisplay: '[40] -> [50] -> [200] (one valid conceptual ordering when remainder replaces old head).',
    explanationSteps: [
      'Allocated 60 is removed from free list.',
      'Remainder 40 from split block stays free.',
      'Other untouched free nodes remain available.',
    ],
    conceptSummary: 'Track remove/split/relink effects on free list.',
  },
]

const FIRST_FIT_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'mm-first-fit-definition',
    kind: 'text',
    prompt: 'What is First Fit allocation strategy?',
    requiredConcepts: [
      { label: 'First block encountered', keywords: ['first block', 'first free block', 'first in list'] },
      { label: 'Big enough', keywords: ['big enough', 'size >= request', 'fits request'] },
    ],
    answerDisplay: 'First Fit selects the first free block encountered that is large enough for the request.',
    explanationSteps: [
      'Traversal starts from free-list head.',
      'Search stops at first satisfying block.',
      'This can be fast but may increase fragmentation depending on list order.',
    ],
    conceptSummary: 'First Fit is order-sensitive and often quick.',
  },
  {
    id: 'mm-first-fit-choice',
    kind: 'mcq',
    prompt: 'Free list: [30] -> [90] -> [45], request = 40, strategy = First Fit. Which block is chosen?',
    options: ['[30]', '[90]', '[45]', 'none'],
    correctOption: 1,
    explanationSteps: [
      '30 is too small for request 40.',
      '90 is first block that satisfies size >= 40.',
      'Search stops there for First Fit.',
    ],
    conceptSummary: 'First Fit may skip small head block, then stop at next valid block.',
  },
]

const BEST_FIT_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'mm-best-fit-definition',
    kind: 'mcq',
    prompt: 'Which statement best describes Best Fit?',
    options: [
      'Choose the smallest free block that is still large enough',
      'Choose the first large-enough block from head',
      'Choose the largest free block',
      'Always choose most recently freed block',
    ],
    correctOption: 0,
    explanationSteps: [
      'Best Fit minimizes leftover size for that allocation.',
      'It generally requires examining all candidate blocks.',
      'May reduce immediate waste but can create many tiny fragments.',
    ],
    conceptSummary: 'Best Fit trades search cost for tighter fit.',
  },
  {
    id: 'mm-best-fit-trace',
    kind: 'text',
    prompt:
      'Best Fit tracing:\nFree blocks: [120], [70], [90], [75]\nRequest: 72\nWhich block is selected and why?',
    requiredConcepts: [
      { label: 'Choose 75', keywords: ['75'] },
      { label: 'Smallest that fits', keywords: ['smallest', 'best fit', 'closest'] },
    ],
    answerDisplay: 'Block [75], because it is the smallest block that can satisfy 72.',
    explanationSteps: [
      'Candidates >= 72 are 120, 90, 75.',
      'Best Fit picks minimum among valid candidates.',
      'So 75 is selected.',
    ],
    conceptSummary: 'Best Fit needs full candidate scan to ensure smallest viable choice.',
  },
]

const WORST_FIT_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'mm-worst-fit-definition',
    kind: 'mcq',
    prompt: 'Worst Fit chooses which block?',
    options: [
      'Largest available block that can satisfy request',
      'Smallest available block that can satisfy request',
      'First available block regardless of size',
      'Last freed block only',
    ],
    correctOption: 0,
    explanationSteps: [
      'Worst Fit aims to leave large leftovers.',
      'It selects the maximum-sized valid candidate.',
      'Can reduce tiny leftovers but may waste large blocks quickly.',
    ],
    conceptSummary: 'Worst Fit = largest viable block.',
  },
  {
    id: 'mm-worst-fit-trace',
    kind: 'mcq',
    prompt: 'Free blocks: [64], [140], [96], request=60, strategy=Worst Fit. Which block is selected?',
    options: ['[64]', '[96]', '[140]', 'No fit'],
    correctOption: 2,
    explanationSteps: [
      'All blocks except none are valid since all >= 60.',
      'Worst Fit chooses the largest candidate.',
      '140 is largest, so it is selected.',
    ],
    conceptSummary: 'Worst Fit decision is max(valid block sizes).',
  },
]

const STRATEGY_COMPARISON_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'mm-fit-strategy-comparison-match',
    kind: 'match',
    prompt: 'Match each strategy to its selection rule.',
    pairs: [
      { left: 'First Fit', right: 'First block in list that is large enough' },
      { left: 'Best Fit', right: 'Smallest block that is large enough' },
      { left: 'Worst Fit', right: 'Largest block that is large enough' },
    ],
    explanationSteps: [
      'First Fit is traversal-order based.',
      'Best/Worst Fit compare all valid candidates by size.',
      'Different strategies produce different list evolution over time.',
    ],
    conceptSummary: 'Memorize fit rules and resulting tradeoffs.',
  },
  {
    id: 'mm-fit-same-input-different-output',
    kind: 'mcq',
    prompt:
      'Given free blocks [80], [150], [100], request=90:\nWhich strategy picks [100]?',
    options: ['First Fit', 'Best Fit', 'Worst Fit', 'All of them'],
    correctOption: 1,
    explanationSteps: [
      'Valid candidates are 150 and 100 (80 too small).',
      'Best Fit selects smallest valid candidate => 100.',
      'First Fit selects 150; Worst Fit also selects 150.',
    ],
    conceptSummary: 'Same input can diverge by strategy.',
  },
]

const FRAGMENTATION_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'mm-external-fragmentation-definition',
    kind: 'text',
    prompt: 'What is external fragmentation?',
    requiredConcepts: [
      { label: 'Free memory split into small pieces', keywords: ['small blocks', 'fragmented free space', 'scattered free space'] },
      { label: 'Not contiguous for request', keywords: ['not contiguous', 'cannot allocate large block', 'contiguous chunk unavailable'] },
    ],
    answerDisplay:
      'External fragmentation is when total free memory exists but is split into non-contiguous pieces, so a large contiguous request cannot be satisfied.',
    explanationSteps: [
      'Allocator may have enough total bytes in aggregate.',
      'But if bytes are scattered across many small gaps, large requests fail.',
      'This is external (between blocks), not wasted inside one block.',
    ],
    conceptSummary: 'Total free != usable contiguous free.',
  },
  {
    id: 'mm-internal-vs-external',
    kind: 'mcq',
    prompt: 'Which option correctly contrasts internal vs external fragmentation?',
    options: [
      'Internal: wasted space inside allocated block; External: free space split across non-contiguous holes',
      'Internal: stack overflow; External: heap overflow',
      'Internal: page fault; External: TLB miss',
      'Internal: free-list corruption; External: double free',
    ],
    correctOption: 0,
    explanationSteps: [
      'Internal waste happens within allocated block boundaries.',
      'External fragmentation concerns layout of free regions.',
      'Both affect allocation efficiency differently.',
    ],
    conceptSummary: 'Internal = inside block waste; external = free-space scattering.',
  },
]

const COALESCING_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'mm-coalescing-definition',
    kind: 'mcq',
    prompt: 'What does coalescing do in a heap allocator?',
    options: [
      'Merges adjacent free blocks into a larger free block',
      'Splits every free block into fixed-size pieces',
      'Moves stack frames into heap blocks',
      'Encrypts metadata headers',
    ],
    correctOption: 0,
    explanationSteps: [
      'Free operations can create neighboring free chunks.',
      'Coalescing joins adjacent free chunks.',
      'This helps reduce external fragmentation.',
    ],
    conceptSummary: 'Coalescing improves contiguous free-space availability.',
  },
  {
    id: 'mm-coalescing-trace',
    kind: 'text',
    prompt:
      'Before coalescing, adjacent free blocks by address are: [20] then [30].\nAfter coalescing, what block size results?',
    requiredConcepts: [{ label: '50', keywords: ['50'] }],
    answerDisplay: '50 bytes (20 + 30) as one merged free block.',
    explanationSteps: [
      'Coalescing combines neighboring free ranges.',
      'Merged block size is sum of adjacent free block sizes (conceptual drill).',
      'Result increases contiguous free space for future allocations.',
    ],
    conceptSummary: 'Coalescing is key defense against external fragmentation.',
  },
]

export function generateMemoryLayoutQuestion(): NetworkingQuestion {
  return randomPick(MEMORY_LAYOUT_QUESTIONS)
}

export function generateHeapProgramBreakQuestion(): NetworkingQuestion {
  return randomPick(HEAP_PROGRAM_BREAK_QUESTIONS)
}

export function generateMallocFreeQuestion(): NetworkingQuestion {
  return randomPick(MALLOC_FREE_QUESTIONS)
}

export function generateFreeListQuestion(): NetworkingQuestion {
  return randomPick(FREE_LIST_QUESTIONS)
}

export function generateAllocationProcessQuestion(): NetworkingQuestion {
  return randomPick(ALLOCATION_TRACING_QUESTIONS)
}

export function generateFirstFitQuestion(): NetworkingQuestion {
  return randomPick(FIRST_FIT_QUESTIONS)
}

export function generateBestFitQuestion(): NetworkingQuestion {
  return randomPick(BEST_FIT_QUESTIONS)
}

export function generateWorstFitQuestion(): NetworkingQuestion {
  return randomPick(WORST_FIT_QUESTIONS)
}

export function generateFragmentationQuestion(): NetworkingQuestion {
  return randomPick(FRAGMENTATION_QUESTIONS)
}

export function generateCoalescingQuestion(): NetworkingQuestion {
  return randomPick(COALESCING_QUESTIONS)
}

export function generateFitStrategyComparisonQuestion(): NetworkingQuestion {
  return randomPick(STRATEGY_COMPARISON_QUESTIONS)
}

export const MEMORY_MANAGEMENT_QUESTION_COUNT = 23
