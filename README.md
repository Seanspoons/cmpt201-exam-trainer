# CMPT 201 Exam Trainer

Lightweight React + Vite + TypeScript study app for SFU CMPT 201 exam practice across pre-midterm and post-midterm units.

## Overview

The app is organized into 20 lecture-aligned units:

- `Tour of Computer Systems`
- `sleep()`
- `fork() and exec()`
- `wait() and errno`
- `Signals`
- `Scheduling`
- `Memory Management`
- `Virtual Memory`
- `Threads`
- `Synchronization: Mutex`
- `Synchronization: Patterns`
- `File I/O`
- `Filesystems`
- `Networking: Sockets`
- `Networking: AF_INET`
- `Networking: Multiple Clients`
- `IPC: Pipes`
- `IPC: Shared Memory`
- `Cryptography: Algorithms`
- `Cryptography: Applications`

Implemented drills currently include:

- Virtual Memory:
  - Page Replacement (`FIFO`, `LRU`, `Second Chance`)
  - Address Translation
- fork/exec/wait/errno output tracing drills
- File I/O buffering and IPC pipes tracing drills
- Concurrency debug drills (used under `Synchronization: Patterns`)

All other subtopics are scaffolded with consistent placeholders and planned drill notes.

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

- Process/File I/O/IPC tracing templates:
  - `src/features/codePrediction/questions.ts`
- Synchronization drill templates:
  - `src/features/concurrencyDebug/questions.ts`
- Virtual memory logic:
  - `src/features/pageReplacement/engine.ts`
  - `src/features/addressTranslation/engine.ts`

For scaffolded units/subtopics, plug in a module that follows the same study loop used by existing implemented tabs.
