const { serverConfig } = require('../config')

module.exports = {
  plugin: require('@hapi/yar'),
  options: {
    storeBlank: true,
    maxCookieSize: 0,
    cookieOptions: {
      password: serverConfig.cookiePassword,
      isSecure: !serverConfig.isDev
    }
  }
}
