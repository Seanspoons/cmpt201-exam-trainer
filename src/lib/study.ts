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
