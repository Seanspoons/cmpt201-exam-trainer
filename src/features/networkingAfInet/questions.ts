import { randomPick } from '../../lib/random'
import type { NetworkingQuestion } from '../networkingShared/networkingDrills'

const SOCKADDR_STRUCTURE_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'sockaddr-field-port',
    kind: 'mcq',
    prompt: 'In sockaddr_in, which field stores the port number?',
    options: ['sin_addr', 'sin_family', 'sin_port', 'sin_zero'],
    correctOption: 2,
    explanationSteps: [
      'sin_family stores the address family such as AF_INET.',
      'sin_addr stores IPv4 address bytes.',
      'sin_port stores the 16-bit port in network byte order.',
    ],
    conceptSummary: 'sin_port is the port field; remember byte-order conversion.',
    comparisonTable: {
      headers: ['Field', 'Purpose'],
      rows: [
        ['sin_family', 'Address family (AF_INET)'],
        ['sin_port', 'Port number (network byte order)'],
        ['sin_addr', 'IPv4 address bytes'],
      ],
    },
  },
  {
    id: 'sockaddr-family',
    kind: 'mcq',
    prompt: 'Which value should sin_family use for IPv4 sockets?',
    options: ['AF_UNIX', 'AF_INET', 'SOCK_STREAM', 'PF_PACKET'],
    correctOption: 1,
    explanationSteps: [
      'AF_INET means IPv4 addressing.',
      'SOCK_STREAM selects transport style, not address family.',
      'AF_UNIX is local domain sockets, not IPv4 network sockets.',
    ],
    conceptSummary: 'Address family picks addressing domain; AF_INET corresponds to IPv4.',
  },
]

const IPV4_HANDLING_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'inet-pton-drill',
    kind: 'mcq',
    prompt: "Which function converts '192.168.0.1' into binary network form?",
    options: ['inet_ntop()', 'inet_pton()', 'htons()', 'ntohl()'],
    correctOption: 1,
    explanationSteps: [
      'inet_pton converts text presentation to network binary form.',
      'inet_ntop is the reverse: network binary to text.',
      'htons/ntohl are byte-order conversion helpers, not text conversion helpers.',
    ],
    conceptSummary: 'pton = presentation to network; ntop = network to presentation.',
  },
  {
    id: 'inet-ntop-drill',
    kind: 'text',
    prompt: 'Which function converts binary IPv4 address data back into dotted-quad text?',
    requiredConcepts: [
      { label: 'Use inet_ntop', keywords: ['inet_ntop'] },
      { label: 'Network binary to text direction', keywords: ['binary to text', 'dotted', 'presentation'] },
    ],
    answerDisplay: 'inet_ntop()',
    explanationSteps: [
      'Binary IPv4 bytes are not directly human-readable.',
      'inet_ntop formats bytes into dotted-quad text.',
      'Use AF_INET with buffer output for IPv4.',
    ],
    conceptSummary: 'Use inet_ntop for display/logging addresses.',
  },
]

const PORTS_SPECIAL_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'inaddr-any-drill',
    kind: 'mcq',
    prompt: 'What does INADDR_ANY mean when used with bind() on a server?',
    options: [
      'Bind only to loopback interface',
      'Bind to all local IPv4 interfaces',
      'Choose a random remote host',
      'Disable incoming connections',
    ],
    correctOption: 1,
    explanationSteps: [
      'INADDR_ANY means 0.0.0.0 for binding purposes.',
      'Kernel accepts connections on any local interface address for that port.',
      'Use loopback address when you want local-only access.',
    ],
    conceptSummary: 'INADDR_ANY exposes service on all local interfaces for that port.',
    comparisonTable: {
      headers: ['Address', 'Typical Meaning'],
      rows: [
        ['INADDR_ANY / 0.0.0.0', 'Listen on all local interfaces'],
        ['127.0.0.1', 'Local machine only (loopback)'],
      ],
    },
  },
  {
    id: 'loopback-purpose',
    kind: 'text',
    prompt: 'What is the purpose of 127.0.0.1?',
    requiredConcepts: [
      { label: 'Loopback/local host concept', keywords: ['loopback', 'local host', 'same machine'] },
      { label: 'Traffic stays local', keywords: ['within the same machine', 'stays local', 'not external'] },
    ],
    answerDisplay: 'Loopback/local-only communication on the same machine.',
    explanationSteps: [
      '127.0.0.1 routes packets back to the local host stack.',
      'It is useful for local testing and local-only services.',
      'No external network interface is required for loopback traffic.',
    ],
    conceptSummary: 'Loopback isolates traffic to the same host.',
  },
]

