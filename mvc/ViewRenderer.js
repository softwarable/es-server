
let fs = require('fs');
let path = require('path');

/**
 * Very basic view renderer
 */
class ViewRenderer
{
    /**
     * @param {Object} options 
     */
    constructor(options = {}) {
        this.defaultExt = 'html';
        this.options = options;
    }

    /**
     * @todo sort out locals, view options, merging, etc
     * @param {*} script 
     * @param {*} data 
     * @param {*} callback 
     */
    render(script, options, callback = null) {
        // data = Object.assign({}, this.options, data); // merge
        let dir = options.settings.views;
        let ext = path.extname(script) || this.options['ext'] || this.defaultExt;
        let data = options;
        console.log('options', script,  options);

        let filename;
        if(path.isAbsolute(script)) {
            filename = script;
        } else {
            filename = this.filenameForScript(script, dir, ext);
        }

        this.renderScript(filename, data, (err, content) => {
            console.log('rendering: ', filename);
            if(err) return callback(err);

            // now check if layout exists
            let layout = data['layout'] || this.options['layout'] || null;
            if(!layout) return callback(null, content);

            data['body'] = content;
            layout = this.filenameForScript(layout, dir, ext);
            console.log('Will render layout', layout);
            this.renderScript(layout, data, callback);
        });
    }

    /**
     * 
     * @param {*} filename 
     * @param {*} data 
     * @param {*} callback 
     */
    renderScript(filename, data, callback) {
        fs.readFile(filename, (err, content) => {
            if(err) return callback(err);

            let rendered = this.parse(content.toString(), data);

            callback(null, rendered);
        });
    }

    /**
     * @param {*} script 
     */
    filenameForScript(script, dir, ext = null) {
        let obj = {
            dir: dir
        };
        
        if(path.extname(script)) {
            obj.base = script;
        } else {
            obj.name = script;
            obj.ext = ext;
        }

        return path.format(obj);
    }

    /**
     * Simple parser
     * 
     * Parses @{key} with value. ie, <p>Hello @{name}</p>
     * given, data = {name: 'John'} will parse into <p>Hello John</p>
     * 
     * It also supports setting value to view data
     * @{key = value} will replace/assign value to the view data
     * @param {*} content 
     * @param {*} data 
     */
    parse(content, data) {
        const regex = /@{([^}]+)}/g;
        var result = content.replace(regex, function(match, group) {
            let parts = group.trim().split('=').filter( i => i.trim() != '');
            parts = parts.map(e => e.trim());
            if(parts.length > 2) { // this is an error (for now)
                throw new Error("Invalid expression.  Cannot contain more then one = sign");
            }

            let key = parts[0];
            if(parts.length == 2) { // this is considered set operation
                let val = parts[1];
                data[key] = val; // update the local data
                return '';
            } else { // considered get operation
                if(key == 'this') {
                    return JSON.stringify(data);
                }

                if(!data[key]) {
                    return '';
                }

                return data[key];
            }
        });

        return result;
    }
}

module.exports = ViewRenderer;