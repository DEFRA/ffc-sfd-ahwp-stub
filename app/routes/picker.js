const Joi = require('joi')
const { Boom } = require('@hapi/boom')
const { GET } = require('../constants/http-verbs')
const { getAuthorizationUrl } = require('../auth')

module.exports = [{
  method: GET,
  path: '/picker/external',
  options: {
    validate: {
      query: Joi.object({
        organisationId: Joi.number().integer().required(),
        redirect: Joi.string().optional().allow('')
      }),
      failAction: async (request, h, _error) => {
        return Boom.badRequest('Organisation must be selected')
      }
    }
  },
  handler: async (request, h) => {
    const redirect = request.query.redirect ?? '/home'
    request.yar.set('redirect', redirect)

    if (!request.auth.isAuthenticated) {
      return h.redirect(`/sign-in?redirect=${redirect}&organisationId=${request.query.organisationId}`)
    }

    const currentOrganisationId = request.yar.get('organisationId')

    if (request.query.organisationId !== currentOrganisationId) {
      return h.redirect(await getAuthorizationUrl({ organisationId: request.query.organisationId }))
    }

    return h.redirect(redirect)
  }
}]
