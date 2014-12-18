
var Negotiator = require('..');

(function() {
  var configuration, testConfigurations, testCorrectType, _i, _len,
    _this = this;

  this["Should return list of languages in order"] = function(test) {
    var request = createRequest({'Accept-Language': 'nl;q=0.5,fr,de,en,it,es,pt,no,se,fi'});
    var negotiator = new Negotiator(request);

    test.deepEqual(negotiator.languages(), ['fr', 'de', 'en', 'it', 'es', 'pt', 'no', 'se', 'fi', 'nl']);

    return test.done();
  };

  this["Should return list of languages in order (large list)"] = function(test) {
    var request = createRequest({'Accept-Language': 'nl;q=0.5,fr,de,en,it,es,pt,no,se,fi,ro'});
    var negotiator = new Negotiator(request);

    test.deepEqual(negotiator.languages(), ['fr', 'de', 'en', 'it', 'es', 'pt', 'no', 'se', 'fi', 'ro', 'nl']);

    return test.done();
  };

  this["Should not return a language when no is provided"] = function(test) {
    var request = createRequest({'Accept-Language': '*'});
    var negotiator = new Negotiator(request);

    test.deepEqual(negotiator.languages([]), []);

    return test.done();
  };

  this["Should not return a language when no language is acceptable"] = function(test) {
    var request = createRequest({'Accept-Language': 'en'});
    var negotiator = new Negotiator(request);

    test.deepEqual(negotiator.languages(['es']), []);

    return test.done();
  };

  this["Should not return a language with q = 0"] = function(test) {
    var request = createRequest({'Accept-Language': 'en;q=0'});
    var negotiator = new Negotiator(request);

    test.deepEqual(negotiator.languages(['en']), []);

    return test.done();
  };

  this["Should be case insensitive"] = function(test) {
    var request = createRequest({'Accept-Language': 'en-us'});
    var negotiator = new Negotiator(request);

    test.deepEqual(negotiator.languages(['en-US']), ['en-US']);

    return test.done();
  };

  testCorrectType = function(c) {
    return _this["Should return " + c.selected + " for accept-language header " + c.accept + " with provided language " + c.provided] = function(test) {
      var request = createRequest({'Accept-Language': c.accept});
      var negotiator = new Negotiator(request);

      test.deepEqual(negotiator.languages(c.provided), c.selected);

      return test.done();
    };
  };

  testConfigurations = [
    {
      accept: undefined,
      provided: ['en'],
      selected: ['en']
    }, {
      accept: 'en',
      provided: ['en'],
      selected: ['en']
    }, {
      accept: '*',
      provided: ['en'],
      selected: ['en']
    }, {
      accept: 'en-US, en;q=0.8',
      provided: ['en-US', 'en-GB'],
      selected: ['en-US', 'en-GB']
    }, {
      accept: 'en-US, en-GB',
      provided: ['en-US'],
      selected: ['en-US']
    }, {
      accept: 'en',
      provided: ['en-US'],
      selected: ['en-US']
    }, {
      accept: 'en;q=0.8, es',
      provided: ['en', 'es'],
      selected: ['es', 'en']
    }, {
      accept: 'en-US;q=0.8, es',
      provided: ['en', 'es'],
      selected: ['es', 'en']
    }, {
      accept: '*, en;q=0',
      provided: ['en', 'es'],
      selected: ['es']
    }, {
      accept: 'en-US;q=0.8, es',
      provided: null,
      selected: ['es', 'en-US']
    }, {
      accept: '*, en',
      provided: ['es', 'en'],
      selected: ['en', 'es']
    }, {
      accept: 'en',
      provided: ['en', ''],
      selected: ['en']
    }, {
      accept: 'en;q=0.9, es;q=0.8, en;q=0.7',
      provided: ['en', 'es'],
      selected: ['en', 'es']
    }
  ];

  for (_i = 0, _len = testConfigurations.length; _i < _len; _i++) {
    configuration = testConfigurations[_i];
    testCorrectType(configuration);
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
