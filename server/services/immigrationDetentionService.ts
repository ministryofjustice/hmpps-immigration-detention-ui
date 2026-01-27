import ImmigrationDetention, { AppearanceOutcome } from '../@types/ImmigrationDetention'
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
    source: 'NOMIS' | 'DPS',
    courtAppearanceUuid: string,
    username: string,
  ): Promise<ImmigrationDetention> {
    return source === 'NOMIS'
      ? this.remandAndSentencingApiClient.getImmigrationDetentionRecordFromCourtAppearance(
          courtAppearanceUuid,
          username,
        )
      : this.remandAndSentencingApiClient.getImmigrationDetentionRecord(immigrationDetentionUUId, username)
  }

  public async deleteImmigrationDetentionByUUID(
    immigrationDetentionUUId: string,
    source: 'NOMIS' | 'DPS',
    courtAppearanceUuid: string,
    username: string,
  ): Promise<DeleteImmigrationDetentionResponse | void> {
    return source === 'NOMIS'
      ? this.remandAndSentencingApiClient.deleteCourtAppearance(courtAppearanceUuid, username)
      : this.remandAndSentencingApiClient.deleteImmigrationDetention(immigrationDetentionUUId, username)
  }

  public getImmigrationDetentionRecordsForPrisoner(
    prisonerId: string,
    username: string,
  ): Promise<ImmigrationDetention[]> {
    return this.remandAndSentencingApiClient.findByPerson(prisonerId, username)
  }

  public getImmigrationDetentionAppearanceOutcomes(username: string): Promise<AppearanceOutcome[]> {
    return this.remandAndSentencingApiClient
      .getAllAppearanceOutcomes(username)
      .then(outcomes => outcomes.filter(outcome => outcome.outcomeType === 'IMMIGRATION'))
  }
}
