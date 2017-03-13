let ResolverError = require("./ResolverError");
const _ = require('lodash');

/**
 * ActionResolver
 * 
 * Resolve an action handler method/function name.
 * Provides configuraiton for customizing action name
 */
class ActionResolver
{
    constructor(target = null) {
        this.target = target;
        this.defaultAction = 'index';
        this.actionPrefix = 'do';
        this.actionSuffix = '';
        this.verbs = {
            get: 'get',
            post: 'post',
            put: 'put',
            delete: 'delete'
        }
    }
    
    /**
     * Overriding the resolveHandler for routing restful actions
     * @param {*} method 
     * @param {*} params 
     */
    resolve(request) {
        let target = this.target;
        let params = this.parseParams(request);
        let method = request.method.toLowerCase();
        let verb = params.length == 0 && method == 'get' ? this.defaultAction : method;

        // first attempt, check if generic restful methods are available
        // ie, doGet, doPost, etc.
        let handler = this.generateHandlerName(verb);
        console.log(`Generated action name: ${handler}`, verb, params);

        if(target[handler]) {  
            return target[handler];
        }

        // now attempt to do action based restful methods
        // ie, doGetUsers, doPostUsers
        let action = params.shift();
        handler = this.generateHandlerName(method, action); // note, NOT using verb, but method. (no default action)
        console.log(`Generated action name: ${handler}`, verb, params);

        if(target[handler]) {
             // eat up the first param, which is being used for resolving action
             delete request.params[0]; // delete the param which used for routing
            return target[handler];
        }

        return null;
    }

    /**
     * Generate action handler method name from given action + verb
     * @param {String} action 
     * @param {String} method 
     * @returns String
     */
    generateHandlerName(method = null, action = null) {
        let parts = [];
        if(method) {
            method = method.toLowerCase();
            method = this.verbs[method] || method;
            parts.push(method)
        }
        if(action) parts.push(action);

        if(this.actionPrefix) parts.unshift(this.actionPrefix);
        if(this.actionSuffix) parts.push(this.actionSuffix);

        return _.camelCase(parts.join('-'));
    }

    /**
     * Parses the params from the URL path.
     * 
     * This method will also update the request.params if available
     * @param {*} request 
     */
    parseParams(request) {
        
        // parse the paths, action and params
        const path = request.path || request.url;
        let paths = path.split('/').filter( i => i.trim() != '');

        // add params to the request
        if(!request.params) request.params = {};
        if(paths.length) {
            paths.forEach( (value, index) => {
                request.params[index] = value;
            })
        }

        return Object.values(request.params);
    }

    /**
     * Verfiy handler params with request params
     * 
     * @todo support check for passing more then requested.
     * @param {*} handler 
     * @param {*} params 
     */
    validate(handler, params) {
        if(handler.length > params.length) {
            throw new ResolverError(`Action handler needs ${handler.length} params, got ${params.length}`);
        }
        // test.toString().match(/(function.+\()(.+(?=\)))(.+$)/)[2];
    }
}

module.exports = ActionResolver;