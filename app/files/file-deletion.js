const Wreck = require('@hapi/wreck')

const deleteFile = async (blobReference) => {
  try {
    await Wreck.delete(`http://ffc-sfd-file-processor:3019/delete/${blobReference}`)
  } catch (err) {
    console.error(`Failed to delete file: ${blobReference}`, err)
    throw err
  }
}

module.exports = { deleteFile }
