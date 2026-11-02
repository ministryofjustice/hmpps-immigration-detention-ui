import nock from 'nock'

// Nock 15 activates its HTTP interceptor on import. Jest gives each test file a
// fresh copy of that module, but the interceptor stays attached to Node's http
// module, so later files register mocks that never see the request.
afterAll(() => {
  nock.cleanAll()
  nock.restore()
  nock.enableNetConnect()
})
