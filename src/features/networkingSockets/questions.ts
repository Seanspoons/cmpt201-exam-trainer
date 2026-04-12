import { randomPick } from '../../lib/random'
import type { NetworkingQuestion } from '../networkingShared/networkingDrills'

const STACK_BASICS_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'stack-layer-ip-port',
    kind: 'mcq',
    prompt:
      'Which layer and identifier pair is correct for end-to-end delivery to an app process?',
    options: [
      'Transport layer uses port numbers',
      'Link layer uses port numbers',
      'Application layer uses MAC addresses',
      'Physical layer uses IP addresses',
    ],
    correctOption: 0,
    explanationSteps: [
      'Port numbers identify endpoints at the transport layer.',
      'IP handles host-to-host routing; link layer handles local-hop MAC addresses.',
      'The app process is selected by transport protocol + port.',
    ],
    conceptSummary: 'IP identifies hosts; ports identify sockets/process endpoints.',
  },
  {
    id: 'tcp-vs-udp',
    kind: 'mcq',
    prompt: 'Which statement best matches TCP vs UDP?',
    options: [
      'TCP is connection-oriented stream; UDP is connectionless datagram',
      'TCP is connectionless datagram; UDP is connection-oriented stream',
      'Both are connection-oriented streams',
      'Both are connectionless datagrams',
    ],
    correctOption: 0,
    explanationSteps: [
      'TCP establishes a connection and presents a byte stream.',
      'UDP sends independent datagrams with no handshake.',
      'This affects ordering/reliability and syscall usage patterns.',
    ],
    conceptSummary: 'Stream vs datagram and connection-oriented vs connectionless are core distinctions.',
  },
  {
    id: 'listen-purpose',
    kind: 'text',
    prompt: 'Why is listen() needed on a TCP server after bind()?',
    acceptedAnswers: [
      'it marks the socket as passive so it can accept incoming tcp connections',
      'to allow accept() by putting the socket in listening mode',
      'it enables the server to queue incoming connection requests',
    ],
    answerDisplay:
      'listen() marks the socket as a passive TCP listening socket so accept() can return client connections.',
    explanationSteps: [
      'bind() assigns local address/port to the socket.',
      'listen() switches the socket into passive listening state.',
      'accept() then dequeues one pending connection and returns a new client socket.',
    ],
    conceptSummary: 'bind identifies where; listen enables passive connection acceptance.',
  },
]

const TCP_SEQUENCE_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'tcp-server-sequence',
    kind: 'mcq',
    prompt: 'Choose the correct core TCP server call sequence.',
    options: [
      'socket() -> bind() -> listen() -> accept() -> read()/write() -> close()',
      'socket() -> connect() -> listen() -> read()/write() -> close()',
      'socket() -> bind() -> recvfrom() -> sendto() -> close()',
      'socket() -> listen() -> bind() -> accept() -> close()',
    ],
    correctOption: 0,
    explanationSteps: [
      'Server creates a socket and binds to local address/port.',
      'listen() enables incoming connection queueing.',
      'accept() returns a per-client connected socket.',
      'I/O happens on connected socket, then close.',
    ],
    conceptSummary: 'TCP server path is socket-bind-listen-accept before stream I/O.',
  },
  {
    id: 'tcp-client-sequence',
    kind: 'mcq',
    prompt: 'Choose the correct core TCP client sequence.',
    options: [
      'socket() -> connect() -> write()/read() -> close()',
      'socket() -> bind() -> listen() -> accept() -> close()',
      'socket() -> bind() -> recvfrom() -> sendto() -> close()',
      'socket() -> connect() -> accept() -> read() -> close()',
    ],
    correctOption: 0,
    explanationSteps: [
      'Client creates socket then actively connects to server.',
      'After connect succeeds, both sides can perform stream I/O.',
      'accept is server-side only and not part of client sequence.',
    ],
    conceptSummary: 'TCP client is active opener: socket then connect.',
  },
]

