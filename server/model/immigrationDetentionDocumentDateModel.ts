import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import ImmigrationDetentionTypes from '../@types/ImmigrationDetentionTypes'
import ValidationError from './validationError'
import { dateItems } from '../utils/utils'
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
    } else {
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
    return `${this.nomsId}/immigrationDetention/add/recordType/${this.id}`
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
    const DocDateError = this.validateDate(this['docDate-day'], this['docDate-month'], this['docDate-year'], 'docDate')
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

  public validateDate(day: string, month: string, year: string, fieldPrefix: string): ValidationError {
    if (!day && !month && !year) {
      return {
        text: 'This date must include a valid day, month and year.',
        fields: [`${fieldPrefix}-day`, `${fieldPrefix}-month`, `${fieldPrefix}-year`],
      }
    }

    if (year && year.length !== 4) {
      return {
        text: 'Year must include 4 numbers',
        fields: [`${fieldPrefix}-year`],
      }
    }

    let text = 'This date must include a'
    const fields: string[] = []

    if (!day) {
      text += ' day'
      fields.push(`${fieldPrefix}-day`)
    }
    if (!month) {
      text += `${fields.length ? ' and' : ''} month`
      fields.push(`${fieldPrefix}-month`)
    }
    if (!year) {
      text += `${fields.length ? ' and' : ''} year`
      fields.push(`${fieldPrefix}-year`)
    }
    if (fields.length) {
      text += '.'
      return { text, fields }
    }

    const date = dayjs(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`, 'YYYY-MM-DD', true)
    if (!date.isValid()) {
      return {
        text: 'This date does not exist.',
        fields: [`${fieldPrefix}-day`, `${fieldPrefix}-month`, `${fieldPrefix}-year`],
      }
    }

    return null
  }
}
