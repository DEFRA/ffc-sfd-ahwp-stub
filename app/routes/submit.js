const { POST } = require('../constants/http-verbs')
const { SFD_VIEW } = require('ffc-auth/scopes')

module.exports = [
  {
    method: POST,
    path: '/submit',
    options: { auth: { strategy: 'jwt', scope: SFD_VIEW } },
    handler: (_request, h) => {
      return h.view('submit')
    }
  }
]
