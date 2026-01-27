import RemandAndSentencingApiClient from '../data/remandAndSentencingApiClient'
import ImmigrationDetentionService from './immigrationDetentionService'
import ImmigrationDetention from '../@types/ImmigrationDetention'
import {
  CreateImmigrationDetention,
  DeleteImmigrationDetentionResponse,
  SaveImmigrationDetentionResponse,
} from '../@types/remandAndSentencingApi/remandAndSentencingClientTypes'

jest.mock('../data/remandAndSentencingApiClient')

const remandAndSentencingApiClient = new RemandAndSentencingApiClient(null) as jest.Mocked<RemandAndSentencingApiClient>
remandAndSentencingApiClient.getImmigrationDetentionRecord = jest.fn()

const IMMIGRATION_DETENTION_OBJECT: ImmigrationDetention = {
  createdAt: '2025-11-03T08:06:37.123Z',
  source: 'DPS',
  prisonerId: 'ABC123',
  immigrationDetentionUuid: 'IMM-DET-UUID-1234',
  immigrationDetentionRecordType: 'IS91',
  homeOfficeReferenceNumber: 'ABC123',
  recordDate: '2022-06-22',
  courtAppearanceUuid: '1234',
}

const IMMIGRATION_DETENTION_NLI_OBJECT: ImmigrationDetention = {
  source: 'DPS',
  immigrationDetentionUuid: 'IMM-DET-UUID-12345',
  prisonerId: 'ABC123',
  immigrationDetentionRecordType: 'NO_LONGER_OF_INTEREST',
  recordDate: '2022-06-22',
  homeOfficeReferenceNumber: 'ABC123',
  noLongerOfInterestReason: 'OTHER_REASON',
  noLongerOfInterestComment: 'Confirmed not of interest',
  createdAt: '2025-11-03T08:06:37.123Z',
  courtAppearanceUuid: '1234',
}

const SAVED_IMMIGRATION_DETENTION_OBJECT: SaveImmigrationDetentionResponse = {
  immigrationDetentionUuid: 'IMM-DET-UUID-1234',
}

const DELETED_IMMIGRATION_DETENTION_OBJECT: DeleteImmigrationDetentionResponse = {
  immigrationDetentionUuid: 'IMM-DET-UUID-1234',
}

const CREATE_IMMIGRATION_DETENTION_OBJECT: CreateImmigrationDetention = {
  createdByPrison: 'KMI',
  createdByUsername: 'user-1',
  appearanceOutcomeUuid: 'outcome-uuid-12345',
  immigrationDetentionRecordType: IMMIGRATION_DETENTION_OBJECT.immigrationDetentionRecordType,
  homeOfficeReferenceNumber: IMMIGRATION_DETENTION_OBJECT.homeOfficeReferenceNumber,
  prisonerId: 'ABC123',
  recordDate: IMMIGRATION_DETENTION_OBJECT.recordDate,
}

describe('immigrationDetentionService', () => {
  let immigrationDetentionService: ImmigrationDetentionService

  beforeEach(() => {
    immigrationDetentionService = new ImmigrationDetentionService(remandAndSentencingApiClient)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Immigration Detention verbs', () => {
    it('GetImmigrationDetentionByUUID DPS source', async () => {
      remandAndSentencingApiClient.getImmigrationDetentionRecord.mockResolvedValue(IMMIGRATION_DETENTION_OBJECT)

      const result = await immigrationDetentionService.getImmigrationDetentionByUUID(
        'IMM-DET-UUID-1234',
        'DPS',
        '5678',
        'test-user',
      )

      expect(remandAndSentencingApiClient.getImmigrationDetentionRecord).toHaveBeenCalledWith(
        'IMM-DET-UUID-1234',
        'test-user',
      )
      expect(result).toEqual(IMMIGRATION_DETENTION_OBJECT)
    })

    it('GetImmigrationDetentionByUUID NOMIS source', async () => {
      remandAndSentencingApiClient.getImmigrationDetentionRecordFromCourtAppearance.mockResolvedValue(
        IMMIGRATION_DETENTION_OBJECT,
      )

      const result = await immigrationDetentionService.getImmigrationDetentionByUUID(
        'IMM-DET-UUID-1234',
        'NOMIS',
        '5678',
        'test-user',
      )

      expect(remandAndSentencingApiClient.getImmigrationDetentionRecordFromCourtAppearance).toHaveBeenCalledWith(
        '5678',
        'test-user',
      )
      expect(result).toEqual(IMMIGRATION_DETENTION_OBJECT)
    })

    it('GetImmigrationDetentionByPrisoner', async () => {
      const immigrationDetentionList = [IMMIGRATION_DETENTION_OBJECT, IMMIGRATION_DETENTION_NLI_OBJECT]
      remandAndSentencingApiClient.findByPerson.mockResolvedValue(immigrationDetentionList)

      const result = await immigrationDetentionService.getImmigrationDetentionRecordsForPrisoner('ABC1234', 'test-user')

      expect(remandAndSentencingApiClient.findByPerson).toHaveBeenCalledWith('ABC1234', 'test-user')
      expect(result).toEqual(immigrationDetentionList)
    })

    it('Create a Immigration Detention Record', async () => {
      remandAndSentencingApiClient.createImmigrationDetention.mockResolvedValue(SAVED_IMMIGRATION_DETENTION_OBJECT)

      const result = await immigrationDetentionService.createImmigrationDetention(
        CREATE_IMMIGRATION_DETENTION_OBJECT,
        'test-user',
      )

      expect(remandAndSentencingApiClient.createImmigrationDetention).toHaveBeenCalledWith(
        CREATE_IMMIGRATION_DETENTION_OBJECT,
        'test-user',
      )
      expect(result).toEqual(SAVED_IMMIGRATION_DETENTION_OBJECT)
    })

    it('Update a Immigration Detention Record', async () => {
      remandAndSentencingApiClient.updateImmigrationDetention.mockResolvedValue(SAVED_IMMIGRATION_DETENTION_OBJECT)

      const result = await immigrationDetentionService.updateImmigrationDetention(
        'IMM-DET-UUID-1234',
        CREATE_IMMIGRATION_DETENTION_OBJECT,
        'test-user',
      )

      expect(remandAndSentencingApiClient.updateImmigrationDetention).toHaveBeenCalledWith(
        'IMM-DET-UUID-1234',
        CREATE_IMMIGRATION_DETENTION_OBJECT,
        'test-user',
      )
      expect(result).toEqual(SAVED_IMMIGRATION_DETENTION_OBJECT)
    })

    it('Delete a Immigration Detention Record DPS sourced', async () => {
      remandAndSentencingApiClient.deleteImmigrationDetention.mockResolvedValue(DELETED_IMMIGRATION_DETENTION_OBJECT)

      const result = await immigrationDetentionService.deleteImmigrationDetentionByUUID(
        'IMM-DET-UUID-1234',
        'DPS',
        '456',
        'test-user',
      )

      expect(remandAndSentencingApiClient.deleteImmigrationDetention).toHaveBeenCalledWith(
        'IMM-DET-UUID-1234',
        'test-user',
      )
      expect(result).toEqual(DELETED_IMMIGRATION_DETENTION_OBJECT)
    })

    it('Delete a Immigration Detention Record NOMIS sourced', async () => {
      await immigrationDetentionService.deleteImmigrationDetentionByUUID(
        'IMM-DET-UUID-1234',
        'NOMIS',
        '456',
        'test-user',
      )

      expect(remandAndSentencingApiClient.deleteCourtAppearance).toHaveBeenCalledWith('456', 'test-user')
    })
  })
})
