const { POST } = require('../constants/http-verbs')
const { USER } = require('ffc-auth/scopes')

module.exports = [
  {
    method: POST,
    path: '/submit',
    options: { auth: { strategy: 'jwt', scope: [USER] } },
    handler: (_request, h) => {
      return h.view('submit')
    }
  }
]
