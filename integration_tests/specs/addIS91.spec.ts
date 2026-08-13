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

test.describe('Add Immigration Detention - IS91', () => {
  test.beforeEach(async () => {
    await Promise.all([
      manageUsersApi.stubManageUser(),
      prisonApi.stubGetUserCaseloads(),
      prisonerSearchApi.stubGetPrisonerDetails(),
      remandAndSentencingApi.stubPostImmigrationDetention(),
      prisonApi.stubGetPrisonerImage(),
      remandAndSentencingApi.stubGetAllAppearanceOutcomes(),
    ])
  })

  test.afterEach(async () => {
    await resetStubs()
  })

  test('Enter Immigration Detention IS91', async ({ page }) => {
    await login(page)
    const immigrationDetention = await AddImmigrationDetentionTypePage.goTo('A1234AB', page)
    await immigrationDetention.selectRecordType('IS91').click()
    await immigrationDetention.continueButton().click()

    const addDocumentDatePage = await AddDocumentDatePage.verifyOnPage(page, 'Record IS91 Detention Authority')
    await addDocumentDatePage.enterDocDate('2024-04-20')
    await expect(addDocumentDatePage.captionText()).toHaveText('Record IS91 Detention Authority')
    await expect(addDocumentDatePage.docQuestion()).toHaveText('Enter the date on the IS91 document')
    await addDocumentDatePage.continueButton().click()

    const addHORefNo = await AddHORefNo.verifyOnPage(page, 'Record IS91 Detention Authority')
    await addHORefNo.enterHoRefNo('F3002497/003')
    await expect(addHORefNo.questionText()).toHaveText('Enter the Home Office Reference Number (optional)')
    await expect(addHORefNo.captionText()).toHaveText('Record IS91 Detention Authority')
    await expect(addHORefNo.hinText()).toHaveText('This can be found at the top of IS91 document')
    await addHORefNo.continueButton().click()

    const immigrationDetentionSummary = await AddImmigrationDetentionReview.verifyOnPage(page)
    await expect(immigrationDetentionSummary.captionText()).toHaveText('Record IS91 Detention Authority')

    await immigrationDetentionSummary.editDocumentDate().click()
    await immigrationDetentionSummary.continueButton().click()

    await immigrationDetentionSummary.editHoRef().click()
    await immigrationDetentionSummary.continueButton().click()

    await immigrationDetentionSummary.submit().click()

    const immigrationDetentionResult = await AddImmigrationDetentionResultPage.verifyOnPage(
      page,
      'IS91 Detention Authority successfully recorded',
    )
    await expect(immigrationDetentionResult.successMessage()).toHaveText(
      'IS91 Detention Authority successfully recorded',
    )
    await expect(immigrationDetentionResult.followInfoLineOne()).toHaveText(
      'If this person will be detained under immigration powers after their release date, you need to:',
    )
  })
  ;[
    { input: '  F3002497/003  ', expectedText: 'F3002497/003' },
    { input: '', expectedText: 'Not entered' },
  ].forEach(({ input, expectedText }) => {
    test(`Enter Immigration Detention IS91 with HO Ref "${input}" resolves to "${expectedText}"`, async ({ page }) => {
      await login(page)
      const immigrationDetention = await AddImmigrationDetentionTypePage.goTo('A1234AB', page)
      await immigrationDetention.selectRecordType('IS91').click()
      await immigrationDetention.continueButton().click()

      const addDocumentDatePage = await AddDocumentDatePage.verifyOnPage(page, 'Record IS91 Detention Authority')
      await addDocumentDatePage.enterDocDate('2024-04-20')
      await addDocumentDatePage.continueButton().click()

      const addHORefNo = await AddHORefNo.verifyOnPage(page, 'Record IS91 Detention Authority')
      await expect(addHORefNo.questionText()).toHaveText('Enter the Home Office Reference Number (optional)')
      await addHORefNo.enterHoRefNo(input)
      await addHORefNo.continueButton().click()

      const immigrationDetentionSummary = await AddImmigrationDetentionReview.verifyOnPage(page)
      await expect(page.getByText(expectedText, { exact: true })).toBeVisible()

      await immigrationDetentionSummary.submit().click()

      const immigrationDetentionResult = await AddImmigrationDetentionResultPage.verifyOnPage(
        page,
        'IS91 Detention Authority successfully recorded',
      )
      await expect(immigrationDetentionResult.successMessage()).toHaveText(
        'IS91 Detention Authority successfully recorded',
      )
    })
  })
})
