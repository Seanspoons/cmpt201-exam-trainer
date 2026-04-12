import { useRef, useState } from 'react'
import { AnswerFeedbackCard } from '../../components/AnswerFeedbackCard'
import { QuestionControlBar } from '../../components/QuestionControlBar'
import { useSessionContext } from '../../components/SessionContext'
import { useTopicContext } from '../../components/TopicContext'
import { useUnitNavigationContext } from '../../components/UnitNavigationContext'
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
  const [hasCountedAttempt, setHasCountedAttempt] = useState(false)
  const [attemptId, setAttemptId] = useState<number | null>(null)
  const [result, setResult] = useState<CheckResult | null>(null)
  const transition = useQuestionTransition()
  const resetPulse = useResetPulse()
  const { recordAttempt, overrideAttemptResult } = useSessionContext()
  const { unitLabel, subtopicLabel } = useTopicContext()
  const { hasNextSubtopic, goToNextSubtopic } = useUnitNavigationContext()
  const seenQuestionIdsRef = useRef<Set<string>>(new Set())
  const lastQuestionIdRef = useRef<string | null>(null)

  const resetAnswerOnly = () => {
    if (!question) return
    setAnswer('')
    setChecked(false)
    setResult(null)
    resetPulse.triggerResetPulse()
  }

  const generate = () => {
    transition.runQuestionTransition(() => {
      const selectQuestion = () => {
        let fallback = generateQuestion()
        for (let i = 0; i < 24; i += 1) {
          const candidate = generateQuestion()
          fallback = candidate
          const unseen = !seenQuestionIdsRef.current.has(candidate.id)
          const notSameAsLast = candidate.id !== lastQuestionIdRef.current
          if (unseen && notSameAsLast) {
            return { question: candidate, exhausted: false }
          }
        }
        return { question: fallback, exhausted: true }
      }

      let { question: nextQuestion, exhausted } = selectQuestion()
      if (exhausted) {
        const wantsNext =
          hasNextSubtopic &&
          window.confirm(
            'You have seen all questions in this topic. Move to the next topic?',
          )
        if (wantsNext) {
          goToNextSubtopic()
          return
        }
        seenQuestionIdsRef.current.clear()
        const retry = selectQuestion()
        nextQuestion = retry.question
      }

      seenQuestionIdsRef.current.add(nextQuestion.id)
      lastQuestionIdRef.current = nextQuestion.id

      setQuestion(nextQuestion)
      setAnswer('')
      setChecked(false)
      setResult(null)
      setHasCountedAttempt(false)
      setAttemptId(null)
    })
  }

  const checkAnswer = () => {
    if (!question) return
    const grade = gradePredictionAnswer(answer, question)
    if (!hasCountedAttempt) {
      const id = recordAttempt({
        unitLabel,
        subtopicLabel,
        isCorrect: grade.status === 'correct',
      })
      setAttemptId(id)
      setHasCountedAttempt(true)
    }
    setResult({
      status: grade.status,
      missingConceptLabels: grade.missingConceptLabels,
    })
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
              onMarkCorrect={
                result.status !== 'correct'
                  ? () => {
                      if (attemptId !== null) {
                        overrideAttemptResult(attemptId, true)
                      }
                      setResult({ status: 'correct', missingConceptLabels: [] })
                    }
                  : undefined
              }
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
