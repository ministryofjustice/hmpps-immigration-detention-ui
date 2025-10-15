import dayjs from 'dayjs'
import ImmigrationDetentionTypes from '../@types/ImmigrationDetentionTypes'
import config from '../config'
import immigrationDetentionRecordTypes from './immigrationDetentionRecordTypes'
import ValidationError from './validationError'

export default class ImmigrationDetentionReviewModel {
  constructor(
    public nomsId: string,
    public id: string,
    public immigrationDetention: ImmigrationDetentionTypes,
  ) {
    this.recordTypeDesc =
      immigrationDetentionRecordTypes.find(it => it.value === immigrationDetention.recordType)?.text || ''
    this.docDateFormatted = dayjs(immigrationDetention.documentDate).format('D MMMM YYYY')
    this.hoRefNumber = immigrationDetention.homeOfficeRefNo
  }

  recordTypeDesc: string

  docDateFormatted: string

  hoRefNumber: string

  errors: ValidationError[] = []

  public backLink(): string {
    return `${this.nomsId}/immigrationDetention/add/hoRef/${this.id}`
  }

  public getCaption() {
    if (this.hoRefNumber === 'IS91' || this.immigrationDetention?.recordType === 'IS91') {
      return 'Record IS91 Detention Authority'
    }
    return 'Record Deportation Order'
  }

  public cancelLink(): string {
    return `${config.services.courtCasesReleaseDates.url}/prisoner/${this.nomsId}/overview`
  }
}
