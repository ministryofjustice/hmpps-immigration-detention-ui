import { jwtDecode } from 'jwt-decode'
import type { UserDetails } from '../data/manageUsersApiClient'
import ManageUsersApiClient from '../data/manageUsersApiClient'
import { convertToTitleCase } from '../utils/utils'
import PrisonerSearchService from './prisonerSearchService'

export default class UserService {
  constructor(
    private readonly manageUsersApiClient: ManageUsersApiClient,
    private readonly prisonerSearchService: PrisonerSearchService,
  ) {}

  async getUser(userToken: string): Promise<UserDetails> {
    const user = await this.manageUsersApiClient.getUser(userToken)
    const userCaseloads = await this.prisonerSearchService.getUsersCaseloads()
    const roles = this.getUserRoles(userToken)
    return {
      ...user,
      roles,
      ...(user.name && { displayName: convertToTitleCase(user.name) }),
      caseloads: userCaseloads.map(uc => uc.caseLoadId),
      caseloadDescriptions: userCaseloads.map(uc => uc.description),
      caseloadMap: new Map(userCaseloads.map(uc => [uc.caseLoadId, uc.description])),
      isSupportUser: roles.includes('COURTCASE_RELEASEDATE_SUPPORT'),
      hasInactiveBookingsAccess: roles.includes('INACTIVE_BOOKINGS'),
    }
  }

  getUserRoles(userToken: string): string[] {
    const { authorities: roles = [] } = jwtDecode(userToken) as { authorities?: string[] }
    return roles.map(role => role.substring(role.indexOf('_') + 1))
  }
}
