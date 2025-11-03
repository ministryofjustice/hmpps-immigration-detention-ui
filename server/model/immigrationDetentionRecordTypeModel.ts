import ImmigrationDetention from '../@types/ImmigrationDetention'
import config from '../config'
import immigrationDetentionRecordTypes from './immigrationDetentionRecordTypes'

export default class ImmigrationDetentionRecordTypeModel {
  constructor(
    public nomsId: string,
    public id: string,
    public immigrationDetention: ImmigrationDetention,
    public notSelected?: boolean,
  ) {}

  public backlink(): string {
    return `${config.services.courtCasesReleaseDates.url}/prisoner/${this.nomsId}/overview`
  }

  public cancelLink(): string {
    return `${config.services.courtCasesReleaseDates.url}/prisoner/${this.nomsId}/overview`
  }

  public errorMessage(): { text: string; href: string } {
    return this.notSelected
      ? {
          text: 'You must select an option',
          href: '#immigrationDetentionRecordType',
        }
      : null
  }

  recordTypes() {
    const recordType = this.immigrationDetention?.immigrationDetentionRecordType
    return immigrationDetentionRecordTypes.map(it => ({
      ...it,
      checked: recordType === it.value,
    }))
  }
}
