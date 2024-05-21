const { authConfig } = require('../config')
const auth = authConfig.defraIdEnabled ? require('./defra-id') : require('./dev')
const { mapAuth } = require('./map-auth')
const { parseJwt } = require('./parse-jwt')

module.exports = {
  ...auth,
  mapAuth,
  parseJwt
}
