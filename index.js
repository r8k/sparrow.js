
/**
 * `Module` Dependencies
 */
var fs = require('fs')
  , path = require('path')
  , jsex = '.js', libp = './lib';


/**
 * expose `sparrow`
 * via crude loader
 */
var mods = fs.readdirSync(__dirname + path.sep + libp);

mods.forEach(function(mod) {
    var k = mod.split(path.extname(mod)).shift();
    if (path.extname(mod) === jsex) {
        exports[k] = require(libp + path.sep + k);
    }
});