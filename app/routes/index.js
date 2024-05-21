const { GET } = require('../constants/http-verbs')
const { authConfig } = require('../config')
const { getAuthorizationUrl } = require('../auth')

module.exports = {
  method: GET,
  path: '/',
  options: {
    auth: false
  },
  handler: async (request, h) => {
    const redirectUrl = authConfig.defraIdEnabled ? await getAuthorizationUrl({ organisationId: request.query.organisationId }) : '/sign-in'
    return h.view('index', { redirectUrl })
  }
}
