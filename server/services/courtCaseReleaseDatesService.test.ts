import CourtCaseReleaseDatesApiClient from '../data/courtCaseReleaseDatesApiClient'
import CourtCaseReleaseDatesService from './courtCaseReleaseDatesService'
import { CcrdServiceDefinitions } from '../@types/courtCaseReleaseDatesApi/types'

jest.mock('../data/courtCaseReleaseDatesApiClient')

const courtCaseReleaseDatesApiClient = new CourtCaseReleaseDatesApiClient(
  null,
) as jest.Mocked<CourtCaseReleaseDatesApiClient>

describe('courtCaseReleaseDatesService', () => {
  let courtCaseReleaseDatesService: CourtCaseReleaseDatesService

  beforeEach(() => {
    courtCaseReleaseDatesService = new CourtCaseReleaseDatesService(courtCaseReleaseDatesApiClient)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('getServiceDefinitions', () => {
    it('should get service definitions for a prisoner', async () => {
      const serviceDefinitions: CcrdServiceDefinitions = {
        services: {
          overview: {
            href: 'http://localhost:8006/prisoner/A1234AA/overview',
            text: 'Overview',
            thingsToDo: {
              things: [],
              count: 0,
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

      courtCaseReleaseDatesApiClient.getServiceDefinitions.mockResolvedValue(serviceDefinitions)

      const result = await courtCaseReleaseDatesService.getServiceDefinitions('A1234AA', 'test-token')

      expect(courtCaseReleaseDatesApiClient.getServiceDefinitions).toHaveBeenCalledWith('A1234AA', 'test-token')
      expect(result).toEqual(serviceDefinitions)
    })
  })
})
