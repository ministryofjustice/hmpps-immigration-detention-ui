import Page, { PageElement } from './page'

export default class AddHORefNo extends Page {
  constructor(title: string) {
    super(title || 'Record IS91 Detention Authority')
  }

  public continueButton = (): PageElement => cy.get('[data-qa=submit-form]')

  public captionText = (): PageElement => cy.get('[data-qa=caption-text]')

  public hinText = (): PageElement => cy.get('[data-qa=ho-ref-hint-text]')

  public enterHoRefNo = (refNo: string): void => {
    cy.get('[name=hoRefNumber]').clear()
    cy.get('[name=hoRefNumber]').type(refNo)
  }
}
