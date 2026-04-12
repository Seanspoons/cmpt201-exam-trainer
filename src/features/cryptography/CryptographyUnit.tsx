import { useState } from 'react'
import { PlaceholderPanel } from '../../components/PlaceholderPanel'
import { TabNav } from '../../components/TabNav'

type CryptographySubtopic = 'algorithms' | 'applications'

const SUBTOPIC_OPTIONS: Array<{ id: CryptographySubtopic; label: string }> = [
  { id: 'algorithms', label: 'Algorithms' },
  { id: 'applications', label: 'Applications' },
]

export function CryptographyUnit() {
  const [subtopic, setSubtopic] = useState<CryptographySubtopic>('algorithms')

  return (
    <div>
      <h2 className="section-title">Cryptography</h2>
      <TabNav options={SUBTOPIC_OPTIONS} activeTab={subtopic} onChange={setSubtopic} />
      {subtopic === 'algorithms' ? (
        <PlaceholderPanel unitLabel="Cryptography" subtopicLabel="Algorithms" />
      ) : null}
      {subtopic === 'applications' ? (
        <PlaceholderPanel unitLabel="Cryptography" subtopicLabel="Applications" />
      ) : null}
    </div>
  )
}
