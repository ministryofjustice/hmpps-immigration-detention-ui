import HmppsAuditClient, { AuditEvent } from '../data/hmppsAuditClient'

export enum Page {
  EXAMPLE_PAGE = 'EXAMPLE_PAGE',
}

export interface PageViewEventDetails {
  who: string
  subjectId?: string
  subjectType?: string
  correlationId?: string
  details?: object
}

export default class AuditService {
  constructor(private readonly hmppsAuditClient: HmppsAuditClient) {}

  async logAuditEvent(event: AuditEvent) {
    await this.hmppsAuditClient.sendMessage(event)
  }

  async logPageView(page: Page, eventDetails: PageViewEventDetails) {
    const event: AuditEvent = {
      ...eventDetails,
      what: `PAGE_VIEW_${page}`,
    }
    await this.hmppsAuditClient.sendMessage(event)
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

    await this.hmppsAuditClient.sendMessage({
      who: username,
      what: `CREATE_IMMIGRATION_DET`,
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

    await this.hmppsAuditClient.sendMessage({
      who: username,
      what: `EDIT_IMMIGRATION_DET`,
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

    await this.hmppsAuditClient.sendMessage({
      who: username,
      what: `DELETE_IMMIGRATION_DET`,
      subjectId: nomsId,
      subjectType: 'PRISONER_ID',
      correlationId,
      details: auditDetails,
    })
  }
}
