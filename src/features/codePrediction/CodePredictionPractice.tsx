import { useState } from 'react'
import { AnswerFeedbackCard } from '../../components/AnswerFeedbackCard'
import { QuestionControlBar } from '../../components/QuestionControlBar'
import { useQuestionTransition } from '../../components/useQuestionTransition'
import { useResetPulse } from '../../components/useResetPulse'
import {
  gradePredictionAnswer,
  type CodePredictionQuestion,
} from './questions'

type CodePredictionPracticeProps = {
  title: string
  generateQuestion: () => CodePredictionQuestion
}

type CheckResult = {
  status: 'correct' | 'partial' | 'incorrect'
  missingConceptLabels: string[]
}

export function CodePredictionPractice({
  title,
  generateQuestion,
}: CodePredictionPracticeProps) {
  const [question, setQuestion] = useState<CodePredictionQuestion | null>(null)
  const [answer, setAnswer] = useState('')
  const [checked, setChecked] = useState(false)
  const [result, setResult] = useState<CheckResult | null>(null)
  const [attempts, setAttempts] = useState(0)
  const [correct, setCorrect] = useState(0)
  const transition = useQuestionTransition()
  const resetPulse = useResetPulse()

  const resetAnswerOnly = () => {
    if (!question) return
    setAnswer('')
    setChecked(false)
    setResult(null)
    resetPulse.triggerResetPulse()
  }

  const generate = () => {
    transition.runQuestionTransition(() => {
      setQuestion(generateQuestion())
      setAnswer('')
      setChecked(false)
      setResult(null)
    })
  }

  const checkAnswer = () => {
    if (!question) return
    const grade = gradePredictionAnswer(answer, question)
    setResult({
      status: grade.status,
      missingConceptLabels: grade.missingConceptLabels,
    })
    setAttempts((value) => value + 1)
    if (grade.status === 'correct') {
      setCorrect((value) => value + 1)
    }
    setChecked(true)
  }

  return (
    <div>
      <h3 className="section-title">{title}</h3>
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
            <pre className="inline-code-block">{question.code}</pre>
          </div>
          <div
            className={`answer-input-region ${
              resetPulse.isResetActive ? 'answer-input-region--reset' : ''
            }`}
          >
          <div className="field">
            <label htmlFor={`${title}-codeAnswer`}>Your answer</label>
            <input
              id={`${title}-codeAnswer`}
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
            />
            <p className="small-note">Checking ignores case and extra spaces.</p>
          </div>
          </div>
          <div style={{ marginTop: '0.65rem' }}>
            <button className="button-primary" onClick={checkAnswer} disabled={!answer.trim()}>
              Check Answer
            </button>
          </div>

          {checked && result ? (
            <AnswerFeedbackCard
              status={result.status}
              missingConceptLabels={result.missingConceptLabels}
              answerContent={
                <>
                  <p>Accepted answer(s):</p>
                  <ul>
                    {question.correctAnswers.map((value) => (
                      <li key={value}>
                        <strong>{value}</strong>
                      </li>
                    ))}
                  </ul>
                </>
              }
              explanationContent={
                <div className="table-scroll">
                  <table className="compact-table">
                    <thead>
                      <tr>
                        <th>Step-by-step execution trace</th>
                      </tr>
                    </thead>
                    <tbody>
                      {question.explanationSteps.map((step) => (
                        <tr key={step}>
                          <td>{step}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              }
              conceptSummary={`Concepts: ${question.concepts.join(', ')}`}
              extraContent={
                question.nonDeterministicNote ? (
                  <p className="small-note">
                    Non-determinism note: {question.nonDeterministicNote}
                  </p>
                ) : undefined
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
