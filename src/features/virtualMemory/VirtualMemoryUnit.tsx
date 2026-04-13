import { UnitScaffold } from '../../components/UnitScaffold'
import { NetworkingDrillPractice } from '../networkingShared/networkingDrills'
import { generateVirtualMemoryMixedQuestion } from '../mixedDrills/clusterQuestions'
import { AddressTranslationTab } from '../addressTranslation/AddressTranslationTab'
import { PageReplacementTab } from '../pageReplacement/PageReplacementTab'
import {
  generateDemandPagingQuestion,
  generateLocalityBasicsQuestion,
  generatePageFaultQuestion,
  generateSpatialLocalityQuestion,
  generateSwapThrashingQuestion,
  generateTemporalLocalityQuestion,
  generateTemporalSpatialCompareQuestion,
} from './localityQuestions'

function generateLocalityAndPageFaultsQuestion() {
  const generators = [
    generateLocalityBasicsQuestion,
    generateTemporalLocalityQuestion,
    generateSpatialLocalityQuestion,
    generateTemporalSpatialCompareQuestion,
    generateDemandPagingQuestion,
    generatePageFaultQuestion,
    generateSwapThrashingQuestion,
  ]
  return generators[Math.floor(Math.random() * generators.length)]()
}

export function VirtualMemoryUnit() {
  return (
    <UnitScaffold
      unitLabel="Virtual Memory"
      defaultSubtopicId="page-replacement"
      subtopics={[
        {
          id: 'vm-final-exam-mixed',
          label: 'Final Exam Mixed Drill (Virtual Memory)',
          render: () => (
            <NetworkingDrillPractice
              key="vm-final-exam-mixed"
              title="Virtual Memory > Final Exam Mixed Drill"
              generateQuestion={generateVirtualMemoryMixedQuestion}
            />
          ),
        },
        {
          id: 'address-translation',
          label: 'Address Translation',
          render: () => <AddressTranslationTab key="vm-address-translation" />,
        },
        {
          id: 'page-replacement',
          label: 'Page Replacement',
          render: () => <PageReplacementTab key="vm-page-replacement" />,
        },
        {
          id: 'locality-page-faults',
          label: 'Locality and Page Faults',
          render: () => (
            <NetworkingDrillPractice
              key="vm-locality-page-faults"
              title="Virtual Memory > Locality and Page Faults"
              generateQuestion={generateLocalityAndPageFaultsQuestion}
            />
          ),
        },
      ]}
    />
  )
}
