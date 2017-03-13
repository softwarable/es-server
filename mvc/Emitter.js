
/**
 * Emits response back to the browser
 * 
 */
class Emitter {
    /**
     * 
     * @param {*} response 
     * @param {*} renderer 
     */
    constructor(response)
    {
        this.response = response;
    }

    /**
     * 
     * @param {*} script 
     * @param {*} data 
     * @param {*} status 
     */
    view(script, data) {
        if(!response.renderer) {
            throw new Error("Renderer is not found in the response.");
        }

        response.renderer(script, data);
    }

        /**
     * 
     * @param {*} html 
     * @param {*} data 
     */
    html(html, status = null) {
        return this.emit(html, status, {
            'Content-Type' : 'text/html'
        });
    }

    /**
     * @param {*} text 
     */
    text(text, status = null) {
        return this.emit(text, status, {
            'Content-Type': 'text/plain'
        });
    }

    /**
     * 
     * @param {*} data 
     * @param {*} status 
     */
    json(data, status) {        
        return this.emit(JSON.stringify(data), status, {
            'Content-Type': 'application/json'
        });
    }


    /**
     * 
     * @param {any} data 
     * @param {int} status 
     * @param {Ojbect} headers 
     */
    emit(data = null, status = 200, headers = null) {
        let response = this.response;

        // response.writeHead(status, headers);

        if(response.send) { // express js? use that instead.
            return response.send(data);
        }

        console.log('Here with result', data, typeof data);
        switch(typeof data) {
            case 'object':
                response.writeHead(status, {'Content-Type' : 'application/json'});            
                response.write(JSON.stringify(data));
                break;
            
            default:
                response.writeHead(status, {'Content-Type' : 'text/html'});
                response.write(data);
        }

        response.end();
    }
}

module.exports = Emitter;