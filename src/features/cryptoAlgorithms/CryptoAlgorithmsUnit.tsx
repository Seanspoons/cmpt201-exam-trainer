import { UnitScaffold } from '../../components/UnitScaffold'
import { NetworkingDrillPractice } from '../networkingShared/networkingDrills'
import {
  generateAsymmetricEncryptionQuestion,
  generateCiaModelQuestion,
  generateEncryptionBasicsQuestion,
  generateHashFunctionQuestion,
  generateKeyTradeoffQuestion,
  generateSymmetricEncryptionQuestion,
} from './questions'

export function CryptoAlgorithmsUnit() {
  return (
    <UnitScaffold
      unitLabel="Cryptography: Algorithms"
      subtopics={[
        {
          id: 'crypto-cia-model',
          label: 'CIA Model',
          render: () => (
            <NetworkingDrillPractice
              key="crypto-cia-model"
              title="Cryptography: Algorithms > CIA Model"
              generateQuestion={generateCiaModelQuestion}
            />
          ),
        },
        {
          id: 'crypto-encryption-basics',
          label: 'Encryption Basics',
          render: () => (
            <NetworkingDrillPractice
              key="crypto-encryption-basics"
              title="Cryptography: Algorithms > Encryption Basics"
              generateQuestion={generateEncryptionBasicsQuestion}
            />
          ),
        },
        {
          id: 'crypto-hash-functions',
          label: 'Hash Functions',
          render: () => (
            <NetworkingDrillPractice
              key="crypto-hash-functions"
              title="Cryptography: Algorithms > Hash Functions"
              generateQuestion={generateHashFunctionQuestion}
            />
          ),
        },
        {
          id: 'crypto-symmetric-encryption',
          label: 'Symmetric Encryption (Private Key)',
          render: () => (
            <NetworkingDrillPractice
              key="crypto-symmetric-encryption"
              title="Cryptography: Algorithms > Symmetric Encryption (Private Key)"
              generateQuestion={generateSymmetricEncryptionQuestion}
            />
          ),
        },
        {
          id: 'crypto-asymmetric-encryption',
          label: 'Asymmetric Encryption (Public/Private Keys)',
          render: () => (
            <NetworkingDrillPractice
              key="crypto-asymmetric-encryption"
              title="Cryptography: Algorithms > Asymmetric Encryption (Public/Private Keys)"
              generateQuestion={generateAsymmetricEncryptionQuestion}
            />
          ),
        },
        {
          id: 'crypto-key-tradeoffs',
          label: 'Key Concepts and Tradeoffs',
          render: () => (
            <NetworkingDrillPractice
              key="crypto-key-tradeoffs"
              title="Cryptography: Algorithms > Key Concepts and Tradeoffs"
              generateQuestion={generateKeyTradeoffQuestion}
            />
          ),
        },
      ]}
    />
  )
}
