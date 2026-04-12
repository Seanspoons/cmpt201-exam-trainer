import { UnitScaffold } from '../../components/UnitScaffold'

export function FilesystemsUnit() {
  return (
    <UnitScaffold
      unitLabel="Filesystems"
      subtopics={[
        {
          id: 'fs-paths-and-inodes',
          label: 'Paths and Inodes',
          plannedDrills: ['Map path traversal to inode lookups', 'Reason about hard links vs directories'],
        },
        {
          id: 'fs-permissions',
          label: 'Permissions',
          plannedDrills: ['Predict access outcomes from mode bits', 'Interpret permission failures'],
        },
      ]}
    />
  )
}
