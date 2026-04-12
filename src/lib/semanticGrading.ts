export type ConceptGroup = {
  label: string
  keywords: string[]
}

export type SemanticGradeResult = {
  status: 'correct' | 'partial' | 'incorrect'
  missingConceptLabels: string[]
  matchedCount: number
  totalCount: number
}

export function normalizeText(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
}

export function containsAnyKeyword(
  normalizedInput: string,
  keywordGroup: string[],
): boolean {
  return keywordGroup.some((keyword) => {
    const normalizedKeyword = normalizeText(keyword)
    if (!normalizedKeyword) return false
    return normalizedInput.includes(normalizedKeyword)
  })
}

export function gradeByConceptGroups(
  input: string,
  requiredConcepts: ConceptGroup[],
): SemanticGradeResult {
  const normalized = normalizeText(input)

  const missingConceptLabels: string[] = []
  let matchedCount = 0

  requiredConcepts.forEach((group) => {
    if (containsAnyKeyword(normalized, group.keywords)) {
      matchedCount += 1
    } else {
      missingConceptLabels.push(group.label)
    }
  })

  if (matchedCount === requiredConcepts.length) {
    return {
      status: 'correct',
      missingConceptLabels: [],
      matchedCount,
      totalCount: requiredConcepts.length,
    }
  }

  if (matchedCount > 0) {
    return {
      status: 'partial',
      missingConceptLabels,
      matchedCount,
      totalCount: requiredConcepts.length,
    }
  }

  return {
    status: 'incorrect',
    missingConceptLabels,
    matchedCount,
    totalCount: requiredConcepts.length,
  }
}
