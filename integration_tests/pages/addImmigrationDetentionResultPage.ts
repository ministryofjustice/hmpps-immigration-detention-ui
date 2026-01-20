import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from './abstractPage'

export default class AddImmigrationDetentionResultPage extends AbstractPage {
  readonly header: Locator

  constructor(page: Page, title: string) {
    super(page)
    this.header = page.locator('h1', { hasText: title || 'Record IS91 Detention Authority' })
  }

  static async verifyOnPage(page: Page, title: string): Promise<AddImmigrationDetentionResultPage> {
    const addImmigrationDetentionResultPage = new AddImmigrationDetentionResultPage(page, title)
    await expect(addImmigrationDetentionResultPage.header).toBeVisible()
    return addImmigrationDetentionResultPage
  }

  public successMessage = (): Locator => this.page.locator('[data-qa=success-message]')

  public followInfo = (): Locator => this.page.locator('[data-qa=follow-info]')
}
