# CMPT 201 Exam Trainer

Small local-first React + Vite + TypeScript study app for post-midterm SFU CMPT 201 systems programming practice.

## What it includes

- Single-page app with 4 tabs:
  - Page Replacement (FIFO, LRU)
  - Address Translation
  - Concurrency Debug
  - Code Output Prediction
- Study loop per tab:
  1. Generate Question
  2. Enter answer
  3. Check Answer
  4. See correctness, correct answer, and explanation
- No backend, database, auth, analytics, or external APIs.

## Local setup

```bash
npm install
npm run dev
```

Build check:

```bash
npm run build
```

## Project structure

- `src/components` - shared UI parts (`TabNav`)
- `src/features/pageReplacement` - question generation + FIFO/LRU solver + tab UI
- `src/features/addressTranslation` - translation generator/solver + tab UI
- `src/features/concurrencyDebug` - curated concurrency question bank + checker
- `src/features/codePrediction` - curated code prediction question bank + checker
- `src/lib` - small shared utilities

## Adding more questions later

- Concurrency questions: edit `src/features/concurrencyDebug/questions.ts`
- Code prediction questions: edit `src/features/codePrediction/questions.ts`
- For algorithmic tabs, add/adjust generation logic in:
  - `src/features/pageReplacement/engine.ts`
  - `src/features/addressTranslation/engine.ts`
