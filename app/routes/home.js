const { GET } = require('../constants/http-verbs')
const { serverConfig } = require('../config')
const { USER } = require('../auth/scopes')

module.exports = [
  {
    method: GET,
    path: '/home',
    options: { auth: { strategy: 'jwt', scope: [USER] } },
    handler: (request, h) => {
      const organisationId = request.auth.credentials.organisationId
      const singleFrontDoorUrl = organisationId ? `${serverConfig.singleFrontDoorUrl}?organisationId=${organisationId}` : serverConfig.singleFrontDoorUrl
      return h.view('home', { singleFrontDoorUrl })
    }
  }
]
