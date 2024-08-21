const { getOrganisation } = require('../data')
const { uploadFile } = require('../files')
const { handleUploadError } = require('../files')
const { parseUploadResponse } = require('../files')
const { deleteFile } = require('../files')

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
        try {
          const responseData = await uploadFile(file, sanitizedFilename, scheme, collection, organisation, crn)
          fileData.push(...parseUploadResponse(responseData))
        } catch (err) {
          fileData.push(handleUploadError(err, sanitizedFilename))
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
        if (!blobReference) {
          sessionMetadata = sessionMetadata.filter(file => file.status !== 'Error')
      
          return h.view('files', {
            message: 'File with error deleted successfully',
            files: sessionMetadata
          })
        } else {
          sessionMetadata = sessionMetadata.filter(file => file.blobReference !== blobReference)
      
          try {
            await deleteFile(blobReference)
          } catch (err) {
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
    }
  }
]