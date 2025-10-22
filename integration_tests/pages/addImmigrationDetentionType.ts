import Page, { PageElement } from './page'

export default class AddImmigrationDetentionTypePage extends Page {
  constructor() {
    super('Record immigration document')
  }

  public static goTo(prisonerId: string): AddImmigrationDetentionTypePage {
    cy.visit(`/${prisonerId}/immigration-detention/add`)
    return new AddImmigrationDetentionTypePage()
  }

  public continueButton = (): PageElement => cy.get('[data-qa=submit-form]')

  public selectRecordType = (type: string): PageElement => cy.get(`[value=${type}]`)
}
