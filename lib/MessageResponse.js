
/**
 * `exports` definition for browser
 * @type {CommonJs}
 */
if(typeof exports === 'undefined') {
    var module = {};
    module.exports = this;
}

/**
 * Expose `Response`
 * @type {CommonJs}
 */
exports = module.exports = Response;


/**
 * `Response` prototype
 */
function Response() {
    this._queryParams = {};
    this._headers = {};
    this._content = '';
};


/**
 * extend with getters, setters
 * for queryParams & headers
 */
['queryParams', 'headers'].forEach(function (p) {
    Object.defineProperty(Response.prototype, p, {
        get: function() {
            return this['_' + p];
        }, set: function(k, v) {
            return this['_' + p][k] = v;
        } // no support: case insensitive
    });
});


/**
 * `getter` & `setter` for response.content
 */
Object.defineProperty(Response.prototype, 'content', {
    get: function() {
        return this._content;
    }, set: function(v) {
        return this._content = v;
    }
});