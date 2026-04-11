import { useState } from 'react'
import { TabNav } from './components/TabNav'
import { AddressTranslationTab } from './features/addressTranslation/AddressTranslationTab'
import { CodePredictionTab } from './features/codePrediction/CodePredictionTab'
import { ConcurrencyDebugTab } from './features/concurrencyDebug/ConcurrencyDebugTab'
import { PageReplacementTab } from './features/pageReplacement/PageReplacementTab'
import './App.css'

type TabId =
  | 'page-replacement'
  | 'address-translation'
  | 'concurrency-debug'
  | 'code-prediction'

const TAB_OPTIONS: Array<{ id: TabId; label: string }> = [
  { id: 'page-replacement', label: 'Page Replacement' },
  { id: 'address-translation', label: 'Address Translation' },
  { id: 'concurrency-debug', label: 'Concurrency Debug' },
  { id: 'code-prediction', label: 'Code Output Prediction' },
]

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('page-replacement')

  const renderTab = () => {
    switch (activeTab) {
      case 'page-replacement':
        return <PageReplacementTab />
      case 'address-translation':
        return <AddressTranslationTab />
      case 'concurrency-debug':
        return <ConcurrencyDebugTab />
      case 'code-prediction':
        return <CodePredictionTab />
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
      <TabNav options={TAB_OPTIONS} activeTab={activeTab} onChange={setActiveTab} />
      <section className="tab-panel">{renderTab()}</section>
    </main>
  )
}

export default App
