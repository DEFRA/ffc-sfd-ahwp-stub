const Wreck = require('@hapi/wreck')
const FormData = require('form-data')

let sessionMetadata = []

module.exports = [
  {
    method: 'GET',
    path: '/files',
    options: { auth: { strategy: 'jwt', mode: 'required' } },
    handler: async (request, h) => {
      return h.view('files', { files: sessionMetadata })
    }
  },
  {
    method: 'POST',
    path: '/files',
    options: {
      auth: { strategy: 'jwt', mode: 'required' },
      payload: {
        parse: true,
        allow: 'multipart/form-data',
        multipart: { output: 'stream' }
      }
    },
    handler: async (request, h) => {
      const { payload } = request
      const { scheme, collection, files } = payload

      if (!files) {
        return h.response({ error: 'No files uploaded' }).code(400)
      }

      const form = new FormData()
      form.append('scheme', scheme)
      form.append('collection', collection)

      let uploadedFiles = []

      if (Array.isArray(files)) {
        files.forEach(file => {
          const sanitizedFilename = file.hapi.filename.split('-').pop()
          form.append('files', file._data, sanitizedFilename)
          uploadedFiles.push({ filename: sanitizedFilename, blobReference: file.hapi.filename })
        })
      } else {
        const sanitizedFilename = files.hapi.filename.split('-').pop()
        form.append('files', files._data, sanitizedFilename)
        uploadedFiles.push({ filename: sanitizedFilename, blobReference: files.hapi.filename })
      }

      try {
        const { res, payload: responsePayload } = await Wreck.post('http://ffc-sfd-file-processor:3019/upload', {
          payload: form,
          headers: form.getHeaders()
        })

        const responseData = JSON.parse(responsePayload)
        const fileData = responseData.map(file => ({
          filename: file.metadata.filename,
          blobReference: file.metadata.blobReference
        }))
        sessionMetadata.push(...fileData)

        return h.view('files', {
          message: 'Files uploaded successfully',
          files: sessionMetadata
        })
      } catch (err) {
        console.error('Upload error:', err)
        return h.response({ error: 'File upload failed', details: err.message }).code(500)
      }
    }
  }
]
