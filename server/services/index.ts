import { dataAccess } from '../data'
import AuditService from './auditService'
import FeComponentsService from './feComponentsService'
import UserService from './userService'
import PrisonerSearchService from './prisonerSearchService'
import ImmigrationDetentionStoreService from './immigrationDetentionStoreService'

export const services = () => {
  const {
    applicationInfo,
    hmppsAuditClient,
    feComponentsClient,
    manageUsersApiClient,
    prisonApiClient,
    prisonerSearchClient,
  } = dataAccess()
  const prisonerSearchService = new PrisonerSearchService(prisonApiClient, prisonerSearchClient)
  const immigrationDetentionStoreService = new ImmigrationDetentionStoreService()

  return {
    applicationInfo,
    auditService: new AuditService(hmppsAuditClient),
    feComponentsService: new FeComponentsService(feComponentsClient),
    userService: new UserService(manageUsersApiClient, prisonerSearchService),
    prisonerSearchService,
    immigrationDetentionStoreService,
  }
}

export type Services = ReturnType<typeof services>
