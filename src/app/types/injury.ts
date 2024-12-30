export interface InjuryCase {
  InjuryId: string
  InjuryAgeClass: string
  GenderDescription: string
  InjuryTypeDescription: string
  InjuryAccountDescription: string
  InjurySeverityDescription: string
  DetectionYear: string
  "Detection Month": string
  "Detection Day": string
}

export interface ParsedInjuryCase {
  id: string
  ageClass: string
  gender: string
  type: string
  account: string
  severity: string
  year: number
  month: number
  day: number
} 
