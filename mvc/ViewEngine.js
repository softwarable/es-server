
let ViewRenderer = require('./ViewRenderer');
let renderer = new ViewRenderer();

/**
 * Providing Express JS template engine with appropriate 'this' binding
 */
module.exports = function(script, data, callback) {
    renderer.render(script, data, callback);
}.bind(renderer);