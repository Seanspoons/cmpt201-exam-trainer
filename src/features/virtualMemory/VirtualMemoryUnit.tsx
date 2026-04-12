import { useState } from 'react'
import { PlaceholderPanel } from '../../components/PlaceholderPanel'
import { TabNav } from '../../components/TabNav'
import { AddressTranslationTab } from '../addressTranslation/AddressTranslationTab'
import { PageReplacementTab } from '../pageReplacement/PageReplacementTab'

export function VirtualMemoryUnit() {
  const [subtopic, setSubtopic] = useState<
    'address-translation' | 'page-replacement' | 'locality-page-faults'
  >('page-replacement')

  const options: Array<{
    id: 'address-translation' | 'page-replacement' | 'locality-page-faults'
    label: string
  }> = [
    { id: 'address-translation', label: 'Address Translation' },
    { id: 'page-replacement', label: 'Page Replacement' },
    { id: 'locality-page-faults', label: 'Locality and Page Faults' },
  ]

  return (
    <div>
      <h2 className="section-title">Virtual Memory</h2>
      <TabNav
        options={options}
        activeTab={subtopic}
        onChange={setSubtopic}
        variant="subtopic"
      />
      {subtopic === 'page-replacement' ? <PageReplacementTab /> : null}
      {subtopic === 'address-translation' ? <AddressTranslationTab /> : null}
      {subtopic === 'locality-page-faults' ? (
        <PlaceholderPanel
          unitLabel="Virtual Memory"
          subtopicLabel="Locality and Page Faults"
        />
      ) : null}
    </div>
  )
}
