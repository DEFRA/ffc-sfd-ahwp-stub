const Wreck = require('@hapi/wreck')
const { serverConfig } = require('../config')
const { AUTH_COOKIE_NAME } = require('../constants/cookies')

const getOrganisation = async (request) => {
  try {
    const query = `query {
            organisation(organisationId: ${request.auth.credentials.organisationId}) {
              name
              sbi
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

    return payload.data.organisation
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = getOrganisation