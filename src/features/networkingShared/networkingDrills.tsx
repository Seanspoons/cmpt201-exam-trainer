import { useState } from 'react'

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
  acceptedAnswers: string[]
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
  isCorrect: boolean
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
  const [checked, setChecked] = useState(false)
  const [result, setResult] = useState<CheckResult | null>(null)
  const [attempts, setAttempts] = useState(0)
  const [correct, setCorrect] = useState(0)

  const generate = () => {
    setQuestion(generateQuestion())
    setMcqAnswer(null)
    setTextAnswer('')
    setMatchAnswer({})
    setChecked(false)
    setResult(null)
  }

  const checkAnswer = () => {
    if (!question) return

    let isCorrect = false

    if (question.kind === 'mcq') {
      isCorrect = mcqAnswer === question.correctOption
    } else if (question.kind === 'text') {
      const normalizedUser = normalizeAnswer(textAnswer)
      isCorrect = question.acceptedAnswers
        .map((answer) => normalizeAnswer(answer))
        .includes(normalizedUser)
    } else {
      isCorrect = question.pairs.every(
        (pair) => normalizeAnswer(matchAnswer[pair.left] ?? '') === normalizeAnswer(pair.right),
      )
    }

    setResult({ isCorrect })
    setChecked(true)
    setAttempts((value) => value + 1)
    if (isCorrect) {
      setCorrect((value) => value + 1)
    }
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

    const rightOptions = question.pairs.map((pair) => pair.right)
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
      <div className="controls-row">
        <button className="button-secondary" onClick={generate}>
          Generate Question
        </button>
        <button className="button-secondary" onClick={generate}>
          Reset / New Question
        </button>
      </div>
      <p className="small-note">
        Session score: {correct}/{attempts}
      </p>

      {question ? (
        <>
          <div className="question-box">
            <p>{question.prompt}</p>
            {question.code ? (
              <pre className="inline-code-block">{question.code}</pre>
            ) : null}
          </div>

          {renderAnswerInput()}

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
            <div className="result-box">
              <p className={`status ${result.isCorrect ? 'correct' : 'incorrect'}`}>
                {result.isCorrect ? 'Correct' : 'Incorrect'}
              </p>
              {renderCorrectAnswer()}
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
              {question.comparisonTable ? (
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
              ) : null}
              <p className="small-note">Concept summary: {question.conceptSummary}</p>
            </div>
          ) : null}
        </>
      ) : (
        <p>Generate a question to start.</p>
      )}
    </div>
  )
}
