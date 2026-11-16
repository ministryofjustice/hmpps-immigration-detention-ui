import { CcrdServiceDefinitions } from '../@types/courtCasesReleaseDatesApi'
import CourtCaseReleaseDatesApiClient from '../data/courtCaseReleaseDatesApiClient'

export default class CourtCaseReleaseDatesService {
  constructor(private readonly courtCaseReleaseDatesApiClient: CourtCaseReleaseDatesApiClient) {}

  public async getServiceDefinitions(prisonerId: string, token: string): Promise<CcrdServiceDefinitions> {
    return this.courtCaseReleaseDatesApiClient.getServiceDefinitions(prisonerId, token)
  }
}
