const { authConfig } = require('../../config')
const { getWellKnown } = require('./get-well-known')

const getAuthorizationUrl = async (options) => {
  const { authorization_endpoint: url } = await getWellKnown()

  const query = [
    `p=${authConfig.policy}`,
    `client_id=${authConfig.clientId}`,
    `serviceId=${authConfig.serviceId}`,
    'nonce=defaultNonce',
    `redirect_uri=${authConfig.redirectUrl}`,
    `scope=openid offline_access ${authConfig.clientId}`,
    'response_type=code',
    'response_mode=query'
  ]

  if (options.forceReselection) {
    query.push('forceReselection=true')
  }

  if (options.organisationId) {
    query.push(`relationshipId=${options.organisationId}`)
  }

  return encodeURI(`${url}?${query.join('&')}`)
}

module.exports = {
  getAuthorizationUrl
}
