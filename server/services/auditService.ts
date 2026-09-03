import { AuditEvent, AuditService as HmppsAuditService } from '@ministryofjustice/hmpps-audit-client'

export enum Page {
  EXAMPLE_PAGE = 'EXAMPLE_PAGE',
  IMMIGRATION_OVERVIEW = 'IMMIGRATION_OVERVIEW',
}

export interface PageViewEventDetails {
  who: string
  subjectId?: string
  subjectType?: AuditEvent['subjectType']
  correlationId?: string
  details?: Record<string, unknown>
}

export default class AuditService {
  constructor(private readonly hmppsAuditService: HmppsAuditService) {}

  async logAuditEvent(event: AuditEvent) {
    await this.hmppsAuditService.logAuditEvent(event)
  }

  async logPageView(page: Page, eventDetails: PageViewEventDetails) {
    await this.hmppsAuditService.logAuditEvent({
      ...eventDetails,
      action: `PAGE_VIEW_${page}`,
    })
  }

  async logImmigrationDetentionAddEvent(
    username: string,
    nomsId: string,
    correlationId: string,
    immigrationDetentionUuid: string,
  ) {
    const auditDetails = {
      immigrationDetentionUuid,
      time: Date.now(),
    }

    await this.hmppsAuditService.logAuditEvent({
      who: username,
      action: 'CREATE_IMMIGRATION_DET',
      subjectId: nomsId,
      subjectType: 'PRISONER_ID',
      correlationId,
      details: auditDetails,
    })
  }

  async logImmigrationDetentionEditEvent(
    username: string,
    nomsId: string,
    correlationId: string,
    immigrationDetentionUuid: string,
  ) {
    const auditDetails = {
      immigrationDetentionUuid,
      time: Date.now(),
    }

    await this.hmppsAuditService.logAuditEvent({
      who: username,
      action: 'EDIT_IMMIGRATION_DET',
      subjectId: nomsId,
      subjectType: 'PRISONER_ID',
      correlationId,
      details: auditDetails,
    })
  }

  async logImmigrationDetentionDeleteEvent(
    username: string,
    nomsId: string,
    correlationId: string,
    immigrationDetentionUuid: string,
  ) {
    const auditDetails = {
      immigrationDetentionUuid,
      time: Date.now(),
    }

    await this.hmppsAuditService.logAuditEvent({
      who: username,
      action: 'DELETE_IMMIGRATION_DET',
      subjectId: nomsId,
      subjectType: 'PRISONER_ID',
      correlationId,
      details: auditDetails,
    })
  }
}
