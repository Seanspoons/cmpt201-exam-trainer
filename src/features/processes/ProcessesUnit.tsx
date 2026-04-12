import { useState } from 'react'
import { TabNav } from '../../components/TabNav'
import { CodePredictionPractice } from '../codePrediction/CodePredictionPractice'
import {
  generateErrnoQuestion,
  generateExecQuestion,
  generateForkQuestion,
  generateWaitQuestion,
} from '../codePrediction/questions'

type ProcessesSubtopic = 'fork' | 'exec' | 'wait-zombies' | 'errno'

const SUBTOPIC_OPTIONS: Array<{ id: ProcessesSubtopic; label: string }> = [
  { id: 'fork', label: 'fork()' },
  { id: 'exec', label: 'exec()' },
  { id: 'wait-zombies', label: 'wait() / zombies' },
  { id: 'errno', label: 'errno' },
]

export function ProcessesUnit() {
  const [subtopic, setSubtopic] = useState<ProcessesSubtopic>('fork')

  return (
    <div>
      <h2 className="section-title">Processes</h2>
      <TabNav options={SUBTOPIC_OPTIONS} activeTab={subtopic} onChange={setSubtopic} />

      {subtopic === 'fork' ? (
        <CodePredictionPractice key="proc-fork" title="Processes > fork()" generateQuestion={generateForkQuestion} />
      ) : null}
      {subtopic === 'exec' ? (
        <CodePredictionPractice key="proc-exec" title="Processes > exec()" generateQuestion={generateExecQuestion} />
      ) : null}
      {subtopic === 'wait-zombies' ? (
        <CodePredictionPractice
          key="proc-wait"
          title="Processes > wait() / zombies"
          generateQuestion={generateWaitQuestion}
        />
      ) : null}
      {subtopic === 'errno' ? (
        <CodePredictionPractice key="proc-errno" title="Processes > errno" generateQuestion={generateErrnoQuestion} />
      ) : null}
    </div>
  )
}
