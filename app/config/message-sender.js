const { MessageSender } = require('ffc-messaging')

const sender = new MessageSender({
  useCredentialChain: false,
  host: process.env.MESSAGE_HOST,
  username: process.env.MESSAGE_USER,
  password: process.env.MESSAGE_PASSWORD,
  address: process.env.MESSAGES_TOPIC_ADDRESS
})

module.exports = sender
