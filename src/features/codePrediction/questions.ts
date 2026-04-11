export type CodePredictionQuestion = {
  id: string
  prompt: string
  code: string
  acceptableAnswer: string
  acceptedPatterns: RegExp[]
  traceSteps: string[]
  concepts: string[]
  nonDeterministicNote?: string
}

export const CODE_PREDICTION_QUESTIONS: CodePredictionQuestion[] = [
  {
    id: 'fork-print-count',
    prompt: 'How many times does "X" print?',
    code: `printf("X\\n");
fork();
printf("X\\n");`,
    acceptableAnswer: '3 times total',
    acceptedPatterns: [/3/, /three/],
    traceSteps: [
      'Before fork, one process prints X once.',
      'fork() creates parent + child.',
      'Both processes execute the second printf, adding 2 more prints.',
      'Total prints: 1 + 2 = 3.',
    ],
    concepts: ['fork duplicates process state', 'post-fork code runs in both processes'],
  },
  {
    id: 'exec-replace',
    prompt: 'What is the bug in this output expectation?',
    code: `printf("A\\n");
execlp("ls", "ls", NULL);
printf("B\\n");`,
    acceptableAnswer: 'Expecting B to print is wrong; exec replaces process image on success',
    acceptedPatterns: [/exec/, /replace|replaces/, /b/],
    traceSteps: [
      'Process prints A.',
      'execlp succeeds and replaces current program image with ls.',
      'Control does not return to next line in original code.',
      'B only prints if exec fails.',
    ],
    concepts: ['exec replaces current process', 'code after successful exec is not executed'],
  },
  {
    id: 'pipe-block',
    prompt: 'Will this parent read potentially block forever?',
    code: `pipe(fd);
if (fork() == 0) {
  write(fd[1], "hi", 2);
  // child exits
} else {
  char buf[8];
  while (read(fd[0], buf, sizeof(buf)) > 0) { }
}`,
    acceptableAnswer:
      'Yes, it can block if parent/child keep write end open and EOF never arrives',
    acceptedPatterns: [/yes|can block/, /write end|fd\[1\]|eof/, /close/],
    traceSteps: [
      'Reader loop exits only on read returning 0 (EOF).',
      'EOF requires all write ends of pipe to be closed.',
      'If a write end remains open in either process, read can wait for more data.',
      'Close unused fd[1] in parent and fd[0] in child to avoid hangs.',
    ],
    concepts: ['pipe EOF semantics', 'closing unused descriptors'],
    nonDeterministicNote:
      'Blocking behavior depends on descriptor-closing order and scheduling.',
  },
  {
    id: 'read-null-term',
    prompt: 'What bug can occur in this code?',
    code: `char buf[4];
int n = read(fd, buf, 4);
printf("%s\\n", buf);`,
    acceptableAnswer:
      'Missing null terminator after read; printf("%s") may read past buffer',
    acceptedPatterns: [/null|terminator/, /%s|printf/, /past buffer|overflow|garbage/],
    traceSteps: [
      'read writes raw bytes and does not append \\0.',
      'printf("%s") expects a null-terminated C string.',
      'Without terminator, printing can continue into unrelated memory.',
      'Fix by reserving space and setting buf[n] = \'\\0\' when safe.',
    ],
    concepts: ['read vs C-string conventions', 'memory safety in output'],
  },
]
