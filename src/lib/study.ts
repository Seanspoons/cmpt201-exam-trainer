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
}

export const UNIT_OPTIONS: UnitOption[] = [
  { id: 'tour-computer-systems', label: 'Tour of Computer Systems' },
  { id: 'sleep', label: 'sleep()' },
  { id: 'fork-exec', label: 'fork() and exec()' },
  { id: 'wait-errno', label: 'wait() and errno' },
  { id: 'signals', label: 'Signals' },
  { id: 'scheduling', label: 'Scheduling' },
  { id: 'memory-management', label: 'Memory Management' },
  { id: 'virtual-memory', label: 'Virtual Memory' },
  { id: 'threads', label: 'Threads' },
  { id: 'sync-mutex', label: 'Synchronization: Mutex' },
  { id: 'sync-patterns', label: 'Synchronization: Patterns' },
  { id: 'file-io', label: 'File I/O' },
  { id: 'filesystems', label: 'Filesystems' },
  { id: 'networking-sockets', label: 'Networking: Sockets' },
  { id: 'networking-af-inet', label: 'Networking: AF_INET' },
  { id: 'networking-multiple-clients', label: 'Networking: Multiple Clients' },
  { id: 'ipc-pipes', label: 'IPC: Pipes' },
  { id: 'ipc-shared-memory', label: 'IPC: Shared Memory' },
  { id: 'crypto-algorithms', label: 'Cryptography: Algorithms' },
  { id: 'crypto-applications', label: 'Cryptography: Applications' },
]
