const { getScopes } = require('./get-scopes')

const validateToken = async (decoded, request, _h) => {
  return { isValid: true, credentials: { scope: getScopes(decoded.roles), name: `${decoded.firstName} ${decoded.lastName}`, sessionId: decoded.sessionId, crn: decoded.contactId } }
}

module.exports = {
  validateToken
}
