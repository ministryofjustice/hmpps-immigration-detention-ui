import { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'

import 'reflect-metadata'
import nock from 'nock'
import config from '../config'
import RemandAndSentencingApiClient from './remandAndSentencingApiClient'
import ImmigrationDetention from '../@types/ImmigrationDetention'
import {
  CreateImmigrationDetention,
  DeleteImmigrationDetentionResponse,
  SaveImmigrationDetentionResponse,
} from '../@types/remandAndSentencingApi/remandAndSentencingClientTypes'

const immigrationDetentionUuid = '123e4567-e89b-12d3-a456-426614174000'

const IMMIGRATION_DETENTION_OBJECT: ImmigrationDetention = {
  createdAt: '2025-11-03T08:06:37.123Z',
  recordDate: '2022-06-22',
  source: 'DPS',
  prisonerId: 'ABC123',
  immigrationDetentionUuid,
  immigrationDetentionRecordType: 'IS91',
  homeOfficeReferenceNumber: 'ABC123',
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
}

const DELETED_IMMIGRATION_DETENTION_OBJECT: DeleteImmigrationDetentionResponse = {
  immigrationDetentionUuid,
}

const CREATE_IMMIGRATION_DETENTION_OBJECT: CreateImmigrationDetention = {
  recordDate: '2022-06-22',
  createdByPrison: 'KMI',
  createdByUsername: 'user-1',
  appearanceOutcomeUuid: 'outcome-uuid-12345',
  immigrationDetentionRecordType: IMMIGRATION_DETENTION_OBJECT.immigrationDetentionRecordType,
  homeOfficeReferenceNumber: IMMIGRATION_DETENTION_OBJECT.homeOfficeReferenceNumber,
  prisonerId: 'ABC123',
}

const SAVED_IMMIGRATION_DETENTION_OBJECT: SaveImmigrationDetentionResponse = {
  immigrationDetentionUuid,
}

describe('remandAndSentencingApiClient', () => {
  let fakeRemandAndSentencingApiClient: nock.Scope
  let client: RemandAndSentencingApiClient
  let mockAuthenticationClient: jest.Mocked<AuthenticationClient>

  beforeEach(() => {
    fakeRemandAndSentencingApiClient = nock(config.apis.remandAndSentencingApi.url)
    mockAuthenticationClient = {
      getToken: jest.fn().mockResolvedValue('test-system-token'),
    } as unknown as jest.Mocked<AuthenticationClient>
    client = new RemandAndSentencingApiClient(mockAuthenticationClient)
  })

  afterEach(() => {
    nock.cleanAll()
  })

  it('Test getting immigration detention details for an UUId', async () => {
    fakeRemandAndSentencingApiClient
      .get(`/immigration-detention/${immigrationDetentionUuid}`)
      .reply(200, IMMIGRATION_DETENTION_OBJECT)

    const result = await client.getImmigrationDetentionRecord(immigrationDetentionUuid, 'test-token')

    expect(result).toEqual(IMMIGRATION_DETENTION_OBJECT)
  })

  it('Test getting immigration detention details for an prisoner', async () => {
    fakeRemandAndSentencingApiClient
      .get(`/immigration-detention/person/ABC123`)
      .reply(200, [IMMIGRATION_DETENTION_OBJECT, IMMIGRATION_DETENTION_NLI_OBJECT])

    const result = await client.findByPerson('ABC123', 'test-token')

    expect(result).toEqual([IMMIGRATION_DETENTION_OBJECT, IMMIGRATION_DETENTION_NLI_OBJECT])
  })

  it('Test updating immigration detention details for an UUId', async () => {
    fakeRemandAndSentencingApiClient
      .put(`/immigration-detention/${immigrationDetentionUuid}`, CREATE_IMMIGRATION_DETENTION_OBJECT)
      .reply(200, SAVED_IMMIGRATION_DETENTION_OBJECT)

    const result = await client.updateImmigrationDetention(
      immigrationDetentionUuid,
      CREATE_IMMIGRATION_DETENTION_OBJECT,
      'test-token',
    )

    expect(result).toEqual(SAVED_IMMIGRATION_DETENTION_OBJECT)
  })

  it('Test creating immigration detention details', async () => {
    fakeRemandAndSentencingApiClient
      .post(`/immigration-detention`, CREATE_IMMIGRATION_DETENTION_OBJECT)
      .reply(200, SAVED_IMMIGRATION_DETENTION_OBJECT)

    const result = await client.createImmigrationDetention(CREATE_IMMIGRATION_DETENTION_OBJECT, 'test-token')

    expect(result).toEqual(SAVED_IMMIGRATION_DETENTION_OBJECT)
  })

  it('Test deleting immigration detention details for an UUId', async () => {
    fakeRemandAndSentencingApiClient
      .delete(`/immigration-detention/${immigrationDetentionUuid}`)
      .reply(200, DELETED_IMMIGRATION_DETENTION_OBJECT)

    const result = await client.deleteImmigrationDetention(immigrationDetentionUuid, 'test-token')

    expect(result).toEqual(DELETED_IMMIGRATION_DETENTION_OBJECT)
  })
})
