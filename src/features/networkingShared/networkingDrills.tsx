import { useState } from 'react'
import { AnswerFeedbackCard } from '../../components/AnswerFeedbackCard'
import { QuestionControlBar } from '../../components/QuestionControlBar'
import { useSessionContext } from '../../components/SessionContext'
import { useTopicContext } from '../../components/TopicContext'
import { useQuestionTransition } from '../../components/useQuestionTransition'
import { useResetPulse } from '../../components/useResetPulse'
import { shuffleChoicesWithCorrectIndex, shuffledIndices } from '../../lib/questionRandomize'
import type { ConceptGroup } from '../../lib/semanticGrading'
import { gradeByConceptGroups } from '../../lib/semanticGrading'

type NetworkingBaseQuestion = {
  id: string
  prompt: string
  code?: string
  explanationSteps: string[]
  conceptSummary: string
  comparisonTable?: {
    headers: string[]
    rows: string[][]
  }
}

export type NetworkingMcqQuestion = NetworkingBaseQuestion & {
  kind: 'mcq'
  options: string[]
  correctOption: number
}

export type NetworkingTextQuestion = NetworkingBaseQuestion & {
  kind: 'text'
  requiredConcepts: ConceptGroup[]
  answerDisplay: string
}

export type NetworkingMatchQuestion = NetworkingBaseQuestion & {
  kind: 'match'
  pairs: Array<{ left: string; right: string }>
}

export type NetworkingQuestion =
  | NetworkingMcqQuestion
  | NetworkingTextQuestion
  | NetworkingMatchQuestion

type NetworkingDrillPracticeProps = {
  title: string
  generateQuestion: () => NetworkingQuestion
}

type CheckResult = {
  status: 'correct' | 'partial' | 'incorrect'
  missingConceptLabels: string[]
}

function normalizeAnswer(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ')
}

