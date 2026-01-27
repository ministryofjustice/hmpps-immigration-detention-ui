import type { Express } from 'express'
import request from 'supertest'
import * as cheerio from 'cheerio'
import { appWithAllRoutes } from './testutils/appSetup'
import ImmigrationDetentionStoreService from '../services/immigrationDetentionStoreService'
import ImmigrationDetention from '../@types/ImmigrationDetention'
import ImmigrationDetentionService from '../services/immigrationDetentionService'
import ParamStoreService from '../services/paramStoreService'
import { HmppsUser } from '../interfaces/hmppsUser'
import config from '../config'

jest.mock('../services/immigrationDetentionStoreService')
jest.mock('../services/immigrationDetentionService')
jest.mock('../services/paramStoreService')

const immigrationDetentionStoreService =
  new ImmigrationDetentionStoreService() as jest.Mocked<ImmigrationDetentionStoreService>

const paramsService = new ParamStoreService() as jest.Mocked<ParamStoreService>

const immigrationDetentionService = new ImmigrationDetentionService(null) as jest.Mocked<ImmigrationDetentionService>

const NOMS_ID = 'ABC123'
const SESSION_ID = '96c83672-8499-4a64-abc9-3e031b1747b3'
const IMMIGRATION_DETENTION_OBJECT: ImmigrationDetention = {
  prisonerId: 'ABC123',
  immigrationDetentionUuid: '123-latest',
  immigrationDetentionRecordType: 'IS91',
  recordDate: '2022-06-22',
  homeOfficeReferenceNumber: 'ABC123',
  source: 'DPS',
  createdAt: '2025-11-03T08:06:37.123Z',
  courtAppearanceUuid: '123',
}

const IMMIGRATION_DETENTION_OBJECT_NOMIS: ImmigrationDetention = {
  prisonerId: 'ABC123',
  immigrationDetentionUuid: '123-latest',
  immigrationDetentionRecordType: 'IS91',
  recordDate: '2022-06-22',
  homeOfficeReferenceNumber: 'ABC123',
  source: 'NOMIS',
  createdAt: '2025-11-03T08:06:37.123Z',
  courtAppearanceUuid: '123',
}

const mockUser = {
  token: 'mockToken',
  username: 'IMMIGRATION_DETENTION_ADMIN',
  authSource: 'nomis',
  userId: '488389',
  name: 'Immigration Admin',
  displayName: 'Immigration Admin',
  userRoles: ['IMMIGRATION_DETENTION_ADMIN'],
}

const IMMIGRATION_DETENTION_NLI_OBJECT: ImmigrationDetention = {
  immigrationDetentionUuid: '123',
  prisonerId: 'ABC123',
  immigrationDetentionRecordType: 'NO_LONGER_OF_INTEREST',
  recordDate: '2022-06-22',
  homeOfficeReferenceNumber: 'ABC123',
  noLongerOfInterestReason: 'OTHER_REASON',
  noLongerOfInterestComment: 'Confirmed not of interest',
  createdAt: '2025-11-03T08:06:37.123Z',
  source: 'DPS',
  courtAppearanceUuid: '123',
}

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({
    services: {
      immigrationDetentionStoreService,
      immigrationDetentionService,
      paramsStoreService: paramsService,
    },
    userSupplier: () => mockUser as HmppsUser,
  })
})

afterEach(() => {
  jest.resetAllMocks()
  jest.useRealTimers()
})

