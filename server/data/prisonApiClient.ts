import type { Readable } from 'stream'
import { ApiConfig, AuthOptions, AuthenticationClient, RestClient } from '@ministryofjustice/hmpps-rest-client'

import config from '../config'
import logger from '../../logger'
import { PrisonApiUserCaseloads } from '../@types/prisonApi/prisonClientTypes'

export interface Agency {
  agencyId: string
  description: string
  agencyType: string
  active: boolean
}

export default class PrisonApiClient extends RestClient {
  constructor(authenticationClient: AuthenticationClient) {
    super('Prison API', config.apis.prisonApi as ApiConfig, logger, authenticationClient)
  }

  async getUsersCaseloads(): Promise<PrisonApiUserCaseloads[]> {
    return this.get({ path: `/api/users/me/caseLoads` }) as Promise<PrisonApiUserCaseloads[]>
  }

  getPrisonerImage(prisonerNumber: string, authOptions: AuthOptions): Promise<Readable> {
    return this.stream(
      {
        path: `/api/bookings/offenderNo/${prisonerNumber}/image/data`,
        errorLogger: (path, method, error) => {
          if (error.responseStatus === 404) {
            logger.info(`No prisoner image available for prisonerNumber: ${prisonerNumber}`)
          } else {
            this.logError(path, method, error)
          }
        },
      },
      authOptions,
    ) as Promise<Readable>
  }
}
