const Wreck = require('@hapi/wreck')
const FormData = require('form-data')
const Joi = require('joi')

module.exports = [
  {
    method: 'GET',
    path: '/files',
    options: { auth: { strategy: 'jwt', mode: 'required' } },
    handler: async (request, h) => {
      return h.view('files')
    }
  },
  {
    method: 'POST',
    path: '/files',
    options: {
      auth: { strategy: 'jwt', mode: 'required' },
      validate: {
        payload: {
          scheme: Joi.string().required(),
          collection: Joi.string().required(),
          files: Joi.string().required()
        }
      }
    },
    handler: async (request, h) => {
      const { payload } = request
      const { scheme, collection, files } = payload

      console.log('Headers:', request.headers)
      console.log('Payload:', payload)

      // Log the form data
      console.log('Scheme:', scheme)
      console.log('Collection:', collection)
      console.log('Files:', files)

      // Return a simple success message
      return h.response({ message: 'Form data logged successfully' }).code(200)
    }
  }
]
