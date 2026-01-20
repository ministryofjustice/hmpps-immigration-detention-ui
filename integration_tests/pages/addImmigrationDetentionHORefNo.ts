import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from './abstractPage'

export default class AddHORefNo extends AbstractPage {
  readonly header: Locator

  constructor(page: Page, title: string) {
    super(page)
    this.header = page.locator('h1', { hasText: title || 'Record IS91 Detention Authority' })
  }

  static async verifyOnPage(page: Page, title: string): Promise<AddHORefNo> {
    const addHORefNoPage = new AddHORefNo(page, title)
    await expect(addHORefNoPage.header).toBeVisible()
    return addHORefNoPage
  }

  public continueButton = (): Locator => this.page.locator('[data-qa=submit-form]')

  public captionText = (): Locator => this.page.locator('[data-qa=caption-text]')

  public hinText = (): Locator => this.page.locator('[data-qa=ho-ref-hint-text]')

  public enterHoRefNo = async (refNo: string): Promise<void> => {
    await this.page.locator('[name=hoRefNumber]').clear()
    await this.page.locator('[name=hoRefNumber]').fill(refNo)
  }
}
