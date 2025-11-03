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
    token: string,
  ): Promise<SaveImmigrationDetentionResponse> {
    return this.remandAndSentencingApiClient.createImmigrationDetention(immigrationDetention, token)
  }

  public async updateImmigrationDetention(
    immigrationDetentionUuid: string,
    immigrationDetention: CreateImmigrationDetention,
    token: string,
  ): Promise<SaveImmigrationDetentionResponse> {
    return this.remandAndSentencingApiClient.updateImmigrationDetention(
      immigrationDetentionUuid,
      immigrationDetention,
      token,
    )
  }

  public async getImmigrationDetentionByUUID(
    immigrationDetentionUUId: string,
    token: string,
  ): Promise<ImmigrationDetention> {
    return this.remandAndSentencingApiClient.getImmigrationDetentionRecord(immigrationDetentionUUId, token)
  }

  public async deleteImmigrationDetentionByUUID(
    immigrationDetentionUUId: string,
    token: string,
  ): Promise<DeleteImmigrationDetentionResponse> {
    return this.remandAndSentencingApiClient.deleteImmigrationDetention(immigrationDetentionUUId, token)
  }

  public getImmigrationDetentionRecordsForPrisoner(prisonerId: string, token: string): Promise<ImmigrationDetention[]> {
    return this.remandAndSentencingApiClient.findByPerson(prisonerId, token)
  }
}
