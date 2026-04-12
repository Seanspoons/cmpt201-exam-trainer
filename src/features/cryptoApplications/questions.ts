import { randomPick } from '../../lib/random'
import type { NetworkingQuestion } from '../networkingShared/networkingDrills'

const PASSWORD_STORAGE_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'crypto-app-password-plaintext',
    kind: 'mcq',
    prompt: 'Why should systems never store plaintext passwords?',
    options: [
      'A database leak would immediately reveal all user passwords',
      'Plaintext passwords are too large for SQL columns',
      'Browsers cannot send plaintext at login',
      'Hashing plaintext makes login impossible',
    ],
    correctOption: 0,
    explanationSteps: [
      'Plaintext storage creates direct compromise risk.',
      'Any DB read access reveals real credentials.',
      'Breaches then cascade to password reuse on other sites.',
    ],
    conceptSummary: 'Never store plaintext passwords.',
  },
  {
    id: 'crypto-app-password-encrypt-vs-hash',
    kind: 'mcq',
    prompt: 'Why is password hashing preferred over reversible encryption for storage?',
    options: [
      'Hashes are one-way, so original password is not directly recoverable',
      'Encryption cannot be used with user login systems',
      'Hashed passwords require no server-side comparison',
      'Encryption only works for text files, not databases',
    ],
    correctOption: 0,
    explanationSteps: [
      'Password verification compares hash(input) with stored hash.',
      'Reversible encryption introduces key theft risk: stolen key reveals all passwords.',
      'One-way hashing minimizes impact of database compromise.',
    ],
    conceptSummary: 'Store hash(password), not plaintext and not decryptable password data.',
  },
]

const HASHING_SALTING_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'crypto-app-what-is-salt',
    kind: 'text',
    prompt: 'What is salting in password storage?',
    requiredConcepts: [
      { label: 'Random salt value', keywords: ['random', 'salt', 'unique value'] },
      { label: 'Added to password before hashing', keywords: ['add to password', 'before hash', 'combine with password'] },
      { label: 'Blocks precomputed attacks', keywords: ['rainbow table', 'precomputed', 'forces recompute'] },
    ],
    answerDisplay:
      'Salting adds a random value to the password before hashing to defeat precomputed rainbow-table attacks.',
    explanationSteps: [
      'Salt is per-password random data.',
      'Stored hash is computed from password + salt.',
      'Attackers must recompute guesses per salt, defeating one-table reuse.',
    ],
    conceptSummary: 'Salt is public randomness that defeats precomputed hash lookup attacks.',
  },
  {
    id: 'crypto-app-salt-secret-or-not',
    kind: 'mcq',
    prompt: 'Is a password salt supposed to be secret?',
    options: [
      'No. Salt can be stored with hash; its value is not secret',
      'Yes. Salt must be hidden like the password itself',
      'Yes. Salt should be encrypted with user public key',
      'No. Salt is never stored anywhere',
    ],
    correctOption: 0,
    explanationSteps: [
      'Salt improves uniqueness and anti-precomputation, not secrecy.',
      'Systems commonly store salt next to password hash.',
      'Security still depends on strong hashing and password quality.',
    ],
    conceptSummary: 'Salt is not a secret key.',
  },
  {
    id: 'crypto-app-rainbow-table',
    kind: 'mcq',
    prompt: 'What is a rainbow table attack?',
    options: [
      'Using precomputed hashes to reverse common password choices',
      'Man-in-the-middle interception of TLS certificates',
      'Brute-forcing private keys by timing side channels',
      'Replacing hashes with random ciphertext blocks',
    ],
    correctOption: 0,
    explanationSteps: [
      'Attackers precompute hash->password mappings.',
      'Unsalted hashes are vulnerable to this lookup strategy.',
      'Salting forces per-user recomputation and breaks broad reuse.',
    ],
    conceptSummary: 'Rainbow tables are precomputed hash lookup attacks.',
  },
]

