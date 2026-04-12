import { useState } from 'react'
import { TabNav } from './components/TabNav'
import { CryptographyUnit } from './features/cryptography/CryptographyUnit'
import { FileIoIpcUnit } from './features/fileIoIpc/FileIoIpcUnit'
import { NetworkingUnit } from './features/networking/NetworkingUnit'
import { ProcessesUnit } from './features/processes/ProcessesUnit'
import { SynchronizationUnit } from './features/synchronization/SynchronizationUnit'
import { VirtualMemoryUnit } from './features/virtualMemory/VirtualMemoryUnit'
import type { UnitId } from './lib/study'
import './App.css'

const UNIT_OPTIONS: Array<{ id: UnitId; label: string }> = [
  { id: 'processes', label: 'Processes' },
  { id: 'virtual-memory', label: 'Virtual Memory' },
  { id: 'synchronization', label: 'Synchronization' },
  { id: 'file-io-ipc', label: 'File I/O and IPC' },
  { id: 'networking', label: 'Networking' },
  { id: 'cryptography', label: 'Cryptography' },
]

function App() {
  const [activeUnit, setActiveUnit] = useState<UnitId>('virtual-memory')

  const renderUnit = () => {
    switch (activeUnit) {
      case 'processes':
        return <ProcessesUnit />
      case 'virtual-memory':
        return <VirtualMemoryUnit />
      case 'synchronization':
        return <SynchronizationUnit />
      case 'file-io-ipc':
        return <FileIoIpcUnit />
      case 'networking':
        return <NetworkingUnit />
      case 'cryptography':
        return <CryptographyUnit />
      default:
        return null
    }
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <h1>CMPT 201 Exam Trainer</h1>
        <p>Post-midterm systems programming exam practice</p>
      </header>
      <TabNav options={UNIT_OPTIONS} activeTab={activeUnit} onChange={setActiveUnit} />
      <section className="tab-panel">{renderUnit()}</section>
    </main>
  )
}

export default App
