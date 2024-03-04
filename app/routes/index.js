const { GET } = require('../constants/http-verbs')

module.exports = {
  method: GET,
  path: '/',
  options: {
    auth: false
  },
  handler: (request, h) => {
    return h.view('index')
  }
}
