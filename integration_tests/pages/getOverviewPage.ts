import Page, { PageElement } from './page'

export default class GetOverviewPage extends Page {
  constructor() {
    super('Immigration documents overview')
  }

  public static goTo(prisonerId: string): GetOverviewPage {
    cy.visit(`/${prisonerId}/immigration-detention/overview`)
    return new GetOverviewPage()
  }

  public checkOverviewTableExists = (): PageElement => cy.get('[data-qa="view-overview-table"]').should('exist')

  public clickOnEditLatestRecord = (): PageElement => cy.get('[data-qa=edit-latest-link]')

  public clickOnEditRecord = (): PageElement => cy.get('[data-qa="edit-3fa85f64-5717-4562-b3fc-2c963f66afa6"]')
}
