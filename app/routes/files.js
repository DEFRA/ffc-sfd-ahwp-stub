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
      payload: {
        output: 'stream',
        parse: true,
        multipart: true,
        maxBytes: 20000000 * 1024
      }
    },
    handler: async (request, h) => {
      const { files } = request.payload
      files.forEach(file => {
        const fileBuffer = file._data
        // Process the file buffer as needed
        console.log(`Received file: ${file.filename}`)
        console.log(`File buffer length: ${fileBuffer.length}`)
      })
      return h.response({ message: 'Files received successfully' }).code(200)
    }
  }
]