export function NetworkingDrillPractice({
  title,
  generateQuestion,
}: NetworkingDrillPracticeProps) {
  const [question, setQuestion] = useState<NetworkingQuestion | null>(null)
  const [mcqAnswer, setMcqAnswer] = useState<number | null>(null)
  const [textAnswer, setTextAnswer] = useState('')
  const [matchAnswer, setMatchAnswer] = useState<Record<string, string>>({})
  const [matchOptionsOrder, setMatchOptionsOrder] = useState<string[]>([])
  const [checked, setChecked] = useState(false)
  const [hasCountedAttempt, setHasCountedAttempt] = useState(false)
  const [attemptId, setAttemptId] = useState<number | null>(null)
  const [result, setResult] = useState<CheckResult | null>(null)
  const transition = useQuestionTransition()
  const resetPulse = useResetPulse()
  const { recordAttempt, overrideAttemptResult } = useSessionContext()
  const { unitLabel, subtopicLabel } = useTopicContext()

  const resetAnswerInputs = () => {
    setMcqAnswer(null)
    setTextAnswer('')
    setMatchAnswer({})
    setChecked(false)
    setResult(null)
  }

  const generate = () => {
    transition.runQuestionTransition(() => {
      const rawQuestion = generateQuestion()
      if (rawQuestion.kind === 'mcq') {
        const shuffled = shuffleChoicesWithCorrectIndex(
          rawQuestion.options,
          rawQuestion.correctOption,
        )
        setQuestion({
          ...rawQuestion,
          options: shuffled.choices,
          correctOption: shuffled.correctIndex,
        })
        setMatchOptionsOrder([])
      } else {
        setQuestion(rawQuestion)
        if (rawQuestion.kind === 'match') {
          const options = rawQuestion.pairs.map((pair) => pair.right)
          const shuffled = shuffledIndices(options.length).map((index) => options[index])
          setMatchOptionsOrder(shuffled)
        } else {
          setMatchOptionsOrder([])
        }
      }
      resetAnswerInputs()
      setHasCountedAttempt(false)
      setAttemptId(null)
    })
  }

  const resetAnswerOnly = () => {
    if (!question) return
    resetAnswerInputs()
    resetPulse.triggerResetPulse()
  }

  const checkAnswer = () => {
    if (!question) return

    let isCorrect = false

    if (question.kind === 'mcq') {
      isCorrect = mcqAnswer === question.correctOption
    } else if (question.kind === 'text') {
      const grade = gradeByConceptGroups(textAnswer, question.requiredConcepts)
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
      return
    } else {
      isCorrect = question.pairs.every(
        (pair) => normalizeAnswer(matchAnswer[pair.left] ?? '') === normalizeAnswer(pair.right),
      )
    }

    if (!hasCountedAttempt) {
      const id = recordAttempt({
        unitLabel,
        subtopicLabel,
        isCorrect,
      })
      setAttemptId(id)
      setHasCountedAttempt(true)
    }

    setResult({
      status: isCorrect ? 'correct' : 'incorrect',
      missingConceptLabels: [],
    })
    setChecked(true)
  }

  const disabledCheck =
    !question ||
    (question.kind === 'mcq' && mcqAnswer === null) ||
    (question.kind === 'text' && !textAnswer.trim()) ||
    (question.kind === 'match' &&
      question.pairs.some((pair) => !matchAnswer[pair.left]))

  const renderAnswerInput = () => {
    if (!question) return null

    if (question.kind === 'mcq') {
      return (
        <div className="field">
          <label>Choose one:</label>
          <div className="controls-row">
            {question.options.map((option, index) => (
              <button
                key={option}
                onClick={() => setMcqAnswer(index)}
                className={mcqAnswer === index ? 'button-primary' : 'button-secondary'}
              >
                {String.fromCharCode(65 + index)}. {option}
              </button>
            ))}
          </div>
        </div>
      )
    }

    if (question.kind === 'text') {
      return (
        <div className="field">
          <label htmlFor={`${title}-answer`}>Your answer</label>
          <input
            id={`${title}-answer`}
            value={textAnswer}
            onChange={(event) => setTextAnswer(event.target.value)}
          />
          <p className="small-note">Checking ignores case and extra spaces.</p>
        </div>
      )
    }

    const rightOptions =
      matchOptionsOrder.length > 0
        ? matchOptionsOrder
        : question.pairs.map((pair) => pair.right)
    return (
      <div className="field">
        <label>Match each strategy to the best description:</label>
        <div className="table-scroll">
          <table className="compact-table">
            <thead>
              <tr>
                <th>Left Side</th>
                <th>Select Match</th>
              </tr>
            </thead>
            <tbody>
              {question.pairs.map((pair) => (
                <tr key={pair.left}>
                  <td>{pair.left}</td>
                  <td>
                    <select
                      value={matchAnswer[pair.left] ?? ''}
                      onChange={(event) =>
                        setMatchAnswer((prev) => ({
                          ...prev,
                          [pair.left]: event.target.value,
                        }))
                      }
                    >
                      <option value="">Select...</option>
                      {rightOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  const renderCorrectAnswer = () => {
    if (!question) return null

    if (question.kind === 'mcq') {
      return (
        <p>
          Correct answer:{' '}
          <strong>
            {String.fromCharCode(65 + question.correctOption)}.{' '}
            {question.options[question.correctOption]}
          </strong>
        </p>
      )
    }

    if (question.kind === 'text') {
      return (
        <p>
          Correct answer: <strong>{question.answerDisplay}</strong>
        </p>
      )
    }

    return (
      <div>
        <p>Correct matching:</p>
        <div className="table-scroll">
          <table className="compact-table">
            <thead>
              <tr>
                <th>Left Side</th>
                <th>Correct Match</th>
              </tr>
            </thead>
            <tbody>
              {question.pairs.map((pair) => (
                <tr key={pair.left}>
                  <td>{pair.left}</td>
                  <td>{pair.right}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
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
            {question.code ? (
              <pre className="inline-code-block">{question.code}</pre>
            ) : null}
          </div>

          <div
            className={`answer-input-region ${
              resetPulse.isResetActive ? 'answer-input-region--reset' : ''
            }`}
          >
            {renderAnswerInput()}
          </div>

          <div style={{ marginTop: '0.65rem' }}>
            <button
              className="button-primary"
              onClick={checkAnswer}
              disabled={disabledCheck}
            >
              Check Answer
            </button>
          </div>

          {checked && result ? (
            <AnswerFeedbackCard
              status={result.status}
              missingConceptLabels={result.missingConceptLabels}
              onMarkCorrect={
                result.status === 'partial'
                  ? () => {
                      if (attemptId !== null) {
                        overrideAttemptResult(attemptId, true)
                      }
                      setResult({ status: 'correct', missingConceptLabels: [] })
                    }
                  : undefined
              }
              answerContent={renderCorrectAnswer()}
              explanationContent={
                <div className="table-scroll">
                  <table className="compact-table">
                    <thead>
                      <tr>
                        <th>Step-by-step explanation</th>
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
              conceptSummary={`Concept summary: ${question.conceptSummary}`}
              extraContent={
                question.comparisonTable ? (
                  <div className="table-scroll">
                    <table className="compact-table">
                      <thead>
                        <tr>
                          {question.comparisonTable.headers.map((header) => (
                            <th key={header}>{header}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {question.comparisonTable.rows.map((row) => (
                          <tr key={row.join('|')}>
                            {row.map((cell) => (
                              <td key={cell}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
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