const DIGITAL_SIGNATURE_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'crypto-app-signature-definition',
    kind: 'text',
    prompt: 'What is a digital signature?',
    requiredConcepts: [
      { label: 'Signs hash/digest', keywords: ['hash', 'digest'] },
      { label: 'Uses private key', keywords: ['private key', 'signer private'] },
      { label: 'Verified with public key', keywords: ['verify', 'public key'] },
    ],
    answerDisplay:
      'A digital signature is produced by signing a message digest with the signer’s private key, then verified with the public key.',
    explanationSteps: [
      'Sender hashes the message.',
      'Sender signs digest using private key.',
      'Receiver verifies signature with public key and compares digest to confirm integrity.',
    ],
    conceptSummary: 'Signatures provide authenticity and integrity, not secrecy by themselves.',
  },
  {
    id: 'crypto-app-signature-what-proves',
    kind: 'mcq',
    prompt: 'Successful digital signature verification primarily proves:',
    options: [
      'Message integrity and signer authenticity (assuming key ownership is trusted)',
      'Message confidentiality from all observers',
      'That no network delays occurred',
      'That message was encrypted with AES',
    ],
    correctOption: 0,
    explanationSteps: [
      'Valid signature means digest and signature match public key.',
      'That implies message was not modified and signer had private key.',
      'Confidentiality requires encryption, which is separate.',
    ],
    conceptSummary: 'Signatures: authenticity + integrity.',
  },
  {
    id: 'crypto-app-signature-verify-order',
    kind: 'match',
    prompt: 'Match each verification step to the correct role.',
    pairs: [
      { left: 'Compute hash of received message', right: 'Fresh local digest for comparison' },
      { left: 'Use signer public key on signature', right: 'Recover/validate signed digest' },
      { left: 'Compare both digests', right: 'Integrity + authenticity check outcome' },
    ],
    explanationSteps: [
      'Verifier computes own digest from received message.',
      'Verifier checks signature using public key.',
      'Matching digests indicate valid signature for that message.',
    ],
    conceptSummary: 'Verification is digest comparison backed by asymmetric key check.',
  },
]

const CERT_HTTPS_TRUST_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'crypto-app-certificate-purpose',
    kind: 'mcq',
    prompt: 'What core problem do digital certificates solve?',
    options: [
      'Binding an identity/domain to a public key',
      'Compressing encrypted data streams',
      'Replacing private keys in all systems',
      'Preventing all DDoS attacks',
    ],
    correctOption: 0,
    explanationSteps: [
      'Public keys alone do not prove owner identity.',
      'Certificates bind identity info to public key.',
      'A CA signature allows clients to validate that binding.',
    ],
    conceptSummary: 'Certificates solve public-key authenticity, not encryption speed.',
  },
  {
    id: 'crypto-app-ca-role',
    kind: 'mcq',
    prompt: 'What is the main role of a Certificate Authority (CA)?',
    options: [
      'Sign certificates after validating identity/domain control',
      'Store private keys for all websites',
      'Encrypt browser traffic directly',
      'Generate user account passwords',
    ],
    correctOption: 0,
    explanationSteps: [
      'CAs issue signatures over certificate data.',
      'Clients trust CA root certificates pre-installed by OS/browser.',
      'That trust extends to issued certs through chain validation.',
    ],
    conceptSummary: 'CA trust anchors certificate authenticity.',
  },
  {
    id: 'crypto-app-https-what-adds',
    kind: 'mcq',
    prompt: 'Compared to HTTP, HTTPS mainly adds:',
    options: [
      'Certificate-based identity checks and encrypted channel setup',
      'Guaranteed 0% packet loss',
      'Automatic malware filtering',
      'Built-in password hashing in browser storage',
    ],
    correctOption: 0,
    explanationSteps: [
      'HTTP traffic is plaintext and unauthenticated by default.',
      'HTTPS uses TLS with certificates and encryption.',
      'This protects against passive snooping and many active tampering attacks.',
    ],
    conceptSummary: 'HTTPS = HTTP + TLS (identity + confidentiality + integrity protections).',
  },
  {
    id: 'crypto-app-chain-of-trust',
    kind: 'text',
    prompt: 'What is a certificate chain of trust?',
    requiredConcepts: [
      { label: 'Certificates signed by higher CA', keywords: ['certificate signed', 'signed by ca', 'issuer'] },
      { label: 'Root CA trust anchor', keywords: ['root ca', 'trusted root', 'root of trust', 'os trust store'] },
      { label: 'Trust propagates through chain', keywords: ['trust chain', 'chain validation', 'intermediate'] },
    ],
    answerDisplay:
      'A chain of trust is certificate signatures linking a server cert through intermediates to a trusted root CA in the OS/browser.',
    explanationSteps: [
      'Server presents certificate and often intermediate certs.',
      'Client validates each signature upward in chain.',
      'If chain ends at trusted root, client accepts server identity binding.',
    ],
    conceptSummary: 'Trust is transitive from trusted root CA to leaf certificate.',
  },
]

