import { stubFor } from './wiremock'

const stubGetImmigrationDetentionByUUID = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/ras-api/immigration-detention/3fa85f64-5717-4562-b3fc-2c963f66afa6',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        immigrationDetentionUuid: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        prisonerId: 'A1234AB',
        immigrationDetentionRecordType: 'IS91',
        recordDate: '2025-11-03',
        homeOfficeReferenceNumber: 'A12345678900',
        noLongerOfInterestReason: 'BRITISH_CITIZEN',
        noLongerOfInterestComment: 'string',
        createdAt: '2025-11-03T08:06:37.123Z',
        source: 'DPS',
      },
    },
  })

const stubPostImmigrationDetention = () =>
  stubFor({
    request: {
      method: 'POST',
      urlPattern: '/ras-api/immigration-detention',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        prisonerId: 'string',
        immigrationDetentionRecordType: 'IS91',
        recordDate: '2025-11-03',
        appearanceOutcomeUuid: 'A1234AB',
        homeOfficeReferenceNumber: 'string',
        noLongerOfInterestReason: 'BRITISH_CITIZEN',
        noLongerOfInterestComment: 'string',
        createdByUsername: 'string',
        createdByPrison: 'string',
      },
    },
  })

const stubGetImmigrationDetentionByPrisoner = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/ras-api/immigration-detention/person/A1234AB',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: [
        {
          immigrationDetentionUuid: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          prisonerId: 'string',
          immigrationDetentionRecordType: 'IS91',
          recordDate: '2025-11-03',
          homeOfficeReferenceNumber: 'A12345678900',
          noLongerOfInterestReason: 'BRITISH_CITIZEN',
          noLongerOfInterestComment: 'string',
          createdAt: '2025-11-03T08:12:44.525Z',
          source: 'DPS',
        },
        {
          immigrationDetentionUuid: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          prisonerId: 'string',
          immigrationDetentionRecordType: 'IS91',
          recordDate: '2025-11-03',
          homeOfficeReferenceNumber: 'A12345678900',
          noLongerOfInterestReason: 'BRITISH_CITIZEN',
          noLongerOfInterestComment: 'string',
          createdAt: '2025-11-03T08:12:44.525Z',
          source: 'DPS',
        },
      ],
    },
  })

const stubPutImmigrationDetentionByUUID = () =>
  stubFor({
    request: {
      method: 'PUT',
      urlPattern: '/ras-api/immigration-detention/3fa85f64-5717-4562-b3fc-2c963f66afa6',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        prisonerId: 'string',
        immigrationDetentionRecordType: 'IS91',
        recordDate: '2025-11-03',
        homeOfficeReferenceNumber: 'string',
        noLongerOfInterestReason: 'BRITISH_CITIZEN',
        noLongerOfInterestComment: 'string',
        createdByUsername: 'string',
        createdByPrison: 'string',
      },
    },
  })

const stubDeleteImmigrationDetentionByUUID = () =>
  stubFor({
    request: {
      method: 'DELETE',
      urlPattern: '/ras-api/immigration-detention/3fa85f64-5717-4562-b3fc-2c963f66afa6',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        immigrationDetentionUuid: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      },
    },
  })

const stubGetAllAppearanceOutcomes = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPath: '/ras-api/appearance-outcome/status',
      queryParameters: {
        statuses: {
          equalTo: 'ACTIVE',
        },
      },
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: [
        {
          outcomeUuid: '8316a91d-c154-4eff-87d1-75a42777677b',
          outcomeName: 'Outcome Name',
          nomisCode: '5500',
          outcomeType: 'IMMIGRATION',
          displayOrder: 1,
          relatedChargeOutcomeUuid: 'c96fd611-c747-4de2-ae28-51d9f0a5416a',
          isSubList: false,
          dispositionCode: 'DISP',
        },
        {
          outcomeUuid: 'dd50ba6c-55cf-40d7-a640-db8830edf85f',
          outcomeName: 'Outcome Name',
          nomisCode: '5501',
          outcomeType: 'IMMIGRATION',
          displayOrder: 1,
          relatedChargeOutcomeUuid: 'aa56837a-feda-4237-8603-041498bdefc4',
          isSubList: false,
          dispositionCode: 'DISP',
        },
        {
          outcomeUuid: '29093189-4cb7-4658-8301-e7e9e2b6958f',
          outcomeName: 'Outcome Name',
          nomisCode: '5502',
          outcomeType: 'IMMIGRATION',
          displayOrder: 1,
          relatedChargeOutcomeUuid: 'a9cd6b02-942f-4686-9151-e46d620ca3b9',
          isSubList: false,
          dispositionCode: 'DISP',
        },
        {
          outcomeUuid: '1661087d-84e8-45b5-a694-81732866f4a1',
          outcomeName: 'Outcome Name',
          nomisCode: '5503',
          outcomeType: 'IMMIGRATION',
          displayOrder: 1,
          relatedChargeOutcomeUuid: '19789b21-16c4-43e7-ad66-13553545b6ea',
          isSubList: false,
          dispositionCode: 'DISP',
        },
      ],
    },
  })

const ping = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/ras-api/health/ping',
    },
    response: {
      status: 200,
    },
  })

export default {
  stubGetImmigrationDetentionByUUID,
  stubPostImmigrationDetention,
  stubGetImmigrationDetentionByPrisoner,
  stubDeleteImmigrationDetentionByUUID,
  stubPutImmigrationDetentionByUUID,
  stubRASApiPing: ping,
  stubGetAllAppearanceOutcomes,
}
