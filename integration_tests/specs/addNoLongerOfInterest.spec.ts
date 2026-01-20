import { expect, test } from '@playwright/test'
import { login, resetStubs } from '../testUtils'

import AddImmigrationDetentionTypePage from '../pages/addImmigrationDetentionType'
import AddImmigrationDetentionReview from '../pages/addImmigrationDetentionReview'
import AddImmigrationDetentionResultPage from '../pages/addImmigrationDetentionResultPage'
import AddImmigrationDetentionNoLongerOfInterestTypePage from '../pages/addNoLongerOfInterestType'
import AddConfirmedDatePage from '../pages/addImmigrationDetentionConfirmedDate'
import manageUsersApi from '../mockApis/manageUsersApi'
import prisonApi from '../mockApis/prisonApi'
import prisonerSearchApi from '../mockApis/prisonerSearchApi'
import remandAndSentencingApi from '../mockApis/remandAndSentencingApi'

test.describe('Add Immigration Detention - No Longer Of Interest', () => {
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

  test('Enter No Longer Of Interest', async ({ page }) => {
    await login(page)
    const immigrationDetention = await AddImmigrationDetentionTypePage.goTo('A1234AB', page)
    await immigrationDetention.selectRecordType('NO_LONGER_OF_INTEREST').click()
    await immigrationDetention.continueButton().click()

    const addNoLongerOfInterestTypePage = await AddImmigrationDetentionNoLongerOfInterestTypePage.verifyOnPage(page)
    expect(addNoLongerOfInterestTypePage.noLongerOfInterestQuestion()).toHaveText(
      'Why is Marvin Haggler no longer of interest?',
    )
    await addNoLongerOfInterestTypePage.selectRecordType('RIGHT_TO_REMAIN').click()
    await addNoLongerOfInterestTypePage.continueButton().click()

    const addConfirmedDatePage = await AddConfirmedDatePage.verifyOnPage(page)
    await addConfirmedDatePage.enterConfirmedDate('2024-04-20')
    expect(addConfirmedDatePage.captionText()).toHaveText('Record Immigration Information')
    expect(addConfirmedDatePage.confirmedDateQuestion()).toHaveText(
      'When did the Home Office confirm that this person is no longer of interest?',
    )
    await addConfirmedDatePage.continueButton().click()

    const immigrationDetentionSummary = await AddImmigrationDetentionReview.verifyOnPage(page)
    expect(immigrationDetentionSummary.captionText()).toHaveText('Record Immigration Information')

    await immigrationDetentionSummary.editConfirmedDate().click()
    await immigrationDetentionSummary.continueButton().click()

    await immigrationDetentionSummary.editNoLongerInterestReason().click()
    await immigrationDetentionSummary.continueButton().click()

    await immigrationDetentionSummary.submit().click()

    const immigrationDetentionResult = await AddImmigrationDetentionResultPage.verifyOnPage(
      page,
      'No longer of interest successfully recorded',
    )
    expect(immigrationDetentionResult.successMessage()).toHaveText('No longer of interest successfully recorded')
    expect(immigrationDetentionResult.followInfo()).toHaveText(
      'This person will not be detained under immigration powers after their release. You need to check if there are any alerts that might prevent a release.',
    )
  })
})
