const handleUploadError = (err, sanitizedFilename) => {
  let simplifiedError = ''
  if (err.message === 'Response Error: 413 Payload Too Large') {
    simplifiedError = 'Cannot exceed 10 MB'
  }
  return {
    filename: sanitizedFilename,
    status: 'Error',
    error: simplifiedError ? simplifiedError : err.message
  }
}

module.exports = { handleUploadError }
