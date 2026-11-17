import { flagsData, type Country } from '../data/flagsData'

/** Lowercase, strip diacritics, "&" → "and", "St." → "saint", drop "the" and every non-alphanumeric char. */
export function normalize(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/\bst\b\.?/g, 'saint')
    .replace(/\bthe\b/g, '')
    .replace(/[^a-z0-9]/g, '')
}

export function levenshtein(a: string, b: string): number {
  if (a === b) return 0
  if (!a.length) return b.length
  if (!b.length) return a.length
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    const curr = [i]
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost)
    }
    prev = curr
  }
  return prev[b.length]
}

/** Typos allowed for a name of the given (normalized) length. Short names must be exact. */
function tolerance(length: number): number {
  if (length <= 4) return 0
  if (length <= 8) return 1
  return 2
}

export function acceptedNames(country: Country): string[] {
  return [...new Set([country.name, ...country.aliases].map(normalize))].filter(Boolean)
}

export type MatchResult = 'exact' | 'fuzzy' | 'none'

const NAMES_BY_ID = new Map(flagsData.map((c) => [c.id, acceptedNames(c)]))

function bestDistance(guess: string, names: string[]): number {
  return Math.min(...names.map((name) => levenshtein(guess, name)))
}

/**
 * exact – the guess is the name or an alias (after normalization).
 * fuzzy – within the typo tolerance, and not a real name of / closer to another entry
 *         (so "Austria" is never accepted for Australia, nor "Gambia" for Zambia).
 */
export function matchCountry(input: string, country: Country): MatchResult {
  const guess = normalize(input)
  if (!guess) return 'none'
  const names = NAMES_BY_ID.get(country.id) ?? acceptedNames(country)
  if (names.includes(guess)) return 'exact'

  const withinTolerance = names.some((name) => levenshtein(guess, name) <= tolerance(name.length))
  if (!withinTolerance) return 'none'

  const targetDistance = bestDistance(guess, names)
  for (const [id, otherNames] of NAMES_BY_ID) {
    if (id === country.id) continue
    if (otherNames.includes(guess) || bestDistance(guess, otherNames) < targetDistance) return 'none'
  }
  return 'fuzzy'
}
