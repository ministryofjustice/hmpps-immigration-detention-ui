import Page, { PageElement } from './page'

export default class AddImmigrationDetentionReview extends Page {
  constructor() {
    super('Confirm and save')
  }

  public submit = (): PageElement => cy.get('[data-qa=submit-form]')

  public captionText = (): PageElement => cy.get('[data-qa=caption-text]')

  public continueButton = (): PageElement => cy.get('[data-qa=submit-form]')

  public editRecordType = (): PageElement => cy.get('[data-qa=edit-record-type-link]')

  public editDocumentDate = (): PageElement => cy.get('[data-qa=edit-document-date-link]')

  public editHoRef = (): PageElement => cy.get('[data-qa=edit-ho-ref-link]')
}
