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
        prisonerId: 'ABC1234',
        immigrationDetentionRecordType: 'IS91',
        recordDate: '2025-11-03',
        homeOfficeReferenceNumber: 'string',
        noLongerOfInterestReason: 'BRITISH_CITIZEN',
        noLongerOfInterestComment: 'string',
        createdAt: '2025-11-03T08:06:37.123Z',
        source: 'NOMIS',
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
          homeOfficeReferenceNumber: 'string',
          noLongerOfInterestReason: 'BRITISH_CITIZEN',
          noLongerOfInterestComment: 'string',
          createdAt: '2025-11-03T08:12:44.525Z',
          source: 'NOMIS',
        },
      ],
    },
  })

const stubPutImmigrationDetentionByUUID = () =>
  stubFor({
    request: {
      method: 'POST',
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
}
