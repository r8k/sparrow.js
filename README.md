[![sparrow logo](http://f.cl.ly/items/2U1E2g0v1p272R312H3b/sparrow-logo.jpg)](http://apigee.com/)
  
  Light & Simple, Apigee JavaScript adapter, for using with test frameworks, on your local machine !!

## Installation
    $ npm install -g sparrow.js
    $ cd your_project && sudo npm link sparrow.js

## Using it
```js
// with mocha installed ( npm install -g mocha )
// File: test.js

var sparrow = require('sparrow.js')
  , Context = sparrow.Context
  , httplib = sparrow.Http
  , Parser = sparrow.Parser;

 describe("Context", function() {
    var context;

    beforeEach(function() {
        context = new Context();
    });

    afterEach(function() {
        context.tearDown();
    });

    it("should exec js from file, with apigee context", function() {
        var opts = {
            path: './src/int-str',
            context: context
        };
        
        var result = Parser(opts, function(result) {
            var payload = context.getVariable('response.content');
            JSON.parse(payload).user_id.should.be.type('string');
        });
    });
});
```

```js
// File: ./src/int-str.js
var response_payload;
try {
    response_payload = JSON.parse(context.getVariable('response.content'));
} catch (e) {
  // do nothing
}
try {
    if (response_payload) {
        var o = response_payload;
        for (var k in o) {
            if (o.hasOwnProperty(k) && !isNaN(o[k])) {
                o[k] = String(o[k]);
            }
        }
      context.setVariable('response.content', JSON.stringify(response_payload));
    }
} catch (e) {
    // do nothing
};
```

## Running Tests
    $ sparrow ./src/int-str.js
  
  * This will produce a test fixture file, next to the source javascript file (int-str.js).
  * Open this file and populate the test data needed for your JS file. Look at examples directory, to learn more.
  * Now that you've populated the test data, execute the below command.

##
    $ mocha


## License

(The MIT License)

Copyright (c) 2013-2014 Rajiv Kilaparti &lt;rkilaparti@apigee.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.