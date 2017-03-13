'use strict';

let http = require('http');
var debug = require('debug')('server:server');

/**
 * Wraps Node server functionalities 
 */
class Server extends http.Server
{
    constructor(handler) 
    {
        super(handler);
        // this.on('error', this.onError);
        // this.on('listening', this.onListening.bind(this));

    }

    /**
     * Factory method for creating http server using provided handler
     * 
     * It also provides
     * @param {int} port 
     * @param {*} handler 
     * @param {*} ready 
     * @param {*} started 
     */
    static start(port, handler, ready, final )
    {
        let server = new Server(handler);
        if(handler) {
            ready(server);
        }

        server.listen(port, final);
        return server;
    }


    // constructor(handler) {
    //     this.handler = handler;

    //     // create and store the server
    //     let httpServer = new http.Server();
    //     this.httpServer = httpServer;
    // }



    onError(error) {
        if (error.syscall !== 'listen') {
            throw error;
        }

        var bind = typeof port === 'string'
            ? 'Pipe ' + port
            : 'Port ' + port;

        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
            case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
            default:
            throw error;
        }
    }

    onListening() {
        var addr = this.httpServer.address();
        var bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + addr.port;
        debug('Listening on ' + bind);
    }
}

module.exports = Server;
