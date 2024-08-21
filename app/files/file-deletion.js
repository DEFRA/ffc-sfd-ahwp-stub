const Wreck = require('@hapi/wreck')
const { serverConfig } = require('../config')

const deleteFile = async (blobReference) => {
  try {
    await Wreck.delete(`${serverConfig.fileProcessorUrl}/delete/${blobReference}`)
  } catch (err) {
    console.error(`Failed to delete file: ${blobReference}`, err)
    throw err
  }
}

module.exports = { deleteFile }
