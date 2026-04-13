import { randomPick } from './random'
import type { UnitId } from './study'
import type { NetworkingQuestion } from '../features/networkingShared/networkingDrills'
import {
  generateOsStackQuestion,
  generateSystemsProgrammingQuestion,
  generateHardwareBasicsQuestion,
  generateMemoryHierarchyQuestion,
  generatePointerAddressQuestion,
  generateKernelPrivilegeQuestion,
  generateCompilationInterpretationQuestion,
  generatePosixAbiQuestion,
  generateVirtualizationQuestion,
} from '../features/tourSystems/questions'
import {
  generateSleepProcessBasicsQuestion,
  generateSleepBasicsQuestion,
  generateSleepManPagesQuestion,
  generateSleepPointerReviewQuestion,
} from '../features/sleep/questions'
import {
  generateForkBasicsQuestion,
  generateParentChildQuestion,
  generateProcessCountQuestion,
  generateOutputTracingQuestion,
  generateExecBasicsQuestion,
  generateExecFlavorsQuestion,
  generateForkExecCombinedQuestion,
} from '../features/forkExec/questions'
import {
  generateWaitBasicsQuestion,
  generateWstatusQuestion,
  generateChildExitStatusQuestion,
  generateZombieQuestion,
  generateErrnoQuestion,
} from '../features/waitErrno/questions'
import {
  generateSignalBasicsQuestion,
  generateAsyncCommunicationQuestion,
  generateSignalHandlerQuestion,
  generateSigactionQuestion,
  generateSendingSignalsQuestion,
  generateFunctionPointerSignalQuestion,
  generateSignalSafetyQuestion,
  generateCommonSignalsQuestion,
} from '../features/signals/questions'
import {
  generateMemoryLayoutQuestion,
  generateHeapProgramBreakQuestion,
  generateMallocFreeQuestion,
  generateFreeListQuestion,
  generateAllocationProcessQuestion,
  generateFirstFitQuestion,
  generateBestFitQuestion,
  generateWorstFitQuestion,
  generateFragmentationQuestion,
  generateCoalescingQuestion,
  generateFitStrategyComparisonQuestion,
} from '../features/memoryManagement/questions'
import {
  generateLocalityBasicsQuestion,
  generateTemporalLocalityQuestion,
  generateSpatialLocalityQuestion,
  generateTemporalSpatialCompareQuestion,
  generateDemandPagingQuestion,
  generatePageFaultQuestion,
  generateSwapThrashingQuestion,
} from '../features/virtualMemory/localityQuestions'
import {
  generateThreadDefinitionQuestion,
  generateThreadVsProcessQuestion,
  generateSharedVsPerThreadQuestion,
  generatePthreadBasicsQuestion,
  generateThreadLifecycleQuestion,
  generateDataRaceQuestion,
} from '../features/threads/questions'
import {
  generateSyncBasicsQuestion,
  generateMutexMutualExclusionQuestion,
  generateCriticalAtomicityQuestion,
  generateLockApiQuestion,
  generateSafetyReentrancyQuestion,
  generateDeadlockQuestion,
  generateDeadlockPreventionQuestion,
  generateLivelockQuestion,
} from '../features/syncMutex/questions'
import {
  generateProducerConsumerQuestion,
  generateConditionVariableQuestion,
  generateConditionUsageRulesQuestion,
  generateSemaphoreQuestion,
  generateReadWriteLockQuestion,
  generateDiningPhilosophersQuestion,
  generateBoundedBufferQuestion,
} from '../features/syncPatterns/questions'
import {
  generateFileIoBasicSyscallsQuestion,
  generateFileIoOffsetLseekQuestion,
  generateFileIoReadWriteBehaviorQuestion,
  generateFileIoBufferingQuestion,
  generateFileIoFdVsStreamQuestion,
  generateFileIoEofPartialQuestion,
  generateFileIoBlockingQuestion,
} from '../features/fileIo/questions'
import {
  generateEverythingIsAFileQuestion,
  generateStdFdAndDeviceQuestion,
  generatePartitionsAndTreesQuestion,
  generateInodeQuestion,
  generateHardLinkQuestion,
  generateSoftLinkQuestion,
  generateVfsAndMountQuestion,
  generateLinkComparisonQuestion,
} from '../features/filesystems/questions'
import {
  generateSocketsStackBasicsQuestion,
  generateSocketsTcpSequenceQuestion,
  generateSocketsUdpSequenceQuestion,
  generateSocketsRoleQuestion,
} from '../features/networkingSockets/questions'
import {
  generateAfInetStructureQuestion,
  generateAfInetIpv4Question,
  generateAfInetSpecialAddressQuestion,
  generateAfInetByteOrderQuestion,
  generateAfInetSendRecvQuestion,
} from '../features/networkingAfInet/questions'
import {
  generateMultipleClientsAcceptQuestion,
  generateMultipleClientsThreadQuestion,
  generateMultipleClientsLoopQuestion,
  generateMultipleClientsEpollQuestion,
  generateMultipleClientsTradeoffQuestion,
} from '../features/networkingMultipleClients/questions'
import {
  generateAnonymousPipeQuestion,
  generateParentChildPipeQuestion,
  generatePipeSemanticsQuestion,
  generateClosingPipeEndsQuestion,
  generateDup2RedirectionQuestion,
  generateFifoQuestion,
  generateMqContrastQuestion,
} from '../features/ipcPipes/questions'
import {
  generateMemoryMappingBasicsQuestion,
  generateMmapApiQuestion,
  generateSharedPrivateMappingsQuestion,
  generateFileVsAnonymousMappingsQuestion,
  generateParentChildSharedMemoryQuestion,
  generateUnrelatedSharedMemoryQuestion,
  generateCleanupDetailsQuestion,
  generateMappingComparisonQuestion,
} from '../features/ipcSharedMemory/questions'
import {
  generateCiaModelQuestion,
  generateEncryptionBasicsQuestion,
  generateHashFunctionQuestion,
  generateSymmetricEncryptionQuestion,
  generateAsymmetricEncryptionQuestion,
  generateKeyTradeoffQuestion,
} from '../features/cryptoAlgorithms/questions'
import {
  generatePasswordStorageQuestion,
  generateHashingSaltingQuestion,
  generateDigitalSignatureQuestion,
  generateCertificatesQuestion,
  generateHttpsTrustQuestion,
  generateChainOfTrustQuestion,
  generateHashCollisionQuestion,
} from '../features/cryptoApplications/questions'
import {
  generateSchedulingMetricsConceptQuestion,
  generateMultilevelQueueQuestion,
  generateMlfqQuestion,
  type SchedulingConceptQuestion,
} from '../features/scheduling/conceptQuestions'

