import { expect, test } from '@playwright/test'
import { login, resetStubs } from '../testUtils'

import AddImmigrationDetentionTypePage from '../pages/addImmigrationDetentionType'
import AddDocumentDatePage from '../pages/addImmigrationDetentionDocDate'
import AddHORefNo from '../pages/addImmigrationDetentionHORefNo'
import AddImmigrationDetentionReview from '../pages/addImmigrationDetentionReview'
import AddImmigrationDetentionResultPage from '../pages/addImmigrationDetentionResultPage'
import manageUsersApi from '../mockApis/manageUsersApi'
import prisonApi from '../mockApis/prisonApi'
import prisonerSearchApi from '../mockApis/prisonerSearchApi'
import remandAndSentencingApi from '../mockApis/remandAndSentencingApi'

test.describe('Add Immigration Detention - Detention Order', () => {
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

  test('Enter Deportation Order', async ({ page }) => {
    await login(page)
    const immigrationDetention = await AddImmigrationDetentionTypePage.goTo('A1234AB', page)
    await immigrationDetention.selectRecordType('DEPORTATION_ORDER').click()
    await immigrationDetention.continueButton().click()

    const addDocumentDatePage = await AddDocumentDatePage.verifyOnPage(page, 'Record Deportation Order')
    await addDocumentDatePage.enterDocDate('2024-04-20')
    expect(addDocumentDatePage.captionText()).toHaveText('Record Deportation Order')
    expect(addDocumentDatePage.docQuestion()).toHaveText('Enter the date on the deportation order')
    await addDocumentDatePage.continueButton().click()

    const addHORefNo = await AddHORefNo.verifyOnPage(page, 'Record Deportation Order')
    await addHORefNo.enterHoRefNo('111624058')
    expect(addHORefNo.captionText()).toHaveText('Record Deportation Order')
    expect(addHORefNo.hinText()).toHaveText('This will be at the top of the deportation order')
    addHORefNo.continueButton().click()

    const immigrationDetentionSummary = await AddImmigrationDetentionReview.verifyOnPage(page)
    expect(immigrationDetentionSummary.captionText()).toHaveText('Record Deportation Order')

    await immigrationDetentionSummary.editDocumentDate().click()
    await immigrationDetentionSummary.continueButton().click()

    await immigrationDetentionSummary.editHoRef().click()
    await immigrationDetentionSummary.continueButton().click()

    await immigrationDetentionSummary.submit().click()

    const immigrationDetentionResult = await AddImmigrationDetentionResultPage.verifyOnPage(
      page,
      'Deportation order successfully recorded',
    )
    expect(immigrationDetentionResult.followInfo()).toHaveText(
      'If this person will be detained under immigration powers after their release date, you need to:',
    )
    expect(immigrationDetentionResult.successMessage()).toHaveText('Deportation order successfully recorded')
  })
})
