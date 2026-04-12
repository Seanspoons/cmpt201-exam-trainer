import { useState } from 'react'
import { PlaceholderPanel } from '../../components/PlaceholderPanel'
import { TabNav } from '../../components/TabNav'
import { CodePredictionPractice } from '../codePrediction/CodePredictionPractice'
import {
  generateFileIoQuestion,
  generatePipeQuestion,
} from '../codePrediction/questions'

type FileIpcSubtopic = 'file-io' | 'pipes' | 'shared-memory'

const SUBTOPIC_OPTIONS: Array<{ id: FileIpcSubtopic; label: string }> = [
  { id: 'file-io', label: 'File I/O' },
  { id: 'pipes', label: 'Pipes' },
  { id: 'shared-memory', label: 'Shared Memory' },
]

export function FileIoIpcUnit() {
  const [subtopic, setSubtopic] = useState<FileIpcSubtopic>('file-io')

  return (
    <div>
      <h2 className="section-title">File I/O and IPC</h2>
      <TabNav options={SUBTOPIC_OPTIONS} activeTab={subtopic} onChange={setSubtopic} />

      {subtopic === 'file-io' ? (
        <CodePredictionPractice
          key="ipc-file-io"
          title="File I/O and IPC > File I/O"
          generateQuestion={generateFileIoQuestion}
        />
      ) : null}
      {subtopic === 'pipes' ? (
        <CodePredictionPractice
          key="ipc-pipes"
          title="File I/O and IPC > Pipes"
          generateQuestion={generatePipeQuestion}
        />
      ) : null}
      {subtopic === 'shared-memory' ? (
        <PlaceholderPanel unitLabel="File I/O and IPC" subtopicLabel="Shared Memory" />
      ) : null}
    </div>
  )
}