export type ExamUnitOption = {
  id: UnitId
  label: string
}

function adaptSchedulingConceptQuestion(
  question: SchedulingConceptQuestion,
): NetworkingQuestion {
  if (question.type === 'mcq') {
    return {
      id: `exam-scheduling-${question.id}`,
      kind: 'mcq',
      prompt: question.prompt,
      options: question.options,
      correctOption: question.correctOption,
      explanationSteps: question.explanationSteps,
      conceptSummary: question.conceptSummary,
      comparisonTable: question.comparisonTable,
    }
  }
  return {
    id: `exam-scheduling-${question.id}`,
    kind: 'match',
    prompt: question.prompt,
    pairs: question.pairs,
    explanationSteps: question.explanationSteps,
    conceptSummary: question.conceptSummary,
    comparisonTable: question.comparisonTable,
  }
}

function generateSchedulingConceptAsNetworkingQuestion(): NetworkingQuestion {
  return randomPick([
    () => adaptSchedulingConceptQuestion(generateSchedulingMetricsConceptQuestion()),
    () => adaptSchedulingConceptQuestion(generateMultilevelQueueQuestion()),
    () => adaptSchedulingConceptQuestion(generateMlfqQuestion()),
  ])()
}

const EXAM_GENERATORS_BY_UNIT: Record<UnitId, Array<() => NetworkingQuestion>> = {
  'tour-computer-systems': [
    generateOsStackQuestion,
    generateSystemsProgrammingQuestion,
    generateHardwareBasicsQuestion,
    generateMemoryHierarchyQuestion,
    generatePointerAddressQuestion,
    generateKernelPrivilegeQuestion,
    generateCompilationInterpretationQuestion,
    generatePosixAbiQuestion,
    generateVirtualizationQuestion,
  ],
  sleep: [
    generateSleepProcessBasicsQuestion,
    generateSleepBasicsQuestion,
    generateSleepManPagesQuestion,
    generateSleepPointerReviewQuestion,
  ],
  'fork-exec': [
    generateForkBasicsQuestion,
    generateParentChildQuestion,
    generateProcessCountQuestion,
    generateOutputTracingQuestion,
    generateExecBasicsQuestion,
    generateExecFlavorsQuestion,
    generateForkExecCombinedQuestion,
  ],
  'wait-errno': [
    generateWaitBasicsQuestion,
    generateWstatusQuestion,
    generateChildExitStatusQuestion,
    generateZombieQuestion,
    generateErrnoQuestion,
  ],
  signals: [
    generateSignalBasicsQuestion,
    generateAsyncCommunicationQuestion,
    generateSignalHandlerQuestion,
    generateSigactionQuestion,
    generateSendingSignalsQuestion,
    generateFunctionPointerSignalQuestion,
    generateSignalSafetyQuestion,
    generateCommonSignalsQuestion,
  ],
  scheduling: [generateSchedulingConceptAsNetworkingQuestion],
  'memory-management': [
    generateMemoryLayoutQuestion,
    generateHeapProgramBreakQuestion,
    generateMallocFreeQuestion,
    generateFreeListQuestion,
    generateAllocationProcessQuestion,
    generateFirstFitQuestion,
    generateBestFitQuestion,
    generateWorstFitQuestion,
    generateFragmentationQuestion,
    generateCoalescingQuestion,
    generateFitStrategyComparisonQuestion,
  ],
  'virtual-memory': [
    generateLocalityBasicsQuestion,
    generateTemporalLocalityQuestion,
    generateSpatialLocalityQuestion,
    generateTemporalSpatialCompareQuestion,
    generateDemandPagingQuestion,
    generatePageFaultQuestion,
    generateSwapThrashingQuestion,
  ],
  threads: [
    generateThreadDefinitionQuestion,
    generateThreadVsProcessQuestion,
    generateSharedVsPerThreadQuestion,
    generatePthreadBasicsQuestion,
    generateThreadLifecycleQuestion,
    generateDataRaceQuestion,
  ],
  'sync-mutex': [
    generateSyncBasicsQuestion,
    generateMutexMutualExclusionQuestion,
    generateCriticalAtomicityQuestion,
    generateLockApiQuestion,
    generateSafetyReentrancyQuestion,
    generateDeadlockQuestion,
    generateDeadlockPreventionQuestion,
    generateLivelockQuestion,
  ],
  'sync-patterns': [
    generateProducerConsumerQuestion,
    generateConditionVariableQuestion,
    generateConditionUsageRulesQuestion,
    generateSemaphoreQuestion,
    generateReadWriteLockQuestion,
    generateDiningPhilosophersQuestion,
    generateBoundedBufferQuestion,
  ],
  'file-io': [
    generateFileIoBasicSyscallsQuestion,
    generateFileIoOffsetLseekQuestion,
    generateFileIoReadWriteBehaviorQuestion,
    generateFileIoBufferingQuestion,
    generateFileIoFdVsStreamQuestion,
    generateFileIoEofPartialQuestion,
    generateFileIoBlockingQuestion,
  ],
  filesystems: [
    generateEverythingIsAFileQuestion,
    generateStdFdAndDeviceQuestion,
    generatePartitionsAndTreesQuestion,
    generateInodeQuestion,
    generateHardLinkQuestion,
    generateSoftLinkQuestion,
    generateVfsAndMountQuestion,
    generateLinkComparisonQuestion,
  ],
  'networking-sockets': [
    generateSocketsStackBasicsQuestion,
    generateSocketsTcpSequenceQuestion,
    generateSocketsUdpSequenceQuestion,
    generateSocketsRoleQuestion,
  ],
  'networking-af-inet': [
    generateAfInetStructureQuestion,
    generateAfInetIpv4Question,
    generateAfInetSpecialAddressQuestion,
    generateAfInetByteOrderQuestion,
    generateAfInetSendRecvQuestion,
  ],
  'networking-multiple-clients': [
    generateMultipleClientsAcceptQuestion,
    generateMultipleClientsThreadQuestion,
    generateMultipleClientsLoopQuestion,
    generateMultipleClientsEpollQuestion,
    generateMultipleClientsTradeoffQuestion,
  ],
  'ipc-pipes': [
    generateAnonymousPipeQuestion,
    generateParentChildPipeQuestion,
    generatePipeSemanticsQuestion,
    generateClosingPipeEndsQuestion,
    generateDup2RedirectionQuestion,
    generateFifoQuestion,
    generateMqContrastQuestion,
  ],
  'ipc-shared-memory': [
    generateMemoryMappingBasicsQuestion,
    generateMmapApiQuestion,
    generateSharedPrivateMappingsQuestion,
    generateFileVsAnonymousMappingsQuestion,
    generateParentChildSharedMemoryQuestion,
    generateUnrelatedSharedMemoryQuestion,
    generateCleanupDetailsQuestion,
    generateMappingComparisonQuestion,
  ],
  'crypto-algorithms': [
    generateCiaModelQuestion,
    generateEncryptionBasicsQuestion,
    generateHashFunctionQuestion,
    generateSymmetricEncryptionQuestion,
    generateAsymmetricEncryptionQuestion,
    generateKeyTradeoffQuestion,
  ],
  'crypto-applications': [
    generatePasswordStorageQuestion,
    generateHashingSaltingQuestion,
    generateDigitalSignatureQuestion,
    generateCertificatesQuestion,
    generateHttpsTrustQuestion,
    generateChainOfTrustQuestion,
    generateHashCollisionQuestion,
  ],
}

