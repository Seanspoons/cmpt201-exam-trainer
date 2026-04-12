import { randomPick } from '../../lib/random'
import type { NetworkingQuestion } from '../networkingShared/networkingDrills'

const EVERYTHING_IS_A_FILE_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'fs-everything-file-scope',
    kind: 'mcq',
    prompt: 'In UNIX, which resources are commonly accessed with file-like I/O APIs?',
    options: [
      'Regular files, devices, and many kernel/proc interfaces',
      'Only regular files on disk',
      'Only sockets and pipes, not files',
      'Only /dev, never /proc or /sys',
    ],
    correctOption: 0,
    explanationSteps: [
      'UNIX exposes many resources through file-style abstractions.',
      '/proc, /sys, and /dev all participate in file-style access patterns.',
      'The model is broader than ordinary disk files.',
    ],
    conceptSummary: '“Everything is a file” means many system resources share file I/O style access.',
  },
  {
    id: 'fs-proc-sys-purpose',
    kind: 'match',
    prompt: 'Match each path family to its typical purpose.',
    pairs: [
      { left: '/proc', right: 'Process and kernel runtime information' },
      { left: '/sys', right: 'Kernel/device model and system attributes' },
      { left: '/dev', right: 'Device files and virtual devices' },
    ],
    explanationSteps: [
      '/proc is process/runtime state exposure.',
      '/sys exposes kernel and device attributes.',
      '/dev provides device nodes such as disks, terminals, and virtual devices.',
    ],
    conceptSummary: 'Know /proc vs /sys vs /dev roles for conceptual exam questions.',
  },
]

const STD_FD_AND_DEVICE_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'fs-stdio-fd-012',
    kind: 'mcq',
    prompt: 'Which mapping of standard file descriptors is correct?',
    options: [
      '0=stdin, 1=stdout, 2=stderr',
      '0=stdout, 1=stderr, 2=stdin',
      '0=stdin, 1=stderr, 2=stdout',
      '0=stderr, 1=stdin, 2=stdout',
    ],
    correctOption: 0,
    explanationSteps: [
      'UNIX reserves fd 0,1,2 for standard streams.',
      'Many programs assume these descriptors exist at startup.',
      'stderr is fd 2.',
    ],
    conceptSummary: 'Standard descriptors are fixed as 0/1/2 for stdin/stdout/stderr.',
  },
  {
    id: 'fs-dev-null-zero',
    kind: 'mcq',
    prompt: 'Which statement about /dev/null and /dev/zero is correct?',
    options: [
      '/dev/null discards writes; /dev/zero supplies zero bytes on reads',
      '/dev/null supplies zeros; /dev/zero discards writes',
      'Both are normal disk files with persisted data',
      'Both are network sockets',
    ],
    correctOption: 0,
    explanationSteps: [
      '/dev/null behaves like a sink for output.',
      '/dev/zero provides a stream of zero-valued bytes.',
      'Both are virtual device files under /dev.',
    ],
    conceptSummary: 'Virtual device files provide special behavior through normal file APIs.',
  },
]

const PARTITIONS_AND_TREES_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'fs-partition-tree-view',
    kind: 'text',
    prompt:
      'How do partitions/filesystems relate to what users see in the path tree?',
    requiredConcepts: [
      { label: 'Partitions hold filesystems', keywords: ['partition', 'filesystem on partition'] },
      { label: 'Single tree rooted at /', keywords: ['single tree', 'rooted at /', 'one directory tree'] },
      { label: 'Mount combines them', keywords: ['mount', 'mounted', 'attach'] },
    ],
    answerDisplay:
      'Partitions typically hold filesystems, and mounting merges them into one apparent tree rooted at /.',
    explanationSteps: [
      'Storage is often split into partitions.',
      'A partition commonly contains one filesystem.',
      'Mounting attaches filesystems into directories so users see one tree rooted at /.',
    ],
    conceptSummary: 'Underlying partitions differ from the unified mounted namespace users browse.',
  },
]

const INODE_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'fs-inode-metadata',
    kind: 'mcq',
    prompt: 'Which statement about inodes is correct?',
    options: [
      'An inode stores metadata; names live in directory entries',
      'An inode stores full pathname and parent directories',
      'An inode is only used for symbolic links',
      'An inode is the same thing as a mount point',
    ],
    correctOption: 0,
    explanationSteps: [
      'Inodes store metadata such as mode, ownership, times, and block references.',
      'Directory entries map a filename to an inode number.',
      'Filename itself is not stored in inode metadata.',
    ],
    conceptSummary: 'Distinguish filename/directory entry from inode metadata.',
  },
  {
    id: 'fs-stat-lstat-fstat',
    kind: 'mcq',
    prompt:
      'Which function is commonly used to inspect metadata of a pathname target (following symlinks)?',
    options: ['stat()', 'mount()', 'unlink()', 'execve()'],
    correctOption: 0,
    explanationSteps: [
      'stat() fetches metadata for a path target (typically following symlinks).',
      'lstat() inspects link metadata itself if path is a symlink.',
      'fstat() gets metadata from an already-open file descriptor.',
    ],
    conceptSummary: 'Use stat/lstat/fstat for metadata inspection scenarios.',
    comparisonTable: {
      headers: ['Function', 'Typical Use'],
      rows: [
        ['stat(path)', 'Metadata for path target'],
        ['lstat(path)', 'Metadata for symlink itself'],
        ['fstat(fd)', 'Metadata for open descriptor'],
      ],
    },
  },
]

