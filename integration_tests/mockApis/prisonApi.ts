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
  stubGetUserCasePing: ping,
}
