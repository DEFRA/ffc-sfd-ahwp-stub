const Wreck = require('@hapi/wreck')
const { serverConfig } = require('../config')
const { AUTH_COOKIE_NAME } = require('../constants/cookies')
const getOrganisation = require('../data/get-organisation')

const getFilesMetadataBySbi = async (request) => {
  const organisation = await getOrganisation(request)
  const sbi = organisation.sbi
  try {
    console.log('sbi:', organisation)
    const query = `query FilesMetadataBySbi {
      filesMetadataBySbi(sbi: "${sbi}") {
        metadata {
          filename
          scheme
          blobReference
          collection
          crn
          sbi
        }
      }
    }`

    const { payload } = await Wreck.post(serverConfig.dataHost, {
      headers: {
        crn: request.auth.credentials.crn,
        Authorization: request.state[AUTH_COOKIE_NAME],
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({ query }),
      json: true
    })

    return payload.data.filesMetadataBySbi.metadata
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = getFilesMetadataBySbi
