import { ApiConfig, asSystem, RestClient } from '@ministryofjustice/hmpps-rest-client'
import { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import config from '../config'
import logger from '../../logger'
import ImmigrationDetention, { AppearanceOutcome } from '../@types/ImmigrationDetention'
import {
  CreateImmigrationDetention,
  DeleteImmigrationDetentionResponse,
  SaveImmigrationDetentionResponse,
} from '../@types/remandAndSentencingApi/remandAndSentencingClientTypes'

export default class RemandAndSentencingApiClient extends RestClient {
  constructor(authenticationClient: AuthenticationClient) {
    super(
      'Remand And Sentencing API Client',
      config.apis.remandAndSentencingApi as ApiConfig,
      logger,
      authenticationClient,
    )
  }

  async createImmigrationDetention(
    createImmigrationDetention: CreateImmigrationDetention,
    username: string,
  ): Promise<SaveImmigrationDetentionResponse> {
    return this.post(
      {
        path: '/immigration-detention',
        data: createImmigrationDetention,
      },
      asSystem(username),
    ) as Promise<SaveImmigrationDetentionResponse>
  }

  async updateImmigrationDetention(
    immigrationDetentionUuId: string,
    createImmigrationDetention: CreateImmigrationDetention,
    username: string,
  ): Promise<SaveImmigrationDetentionResponse> {
    return this.put(
      {
        path: `/immigration-detention/${immigrationDetentionUuId}`,
        data: createImmigrationDetention,
      },
      asSystem(username),
    ) as Promise<SaveImmigrationDetentionResponse>
  }

  async deleteImmigrationDetention(
    immigrationDetentionUUId: string,
    username: string,
  ): Promise<DeleteImmigrationDetentionResponse> {
    return this.delete(
      {
        path: `/immigration-detention/${immigrationDetentionUUId}`,
      },
      asSystem(username),
    ) as Promise<DeleteImmigrationDetentionResponse>
  }

  async getImmigrationDetentionRecord(
    immigrationDetentionUUId: string,
    username: string,
  ): Promise<ImmigrationDetention> {
    return this.get(
      { path: `/immigration-detention/${immigrationDetentionUUId}` },
      asSystem(username),
    ) as Promise<ImmigrationDetention>
  }

  async findByPerson(person: string, username: string): Promise<ImmigrationDetention[]> {
    return this.get({ path: `/immigration-detention/person/${person}` }, asSystem(username)) as Promise<
      ImmigrationDetention[]
    >
  }

  async getAllAppearanceOutcomes(username: string): Promise<AppearanceOutcome[]> {
    return (await this.get(
      {
        path: `/appearance-outcome/status`,
        query: {
          statuses: 'ACTIVE',
        },
      },
      asSystem(username),
    )) as unknown as Promise<AppearanceOutcome[]>
  }
}
