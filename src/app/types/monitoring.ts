interface InjuryCase {
  CaseId: number
  InjuryId: number
  FieldId: string
  EGNo: string
  BirthYear: number | null
  GenderCode: string
  FirstYearSighted: number
  IsUnusualMortalityEvent: boolean
  UnusualMortalityEventId: number
  UnusualMortalityEventDescription: string
  InjuryTypeId: number
  InjuryTypeDescription: string
  InjuryAccountId: number
  InjuryAccountDescription: string
  InjurySeverityId: number
  InjurySeverityDescription: string
  PreinjuryDate: string
  PreInjuryAreaCode: string
  PreInjuryAreaDescription: string
  DetectionDate: string
  DetectionAreaCode: string
  DetectionAreaDescription: string
  CountryOriginDescription: string
  CaseComments: string
  HasNecropsyReport: boolean
  HasCaseStudy: boolean
  HasImages: boolean
  MonitoringCaseAge: string
  MonitoringCaseAgeClass: string
  IsActiveCase: boolean
  DeathCauseDescription: string
  DeathCauseId: number | null
  GenderDescription: string
  IsDead: boolean
  MortalityFieldID: string | null
  Necropsy: string
  LastAssessedDate: string | null
  MonitorRemoveDate: string | null
  Cow: boolean
}

export type { InjuryCase }

export interface ParsedInjuryCase {
  year: number
  [key: string]: any  // Allow any additional fields
}
