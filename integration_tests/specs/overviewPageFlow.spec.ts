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
import ccardApi from '../mockApis/ccardApi'

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
       ccardApi.getServiceDefinitions(),
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
  ;[
    { input: '  F3002497/003  ', expectedText: 'F3002497/003' },
    { input: '', expectedText: 'Not entered' },
  ].forEach(({ input, expectedText }) => {
    test(`Enter Immigration Detention IS91 with HO Ref "${input}" resolves to "${expectedText}"`, async ({ page }) => {
      // The RaS API cannot return an empty homeOfficeReferenceNumber, so return null when empty string
      await remandAndSentencingApi.stubGetImmigrationDetentionByPrisoner(input === '' ? null : expectedText)
      await login(page)

      let overviewPage = await GetOverviewPage.goTo('A1234AB', page)
      await overviewPage.checkOverviewTableExists()
      await overviewPage.clickOnEditLatestRecord().click()

      const addDocumentDatePage = await AddDocumentDatePage.verifyOnPage(page, 'Record IS91 Detention Authority')
      await expect(addDocumentDatePage.captionText()).toHaveText('Record IS91 Detention Authority')
      await expect(addDocumentDatePage.docQuestion()).toHaveText('Enter the date on the IS91 document')
      await addDocumentDatePage.continueButton().click()

      const addHORefNo = await AddHORefNo.verifyOnPage(page, 'Record IS91 Detention Authority')
      await expect(addHORefNo.captionText()).toHaveText('Record IS91 Detention Authority')
      await expect(addHORefNo.hinText()).toHaveText('This can be found at the top of IS91 document')
      await addHORefNo.enterHoRefNo(input)
      await addHORefNo.continueButton().click()

      const immigrationDetentionSummary = await AddImmigrationDetentionReview.verifyOnPage(page)
      await expect(immigrationDetentionSummary.captionText()).toHaveText('Record IS91 Detention Authority')
      await expect(page.getByText(expectedText, { exact: true })).toBeVisible()

      await immigrationDetentionSummary.editDocumentDate().click()
      await immigrationDetentionSummary.continueButton().click()

      await immigrationDetentionSummary.editHoRef().click()
      await immigrationDetentionSummary.continueButton().click()

      await immigrationDetentionSummary.submit().click()

      overviewPage = await GetOverviewPage.verifyOnPage(page)
      await overviewPage.checkOverviewTableExists()
      await expect(overviewPage.hoRefNumberValue()).toHaveText(expectedText)
    })
  })

  test('Overview table shows "Not entered" when HO ref is null for a non-latest record', async ({ page }) => {
    await remandAndSentencingApi.stubGetImmigrationDetentionByPrisoner('A12345678900', null)
    await login(page)

    const overviewPage = await GetOverviewPage.goTo('A1234AB', page)
    await overviewPage.checkOverviewTableExists()
    await expect(overviewPage.overviewTableValues()).toHaveText('Not entered')
  })
})
