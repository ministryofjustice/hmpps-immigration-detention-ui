import { AuditServiceFactory } from '@ministryofjustice/hmpps-audit-client'
import { dataAccess } from '../data'
import AuditService from './auditService'
import FeComponentsService from './feComponentsService'
import UserService from './userService'
import PrisonerSearchService from './prisonerSearchService'
import ImmigrationDetentionStoreService from './immigrationDetentionStoreService'
import ImmigrationDetentionService from './immigrationDetentionService'
import ParamStoreService from './paramStoreService'
import CourtCaseReleaseDatesService from './courtCaseReleaseDatesService'
import logger from '../../logger'
import config from '../config'

export const services = () => {
  const {
    applicationInfo,
    feComponentsClient,
    manageUsersApiClient,
    prisonApiClient,
    prisonerSearchClient,
    remandAndSentencingApiClient,
    courtCaseReleaseDatesApiClient,
  } = dataAccess()
  const prisonerSearchService = new PrisonerSearchService(prisonApiClient, prisonerSearchClient)
  const immigrationDetentionStoreService = new ImmigrationDetentionStoreService()
  const immigrationDetentionService = new ImmigrationDetentionService(remandAndSentencingApiClient)
  const paramStoreService = new ParamStoreService()
  const courtCaseReleaseDatesService = new CourtCaseReleaseDatesService(courtCaseReleaseDatesApiClient)

  return {
    applicationInfo,
    auditService: new AuditService(AuditServiceFactory.createInstance(config.sqs.audit, logger)),
    feComponentsService: new FeComponentsService(feComponentsClient),
    userService: new UserService(manageUsersApiClient, prisonerSearchService),
    prisonerSearchService,
    immigrationDetentionStoreService,
    immigrationDetentionService,
    paramsStoreService: paramStoreService,
    courtCaseReleaseDatesService,
  }
}

export type Services = ReturnType<typeof services>
