import dayjs from 'dayjs'
import ImmigrationDetention from '../@types/ImmigrationDetention'
import config from '../config'
import immigrationDetentionNoLongerInterestTypes from './immigrationDetentionNoLongerInterestTypes'
import immigrationDetentionRecordTypes from './immigrationDetentionRecordTypes'
import ImmigrationDetentionReviewCommonModel from './immigrationDetentionReviewCommonModel'

export default class ImmigrationDetentionOverviewModel extends ImmigrationDetentionReviewCommonModel {
  constructor(
    public nomsId: string,
    public prisonerName: string,
    public immigrationDetentionRecords: ImmigrationDetention[],
    public roles: string[],
  ) {
    const sortedRecords = immigrationDetentionRecords.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    const [firstRecord] = sortedRecords
    super(firstRecord || ({} as ImmigrationDetention))

    this.immigrationDetentionRecords = sortedRecords
    if (firstRecord) {
      this.latestRecord = firstRecord
    }
  }

  latestRecord: ImmigrationDetention

  public isNoLongerOfInterest(): boolean {
    return this.latestRecord.immigrationDetentionRecordType === 'NO_LONGER_OF_INTEREST'
  }

  private hasImmigrationDetentionAdminRole(): boolean {
    return this.roles && this.roles.indexOf('IMMIGRATION_DETENTION_ADMIN') !== -1
  }

  public deleteLinkForLatestRecord(): string | undefined {
    if (this.latestRecord.source !== 'NOMIS') {
      return `/${this.nomsId}/immigration-detention/delete/${this.latestRecord.immigrationDetentionUuid}`
    }
    return undefined
  }

  public editLinkForLatestRecord(): string | undefined {
    if (this.latestRecord.source !== 'NOMIS') {
      if (this.latestRecord.immigrationDetentionRecordType === 'NO_LONGER_OF_INTEREST') {
        return `/${this.nomsId}/immigration-detention/update/no-longer-interest-reason/${this.latestRecord.immigrationDetentionUuid}`
      }
      return `/${this.nomsId}/immigration-detention/update/document-date/${this.latestRecord.immigrationDetentionUuid}`
    }
    return undefined
  }

  public backlink(): string {
    return `${config.services.courtCasesReleaseDates.url}/prisoner/${this.nomsId}/overview`
  }

  public columnHeadings() {
    return [{ text: 'Document Type' }, { text: 'Date' }, { text: 'Details' }, { text: '' }, { text: '' }]
  }

  public overviewTable() {
    return {
      head: this.columnHeadings(),
      rows: this.rows(),
      attributes: { 'data-qa': 'view-overview-table' },
    }
  }

  public rows() {
    return this.immigrationDetentionRecords.slice(1).map(it => {
      let details
      const date = it.recordDate
      if (it.immigrationDetentionRecordType === 'NO_LONGER_OF_INTEREST') {
        details =
          immigrationDetentionNoLongerInterestTypes.find(nLIT => nLIT.value === it.noLongerOfInterestReason)?.text || ''
        if (it.noLongerOfInterestReason === 'OTHER_REASON') {
          details += ` : ${it.noLongerOfInterestComment}`
        }
      } else {
        details = it.homeOfficeReferenceNumber
      }

      return [
        {
          text:
            immigrationDetentionRecordTypes.find(rt => rt.value === it.immigrationDetentionRecordType)?.text ||
            '' ||
            'Unknown',
        },
        { html: dayjs(date).format('D MMMM YYYY') },
        { text: details },
        this.isNOMIS(it),
        this.actionCell(it),
      ]
    })
  }

  public getMessageOfLatestRecord() {
    if (this.latestRecord.immigrationDetentionRecordType === 'IS91') {
      return 'An IS91 Detention Authority has been recorded'
    }
    if (this.latestRecord.immigrationDetentionRecordType === 'DEPORTATION_ORDER') {
      return 'A Deportation order has been recorded'
    }
    if (this.latestRecord.immigrationDetentionRecordType === 'IMMIGRATION_BAIL') {
      return 'Immigration bail has been recorded'
    }
    return `${this.prisonerName} is no longer of interest to Home Office`
  }

