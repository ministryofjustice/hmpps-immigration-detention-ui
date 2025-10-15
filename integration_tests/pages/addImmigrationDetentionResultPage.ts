import Page, { PageElement } from './page'

export default class AddImmigrationDetentionResultPage extends Page {
  constructor(title: string) {
    super(title || 'Record IS91 Detention Authority')
  }

  public successMessage = (): PageElement => cy.get('[data-qa=success-message]')

  public followInfo = (): PageElement => cy.get('[data-qa=follow-info]')
}
