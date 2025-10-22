import ImmigrationDetentionTypes from '../@types/ImmigrationDetentionTypes'
import config from '../config'
import immigrationDetentionNoLongerInterestTypes from './immigrationDetentionNoLongerInterestTypes'
import ValidationError from './validationError'
import NoLongerInterestForm from './NoLongerInterestForm'

export default class ImmigrationDetentionNoLongerInterestModel {
  constructor(
    public nomsId: string,
    public id: string,
    public immigrationDetention: ImmigrationDetentionTypes,
    public isGet: boolean = false,
    public formValues: NoLongerInterestForm = {},
  ) {
    if (isGet && !this.formValues.noLongerOfInterestReason) {
      this.formValues.noLongerOfInterestReason = immigrationDetention?.noLongerOfInterestReason
      this.otherReason = immigrationDetention?.noLongerOfInterestOtherComment
    } else if (!isGet) {
      this.immigrationDetention.noLongerOfInterestReason = this.formValues.noLongerOfInterestReason
      this.immigrationDetention.noLongerOfInterestOtherComment = this.formValues.otherReason
    }
  }

  public backlink(): string {
    return `/${this.nomsId}/immigration-detention/add/record-type/${this.id}`
  }

  public cancelLink(): string {
    return `${config.services.courtCasesReleaseDates.url}/prisoner/${this.nomsId}/overview`
  }

  otherReason: string

  errors: ValidationError[] = []

  messageForField(...fields: string[]): { text: string } {
    const error = this.errors.find(it => fields.find(field => it.fields.indexOf(field) !== -1))
    if (error) {
      return { text: error.text }
    }
    return null
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

  validate(): void {
    this.errors = this.validation()
  }

  public validation(): ValidationError[] {
    if (!this.immigrationDetention?.noLongerOfInterestReason) {
      return [
        {
          text: 'You must select an option',
          fields: ['noLongerInterestReason'],
        },
      ]
    }
    if (
      this.immigrationDetention?.noLongerOfInterestReason === 'OTHER' &&
      !this.immigrationDetention.noLongerOfInterestOtherComment
    ) {
      return [
        {
          text: 'Enter the reason the Home Office has provided.',
          fields: ['otherReason'],
        },
      ]
    }
    return null
  }

  getIsChecked(code: string): boolean {
    return this.immigrationDetention?.noLongerOfInterestReason === code
  }
}
