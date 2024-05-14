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
      auth: { strategy: 'jwt', scope: [USER] }
    },
    handler: async (request, h) => {
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
            scheme: request.payload.scheme,
            tags: [request.payload.tags],
            crn: request.payload.crn,
            sbi: request.payload.sbi,
            heading: request.payload.heading,
            body: request.payload.body,
            requestedDate: request.payload.requestedDate
          },
          type: 'submit',
          source: 'ffc-sfd-ahwp-stub'
        })
        const scheme = request.payload.scheme
        const tags = request.payload.tags
        const crn = request.payload.crn
        const sbi = request.payload.sbi
        const heading = request.payload.heading
        const body = request.payload.body
        const requestedDate = request.payload.requestedDate
        console.log(
          `MESSAGE SUBMITTED: [\nScheme: ${scheme},\nTags: ${tags},\nCRN: ${crn},\nSBI: ${sbi},\nHeading: ${heading},\nBody: ${body},\nRequested Date: ${requestedDate}\n`
        )
        return h.redirect('/home')
      } catch (error) {
        console.error(`Failed to submit CRN to Service Bus: ${error}`)
        return h.redirect('/submit')
      }
    }
  }
]
