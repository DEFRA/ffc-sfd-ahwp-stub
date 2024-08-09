const { sender } = require('../config')
const { GET, POST } = require('../constants/http-verbs')

module.exports = [
  {
    method: GET,
    path: '/message-sender',
    options: {
    },
    handler: async (_request, h) => {
      return h.view('message-sender')
    }
  },
  {
    method: POST,
    path: '/message-sender',
    options: {
    },
    handler: async (request, h) => {
      try {
        await sender.sendMessage({
          body: JSON.parse(request.payload.messageBody),
          type: request.payload.messageAction,
          source: 'ffc-sfd-ahwp-stub'
        })

        console.log('Topic Address is:', sender)
        console.log('MessageAction:', request.payload.messageAction)
        console.log('Message successfully submitted')

        return h.redirect('/message-sender')
      } catch (error) {
        console.error(`Failed to Message to Service Bus: ${error}`)
        return h.redirect('/message-sender')
      }
    }
  }
]
