const { POST } = require('../constants/http-verbs')

module.exports = [
  {
    method: POST,
    path: '/submit',
    options: {
      auth: false
    },
    handler: (request, h) => {
      return h.view('submit')
    }
  }
]
