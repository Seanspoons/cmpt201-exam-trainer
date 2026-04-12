export type CodePredictionQuestion = {
  id: string
  prompt: string
  code: string
  correctAnswers: string[]
  explanationSteps: string[]
  concepts: string[]
  nonDeterministicNote?: string
}

export function normalizePredictionAnswer(raw: string): string {
  return raw.trim().toLowerCase().replace(/\s+/g, ' ')
}

export function isPredictionAnswerCorrect(
  userAnswer: string,
  question: CodePredictionQuestion,
): boolean {
  const actual = normalizePredictionAnswer(userAnswer)
  return question.correctAnswers
    .map((answer) => normalizePredictionAnswer(answer))
    .includes(actual)
}

export const CODE_PREDICTION_QUESTIONS: CodePredictionQuestion[] = [
  {
    id: 'fork-print-count',
    prompt: 'How many times does "X" print?',
    code: `printf("X\\n");
fork();
printf("X\\n");`,
    correctAnswers: ['3 times', 'prints 3 times', 'x prints 3 times'],
    explanationSteps: [
      'Step 1: Initial process prints X once.',
      'Step 2: fork() creates one child process.',
      'Step 3: Both parent and child execute the second printf.',
      'Step 4: X prints two more times, for 3 total.',
    ],
    concepts: ['fork duplicates process state', 'post-fork code runs in both processes'],
  },
  {
    id: 'exec-replace',
    prompt: 'What output behavior is correct for this snippet?',
    code: `printf("A\\n");
execlp("ls", "ls", NULL);
printf("B\\n");`,
    correctAnswers: [
      'B does not print if exec succeeds',
      'code after successful exec does not run',
      'exec replaces the process image so B is not printed',
    ],
    explanationSteps: [
      'Step 1: Process prints A.',
      'Step 2: execlp succeeds and replaces the current process image.',
      'Step 3: Control does not return to the next line in this program.',
      'Step 4: B prints only if exec fails.',
    ],
    concepts: ['exec replaces current process', 'code after successful exec is not executed'],
  },
  {
    id: 'pipe-block',
    prompt: 'Will this parent read loop potentially block forever?',
    code: `pipe(fd);
if (fork() == 0) {
  write(fd[1], "hi", 2);
} else {
  char buf[8];
  while (read(fd[0], buf, sizeof(buf)) > 0) { }
}`,
    correctAnswers: [
      'yes, it can block if write ends stay open so eof never arrives',
      'yes block because all write ends must close for eof',
      'can block forever unless unused write ends are closed',
    ],
    explanationSteps: [
      'Step 1: read() loop exits only when read returns 0 (EOF).',
      'Step 2: EOF happens only when every write end of the pipe is closed.',
      'Step 3: If a write end remains open, read may wait indefinitely.',
      'Step 4: Close unused ends in each process to avoid hangs.',
    ],
    concepts: ['pipe EOF semantics', 'closing unused descriptors'],
    nonDeterministicNote:
      'Whether it hangs depends on descriptor-closing behavior and scheduling.',
  },
  {
    id: 'read-null-term',
    prompt: 'What bug can occur here?',
    code: `char buf[4];
int n = read(fd, buf, 4);
printf("%s\\n", buf);`,
    correctAnswers: [
      'missing null terminator after read',
      'printf with %s may read past buffer without null terminator',
      'read does not append null terminator so string output is unsafe',
    ],
    explanationSteps: [
      'Step 1: read() writes raw bytes and does not append \\0.',
      'Step 2: printf("%s") expects a null-terminated C string.',
      'Step 3: Without terminator, output may continue into unrelated memory.',
      'Step 4: Add a terminator when space permits before printing as a string.',
    ],
    concepts: ['read vs C-string conventions', 'memory safety in output'],
  },
]
