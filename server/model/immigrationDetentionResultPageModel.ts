import ImmigrationDetentionTypes from '../@types/ImmigrationDetentionTypes'
import config from '../config'

export default class ImmigrationDetentionResultPageModel {
  constructor(
    public nomsId: string,
    public id: string,
    public immigrationDetention: ImmigrationDetentionTypes,
  ) {}

  public getSuccessMessage(): string {
    if (this.immigrationDetention?.recordType === 'IS91') {
      return 'IS91 Detention Authority successfully recorded'
    }
    return 'Deportation order successfully recorded'
  }

  public getFollowInfo(): string {
    if (this.immigrationDetention?.recordType === 'IS91') {
      return 'To prevent release when a IS91 Detention Authority has been issued, you need to:'
    }
    return 'If this deportation order will impact the release schedule, you need to:'
  }

  public backLink(): string {
    return `${this.nomsId}/immigrationDetention/add/review/${this.id}`
  }

  public cancelLink(): string {
    return `${config.services.courtCasesReleaseDates.url}/prisoner/${this.nomsId}/overview`
  }
}
