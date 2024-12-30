export interface MortalityCase {
  SightingEGNo: string
  IntermatchCode: string
  SightingYear: string
  SightingMonth: string
  SightingDay: string
  Country: string
  COD: string
}

export type CauseOfDeath = 
  | 'Vessel Strike'
  | 'Entanglement'
  | 'Neonate'
  | 'Unknown'
  | 'Other'

export interface ParsedMortalityCase {
  sightingEGNo: string
  intermatchCode: string
  date: Date | null
  year: number
  month: number
  day: number
  country: string
  causeOfDeath: CauseOfDeath | string
} 
