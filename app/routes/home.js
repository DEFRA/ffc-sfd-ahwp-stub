const { GET } = require('../constants/http-verbs')
const { USER } = require('ffc-auth/scopes')
const { serverConfig } = require('../config')

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
