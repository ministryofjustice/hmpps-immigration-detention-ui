import dayjs from 'dayjs'
import ImmigrationDetentionTypes from '../@types/ImmigrationDetentionTypes'
import config from '../config'
import immigrationDetentionRecordTypes from './immigrationDetentionRecordTypes'
import ValidationError from './validationError'
import immigrationDetentionNoLongerInterestTypes from './immigrationDetentionNoLongerInterestTypes'

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
    this.noLongerInterestReasonDesc =
      immigrationDetentionNoLongerInterestTypes.find(it => it.value === immigrationDetention.noLongerOfInterestReason)
        ?.text || ''
    if (immigrationDetention.noLongerOfInterestReason === 'OTHER') {
      this.noLongerInterestReasonDesc += ` : ${immigrationDetention.noLongerOfInterestOtherComment}`
    }
    this.confirmedDateFormatted = dayjs(immigrationDetention.noLongerOfInterestConfirmedDate).format('D MMMM YYYY')
  }

  recordTypeDesc: string

  docDateFormatted: string

  hoRefNumber: string

  noLongerInterestReasonDesc: string

  confirmedDateFormatted: string

  errors: ValidationError[] = []

  public backLink(): string {
    if (this.immigrationDetention?.recordType === 'NO_LONGER_OF_INTEREST') {
      return `/${this.nomsId}/immigration-detention/add/confirmed-date/${this.id}`
    }
    return `/${this.nomsId}/immigration-detention/add/ho-ref/${this.id}`
  }

  public isNoLongerOfInterest(): boolean {
    return this.immigrationDetention.recordType === 'NO_LONGER_OF_INTEREST'
  }

  public getCaption() {
    if (this.immigrationDetention?.recordType === 'IS91') {
      return 'Record IS91 Detention Authority'
    }
    if (this.immigrationDetention?.recordType === 'DEPORTATION_ORDER') {
      return 'Record Deportation Order'
    }
    return 'Record Immigration Information'
  }

  public cancelLink(): string {
    return `${config.services.courtCasesReleaseDates.url}/prisoner/${this.nomsId}/overview`
  }
}
