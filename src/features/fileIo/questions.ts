import { randomPick } from '../../lib/random'
import type { NetworkingQuestion } from '../networkingShared/networkingDrills'

const BASIC_SYSCALL_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'fileio-open-append',
    kind: 'mcq',
    prompt: 'What does O_APPEND do when used with open()?',
    options: [
      'Each write is appended to the end of the file',
      'It truncates the file before every write',
      'It prevents write() from changing file offset',
      'It converts the file descriptor into FILE*',
    ],
    correctOption: 0,
    explanationSteps: [
      'O_APPEND changes write positioning behavior.',
      'Each write is performed at file end by the kernel.',
      'This is useful when multiple writers append log records.',
    ],
    conceptSummary: 'O_APPEND forces writes to the file end.',
  },
]

const OFFSET_AND_LSEEK_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'fileio-offset-char',
    kind: 'text',
    prompt:
      'File content is "Hello!", current offset is 4, then read(fd, buf, 1) runs. What character is read?',
    requiredConcepts: [{ label: 'Character o', keywords: ['o', "'o'", '"o"'] }],
    answerDisplay: "'o'",
    explanationSteps: [
      'Offsets are zero-based byte indexes.',
      'For "Hello!", index 4 is the letter o.',
      'Reading 1 byte from offset 4 returns that byte.',
    ],
    conceptSummary: 'read starts from current offset and advances after reading.',
  },
  {
    id: 'fileio-lseek-end',
    kind: 'text',
    prompt:
      'Given lseek(fd, -1, SEEK_END); read(fd, buf, 1); what byte is read from a non-empty file?',
    requiredConcepts: [
      { label: 'Last character/byte', keywords: ['last', 'final', 'end byte'] },
    ],
    answerDisplay: 'The last byte/character of the file.',
    explanationSteps: [
      'SEEK_END starts from file end.',
      'Offset -1 moves to the final byte position.',
      'A 1-byte read returns that final byte.',
    ],
    conceptSummary: 'lseek manually positions file offset before read/write.',
  },
  {
    id: 'fileio-offset-advances',
    kind: 'text',
    prompt: 'What happens to file offset after a successful read() or write()?',
    requiredConcepts: [
      { label: 'Offset advances', keywords: ['advance', 'moves forward', 'increments'] },
      { label: 'By transferred byte count', keywords: ['bytes read', 'bytes written', 'n bytes'] },
    ],
    answerDisplay: 'It advances forward by the number of bytes actually read/written.',
    explanationSteps: [
      'Kernel tracks current file position per open file description.',
      'After transfer, offset updates automatically.',
      'The change amount is bytes actually transferred, not requested count.',
    ],
    conceptSummary: 'Offset movement is automatic on successful read/write.',
  },
]

const READ_WRITE_BEHAVIOR_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'fileio-read-partial',
    kind: 'text',
    prompt:
      'A call read(fd, buf, 10) runs when only 4 bytes are currently available. What can read() return?',
    requiredConcepts: [
      { label: 'Returns 4', keywords: ['4', 'four bytes'] },
      { label: 'Can return fewer than requested', keywords: ['less than requested', 'partial read', 'fewer bytes'] },
    ],
    answerDisplay: '4 (read returns number of bytes read, which can be less than requested).',
    explanationSteps: [
      'read returns the number of bytes actually copied into the buffer.',
      'Requested count is a maximum, not a guarantee.',
      'When fewer bytes are available, a short read is valid.',
    ],
    conceptSummary: 'read may return short counts.',
  },
  {
    id: 'fileio-write-partial',
    kind: 'mcq',
    prompt: 'Can write(fd, buf, n) return less than n?',
    options: [
      'Yes, partial writes are possible',
      'No, write always writes exactly n bytes',
      'Only if n is 0',
      'Only when using FILE*',
    ],
    correctOption: 0,
    explanationSteps: [
      'write returns bytes actually written.',
      'Short writes can happen and should be handled in loops.',
      'Correct code checks return value and writes remaining bytes.',
    ],
    conceptSummary: 'write may be partial; robust code retries remaining bytes.',
  },
]

