import type { ComponentType } from 'react'

export type UnitId =
  | 'tour-computer-systems'
  | 'sleep'
  | 'fork-exec'
  | 'wait-errno'
  | 'signals'
  | 'scheduling'
  | 'memory-management'
  | 'virtual-memory'
  | 'threads'
  | 'sync-mutex'
  | 'sync-patterns'
  | 'file-io'
  | 'filesystems'
  | 'networking-sockets'
  | 'networking-af-inet'
  | 'networking-multiple-clients'
  | 'ipc-pipes'
  | 'ipc-shared-memory'
  | 'crypto-algorithms'
  | 'crypto-applications'

export type SubtopicId = string

export type QuestionModule = ComponentType

export type UnitOption = {
  id: UnitId
  label: string
  implemented: boolean
  questionCount?: number | 'infinity'
}

export const UNIT_OPTIONS: UnitOption[] = [
  { id: 'tour-computer-systems', label: 'Tour of Computer Systems', implemented: false },
  { id: 'sleep', label: 'sleep()', implemented: false },
  { id: 'fork-exec', label: 'fork() and exec()', implemented: true, questionCount: 4 },
  { id: 'wait-errno', label: 'wait() and errno', implemented: true, questionCount: 2 },
  { id: 'signals', label: 'Signals', implemented: false },
  { id: 'scheduling', label: 'Scheduling', implemented: true, questionCount: 'infinity' },
  { id: 'memory-management', label: 'Memory Management', implemented: false },
  {
    id: 'virtual-memory',
    label: 'Virtual Memory',
    implemented: true,
    questionCount: 'infinity',
  },
  { id: 'threads', label: 'Threads', implemented: true, questionCount: 12 },
  { id: 'sync-mutex', label: 'Synchronization: Mutex', implemented: true, questionCount: 19 },
  { id: 'sync-patterns', label: 'Synchronization: Patterns', implemented: true, questionCount: 20 },
  { id: 'file-io', label: 'File I/O: Calls', implemented: true, questionCount: 12 },
  { id: 'filesystems', label: 'File I/O: File Systems', implemented: true, questionCount: 12 },
  { id: 'networking-sockets', label: 'Networking: Sockets', implemented: true, questionCount: 10 },
  { id: 'networking-af-inet', label: 'Networking: AF_INET', implemented: true, questionCount: 10 },
  {
    id: 'networking-multiple-clients',
    label: 'Networking: Multiple Clients',
    implemented: true,
    questionCount: 9,
  },
  { id: 'ipc-pipes', label: 'IPC: Pipes', implemented: true, questionCount: 3 },
  { id: 'ipc-shared-memory', label: 'IPC: Shared Memory', implemented: false },
  { id: 'crypto-algorithms', label: 'Cryptography: Algorithms', implemented: false },
  { id: 'crypto-applications', label: 'Cryptography: Applications', implemented: false },
]
