export interface WhaleInjury {
  RecordId: string
  RecordTypeCode: string
  InjuryId: number
  EGNo: string
  CaseId: number | null
  BatchId: number
  BirthYear: number | null
  GenderCode: string
  GenderDescription: string
  FirstYearSighted: number
  Cow: boolean
  InjuryAge: string
  InjuryAgeClass: string
  MinimumAge: number
  InjuryTypeId: number
  InjuryTypeDescription: string
  InjuryAccountId: number
  InjuryAccountDescription: string
  InjurySeverityId: number
  InjurySeverityDescription: string
  InjuryTimeFrame: number | null
  MedicalInterventionDate: string | null
  PreInjurySightingId: number | null
  PreinjuryDate: string
  PreInjurySightingLabel: string
  PreInjuryAreaCode: string
  PreInjuryAreaDescription: string
  PreInjuryLatitude: number | null
  PreInjuryLongitude: number | null
  DetectionSightingId: number
  DetectionDate: string
  DetectionSightingLabel: string
  DetectionAreaCode: string
  DetectionAreaDescription: string
  DetectionLatitude: number
  DetectionLongitude: number
  CountryOriginId: number
  CountryOriginDescription: string
  IsUnusualMortalityEvent: boolean | null
  UnusualMortalityEventId: number | null
  UnusualMortalityEventDescription: string
  IsDead: boolean
  MortalityFieldId: string
  Necropsy: string
  DeathCauseId: number | null
  DeathCauseDescription: string
  HasNecropsyReport: boolean
  HasCaseStudy: boolean
  HasImages: boolean
  LastSightedAliveDate: string
  GearOriginId: number | null
  GearOriginDescription: string
  ConstrictingWrap: string
  LineTrailId: number | null
  LineTrailDescription: string
  MultipleAnchorPoint: string
  GearComplexityId: number | null
  GearComplexityDescription: string
  Disentangled: string
  GearRetrieved: string
  GearRetrievedLocationId: number | null
  GearRetrievedLocationDescription: string
  LineGoneDate: string | null
  ForensicsCompleted: string
  VesselSizeId: number | null
  VesselSizeDescription: string
  InjuryComments: string
  GearMarks: { GearMarkId: number; GearMarkDescription: string }[]
  GearTypes: { GearTypeId: number; GearTypeDescription: string }[]
  RopeDiameters: {
    RopeDiameterId: number
    RopeDiameterDescription: string
  }[]
}

// Simplified interface for injury timeframe chart - only the fields we actually use
export interface InjuryTimeframeData {
  DetectionDate: string
  InjuryTimeFrame: number | null
  InjuryTypeDescription: string
  InjuryAgeClass: string
}

export interface WhaleInjuryResponse {
  pagination: {
    next: string | null
    previous: string | null
    count: number
    page: number
    total_pages: number
    previous_page: number | null
    next_page: number | null
    start_index: number
    end_index: number
  }
  results: WhaleInjury[]
}
