const { USER } = require('../auth/scopes')
const { GET } = require('../constants/http-verbs')

module.exports = [
  {
    method: GET,
    path: '/tasks',
    options: { auth: { strategy: 'jwt', scope: [USER] } },
    handler: (_request, h) => {
      return h.view('tasks')
    }
  }
]
