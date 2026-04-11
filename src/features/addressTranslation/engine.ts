import { randomInt, randomPick } from '../../lib/random'

export type AddressTranslationQuestion = {
  pageSize: number
  virtualBits: number
  offsetBits: number
  pageBits: number
  frameBits: number
  virtualAddress: number
  pageTable: Record<number, number>
}

export type AddressTranslationSolution = {
  virtualBinary: string
  pageBinary: string
  offsetBinary: string
  frameBinary: string
  physicalBinary: string
  pageNumber: number
  offset: number
  frameNumber: number
}

export function generateAddressTranslationQuestion(): AddressTranslationQuestion {
  const pageSize = randomPick([16, 32, 64])
  const offsetBits = Math.log2(pageSize)
  const pageBits = randomPick([2, 3, 4])
  const virtualBits = pageBits + offsetBits
  const frameBits = pageBits
  const virtualAddress = randomInt(0, 2 ** virtualBits - 1)
  const pageCount = 2 ** pageBits
  const frameCount = 2 ** frameBits
  const pageTable: Record<number, number> = {}

  for (let page = 0; page < pageCount; page += 1) {
    pageTable[page] = randomInt(0, frameCount - 1)
  }

  return {
    pageSize,
    virtualBits,
    offsetBits,
    pageBits,
    frameBits,
    virtualAddress,
    pageTable,
  }
}

export function solveAddressTranslation(
  question: AddressTranslationQuestion,
): AddressTranslationSolution {
  const virtualBinary = toBinary(question.virtualAddress, question.virtualBits)
  const pageBinary = virtualBinary.slice(0, question.pageBits)
  const offsetBinary = virtualBinary.slice(question.pageBits)
  const pageNumber = Number.parseInt(pageBinary, 2)
  const offset = Number.parseInt(offsetBinary, 2)
  const frameNumber = question.pageTable[pageNumber]
  const frameBinary = toBinary(frameNumber, question.frameBits)
  const physicalBinary = `${frameBinary}${offsetBinary}`

  return {
    virtualBinary,
    pageBinary,
    offsetBinary,
    frameBinary,
    physicalBinary,
    pageNumber,
    offset,
    frameNumber,
  }
}

export function toBinary(value: number, width: number): string {
  return value.toString(2).padStart(width, '0')
}

function cleanBinary(raw: string): string {
  return raw.replace(/\s+/g, '').replace(/^0b/i, '')
}

export function binaryMatches(raw: string, expected: string): boolean {
  return cleanBinary(raw) === expected
}
