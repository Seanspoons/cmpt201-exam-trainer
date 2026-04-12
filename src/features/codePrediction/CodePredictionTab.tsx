import {
  generateCodePredictionQuestion,
} from './questions'
import { CodePredictionPractice } from './CodePredictionPractice'

export function CodePredictionTab() {
  return (
    <CodePredictionPractice
      title="Code Output Prediction"
      generateQuestion={generateCodePredictionQuestion}
    />
  )
}
