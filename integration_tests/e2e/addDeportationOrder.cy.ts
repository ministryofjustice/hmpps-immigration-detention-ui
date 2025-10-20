import AddImmigrationDetentionTypePage from '../pages/addImmigrationDetentionType'
import AddDocumentDatePage from '../pages/addImmigrationDetentionDocDate'
import AddHORefNo from '../pages/addImmigrationDetentionHORefNo'
import AddImmigrationDetentionReview from '../pages/addImmigrationDetentionReview'
import AddImmigrationDetentionResultPage from '../pages/addImmigrationDetentionResultPage'

context('Add Immigration Detention - Detention Order', () => {
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
  })

  it('Enter Deportation Order', () => {
    cy.signIn()
    const immigrationDetention = AddImmigrationDetentionTypePage.goTo('A1234AB')
    immigrationDetention.selectRecordType('DEPORTATION_ORDER').click()
    immigrationDetention.continueButton().click()

    const addDocumentDatePage = new AddDocumentDatePage('Record Deportation Order')
    addDocumentDatePage.enterDocDate('2024-04-20')
    addDocumentDatePage.captionText().should('have.text', 'Record Deportation Order')
    addDocumentDatePage
      .docQuestion()
      .invoke('text')
      .should(text => {
        expect(text.trim()).to.eq('Enter the date on the deportation order')
      })
    addDocumentDatePage.continueButton().click()

    const addHORefNo = new AddHORefNo('Record Deportation Order')
    addHORefNo.enterHoRefNo('111624058')
    addHORefNo.captionText().should('have.text', 'Record Deportation Order')
    addHORefNo.hinText().should('have.text', 'This will be at the top of the deportation order')
    addHORefNo.continueButton().click()

    const immigrationDetentionSummary = AddImmigrationDetentionReview.verifyOnPage(AddImmigrationDetentionReview)
    immigrationDetentionSummary.captionText().should('have.text', 'Record Deportation Order')
    immigrationDetentionSummary.editRecordType().click()
    immigrationDetentionSummary.continueButton().click()

    immigrationDetentionSummary.editDocumentDate().click()
    immigrationDetentionSummary.continueButton().click()

    immigrationDetentionSummary.editHoRef().click()
    immigrationDetentionSummary.continueButton().click()

    immigrationDetentionSummary.submit().click()

    const immigrationDetentionResult = new AddImmigrationDetentionResultPage('Deportation order successfully recorded')
    immigrationDetentionResult
      .followInfo()
      .should('have.text', 'If this deportation order will impact the release schedule, you need to:')
    immigrationDetentionResult.successMessage().should('have.text', 'Deportation order successfully recorded')
  })
})
