let server = {
    mvc: require('./mvc'),
}

// addiion short access
server.Controller = server.mvc.Controller,
server.ViewEngine = server.mvc.ViewEngine,
server.View = server.mvc.View

module.exports = server;