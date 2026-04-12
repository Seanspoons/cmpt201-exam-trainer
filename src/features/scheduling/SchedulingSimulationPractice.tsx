import { useState } from 'react'
import { AnswerFeedbackCard } from '../../components/AnswerFeedbackCard'
import { QuestionControlBar } from '../../components/QuestionControlBar'
import { useQuestionTransition } from '../../components/useQuestionTransition'
import { useResetPulse } from '../../components/useResetPulse'
import { normalizeText } from '../../lib/semanticGrading'
import {
  buildSchedulingReasoning,
  formatExecutionOrder,
  formatGantt,
  type SchedulingSimulationQuestion,
} from './simulationQuestions'

type SchedulingSimulationPracticeProps = {
  title: string
  generators: {
    random: () => SchedulingSimulationQuestion
    fcfs: () => SchedulingSimulationQuestion
    sjf: () => SchedulingSimulationQuestion
    srtf: () => SchedulingSimulationQuestion
    roundRobin: () => SchedulingSimulationQuestion
    priority: () => SchedulingSimulationQuestion
  }
}

type CheckResult = {
  status: 'correct' | 'partial' | 'incorrect'
  missingConceptLabels: string[]
}

function isNumericClose(actual: number, expected: number): boolean {
  return Math.abs(actual - expected) < 0.01
}

