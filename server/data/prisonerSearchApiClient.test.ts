import { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'

import 'reflect-metadata'
import nock from 'nock'
import config from '../config'
import PrisonerSearchApiClient from './prisonerSearchApiClient'
import { PrisonerSearchApiPrisoner } from '../@types/prisonerSearchApi/prisonerSearchTypes'
import FullPageErrorType from '../model/FullPageErrorType'

describe('prisonerSearchClient', () => {
  let fakePrisonerSearchApi: nock.Scope
  let client: PrisonerSearchApiClient
  let mockAuthenticationClient: jest.Mocked<AuthenticationClient>

  const prisonerDetails = {
    prisonerNumber: 'A1234AB',
    firstName: 'Anon',
    lastName: 'Nobody',
    prisonId: 'MDI',
  } as PrisonerSearchApiPrisoner

  beforeEach(() => {
    fakePrisonerSearchApi = nock(config.apis.prisonerSearchApi.url)
    mockAuthenticationClient = {
      getToken: jest.fn().mockResolvedValue('test-system-token'),
    } as unknown as jest.Mocked<AuthenticationClient>
    client = new PrisonerSearchApiClient(mockAuthenticationClient)
  })

  afterEach(() => {
    nock.cleanAll()
  })

  it('Test getting prisoner details', async () => {
    fakePrisonerSearchApi.get(`/prisoner/A1234AB`).reply(200, prisonerDetails)

    const result = await client.getPrisonerDetails('A1234AB')

    expect(result).toEqual(prisonerDetails)
  })

  it('Test getting prisoner details when caseload is different', async () => {
    fakePrisonerSearchApi.get(`/prisoner/A1234AB`).reply(200, { ...prisonerDetails, agencyId: 'LEX' })

    try {
      await client.getPrisonerDetails('A1234AB')
    } catch (error) {
      expect(error.errorKey).toBe(FullPageErrorType.NOT_IN_CASELOAD)
      expect(error.status).toBe(404)
    }
  })

  it('Test getting released prisoner details when user has inactive booking role', async () => {
    fakePrisonerSearchApi.get(`/prisoner/A1234AB`).reply(200, { ...prisonerDetails, agencyId: 'OUT' })

    const result = await client.getPrisonerDetails('A1234AB')

    expect(result.prisonerNumber).toEqual(prisonerDetails.prisonerNumber)
  })

  it('Test getting released prisoner details when user does not have inactive booking role', async () => {
    fakePrisonerSearchApi.get(`/prisoner/A1234AB`).reply(200, { ...prisonerDetails, agencyId: 'OUT' })

    try {
      await client.getPrisonerDetails('A1234AB')
    } catch (error) {
      expect(error.errorKey).toBe(FullPageErrorType.NOT_IN_CASELOAD)
      expect(error.status).toBe(404)
    }
  })

  it('Test getting transferred prisoner details', async () => {
    fakePrisonerSearchApi.get(`/prisoner/A1234AB`).reply(200, { ...prisonerDetails, agencyId: 'TRN' })

    const result = await client.getPrisonerDetails('A1234AB')

    expect(result.prisonerNumber).toEqual(prisonerDetails.prisonerNumber)
  })
})
