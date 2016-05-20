/**
 * `Module` Dependencies
 */
var httpsync, __WINDOWS;
var parse_url = require('url').parse;

try {
    __WINDOWS = !!process.platform.match(/^win/);
    httpsync = require('http-sync');
} catch (e) {
    if ((e.code === 'MODULE_NOT_FOUND') && __WINDOWS) {
        httpsync = require('http-sync-win');
    } else {
        throw e;
    }
}


/**
 * `Request` Object, to help with
 * preparing Request options.
 */
exports.Request = function() {
    var args = Array.prototype.slice.call(arguments)
      , path = args.shift()
      , meth = args.shift() || 'GET'
      , hdrs = args.shift() || {}
      , data = args.shift() || {};

    return {
        url: path,
        method: meth,
        headers: hdrs,
        body: data
    };
};


/**
 * `Message` Object, to hold HttpClient
 * response Objects etc
 * 
 * @param opts [HttpClient Response Object]
 */
function Message(opts) {
    this.response = opts;
    
    if (this.response.statusCode.range(200, 399)) {
        this._isSuccess = true,
        this.status = 'OK';
    } else {
        this._isSuccess = false,
        this.status = 'NOT_OK'; // is this spec ?
    }
};

/**
 * nothing to do here, just a mock !!
 */
Message.prototype.waitForComplete = function() {
    return;
};


/**
 * to know, if the request succeeded,
 * based on HTTP Response Codes
 * 
 * @return {Boolean}
 */
Message.prototype.isSuccess = function() {
    return this._isSuccess;
};


/**
 * `getResponse` would return Response
 * Object, with all needed information
 * 
 * @return {Object}
 */
Message.prototype.getResponse = function() {
    return {
        status: this.status,
        success: this._isSuccess,
        headers: this.response.headers,
        statusCode: this.response.statusCode,
        content: this.response.data.toString()
    }
};


/**
 * `HttpClient`
 */
var Client = exports.Client = {};


/**
 * `send` instead of using get.
 * useful for methods other than get.
 * 
 * @return {Message Object}
 */
Client.send = function () {
    var args = Array.prototype.slice.call(arguments)
      , opts = args.shift();
    
    if (!(args.length == 1 && opts instanceof Object)) {
        throw new Error('Bad arguments to send function');
    };

    if (__WINDOWS) {
        var _uri = parse_url(opts.url);
        opts.host = _uri.hostname;
        opts.port = _uri.port;
        opts.path = _uri.pathname;
        opts.protocol = _uri.protocol.replace(':', '');
    }

    var request = httpsync.request(opts)
      , response = request.end();

    if (__WINDOWS) {
        response.data = response.body;
    }
    
    return new Message(response);
};


/**
 * useful for method: get.
 * 
 * @return {Message Object}
 */
Client.get = function () {
    var args = Array.prototype.slice.call(arguments)
      , opts = args.shift();
    
    if (typeof(opts) === 'string') {
        opts = {
            url: opts
        }
    } else if (typeof(opts) !== 'object') {
        throw new Error('Bad arguments to get function');
    };

    if (!opts.method) opts.method = 'GET';

    if (__WINDOWS) {
        var _uri = parse_url(opts.url);
        opts.host = _uri.hostname;
        opts.port = _uri.port;
        opts.path = _uri.path;
        opts.protocol = _uri.protocol.replace(':', '');
    }

    var request = httpsync.request(opts)
      , response = request.end();

    if (__WINDOWS) {
        response.data = response.body;
    }
    
    return new Message(response);
}