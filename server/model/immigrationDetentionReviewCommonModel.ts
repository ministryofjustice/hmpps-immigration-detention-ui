import dayjs from 'dayjs'
import immigrationDetentionNoLongerInterestTypes from './immigrationDetentionNoLongerInterestTypes'
import ImmigrationDetention from '../@types/ImmigrationDetention'
import immigrationDetentionRecordTypes from './immigrationDetentionRecordTypes'

export default class ImmigrationDetentionReviewCommonModel {
  constructor(immigrationDetention: ImmigrationDetention) {
    this.recordTypeDesc =
      immigrationDetentionRecordTypes.find(it => it.value === immigrationDetention.immigrationDetentionRecordType)
        ?.text || ''
    this.docDateFormatted = dayjs(immigrationDetention.recordDate).format('D MMMM YYYY')
    this.hoRefNumber = immigrationDetention.homeOfficeReferenceNumber
    this.noLongerInterestReasonDesc =
      immigrationDetentionNoLongerInterestTypes.find(it => it.value === immigrationDetention.noLongerOfInterestReason)
        ?.text || ''
    if (immigrationDetention.noLongerOfInterestReason === 'OTHER_REASON') {
      this.noLongerInterestReasonDesc += ` : ${immigrationDetention.noLongerOfInterestComment}`
    }
    this.confirmedDateFormatted = dayjs(immigrationDetention.recordDate).format('D MMMM YYYY')
  }

  recordTypeDesc: string

  docDateFormatted: string

  hoRefNumber: string

  noLongerInterestReasonDesc: string

  confirmedDateFormatted: string
}
