const Wreck = require('@hapi/wreck')

module.exports = {
  method: 'GET',
  path: '/download/{blobReference}',
  handler: async (request, h) => {
    const { blobReference } = request.params
    const { filename } = request.query

    try {
      const { res, payload } = await Wreck.get(`http://ffc-sfd-file-processor:3019/download/${blobReference}`, {
        responseType: 'stream'
      })

      const contentType = res.headers['content-type'] || 'application/octet-stream'

      return h.response(payload)
        .header('Content-Disposition', `attachment; filename="${filename}"`)
        .header('Content-Type', contentType)
    } catch (error) {
      console.error('Error downloading file:', error.message)
      return h.response({ error: 'File download failed', details: error.message }).code(500)
    }
  }
}