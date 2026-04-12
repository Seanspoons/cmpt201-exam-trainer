import { UnitScaffold } from '../../components/UnitScaffold'

export function CryptoAlgorithmsUnit() {
  return (
    <UnitScaffold
      unitLabel="Cryptography: Algorithms"
      subtopics={[
        {
          id: 'crypto-symmetric-vs-asymmetric',
          label: 'Symmetric vs Asymmetric',
          plannedDrills: ['Pick algorithm families by use case', 'Compare key distribution tradeoffs'],
        },
        {
          id: 'crypto-hashing',
          label: 'Hashing',
          plannedDrills: ['Reason about integrity checks', 'Differentiate hashing from encryption'],
        },
      ]}
    />
  )
}
