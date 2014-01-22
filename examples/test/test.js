var sparrow = require('../../')
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

describe("HttpClient", function() {
    var context;

    beforeEach(function() {
        context = new Context();
    });

    afterEach(function() {
        context.tearDown();
    });

    it("should exec js from file, with http context", function() {
        this.timeout(0); // disable timeout, since http test case
        var httpclient = httplib.Client
          , opts = {
            path: './src/http',
            context: context,
            httpclient: httpclient
        };

        var result = Parser(opts, function(result) {
            result.getResponse().should.have.property('status', 'OK');
            result.getResponse().should.have.property('headers');
            result.getResponse().should.have.property('statusCode');
        });
    });
});