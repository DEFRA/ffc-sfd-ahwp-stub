const { MessageSender } = require('ffc-messaging')
const { GET, POST } = require('../constants/http-verbs')
const { USER } = require('ffc-auth/scopes')

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
      auth: false
    },
    handler: async (request, h) => {
      console.log('Payload:', request.payload)
      try {
        const sender = new MessageSender({
          useCredentialChain: false,
          host: process.env.MESSAGE_HOST,
          username: process.env.MESSAGE_USER,
          password: process.env.MESSAGE_PASSWORD,
          address: process.env.PROCESSOR_TOPIC_ADDRESS
        })
        await sender.sendMessage({
          body: {
            messageId: request.payload.messageId,
            scheme: request.payload.scheme,
            tags: [request.payload.tags],
            crn: request.payload.crn,
            content: {
              heading: request.payload.heading,
              body: request.payload.body
            },
            requestedDate: request.payload.requestedDate
          },
          type: 'submit',
          source: 'ffc-sfd-ahwp-stub'
        })
        const messageId = request.payload.messageId
        const scheme = request.payload.scheme
        const tags = request.payload.tags
        const crn = request.payload.crn
        const content = request.payload.content
        const requestedDate = request.payload.requestedDate
        console.log(`The following message was successfully submitted to Service Bus via AHWP stub: ${messageId}, ${scheme}, ${tags}, ${crn}, ${content}, ${requestedDate}`)
        return h.redirect('/home')
      } catch (error) {
        console.error(`Failed to submit CRN to Service Bus: ${error}`)
        return h.redirect('/submit')
      }
    }
  }
]
