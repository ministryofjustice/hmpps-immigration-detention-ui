import dayjs from 'dayjs'
import Page, { PageElement } from './page'

export default class AddDocumentDatePage extends Page {
  constructor(title: string) {
    super(title || 'Record IS91 Detention Authority')
  }

  public continueButton = (): PageElement => cy.get('[data-qa=submit-form]')

  public captionText = (): PageElement => cy.get('[data-qa=caption-text]')

  public docQuestion = (): PageElement => cy.get('[data-qa=doc-date]')

  public enterDocDate = (date: string): void => {
    const days = dayjs(date).get('date').toString()
    const months = (dayjs(date).get('month') + 1).toString()
    const years = dayjs(date).get('year').toString()

    cy.get('[name=docDate-day]').type(days)
    cy.get('[name=docDate-month]').type(months)
    cy.get('[name=docDate-year]').type(years)
  }
}
