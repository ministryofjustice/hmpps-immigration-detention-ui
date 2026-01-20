import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from './abstractPage'

export default class GetOverviewPage extends AbstractPage {
  readonly header: Locator

  constructor(page: Page) {
    super(page)
    this.header = page.locator('h1', { hasText: 'Immigration documents overview' })
  }

  static async verifyOnPage(page: Page): Promise<GetOverviewPage> {
    const getOverviewPage = new GetOverviewPage(page)
    await expect(getOverviewPage.header).toBeVisible()
    return getOverviewPage
  }

  public static async goTo(prisonerId: string, page: Page): Promise<GetOverviewPage> {
    await page.goto(`/${prisonerId}/immigration-detention/overview`)
    return this.verifyOnPage(page)
  }

  public checkOverviewTableExists = async (): Promise<void> =>
    expect(this.page.locator('[data-qa="view-overview-table"]')).toBeVisible()

  public clickOnEditLatestRecord = (): Locator => this.page.locator('[data-qa=edit-latest-link]')

  public clickOnEditRecord = (): Locator => this.page.locator('[data-qa="edit-3fa85f64-5717-4562-b3fc-2c963f66afa6"]')
}
