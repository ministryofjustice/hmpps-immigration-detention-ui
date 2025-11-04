import ImmigrationDetention from '../@types/ImmigrationDetention'
import config from '../config'
import ValidationError from './validationError'

export default class ImmigrationDetentionHORefModel {
  constructor(
    public nomsId: string,
    public id: string,
    public immigrationDetention: ImmigrationDetention,
    public addOrEditOrUpdate?: string,
    public hoRefNumber?: string,
  ) {
    if (!this.hoRefNumber) {
      this.hoRefNumber = immigrationDetention?.homeOfficeReferenceNumber
    }
  }

  errors: ValidationError[] = []

  public getCaption() {
    if (this.hoRefNumber === 'IS91' || this.immigrationDetention?.immigrationDetentionRecordType === 'IS91') {
      return 'Record IS91 Detention Authority'
    }
    return 'Record Deportation Order'
  }

  public getHintText() {
    if (this.hoRefNumber === 'IS91' || this.immigrationDetention?.immigrationDetentionRecordType === 'IS91') {
      return 'This can be found at the top of IS91 document'
    }
    return 'This will be at the top of the deportation order'
  }

  public backLink(): string {
    if (this.addOrEditOrUpdate === 'edit') {
      return `/${this.nomsId}/immigration-detention/${this.addOrEditOrUpdate}/review/${this.id}`
    }
    return `/${this.nomsId}/immigration-detention/${this.addOrEditOrUpdate}/document-date/${this.id}`
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
    const validPattern = /^[A-Z0-9/]+$/ // Allows only uppercase letters, numbers, and forward slash '/'
    const errors: ValidationError[] = []

    if (!this.hoRefNumber) {
      errors.push({
        text: 'Enter the Home Office reference number',
        fields: ['refNumber'],
      })
    }

    if (this.hoRefNumber && (this.hoRefNumber.length < 8 || this.hoRefNumber.length > 16)) {
      errors.push({
        text: 'The Home Office reference number should be between 8 to 16 characters.',
        fields: ['refNumber'],
      })
    }

    if (this.hoRefNumber && !validPattern.test(this.hoRefNumber)) {
      errors.push({
        text: "The Home Office reference number should only contain numbers and letters. It might have a forward slash '/' but should not contain any other special characters (e.g. '@', '#', '%', '&', '-').",
        fields: ['refNumber'],
      })
    }

    return errors
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
