/**
 * `Module` Dependencies
 */
var request = require('request');


/**
 * `Request` Object, to help with
 * preparing Request options.
 */
exports.Request = function() {
  var args = Array.prototype.slice.call(arguments),
      path = args.shift(),
      method = args.shift() || 'GET',
      headers = args.shift() || {},
      data = args.shift() || {};

  options = {
    url: path,
    method: method,
    headers: headers
  };

  if(method === 'POST' || method === 'PUT' || method === 'PATCH' ){
    options.body = data;
  }

  return options;
};


/**
 * `Exchange` Object, to act as a container
 * for the http Exchange
 *
 * @param opts [responseData]
 */
function Exchange(responseData){
  this.data = responseData;

  if (this.data.error){
    throw(this.data.error);
  } else if (this.data.response.statusCode.range(200, 399)) {
    this._isSuccess = true;
  } else {
    this._isSuccess = false;
  }
}


/**
 * nothing to do here, just a mock !!
 */
Exchange.prototype.waitForComplete = function() {
  return;
};


/**
 * to know, if the request succeeded,
 * based on HTTP Response Codes
 *
 * @return {Boolean}
 */
Exchange.prototype.isSuccess = function() {
    return this._isSuccess;
};


/**
 * `getResponse` would return Response
 * Object, with all needed information
 *
 * @return {Object}
 */
 Exchange.prototype.getResponse = function() {
  return {
      success: this._isSuccess,
      headers: this.data.response.headers,
      statusCode: this.data.response.statusCode,
      content: this.data.body.toString()
  };
};


/**
 * `HttpClient`
 */
var Client = exports.Client = {};


/**
 * `send` instead of using get.
 * useful for methods other than get.
 *
 * @return {Exchange Object}
 */
Client.send = function (opts) {
  var done = false;
  var response_data;

  request(opts, function(error, response, body){
    response_data = {
      error: error,
      response: response,
      body: body
    };

    done = true;
  });

  while(!done) {
    require('deasync').runLoopOnce();
  }

  return new Exchange(response_data);
};


/**
 * useful for method: get.
 *
 * @return {Message Object}
 */
Client.get = function (url) {
  var done = false;
  var response_data;
  var opts = {
    url: url,
    method: 'GET'
  };

  request(opts, function(error, response, body){
    response_data = {
      error: error,
      response: response,
      body: body
    };

    done = true;
  });

  while(!done) {
    require('deasync').runLoopOnce();
  }

  return new Exchange(response_data);
};
