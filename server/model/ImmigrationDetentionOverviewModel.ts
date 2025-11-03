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
  ) {
    const [firstRecord] = immigrationDetentionRecords // Destructure the first element
    super(firstRecord || ({} as ImmigrationDetention))

    if (firstRecord) {
      this.latestRecord = firstRecord
    }
  }

  latestRecord: ImmigrationDetention

  public isNoLongerOfInterest(): boolean {
    return this.latestRecord.immigrationDetentionRecordType === 'NO_LONGER_OF_INTEREST'
  }

  public deleteLinkForLatestRecord(): string {
    return `/${this.nomsId}/immigration-detention/delete/${this.latestRecord.immigrationDetentionUuid}`
  }

  public editLinkForLatestRecord(): string {
    if (this.latestRecord.immigrationDetentionRecordType === 'NO_LONGER_OF_INTEREST') {
      return `/${this.nomsId}/immigration-detention/update/no-longer-interest-reason/${this.latestRecord.immigrationDetentionUuid}`
    }
    return `/${this.nomsId}/immigration-detention/update/document-date/${this.latestRecord.immigrationDetentionUuid}`
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
    return `${this.prisonerName} is no longer of interest to Home Office`
  }

  public getCardTitle() {
    const formattedCreatedAt = dayjs(this.latestRecord.createdAt).format('D MMMM YYYY')
    if (this.latestRecord.immigrationDetentionRecordType === 'IS91') {
      return `IS91 recorded on ${formattedCreatedAt}`
    }
    if (this.latestRecord.immigrationDetentionRecordType === 'DEPORTATION_ORDER') {
      return `Deportation order recorded on ${formattedCreatedAt}`
    }
    return `No longer of interest recorded on ${formattedCreatedAt}`
  }

  private actionCell(immigrationDetention: ImmigrationDetention) {
    if (
      immigrationDetention.immigrationDetentionRecordType === 'DEPORTATION_ORDER' ||
      immigrationDetention.immigrationDetentionRecordType === 'IS91'
    ) {
      return {
        html: `
      <div class="govuk-grid-column-one-quarter govuk-!-margin-right-4 govuk-!-padding-0">
        <a class="govuk-link" href="/${this.nomsId}/immigration-detention/update/document-date/${immigrationDetention.immigrationDetentionUuid}" data-qa="edit-${immigrationDetention.immigrationDetentionUuid}">
          Edit
        </a>
      </div>
    `,
      }
    }
    return {
      html: `
      <div class="govuk-grid-column-one-quarter govuk-!-margin-right-4 govuk-!-padding-0">
        <a class="govuk-link" href="/${this.nomsId}/immigration-detention/update/no-longer-interest-reason/${this.latestRecord.immigrationDetentionUuid}" data-qa="edit-${immigrationDetention.immigrationDetentionUuid}">
          Edit
        </a>
      </div>
    `,
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
