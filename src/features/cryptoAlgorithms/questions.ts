import { randomPick } from '../../lib/random'
import type { NetworkingQuestion } from '../networkingShared/networkingDrills'

const CIA_MODEL_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'crypto-algo-cia-confidentiality',
    kind: 'mcq',
    prompt: 'Which statement best defines confidentiality in the CIA model?',
    options: [
      'Only authorized parties can read the data',
      'Data is always available with zero downtime',
      'Data has a verified timestamp',
      'Data is compressed before storage',
    ],
    correctOption: 0,
    explanationSteps: [
      'Confidentiality focuses on secrecy of information.',
      'It answers: who is allowed to see the data?',
      'Encryption is a common tool for confidentiality.',
    ],
    conceptSummary: 'CIA: confidentiality = secrecy, integrity = correctness, availability = access.',
  },
  {
    id: 'crypto-algo-cia-integrity-availability-match',
    kind: 'match',
    prompt: 'Match each scenario to the CIA property it most directly violates.',
    pairs: [
      { left: 'Attacker changes grade records', right: 'Integrity' },
      { left: 'Server is down during exam submission', right: 'Availability' },
      { left: 'Leaked private messages', right: 'Confidentiality' },
    ],
    explanationSteps: [
      'Tampering with content is an integrity failure.',
      'Service outage is an availability failure.',
      'Unauthorized disclosure is a confidentiality failure.',
    ],
    conceptSummary: 'Map attack outcome to CIA quickly in exam scenarios.',
  },
]

const ENCRYPTION_BASICS_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'crypto-algo-ciphertext-meaning',
    kind: 'mcq',
    prompt: 'What is ciphertext?',
    options: [
      'Encrypted form of plaintext',
      'A hash digest used for passwords only',
      'A public key certificate file',
      'A random nonce for IV generation',
    ],
    correctOption: 0,
    explanationSteps: [
      'Plaintext is original readable message.',
      'Encryption transforms plaintext into ciphertext.',
      'Decryption transforms ciphertext back to plaintext.',
    ],
    conceptSummary: 'Core flow: plaintext -> ciphertext -> plaintext.',
  },
  {
    id: 'crypto-algo-public-algorithm-secret-key',
    kind: 'text',
    prompt: 'Why are modern cryptographic algorithms public while keys stay secret?',
    requiredConcepts: [
      { label: 'Security from key secrecy', keywords: ['key secret', 'secret key', 'key secrecy'] },
      { label: 'Algorithm can be public/reviewed', keywords: ['public algorithm', 'review', 'audited', 'known algorithm'] },
    ],
    answerDisplay:
      'Modern cryptography assumes algorithms are public; security should depend on keeping keys secret.',
    explanationSteps: [
      'Good crypto design does not rely on hiding the algorithm.',
      'Public algorithms can be reviewed and tested by experts.',
      'The secret key is the protected component that controls access.',
    ],
    conceptSummary: 'Kerckhoffs-style idea: hide keys, not algorithms.',
  },
]

const HASH_FUNCTION_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'crypto-algo-hash-properties',
    kind: 'mcq',
    prompt: 'Which is a core property of a cryptographic hash function?',
    options: [
      'Maps arbitrary-length input to fixed-size output',
      'Requires two keys for decryption',
      'Always reversible with enough compute',
      'Provides confidentiality by itself',
    ],
    correctOption: 0,
    explanationSteps: [
      'Hashes take input of any length.',
      'Output digest length is fixed for a given hash function.',
      'Hashing is not encryption and does not directly provide secrecy.',
    ],
    conceptSummary: 'Hash = fixed-size digest, not reversible decryption.',
  },
  {
    id: 'crypto-algo-hash-one-way',
    kind: 'text',
    prompt: 'What does it mean that a hash function is one-way?',
    requiredConcepts: [
      { label: 'Easy forward compute', keywords: ['easy compute', 'fast compute', 'compute hash'] },
      { label: 'Hard reverse', keywords: ['hard reverse', 'cannot recover', 'preimage hard', 'one way'] },
    ],
    answerDisplay:
      'It is easy to compute hash(input), but computationally hard to recover the original input from the digest.',
    explanationSteps: [
      'One-way means forward direction is efficient.',
      'Reverse direction (digest -> original message) is computationally hard.',
      'This supports integrity and password storage designs.',
    ],
    conceptSummary: 'One-way: forward easy, reverse hard.',
  },
  {
    id: 'crypto-algo-collision-weak-strong',
    kind: 'match',
    prompt: 'Match each collision statement to weak or strong collision resistance.',
    pairs: [
      { left: 'Given one message m, hard to find m\' with same hash', right: 'Weak collision resistance' },
      { left: 'Hard to find any two different messages with same hash', right: 'Strong collision resistance' },
    ],
    explanationSteps: [
      'Weak collision resistance starts with a fixed message.',
      'Strong collision resistance allows attacker to choose both messages.',
      'Strong requirement is broader and harder for attacker to break.',
    ],
    conceptSummary: 'Weak: second-preimage style; strong: any-pair collision hard.',
  },
]

