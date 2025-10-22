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
      return 'This can be found at the top of IS91 document'
    }
    return 'This will be at the top of the deportation order'
  }

  public backLink(): string {
    return `/${this.nomsId}/immigration-detention/add/document-date/${this.id}`
  }

  public cancelLink(): string {
    return `${config.services.courtCasesReleaseDates.url}/prisoner/${this.nomsId}/overview`
  }

  // validator.js
  public validateHORefNumber(value: string) {
    const pattern = /^[A-Z0-9/-]{8,15}$/
    return pattern.test(value)
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
    if (this.validateHORefNumber(this.hoRefNumber) === false) {
      return [
        {
          text: 'The entered Home Office reference number is not valid',
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
