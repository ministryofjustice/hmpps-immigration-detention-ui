import ImmigrationDetention from '../@types/ImmigrationDetention'
import RemandAndSentencingApiClient from '../data/remandAndSentencingApiClient'
import {
  CreateImmigrationDetention,
  DeleteImmigrationDetentionResponse,
  SaveImmigrationDetentionResponse,
} from '../@types/remandAndSentencingApi/remandAndSentencingClientTypes'

export default class ImmigrationDetentionService {
  constructor(private remandAndSentencingApiClient: RemandAndSentencingApiClient) {}

  public async createImmigrationDetention(
    immigrationDetention: CreateImmigrationDetention,
    username: string,
  ): Promise<SaveImmigrationDetentionResponse> {
    return this.remandAndSentencingApiClient.createImmigrationDetention(immigrationDetention, username)
  }

  public async updateImmigrationDetention(
    immigrationDetentionUuid: string,
    immigrationDetention: CreateImmigrationDetention,
    username: string,
  ): Promise<SaveImmigrationDetentionResponse> {
    return this.remandAndSentencingApiClient.updateImmigrationDetention(
      immigrationDetentionUuid,
      immigrationDetention,
      username,
    )
  }

  public async getImmigrationDetentionByUUID(
    immigrationDetentionUUId: string,
    username: string,
  ): Promise<ImmigrationDetention> {
    return this.remandAndSentencingApiClient.getImmigrationDetentionRecord(immigrationDetentionUUId, username)
  }

  public async deleteImmigrationDetentionByUUID(
    immigrationDetentionUUId: string,
    username: string,
  ): Promise<DeleteImmigrationDetentionResponse> {
    return this.remandAndSentencingApiClient.deleteImmigrationDetention(immigrationDetentionUUId, username)
  }

  public getImmigrationDetentionRecordsForPrisoner(
    prisonerId: string,
    username: string,
  ): Promise<ImmigrationDetention[]> {
    return this.remandAndSentencingApiClient.findByPerson(prisonerId, username)
  }
}
