import Page, { PageElement } from './page'

export default class AddImmigrationDetentionNoLongerOfInterestTypePage extends Page {
  constructor() {
    super('Record Immigration Information')
  }

  public continueButton = (): PageElement => cy.get('[data-qa=submit-form]')

  public noLongerOfInterestQuestion = (): PageElement => cy.get('[data-qa=noLongerOfInterestQuestion]')

  public selectRecordType = (type: string): PageElement => cy.get(`[value=${type}]`)
}
