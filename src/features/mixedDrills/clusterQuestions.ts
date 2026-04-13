import { randomPick } from '../../lib/random'
import {
  generateExecBasicsQuestion,
  generateExecFlavorsQuestion,
  generateForkBasicsQuestion,
  generateForkExecCombinedQuestion,
  generateOutputTracingQuestion,
  generateParentChildQuestion,
  generateProcessCountQuestion,
} from '../forkExec/questions'
import {
  generateAnonymousPipeQuestion,
  generateClosingPipeEndsQuestion,
  generateDup2RedirectionQuestion,
  generateFifoQuestion,
  generateMqContrastQuestion,
  generateParentChildPipeQuestion,
  generatePipeSemanticsQuestion,
} from '../ipcPipes/questions'
import {
  generateCleanupDetailsQuestion,
  generateFileVsAnonymousMappingsQuestion,
  generateMappingComparisonQuestion,
  generateMemoryMappingBasicsQuestion,
  generateMmapApiQuestion,
  generateParentChildSharedMemoryQuestion,
  generateSharedPrivateMappingsQuestion,
  generateUnrelatedSharedMemoryQuestion,
} from '../ipcSharedMemory/questions'
import {
  generateAfInetByteOrderQuestion,
  generateAfInetIpv4Question,
  generateAfInetSendRecvQuestion,
  generateAfInetSpecialAddressQuestion,
  generateAfInetStructureQuestion,
} from '../networkingAfInet/questions'
import {
  generateMultipleClientsAcceptQuestion,
  generateMultipleClientsEpollQuestion,
  generateMultipleClientsLoopQuestion,
  generateMultipleClientsThreadQuestion,
  generateMultipleClientsTradeoffQuestion,
} from '../networkingMultipleClients/questions'
import {
  generateSocketsRoleQuestion,
  generateSocketsStackBasicsQuestion,
  generateSocketsTcpSequenceQuestion,
  generateSocketsUdpSequenceQuestion,
} from '../networkingSockets/questions'
import {
  generateAsyncCommunicationQuestion,
  generateCommonSignalsQuestion,
  generateFunctionPointerSignalQuestion,
  generateSendingSignalsQuestion,
  generateSigactionQuestion,
  generateSignalBasicsQuestion,
  generateSignalHandlerQuestion,
  generateSignalSafetyQuestion,
} from '../signals/questions'
import {
  generateSleepBasicsQuestion,
  generateSleepManPagesQuestion,
  generateSleepPointerReviewQuestion,
  generateSleepProcessBasicsQuestion,
} from '../sleep/questions'
import {
  generateBoundedBufferQuestion,
  generateConditionUsageRulesQuestion,
  generateConditionVariableQuestion,
  generateDiningPhilosophersQuestion,
  generateProducerConsumerQuestion,
  generateReadWriteLockQuestion,
  generateSemaphoreQuestion,
} from '../syncPatterns/questions'
import {
  generateCriticalAtomicityQuestion,
  generateDeadlockPreventionQuestion,
  generateDeadlockQuestion,
  generateLivelockQuestion,
  generateLockApiQuestion,
  generateMutexMutualExclusionQuestion,
  generateSafetyReentrancyQuestion,
  generateSyncBasicsQuestion,
} from '../syncMutex/questions'
import {
  generateDemandPagingQuestion,
  generateLocalityBasicsQuestion,
  generatePageFaultQuestion,
  generateSpatialLocalityQuestion,
  generateSwapThrashingQuestion,
  generateTemporalLocalityQuestion,
  generateTemporalSpatialCompareQuestion,
} from '../virtualMemory/localityQuestions'
import type { NetworkingQuestion } from '../networkingShared/networkingDrills'
import {
  generateChildExitStatusQuestion,
  generateErrnoQuestion,
  generateWaitBasicsQuestion,
  generateWstatusQuestion,
  generateZombieQuestion,
} from '../waitErrno/questions'

