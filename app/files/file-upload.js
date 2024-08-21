const Wreck = require('@hapi/wreck')
const FormData = require('form-data')
const { serverConfig } = require('../config')

const uploadFile = async (file, sanitizedFilename, scheme, collection, organisation, crn) => {
  const form = new FormData()
  form.append('scheme', scheme)
  form.append('collection', collection)
  form.append('files', file._data, sanitizedFilename)
  form.append('sbi', organisation.sbi)
  form.append('crn', crn)

  try {
    const { res, payload: responsePayload } = await Wreck.post(`${serverConfig.fileProcessorUploadUrl}`, {
      payload: form,
      headers: form.getHeaders()
    })

    return JSON.parse(responsePayload)
  } catch (err) {
    throw err
  }
}

module.exports = { uploadFile }
