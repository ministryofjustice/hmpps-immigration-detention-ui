import { dataAccess } from '../data'
import AuditService from './auditService'
import FeComponentsService from './feComponentsService'

export const services = () => {
  const { applicationInfo, hmppsAuditClient, feComponentsClient } = dataAccess()

  return {
    applicationInfo,
    auditService: new AuditService(hmppsAuditClient),
    feComponentsService: new FeComponentsService(feComponentsClient),
  }
}

export type Services = ReturnType<typeof services>
