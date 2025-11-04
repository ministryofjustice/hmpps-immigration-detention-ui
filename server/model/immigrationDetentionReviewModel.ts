import ImmigrationDetention from '../@types/ImmigrationDetention'
import config from '../config'
import ValidationError from './validationError'
import ImmigrationDetentionReviewCommonModel from './immigrationDetentionReviewCommonModel'

export default class ImmigrationDetentionReviewModel extends ImmigrationDetentionReviewCommonModel {
  constructor(
    public nomsId: string,
    public id: string,
    public immigrationDetention: ImmigrationDetention,
  ) {
    super(immigrationDetention)
  }

  errors: ValidationError[] = []

  public backLink(): string {
    if (this.immigrationDetention?.immigrationDetentionRecordType === 'NO_LONGER_OF_INTEREST') {
      return `/${this.nomsId}/immigration-detention/add/confirmed-date/${this.id}`
    }
    return `/${this.nomsId}/immigration-detention/add/ho-ref/${this.id}`
  }

  public isNoLongerOfInterest(): boolean {
    return this.immigrationDetention.immigrationDetentionRecordType === 'NO_LONGER_OF_INTEREST'
  }

  public getCaption() {
    if (this.immigrationDetention?.immigrationDetentionRecordType === 'IS91') {
      return 'Record IS91 Detention Authority'
    }
    if (this.immigrationDetention?.immigrationDetentionRecordType === 'DEPORTATION_ORDER') {
      return 'Record Deportation Order'
    }
    return 'Record Immigration Information'
  }

  public cancelLink(): string {
    return `${config.services.courtCasesReleaseDates.url}/prisoner/${this.nomsId}/overview`
  }
}
