import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes, user } from './testutils/appSetup'
import AuditService from '../services/auditService'
import CourtCaseReleaseDatesService from '../services/courtCaseReleaseDatesService'

jest.mock('../services/auditService')
jest.mock('../services/courtCaseReleaseDatesService')

const auditService = new AuditService(null) as jest.Mocked<AuditService>
const courtCaseReleaseDatesService = new CourtCaseReleaseDatesService(null) as jest.Mocked<CourtCaseReleaseDatesService>

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({
    services: {
      auditService,
      courtCaseReleaseDatesService,
    },
    userSupplier: () => user,
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET /', () => {
  it('should render index page', () => {
    auditService.logPageView.mockResolvedValue(null)

    return request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('This site is under construction...')
      })
  })
})

describe('GET /:nomsId/immigration-detention/start', () => {
  it('should render the immigration detention start page', () => {
    return request(app)
      .get('/ABC123/immigration-detention/start')
      .expect('Content-Type', /html/)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('Immigration')
        expect(res.text).toContain('There are no immigration documents recorded.')
        expect(res.text).toContain('Record new immigration document')
        expect(res.text).toContain('/ABC123/immigration-detention/add')
      })
  })
})
