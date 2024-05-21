const Joi = require('joi')
const { authConfig } = require('../config')
const { AUTH_COOKIE_NAME, AUTH_REFRESH_COOKIE_NAME } = require('../constants/cookies')
const { GET } = require('../constants/http-verbs')
const { getAccessToken } = require('../auth')
const { parseJwt } = require('../auth')

module.exports = {
  method: GET,
  path: '/sign-in-oidc',
  options: {
    auth: false,
    plugins: {
      crumb: false
    },
    validate: {
      query: Joi.object({
        code: Joi.string().required()
      }).options({ stripUnknown: true }),
      failAction (request, h, err) {
        console.log(`Defra ID login failed: ${err}`)
        return h.view('/').code(401).takeover()
      }
    }
  },
  handler: async (request, h) => {
    const redirect = request.yar.get('redirect') ?? '/home'
    const response = await getAccessToken(request.query.code)
    const token = parseJwt(response.access_token)
    request.yar.set('organisationId', token.currentRelationshipId)
    return h.redirect(redirect)
      .state(AUTH_COOKIE_NAME, response.access_token, authConfig.cookieOptions)
      .state(AUTH_REFRESH_COOKIE_NAME, response.refresh_token, authConfig.cookieOptions)
  }
}
