import { ApiConfig, RestClient, asUser } from '@ministryofjustice/hmpps-rest-client'

import logger from '../../logger'
import config from '../config'

export interface User {
  userRoles?: string[]
  token?: string
  username: string
  name?: string
  active?: boolean
  authSource?: string
  uuid?: string
  userId?: string
  activeCaseLoadId?: string // Will be removed from User. For now, use 'me/caseloads' endpoint in 'nomis-user-roles-api'
}

export interface UserDetails extends User {
  displayName: string
  roles: string[]
  caseloads: string[]
  caseloadDescriptions: string[]
  caseloadMap: Map<string, string>
  isSupportUser: boolean
  hasInactiveBookingsAccess: boolean
}

export default class ManageUsersApiClient extends RestClient {
  constructor() {
    super('Manage Users Api Client', config.apis.manageUsersApi as ApiConfig, logger)
  }

  getUser(token: string): Promise<User> {
    return this.get<User>({ path: '/users/me' }, asUser(token))
  }
}