describe('Immigration Detention routes', () => {
  it('GET /{nomsId}/immigration-detention/add/no-longer-interest-reason/:id goes to the select NoLongerOfInterest page', async () => {
    immigrationDetentionStoreService.store.mockReturnValue(SESSION_ID)
    immigrationDetentionStoreService.getById.mockReturnValue(IMMIGRATION_DETENTION_OBJECT)

    await request(app)
      .get(`/${NOMS_ID}/immigration-detention/add/no-longer-interest-reason/${SESSION_ID}`)
      .expect(200)
      .expect(res => {
        const $: cheerio.CheerioAPI = cheerio.load(res.text)

        const backLink = $('[data-qa="back-link"]').attr('href')
        expect(backLink).toBe(`/${NOMS_ID}/immigration-detention/add/record-type/${SESSION_ID}`)

        const cancelLink = $('[data-qa="cancel-button"]').attr('href')
        expect(cancelLink).toBe('http://localhost:3000/ccard/prisoner/ABC123/overview')
      })
  })

  it('POST /{nomsId}/immigration-detention/add/confirmed-date/{id} empty day, month and year', () => {
    return request(app)
      .post(`/${NOMS_ID}/immigration-detention/add/confirmed-date/${SESSION_ID}`)
      .send({})
      .type('form')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('This date must include a valid day, month and year.')
      })
  })

  it('GET /{nomsId}/immigration-detention/add/confirmed-date/:id renders confirmedDate page', async () => {
    immigrationDetentionStoreService.store.mockReturnValue(SESSION_ID)
    immigrationDetentionStoreService.getById.mockReturnValue(IMMIGRATION_DETENTION_OBJECT)

    await request(app)
      .get(`/${NOMS_ID}/immigration-detention/add/confirmed-date/${SESSION_ID}`)
      .expect(200)
      .expect(res => {
        const $: cheerio.CheerioAPI = cheerio.load(res.text)

        const backLink = $('[data-qa="back-link"]').attr('href')
        expect(backLink).toBe(`/${NOMS_ID}/immigration-detention/add/no-longer-interest-reason/${SESSION_ID}`)

        const cancelLink = $('[data-qa="cancel-button"]').attr('href')
        expect(cancelLink).toBe('http://localhost:3000/ccard/prisoner/ABC123/overview')
      })
  })

  it('POST /{nomsId}/immigration-detention/add/no-longer-interest-reason/:id redirects to next page', async () => {
    immigrationDetentionStoreService.store.mockReturnValue(SESSION_ID)
    immigrationDetentionStoreService.getById.mockReturnValue(IMMIGRATION_DETENTION_OBJECT)

    await request(app)
      .post(`/${NOMS_ID}/immigration-detention/add/no-longer-interest-reason/${SESSION_ID}`)
      .send({ noLongerOfInterestReason: 'OTHER', otherReason: 'Other comment' })
      .expect(302)
      .expect('Location', `/${NOMS_ID}/immigration-detention/add/confirmed-date/${SESSION_ID}`)
  })

  it('POST /{nomsId}/immigration-detention/add/no-longer-interest-reason/:id renders error when value not entered', async () => {
    immigrationDetentionStoreService.store.mockReturnValue(SESSION_ID)
    immigrationDetentionStoreService.getById.mockReturnValue(IMMIGRATION_DETENTION_OBJECT)

    await request(app)
      .post(`/${NOMS_ID}/immigration-detention/add/no-longer-interest-reason/${SESSION_ID}`)
      .send({ otherReason: 'Other comment' })
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('You must select an option')
      })
  })

  it('POST /{nomsId}/immigrationDetention/add/no-longer-interest-reason/:id renders comment error when value not entered', async () => {
    immigrationDetentionStoreService.store.mockReturnValue(SESSION_ID)
    immigrationDetentionStoreService.getById.mockReturnValue(IMMIGRATION_DETENTION_OBJECT)

    await request(app)
      .post(`/${NOMS_ID}/immigration-detention/add/no-longer-interest-reason/${SESSION_ID}`)
      .send({ noLongerOfInterestReason: 'OTHER_REASON' })
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('Enter the reason the Home Office has provided.')
      })
  })

  it('GET /{nomsId}/immigration-detention/add/record-type renders the select recordType page', async () => {
    immigrationDetentionStoreService.store.mockReturnValue(SESSION_ID)
    immigrationDetentionStoreService.getById.mockReturnValue(IMMIGRATION_DETENTION_OBJECT)

    await request(app)
      .get(`/${NOMS_ID}/immigration-detention/add/record-type/${SESSION_ID}`)
      .expect(200)
      .expect(res => {
        const $: cheerio.CheerioAPI = cheerio.load(res.text)

        const questionText = $('[data-qa="recordTypeQuestion"]').text().trim()
        expect(questionText).toBe('What information have you received from the Home Office?')

        const backLink = $('[data-qa="back-link"]').attr('href')
        expect(backLink).toBe('http://localhost:3000/ccard/prisoner/ABC123/overview')

        const cancelLink = $('[data-qa="cancel-button"]').attr('href')
        expect(cancelLink).toBe('http://localhost:3000/ccard/prisoner/ABC123/overview')
      })
  })

  it.each([
    'add/record-type',
    'add/ho-ref',
    'add/confirmed-date',
    'add/document-date',
    'add/no-longer-interest-reason',
    'delete',
  ])('Redirect to overview when entity does not exist - %s', path => {
    return request(app)
      .get(`/${NOMS_ID}/immigration-detention/${path}/not-a-valid-uuid`)
      .expect(302)
      .expect('Location', `/${NOMS_ID}/immigration-detention/overview`)
  })

  it('GET /{nomsId}/immigration-detention/add/document-date renders the documentDate page', async () => {
    immigrationDetentionStoreService.store.mockReturnValue(SESSION_ID)
    immigrationDetentionStoreService.getById.mockReturnValue(IMMIGRATION_DETENTION_OBJECT)

    await request(app)
      .get(`/${NOMS_ID}/immigration-detention/add/document-date/${SESSION_ID}`)
      .expect(200)
      .expect(res => {
        const $: cheerio.CheerioAPI = cheerio.load(res.text)

        const backLink = $('[data-qa="back-link"]').attr('href')
        expect(backLink).toBe(`/${NOMS_ID}/immigration-detention/add/record-type/${SESSION_ID}`)

        const cancelLink = $('[data-qa="cancel-button"]').attr('href')
        expect(cancelLink).toBe('http://localhost:3000/ccard/prisoner/ABC123/overview')
      })
  })

  it('POST /{nomsId}/immigration-detention/add/record-type throws error when no recordType is selected', async () => {
    immigrationDetentionStoreService.store.mockReturnValue(SESSION_ID)

    await request(app)
      .post(`/${NOMS_ID}/immigration-detention/add/record-type/${SESSION_ID}`)
      .expect(200)
      .expect(res => {
        const $: cheerio.CheerioAPI = cheerio.load(res.text)

        expect(res.text).toContain('You must select an option')

        const questionText = $('[data-qa="recordTypeQuestion"]').text().trim()
        expect(questionText).toBe('What information have you received from the Home Office?')
      })
  })

  it('POST /{nomsId}/immigration-detention/add/record-type redirects to next page', async () => {
    immigrationDetentionStoreService.store.mockReturnValue(SESSION_ID)

    await request(app)
      .post(`/${NOMS_ID}/immigration-detention/add/record-type/${SESSION_ID}`)
      .send({ immigrationDetentionRecordType: 'IS91' })
      .expect(302)
      .expect('Location', `/${NOMS_ID}/immigration-detention/add/document-date/${SESSION_ID}`)
  })

  it('POST /{nomsId}/immigration-detention/add/document-date/{id} empty day, month and year', () => {
    return request(app)
      .post(`/${NOMS_ID}/immigration-detention/add/document-date/${SESSION_ID}`)
      .send({})
      .type('form')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('This date must include a valid day, month and year.')
      })
  })

  it('POST /{nomsId}/immigration-detention/add/document-date/{id} empty date', () => {
    return request(app)
      .post(`/${NOMS_ID}/immigration-detention/add/document-date/${SESSION_ID}`)
      .send({ 'docDate-month': '3', 'docDate-year': '2023' })
      .type('form')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('This date must include a day.')
      })
  })

  it('POST /{nomsId}/immigration-detention/add/document-date/{id} empty month', () => {
    return request(app)
      .post(`/${NOMS_ID}/immigration-detention/add/document-date/${SESSION_ID}`)
      .send({ 'docDate-day': '3', 'docDate-year': '2023' })
      .type('form')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('This date must include a month.')
      })
  })

  it('POST /{nomsId}/immigration-detention/add/document-date/{id} empty month', () => {
    return request(app)
      .post(`/${NOMS_ID}/immigration-detention/add/document-date/${SESSION_ID}`)
      .send({ 'docDate-day': '3', 'docDate-month': '02' })
      .type('form')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('This date must include a year.')
      })
  })

  it('POST /{nomsId}/immigration-detention/add/document-date/{id} 2 digit year', () => {
    return request(app)
      .post(`/${NOMS_ID}/immigration-detention/add/document-date/${SESSION_ID}`)
      .send({ 'docDate-day': '6', 'docDate-month': '3', 'docDate-year': '23' })
      .type('form')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Year must include 4 numbers')
      })
  })

  it('POST /{nomsId}/immigration-detention/add/document-date/{id} invalid date 29 Feb', () => {
    return request(app)
      .post(`/${NOMS_ID}/immigration-detention/add/document-date/${SESSION_ID}`)
      .send({ 'docDate-day': '29', 'docDate-month': '02', 'docDate-year': '2023' })
      .type('form')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('This date does not exist.')
      })
  })

  test.each`
    year      | error
    ${'2900'} | ${'The date cannot be in the future.'}
    ${'1900'} | ${'The date must be within the last 100 years.'}
  `(
    'POST /{nomsId}/immigration-detention/add/document-date/{id} the date can not be in the future or more than 100 years ago',
    ({ year, error }) => {
      return request(app)
        .post(`/${NOMS_ID}/immigration-detention/add/document-date/${SESSION_ID}`)
        .send({ 'docDate-day': '20', 'docDate-month': '12', 'docDate-year': year })
        .type('form')
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).toContain(error)
        })
    },
  )

  it('POST /{nomsId}/immigration-detention/add/ho-ref/{id} throws error when no HO Ref is entered', () => {
    immigrationDetentionStoreService.store.mockReturnValue(SESSION_ID)
    return request(app)
      .post(`/${NOMS_ID}/immigration-detention/add/ho-ref/${SESSION_ID}`)
      .send({})
      .type('form')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Enter the Home Office reference number')
      })
  })

  it.each([
    { input: 'ABC12345@' },
    { input: 'ABC-12345' },
    { input: 'ABC#12345' },
    { input: 'ABC%12345' },
    { input: 'ABC&12345' },
    { input: 'ABC 12345' },
  ])(
    'POST /{nomsId}/immigration-detention/add/ho-ref/{id} throws error for invalid HO Ref with special characters: "$input"',
    ({ input }) => {
      immigrationDetentionStoreService.store.mockReturnValue(SESSION_ID)
      return request(app)
        .post(`/${NOMS_ID}/immigration-detention/add/ho-ref/${SESSION_ID}`)
        .send({ hoRefNumber: input })
        .type('form')
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).toContain(
            'The Home Office reference number should only contain numbers and letters. It might have a forward slash &#39;/&#39; but should not contain any other special characters',
          )
        })
    },
  )

  it.each([
    { input: '', expectedError: 'Enter the Home Office reference number' },
    { input: 'ABC123', expectedError: 'The Home Office reference number should be between 8 to 16 characters.' },
    { input: 'abc123', expectedError: 'The Home Office reference number should be between 8 to 16 characters.' },
    {
      input: 'ABCDEFGHIJKLMNOPQ',
      expectedError: 'The Home Office reference number should be between 8 to 16 characters.',
    },
  ])(
    'POST /{nomsId}/immigration-detention/add/ho-ref/{id} throws error for invalid HO Ref: "$input"',
    ({ input, expectedError }) => {
      immigrationDetentionStoreService.store.mockReturnValue(SESSION_ID)
      return request(app)
        .post(`/${NOMS_ID}/immigration-detention/add/ho-ref/${SESSION_ID}`)
        .send({ hoRefNumber: input })
        .type('form')
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).toContain(expectedError)
        })
    },
  )

  it.each([{ input: 'B1234567/12' }, { input: 'b1234567/12' }, { input: 'ABC12345' }, { input: 'abc12345' }])(
    'POST /{nomsId}/immigration-detention/add/ho-ref/{id} passes with valid HO Ref: "$input"',
    ({ input }) => {
      immigrationDetentionStoreService.store.mockReturnValue(SESSION_ID)
      return request(app)
        .post(`/${NOMS_ID}/immigration-detention/add/ho-ref/${SESSION_ID}`)
        .send({ hoRefNumber: input })
        .type('form')
        .expect(302)
        .expect('Location', `/${NOMS_ID}/immigration-detention/add/review/${SESSION_ID}`)
    },
  )

  it('GET /{nomsId}/immigration-detention/add/review/{id} renders review page successfully', () => {
    immigrationDetentionStoreService.getById.mockReturnValue(IMMIGRATION_DETENTION_OBJECT)
    return request(app)
      .get(`/${NOMS_ID}/immigration-detention/add/review/${SESSION_ID}`)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('IS91 Detention Authority')
        expect(res.text).toContain('22 June 2022')
        expect(res.text).toContain('ABC123')
        expect(res.text).toContain(`/${NOMS_ID}/immigration-detention/edit/ho-ref/${SESSION_ID}`)
        expect(res.text).toContain(`/${NOMS_ID}/immigration-detention/edit/document-date/${SESSION_ID}`)
      })
  })

  it('POST /{nomsId}/immigration-detention/add/review/{id} renders result page successfully', () => {
    immigrationDetentionStoreService.getById.mockReturnValue(IMMIGRATION_DETENTION_OBJECT)
    immigrationDetentionService.getImmigrationDetentionAppearanceOutcomes.mockReturnValue(
      Promise.resolve([
        {
          outcomeUuid: 'uuid-1',
          outcomeName: 'Outcome Name',
          nomisCode: '5500',
          outcomeType: 'IMMIGRATION',
          displayOrder: 1,
          relatedChargeOutcomeUuid: 'related-uuid',
          isSubList: false,
          dispositionCode: 'DISP',
        },
      ]),
    )
    return request(app)
      .post(`/${NOMS_ID}/immigration-detention/add/review/${SESSION_ID}`)
      .expect(200)
      .expect(res => {
        const $: cheerio.CheerioAPI = cheerio.load(res.text)

        const alertUrlForPrisoner = $('[data-qa="prisoner-alert-url"]').attr('href')
        expect(alertUrlForPrisoner).toBe(`https://localhost:3000/dpsPrisoner/prisoner/ABC123/alerts/active`)

        const nomisReleaseText = $('[data-qa="nomis-release-text"]').text().trim()
        expect(nomisReleaseText).toBe(`2. Go to NOMIS to update the release schedule`)
      })
  })

  it('GET /{nomsId}/immigration-detention/overview does not show delete link for IMMIGRATION_DETENTION_USER role', async () => {
    const testUser = {
      ...mockUser,
      userRoles: ['IMMIGRATION_DETENTION_USER'],
    }
    const localApp = appWithAllRoutes({
      services: {
        immigrationDetentionStoreService,
        immigrationDetentionService,
        paramsStoreService: paramsService,
      },
      userSupplier: () => testUser as HmppsUser,
    })

    immigrationDetentionStoreService.getById.mockReturnValue(IMMIGRATION_DETENTION_OBJECT)
    immigrationDetentionService.getImmigrationDetentionRecordsForPrisoner.mockReturnValue(
      Promise.resolve([IMMIGRATION_DETENTION_OBJECT, IMMIGRATION_DETENTION_NLI_OBJECT]),
    )

    await request(localApp)
      .get(`/${NOMS_ID}/immigration-detention/overview`)
      .expect(200)
      .expect(res => {
        const $: cheerio.CheerioAPI = cheerio.load(res.text)

        const headingOverview = $('[data-qa="overview-heading"]').text().trim()
        expect(headingOverview).toBe(`Immigration documents overview`)

        const messageOverview = $('[data-qa="message-heading"]').text().trim()
        expect(messageOverview).toBe(`An IS91 Detention Authority has been recorded`)

        const deleteLinkLatestRecord = $('[data-qa="delete-latest-link"]').attr('href')
        expect(deleteLinkLatestRecord).toBeUndefined()

        expect(res.text).toContain('IS91 Detention Authority')
        expect(res.text).toContain('IS91 recorded on ')
        expect(res.text).toContain('ABC123')
      })
  })

  it('GET /{nomsId}/immigration-detention/overview does not show edit/delete link for NOMIS record with feature toggle false', async () => {
    immigrationDetentionStoreService.getById.mockReturnValue(IMMIGRATION_DETENTION_OBJECT_NOMIS)
    immigrationDetentionService.getImmigrationDetentionRecordsForPrisoner.mockReturnValue(
      Promise.resolve([IMMIGRATION_DETENTION_OBJECT_NOMIS]),
    )

    await request(app)
      .get(`/${NOMS_ID}/immigration-detention/overview`)
      .expect(200)
      .expect(res => {
        const $: cheerio.CheerioAPI = cheerio.load(res.text)

        const headingOverview = $('[data-qa="overview-heading"]').text().trim()
        expect(headingOverview).toBe(`Immigration documents overview`)

        const messageOverview = $('[data-qa="message-heading"]').text().trim()
        expect(messageOverview).toBe(`An IS91 Detention Authority has been recorded`)

        const cardTitle = $('[data-qa="card-title"]').text().trim()
        expect(cardTitle).toBe(`IS91 recorded on 3 November 2025 via NOMIS`)

        const deleteLinkLatestRecord = $('[data-qa="delete-latest-link"]').attr('href')
        expect(deleteLinkLatestRecord).toBeUndefined()

        const editLinkLatestRecord = $('[data-qa="edit-latest-link"]').attr('href')
        expect(editLinkLatestRecord).toBeUndefined()

        expect(res.text).toContain('IS91 Detention Authority')
        expect(res.text).toContain('IS91 recorded on ')
        expect(res.text).toContain('ABC123')
      })
  })

  it('GET /{nomsId}/immigration-detention/overview does not show edit/delete link for NOMIS record with feature toggle true', async () => {
    immigrationDetentionStoreService.getById.mockReturnValue(IMMIGRATION_DETENTION_OBJECT_NOMIS)
    immigrationDetentionService.getImmigrationDetentionRecordsForPrisoner.mockReturnValue(
      Promise.resolve([IMMIGRATION_DETENTION_OBJECT_NOMIS]),
    )
    config.featureToggles.modifyNomisRecordsEnabled = true

    await request(app)
      .get(`/${NOMS_ID}/immigration-detention/overview`)
      .expect(200)
      .expect(res => {
        const $: cheerio.CheerioAPI = cheerio.load(res.text)

        const headingOverview = $('[data-qa="overview-heading"]').text().trim()
        expect(headingOverview).toBe(`Immigration documents overview`)

        const messageOverview = $('[data-qa="message-heading"]').text().trim()
        expect(messageOverview).toBe(`An IS91 Detention Authority has been recorded`)

        const cardTitle = $('[data-qa="card-title"]').text().trim()
        expect(cardTitle).toBe(`IS91 recorded on 3 November 2025 via NOMIS`)

        const editLinkLatestRecord = $('[data-qa="edit-latest-link"]').attr('href')
        expect(editLinkLatestRecord).toBe(
          `/${NOMS_ID}/immigration-detention/update/document-date/${IMMIGRATION_DETENTION_OBJECT_NOMIS.immigrationDetentionUuid}?source=NOMIS&courtAppearanceUuid=123`,
        )

        const deleteLinkLatestRecord = $('[data-qa="delete-latest-link"]').attr('href')
        expect(deleteLinkLatestRecord).toBe(
          `/${NOMS_ID}/immigration-detention/delete/${IMMIGRATION_DETENTION_OBJECT_NOMIS.immigrationDetentionUuid}?source=NOMIS&courtAppearanceUuid=123`,
        )

        expect(res.text).toContain('IS91 Detention Authority')
        expect(res.text).toContain('IS91 recorded on ')
        expect(res.text).toContain('ABC123')
      })
  })

  it('GET /{nomsId}/immigration-detention/overview renders review page successfully', async () => {
    // Mock the service methods to return expected data
    immigrationDetentionStoreService.getById.mockReturnValue(IMMIGRATION_DETENTION_OBJECT)
    immigrationDetentionService.getImmigrationDetentionRecordsForPrisoner.mockReturnValue(
      Promise.resolve([IMMIGRATION_DETENTION_OBJECT, IMMIGRATION_DETENTION_NLI_OBJECT]),
    )

    // Perform the request and validate the response
    await request(app)
      .get(`/${NOMS_ID}/immigration-detention/overview`)
      .expect(200)
      .expect(res => {
        const $: cheerio.CheerioAPI = cheerio.load(res.text)

        const headingOverview = $('[data-qa="overview-heading"]').text().trim()
        expect(headingOverview).toBe(`Immigration documents overview`)

        const messageOverview = $('[data-qa="message-heading"]').text().trim()
        expect(messageOverview).toBe(`An IS91 Detention Authority has been recorded`)

        const editLinkLatestRecord = $('[data-qa="edit-latest-link"]').attr('href')
        expect(editLinkLatestRecord).toBe(
          `/${NOMS_ID}/immigration-detention/update/document-date/${IMMIGRATION_DETENTION_OBJECT.immigrationDetentionUuid}?source=DPS&courtAppearanceUuid=123`,
        )

        const deleteLinkLatestRecord = $('[data-qa="delete-latest-link"]').attr('href')
        expect(deleteLinkLatestRecord).toBe(
          `/${NOMS_ID}/immigration-detention/delete/${IMMIGRATION_DETENTION_OBJECT.immigrationDetentionUuid}?source=DPS&courtAppearanceUuid=123`,
        )

        expect(res.text).toContain('IS91 Detention Authority')
        expect(res.text).toContain('IS91 recorded on ')
        expect(res.text).toContain('ABC123')
      })
  })

  it('GET /{nomsId}/immigration-detention/delete/{id} renders delete page successfully', () => {
    immigrationDetentionService.getImmigrationDetentionByUUID.mockReturnValue(
      Promise.resolve(IMMIGRATION_DETENTION_OBJECT),
    )
    immigrationDetentionService.getImmigrationDetentionRecordsForPrisoner.mockReturnValue(
      Promise.resolve([IMMIGRATION_DETENTION_OBJECT]),
    )
    return request(app)
      .get(`/${NOMS_ID}/immigration-detention/delete/${SESSION_ID}`)
      .expect(200)
      .expect(res => {
        const $: cheerio.CheerioAPI = cheerio.load(res.text)

        const cancelLink = $('[data-qa="cancel-link"]').attr('href')
        expect(cancelLink).toBe(`/${NOMS_ID}/immigration-detention/overview`)
      })
  })

  it('POST /{nomsId}/immigration-detention/delete/{id} redirects to overview page successfully', () => {
    immigrationDetentionService.deleteImmigrationDetentionByUUID.mockReturnValue(
      Promise.resolve({
        immigrationDetentionUuid: SESSION_ID,
      }),
    )
    immigrationDetentionService.getImmigrationDetentionRecordsForPrisoner.mockReturnValue(
      Promise.resolve([IMMIGRATION_DETENTION_OBJECT]),
    )
    return request(app)
      .post(`/${NOMS_ID}/immigration-detention/delete/${SESSION_ID}`)
      .expect(302)
      .expect('Location', `/${NOMS_ID}/immigration-detention/overview`)
  })

  it('GET /{nomsId}/immigration-detention/overview redirects to ccard overview if there are no ', async () => {
    immigrationDetentionService.getImmigrationDetentionRecordsForPrisoner.mockReturnValue(Promise.resolve([]))

    await request(app)
      .get(`/${NOMS_ID}/immigration-detention/overview`)
      .expect(302)
      .expect('Location', `http://localhost:3000/ccard/prisoner/ABC123/overview`)
  })
})
