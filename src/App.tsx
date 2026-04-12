import { useState } from 'react'
import { TabNav } from './components/TabNav'
import { CryptoAlgorithmsUnit } from './features/cryptoAlgorithms/CryptoAlgorithmsUnit'
import { CryptoApplicationsUnit } from './features/cryptoApplications/CryptoApplicationsUnit'
import { FileIoUnit } from './features/fileIo/FileIoUnit'
import { FilesystemsUnit } from './features/filesystems/FilesystemsUnit'
import { ForkExecUnit } from './features/forkExec/ForkExecUnit'
import { IpcPipesUnit } from './features/ipcPipes/IpcPipesUnit'
import { IpcSharedMemoryUnit } from './features/ipcSharedMemory/IpcSharedMemoryUnit'
import { MemoryManagementUnit } from './features/memoryManagement/MemoryManagementUnit'
import { NetworkingAfInetUnit } from './features/networkingAfInet/NetworkingAfInetUnit'
import { NetworkingMultipleClientsUnit } from './features/networkingMultipleClients/NetworkingMultipleClientsUnit'
import { NetworkingSocketsUnit } from './features/networkingSockets/NetworkingSocketsUnit'
import { SchedulingUnit } from './features/scheduling/SchedulingUnit'
import { SignalsUnit } from './features/signals/SignalsUnit'
import { SleepUnit } from './features/sleep/SleepUnit'
import { SyncMutexUnit } from './features/syncMutex/SyncMutexUnit'
import { SyncPatternsUnit } from './features/syncPatterns/SyncPatternsUnit'
import { ThreadsUnit } from './features/threads/ThreadsUnit'
import { TourSystemsUnit } from './features/tourSystems/TourSystemsUnit'
import { VirtualMemoryUnit } from './features/virtualMemory/VirtualMemoryUnit'
import { WaitErrnoUnit } from './features/waitErrno/WaitErrnoUnit'
import { UNIT_OPTIONS, type UnitId } from './lib/study'
import './App.css'

function App() {
  const brandWordmarkSrc = `${import.meta.env.BASE_URL}cmpt-201-exam-trainer-wordmark.svg`
  const [activeUnit, setActiveUnit] = useState<UnitId>('virtual-memory')

  const renderUnit = () => {
    switch (activeUnit) {
      case 'tour-computer-systems':
        return <TourSystemsUnit />
      case 'sleep':
        return <SleepUnit />
      case 'fork-exec':
        return <ForkExecUnit />
      case 'wait-errno':
        return <WaitErrnoUnit />
      case 'signals':
        return <SignalsUnit />
      case 'scheduling':
        return <SchedulingUnit />
      case 'memory-management':
        return <MemoryManagementUnit />
      case 'virtual-memory':
        return <VirtualMemoryUnit />
      case 'threads':
        return <ThreadsUnit />
      case 'sync-mutex':
        return <SyncMutexUnit />
      case 'sync-patterns':
        return <SyncPatternsUnit />
      case 'file-io':
        return <FileIoUnit />
      case 'filesystems':
        return <FilesystemsUnit />
      case 'networking-sockets':
        return <NetworkingSocketsUnit />
      case 'networking-af-inet':
        return <NetworkingAfInetUnit />
      case 'networking-multiple-clients':
        return <NetworkingMultipleClientsUnit />
      case 'ipc-pipes':
        return <IpcPipesUnit />
      case 'ipc-shared-memory':
        return <IpcSharedMemoryUnit />
      case 'crypto-algorithms':
        return <CryptoAlgorithmsUnit />
      case 'crypto-applications':
        return <CryptoApplicationsUnit />
      default:
        return null
    }
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="brand-row">
          <img
            src={brandWordmarkSrc}
            alt="CMPT 201 Exam Trainer"
            className="brand-wordmark"
          />
        </div>
        <h1 className="visually-hidden">CMPT 201 Exam Trainer</h1>
        <p>Exam-style drills for CMPT 201 pre-midterm and post-midterm units</p>
      </header>
      <TabNav
        options={UNIT_OPTIONS}
        activeTab={activeUnit}
        onChange={setActiveUnit}
        variant="unit"
      />
      <section className="tab-panel">{renderUnit()}</section>
    </main>
  )
}

export default App
