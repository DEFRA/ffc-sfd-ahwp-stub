const Hapi = require('@hapi/hapi')
const Joi = require('joi')
const { serverConfig } = require('./config')

const createServer = async () => {
  const server = Hapi.server({
    port: serverConfig.port,
    routes: {
      validate: {
        options: {
          abortEarly: false
        }
      }
    },
    router: {
      stripTrailingSlash: true
    },
    cache: [{
      name: 'session',
      provider: {
        constructor: require('@hapi/catbox-memory'),
        options: {
          partition: 'session-cache'
        }
      }
    }]
  })

  server.validator(Joi)
  await server.register(require('@hapi/inert'))
  await server.register(require('./plugins/views'))
  await server.register(require('./plugins/view-context'))
  await server.register(require('hapi-auth-jwt2'))
  await server.register(require('./plugins/auth'))
  await server.register(require('./plugins/router'))
  await server.register(require('./plugins/errors'))
  await server.register(require('./plugins/crumb'))
  await server.register(require('./plugins/logging'))
  await server.register(require('./plugins/session'))
  await server.register(require('./plugins/picker'))
  if (serverConfig.isDev) {
    await server.register(require('blipp'))
  }

  return server
}

module.exports = { createServer }
