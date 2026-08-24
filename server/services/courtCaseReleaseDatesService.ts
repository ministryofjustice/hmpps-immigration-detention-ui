import { CcrdServiceDefinitions } from '../@types/courtCaseReleaseDatesApi/types'
import CourtCasesReleaseDatesApiClient from '../data/courtCaseReleaseDatesApiClient'

export default class CourtCasesReleaseDatesService {
  constructor(private readonly courtCasesReleaseDatesApiClient: CourtCasesReleaseDatesApiClient) {}

  public async getServiceDefinitions(prisonerId: string, token: string): Promise<CcrdServiceDefinitions> {
    return this.courtCasesReleaseDatesApiClient.getServiceDefinitions(prisonerId, token)
  }
}
