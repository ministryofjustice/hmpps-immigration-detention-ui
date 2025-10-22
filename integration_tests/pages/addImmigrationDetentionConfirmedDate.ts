import dayjs from 'dayjs'
import Page, { PageElement } from './page'

export default class AddConfirmedDatePage extends Page {
  constructor() {
    super('Record Immigration Information')
  }

  public continueButton = (): PageElement => cy.get('[data-qa=submit-form]')

  public captionText = (): PageElement => cy.get('[data-qa=caption-text]')

  public confirmedDateQuestion = (): PageElement => cy.get('[data-qa=confirmed-date]')

  public enterConfirmedDate = (date: string): void => {
    const days = dayjs(date).get('date').toString()
    const months = (dayjs(date).get('month') + 1).toString()
    const years = dayjs(date).get('year').toString()

    cy.get('[name=confirmedDate-day]').type(days)
    cy.get('[name=confirmedDate-month]').type(months)
    cy.get('[name=confirmedDate-year]').type(years)
  }
}
