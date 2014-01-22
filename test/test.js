var sparrow = require('../')
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

    it("should have empty initial content property", function() {
        (context.getVariable('response.content')).should.not.be.ok;        
    });

    it("should set & get content property", function() {
        context.setVariable('response.content', JSON.stringify({
            user_first_name: 'jack',
            user_last_name: 'sparrow'
        }));

        var payload = context.getVariable('response.content');
        payload.should.be.type('string');
        JSON.parse(payload).should.have.property('user_first_name', 'jack');
        JSON.parse(payload).should.have.property('user_last_name', 'sparrow');
    });

    it("should set & get headers property", function() {
        context.setVariable('request.headers.authorization', 'Basic user:pass');
        var auth_header = context.getVariable('request.headers.authorization');
        auth_header.should.be.exactly('Basic user:pass');
        
    });

    it("should set & get query params property", function() {
        context.setVariable('request.queryParams.city', 'Bengaluru');
        var auth_header = context.getVariable('request.queryParams.city');
        auth_header.should.be.exactly('Bengaluru');
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