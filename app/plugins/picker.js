module.exports = {
  plugin: {
    name: 'picker',
    register: (server, options) => {
      server.ext('onRequest', (request, h) => {
        if (!request.query.organisationId) {
          return h.continue
        }

        if (request.path.includes('/picker/') || request.path.includes('/sign-in')) {
          return h.continue
        }

        return h.redirect(`/picker/external?redirect=${request.url.pathname}&organisationId=${request.query.organisationId}`).takeover()
      })
    }
  }
}