export function getDefaultExamUnitIds(): UnitId[] {
  return Object.keys(EXAM_GENERATORS_BY_UNIT) as UnitId[]
}

export function generateExamModeQuestion(
  unitIds: UnitId[],
): NetworkingQuestion | null {
  const unitPool = unitIds
    .map((unitId) => EXAM_GENERATORS_BY_UNIT[unitId] ?? [])
    .flat()
  if (unitPool.length === 0) return null
  return randomPick(unitPool)()
}

const PROCEDURAL_HEAVY_UNITS = new Set<UnitId>([
  'fork-exec',
  'memory-management',
  'virtual-memory',
  'scheduling',
  'ipc-pipes',
])

export function getExamRecommendedTargetQuestionCount(unitIds: UnitId[]): number {
  const selected = unitIds.length > 0 ? unitIds : getDefaultExamUnitIds()
  const baseQuestionCount = selected.reduce((sum, unitId) => {
    const generators = EXAM_GENERATORS_BY_UNIT[unitId] ?? []
    return sum + generators.length
  }, 0)

  const proceduralUnitCount = selected.filter((unitId) =>
    PROCEDURAL_HEAVY_UNITS.has(unitId),
  ).length
  const proceduralBuffer = Math.min(20, Math.max(8, proceduralUnitCount * 3))
  return baseQuestionCount + proceduralBuffer
}
