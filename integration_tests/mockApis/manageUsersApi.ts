import type { SuperAgentRequest } from 'superagent'
import { stubFor, stubPing } from './wiremock'

const stubUser = (name: string = 'john smith') =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/manage-users-api/users/me',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: {
        username: 'USER1',
        caseloads: ['BRI'],
        active: true,
        name,
      },
    },
  })

const ping = (httpStatus = 200): SuperAgentRequest => stubPing('/manage-users-api', httpStatus)

export default {
  stubManageUser: stubUser,
  stubPing: ping,
  stubManageUsersPing: ping,
}