const HARD_LINK_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'fs-hard-link-definition',
    kind: 'text',
    prompt: 'What is a hard link?',
    requiredConcepts: [
      { label: 'Same inode/same file', keywords: ['same inode', 'same file', 'same data'] },
      { label: 'Another directory entry/name', keywords: ['directory entry', 'another name', 'additional name'] },
    ],
    answerDisplay:
      'A hard link is another directory entry (name) that refers to the same inode/file.',
    explanationSteps: [
      'Hard links do not create a second copy of file data.',
      'Multiple names can reference the same inode.',
      'Removing one name does not remove data if other links/open references remain.',
    ],
    conceptSummary: 'Hard links are additional names for the same inode.',
  },
  {
    id: 'fs-hard-link-limits',
    kind: 'mcq',
    prompt: 'Which hard-link limitation is generally true?',
    options: [
      'Hard links usually cannot cross filesystems and cannot hard-link directories',
      'Hard links can cross filesystems freely and are preferred for directories',
      'Hard links always create new inode numbers',
      'Hard links are path strings stored in separate files',
    ],
    correctOption: 0,
    explanationSteps: [
      'Hard links reference inode identity inside one filesystem.',
      'Directory hard links are generally forbidden to avoid tree/cycle issues.',
      'Cross-filesystem hard links are not generally supported.',
    ],
    conceptSummary: 'Hard links are inode-based and constrained by filesystem boundaries/rules.',
  },
]

const SOFT_LINK_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'fs-symlink-definition',
    kind: 'text',
    prompt: 'What is a symbolic link (soft link)?',
    requiredConcepts: [
      { label: 'Separate file/inode', keywords: ['separate file', 'own inode', 'independent file'] },
      { label: 'Stores target path', keywords: ['stores path', 'points to path', 'target path'] },
      { label: 'Can dangle if target removed', keywords: ['dangling', 'broken link', 'target deleted'] },
    ],
    answerDisplay:
      'A symlink is a separate file that stores a path to a target; if target is removed it can become dangling.',
    explanationSteps: [
      'Symlink is not the same inode as its target.',
      'Its content is a pathname reference.',
      'If referenced target disappears, the symlink remains but no longer resolves.',
    ],
    conceptSummary: 'Symlink stores path indirection, not shared inode identity.',
  },
]

const LINK_COMPARISON_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'fs-hard-vs-soft-match',
    kind: 'match',
    prompt: 'Match each link property to hard link or symlink behavior.',
    pairs: [
      { left: 'Same inode as original file', right: 'Hard link' },
      { left: 'Can cross filesystems and point to directories', right: 'Symlink' },
      { left: 'Can become dangling when target is removed', right: 'Symlink' },
    ],
    explanationSteps: [
      'Hard links are inode aliases in same filesystem.',
      'Symlinks are path-based references and can cross filesystem boundaries.',
      'Removing symlink target can leave dangling path references.',
    ],
    conceptSummary: 'Hard links are inode aliases; symlinks are path-based files.',
    comparisonTable: {
      headers: ['Property', 'Hard Link', 'Symlink'],
      rows: [
        ['Refers to same inode', 'Yes', 'No'],
        ['Cross-filesystem', 'Generally no', 'Yes'],
        ['Can dangle', 'No (as concept)', 'Yes'],
      ],
    },
  },
]

const VFS_AND_MOUNT_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'fs-vfs-mountpoint',
    kind: 'text',
    prompt: 'What is a mount point, and why does VFS matter for mounting?',
    requiredConcepts: [
      { label: 'Mount point is directory', keywords: ['directory', 'path in tree', 'target directory'] },
      { label: 'Attach filesystem there', keywords: ['attach filesystem', 'mounted there', 'mount attaches'] },
      { label: 'VFS unified interface', keywords: ['vfs', 'common interface', 'uniform interface'] },
    ],
    answerDisplay:
      'A mount point is a directory where another filesystem is attached; VFS provides a common kernel interface so different filesystems appear as one tree.',
    explanationSteps: [
      'mount attaches a filesystem at a directory.',
      'That directory is the mount point.',
      'VFS lets ext4/xfs/procfs/etc. present consistent file operations to userspace.',
    ],
    conceptSummary: 'VFS enables one unified namespace over many filesystem implementations.',
  },
]

export function generateEverythingIsAFileQuestion(): NetworkingQuestion {
  return randomPick(EVERYTHING_IS_A_FILE_QUESTIONS)
}

export function generateStdFdAndDeviceQuestion(): NetworkingQuestion {
  return randomPick(STD_FD_AND_DEVICE_QUESTIONS)
}

export function generatePartitionsAndTreesQuestion(): NetworkingQuestion {
  return randomPick(PARTITIONS_AND_TREES_QUESTIONS)
}

export function generateInodeQuestion(): NetworkingQuestion {
  return randomPick(INODE_QUESTIONS)
}

export function generateHardLinkQuestion(): NetworkingQuestion {
  return randomPick(HARD_LINK_QUESTIONS)
}

export function generateSoftLinkQuestion(): NetworkingQuestion {
  return randomPick(SOFT_LINK_QUESTIONS)
}

export function generateVfsAndMountQuestion(): NetworkingQuestion {
  return randomPick(VFS_AND_MOUNT_QUESTIONS)
}

export function generateLinkComparisonQuestion(): NetworkingQuestion {
  return randomPick(LINK_COMPARISON_QUESTIONS)
}

export const FILE_SYSTEMS_QUESTION_COUNT = 12

