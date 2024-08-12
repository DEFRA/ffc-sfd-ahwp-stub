const routes = [].concat(
  require('../routes/healthy'),
  require('../routes/healthz'),
  require('../routes/assets'),
  require('../routes/'),
  require('../routes/home'),
  require('../routes/tasks'),
  require('../routes/sign-in'),
  require('../routes/sign-out'),
  require('../routes/sign-in-oidc'),
  require('../routes/picker'),
  require('../routes/submit'),
  require('../routes/message-sender'),
  require('../routes/files'),
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server, options) => {
      server.route(routes)
    }
  }
}
