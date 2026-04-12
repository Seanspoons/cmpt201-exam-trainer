import { UnitScaffold } from '../../components/UnitScaffold'

export function CryptoApplicationsUnit() {
  return (
    <UnitScaffold
      unitLabel="Cryptography: Applications"
      subtopics={[
        {
          id: 'crypto-tls-basics',
          label: 'TLS Basics',
          plannedDrills: ['Identify confidentiality vs integrity guarantees', 'Trace high-level handshake goals'],
        },
        {
          id: 'crypto-authentication',
          label: 'Authentication',
          plannedDrills: ['Choose password hashing vs encryption correctly', 'Spot insecure token handling patterns'],
        },
      ]}
    />
  )
}
