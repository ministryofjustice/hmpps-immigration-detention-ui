import AddImmigrationDetentionTypePage from '../pages/addImmigrationDetentionType'

context('Add Immigration Detention - Bail', () => {
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
    cy.task('stubGetPrisonerImage')
    cy.task('stubGetAllAppearanceOutcomes')
  })

  it('Enter bail', () => {
    cy.signIn()
    const immigrationDetention = AddImmigrationDetentionTypePage.goTo('A1234AB')
    immigrationDetention.selectRecordType('IMMIGRATION_BAIL').click()
    immigrationDetention.continueButton().click()
  })
})
