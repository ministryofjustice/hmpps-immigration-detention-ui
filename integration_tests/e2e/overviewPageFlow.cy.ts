import GetOverviewPage from '../pages/getOverviewPage'
import AddDocumentDatePage from '../pages/addImmigrationDetentionDocDate'
import AddHORefNo from '../pages/addImmigrationDetentionHORefNo'
import AddImmigrationDetentionReview from '../pages/addImmigrationDetentionReview'

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
    cy.task('stubGetImmigrationDetentionByUUID')
    cy.task('stubPutImmigrationDetentionByUUID')
  })

  it('Enter Immigration Detention IS91', () => {
    cy.signIn()
    const overviewPage = GetOverviewPage.goTo('A1234AB')
    overviewPage.checkOverviewTableExists()
    overviewPage.clickOnEditLatestRecord().click()

    const addDocumentDatePage = new AddDocumentDatePage('Record IS91 Detention Authority')
    addDocumentDatePage.captionText().should('have.text', 'Record IS91 Detention Authority')
    addDocumentDatePage
      .docQuestion()
      .invoke('text')
      .should(text => {
        expect(text.trim()).to.eq('Enter the date on the IS91 document')
      })
    addDocumentDatePage.continueButton().click()

    const addHORefNo = new AddHORefNo('Record IS91 Detention Authority')
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

    const overviewPage1 = new GetOverviewPage()
    overviewPage1.checkOverviewTableExists()
  })
})
