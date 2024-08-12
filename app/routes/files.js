const Wreck = require('@hapi/wreck')
const FormData = require('form-data')
const Joi = require('joi')
const fs = require('fs')
const path = require('path')

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
          files: Joi.any().required()
        }
      }
    },
    handler: async (request, h) => {
      const { payload } = request
      const { scheme, collection, files } = payload
      console.log(files)

      if (!files) {
        return h.response({ error: 'No files uploaded' }).code(400)
      }
      
      const form = new FormData()
      form.append('scheme', scheme)
      form.append('collection', collection)

      
      try {
        const { res, payload: responsePayload } = await Wreck.post('http://ffc-sfd-file-processor:3019/upload', {
          payload: form,
          headers: form.getHeaders()
        })
      
        if (res.statusCode !== 200) {
          throw new Error(`Failed to upload files: ${res.statusCode}`)
        }
      
        return h.response({ message: 'Files uploaded successfully', data: JSON.parse(responsePayload) }).code(200)
      } catch (err) {
        console.error('Upload error:', err)
        return h.response({ error: 'File upload failed', details: err.message }).code(500)
      }
    }
  }
]
