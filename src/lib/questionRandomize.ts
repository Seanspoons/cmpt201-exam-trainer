export function shuffledIndices(length: number): number[] {
  const indices = Array.from({ length }, (_, index) => index)
  for (let i = indices.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = indices[i]
    indices[i] = indices[j]
    indices[j] = tmp
  }
  return indices
}

export function shuffleChoicesWithCorrectIndex(
  choices: string[],
  correctIndex: number,
): { choices: string[]; correctIndex: number } {
  const order = shuffledIndices(choices.length)
  const shuffled = order.map((index) => choices[index])
  const nextCorrectIndex = order.findIndex((index) => index === correctIndex)
  return {
    choices: shuffled,
    correctIndex: nextCorrectIndex,
  }
}

