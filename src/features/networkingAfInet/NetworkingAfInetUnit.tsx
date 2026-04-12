import { UnitScaffold } from '../../components/UnitScaffold'
import { NetworkingDrillPractice } from '../networkingShared/networkingDrills'
import {
  generateAfInetByteOrderQuestion,
  generateAfInetIpv4Question,
  generateAfInetSendRecvQuestion,
  generateAfInetSpecialAddressQuestion,
  generateAfInetStructureQuestion,
} from './questions'

export function NetworkingAfInetUnit() {
  return (
    <UnitScaffold
      unitLabel="Networking: AF_INET"
      subtopics={[
        {
          id: 'sockaddr-in-structure',
          label: 'sockaddr_in Structure',
          render: () => (
            <NetworkingDrillPractice
              key="afinet-struct"
              title="Networking: AF_INET > sockaddr_in Structure"
              generateQuestion={generateAfInetStructureQuestion}
            />
          ),
        },
        {
          id: 'ipv4-address-handling',
          label: 'IPv4 Address Handling',
          render: () => (
            <NetworkingDrillPractice
              key="afinet-ipv4"
              title="Networking: AF_INET > IPv4 Address Handling"
              generateQuestion={generateAfInetIpv4Question}
            />
          ),
        },
        {
          id: 'ports-special-addresses',
          label: 'Ports and Special Addresses',
          render: () => (
            <NetworkingDrillPractice
              key="afinet-special"
              title="Networking: AF_INET > Ports and Special Addresses"
              generateQuestion={generateAfInetSpecialAddressQuestion}
            />
          ),
        },
        {
          id: 'network-byte-order',
          label: 'Network Byte Order',
          render: () => (
            <NetworkingDrillPractice
              key="afinet-byteorder"
              title="Networking: AF_INET > Network Byte Order"
              generateQuestion={generateAfInetByteOrderQuestion}
            />
          ),
        },
        {
          id: 'send-recv-basics',
          label: 'send()/recv() Basics',
          render: () => (
            <NetworkingDrillPractice
              key="afinet-sendrecv"
              title="Networking: AF_INET > send()/recv() Basics"
              generateQuestion={generateAfInetSendRecvQuestion}
            />
          ),
        },
      ]}
    />
  )
}
