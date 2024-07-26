const { sender } = require('../config')
const { GET, POST } = require('../constants/http-verbs')
const { USER } = require('../auth/scopes')

module.exports = [
  {
    method: GET,
    path: '/submit',
    options: {
      auth: { strategy: 'jwt', scope: [USER] }
    },
    handler: async (_request, h) => {
      return h.view('submit')
    }
  },
  {
    method: POST,
    path: '/submit',
    options: {
      auth: { strategy: 'jwt', scope: [USER] }
    },
    handler: async (request, h) => {
      try {
        await sender.sendMessage({
          body: {
            scheme: request.payload.scheme,
            tags: [request.payload.tags],
            crn: request.payload.crn,
            sbi: request.payload.sbi,
            organisationId: request.payload.organisationId,
            heading: request.payload.heading,
            body: request.payload.body,
            requestedDate: request.payload.requestedDate
          },
          type: 'submit',
          source: 'ffc-sfd-ahwp-stub'
        })

        console.log('Message successfully submitted')

        return h.redirect('/home')
      } catch (error) {
        console.error(`Failed to submit CRN to Service Bus: ${error}`)
        return h.redirect('/submit')
      }
    }
  }
]
