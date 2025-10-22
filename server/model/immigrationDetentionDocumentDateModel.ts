import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import ImmigrationDetentionTypes from '../@types/ImmigrationDetentionTypes'
import ValidationError from './validationError'
import { dateItems, validateDate } from '../utils/utils'
import config from '../config'

dayjs.extend(customParseFormat)

export default class ImmigrationDetentionDocumentDateModel {
  public errors: ValidationError[] = []

  public 'docDate-day'?: string

  public 'docDate-month'?: string

  public 'docDate-year'?: string

  constructor(
    public nomsId: string,
    public id: string,
    params?: object,
    public immigrationDetention?: ImmigrationDetentionTypes,
  ) {
    if (params) {
      Object.assign(this as object, params)
    } else if (immigrationDetention?.documentDate) {
      this['docDate-day'] = dayjs(immigrationDetention.documentDate).get('date').toString()
      this['docDate-month'] = (dayjs(immigrationDetention.documentDate).get('month') + 1).toString()
      this['docDate-year'] = dayjs(immigrationDetention.documentDate).get('year').toString()
    }
  }

  public getCaption() {
    if (this.immigrationDetention?.recordType === 'IS91') {
      return 'Record IS91 Detention Authority'
    }
    return 'Record Deportation Order'
  }

  public getQuestion() {
    if (this.immigrationDetention?.recordType === 'IS91') {
      return 'Enter the date on the IS91 document'
    }
    return 'Enter the date on the deportation order'
  }

  public backLink(): string {
    return `/${this.nomsId}/immigration-detention/add/record-type/${this.id}`
  }

  public cancelLink(): string {
    return `${config.services.courtCasesReleaseDates.url}/prisoner/${this.nomsId}/overview`
  }

  messageForField(...fields: string[]): { text: string } {
    const error = this.errors.find(it => fields.find(field => it.fields.indexOf(field) !== -1))
    if (error) {
      return { text: error.text }
    }
    return null
  }

  toDateModelString() {
    return dayjs(`${this['docDate-year']}-${this['docDate-month']}-${this['docDate-day']}`).format('YYYY-MM-DD')
  }

  docDateItems() {
    return dateItems(this['docDate-year'], this['docDate-month'], this['docDate-day'], 'docDate', this.errors)
  }

  async validation(): Promise<ValidationError[]> {
    const errors: ValidationError[] = []
    const DocDateError = validateDate(this['docDate-day'], this['docDate-month'], this['docDate-year'], 'docDate')
    if (DocDateError) {
      errors.push(DocDateError)
    }
    return errors
  }

  errorList() {
    return this.errors.map(it => ({
      text: it.text,
      html: it.html,
      href: it.fields.length ? `#${it.fields[0]}` : null,
    }))
  }
}
