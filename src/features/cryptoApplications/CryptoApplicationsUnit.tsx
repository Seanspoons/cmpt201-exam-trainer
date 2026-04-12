import { UnitScaffold } from '../../components/UnitScaffold'
import { NetworkingDrillPractice } from '../networkingShared/networkingDrills'
import {
  generateCertificatesQuestion,
  generateChainOfTrustQuestion,
  generateDigitalSignatureQuestion,
  generateHashCollisionQuestion,
  generateHashingSaltingQuestion,
  generateHttpsTrustQuestion,
  generatePasswordStorageQuestion,
} from './questions'

export function CryptoApplicationsUnit() {
  return (
    <UnitScaffold
      unitLabel="Cryptography: Applications"
      subtopics={[
        {
          id: 'crypto-app-password-storage',
          label: 'Password Storage',
          render: () => (
            <NetworkingDrillPractice
              key="crypto-app-password-storage"
              title="Cryptography: Applications > Password Storage"
              generateQuestion={generatePasswordStorageQuestion}
            />
          ),
        },
        {
          id: 'crypto-app-hashing-salting',
          label: 'Hashing and Salting',
          render: () => (
            <NetworkingDrillPractice
              key="crypto-app-hashing-salting"
              title="Cryptography: Applications > Hashing and Salting"
              generateQuestion={generateHashingSaltingQuestion}
            />
          ),
        },
        {
          id: 'crypto-app-digital-signatures',
          label: 'Digital Signatures',
          render: () => (
            <NetworkingDrillPractice
              key="crypto-app-digital-signatures"
              title="Cryptography: Applications > Digital Signatures"
              generateQuestion={generateDigitalSignatureQuestion}
            />
          ),
        },
        {
          id: 'crypto-app-digital-certificates',
          label: 'Digital Certificates',
          render: () => (
            <NetworkingDrillPractice
              key="crypto-app-digital-certificates"
              title="Cryptography: Applications > Digital Certificates"
              generateQuestion={generateCertificatesQuestion}
            />
          ),
        },
        {
          id: 'crypto-app-https-trust',
          label: 'HTTPS and Trust',
          render: () => (
            <NetworkingDrillPractice
              key="crypto-app-https-trust"
              title="Cryptography: Applications > HTTPS and Trust"
              generateQuestion={generateHttpsTrustQuestion}
            />
          ),
        },
        {
          id: 'crypto-app-chain-of-trust',
          label: 'Chain of Trust',
          render: () => (
            <NetworkingDrillPractice
              key="crypto-app-chain-of-trust"
              title="Cryptography: Applications > Chain of Trust"
              generateQuestion={generateChainOfTrustQuestion}
            />
          ),
        },
        {
          id: 'crypto-app-hash-collisions',
          label: 'Hash Collisions / Birthday Attack',
          render: () => (
            <NetworkingDrillPractice
              key="crypto-app-hash-collisions"
              title="Cryptography: Applications > Hash Collisions / Birthday Attack"
              generateQuestion={generateHashCollisionQuestion}
            />
          ),
        },
      ]}
    />
  )
}
