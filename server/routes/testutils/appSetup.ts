import express, { Express } from 'express'
import { NotFound } from 'http-errors'

import { randomUUID } from 'crypto'
import routes from '../index'
import nunjucksSetup from '../../utils/nunjucksSetup'
import errorHandler from '../../errorHandler'
import type { Services } from '../../services'
import AuditService from '../../services/auditService'
import { HmppsUser } from '../../interfaces/hmppsUser'
import setUpWebSession from '../../middleware/setUpWebSession'
import ImmigrationDetentionService from '../../services/immigrationDetentionService'
import type { ApplicationInfo } from '../../applicationInfo'
import { PrisonerSearchApiPrisoner } from '../../@types/prisonerSearchApi/prisonerSearchTypes'

jest.mock('../../services/auditService')

export const user: HmppsUser = {
  name: 'FIRST LAST',
  userId: 'id',
  token: 'token',
  username: 'user1',
  displayName: 'First Last',
  authSource: 'nomis',
  staffId: 1234,
  userRoles: [],
}

const defaultPrisoner: PrisonerSearchApiPrisoner = {
  prisonerNumber: 'A1234AB',
  bookingId: '1234',
  firstName: 'Cormac',
  lastName: 'Meza',
  dateOfBirth: '1965-02-03',
  prisonId: 'MDI',
  status: 'REMAND',
  prisonName: 'HMP Bedford',
  cellLocation: 'CELL-1',
  pncNumber: '1231/XX/121',
  imprisonmentStatusDescription: 'Sentenced with a sentence c',
} as PrisonerSearchApiPrisoner

const testAppInfo: ApplicationInfo = {
  applicationName: 'test',
  buildNumber: '1',
  gitRef: 'long ref',
  gitShortHash: 'short ref',
  branchName: 'main',
  productId: '',
}

export const flashProvider = jest.fn()

function appSetup(
  services: Services,
  production: boolean,
  userSupplier: () => HmppsUser,
  prisoner: PrisonerSearchApiPrisoner,
): Express {
  const app = express()

  app.set('view engine', 'njk')

  nunjucksSetup(app, testAppInfo)
  app.use(setUpWebSession())
  app.use((req, res, next) => {
    req.user = userSupplier() as Express.User
    req.flash = flashProvider
    res.locals = {
      user: { ...req.user } as HmppsUser,
      prisoner,
    }
    next()
  })
  app.use((req, res, next) => {
    req.id = randomUUID()
    next()
  })
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(routes(services))
  app.use((req, res, next) => next(new NotFound()))
  app.use(errorHandler(production))

  return app
}

export function appWithAllRoutes({
  production = false,
  services = {
    auditService: new AuditService(null) as jest.Mocked<AuditService>,
    immigrationDetentionService: new ImmigrationDetentionService(null) as jest.Mocked<ImmigrationDetentionService>,
  },
  userSupplier = () => user,
  prisoner = defaultPrisoner,
}: {
  production?: boolean
  services?: Partial<Services>
  userSupplier?: () => HmppsUser
  prisoner?: PrisonerSearchApiPrisoner
}): Express {
  return appSetup(services as Services, production, userSupplier, prisoner)
}
