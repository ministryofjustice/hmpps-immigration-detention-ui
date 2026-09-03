import { AuthenticationClient, InMemoryTokenStore, RedisTokenStore } from '@ministryofjustice/hmpps-auth-clients'
import { createRedisClient } from './redisClient'
import config from '../config'
import logger from '../../logger'
import FeComponentsClient from './feComponentsClient'
import PrisonApiClient from './prisonApiClient'
import PrisonerSearchApiClient from './prisonerSearchApiClient'
import ManageUsersApiClient from './manageUsersApiClient'
import RemandAndSentencingApiClient from './remandAndSentencingApiClient'
import CourtCaseReleaseDatesApiClient from './courtCaseReleaseDatesApiClient'
import applicationInfoSupplier from '../applicationInfo'

const applicationInfo = applicationInfoSupplier()

export const dataAccess = () => {
  const authenticationClient = new AuthenticationClient(
    config.apis.hmppsAuth,
    logger,
    config.redis.enabled ? new RedisTokenStore(createRedisClient()) : new InMemoryTokenStore(),
  )

  return {
    applicationInfo,
    authenticationClient,
    feComponentsClient: new FeComponentsClient(authenticationClient),
    manageUsersApiClient: new ManageUsersApiClient(),
    prisonApiClient: new PrisonApiClient(authenticationClient),
    prisonerSearchClient: new PrisonerSearchApiClient(authenticationClient),
    remandAndSentencingApiClient: new RemandAndSentencingApiClient(authenticationClient),
    courtCaseReleaseDatesApiClient: new CourtCaseReleaseDatesApiClient(authenticationClient),
  }
}

export type DataAccess = ReturnType<typeof dataAccess>

export { AuthenticationClient }
