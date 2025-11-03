import GetOverviewPage from '../pages/getOverviewPage'

context('Add Immigration Detention - IS91', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthPing')
    cy.task('stubTokenVerificationPing')
    cy.task('stubManageUser')
    cy.task('stubManageUsersPing')
    cy.task('stubGetUserCaseloads')
    cy.task('stubGetUserCasePing')
    cy.task('stubGetPrisonerDetails')
    cy.task('stubPrisonSearchApiPing')
    cy.task('stubRASApiPing')
    cy.task('stubPostImmigrationDetention')
    cy.task('stubGetImmigrationDetentionByPrisoner')
  })

  it('Enter Immigration Detention IS91', () => {
    cy.signIn()
    const overviewPage = GetOverviewPage.goTo('A1234AB')
    overviewPage.checkOverviewTableExists()

    overviewPage.clickOnEditLatestRecord().click()
  })
})
