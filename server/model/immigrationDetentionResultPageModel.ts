import ImmigrationDetention from '../@types/ImmigrationDetention'
import config from '../config'

export default class ImmigrationDetentionResultPageModel {
  constructor(
    public nomsId: string,
    public id: string,
    public immigrationDetention: ImmigrationDetention,
  ) {}

  public getSuccessMessage(): string {
    if (this.immigrationDetention?.immigrationDetentionRecordType === 'IS91') {
      return 'IS91 Detention Authority successfully recorded'
    }
    if (this.immigrationDetention?.immigrationDetentionRecordType === 'DEPORTATION_ORDER') {
      return 'Deportation order successfully recorded'
    }
    if (this.immigrationDetention?.immigrationDetentionRecordType === 'IMMIGRATION_BAIL') {
      return 'Immigration bail successfully recorded'
    }
    return 'No longer of interest successfully recorded'
  }

  public getAlertsUrl() {
    return `${config.services.dpsPrisoner.url}/prisoner/${this.nomsId}/alerts/active`
  }

  public getFollowInfo(): string {
    if (
      this.immigrationDetention?.immigrationDetentionRecordType === 'IS91' ||
      this.immigrationDetention?.immigrationDetentionRecordType === 'DEPORTATION_ORDER'
    ) {
      return 'If this person will be detained under immigration powers after their release date, you need to:'
    }
    return 'This person will not be detained under immigration powers after their release. You need to check if there are any alerts that might prevent a release.'
  }

  public backLink(): string {
    return `${config.services.courtCasesReleaseDates.url}/prisoner/${this.nomsId}/overview`
  }

  public cancelLink(): string {
    return `${config.services.courtCasesReleaseDates.url}/prisoner/${this.nomsId}/overview`
  }
}
