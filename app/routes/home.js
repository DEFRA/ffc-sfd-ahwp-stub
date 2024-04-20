const { GET } = require('../constants/http-verbs')
const { USER } = require('ffc-auth/scopes')
const { serverConfig } = require('../config')

module.exports = [
  {
    method: GET,
    path: '/home',
    options: { auth: { strategy: 'jwt', scope: [USER] } },
    handler: (_request, h) => {
      return h.view('home', { singleFrontDoorUrl: serverConfig.singleFrontDoorUrl })
    }
  }
]
