import AddDocumentDatePage from '../pages/addImmigrationDetentionDocDate'
import AddHORefNo from '../pages/addImmigrationDetentionHORefNo'
import AddImmigrationDetentionResultPage from '../pages/addImmigrationDetentionResultPage'
import AddImmigrationDetentionReview from '../pages/addImmigrationDetentionReview'
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

    const addDocumentDatePage = new AddDocumentDatePage('Enter the date that immigration bail was granted')
    addDocumentDatePage.enterDocDate('2024-04-20')
    addDocumentDatePage.captionText().should('have.text', 'Record Immigration Bail')
    addDocumentDatePage.continueButton().click()

    const addHORefNo = new AddHORefNo('Enter the reference number on the immigration bail document')
    addHORefNo.enterHoRefNo('111-222')
    addHORefNo.captionText().should('have.text', 'Record Immigration Bail')
    addHORefNo.hinText().should('have.text', 'This will be at the top of the document')
    addHORefNo.continueButton().click()

    const immigrationDetentionSummary = AddImmigrationDetentionReview.verifyOnPage(AddImmigrationDetentionReview)
    immigrationDetentionSummary.captionText().should('have.text', 'Record Immigration Bail')

    immigrationDetentionSummary.editDocumentDate().click()
    immigrationDetentionSummary.continueButton().click()

    immigrationDetentionSummary.editHoRef().click()
    immigrationDetentionSummary.continueButton().click()

    immigrationDetentionSummary.submit().click()

    const immigrationDetentionResult = new AddImmigrationDetentionResultPage('Immigration bail successfully recorded')
    immigrationDetentionResult.successMessage().should('have.text', 'Immigration bail successfully recorded')
  })
})