export function SchedulingSimulationPractice({
  title,
  generators,
}: SchedulingSimulationPracticeProps) {
  const [selectedMode, setSelectedMode] = useState<
    'Random' | 'FCFS' | 'SJF' | 'SRTF' | 'Round Robin' | 'Priority'
  >('Random')
  const [question, setQuestion] = useState<SchedulingSimulationQuestion | null>(null)
  const [orderAnswer, setOrderAnswer] = useState('')
  const [totalWaitAnswer, setTotalWaitAnswer] = useState('')
  const [avgWaitAnswer, setAvgWaitAnswer] = useState('')
  const [timelineAnswer, setTimelineAnswer] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)
  const [result, setResult] = useState<CheckResult | null>(null)
  const [attempts, setAttempts] = useState(0)
  const [correct, setCorrect] = useState(0)
  const transition = useQuestionTransition()
  const resetPulse = useResetPulse()

  const resetAnswerInputs = () => {
    setOrderAnswer('')
    setTotalWaitAnswer('')
    setAvgWaitAnswer('')
    setTimelineAnswer(null)
    setChecked(false)
    setResult(null)
  }

  const generate = () => {
    transition.runQuestionTransition(() => {
      const nextQuestion =
        selectedMode === 'FCFS'
          ? generators.fcfs()
          : selectedMode === 'SJF'
            ? generators.sjf()
            : selectedMode === 'SRTF'
              ? generators.srtf()
              : selectedMode === 'Round Robin'
                ? generators.roundRobin()
                : selectedMode === 'Priority'
                  ? generators.priority()
                  : generators.random()
      setQuestion(nextQuestion)
      resetAnswerInputs()
    })
  }

  const resetAnswerOnly = () => {
    if (!question) return
    resetAnswerInputs()
    resetPulse.triggerResetPulse()
  }

  const checkAnswer = () => {
    if (!question) return

    const expectedOrder = normalizeText(formatExecutionOrder(question.simulation))
    const orderCorrect = normalizeText(orderAnswer) === expectedOrder

    const totalWaitNum = Number(totalWaitAnswer.trim())
    const avgWaitNum = Number(avgWaitAnswer.trim())
    const totalWaitCorrect =
      !Number.isNaN(totalWaitNum) &&
      isNumericClose(totalWaitNum, question.simulation.totalWaitTime)
    const avgWaitCorrect =
      !Number.isNaN(avgWaitNum) &&
      isNumericClose(avgWaitNum, question.simulation.averageWaitTime)

    const timelineCorrect = timelineAnswer === question.correctTimelineChoice

    const checklist: Array<[boolean, string]> = [
      [orderCorrect, 'Execution order'],
      [totalWaitCorrect, 'Total wait time'],
      [avgWaitCorrect, 'Average wait time'],
      [timelineCorrect, 'Gantt timeline'],
    ]

    const missing = checklist.filter(([ok]) => !ok).map(([, label]) => label)
    const correctCount = checklist.filter(([ok]) => ok).length

    const status: CheckResult['status'] =
      correctCount === checklist.length
        ? 'correct'
        : correctCount > 0
          ? 'partial'
          : 'incorrect'

    setResult({
      status,
      missingConceptLabels: missing,
    })
    setChecked(true)
    setAttempts((value) => value + 1)
    if (status === 'correct') setCorrect((value) => value + 1)
  }

  return (
    <div>
      <h3 className="section-title">{title}</h3>
      <div className="nested-choice-panel nested-choice-panel--scheduling">
        <p className="nested-choice-label">Scheduling Algorithm</p>
        <div className="nested-choice-row" role="tablist" aria-label="Scheduling algorithm">
          {(
            ['Random', 'FCFS', 'SJF', 'SRTF', 'Round Robin', 'Priority'] as const
          ).map((mode) => (
            <button
              key={mode}
              role="tab"
              aria-selected={selectedMode === mode}
              className={`nested-choice-button nested-choice-button--scheduling ${
                selectedMode === mode ? 'nested-choice-button--active' : ''
              }`}
              onClick={() => setSelectedMode(mode)}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>
      <QuestionControlBar
        hasQuestion={Boolean(question)}
        isTransitioning={transition.isTransitioning}
        onNewQuestion={generate}
        onResetAnswer={resetAnswerOnly}
        disableReset={!question}
      />
      <p className="small-note">
        Session score: {correct}/{attempts}
      </p>

      <div
        className={`question-stage ${
          transition.phase === 'out'
            ? 'question-stage--out'
            : transition.phase === 'in'
              ? 'question-stage--in'
              : ''
        }`}
      >
      {question ? (
        <>
          <div className="question-box">
            <p>{question.prompt}</p>
            {question.quantum ? (
              <p className="small-note">
                Round Robin quantum: <strong>{question.quantum}</strong>
              </p>
            ) : null}
            {question.preemptivePriority !== undefined ? (
              <p className="small-note">
                Priority mode:{' '}
                <strong>
                  {question.preemptivePriority ? 'Preemptive' : 'Non-preemptive'}
                </strong>
              </p>
            ) : null}
          </div>

          <div
            className={`answer-input-region ${
              resetPulse.isResetActive ? 'answer-input-region--reset' : ''
            }`}
          >
          <div className="field-grid">
            <div className="field">
              <label htmlFor={`${title}-order`}>Execution order (e.g. P1 -&gt; P2 -&gt; P1)</label>
              <input
                id={`${title}-order`}
                value={orderAnswer}
                onChange={(event) => setOrderAnswer(event.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor={`${title}-totalwait`}>Total wait time</label>
              <input
                id={`${title}-totalwait`}
                value={totalWaitAnswer}
                onChange={(event) => setTotalWaitAnswer(event.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor={`${title}-avgwait`}>Average wait time</label>
              <input
                id={`${title}-avgwait`}
                value={avgWaitAnswer}
                onChange={(event) => setAvgWaitAnswer(event.target.value)}
              />
            </div>
          </div>
          </div>

          {question.timelineChoices ? (
            <div className="field">
              <label>Choose the correct Gantt timeline:</label>
              <div className="controls-row">
                {question.timelineChoices.map((choice, index) => (
                  <button
                    key={choice}
                    className={timelineAnswer === index ? 'button-primary' : 'button-secondary'}
                    onClick={() => setTimelineAnswer(index)}
                  >
                    {String.fromCharCode(65 + index)}. {choice}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div style={{ marginTop: '0.65rem' }}>
            <button
              className="button-primary"
              onClick={checkAnswer}
              disabled={
                !orderAnswer.trim() ||
                !totalWaitAnswer.trim() ||
                !avgWaitAnswer.trim() ||
                timelineAnswer === null
              }
            >
              Check Answer
            </button>
          </div>

          {checked && result ? (
            <AnswerFeedbackCard
              status={result.status}
              missingConceptLabels={result.missingConceptLabels}
              answerContent={
                <>
                  <p>
                    Correct execution order:{' '}
                    <strong>{formatExecutionOrder(question.simulation)}</strong>
                  </p>
                  <p>
                    Total wait time: <strong>{question.simulation.totalWaitTime}</strong>
                  </p>
                  <p>
                    Average wait time:{' '}
                    <strong>{question.simulation.averageWaitTime.toFixed(2)}</strong>
                  </p>
                  <p>
                    Correct Gantt chart:{' '}
                    <strong>{formatGantt(question.simulation)}</strong>
                  </p>
                </>
              }
              explanationContent={
                <div className="table-scroll">
                  <table className="compact-table">
                    <thead>
                      <tr>
                        <th>Step-by-step scheduling reasoning</th>
                      </tr>
                    </thead>
                    <tbody>
                      {buildSchedulingReasoning(question).map((step) => (
                        <tr key={step}>
                          <td>{step}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              }
              conceptSummary={`Metric reminder: Wait = Turnaround - Burst. Average wait = total wait / number of processes.`}
              extraContent={
                <div className="table-scroll">
                  <table className="compact-table">
                    <thead>
                      <tr>
                        <th>Process</th>
                        <th>Completion</th>
                        <th>Turnaround</th>
                        <th>Wait</th>
                      </tr>
                    </thead>
                    <tbody>
                      {question.simulation.processes.map((process) => {
                        const metric = question.simulation.metrics[process.id]
                        return (
                          <tr key={process.id}>
                            <td>{process.id}</td>
                            <td>{metric.completionTime}</td>
                            <td>{metric.turnaroundTime}</td>
                            <td>{metric.waitTime}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              }
            />
          ) : null}
        </>
      ) : (
        <p>Generate a question to start.</p>
      )}
      </div>
    </div>
  )
}
