const { GET, POST } = require('../constants/http-verbs')
const { USER } = require('ffc-auth/scopes')

module.exports = [
  {
    method: GET,
    path: '/submit',
    options: {
      auth: { strategy: 'jwt', scope: [USER] }
    },
    handler: async (_request, h) => {
      return h.view('submit')
    }
  },
  {
    method: POST,
    path: '/submit',
    options: {
      auth: false
    },
    handler: async (request, h) => {
      try {
        const crn = request.payload.crn
        console.log(`CRN (Customer Reference Number): ${crn}`)
        return h.redirect('/home')
      } catch (error) {
        console.error(`Failed to submit CRN: ${error}`)
      }
    }
  }
]
