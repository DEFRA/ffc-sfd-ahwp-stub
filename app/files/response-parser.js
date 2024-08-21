const parseUploadResponse = (responseData) => {
  const fileData = []
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
  return fileData
}

module.exports = { parseUploadResponse }
