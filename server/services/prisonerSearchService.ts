import { Readable } from 'stream'
import PrisonerSearchApiClient from '../data/prisonerSearchApiClient'
import PrisonApiClient from '../data/prisonApiClient'

import { Context } from './context'
import { UserDetails } from '../data/manageUsersApiClient'
import { Prisoner as PrisonerSearchApiPrisoner } from '../@types/prisonerSearchApi'
import FullPageError from '../model/FullPageError'
import { CaseLoad } from '../@types/prisonApi'

export default class PrisonerSearchService {
  constructor(
    private prisonApiClient: PrisonApiClient,
    private prisonerSearchApiClient: PrisonerSearchApiClient,
  ) {}

  async getPrisonerImage(prisonerNumber: string, user: Context): Promise<Readable> {
    return this.prisonApiClient.getPrisonerImage(prisonerNumber, user.username)
  }

  async getUsersCaseloads(userToken: string): Promise<CaseLoad[]> {
    return this.prisonApiClient.getUsersCaseloads(userToken)
  }

  private isAccessiblePrisoner(agencyId: string, user: UserDetails): boolean {
    return user.caseloads.includes(agencyId) || ['TRN'].includes(agencyId) || this.isReleasedAccessible(agencyId, user)
  }

  private isReleasedAccessible(agencyId: string, user: UserDetails): boolean {
    return user.hasInactiveBookingsAccess && ['OUT'].includes(agencyId)
  }

  async getPrisonerDetails(nomsId: string, user: UserDetails): Promise<PrisonerSearchApiPrisoner> {
    try {
      const prisonerDetails = await this.prisonerSearchApiClient.getPrisonerDetails(nomsId, user.username)
      if (this.isAccessiblePrisoner(prisonerDetails.prisonId, user)) {
        return prisonerDetails
      }
      throw FullPageError.notInCaseLoadError()
    } catch (error) {
      if (error?.status === 404) {
        throw FullPageError.notInCaseLoadError()
      } else {
        throw error
      }
    }
  }
}
