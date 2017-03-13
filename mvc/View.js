
/**
 * 
 */
class View {
    construct(script = null, data = {}) {
        this.script = script;
        this.layout = null;
        Object.assign(this, data);
    }
}

module.exports = View;