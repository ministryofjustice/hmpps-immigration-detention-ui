import UserService from './userService'
import ManageUsersApiClient, { type User } from '../data/manageUsersApiClient'
import createUserToken from '../testutils/createUserToken'
import { PrisonApiUserCaseloads } from '../@types/prisonApi/prisonClientTypes'
import PrisonerSearchService from './prisonerSearchService'

jest.mock('../data/manageUsersApiClient')

describe('User service', () => {
  let manageUsersApiClient: jest.Mocked<ManageUsersApiClient>
  let userService: UserService
  let prisonerSearchService: jest.Mocked<PrisonerSearchService>
  const caseload = {
    caseLoadId: 'BRI',
  } as PrisonApiUserCaseloads

  describe('getUser', () => {
    beforeEach(() => {
      manageUsersApiClient = new ManageUsersApiClient() as jest.Mocked<ManageUsersApiClient>
      prisonerSearchService = new PrisonerSearchService(null, null) as jest.Mocked<PrisonerSearchService>
      userService = new UserService(manageUsersApiClient, prisonerSearchService)
      prisonerSearchService.getUsersCaseloads = jest.fn()
    })

    it('Retrieves and formats user name', async () => {
      const token = createUserToken([])
      manageUsersApiClient.getUser.mockResolvedValue({ name: 'john smith' } as User)
      prisonerSearchService.getUsersCaseloads.mockResolvedValue([caseload])

      const result = await userService.getUser(token)

      expect(result.name).toEqual('john smith')
    })

    it('Propagates error', async () => {
      const token = createUserToken([])
      manageUsersApiClient.getUser.mockRejectedValue(new Error('some error'))

      await expect(userService.getUser(token)).rejects.toEqual(new Error('some error'))
    })
  })
})
