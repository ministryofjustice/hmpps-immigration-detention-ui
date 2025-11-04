import dayjs from 'dayjs'
import ImmigrationDetention from '../@types/ImmigrationDetention'

export default class ImmigrationDetentionDeleteModel {
  constructor(
    public nomsId: string,
    public id: string,
    public immigrationDetention: ImmigrationDetention,
  ) {
    if (this.immigrationDetention.immigrationDetentionRecordType === 'IS91') {
      this.recordTypeDesc = 'IS91'
    } else if (this.immigrationDetention.immigrationDetentionRecordType === 'DEPORTATION_ORDER') {
      this.recordTypeDesc = 'deportation order'
    } else {
      this.recordTypeDesc = 'immigration information'
    }
    this.docDateFormatted = dayjs(immigrationDetention.recordDate).format('D MMMM YYYY')
    this.formattedCreatedAt = dayjs(immigrationDetention.createdAt).format('D MMMM YYYY')
  }

  recordTypeDesc: string

  docDateFormatted: string

  formattedCreatedAt: string

  public backLink(): string {
    return `/${this.nomsId}/immigration-detention/overview`
  }

  public getInfoLink(): string {
    const recordTypeDescWithCamelCase = this.recordTypeDesc.charAt(0).toUpperCase() + this.recordTypeDesc.slice(1)
    return `${recordTypeDescWithCamelCase} dated ${this.docDateFormatted} recorded on ${this.formattedCreatedAt}.`
  }

  public cancelLink(): string {
    return `/${this.nomsId}/immigration-detention/overview`
  }

  public getWarnMessage() {
    return `Deleting will permanently remove this ${this.recordTypeDesc} from their record.`
  }
}
