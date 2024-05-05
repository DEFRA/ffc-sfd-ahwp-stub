const { getKeys, validateToken } = require('../auth')
const { RS256 } = require('../constants/algorithms')
const { AUTH_COOKIE_NAME } = require('../constants/cookies')

module.exports = {
  plugin: {
    name: 'auth',
    register: async (server, _options) => {
      server.auth.strategy('jwt', 'jwt', {
        key: async () => {
          const { publicKey } = await getKeys()
          return { key: publicKey }
        },
        cookieKey: AUTH_COOKIE_NAME,
        validate: validateToken,
        verifyOptions: { algorithms: [RS256] }
      })
      server.auth.default({ strategy: 'jwt', mode: 'required' })
    }
  }
}
