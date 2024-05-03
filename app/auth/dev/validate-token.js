const validateToken = async (decoded, request, _h) => {
  return { isValid: true, credentials: { scope: decoded.roles, name: 'A Farmer', sessionId: decoded.sessionId, crn: decoded.contactId, organisationId: decoded.currentRelationshipId } }
}

module.exports = {
  validateToken
}
