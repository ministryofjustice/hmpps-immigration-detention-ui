import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from './abstractPage'

export default class AddImmigrationDetentionNoLongerOfInterestTypePage extends AbstractPage {
  readonly header: Locator

  constructor(page: Page) {
    super(page)
    this.header = page.locator('h1', { hasText: 'Record Immigration Information' })
  }

  static async verifyOnPage(page: Page): Promise<AddImmigrationDetentionNoLongerOfInterestTypePage> {
    const addImmigrationDetentionNoLongerOfInterestTypePage = new AddImmigrationDetentionNoLongerOfInterestTypePage(
      page,
    )
    await expect(addImmigrationDetentionNoLongerOfInterestTypePage.header).toBeVisible()
    return addImmigrationDetentionNoLongerOfInterestTypePage
  }

  public continueButton = (): Locator => this.page.locator('[data-qa=submit-form]')

  public noLongerOfInterestQuestion = (): Locator => this.page.locator('[data-qa=noLongerOfInterestQuestion]')

  public selectRecordType = (type: string): Locator => this.page.locator(`[value=${type}]`)
}
