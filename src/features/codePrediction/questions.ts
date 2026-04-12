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
    id: 'fork-parent-child-branch',
    prompt: 'What lines print (order may vary)?',
    code: `if (fork() == 0) {
  printf("child\\n");
} else {
  printf("parent\\n");
}`,
    correctAnswers: [
      'prints parent and child once each (order may vary)',
      'one parent line and one child line',
      'child and parent both print once',
    ],
    explanationSteps: [
      'Step 1: fork() creates parent and child processes.',
      'Step 2: Child sees return value 0 and runs the if branch.',
      'Step 3: Parent sees non-zero return and runs the else branch.',
      'Step 4: Exactly one "child" and one "parent" are printed; scheduling controls order.',
    ],
    concepts: ['fork return values differ in parent/child', 'scheduler affects print order'],
    nonDeterministicNote: 'Relative order of parent/child lines is non-deterministic.',
  },
  {
    id: 'fork-exec-child',
    prompt: 'What definitely prints from this program?',
    code: `if (fork() == 0) {
  execl("/bin/echo", "echo", "Hi", NULL);
  printf("This does not run\\n");
}
printf("Done\\n");`,
    correctAnswers: [
      'child prints hi and parent prints done; "this does not run" is not printed if exec succeeds',
      'hi and done print, but not "this does not run" on successful exec',
      'exec replaces child process so post-exec child printf does not run',
    ],
    explanationSteps: [
      'Step 1: fork() creates child and parent.',
      'Step 2: Child calls exec and is replaced by /bin/echo on success.',
      'Step 3: Replaced child does not execute the post-exec printf line.',
      'Step 4: Parent continues and prints "Done".',
    ],
    concepts: ['exec process replacement', 'fork creates separate control flow'],
    nonDeterministicNote:
      '"Hi" and "Done" ordering can vary unless synchronized with wait().',
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
    id: 'pipe-write-read',
    prompt: 'What does the parent print?',
    code: `pipe(fd);
if (fork() == 0) {
  close(fd[0]);
  write(fd[1], "OK", 2);
} else {
  close(fd[1]);
  char buf[3] = {0};
  read(fd[0], buf, 2);
  printf("%s\\n", buf);
}`,
    correctAnswers: ['ok', 'prints ok'],
    explanationSteps: [
      'Step 1: Child closes read end and writes 2 bytes "OK".',
      'Step 2: Parent closes write end and reads exactly 2 bytes.',
      'Step 3: Buffer already has trailing \\0 from initialization.',
      'Step 4: Parent prints "OK".',
    ],
    concepts: ['pipe unidirectional data flow', 'close unused ends in each process'],
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
  {
    id: 'stdio-buffering',
    prompt: 'Immediately after fprintf and before fclose, what may be true?',
    code: `FILE* f = fopen("tmp.txt", "w");
fprintf(f, "Hello");
sleep(10);`,
    correctAnswers: [
      'hello may still be only in user-space stdio buffer until flush or close',
      'data is buffered and may not be written to disk yet',
      'without fflush/fclose the file may appear empty during sleep',
    ],
    explanationSteps: [
      'Step 1: fopen creates a stdio stream with buffering.',
      'Step 2: fprintf writes to the stdio buffer first.',
      'Step 3: sleep does not force a flush.',
      'Step 4: Data is guaranteed written after fflush/fclose/normal process exit.',
    ],
    concepts: ['stdio buffering behavior', 'flush semantics vs immediate write'],
  },
]
