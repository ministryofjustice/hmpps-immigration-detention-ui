import dayjs from 'dayjs'
import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from './abstractPage'

export default class AddDocumentDatePage extends AbstractPage {
  readonly header: Locator

  constructor(page: Page, title: string) {
    super(page)
    this.header = page.locator('h1', { hasText: title || 'Record Immigration Information' })
  }

  static async verifyOnPage(page: Page, title: string): Promise<AddDocumentDatePage> {
    const addConfirmedDatePage = new AddDocumentDatePage(page, title)
    await expect(addConfirmedDatePage.header).toBeVisible()
    return addConfirmedDatePage
  }

  public continueButton = (): Locator => this.page.locator('[data-qa=submit-form]')

  public captionText = (): Locator => this.page.locator('[data-qa=caption-text]')

  public docQuestion = (): Locator => this.page.locator('[data-qa=doc-date]')

  public enterDocDate = async (date: string): Promise<void> => {
    const days = dayjs(date).get('date').toString()
    const months = (dayjs(date).get('month') + 1).toString()
    const years = dayjs(date).get('year').toString()

    await this.page.locator('[name=docDate-day]').fill(days)
    await this.page.locator('[name=docDate-month]').fill(months)
    await this.page.locator('[name=docDate-year]').fill(years)
  }
}
