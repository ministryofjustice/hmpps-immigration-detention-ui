import dayjs from 'dayjs'
import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from './abstractPage'

export default class AddConfirmedDatePage extends AbstractPage {
  readonly header: Locator

  constructor(page: Page) {
    super(page)
    this.header = page.locator('h1', { hasText: 'Record Immigration Information' })
  }

  static async verifyOnPage(page: Page): Promise<AddConfirmedDatePage> {
    const addConfirmedDatePage = new AddConfirmedDatePage(page)
    await expect(addConfirmedDatePage.header).toBeVisible()
    return addConfirmedDatePage
  }

  public continueButton = (): Locator => this.page.locator('[data-qa=submit-form]')

  public captionText = (): Locator => this.page.locator('[data-qa=caption-text]')

  public confirmedDateQuestion = (): Locator => this.page.locator('[data-qa=confirmed-date]')

  public enterConfirmedDate = async (date: string): Promise<void> => {
    const days = dayjs(date).get('date').toString()
    const months = (dayjs(date).get('month') + 1).toString()
    const years = dayjs(date).get('year').toString()
    await this.page.locator('[name=confirmedDate-day]').fill(days)
    await this.page.locator('[name=confirmedDate-month]').fill(months)
    await this.page.locator('[name=confirmedDate-year]').fill(years)
  }
}