const VM_MIXED_EXTRA_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'vm-mixed-page-replacement-why',
    kind: 'mcq',
    prompt: 'When physical memory frames are full and a page fault occurs, what must the OS do next?',
    options: [
      'Choose a victim page using a page replacement policy before loading the needed page',
      'Ignore the fault and continue execution',
      'Reset the process page table to zero',
      'Disable virtual memory temporarily',
    ],
    correctOption: 0,
    explanationSteps: [
      'Page fault means required page is absent from RAM.',
      'With no free frame, OS must evict another page first.',
      'Policy choice (FIFO/LRU/Second Chance) controls victim selection.',
    ],
    conceptSummary: 'Fault handling with full memory requires page replacement.',
  },
  {
    id: 'vm-mixed-offset-bits',
    kind: 'mcq',
    prompt: 'Page size is 64 bytes. How many offset bits are in a virtual address?',
    options: ['6', '5', '4', '8'],
    correctOption: 0,
    explanationSteps: [
      'Offset bits = log2(page size).',
      'log2(64) = 6 bits.',
      'Offset selects byte within page.',
    ],
    conceptSummary: 'Address translation quick rule: offset bits = log2(page size).',
  },
  {
    id: 'vm-mixed-working-set',
    kind: 'mcq',
    prompt: 'Why does a stable working set reduce page faults?',
    options: [
      'Because frequently used pages stay resident, reducing misses',
      'Because it disables page replacement',
      'Because swap becomes faster than RAM',
      'Because page table entries are no longer needed',
    ],
    correctOption: 0,
    explanationSteps: [
      'Working set is frequently used page subset.',
      'If it fits memory, repeated accesses hit resident pages.',
      'Fault rate drops relative to random wide-page access.',
    ],
    conceptSummary: 'Working-set fit is central to VM performance.',
  },
]

export function generateProcessesMixedQuestion(): NetworkingQuestion {
  return randomPick([
    generateSleepProcessBasicsQuestion,
    generateSleepBasicsQuestion,
    generateSleepManPagesQuestion,
    generateSleepPointerReviewQuestion,
    generateForkBasicsQuestion,
    generateParentChildQuestion,
    generateProcessCountQuestion,
    generateOutputTracingQuestion,
    generateExecBasicsQuestion,
    generateExecFlavorsQuestion,
    generateForkExecCombinedQuestion,
    generateWaitBasicsQuestion,
    generateWstatusQuestion,
    generateChildExitStatusQuestion,
    generateZombieQuestion,
    generateErrnoQuestion,
    generateSignalBasicsQuestion,
    generateAsyncCommunicationQuestion,
    generateSignalHandlerQuestion,
    generateSigactionQuestion,
    generateSendingSignalsQuestion,
    generateFunctionPointerSignalQuestion,
    generateSignalSafetyQuestion,
    generateCommonSignalsQuestion,
  ])()
}

export function generateVirtualMemoryMixedQuestion(): NetworkingQuestion {
  return randomPick([
    generateLocalityBasicsQuestion,
    generateTemporalLocalityQuestion,
    generateSpatialLocalityQuestion,
    generateTemporalSpatialCompareQuestion,
    generateDemandPagingQuestion,
    generatePageFaultQuestion,
    generateSwapThrashingQuestion,
    () => randomPick(VM_MIXED_EXTRA_QUESTIONS),
  ])()
}

export function generateSynchronizationMixedQuestion(): NetworkingQuestion {
  return randomPick([
    generateSyncBasicsQuestion,
    generateMutexMutualExclusionQuestion,
    generateCriticalAtomicityQuestion,
    generateLockApiQuestion,
    generateSafetyReentrancyQuestion,
    generateDeadlockQuestion,
    generateDeadlockPreventionQuestion,
    generateLivelockQuestion,
    generateProducerConsumerQuestion,
    generateConditionVariableQuestion,
    generateConditionUsageRulesQuestion,
    generateSemaphoreQuestion,
    generateReadWriteLockQuestion,
    generateDiningPhilosophersQuestion,
    generateBoundedBufferQuestion,
  ])()
}

export function generateIpcNetworkingMixedQuestion(): NetworkingQuestion {
  return randomPick([
    generateAnonymousPipeQuestion,
    generateParentChildPipeQuestion,
    generatePipeSemanticsQuestion,
    generateClosingPipeEndsQuestion,
    generateDup2RedirectionQuestion,
    generateFifoQuestion,
    generateMqContrastQuestion,
    generateMemoryMappingBasicsQuestion,
    generateMmapApiQuestion,
    generateSharedPrivateMappingsQuestion,
    generateFileVsAnonymousMappingsQuestion,
    generateParentChildSharedMemoryQuestion,
    generateUnrelatedSharedMemoryQuestion,
    generateCleanupDetailsQuestion,
    generateMappingComparisonQuestion,
    generateSocketsStackBasicsQuestion,
    generateSocketsTcpSequenceQuestion,
    generateSocketsUdpSequenceQuestion,
    generateSocketsRoleQuestion,
    generateAfInetStructureQuestion,
    generateAfInetIpv4Question,
    generateAfInetSpecialAddressQuestion,
    generateAfInetByteOrderQuestion,
    generateAfInetSendRecvQuestion,
    generateMultipleClientsAcceptQuestion,
    generateMultipleClientsThreadQuestion,
    generateMultipleClientsLoopQuestion,
    generateMultipleClientsEpollQuestion,
    generateMultipleClientsTradeoffQuestion,
  ])()
}
