import { useState } from 'react'
import { FiBookOpen, FiChevronRight, FiMenu, FiX, FiInfo } from 'react-icons/fi'
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
  const [isUnitMenuOpen, setIsUnitMenuOpen] = useState(false)
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null)

  const selectUnit = (unitId: UnitId) => {
    setActiveUnit(unitId)
    setIsUnitMenuOpen(false)
  }

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
          <button
            className="info-trigger"
            aria-label="About this tool"
            type="button"
            onMouseEnter={(e) => {
              setTooltipPos({ x: e.clientX, y: e.clientY })
            }}
            onMouseMove={(e) => {
              setTooltipPos({ x: e.clientX, y: e.clientY })
            }}
            onMouseLeave={() => setTooltipPos(null)}
          >
            <FiInfo aria-hidden="true" />
          </button>
          {tooltipPos && (
            <div
              className="info-tooltip-floating"
              style={{
                top: tooltipPos.y + 12,
                left: tooltipPos.x + 12,
              }}
            >
              Based on CMPT 201: Systems Programming D100 (Spring 2026)
            </div>
          )}
          <button
            className="button-secondary unit-menu-toggle"
            onClick={() => setIsUnitMenuOpen((value) => !value)}
            aria-expanded={isUnitMenuOpen}
            aria-controls="unit-drawer"
          >
            {isUnitMenuOpen ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
            <span>{isUnitMenuOpen ? 'Close Units' : 'Select Unit'}</span>
          </button>
        </div>
        <h1 className="visually-hidden">CMPT 201 Exam Trainer</h1>
        <p>Exam-style drills across all CMPT 201 lecture units</p>
      </header>
      <aside
        id="unit-drawer"
        className={`unit-drawer ${isUnitMenuOpen ? 'unit-drawer--open' : ''}`}
        aria-hidden={!isUnitMenuOpen}
      >
        <div className="unit-drawer-head">
          <strong>
            <FiBookOpen aria-hidden="true" /> Course Units
          </strong>
          <button
            className="button-secondary"
            onClick={() => setIsUnitMenuOpen(false)}
          >
            <FiX aria-hidden="true" />
            <span>Close</span>
          </button>
        </div>
        <div className="unit-drawer-list">
          {UNIT_OPTIONS.map((unit) => (
            <button
              key={unit.id}
              className={`unit-drawer-item ${
                activeUnit === unit.id ? 'unit-drawer-item--active' : ''
              }`}
              onClick={() => selectUnit(unit.id)}
            >
              <span className="unit-drawer-label">
                {unit.label}
                {unit.implemented ? (
                  <span className="unit-count-badge">
                    {unit.questionCount === 'infinity'
                      ? '∞Q'
                      : `${unit.questionCount ?? 0}Q`}
                  </span>
                ) : (
                  <span className="unit-status-badge">Coming Soon</span>
                )}
              </span>
              <FiChevronRight aria-hidden="true" />
            </button>
          ))}
        </div>
      </aside>
      {isUnitMenuOpen ? (
        <div
          className="unit-overlay"
          aria-hidden="true"
          onClick={() => setIsUnitMenuOpen(false)}
        />
      ) : null}
      <section className="tab-panel">{renderUnit()}</section>
      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} Sean Wotherspoon</p>
      </footer>
    </main>
  )
}

export default App
