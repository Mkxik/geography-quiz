import { flagsData, type Country, type SimilarityGroup } from '../data/flagsData'

export interface LookalikeGroup {
  name: SimilarityGroup
  members: Country[]
}

/** Groups flags dynamically by `similarityGroup`; only groups with 2+ members can form a question. */
export function buildGroups(countries: Country[]): LookalikeGroup[] {
  const byGroup = new Map<SimilarityGroup, Country[]>()
  for (const country of countries) {
    if (country.similarityGroup === 'None') continue
    const list = byGroup.get(country.similarityGroup) ?? []
    list.push(country)
    byGroup.set(country.similarityGroup, list)
  }
  return [...byGroup.entries()]
    .filter(([, members]) => members.length >= 2)
    .map(([name, members]) => ({ name, members }))
}

export const doppelgangerGroups = buildGroups(flagsData)
