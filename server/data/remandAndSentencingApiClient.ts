import { ApiConfig, asSystem, RestClient } from '@ministryofjustice/hmpps-rest-client'
import { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import config from '../config'
import logger from '../../logger'
import ImmigrationDetention from '../@types/ImmigrationDetention'
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
    token: string,
  ): Promise<SaveImmigrationDetentionResponse> {
    return this.post(
      {
        path: '/immigration-detention',
        data: createImmigrationDetention,
      },
      asSystem(token),
    ) as Promise<SaveImmigrationDetentionResponse>
  }

  async updateImmigrationDetention(
    immigrationDetentionUuId: string,
    createImmigrationDetention: CreateImmigrationDetention,
    token: string,
  ): Promise<SaveImmigrationDetentionResponse> {
    return this.put(
      {
        path: `/immigration-detention/${immigrationDetentionUuId}`,
        data: createImmigrationDetention,
      },
      asSystem(token),
    ) as Promise<SaveImmigrationDetentionResponse>
  }

  async deleteImmigrationDetention(
    immigrationDetentionUUId: string,
    token: string,
  ): Promise<DeleteImmigrationDetentionResponse> {
    return this.delete(
      {
        path: `/immigration-detention/${immigrationDetentionUUId}`,
      },
      asSystem(token),
    ) as Promise<DeleteImmigrationDetentionResponse>
  }

  async getImmigrationDetentionRecord(immigrationDetentionUUId: string, token: string): Promise<ImmigrationDetention> {
    return this.get(
      { path: `/immigration-detention/${immigrationDetentionUUId}` },
      asSystem(token),
    ) as Promise<ImmigrationDetention>
  }

  async findByPerson(person: string, token: string): Promise<ImmigrationDetention[]> {
    return this.get({ path: `/immigration-detention/person/${person}` }, asSystem(token)) as Promise<
      ImmigrationDetention[]
    >
  }
}
