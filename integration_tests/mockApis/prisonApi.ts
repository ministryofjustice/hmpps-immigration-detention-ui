import { stubFor } from './wiremock'

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

const ping = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/prison-api/health/ping',
    },
    response: {
      status: 200,
    },
  })

export default {
  stubGetUserCaseloads,
  stubGetPrisonerImage,
  stubGetUserCasePing: ping,
}