const BUFFERING_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'fileio-fprintf-buffered',
    kind: 'text',
    prompt:
      'What may be true after fprintf(file, "Hello"); sleep(10); if fflush/fclose is not called yet?',
    requiredConcepts: [
      { label: 'Data may still be buffered', keywords: ['buffered', 'buffer', 'not flushed'] },
      { label: 'Not guaranteed in file yet', keywords: ['not written yet', 'may be empty', 'not on disk yet'] },
    ],
    answerDisplay: 'Data may still be in stdio buffer and not yet visible in the file.',
    explanationSteps: [
      'fprintf writes to stdio buffer first.',
      'sleep does not flush stdio.',
      'Flush happens on buffer-full, fflush, fclose, or normal exit.',
    ],
    conceptSummary: 'fprintf is buffered; write is direct syscall path.',
  },
  {
    id: 'fileio-fflush',
    kind: 'mcq',
    prompt: 'Which call forces buffered stdio output to be written now?',
    options: ['fflush(stream)', 'sleep(1)', 'lseek(fd, 0, SEEK_CUR)', 'read(fd, buf, 1)'],
    correctOption: 0,
    explanationSteps: [
      'fflush flushes user-space stdio buffers to kernel.',
      'sleep does not force output.',
      'lseek/read do not flush a stdio write buffer.',
    ],
    conceptSummary: 'Use fflush/fclose to force stdio buffered output.',
  },
  {
    id: 'fileio-mixed-write-fprintf',
    kind: 'text',
    prompt:
      'Potential issue: write(fd, "A", 1); fprintf(file, "B"); (same underlying file). What bug may appear?',
    requiredConcepts: [
      { label: 'Unexpected ordering', keywords: ['order', 'ordering', 'out of order'] },
      { label: 'Buffering mismatch', keywords: ['buffered', 'fprintf buffer', 'mixing', 'stdio and syscall'] },
    ],
    answerDisplay:
      'Unexpected output ordering can occur because write is immediate while fprintf is buffered.',
    explanationSteps: [
      'write goes directly through kernel syscall path.',
      'fprintf may delay data in stdio buffer.',
      'Mixing APIs on same file can produce surprising interleavings unless carefully synchronized/flushed.',
    ],
    conceptSummary: 'Mixing stdio and raw fd I/O can cause tricky ordering bugs.',
  },
]

const FILE_DESCRIPTOR_VS_STREAM_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'fileio-fd-vs-file-star',
    kind: 'text',
    prompt: 'What is the core difference between a file descriptor (int) and FILE*?',
    requiredConcepts: [
      { label: 'fd is integer kernel handle', keywords: ['int', 'file descriptor', 'kernel handle', 'fd'] },
      { label: 'FILE* is buffered stdio wrapper', keywords: ['buffered', 'stdio', 'wrapper', 'file*'] },
    ],
    answerDisplay: 'fd is a low-level integer descriptor; FILE* is a buffered stdio stream wrapper around it.',
    explanationSteps: [
      'fd is used by syscalls like read/write.',
      'FILE* adds stdio buffering and formatting functions like fprintf/fscanf.',
      'They can refer to the same underlying file but have different behavior layers.',
    ],
    conceptSummary: 'FILE* adds userspace buffering/formatting around fd-based I/O.',
  },
]

const EOF_AND_PARTIAL_READS_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'fileio-read-eof',
    kind: 'text',
    prompt: 'What does read() return at EOF on a regular file?',
    requiredConcepts: [{ label: 'Returns 0', keywords: ['0', 'zero'] }],
    answerDisplay: '0',
    explanationSteps: [
      'EOF means no more bytes remain to read.',
      'At EOF, read returns 0 bytes read.',
      'Negative values indicate errors, not EOF.',
    ],
    conceptSummary: 'EOF is signaled by read returning 0.',
  },
]

const BLOCKING_NONBLOCKING_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'fileio-nonblocking-read',
    kind: 'text',
    prompt:
      'For a non-blocking descriptor with no data available, what does read() do?',
    requiredConcepts: [
      { label: 'Returns -1/error', keywords: ['-1', 'error'] },
      { label: 'EAGAIN or EWOULDBLOCK', keywords: ['eagain', 'ewouldblock'] },
    ],
    answerDisplay: 'read returns -1 and sets errno to EAGAIN/EWOULDBLOCK.',
    explanationSteps: [
      'Blocking mode waits for data.',
      'Non-blocking mode returns immediately when data is unavailable.',
      'errno indicates retry-later condition (EAGAIN/EWOULDBLOCK).',
    ],
    conceptSummary: 'Non-blocking I/O reports not-ready state via error return.',
  },
]

export function generateFileIoBasicSyscallsQuestion(): NetworkingQuestion {
  return randomPick(BASIC_SYSCALL_QUESTIONS)
}

export function generateFileIoOffsetLseekQuestion(): NetworkingQuestion {
  return randomPick(OFFSET_AND_LSEEK_QUESTIONS)
}

export function generateFileIoReadWriteBehaviorQuestion(): NetworkingQuestion {
  return randomPick(READ_WRITE_BEHAVIOR_QUESTIONS)
}

export function generateFileIoBufferingQuestion(): NetworkingQuestion {
  return randomPick(BUFFERING_QUESTIONS)
}

export function generateFileIoFdVsStreamQuestion(): NetworkingQuestion {
  return randomPick(FILE_DESCRIPTOR_VS_STREAM_QUESTIONS)
}

export function generateFileIoEofPartialQuestion(): NetworkingQuestion {
  return randomPick(EOF_AND_PARTIAL_READS_QUESTIONS)
}

export function generateFileIoBlockingQuestion(): NetworkingQuestion {
  return randomPick(BLOCKING_NONBLOCKING_QUESTIONS)
}

