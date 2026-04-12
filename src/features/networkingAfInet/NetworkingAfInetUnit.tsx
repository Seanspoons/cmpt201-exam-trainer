import { UnitScaffold } from '../../components/UnitScaffold'

export function NetworkingAfInetUnit() {
  return (
    <UnitScaffold
      unitLabel="Networking: AF_INET"
      subtopics={[
        {
          id: 'afinet-addr-structs',
          label: 'Address Structures',
          plannedDrills: ['Fill sockaddr_in fields correctly', 'Convert host/network byte order'],
        },
        {
          id: 'afinet-endianness',
          label: 'Endianness',
          plannedDrills: ['Choose htons/htonl usage correctly', 'Debug wrong-port or wrong-ip issues'],
        },
      ]}
    />
  )
}
