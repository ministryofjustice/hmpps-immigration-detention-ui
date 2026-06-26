import type { SuperAgentRequest } from 'superagent'
import { stubFor, stubPing } from './wiremock'

const stubGetUserCaseloads = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/prison-api/api/users/me/caseLoads',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: [
        {
          caseLoadId: 'BRI',
        },
      ],
    },
  })

const stubGetPrisonerImage = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/prison-api/api/bookings/offenderNo/A1234AB/image/data',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'image/png' },
      base64Body:
        'iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAAQMAAABmvDolAAAAA1BMVEW10NBjBBbqAAAAH0lEQVRoge3BAQ0AAADCoPdPbQ43oAAAAAAAAAAAvg0hAAABmmDh1QAAAABJRU5ErkJggg==',
    },
  })

const ping = (httpStatus = 200): SuperAgentRequest => stubPing('/prison-api', httpStatus)

export default {
  stubGetUserCaseloads,
  stubGetPrisonerImage,
  stubPing: ping,
  stubGetUserCasePing: ping,
}
