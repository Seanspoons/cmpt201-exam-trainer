import { UnitScaffold } from '../../components/UnitScaffold'
import { NetworkingDrillPractice } from '../networkingShared/networkingDrills'
import {
  generateEverythingIsAFileQuestion,
  generateHardLinkQuestion,
  generateInodeQuestion,
  generateLinkComparisonQuestion,
  generatePartitionsAndTreesQuestion,
  generateSoftLinkQuestion,
  generateStdFdAndDeviceQuestion,
  generateVfsAndMountQuestion,
} from './questions'

export function FilesystemsUnit() {
  return (
    <UnitScaffold
      unitLabel="File I/O: File Systems"
      subtopics={[
        {
          id: 'everything-is-a-file',
          label: 'Everything is a File',
          render: () => (
            <NetworkingDrillPractice
              key="fs-everything-is-a-file"
              title="File I/O: File Systems > Everything is a File"
              generateQuestion={generateEverythingIsAFileQuestion}
            />
          ),
        },
        {
          id: 'standard-fd-device-files',
          label: 'Standard File Descriptors and Device Files',
          render: () => (
            <NetworkingDrillPractice
              key="fs-standard-fd-device-files"
              title="File I/O: File Systems > Standard FDs and Devices"
              generateQuestion={generateStdFdAndDeviceQuestion}
            />
          ),
        },
        {
          id: 'partitions-file-trees',
          label: 'Partitions and File Trees',
          render: () => (
            <NetworkingDrillPractice
              key="fs-partitions-file-trees"
              title="File I/O: File Systems > Partitions and File Trees"
              generateQuestion={generatePartitionsAndTreesQuestion}
            />
          ),
        },
        {
          id: 'inodes-metadata',
          label: 'Inodes and Metadata',
          render: () => (
            <NetworkingDrillPractice
              key="fs-inodes-metadata"
              title="File I/O: File Systems > Inodes and Metadata"
              generateQuestion={generateInodeQuestion}
            />
          ),
        },
        {
          id: 'hard-links',
          label: 'Hard Links',
          render: () => (
            <NetworkingDrillPractice
              key="fs-hard-links"
              title="File I/O: File Systems > Hard Links"
              generateQuestion={generateHardLinkQuestion}
            />
          ),
        },
        {
          id: 'soft-links',
          label: 'Soft (Symbolic) Links',
          render: () => (
            <NetworkingDrillPractice
              key="fs-soft-links"
              title="File I/O: File Systems > Soft (Symbolic) Links"
              generateQuestion={generateSoftLinkQuestion}
            />
          ),
        },
        {
          id: 'hard-vs-soft-links',
          label: 'Hard Link vs Symlink',
          render: () => (
            <NetworkingDrillPractice
              key="fs-hard-vs-soft-links"
              title="File I/O: File Systems > Hard Link vs Symlink"
              generateQuestion={generateLinkComparisonQuestion}
            />
          ),
        },
        {
          id: 'vfs-and-mounting',
          label: 'VFS and Mounting',
          render: () => (
            <NetworkingDrillPractice
              key="fs-vfs-and-mounting"
              title="File I/O: File Systems > VFS and Mounting"
              generateQuestion={generateVfsAndMountQuestion}
            />
          ),
        },
      ]}
    />
  )
}
