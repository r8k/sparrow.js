
/**
 * extend `String.proto` with asJSON
 */
Object.defineProperty(String.prototype, 'asJSON', {
    get: function() {
        return JSON.parse(this);
    }
});


/**
 * Extend Number with range, to find
 * if a given number falls within range
 * 
 * @param  a [min]
 * @param  b [max]
 * @param  i [inclusive: boolean]
 * @return {Boolean}
 */
Number.prototype.range  = function (a, b, i) {
    i = i || true;
    var min = Math.min.apply(Math, [a, b]),
        max = Math.max.apply(Math, [a, b]);
    return i ? this >= min && this <= max : this > min && this < max;
};


/**
 * define `first` for Array
 * @return {this}
 */
Array.prototype.first = function () {
    return this[0];
};