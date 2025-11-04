import AddImmigrationDetentionTypePage from '../pages/addImmigrationDetentionType'
import AddDocumentDatePage from '../pages/addImmigrationDetentionDocDate'
import AddHORefNo from '../pages/addImmigrationDetentionHORefNo'
import AddImmigrationDetentionReview from '../pages/addImmigrationDetentionReview'
import AddImmigrationDetentionResultPage from '../pages/addImmigrationDetentionResultPage'

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
    cy.task('stubGetPrisonerImage')
  })

  it('Enter Immigration Detention IS91', () => {
    cy.signIn()
    const immigrationDetention = AddImmigrationDetentionTypePage.goTo('A1234AB')
    immigrationDetention.selectRecordType('IS91').click()
    immigrationDetention.continueButton().click()

    const addDocumentDatePage = new AddDocumentDatePage('Record IS91 Detention Authority')
    addDocumentDatePage.enterDocDate('2024-04-20')
    addDocumentDatePage.captionText().should('have.text', 'Record IS91 Detention Authority')
    addDocumentDatePage
      .docQuestion()
      .invoke('text')
      .should(text => {
        expect(text.trim()).to.eq('Enter the date on the IS91 document')
      })
    addDocumentDatePage.continueButton().click()

    const addHORefNo = new AddHORefNo('Record IS91 Detention Authority')
    addHORefNo.enterHoRefNo('F3002497/003')
    addHORefNo.captionText().should('have.text', 'Record IS91 Detention Authority')
    addHORefNo.hinText().should('have.text', 'This can be found at the top of IS91 document')
    addHORefNo.continueButton().click()

    const immigrationDetentionSummary = AddImmigrationDetentionReview.verifyOnPage(AddImmigrationDetentionReview)
    immigrationDetentionSummary.captionText().should('have.text', 'Record IS91 Detention Authority')

    immigrationDetentionSummary.editDocumentDate().click()
    immigrationDetentionSummary.continueButton().click()

    immigrationDetentionSummary.editHoRef().click()
    immigrationDetentionSummary.continueButton().click()

    immigrationDetentionSummary.submit().click()

    const immigrationDetentionResult = new AddImmigrationDetentionResultPage(
      'IS91 Detention Authority successfully recorded',
    )
    immigrationDetentionResult.successMessage().should('have.text', 'IS91 Detention Authority successfully recorded')
    immigrationDetentionResult
      .followInfo()
      .should(
        'have.text',
        'If this person will be detained under immigration powers after their release date, you need to:',
      )
  })
})