const NETWORK_ORDER_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'htons-drill',
    kind: 'mcq',
    prompt: 'Which function should be used before storing a 16-bit port in sin_port?',
    options: ['htonl()', 'htons()', 'ntohs()', 'inet_pton()'],
    correctOption: 1,
    explanationSteps: [
      'Ports are 16-bit values, so use host-to-network short conversion.',
      'htons converts host endianness to big-endian network order.',
      'htonl is for 32-bit values.',
    ],
    conceptSummary: 'Use htons for 16-bit ports, htonl for 32-bit values.',
  },
  {
    id: 'byte-order-why',
    kind: 'text',
    prompt: 'Why is network byte order needed?',
    requiredConcepts: [
      { label: 'Different endianness across hosts', keywords: ['endianness', 'different host order', 'architectures'] },
      { label: 'Consistent interpretation/standardization', keywords: ['consistent', 'standardize', 'agree'] },
    ],
    answerDisplay:
      'It standardizes multibyte values so hosts with different endianness interpret them consistently.',
    explanationSteps: [
      'Different CPUs may store multibyte integers in different host orders.',
      'Network order uses a fixed big-endian representation.',
      'Conversions prevent wrong port/address values across architectures.',
    ],
    conceptSummary: 'Byte-order conversion is cross-platform correctness, not optional style.',
  },
]

const SEND_RECV_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'send-recv-basics',
    kind: 'mcq',
    prompt: 'send() and recv() are best described as:',
    options: [
      'Socket-specific versions of write()/read()',
      'Only valid for UDP, never TCP',
      'Address conversion utilities',
      'Thread synchronization primitives',
    ],
    correctOption: 0,
    explanationSteps: [
      'send/recv operate on socket descriptors and provide flags.',
      'Conceptually they mirror write/read for socket I/O.',
      'Both TCP and UDP programs can use appropriate send/recv variants.',
    ],
    conceptSummary: 'send/recv map to socket I/O with protocol-aware semantics.',
  },
  {
    id: 'bind-port-8000',
    kind: 'text',
    prompt:
      'When binding a server to port 8000 in sockaddr_in, what conversion is needed?',
    requiredConcepts: [
      { label: 'Use htons()', keywords: ['htons'] },
      { label: 'Assign converted value to sin_port', keywords: ['sin_port', 'store', 'assign'] },
    ],
    answerDisplay: 'Use htons(8000) and store that in sin_port.',
    explanationSteps: [
      'Port is 16-bit and must be in network byte order.',
      'htons performs host-to-network conversion for short values.',
      'Directly storing 8000 can fail on different host endianness.',
    ],
    conceptSummary: 'Port assignment in sockaddr_in should always apply htons.',
  },
]

export function generateAfInetStructureQuestion(): NetworkingQuestion {
  return randomPick(SOCKADDR_STRUCTURE_QUESTIONS)
}

export function generateAfInetIpv4Question(): NetworkingQuestion {
  return randomPick(IPV4_HANDLING_QUESTIONS)
}

export function generateAfInetSpecialAddressQuestion(): NetworkingQuestion {
  return randomPick(PORTS_SPECIAL_QUESTIONS)
}

export function generateAfInetByteOrderQuestion(): NetworkingQuestion {
  return randomPick(NETWORK_ORDER_QUESTIONS)
}

export function generateAfInetSendRecvQuestion(): NetworkingQuestion {
  return randomPick(SEND_RECV_QUESTIONS)
}
