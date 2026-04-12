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
}

export const UNIT_OPTIONS: UnitOption[] = [
  { id: 'tour-computer-systems', label: 'Tour of Computer Systems', implemented: false },
  { id: 'sleep', label: 'sleep()', implemented: false },
  { id: 'fork-exec', label: 'fork() and exec()', implemented: true },
  { id: 'wait-errno', label: 'wait() and errno', implemented: true },
  { id: 'signals', label: 'Signals', implemented: false },
  { id: 'scheduling', label: 'Scheduling', implemented: false },
  { id: 'memory-management', label: 'Memory Management', implemented: false },
  { id: 'virtual-memory', label: 'Virtual Memory', implemented: true },
  { id: 'threads', label: 'Threads', implemented: false },
  { id: 'sync-mutex', label: 'Synchronization: Mutex', implemented: false },
  { id: 'sync-patterns', label: 'Synchronization: Patterns', implemented: true },
  { id: 'file-io', label: 'File I/O', implemented: true },
  { id: 'filesystems', label: 'Filesystems', implemented: false },
  { id: 'networking-sockets', label: 'Networking: Sockets', implemented: true },
  { id: 'networking-af-inet', label: 'Networking: AF_INET', implemented: true },
  { id: 'networking-multiple-clients', label: 'Networking: Multiple Clients', implemented: true },
  { id: 'ipc-pipes', label: 'IPC: Pipes', implemented: true },
  { id: 'ipc-shared-memory', label: 'IPC: Shared Memory', implemented: false },
  { id: 'crypto-algorithms', label: 'Cryptography: Algorithms', implemented: false },
  { id: 'crypto-applications', label: 'Cryptography: Applications', implemented: false },
]
