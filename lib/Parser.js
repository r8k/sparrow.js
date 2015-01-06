
/**
 * `Module` Dependencies
 */
var fs = require('fs')
  , path = require('path');


const fix_ext = '-fixture.js';

/**
 * `readFileSync` reads file synchronously
 * @return {String} [file contents]
 */
String.prototype.__defineGetter__('content', function() {
    return fs.readFileSync(this.toString()).toString();
});


/**
 * `DependencyInjectionError` prototype
 * @param {path}  fp
 * @param {Error} e
 */
function DependencyInjectionError(msg) {
    var err = Error.call(this, msg);

    err.name = "DependencyInjectionError";
    return err;
};


/**
 * `TestSetupError` prototype
 * @param {path}  fp
 * @param {Error} e
 */
function TestSetupError(msg) {
    var err = Error.call(this, msg);

    err.name = "TestSetupError";
    return err;
};


/**
 * `ExecutionError` prototype
 * @param {path}  fp
 * @param {Error} e
 */
function ExecutionError(msg) {
    var err = Error.call(this, msg);

    err.name = "JsExecutionError";
    return err;
};


/**
 * get stack trace
 */
var get_stack = function () {
    var orig = Error.prepareStackTrace;
    Error.prepareStackTrace = function (_, stack) {
        return stack;
    }; var err = new Error();

    var stack = err.stack;
    Error.prepareStackTrace = orig;
    stack.shift(); return stack;
};


/**
 * used for finding absolute path
 * of a given file, based on it's path
 *
 * @param  p  [path of the file]
 * @return fp [absolute path of the file]
 */
var get_path = function (p) {
    var stack = get_stack();
    stack.shift(); stack.shift();
    var fp = path.dirname(stack[0]
        .getFileName()) + path.sep + p;
    try {
        fp.content;
    } catch (e) {
        fp += '.js';
    }; return fp;
};


/**
 * returns usage, whether fp uses httpClient
 *
 * @param  {path}  fp
 * @return {Object}
 */
var isHttp = function(fp) {
    var hregx = /(.*)httpClient(.*)/
      , vregx = /^var(.*)/
      , equal = '='
      , fdata = fp.content;

    if (fdata.match(hregx)) {
        var vars = fdata.match(hregx).shift()
            .split(equal).map(function(e) {
                return e.trim()
            });

        if (vars.first().match(vregx)) {
            return vars.first().match(vregx).pop().trim();
        } // TODO: can contain more than one http instance, fix this !!
    }

    return;
}


/**
 * Execute a given JS file, within apigee
 * context, httpClient, dependencies etc
 *
 * @param  opts [// TODO: document options]
 * @return {result}  [result of execution]
 */
var Parser = module.exports = function(opts, callback) {
    // TODO: implement leaks, fs.exceptions
    var p = opts.path, f, tp,
        c = opts.context,
        d = opts.dependency ? opts.dependency : null;
        h = opts.httpclient ? opts.httpclient : null;
        req = opts.request ? opts.request : null;
        res = opts.response ? opts.response : null;

    var fd = get_path(p).toString()
    if (!opts.fixture) {
        tp = String(fd).replace(new RegExp(path.extname(fd) + '$'), '') + fix_ext;
    } else {
        tp = get_path(opts.fixture).toString();
    }

    try {
        f = require(tp);
    } catch (e) {
        throw new TestSetupError(e);
    }

    if (!Object.keys(f)) {
        throw new TestSetupError('Test Data missing');
    }

    Object.keys(f).forEach(function(k) {
        c.tearDown(); // teardown previous setup context
        try {
            Object.keys(f[k]).forEach(function(kv) {
                c.setVariable(kv, f[k][kv]);
            });
        } catch (e) {
            throw new TestSetupError(e);
        };

        var httpusage
          , fn = function(fp, context, dependency, httpClient, Request) {
            try {
                dependency ? dependency.map(
                    eval(fs.readFileSync(get_path)
                        .toString())) : null;
            } catch (e) {
                throw new DependencyInjectionError(e);
            } try {
                httpusage = isHttp(fp);

                if (httpusage) {
                    eval(fp.content);
                    return eval(httpusage);
                } return eval(fp.content);
            } catch (e) {
                throw new ExecutionError(e);
            }
        };

        var result = fn.call({}, fd, c, d, h, req);

        callback(result);
    });
};