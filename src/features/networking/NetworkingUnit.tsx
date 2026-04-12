import { useState } from 'react'
import { PlaceholderPanel } from '../../components/PlaceholderPanel'
import { TabNav } from '../../components/TabNav'

type NetworkingSubtopic = 'sockets' | 'af-inet' | 'multiple-clients'

const SUBTOPIC_OPTIONS: Array<{ id: NetworkingSubtopic; label: string }> = [
  { id: 'sockets', label: 'Sockets' },
  { id: 'af-inet', label: 'AF_INET' },
  { id: 'multiple-clients', label: 'Multiple Clients' },
]

export function NetworkingUnit() {
  const [subtopic, setSubtopic] = useState<NetworkingSubtopic>('sockets')

  return (
    <div>
      <h2 className="section-title">Networking</h2>
      <TabNav
        options={SUBTOPIC_OPTIONS}
        activeTab={subtopic}
        onChange={setSubtopic}
        variant="subtopic"
      />
      {subtopic === 'sockets' ? (
        <PlaceholderPanel unitLabel="Networking" subtopicLabel="Sockets" />
      ) : null}
      {subtopic === 'af-inet' ? (
        <PlaceholderPanel unitLabel="Networking" subtopicLabel="AF_INET" />
      ) : null}
      {subtopic === 'multiple-clients' ? (
        <PlaceholderPanel unitLabel="Networking" subtopicLabel="Multiple Clients" />
      ) : null}
    </div>
  )
}
