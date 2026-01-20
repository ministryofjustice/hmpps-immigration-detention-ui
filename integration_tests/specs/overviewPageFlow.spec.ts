import { expect, test } from '@playwright/test'
import { login, resetStubs } from '../testUtils'

import GetOverviewPage from '../pages/getOverviewPage'
import AddDocumentDatePage from '../pages/addImmigrationDetentionDocDate'
import AddHORefNo from '../pages/addImmigrationDetentionHORefNo'
import AddImmigrationDetentionReview from '../pages/addImmigrationDetentionReview'
import manageUsersApi from '../mockApis/manageUsersApi'
import prisonApi from '../mockApis/prisonApi'
import prisonerSearchApi from '../mockApis/prisonerSearchApi'
import remandAndSentencingApi from '../mockApis/remandAndSentencingApi'

test.describe('Add Immigration Detention - IS91', () => {
  test.beforeEach(async () => {
    await Promise.all([
      manageUsersApi.stubManageUser(),
      prisonApi.stubGetUserCaseloads(),
      prisonerSearchApi.stubGetPrisonerDetails(),
      prisonApi.stubGetPrisonerImage(),
      remandAndSentencingApi.stubGetAllAppearanceOutcomes(),
      remandAndSentencingApi.stubGetImmigrationDetentionByPrisoner(),
      remandAndSentencingApi.stubGetImmigrationDetentionByUUID(),
      remandAndSentencingApi.stubPutImmigrationDetentionByUUID(),
    ])
  })

  test.afterEach(async () => {
    await resetStubs()
  })

  test('Enter Immigration Detention IS91', async ({ page }) => {
    await login(page)
    let overviewPage = await GetOverviewPage.goTo('A1234AB', page)
    await overviewPage.checkOverviewTableExists()
    await overviewPage.clickOnEditLatestRecord().click()

    const addDocumentDatePage = await AddDocumentDatePage.verifyOnPage(page, 'Record IS91 Detention Authority')
    expect(addDocumentDatePage.captionText()).toHaveText('Record IS91 Detention Authority')
    expect(addDocumentDatePage.docQuestion()).toHaveText('Enter the date on the IS91 document')
    await addDocumentDatePage.continueButton().click()

    const addHORefNo = await AddHORefNo.verifyOnPage(page, 'Record IS91 Detention Authority')
    expect(addHORefNo.captionText()).toHaveText('Record IS91 Detention Authority')
    expect(addHORefNo.hinText()).toHaveText('This can be found at the top of IS91 document')
    await addHORefNo.continueButton().click()

    const immigrationDetentionSummary = await AddImmigrationDetentionReview.verifyOnPage(page)
    expect(immigrationDetentionSummary.captionText()).toHaveText('Record IS91 Detention Authority')

    await immigrationDetentionSummary.editDocumentDate().click()
    await immigrationDetentionSummary.continueButton().click()

    await immigrationDetentionSummary.editHoRef().click()
    await immigrationDetentionSummary.continueButton().click()

    await immigrationDetentionSummary.submit().click()

    overviewPage = await GetOverviewPage.verifyOnPage(page)
    await overviewPage.checkOverviewTableExists()
  })
})
