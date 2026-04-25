# CMPT 201 Exam Trainer

A lightweight React + Vite + TypeScript study app for SFU CMPT 201 that provides full exam coverage across all lecture units and subtopics with interactive practice drills.

## Overview

The app is organized into 20 lecture-aligned units:

- Tour of Computer Systems
- sleep()
- fork() and exec()
- wait() and errno
- Signals
- Scheduling
- Memory Management
- Virtual Memory
- Threads
- Synchronization: Mutex
- Synchronization: Patterns
- File I/O
- Filesystems
- Networking: Sockets
- Networking: AF_INET
- Networking: Multiple Clients
- IPC: Pipes
- IPC: Shared Memory
- Cryptography: Algorithms
- Cryptography: Applications

All units and subtopics are fully implemented with interactive drills designed to mirror real exam-style questions.

## Study Experience

Each subtopic follows a consistent, repeatable study loop:

1. Generate Question
2. Enter Answer
3. Check Answer
4. View correctness
5. Review step-by-step explanation

This ensures fast repetition, immediate feedback, and focused practice across all topics.

## Implemented Drill Types

The trainer includes a wide range of drill types across the course:

- Virtual Memory
  - Page Replacement (FIFO, LRU, Second Chance)
  - Address Translation
- Process Control
  - fork / exec behavior tracing
  - wait / errno scenarios
- Signals and Scheduling concepts
- Concurrency
  - Mutex reasoning
  - Synchronization pattern debugging
- File I/O
  - Buffering behavior
  - File descriptor tracing
- Networking
  - Socket flows and multi-client reasoning
- IPC
  - Pipes and shared memory tracing
- Cryptography
  - Algorithm and application-level reasoning

All topics are implemented with structured question generation and detailed explanations.

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

## Project Structure

Key areas of the codebase:

- Code prediction drills:
  - `src/features/codePrediction/`
- Concurrency debugging drills:
  - `src/features/concurrencyDebug/`
- Virtual memory engines:
  - `src/features/pageReplacement/engine.ts`
  - `src/features/addressTranslation/engine.ts`

All other units follow the same modular structure for consistency and extensibility.

## Extending the App

To add new drills or enhance existing ones:

- Follow the existing study loop pattern
- Keep question generation deterministic or seed-based where possible
- Provide clear, step-by-step explanations
- Maintain consistency with existing UI/UX patterns

## Purpose

This project is designed to:

- Provide fast, repeatable exam practice
- Reinforce mechanical problem-solving skills
- Reduce friction compared to static slides or notes
- Simulate real exam-style thinking under time pressure
