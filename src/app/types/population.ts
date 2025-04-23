export interface PopulationData {
  Year: string
  Lower: string
  'Population Estimate': string
  Upper: string
}

export interface ParsedPopulationData {
  year: number
  estimate: number
  lower: number
  upper: number
}
