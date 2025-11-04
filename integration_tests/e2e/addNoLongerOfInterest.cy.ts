import AddImmigrationDetentionTypePage from '../pages/addImmigrationDetentionType'
import AddImmigrationDetentionReview from '../pages/addImmigrationDetentionReview'
import AddImmigrationDetentionResultPage from '../pages/addImmigrationDetentionResultPage'
import AddImmigrationDetentionNoLongerOfInterestTypePage from '../pages/addNoLongerOfInterestType'
import AddConfirmedDatePage from '../pages/addImmigrationDetentionConfirmedDate'

context('Add Immigration Detention - No Longer Of Interest', () => {
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

  it('Enter No Longer Of Interest', () => {
    cy.signIn()
    const immigrationDetention = AddImmigrationDetentionTypePage.goTo('A1234AB')
    immigrationDetention.selectRecordType('NO_LONGER_OF_INTEREST').click()
    immigrationDetention.continueButton().click()

    const addNoLongerOfInterestTypePage = new AddImmigrationDetentionNoLongerOfInterestTypePage()
    addNoLongerOfInterestTypePage
      .noLongerOfInterestQuestion()
      .invoke('text')
      .should(text => {
        expect(text.trim()).to.eq('Why is Marvin Haggler no longer of interest?')
      })
    addNoLongerOfInterestTypePage.selectRecordType('RIGHT_TO_REMAIN').click()
    addNoLongerOfInterestTypePage.continueButton().click()

    const addConfirmedDatePage = new AddConfirmedDatePage()
    addConfirmedDatePage.enterConfirmedDate('2024-04-20')
    addConfirmedDatePage.captionText().should('have.text', 'Record Immigration Information')
    addConfirmedDatePage
      .confirmedDateQuestion()
      .invoke('text')
      .should(text => {
        expect(text.trim()).to.eq('When did the Home Office confirm that this person is no longer of interest?')
      })
    addConfirmedDatePage.continueButton().click()

    const immigrationDetentionSummary = AddImmigrationDetentionReview.verifyOnPage(AddImmigrationDetentionReview)
    immigrationDetentionSummary.captionText().should('have.text', 'Record Immigration Information')

    immigrationDetentionSummary.editConfirmedDate().click()
    immigrationDetentionSummary.continueButton().click()

    immigrationDetentionSummary.editNoLongerInterestReason().click()
    immigrationDetentionSummary.continueButton().click()

    immigrationDetentionSummary.submit().click()

    const immigrationDetentionResult = new AddImmigrationDetentionResultPage(
      'No longer of interest successfully recorded',
    )
    immigrationDetentionResult.successMessage().should('have.text', 'No longer of interest successfully recorded')
    immigrationDetentionResult
      .followInfo()
      .should(
        'have.text',
        'This person will not be detained under immigration powers after their release. You need to check if there are any alerts that might prevent a release.',
      )
  })
})
