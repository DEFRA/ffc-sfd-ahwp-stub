const { uploadFile } = require('./file-upload')
const { handleUploadError } = require('./error-handler')
const { parseUploadResponse } = require('./response-parser')
const { deleteFile } = require('./file-deletion')

module.exports = {
  uploadFile,
  handleUploadError,
  parseUploadResponse,
  deleteFile
}
