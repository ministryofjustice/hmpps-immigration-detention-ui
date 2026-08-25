import nock from 'nock'
import { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'

import config from '../config'
import CourtCaseReleaseDatesApiClient from './courtCaseReleaseDatesApiClient'

describe('courtCaseReleaseDatesApiClient', () => {
  let fakeCourtCasesReleaseDatesApi: nock.Scope
  let client: CourtCaseReleaseDatesApiClient
  let mockAuthenticationClient: Partial<AuthenticationClient>

  const token = 'test-system-token'

  beforeEach(() => {
    fakeCourtCasesReleaseDatesApi = nock(config.apis.courtCasesReleaseDatesApi.url)

    mockAuthenticationClient = {
      getToken: jest.fn().mockResolvedValue(token),
    }

    client = new CourtCaseReleaseDatesApiClient(mockAuthenticationClient as AuthenticationClient)
  })

  afterEach(() => {
    nock.cleanAll()
  })

  describe('getServiceDefinitions', () => {
    it('should return service definitions from api', async () => {
      const serviceDefinitions = {
        services: {
          overview: {
            href: 'http://localhost:8006/prisoner/A1234AA/overview',
            text: 'Overview',
            thingsToDo: {
              things: [
                {
                  title: 'Test Thing To Do',
                  message: 'This is a test message',
                  buttonText: 'Action',
                  buttonHref: 'http://example.com',
                  type: 'CALCULATION_REQUIRED',
                },
              ],
              count: 1,
            },
            maintenanceAlert: {
              enabled: false,
              message: '',
            },
          },
        },
        maintenanceAlert: {
          enabled: false,
          message: '',
        },
      }

      fakeCourtCasesReleaseDatesApi
        .get('/service-definitions/prisoner/A1234AA')
        .matchHeader('authorization', `Bearer ${token}`)
        .reply(200, serviceDefinitions)

      const response = await client.getServiceDefinitions('A1234AA', token)

      expect(response).toEqual(serviceDefinitions)
      expect(nock.isDone()).toBe(true)
    })
  })
})