const UDP_SEQUENCE_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'udp-server-sequence',
    kind: 'mcq',
    prompt: 'Choose the correct core UDP server sequence.',
    options: [
      'socket() -> bind() -> recvfrom() -> sendto() -> close()',
      'socket() -> bind() -> listen() -> accept() -> close()',
      'socket() -> connect() -> write()/read() -> close()',
      'socket() -> recvfrom() -> bind() -> sendto() -> close()',
    ],
    correctOption: 0,
    explanationSteps: [
      'UDP has no connection handshake for server listen/accept.',
      'Server binds to a known local endpoint.',
      'Datagrams are received with recvfrom and replied using sendto.',
    ],
    conceptSummary: 'UDP server receives datagrams directly; no listen/accept.',
  },
  {
    id: 'udp-client-sequence',
    kind: 'mcq',
    prompt: 'Choose the correct core UDP client sequence.',
    options: [
      'socket() -> sendto() -> recvfrom() -> close()',
      'socket() -> connect() -> write()/read() -> close()',
      'socket() -> bind() -> listen() -> accept() -> close()',
      'socket() -> accept() -> recvfrom() -> close()',
    ],
    correctOption: 0,
    explanationSteps: [
      'UDP client can send datagrams immediately with sendto.',
      'Optional bind may happen, but core path is socket then send/receive datagrams.',
      'listen/accept are TCP server concepts.',
    ],
    conceptSummary: 'UDP clients typically use sendto/recvfrom without connection setup.',
  },
]

const ROLE_IDENTIFICATION_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'role-tcp-client',
    kind: 'mcq',
    prompt:
      'Given calls: socket(), connect(), read(), write(), close(). What role is this?',
    options: ['TCP server', 'TCP client', 'UDP server', 'UDP client'],
    correctOption: 1,
    explanationSteps: [
      'connect indicates an active TCP opener.',
      'TCP servers use listen and accept instead of connect.',
      'read/write on connected socket fits TCP client behavior.',
    ],
    conceptSummary: 'connect strongly signals TCP client role.',
  },
  {
    id: 'role-udp-server',
    kind: 'mcq',
    prompt:
      'Given calls: socket(), bind(), recvfrom(), sendto(), close(). What role is this?',
    options: ['TCP server', 'TCP client', 'UDP server', 'UDP client'],
    correctOption: 2,
    explanationSteps: [
      'bind + recvfrom/sendto is a classic UDP server pattern.',
      'No listen/accept means not TCP server.',
      'Server binds to known address/port and processes datagrams.',
    ],
    conceptSummary: 'bind + recvfrom/sendto identifies UDP server behavior.',
  },
  {
    id: 'accept-return',
    kind: 'text',
    prompt: 'What does accept() return on a TCP server?',
    acceptedAnswers: [
      'a new connected socket file descriptor for that client',
      'a new connected socket for the accepted client',
      'a new file descriptor representing the client connection',
    ],
    answerDisplay: 'A new connected socket file descriptor for that client connection.',
    explanationSteps: [
      'The listening socket remains open for future accepts.',
      'accept returns a separate connected socket for one client.',
      'Server performs per-client I/O on returned socket.',
    ],
    conceptSummary: 'Listening socket accepts; returned socket communicates with one client.',
  },
]

export function generateSocketsStackBasicsQuestion(): NetworkingQuestion {
  return randomPick(STACK_BASICS_QUESTIONS)
}

export function generateSocketsTcpSequenceQuestion(): NetworkingQuestion {
  return randomPick(TCP_SEQUENCE_QUESTIONS)
}

export function generateSocketsUdpSequenceQuestion(): NetworkingQuestion {
  return randomPick(UDP_SEQUENCE_QUESTIONS)
}

export function generateSocketsRoleQuestion(): NetworkingQuestion {
  return randomPick(ROLE_IDENTIFICATION_QUESTIONS)
}
