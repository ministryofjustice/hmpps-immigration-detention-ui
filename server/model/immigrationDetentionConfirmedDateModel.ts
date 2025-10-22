import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import ImmigrationDetentionTypes from '../@types/ImmigrationDetentionTypes'
import ValidationError from './validationError'
import { dateItems, validateDate } from '../utils/utils'
import config from '../config'

dayjs.extend(customParseFormat)

export default class ImmigrationDetentionConfirmedDateModel {
  public errors: ValidationError[] = []

  public 'confirmedDate-day'?: string

  public 'confirmedDate-month'?: string

  public 'confirmedDate-year'?: string

  constructor(
    public nomsId: string,
    public id: string,
    params?: object,
    public immigrationDetention?: ImmigrationDetentionTypes,
  ) {
    if (params) {
      Object.assign(this as object, params)
    } else {
      this['confirmedDate-day'] = dayjs(immigrationDetention.noLongerOfInterestConfirmedDate).get('date').toString()
      this['confirmedDate-month'] = (
        dayjs(immigrationDetention.noLongerOfInterestConfirmedDate).get('month') + 1
      ).toString()
      this['confirmedDate-year'] = dayjs(immigrationDetention.noLongerOfInterestConfirmedDate).get('year').toString()
    }
  }

  public backLink(): string {
    return `${this.nomsId}/immigrationDetention/add/noLongerInterestReason/${this.id}`
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
    return dayjs(`${this['confirmedDate-year']}-${this['confirmedDate-month']}-${this['confirmedDate-day']}`).format(
      'YYYY-MM-DD',
    )
  }

  confirmedDateDateItems() {
    return dateItems(
      this['confirmedDate-year'],
      this['confirmedDate-month'],
      this['confirmedDate-day'],
      'confirmedDate',
      this.errors,
    )
  }

  async validation(): Promise<ValidationError[]> {
    const errors: ValidationError[] = []
    const DocDateError = validateDate(
      this['confirmedDate-day'],
      this['confirmedDate-month'],
      this['confirmedDate-year'],
      'confirmedDate',
    )
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
