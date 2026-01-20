import { expect, test } from '@playwright/test'
import { login, resetStubs } from '../testUtils'

import AddDocumentDatePage from '../pages/addImmigrationDetentionDocDate'
import AddHORefNo from '../pages/addImmigrationDetentionHORefNo'
import AddImmigrationDetentionResultPage from '../pages/addImmigrationDetentionResultPage'
import AddImmigrationDetentionReview from '../pages/addImmigrationDetentionReview'
import AddImmigrationDetentionTypePage from '../pages/addImmigrationDetentionType'
import manageUsersApi from '../mockApis/manageUsersApi'
import prisonApi from '../mockApis/prisonApi'
import prisonerSearchApi from '../mockApis/prisonerSearchApi'
import remandAndSentencingApi from '../mockApis/remandAndSentencingApi'

test.describe('Add Immigration Detention - Bail', () => {
  test.beforeEach(async () => {
    await resetStubs()
    await Promise.all([
      manageUsersApi.stubManageUser(),
      prisonApi.stubGetUserCaseloads(),
      prisonerSearchApi.stubGetPrisonerDetails(),
      remandAndSentencingApi.stubPostImmigrationDetention(),
      prisonApi.stubGetPrisonerImage(),
      remandAndSentencingApi.stubGetAllAppearanceOutcomes(),
    ])
  })

  test('Enter bail', async ({ page }) => {
    await login(page)

    const immigrationDetention = await AddImmigrationDetentionTypePage.goTo('A1234AB', page)
    await immigrationDetention.selectRecordType('IMMIGRATION_BAIL').click()
    await immigrationDetention.continueButton().click()

    const addDocumentDatePage = await AddDocumentDatePage.verifyOnPage(
      page,
      'Enter the date that immigration bail was granted',
    )
    await addDocumentDatePage.enterDocDate('2024-04-20')
    expect(addDocumentDatePage.captionText()).toHaveText('Record Immigration Bail')
    await addDocumentDatePage.continueButton().click()

    const addHORefNo = await AddHORefNo.verifyOnPage(
      page,
      'Enter the reference number on the immigration bail document',
    )
    await addHORefNo.enterHoRefNo('111-222')
    expect(addHORefNo.captionText()).toHaveText('Record Immigration Bail')
    expect(addHORefNo.hinText()).toHaveText('This will be at the top of the document')
    await addHORefNo.continueButton().click()

    const immigrationDetentionSummary = await AddImmigrationDetentionReview.verifyOnPage(page)
    expect(immigrationDetentionSummary.captionText()).toHaveText('Record Immigration Bail')

    await immigrationDetentionSummary.editDocumentDate().click()
    await immigrationDetentionSummary.continueButton().click()

    await immigrationDetentionSummary.editHoRef().click()
    await immigrationDetentionSummary.continueButton().click()

    await immigrationDetentionSummary.submit().click()

    const immigrationDetentionResult = await AddImmigrationDetentionResultPage.verifyOnPage(
      page,
      'Immigration bail successfully recorded',
    )
    expect(immigrationDetentionResult.successMessage()).toHaveText('Immigration bail successfully recorded')
  })
})
