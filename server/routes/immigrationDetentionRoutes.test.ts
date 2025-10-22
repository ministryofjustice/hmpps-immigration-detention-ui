import type { Express } from 'express'
import request from 'supertest'
import * as cheerio from 'cheerio'
import { appWithAllRoutes } from './testutils/appSetup'
import ImmigrationDetentionStoreService from '../services/immigrationDetentionStoreService'
import SessionImmigrationDetention from '../@types/ImmigrationDetentionTypes'

jest.mock('../services/immigrationDetentionStoreService')

const immigrationDetentionStoreService =
  new ImmigrationDetentionStoreService() as jest.Mocked<ImmigrationDetentionStoreService>

const NOMS_ID = 'ABC123'
const SESSION_ID = '96c83672-8499-4a64-abc9-3e031b1747b3'
const IMMIGRATION_DETENTION_OBJECT: SessionImmigrationDetention = {
  recordType: 'IS91',
  documentDate: '2022-06-22',
  homeOfficeRefNo: 'ABC123',
}

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({
    services: {
      immigrationDetentionStoreService,
    },
  })
})

afterEach(() => {
  jest.resetAllMocks()
  jest.useRealTimers()
})

describe('Immigration Detention routes', () => {
  it('GET /{nomsId}/immigrationDetention/add/noLongerInterestReason/:id goes to the select NoLongerOfInterest page', async () => {
    immigrationDetentionStoreService.store.mockReturnValue(SESSION_ID)
    immigrationDetentionStoreService.getById.mockReturnValue({})

    await request(app)
      .get(`/${NOMS_ID}/immigrationDetention/add/noLongerInterestReason/${SESSION_ID}`)
      .expect(200)
      .expect(res => {
        const $: cheerio.CheerioAPI = cheerio.load(res.text)

        const backLink = $('[data-qa="back-link"]').attr('href')
        expect(backLink).toBe(`/${NOMS_ID}/immigrationDetention/add/recordType/${SESSION_ID}`)

        const cancelLink = $('[data-qa="cancel-button"]').attr('href')
        expect(cancelLink).toBe('http://localhost:3000/ccard/prisoner/ABC123/overview')
      })
  })

  it('POST /{nomsId}/immigrationDetention/add/confirmedDate/{id} empty day, month and year', () => {
    return request(app)
      .post(`/${NOMS_ID}/immigrationDetention/add/confirmedDate/${SESSION_ID}`)
      .send({})
      .type('form')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('This date must include a valid day, month and year.')
      })
  })

  it('GET /{nomsId}/immigrationDetention/add/confirmedDate/:id renders confirmedDate page', async () => {
    immigrationDetentionStoreService.store.mockReturnValue(SESSION_ID)
    immigrationDetentionStoreService.getById.mockReturnValue({})

    await request(app)
      .get(`/${NOMS_ID}/immigrationDetention/add/confirmedDate/${SESSION_ID}`)
      .expect(200)
      .expect(res => {
        const $: cheerio.CheerioAPI = cheerio.load(res.text)

        const backLink = $('[data-qa="back-link"]').attr('href')
        expect(backLink).toBe(`/${NOMS_ID}/immigrationDetention/add/noLongerInterestReason/${SESSION_ID}`)

        const cancelLink = $('[data-qa="cancel-button"]').attr('href')
        expect(cancelLink).toBe('http://localhost:3000/ccard/prisoner/ABC123/overview')
      })
  })

  it('POST /{nomsId}/immigrationDetention/add/noLongerInterestReason/:id redirects to next page', async () => {
    immigrationDetentionStoreService.store.mockReturnValue(SESSION_ID)
    immigrationDetentionStoreService.getById.mockReturnValue({})

    await request(app)
      .post(`/${NOMS_ID}/immigrationDetention/add/noLongerInterestReason/${SESSION_ID}`)
      .send({ noLongerOfInterestReason: 'OTHER', otherReason: 'Other comment' })
      .expect(302)
      .expect('Location', `/${NOMS_ID}/immigrationDetention/add/confirmedDate/${SESSION_ID}`)
  })

  it('POST /{nomsId}/immigrationDetention/add/noLongerInterestReason/:id renders error when value not entered', async () => {
    immigrationDetentionStoreService.store.mockReturnValue(SESSION_ID)
    immigrationDetentionStoreService.getById.mockReturnValue({})

    await request(app)
      .post(`/${NOMS_ID}/immigrationDetention/add/noLongerInterestReason/${SESSION_ID}`)
      .send({ otherReason: 'Other comment' })
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('You must select an option')
      })
  })

  it('POST /{nomsId}/immigrationDetention/add/noLongerInterestReason/:id renders comment error when value not entered', async () => {
    immigrationDetentionStoreService.store.mockReturnValue(SESSION_ID)
    immigrationDetentionStoreService.getById.mockReturnValue({})

    await request(app)
      .post(`/${NOMS_ID}/immigrationDetention/add/noLongerInterestReason/${SESSION_ID}`)
      .send({ noLongerOfInterestReason: 'OTHER' })
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('Enter the reason the Home Office has provided.')
      })
  })

  it('GET /{nomsId}/immigrationDetention/add/recordType renders the select recordType page', async () => {
    immigrationDetentionStoreService.store.mockReturnValue(SESSION_ID)

    await request(app)
      .get(`/${NOMS_ID}/immigrationDetention/add/recordType/${SESSION_ID}`)
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

  it('GET /{nomsId}/immigrationDetention/add/documentDate renders the documentDate page', async () => {
    immigrationDetentionStoreService.store.mockReturnValue(SESSION_ID)
    immigrationDetentionStoreService.getById.mockReturnValue({})

    await request(app)
      .get(`/${NOMS_ID}/immigrationDetention/add/documentDate/${SESSION_ID}`)
      .expect(200)
      .expect(res => {
        const $: cheerio.CheerioAPI = cheerio.load(res.text)

        const backLink = $('[data-qa="back-link"]').attr('href')
        expect(backLink).toBe(`/${NOMS_ID}/immigrationDetention/add/recordType/${SESSION_ID}`)

        const cancelLink = $('[data-qa="cancel-button"]').attr('href')
        expect(cancelLink).toBe('http://localhost:3000/ccard/prisoner/ABC123/overview')
      })
  })

  it('POST /{nomsId}/immigrationDetention/add/recordType throws error when no recordType is selected', async () => {
    immigrationDetentionStoreService.store.mockReturnValue(SESSION_ID)

    await request(app)
      .post(`/${NOMS_ID}/immigrationDetention/add/recordType/${SESSION_ID}`)
      .expect(200)
      .expect(res => {
        const $: cheerio.CheerioAPI = cheerio.load(res.text)

        expect(res.text).toContain('You must select an option')

        const questionText = $('[data-qa="recordTypeQuestion"]').text().trim()
        expect(questionText).toBe('What information have you received from the Home Office?')
      })
  })

  it('POST /{nomsId}/immigrationDetention/add/recordType redirects to next page', async () => {
    immigrationDetentionStoreService.store.mockReturnValue(SESSION_ID)

    await request(app)
      .post(`/${NOMS_ID}/immigrationDetention/add/recordType/${SESSION_ID}`)
      .send({ immigrationDetentionRecordType: 'IS91' })
      .expect(302)
      .expect('Location', `/${NOMS_ID}/immigrationDetention/add/documentDate/${SESSION_ID}`)
  })

  it('POST /{nomsId}/immigrationDetention/add/documentDate/{id} empty day, month and year', () => {
    return request(app)
      .post(`/${NOMS_ID}/immigrationDetention/add/documentDate/${SESSION_ID}`)
      .send({})
      .type('form')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('This date must include a valid day, month and year.')
      })
  })

  it('POST /{nomsId}/immigrationDetention/add/documentDate/{id} empty date', () => {
    return request(app)
      .post(`/${NOMS_ID}/immigrationDetention/add/documentDate/${SESSION_ID}`)
      .send({ 'docDate-month': '3', 'docDate-year': '2023' })
      .type('form')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('This date must include a day.')
      })
  })

  it('POST /{nomsId}/immigrationDetention/add/documentDate/{id} empty month', () => {
    return request(app)
      .post(`/${NOMS_ID}/immigrationDetention/add/documentDate/${SESSION_ID}`)
      .send({ 'docDate-day': '3', 'docDate-year': '2023' })
      .type('form')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('This date must include a month.')
      })
  })

  it('POST /{nomsId}/immigrationDetention/add/documentDate/{id} empty month', () => {
    return request(app)
      .post(`/${NOMS_ID}/immigrationDetention/add/documentDate/${SESSION_ID}`)
      .send({ 'docDate-day': '3', 'docDate-month': '02' })
      .type('form')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('This date must include a year.')
      })
  })

  it('POST /{nomsId}/immigrationDetention/add/documentDate/{id} 2 digit year', () => {
    return request(app)
      .post(`/${NOMS_ID}/immigrationDetention/add/documentDate/${SESSION_ID}`)
      .send({ 'docDate-day': '6', 'docDate-month': '3', 'docDate-year': '23' })
      .type('form')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Year must include 4 numbers')
      })
  })

  it('POST /{nomsId}/immigrationDetention/add/documentDate/{id} invalid date 29 Feb', () => {
    return request(app)
      .post(`/${NOMS_ID}/immigrationDetention/add/documentDate/${SESSION_ID}`)
      .send({ 'docDate-day': '29', 'docDate-month': '02', 'docDate-year': '2023' })
      .type('form')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('This date does not exist.')
      })
  })

  it('POST /{nomsId}/immigrationDetention/add/hoRef/{id} throws error when no HO Ref is entered', () => {
    immigrationDetentionStoreService.store.mockReturnValue(SESSION_ID)
    return request(app)
      .post(`/${NOMS_ID}/immigrationDetention/add/hoRef/${SESSION_ID}`)
      .send({})
      .type('form')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Enter the Home Office reference number')
      })
  })

  it('POST /{nomsId}/immigrationDetention/add/hoRef/{id} passes with valid HO Ref No', () => {
    immigrationDetentionStoreService.store.mockReturnValue(SESSION_ID)
    return request(app)
      .post(`/${NOMS_ID}/immigrationDetention/add/hoRef/${SESSION_ID}`)
      .send({ hoRefNumber: 'B1234567/12' })
      .type('form')
      .expect(302)
      .expect('Location', `/${NOMS_ID}/immigrationDetention/add/review/${SESSION_ID}`)
  })

  it('GET /{nomsId}/immigrationDetention/add/review/{id} renders review page successfully', () => {
    immigrationDetentionStoreService.getById.mockReturnValue(IMMIGRATION_DETENTION_OBJECT)
    return request(app)
      .get(`/${NOMS_ID}/immigrationDetention/add/review/${SESSION_ID}`)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('IS91 Detention Authority')
        expect(res.text).toContain('22 June 2022')
        expect(res.text).toContain('ABC123')
        expect(res.text).toContain(`/${NOMS_ID}/immigrationDetention/edit/hoRef/${SESSION_ID}`)
        expect(res.text).toContain(`/${NOMS_ID}/immigrationDetention/edit/documentDate/${SESSION_ID}`)
      })
  })
})
