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
      console.log('Payload:', request.payload.crn)
      try {
        const sender = new MessageSender({
          useCredentialChain: false,
          host: process.env.MESSAGE_HOST,
          username: process.env.MESSAGE_USER,
          password: process.env.MESSAGE_PASSWORD,
          address: process.env.PROCESSOR_TOPIC_ADDRESS
        })
        await sender.sendMessage({
          body: { crn: request.payload.crn },
          type: 'submit',
          source: 'ffc-sfd-ahwp-stub'
        })
        const crn = request.payload.crn
        console.log(`CRN successfully submitted to Service Bus: ${crn}`)
        return h.redirect('/home')
      } catch (error) {
        console.error(`Failed to submit CRN to Service Bus: ${error}`)
        return h.redirect('/submit')
      }
    }
  }
]
