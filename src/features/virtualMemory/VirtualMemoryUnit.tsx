import { UnitScaffold } from '../../components/UnitScaffold'
import { AddressTranslationTab } from '../addressTranslation/AddressTranslationTab'
import { PageReplacementTab } from '../pageReplacement/PageReplacementTab'

export function VirtualMemoryUnit() {
  return (
    <UnitScaffold
      unitLabel="Virtual Memory"
      defaultSubtopicId="page-replacement"
      subtopics={[
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
          plannedDrills: ['Classify temporal vs spatial locality', 'Predict fault behavior from access patterns'],
        },
      ]}
    />
  )
}
