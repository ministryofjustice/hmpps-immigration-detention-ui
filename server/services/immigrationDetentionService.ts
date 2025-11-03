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
  ): Promise<SaveImmigrationDetentionResponse> {
    return this.remandAndSentencingApiClient.createImmigrationDetention(immigrationDetention)
  }

  public async updateImmigrationDetention(
    immigrationDetentionUuid: string,
    immigrationDetention: CreateImmigrationDetention,
  ): Promise<SaveImmigrationDetentionResponse> {
    return this.remandAndSentencingApiClient.updateImmigrationDetention(immigrationDetentionUuid, immigrationDetention)
  }

  public async getImmigrationDetentionByUUID(immigrationDetentionUUId: string): Promise<ImmigrationDetention> {
    return this.remandAndSentencingApiClient.getImmigrationDetentionRecord(immigrationDetentionUUId)
  }

  public async deleteImmigrationDetentionByUUID(
    immigrationDetentionUUId: string,
  ): Promise<DeleteImmigrationDetentionResponse> {
    return this.remandAndSentencingApiClient.deleteImmigrationDetention(immigrationDetentionUUId)
  }

  public getImmigrationDetentionRecordsForPrisoner(prisonerId: string): Promise<ImmigrationDetention[]> {
    return this.remandAndSentencingApiClient.findByPerson(prisonerId)
  }
}
