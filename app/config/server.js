const Joi = require('joi')
const { DEVELOPMENT, TEST, PRODUCTION } = require('../constants/environments')

const schema = Joi.object().keys({
  port: Joi.number().default(3010),
  env: Joi.string().valid(DEVELOPMENT, TEST, PRODUCTION).default(DEVELOPMENT),
  serviceName: Joi.string().default('Annual Health and Welfare Review'),
  cookiePassword: Joi.string().required(),
  dataHost: Joi.string().optional(),
  fileProcessorUrl: Joi.string().optional(),
  cookieOptions: Joi.object({
    ttl: Joi.number().default(1000 * 60 * 60 * 24), // 24 hours
    encoding: Joi.string().default('none'),
    isSameSite: Joi.string().valid('Lax').default('Lax'),
    isSecure: Joi.bool().default(true),
    isHttpOnly: Joi.bool().default(true),
    clearInvalid: Joi.bool().default(false),
    strictHeader: Joi.bool().default(true),
    path: Joi.string().default('/')
  }),
  singleFrontDoorUrl: Joi.string().uri().default('http://localhost:3000/landing-page/home')
})

const config = {
  port: process.env.PORT,
  env: process.env.NODE_ENV,
  serviceName: process.env.SERVICE_NAME,
  cookiePassword: process.env.COOKIE_PASSWORD,
  dataHost: process.env.DATA_HOST,
  fileProcessorUrl: process.env.FILE_PROCESSOR_URL,
  cookieOptions: {
    ttl: process.env.AUTH_COOKIE_TTL,
    encoding: process.env.AUTH_COOKIE_ENCODING,
    isSameSite: process.env.AUTH_COOKIE_SAME_SITE,
    isSecure: process.env.NODE_ENV === PRODUCTION,
    isHttpOnly: process.env.AUTH_COOKIE_HTTP_ONLY,
    clearInvalid: process.env.AUTH_COOKIE_CLEAR_INVALID,
    strictHeader: process.env.AUTH_COOKIE_STRICT_HEADER
  },
  singleFrontDoorUrl: process.env.SINGLE_FRONT_DOOR_URL
}

const { error, value } = schema.validate(config)

if (error) {
  throw new Error(`The server config is invalid. ${error.message}`)
}

value.isDev = value.env === DEVELOPMENT

module.exports = value
