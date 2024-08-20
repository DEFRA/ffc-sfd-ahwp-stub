const Wreck = require('@hapi/wreck')
const FormData = require('form-data')
const { getOrganisation } = require('../data')

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
        multipart: { output: 'stream' },
        maxBytes: 150 * 1024 * 1024,
        timeout: false
      }
    },
    handler: async (request, h) => {
      const { payload } = request
      const { scheme, collection, files } = payload
      const organisation = await getOrganisation(request)
      const crn = request.auth.credentials.crn

      if (!files) {
        return h.response({ error: 'No files uploaded' }).code(400)
      }

      let uploadedFiles = []

      if (Array.isArray(files)) {
        files.forEach(file => {
          const sanitizedFilename = file.hapi.filename.split('-').pop()
          uploadedFiles.push({ file, sanitizedFilename })
        })
      } else {
        const sanitizedFilename = files.hapi.filename.split('-').pop()
        uploadedFiles.push({ file: files, sanitizedFilename })
      }

      let fileData = []

      for (const { file, sanitizedFilename } of uploadedFiles) {
        const form = new FormData()
        form.append('scheme', scheme)
        form.append('collection', collection)
        form.append('files', file._data, sanitizedFilename)
        form.append('sbi', organisation.sbi)
        form.append('crn', crn)

        try {
          console.log(form)
          const { res, payload: responsePayload } = await Wreck.post('http://ffc-sfd-file-processor:3019/upload', {
            payload: form,
            headers: form.getHeaders()
          })

          const responseData = JSON.parse(responsePayload)
          responseData.forEach(file => {
            if (file.error) {
              console.error(`Error: ${file.error}, Filename: ${file.fileName}`)
              fileData.push({
                filename: file.fileName,
                status: 'Error',
                error: file.error
              })
            } else {
              fileData.push({
                filename: file.metadata.filename,
                blobReference: file.metadata.blobReference,
                scheme: file.metadata.scheme,
                collection: file.metadata.collection,
                status: 'Success'
              })
            }
          })
        } catch (err) {
          let simplifiedError = ''
          if (err.message === 'Response Error: 413 Payload Too Large') {
            simplifiedError = 'Cannot exceed 10 MB'
          }
          fileData.push({
            filename: sanitizedFilename,
            status: 'Error',
            error: simplifiedError
          })
        }
      }

      sessionMetadata.push(...fileData)

      const allSuccess = fileData.every(file => file.status === 'Success')
      const allFailed = fileData.every(file => file.status === 'Error')
      let message = 'Files uploaded successfully'
      if (allFailed) {
        message = 'All uploads failed'
      } else if (!allSuccess) {
        message = 'Partial upload successful'
      }

      return h.view('files', {
        message,
        files: sessionMetadata
      })
    }
  },
  {
    method: 'POST',
    path: '/files/delete',
    options: {
      auth: { strategy: 'jwt', mode: 'required' }
    },
    handler: async (request, h) => {
      const { blobReference, _method } = request.payload

      if (_method === 'DELETE') {
        // Check if blobReference is empty
        if (!blobReference) {
          // Remove the file from sessionMetadata
          sessionMetadata = sessionMetadata.filter(file => file.status !== 'Error')
      
          return h.view('files', {
            message: 'File with error deleted successfully',
            files: sessionMetadata
          })
        } else {
          // Remove the file from sessionMetadata
          sessionMetadata = sessionMetadata.filter(file => file.blobReference !== blobReference)
      
          try {
            await Wreck.delete(`http://ffc-sfd-file-processor:3019/delete/${blobReference}`)
          } catch (err) {
            console.error(`Failed to delete file: ${blobReference}`, err)
            return h.view('files', {
              message: 'Failed to delete file',
              files: sessionMetadata
            })
          }
      
          return h.view('files', {
            message: 'File deleted successfully',
            files: sessionMetadata
          })
        }
      }
  }}
]