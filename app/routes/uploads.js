const getFilesMetadataBySbi = require('../data/get-files-metadata-by-sbi')

module.exports = {
  method: 'GET',
  path: '/uploads',
  handler: async (request, h) => {
    try {
      const metadata = await getFilesMetadataBySbi(request)
      return h.view('uploads', { files: metadata })
    } catch (error) {
      console.error('Error fetching file metadata:', error.message)
      return h.response({ error: 'Failed to fetch file metadata', details: error.message }).code(500)
    }
  }
}
