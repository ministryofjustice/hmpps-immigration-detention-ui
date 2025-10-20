import { Readable } from 'stream'
import 'reflect-metadata'

import PrisonApiClient from '../data/prisonApiClient'

import PrisonerSearchApiClient from '../data/prisonerSearchApiClient'
import PrisonerSearchService from './prisonerSearchService'
import { PrisonerSearchApiPrisoner } from '../@types/prisonerSearchApi/prisonerSearchTypes'
import FullPageErrorType from '../model/FullPageErrorType'
import { UserDetails } from '../data/manageUsersApiClient'

jest.mock('../data/prisonerSearchApiClient')
jest.mock('../data/prisonApiClient')

const prisonApiClient = new PrisonApiClient(null) as jest.Mocked<PrisonApiClient>
const prisonerSearchClient = new PrisonerSearchApiClient(null) as jest.Mocked<PrisonerSearchApiClient>

const username = 'some-user'

const user = {
  username,
  caseloads: ['BRI'],
} as UserDetails

const prisonerDetails = {
  prisonerNumber: 'A1234AB',
  firstName: 'Anon',
  lastName: 'Nobody',
  prisonId: 'BRI',
} as PrisonerSearchApiPrisoner

describe('prisonerSearchService', () => {
  let prisonerSearchService: PrisonerSearchService

  beforeEach(() => {
    prisonerSearchService = new PrisonerSearchService(prisonApiClient, prisonerSearchClient)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('getPrisonerImage and getPrisonerDetails', () => {
    it('uses prison api to request image data', async () => {
      prisonApiClient.getPrisonerImage.mockResolvedValue(Readable.from('image data'))

      const result = await prisonerSearchService.getPrisonerImage('A1234AA', {
        username: 'user1',
        token: 'token-1',
      })

      expect(result.read()).toEqual('image data')
      expect(prisonApiClient.getPrisonerImage).toHaveBeenCalledWith('A1234AA', 'user1')
    })
  })

  it('Test getting prisoner details', async () => {
    prisonerSearchClient.getPrisonerDetails.mockResolvedValue(prisonerDetails)

    const result = await prisonerSearchService.getPrisonerDetails('A1234AB', user)

    expect(result).toEqual(prisonerDetails)
  })

  it('Test getting prisoner details when caseload is different', async () => {
    prisonerSearchClient.getPrisonerDetails.mockResolvedValue(prisonerDetails)

    try {
      await prisonerSearchService.getPrisonerDetails('A1234AB', user)
    } catch (error) {
      expect(error.errorKey).toBe(FullPageErrorType.NOT_IN_CASELOAD)
      expect(error.status).toBe(404)
    }
  })

  it('Test getting released prisoner details when user has inactive booking role', async () => {
    prisonerSearchClient.getPrisonerDetails.mockResolvedValue(prisonerDetails)

    const result = await prisonerSearchService.getPrisonerDetails('A1234AB', {
      ...user,
      hasInactiveBookingsAccess: true,
    })

    expect(result.prisonerNumber).toEqual(prisonerDetails.prisonerNumber)
  })

  it('Test getting released prisoner details when user does not have inactive booking role', async () => {
    prisonerSearchClient.getPrisonerDetails.mockResolvedValue(prisonerDetails)

    try {
      await prisonerSearchService.getPrisonerDetails('A1234AB', { ...user, hasInactiveBookingsAccess: false })
    } catch (error) {
      expect(error.errorKey).toBe(FullPageErrorType.NOT_IN_CASELOAD)
      expect(error.status).toBe(404)
    }
  })

  it('Test getting transferred prisoner details', async () => {
    prisonerSearchClient.getPrisonerDetails.mockResolvedValue(prisonerDetails)

    const result = await prisonerSearchService.getPrisonerDetails('A1234AB', user)

    expect(result.prisonerNumber).toEqual(prisonerDetails.prisonerNumber)
  })
})
