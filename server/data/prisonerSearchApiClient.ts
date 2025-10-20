import { ApiConfig, asSystem, RestClient } from '@ministryofjustice/hmpps-rest-client'
import { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'

import config from '../config'
import logger from '../../logger'
import { PrisonerSearchApiPrisoner } from '../@types/prisonerSearchApi/prisonerSearchTypes'

export default class PrisonerSearchApiClient extends RestClient {
  constructor(authenticationClient: AuthenticationClient) {
    super('Prisoner Search API Client', config.apis.prisonerSearchApi as ApiConfig, logger, authenticationClient)
  }

  async getPrisonerDetails(nomsId: string, username: string): Promise<PrisonerSearchApiPrisoner> {
    return this.get({ path: `/prisoner/${nomsId}` }, asSystem(username)) as Promise<PrisonerSearchApiPrisoner>
  }
}
