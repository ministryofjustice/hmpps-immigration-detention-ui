import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from './abstractPage'

export default class AddImmigrationDetentionTypePage extends AbstractPage {
  readonly header: Locator

  constructor(page: Page) {
    super(page)
    this.header = page.locator('h1', { hasText: 'Record immigration document' })
  }

  static async verifyOnPage(page: Page): Promise<AddImmigrationDetentionTypePage> {
    const addImmigrationDetentionTypePage = new AddImmigrationDetentionTypePage(page)
    await expect(addImmigrationDetentionTypePage.header).toBeVisible()
    return addImmigrationDetentionTypePage
  }

  public static async goTo(prisonerId: string, page: Page): Promise<AddImmigrationDetentionTypePage> {
    await page.goto(`/${prisonerId}/immigration-detention/add`)
    return this.verifyOnPage(page)
  }

  public continueButton = (): Locator => this.page.locator('[data-qa=submit-form]')

  public selectRecordType = (type: string): Locator => this.page.locator(`[value=${type}]`)
}
