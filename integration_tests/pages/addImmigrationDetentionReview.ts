import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from './abstractPage'

export default class AddImmigrationDetentionReview extends AbstractPage {
  readonly header: Locator

  constructor(page: Page) {
    super(page)
    this.header = page.locator('h1', { hasText: 'Confirm and save' })
  }

  static async verifyOnPage(page: Page): Promise<AddImmigrationDetentionReview> {
    const addImmigrationDetentionReviewPage = new AddImmigrationDetentionReview(page)
    await expect(addImmigrationDetentionReviewPage.header).toBeVisible()
    return addImmigrationDetentionReviewPage
  }

  public submit = (): Locator => this.page.locator('[data-qa=submit-form]')

  public captionText = (): Locator => this.page.locator('[data-qa=caption-text]')

  public continueButton = (): Locator => this.page.locator('[data-qa=submit-form]')

  public editRecordType = (): Locator => this.page.locator('[data-qa=edit-record-type-link]')

  public editDocumentDate = (): Locator => this.page.locator('[data-qa=edit-document-date-link]')

  public editConfirmedDate = (): Locator => this.page.locator('[data-qa=edit-confirmed-date-link]')

  public editHoRef = (): Locator => this.page.locator('[data-qa=edit-ho-ref-link]')

  public editNoLongerInterestReason = (): Locator => this.page.locator('[data-qa=edit-no-longer-interest-reason-link]')
}
