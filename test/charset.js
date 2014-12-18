
var Negotiator = require('..');

(function() {
  var configuration, testConfigurations, testCorrectCharset, _i, _len,
    _this = this;

  this["Should not return a charset when no charset is provided"] = function(test) {
    var request = createRequest({'Accept-Charset': '*'});
    var negotiator = new Negotiator(request);

    test.deepEqual(negotiator.charsets([]), []);

    return test.done();
  };

  this["Should not return a charset when no charset is acceptable"] = function(test) {
    var request = createRequest({'Accept-Charset': 'ISO-8859-1'});
    var negotiator = new Negotiator(request);

    test.deepEqual(negotiator.charsets(['utf-8']), []);

    return test.done();
  };

  this["Should not return a charset with q = 0"] = function(test) {
    var request = createRequest({'Accept-Charset': 'utf-8;q=0'});
    var negotiator = new Negotiator(request);

    test.deepEqual(negotiator.charsets(['utf-8']), []);

    return test.done();
  };

  this["Should be case insensitive"] = function(test) {
    var request = createRequest({'Accept-Charset': 'iso-8859-1'});
    var negotiator = new Negotiator(request);

    test.deepEqual(negotiator.charsets(['ISO-8859-1']), ['ISO-8859-1']);

    return test.done();
  };

  testCorrectCharset = function(c) {
    return _this["Should return " + c.selected + " for accept-charset header " + c.accept + " with provided charset " + c.provided] = function(test) {
      var request = createRequest({'Accept-Charset': c.accept});
      var negotiator = new Negotiator(request);

      test.deepEqual(negotiator.charsets(c.provided), c.selected);

      return test.done();
    };
  };

  testConfigurations = [
    {
      accept: undefined,
      provided: ['utf-8'],
      selected: ['utf-8']
    }, {
      accept: 'utf-8',
      provided: ['utf-8'],
      selected: ['utf-8']
    }, {
      accept: '*',
      provided: ['utf-8'],
      selected: ['utf-8']
    }, {
      accept: 'utf-8',
      provided: ['utf-8', 'ISO-8859-1'],
      selected: ['utf-8']
    }, {
      accept: 'utf-8, ISO-8859-1',
      provided: ['utf-8'],
      selected: ['utf-8']
    }, {
      accept: 'utf-8;q=0.8, ISO-8859-1',
      provided: ['utf-8', 'ISO-8859-1'],
      selected: ['ISO-8859-1', 'utf-8']
    }, {
      accept: 'utf-8;q=0.8, ISO-8859-1',
      provided: null,
      selected: ['ISO-8859-1', 'utf-8']
    }, {
      accept: '*, utf-8;q=0',
      provided: ['utf-8', 'ISO-8859-1'],
      selected: ['ISO-8859-1']
    }, {
      accept : '*, utf-8',
      provided: ['utf-8', 'ISO-8859-1' ],
      selected: ['utf-8', 'ISO-8859-1' ]
    }, {
      accept : 'utf-8;q=0.9, ISO-8859-1;q=0.8, utf-8;q=0.7',
      provided: ['utf-8', 'ISO-8859-1' ],
      selected: ['utf-8', 'ISO-8859-1' ]
    }
  ];

  for (_i = 0, _len = testConfigurations.length; _i < _len; _i++) {
    configuration = testConfigurations[_i];
    testCorrectCharset(configuration);
  }

}).call(this);

function createRequest(headers) {
  var request = {
    headers: {}
  };

  Object.keys(headers).forEach(function (key) {
    request.headers[key.toLowerCase()] = headers[key];
  })

  return request;
}
