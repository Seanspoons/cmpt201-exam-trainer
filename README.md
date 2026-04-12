# CMPT 201 Exam Trainer

Lightweight React + Vite + TypeScript study app for SFU CMPT 201 post-midterm exam practice.

## Overview

The app is organized by course unit with subtopics:

- **Processes**
  - `fork()` (implemented)
  - `exec()` (implemented)
  - `wait() / zombies` (implemented)
  - `errno` (implemented)
- **Virtual Memory**
  - `Page Replacement` (implemented: FIFO, LRU, Second Chance)
  - `Address Translation` (implemented)
  - `Locality and Page Faults` (scaffolded)
- **Synchronization**
  - `Deadlock` (implemented)
  - `Mutex` (scaffolded)
  - `Condition Variables` (scaffolded)
  - `Semaphores` (scaffolded)
- **File I/O and IPC**
  - `File I/O` (implemented)
  - `Pipes` (implemented)
  - `Shared Memory` (scaffolded)
- **Networking**
  - `Sockets`, `AF_INET`, `Multiple Clients` (scaffolded)
- **Cryptography**
  - `Algorithms`, `Applications` (scaffolded)

Implemented subtopics support:
1. Generate Question
2. Enter answer
3. Check Answer
4. View correctness + step-by-step explanation

## Local Development

```bash
npm install
npm run dev
```

Build + lint:

```bash
npm run build
npm run lint
```

## GitHub Pages Deployment

This repo includes a GitHub Actions workflow at:

- `.github/workflows/deploy-pages.yml`

Behavior:

- Runs on pushes to `main`
- Installs dependencies with `npm ci`
- Builds via `npm run build`
- Publishes `dist/` to GitHub Pages using official Pages actions

Vite base path is configured for this repo name:

- `vite.config.ts` uses `/cmpt201-exam-trainer/` for build output

If deploying under a different repository name, update the `base` setting in `vite.config.ts`.

## Extending Question Templates

- Processes/File I/O/IPC tracing templates:
  - `src/features/codePrediction/questions.ts`
- Synchronization debug templates:
  - `src/features/concurrencyDebug/questions.ts`
- Virtual memory logic:
  - `src/features/pageReplacement/engine.ts`
  - `src/features/addressTranslation/engine.ts`

For scaffolded units/subtopics, plug in a module that follows the same study loop used by existing implemented tabs.