const SYMMETRIC_ENCRYPTION_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'crypto-algo-symmetric-key-count',
    kind: 'mcq',
    prompt: 'How many keys are used in symmetric encryption?',
    options: ['One shared key', 'Two different keys', 'Zero keys', 'Three rotating keys'],
    correctOption: 0,
    explanationSteps: [
      'Symmetric cryptography uses one shared secret key.',
      'That same key encrypts and decrypts.',
      'Main operational issue is safe key distribution.',
    ],
    conceptSummary: 'Symmetric = one shared secret key.',
  },
  {
    id: 'crypto-algo-symmetric-tradeoff',
    kind: 'text',
    prompt: 'What is the main practical challenge of symmetric encryption?',
    requiredConcepts: [
      { label: 'Key distribution/sharing', keywords: ['key distribution', 'share key', 'exchange key', 'key sharing'] },
      { label: 'Secure channel/trust needed', keywords: ['secure channel', 'trusted exchange', 'before communication'] },
    ],
    answerDisplay:
      'Both parties must securely share the same secret key ahead of time, which is a key-distribution challenge.',
    explanationSteps: [
      'Symmetric crypto itself can be efficient.',
      'But both sides need the same secret key.',
      'Securely sharing that key is often the hardest operational step.',
    ],
    conceptSummary: 'Symmetric strength: speed; challenge: key distribution.',
  },
]

const ASYMMETRIC_ENCRYPTION_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'crypto-algo-asymmetric-encrypt-decrypt',
    kind: 'mcq',
    prompt: 'In asymmetric encryption for confidentiality, which key encrypts and which decrypts?',
    options: [
      'Encrypt with recipient public key, decrypt with recipient private key',
      'Encrypt with recipient private key, decrypt with recipient public key',
      'Encrypt and decrypt both with same key',
      'Encrypt with hash key and decrypt with AES key',
    ],
    correctOption: 0,
    explanationSteps: [
      'Public key can be shared openly.',
      'Only matching private key can decrypt ciphertext.',
      'So confidentiality is tied to private-key ownership.',
    ],
    conceptSummary: 'Public encrypt, private decrypt for confidentiality.',
  },
  {
    id: 'crypto-algo-asymmetric-sign-verify',
    kind: 'mcq',
    prompt: 'For digital signatures, which key is used to sign and which key verifies?',
    options: [
      'Sign with private key, verify with public key',
      'Sign with public key, verify with private key',
      'Sign with shared symmetric key only',
      'Sign with hash output only, no keys',
    ],
    correctOption: 0,
    explanationSteps: [
      'Signer uses private key to create signature.',
      'Anyone with public key can verify authenticity and integrity.',
      'Only private-key owner could have created valid signature.',
    ],
    conceptSummary: 'Private signs, public verifies.',
  },
  {
    id: 'crypto-algo-which-crypto-type',
    kind: 'match',
    prompt: 'Match each description to the crypto type.',
    pairs: [
      { left: '0 secret keys and fixed-size digest output', right: 'Hash function' },
      { left: '1 shared key for encrypt and decrypt', right: 'Symmetric encryption' },
      { left: '2-key public/private pair', right: 'Asymmetric encryption' },
    ],
    explanationSteps: [
      'Hashing has no decrypt key and provides digest properties.',
      'Symmetric uses one shared secret key.',
      'Asymmetric uses mathematically related public/private keys.',
    ],
    conceptSummary: 'Key-count shortcut: 0 hash, 1 symmetric, 2 asymmetric.',
  },
  {
    id: 'crypto-algo-send-vs-prove-scenarios',
    kind: 'mcq',
    prompt: 'Which action best proves Bob authored a message?',
    options: [
      'Bob signs message digest with Bob\'s private key',
      'Alice encrypts message with Bob\'s public key',
      'Bob hashes message and hides hash',
      'Alice sends message over HTTP',
    ],
    correctOption: 0,
    explanationSteps: [
      'Authorship proof uses Bob private key (signature).',
      'Verification with Bob public key confirms signer identity.',
      'Public-key encryption to Bob gives confidentiality, not Bob authorship.',
    ],
    conceptSummary: 'Confidentiality vs authenticity are different goals.',
  },
]

export function generateCiaModelQuestion(): NetworkingQuestion {
  return randomPick(CIA_MODEL_QUESTIONS)
}

export function generateEncryptionBasicsQuestion(): NetworkingQuestion {
  return randomPick(ENCRYPTION_BASICS_QUESTIONS)
}

export function generateHashFunctionQuestion(): NetworkingQuestion {
  return randomPick(HASH_FUNCTION_QUESTIONS)
}

export function generateSymmetricEncryptionQuestion(): NetworkingQuestion {
  return randomPick(SYMMETRIC_ENCRYPTION_QUESTIONS)
}

export function generateAsymmetricEncryptionQuestion(): NetworkingQuestion {
  return randomPick(ASYMMETRIC_ENCRYPTION_QUESTIONS)
}

export function generateKeyTradeoffQuestion(): NetworkingQuestion {
  return randomPick([
    ...SYMMETRIC_ENCRYPTION_QUESTIONS,
    ...ASYMMETRIC_ENCRYPTION_QUESTIONS,
    {
      id: 'crypto-algo-tradeoff-summary',
      kind: 'mcq',
      prompt: 'Which tradeoff statement is most accurate?',
      options: [
        'Symmetric is usually faster but needs secure shared-key distribution',
        'Asymmetric has no key management concerns',
        'Hashing provides confidentiality of message content',
        'All three types use one shared secret key',
      ],
      correctOption: 0,
      explanationSteps: [
        'Symmetric encryption is typically efficient.',
        'Asymmetric helps key distribution and signatures but is heavier.',
        'Hashes support integrity checks, not content confidentiality.',
      ],
      conceptSummary: 'Choose primitive by goal: confidentiality, integrity, authenticity, and deployment constraints.',
    } satisfies NetworkingQuestion,
  ])
}

export const CRYPTO_ALGORITHMS_QUESTION_COUNT = 13
