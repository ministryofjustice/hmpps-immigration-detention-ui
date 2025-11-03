import config from '../config'

export default class ImmigrationDetentionDeleteModel {
  constructor(
    public nomsId: string,
    public id: string,
  ) {}

  public backLink(): string {
    return `/${this.nomsId}/immigration-detention/overview`
  }

  public cancelLink(): string {
    return `${config.services.courtCasesReleaseDates.url}/prisoner/${this.nomsId}/overview`
  }
}