const COLLISION_ATTACK_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'crypto-app-collision-danger',
    kind: 'mcq',
    prompt: 'Why are hash collisions dangerous for signature systems?',
    options: [
      'An attacker could substitute different content with same digest',
      'Collisions reveal private keys directly',
      'Collisions make encryption slower only',
      'Collisions automatically corrupt all certificates',
    ],
    correctOption: 0,
    explanationSteps: [
      'Signatures typically sign a digest, not raw message bytes directly.',
      'If attacker finds colliding messages, one signature may validate another message.',
      'That undermines integrity/authenticity assumptions.',
    ],
    conceptSummary: 'Collision resistance protects signature soundness.',
  },
  {
    id: 'crypto-app-birthday-attack',
    kind: 'mcq',
    prompt: 'What is a birthday attack in hashing context?',
    options: [
      'A collision-finding strategy exploiting probability of matching digests',
      'Attack using user birthdates as passwords',
      'A replay attack against TLS handshake',
      'A brute-force attack on CA root private keys',
    ],
    correctOption: 0,
    explanationSteps: [
      'Birthday paradox implies collisions appear sooner than naive intuition.',
      'Attackers search for any two messages with same hash.',
      'This targets strong collision resistance.',
    ],
    conceptSummary: 'Birthday attacks are probabilistic collision attacks.',
  },
]

const MIXED_APPLICATION_SCENARIOS: NetworkingQuestion[] = [
  {
    id: 'crypto-app-wrong-system-design',
    kind: 'mcq',
    prompt:
      'A team stores encrypted passwords and keeps decryption key on same server. What is the best critique?',
    options: [
      'Use salted password hashes instead; reversible storage is unnecessary risk',
      'Encryption is always stronger than hashing for password databases',
      'Only issue is missing TLS certificate on login page',
      'Problem is that salt should be secret and off-server',
    ],
    correctOption: 0,
    explanationSteps: [
      'Password checks do not need plaintext recovery.',
      'If decryption key is compromised, all passwords can be recovered.',
      'Best practice is salted one-way password hashing.',
    ],
    conceptSummary: 'Password auth should verify hashes, not decrypt passwords.',
  },
  {
    id: 'crypto-app-secure-digest-purpose',
    kind: 'mcq',
    prompt: 'What is a secure digest commonly used for?',
    options: [
      'Verifying file integrity after transfer/download',
      'Encrypting file contents for secrecy by itself',
      'Issuing root CA certificates',
      'Replacing OS trust store validation',
    ],
    correctOption: 0,
    explanationSteps: [
      'Digest comparison detects accidental or malicious modification.',
      'Publisher shares expected digest; receiver recomputes and compares.',
      'Matching digest indicates same content (within hash assumptions).',
    ],
    conceptSummary: 'Digest checks integrity, not confidentiality.',
  },
]

export function generatePasswordStorageQuestion(): NetworkingQuestion {
  return randomPick(PASSWORD_STORAGE_QUESTIONS)
}

export function generateHashingSaltingQuestion(): NetworkingQuestion {
  return randomPick(HASHING_SALTING_QUESTIONS)
}

export function generateDigitalSignatureQuestion(): NetworkingQuestion {
  return randomPick(DIGITAL_SIGNATURE_QUESTIONS)
}

export function generateCertificatesQuestion(): NetworkingQuestion {
  return randomPick(CERT_HTTPS_TRUST_QUESTIONS)
}

export function generateHttpsTrustQuestion(): NetworkingQuestion {
  return randomPick([
    ...CERT_HTTPS_TRUST_QUESTIONS,
    ...MIXED_APPLICATION_SCENARIOS,
  ])
}

export function generateChainOfTrustQuestion(): NetworkingQuestion {
  return randomPick([
    CERT_HTTPS_TRUST_QUESTIONS[3],
    CERT_HTTPS_TRUST_QUESTIONS[0],
    CERT_HTTPS_TRUST_QUESTIONS[1],
  ])
}

export function generateHashCollisionQuestion(): NetworkingQuestion {
  return randomPick(COLLISION_ATTACK_QUESTIONS)
}

export const CRYPTO_APPLICATIONS_QUESTION_COUNT = 14