  public getCardTitle() {
    const formattedCreatedAt = dayjs(this.latestRecord.createdAt).format('D MMMM YYYY')
    let message
    if (this.latestRecord.immigrationDetentionRecordType === 'IS91') {
      message = `IS91 recorded on ${formattedCreatedAt}`
    } else if (this.latestRecord.immigrationDetentionRecordType === 'DEPORTATION_ORDER') {
      message = `Deportation order recorded on ${formattedCreatedAt}`
    } else if (this.latestRecord.immigrationDetentionRecordType === 'IMMIGRATION_BAIL') {
      message = `Immigration bail recorded on ${formattedCreatedAt}`
    } else {
      message = `No longer of interest recorded on ${formattedCreatedAt}`
    }
    if (this.latestRecord.source === 'NOMIS') {
      message += ' via NOMIS'
    }
    return message
  }

  public getDocumentDateKeyText() {
    if (this.latestRecord.immigrationDetentionRecordType === 'IMMIGRATION_BAIL') {
      return 'Bail granted date'
    }
    return 'Date on document'
  }

  public getReferenceKeyText() {
    if (this.latestRecord.immigrationDetentionRecordType === 'IMMIGRATION_BAIL') {
      return 'Document reference number'
    }
    return 'Home office reference number'
  }

  private actionCell(immigrationDetention: ImmigrationDetention) {
    let deleteLink

    if (this.hasImmigrationDetentionAdminRole() && immigrationDetention.source !== 'NOMIS') {
      deleteLink = `<div class="govuk-grid-column-one-quarter govuk-!-margin-right-4 govuk-!-padding-0">
          <a class="govuk-link" href="/${this.nomsId}/immigration-detention/delete/${immigrationDetention.immigrationDetentionUuid}" data-qa="edit-${immigrationDetention.immigrationDetentionUuid}">
            Delete
            </a>
            </div>`
    }

    if (
      (immigrationDetention.immigrationDetentionRecordType === 'DEPORTATION_ORDER' ||
        immigrationDetention.immigrationDetentionRecordType === 'IS91' ||
        immigrationDetention.immigrationDetentionRecordType === 'IMMIGRATION_BAIL') &&
      immigrationDetention.source !== 'NOMIS'
    ) {
      return {
        html: `
      <div class="govuk-grid-column-one-quarter govuk-!-margin-right-4 govuk-!-padding-0">
        <a class="govuk-link" href="/${this.nomsId}/immigration-detention/update/document-date/${immigrationDetention.immigrationDetentionUuid}" data-qa="edit-${immigrationDetention.immigrationDetentionUuid}">
          Edit
        </a>
      </div>
       ${deleteLink || ''}
    `,
      }
    }
    if (immigrationDetention.source !== 'NOMIS') {
      return {
        html: `
      <div class="govuk-grid-column-one-quarter govuk-!-margin-right-4 govuk-!-padding-0">
        <a class="govuk-link" href="/${this.nomsId}/immigration-detention/update/no-longer-interest-reason/${immigrationDetention.immigrationDetentionUuid}" data-qa="edit-${immigrationDetention.immigrationDetentionUuid}">
          Edit
        </a>
      </div>
       ${deleteLink || ''}
    `,
      }
    }
    return {
      html: '',
    }
  }

  private isNOMIS(immigrationDetention: ImmigrationDetention) {
    if (immigrationDetention.source === 'NOMIS') {
      return {
        html: `<strong class="govuk-tag">NOMIS</strong>`,
      }
    }
    return { html: '' }
  }

  public addImmigrationDetentionLink(): string {
    return `/${this.nomsId}/immigration-detention/add`
  }
}
