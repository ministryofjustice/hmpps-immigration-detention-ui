import ImmigrationDetentionTypes from '../@types/ImmigrationDetentionTypes'
import config from '../config'
import ValidationError from './validationError'

export default class ImmigrationDetentionHORefModel {
  constructor(
    public nomsId: string,
    public id: string,
    public immigrationDetention: ImmigrationDetentionTypes,
    public hoRefNumber?: string,
  ) {
    if (!this.hoRefNumber) {
      this.hoRefNumber = immigrationDetention?.homeOfficeRefNo
    }
  }

  errors: ValidationError[] = []

  public getCaption() {
    if (this.hoRefNumber === 'IS91' || this.immigrationDetention?.recordType === 'IS91') {
      return 'Record IS91 Detention Authority'
    }
    return 'Record Deportation Order'
  }

  public getHintText() {
    if (this.hoRefNumber === 'IS91' || this.immigrationDetention?.recordType === 'IS91') {
      return '<strong data-qa=ho-ref-hint-text>This can be found at the top of IS91 document</strong>'
    }
    return '<strong data-qa=ho-ref-hint-text>This will be at the top of the deportation order</strong>'
  }

  public backLink(): string {
    return `${this.nomsId}/immigrationDetention/add/documentDate/${this.id}`
  }

  public cancelLink(): string {
    return `${config.services.courtCasesReleaseDates.url}/prisoner/${this.nomsId}/overview`
  }

  async validation(): Promise<ValidationError[]> {
    if (!this.hoRefNumber) {
      return [
        {
          text: 'Enter the Home Office reference number',
          fields: ['refNumber'],
        },
      ]
    }
    return []
  }

  errorList() {
    return this.errors.map(it => {
      return {
        text: it.text,
        html: it.html,
        href: it.fields.length ? `#${it.fields[0]}` : null,
      }
    })
  }
}
