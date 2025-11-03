import { dataAccess } from '../data'
import AuditService from './auditService'
import FeComponentsService from './feComponentsService'
import UserService from './userService'
import PrisonerSearchService from './prisonerSearchService'
import ImmigrationDetentionStoreService from './immigrationDetentionStoreService'
import ImmigrationDetentionService from './immigrationDetentionService'
import ParamStoreService from './paramStoreService'

export const services = () => {
  const {
    applicationInfo,
    hmppsAuditClient,
    feComponentsClient,
    manageUsersApiClient,
    prisonApiClient,
    prisonerSearchClient,
    remandAndSentencingApiClient,
  } = dataAccess()
  const prisonerSearchService = new PrisonerSearchService(prisonApiClient, prisonerSearchClient)
  const immigrationDetentionStoreService = new ImmigrationDetentionStoreService()
  const immigrationDetentionService = new ImmigrationDetentionService(remandAndSentencingApiClient)
  const paramStoreService = new ParamStoreService()

  return {
    applicationInfo,
    auditService: new AuditService(hmppsAuditClient),
    feComponentsService: new FeComponentsService(feComponentsClient),
    userService: new UserService(manageUsersApiClient, prisonerSearchService),
    prisonerSearchService,
    immigrationDetentionStoreService,
    immigrationDetentionService,
    paramsStoreService: paramStoreService,
  }
}

export type Services = ReturnType<typeof services>
