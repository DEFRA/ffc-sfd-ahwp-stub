const { GET } = require('../constants/http-verbs')
const { SFD_VIEW } = require('ffc-auth/scopes')

module.exports = [
  {
    method: GET,
    path: '/home',
    options: { auth: { strategy: 'jwt', scope: SFD_VIEW } },
    handler: (_request, h) => {
      return h.view('home')
    }
  }
]
