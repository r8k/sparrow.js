
/**
 * `exports` definition for browser
 * @type {CommonJs}
 */
if(typeof exports === 'undefined') {
    var module = {};
    module.exports = this;
}


/**
 * Expose `Context`
 * @type {CommonJs}
 */
exports = module.exports = Context;

/**
 * Context Interface
 * Collection of Get, Set etc
 */
function Context() {
      this.__w__ = {}
    , this.__session__ = {};
};


/**
 * Getter & Setter for `context.session`
 * @return {[Object]} [this.__session__]
 */
Object.defineProperty(Context.prototype, 'session', {
    get: function() {
        return this.__session__;
    }, set: function(k, v) {
        return this.__session__[k] = v;
    }
});


/**
 * Getter & Setter for `context.flow`
 * @return {[Object]} [this.__flow__]
 */
Object.defineProperty(Context.prototype, 'flow', {
    get: function() {
        return this.__w__['__flow__'];
    }, set: function(v) {
        return this.__w__['__flow__'] = v;
    }
});


/**
 * `context.getVariable` Interface
 * @param  k [key to return]
 * @return [this.__w__[k]]
 */
Context.prototype.getVariable = function(k) {
    return this.__w__[k] || '';
};


/**
 * `context.setVariable` Interface
 * @param k [key to set]
 * @param v [value of key]
 */
Context.prototype.setVariable = function(k, v) {
    if (v instanceof Array) {
        v = v.toString();
    } else if (v instanceof Object) {
        v = JSON.stringify(v);
    } else if (typeof v === 'number') {
        v = v.toString();
    } return this.__w__[k] = v;
};


/**
 * `context.removeVariable` Interface
 * @param  k [key to remove]
 * @return [this.__w__]
 */
Context.prototype.removeVariable = function(k) {
    return delete this.__w__[k];
};


/**
 * `setUp` method, to alias setters
 */
Context.prototype.setUp = function(k, v) {
    return this.setVariable(k, v);
};


/**
 * `tearDown` method
 * although frameworks like `Mocha` would
 * take care of this, it is provided for a
 * stand alone usage.
 */
Context.prototype.tearDown = function() {
      this.__w__ = {}
    , this.__session__ = {};
    return;
};