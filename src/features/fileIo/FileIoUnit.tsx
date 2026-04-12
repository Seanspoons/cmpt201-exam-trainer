import { UnitScaffold } from '../../components/UnitScaffold'
import { NetworkingDrillPractice } from '../networkingShared/networkingDrills'
import {
  generateFileIoBasicSyscallsQuestion,
  generateFileIoBlockingQuestion,
  generateFileIoBufferingQuestion,
  generateFileIoEofPartialQuestion,
  generateFileIoFdVsStreamQuestion,
  generateFileIoOffsetLseekQuestion,
  generateFileIoReadWriteBehaviorQuestion,
} from './questions'

export function FileIoUnit() {
  return (
    <UnitScaffold
      unitLabel="File I/O: Calls"
      subtopics={[
        {
          id: 'fileio-basic-syscalls',
          label: 'Basic Syscalls (open/read/write/close)',
          render: () => (
            <NetworkingDrillPractice
              key="file-io-basic-syscalls"
              title="File I/O: Calls > Basic Syscalls"
              generateQuestion={generateFileIoBasicSyscallsQuestion}
            />
          ),
        },
        {
          id: 'fileio-offset-lseek',
          label: 'File Offset and lseek',
          render: () => (
            <NetworkingDrillPractice
              key="file-io-offset-lseek"
              title="File I/O: Calls > File Offset and lseek"
              generateQuestion={generateFileIoOffsetLseekQuestion}
            />
          ),
        },
        {
          id: 'fileio-read-write-behavior',
          label: 'read() and write() behavior',
          render: () => (
            <NetworkingDrillPractice
              key="file-io-read-write-behavior"
              title="File I/O: Calls > read() and write() behavior"
              generateQuestion={generateFileIoReadWriteBehaviorQuestion}
            />
          ),
        },
        {
          id: 'fileio-buffering',
          label: 'Buffering (write vs fprintf)',
          render: () => (
            <NetworkingDrillPractice
              key="file-io-buffering"
              title="File I/O: Calls > Buffering"
              generateQuestion={generateFileIoBufferingQuestion}
            />
          ),
        },
        {
          id: 'fileio-fd-vs-file-star',
          label: 'File Descriptor vs FILE*',
          render: () => (
            <NetworkingDrillPractice
              key="file-io-fd-vs-file-star"
              title="File I/O: Calls > File Descriptor vs FILE*"
              generateQuestion={generateFileIoFdVsStreamQuestion}
            />
          ),
        },
        {
          id: 'fileio-eof-and-partial',
          label: 'EOF and partial reads',
          render: () => (
            <NetworkingDrillPractice
              key="file-io-eof-and-partial"
              title="File I/O: Calls > EOF and partial reads"
              generateQuestion={generateFileIoEofPartialQuestion}
            />
          ),
        },
        {
          id: 'fileio-blocking-nonblocking',
          label: 'Blocking vs non-blocking (light)',
          render: () => (
            <NetworkingDrillPractice
              key="file-io-blocking-nonblocking"
              title="File I/O: Calls > Blocking vs non-blocking"
              generateQuestion={generateFileIoBlockingQuestion}
            />
          ),
        },
      ]}
    />
  )
}
