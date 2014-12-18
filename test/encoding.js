
var Negotiator = require('..');

(function() {
  var configuration, testConfigurations, testCorrectEncoding, _i, _len,
    _this = this;

  this["Should return identity encoding when no encoding is provided"] = function(test) {
    var request = createRequest({});
    var negotiator = new Negotiator(request);

    test.deepEqual(negotiator.encodings(), ['identity']);

    return test.done();
  };

  this["Should include the identity encoding even if not explicitly listed"] = function(test) {
    var request = createRequest({'Accept-Encoding': 'gzip'});
    var negotiator = new Negotiator(request);

    test.deepEqual(negotiator.encodings(), ['gzip', 'identity']);

    return test.done();
  };

  this["Should not return identity encoding if q = 0"] = function(test) {
    var request = createRequest({'Accept-Encoding': 'identity;q=0'});
    var negotiator = new Negotiator(request);

    test.deepEqual(negotiator.encodings(), []);

    return test.done();
  };

  this["Should not return identity encoding if * has q = 0"] = function(test) {
    var request = createRequest({'Accept-Encoding': '*;q=0'});
    var negotiator = new Negotiator(request);

    test.deepEqual(negotiator.encodings(), []);

    return test.done();
  };

  this["Should not return identity encoding if * has q = 0 but identity explicitly has q > 0"] = function(test) {
    var request = createRequest({'Accept-Encoding': '*;q=0, identity;q=0.5'});
    var negotiator = new Negotiator(request);

    test.deepEqual(negotiator.encodings(), ['identity']);

    return test.done();
  };

  this["Should be case insensitive"] = function(test) {
    var request = createRequest({'Accept-Encoding': 'IDENTITY'});
    var negotiator = new Negotiator(request);

    test.deepEqual(negotiator.encodings(['identity']), ['identity']);

    return test.done();
  };

  testCorrectEncoding = function(c) {
    return _this["Should return " + c.selected + " for accept-encoding header " + c.accept + " with provided encoding " + c.provided] = function(test) {
      var request = createRequest({'Accept-Encoding': c.accept});
      var negotiator = new Negotiator(request);

      test.deepEqual(negotiator.encodings(c.provided), c.selected);

      return test.done();
    };
  };

  testConfigurations = [
    {
      accept: undefined,
      provided: ['identity', 'gzip'],
      selected: ['identity']
    }, {
      accept: 'gzip',
      provided: ['identity', 'gzip'],
      selected: ['gzip', 'identity']
    }, {
      accept: 'gzip, compress',
      provided: ['compress'],
      selected: ['compress']
    }, {
      accept: 'deflate',
      provided: ['gzip', 'identity'],
      selected: ['identity']
    }, {
      accept: '*',
      provided: ['identity', 'gzip'],
      selected: ['identity', 'gzip']
    }, {
      accept: 'gzip, compress',
      provided: ['compress', 'identity'],
      selected: ['compress', 'identity']
    }, {
      accept: 'gzip;q=0.8, identity;q=0.5, *;q=0.3',
      provided: ['identity', 'gzip', 'compress'],
      selected: ['gzip', 'identity', 'compress']
    }, {
      accept: 'gzip;q=0.8, compress',
      provided: ['gzip', 'compress'],
      selected: ['compress', 'gzip']
    }, {
      accept: '*, compress;q=0',
      provided: ['gzip', 'compress'],
      selected: ['gzip']
    }, {
      accept: 'gzip;q=0.8, compress',
      provided: null,
      selected: ['compress', 'gzip', 'identity']
    }, {
      accept : '*, compress',
      provided : ['gzip', 'compress'],
      selected : ['compress', 'gzip' ]
    }, {
      accept : 'gzip;q=0.9, compress;q=0.8, gzip;q=0.7',
      provided : ['gzip', 'compress'],
      selected : ['gzip', 'compress']
    }
  ];

  for (_i = 0, _len = testConfigurations.length; _i < _len; _i++) {
    configuration = testConfigurations[_i];
    testCorrectEncoding(configuration);
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
