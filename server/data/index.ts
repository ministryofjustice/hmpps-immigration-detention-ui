/* eslint-disable import/first */
/*
 * Do appinsights first as it does some magic instrumentation work, i.e. it affects other 'require's
 * In particular, applicationinsights automatically collects bunyan logs
 */
import { AuthenticationClient, InMemoryTokenStore, RedisTokenStore } from '@ministryofjustice/hmpps-auth-clients'
import { initialiseAppInsights, buildAppInsightsClient } from '../utils/azureAppInsights'
import applicationInfoSupplier from '../applicationInfo'

const applicationInfo = applicationInfoSupplier()
initialiseAppInsights()
buildAppInsightsClient(applicationInfo)

import { createRedisClient } from './redisClient'
import config from '../config'
import logger from '../../logger'
import HmppsAuditClient from './hmppsAuditClient'
import FeComponentsClient from './feComponentsClient'
import PrisonApiClient from './prisonApiClient'
import PrisonerSearchApiClient from './prisonerSearchApiClient'
import ManageUsersApiClient from './manageUsersApiClient'

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
    hmppsAuditClient: new HmppsAuditClient(config.sqs.audit),
    manageUsersApiClient: new ManageUsersApiClient(),
    prisonApiClient: new PrisonApiClient(authenticationClient),
    prisonerSearchClient: new PrisonerSearchApiClient(authenticationClient),
  }
}

export type DataAccess = ReturnType<typeof dataAccess>

export { AuthenticationClient, HmppsAuditClient }
