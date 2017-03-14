let ActionResolver = require('./ActionResolver');
let Emitter = require('./Emitter');
let View = require('./View');

/**
 * Restful Action Controller for Node +/ Express applications
 * 
 * Encapsulates all related restful actions in one single class
 * Also provides controller lifecycle for breaking codes into logical units
 */
class Controller
{
    /**
     * 
     * @param {*} context 
     */
    constructor(context = null) {
        this.request = null;
        this.response = null;
        this.resolver = new ActionResolver(this);
        this.context = context || {};
    }

    /**
     * Dispatcher listener (nodejs) / Middleware (expressjs)
     * Convinient factory method for returning dispatcher
     */
    static handler(context = null) {
        let instance = new this(context);
        
        // return the callable wrapper to dispatch method
        return function(request, response, next = null) {
            this.dispatch(request, response, next);
        }.bind(instance);
    }

    /**
     * @param {*} request 
     * @param {*} response 
     * @param {*} next 
     */
    dispatch(request, response, next = null) {
        this.request = request;
        this.response = response;
        this.emitter = new Emitter(response);

        try {
            // call initialize event method
            this.onInit();

            if(!this.resolver) {
               throw new ResolverError("Action resolver is not found.");
            }

            let handler = this.resolver.resolve(request);
            if(!handler) {
                throw new Error('Unable to resolve handler for the request.');
            }

            if(typeof handler !== 'function') {
                throw new Error(`Action handler ${handler} is not a function`);
            }

            // setup and validate params
            let params = Object.values(request.params);
            params.unshift(request, response); // add the request and response object
            this.resolver.validate(handler, params);

            // invoke the action handler
            let result = Reflect.apply(handler, this, [...params]);
            if(result) {
                if(result instanceof View) { // if view object is returned,
                    this.emitter.view(result.script, result);
                } else {
                    this.emitter.emit(result);
                }
            } else {
                // if result isn't passed,
                // assumption is that action handler has responded
            }
        }
        
        catch(e) {
            this.onError(e);
        }

        // finally call the exit method
        this.onExit();
    }

    /**
     * Controller initialization method
     * This event is called before dispatching action to handler
     */
    onInit() {}

    /**
     * Controller level error/exception handler
     * @param {*} error 
     */
    onError(error) {
        let next = this.next || null;
        if(next) {
            next(e, request, response);
        } else {
            throw e;
        }
    }

    /**
     * Controller exit method
     * 
     * This method is called after action handler has been executed
     */
    onExit() {}
}

module.exports = Controller;