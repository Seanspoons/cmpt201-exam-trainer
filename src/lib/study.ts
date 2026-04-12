import type { ComponentType } from 'react'

export type UnitId =
  | 'processes'
  | 'virtual-memory'
  | 'synchronization'
  | 'file-io-ipc'
  | 'networking'
  | 'cryptography'

export type SubtopicId = string

export type QuestionModule = ComponentType

export type UnitOption = {
  id: UnitId
  label: string
}

export const UNIT_OPTIONS: UnitOption[] = [
  { id: 'processes', label: 'Processes' },
  { id: 'virtual-memory', label: 'Virtual Memory' },
  { id: 'synchronization', label: 'Synchronization' },
  { id: 'file-io-ipc', label: 'File I/O and IPC' },
  { id: 'networking', label: 'Networking' },
  { id: 'cryptography', label: 'Cryptography' },
]
