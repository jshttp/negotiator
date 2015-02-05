
var Negotiator = require('..');

(function() {
  var configuration, testConfigurations, testCorrectType, _i, _len,
    _this = this;

  this["Should return list of media types in order"] = function(test) {
    var request = createRequest({Accept: 'text/plain, application/json;q=0.5, text/html, */*;q=0.1'});
    var negotiator = new Negotiator(request);

    test.deepEqual(negotiator.mediaTypes(), ['text/plain', 'text/html', 'application/json', '*/*']);
    test.strictEqual(negotiator.mediaType(), 'text/plain');

    return test.done();
  };

  this["Should return list of media types in order (large list)"] = function(test) {
    var request = createRequest({Accept: 'text/plain, application/json;q=0.5, text/html, text/xml, text/yaml, text/javascript, text/csv, text/css, text/rtf, text/markdown, */*;q=0.1'});
    var negotiator = new Negotiator(request);

    test.deepEqual(negotiator.mediaTypes(), ['text/plain', 'text/html', 'text/xml', 'text/yaml', 'text/javascript', 'text/csv', 'text/css', 'text/rtf', 'text/markdown', 'application/json', '*/*']);
    test.strictEqual(negotiator.mediaType(), 'text/plain');

    return test.done();
  };

  this["Should return media type desired (large list)"] = function(test) {
    var request = createRequest({Accept: 'text/plain, application/json;q=0.5, text/html, text/xml, text/yaml, text/javascript, text/csv, text/css, text/rtf, text/markdown, application/octet-stream;q=0.1'});
    var negotiator = new Negotiator(request);

    test.deepEqual(negotiator.mediaTypes(['text/plain', 'text/html', 'text/xml', 'text/yaml', 'text/javascript', 'text/csv', 'text/css', 'text/rtf', 'text/markdown', 'application/json', 'application/octet-stream']), ['text/plain', 'text/html', 'text/xml', 'text/yaml', 'text/javascript', 'text/csv', 'text/css', 'text/rtf', 'text/markdown', 'application/json', 'application/octet-stream']);
    test.strictEqual(negotiator.mediaType(['text/plain', 'text/html', 'text/xml', 'text/yaml', 'text/javascript', 'text/csv', 'text/css', 'text/rtf', 'text/markdown', 'application/json', 'application/octet-stream']), 'text/plain');

    return test.done();
  };

  this["Should not return a media type when no media type provided"] = function(test) {
    var request = createRequest({Accept: '*/*'});
    var negotiator = new Negotiator(request);

    test.deepEqual(negotiator.mediaTypes([]), []);
    test.strictEqual(negotiator.mediaType([]), undefined);

    return test.done();
  };

  this["Should not return a media type when no media type is acceptable"] = function(test) {
    var request = createRequest({Accept: 'application/json'});
    var negotiator = new Negotiator(request);

    test.deepEqual(negotiator.mediaTypes(['text/html']), []);
    test.strictEqual(negotiator.mediaType(['text/html']), undefined);

    return test.done();
  };

  this["Should not return a media type with q = 0"] = function(test) {
    var request = createRequest({Accept: 'text/html;q=0'});
    var negotiator = new Negotiator(request);

    test.deepEqual(negotiator.mediaTypes(['text/html']), []);
    test.strictEqual(negotiator.mediaType(['text/html']), undefined);

    return test.done();
  };

  this["Should handle extra slashes on query params"] = function(test) {
    var request = createRequest({Accept: 'application/xhtml+xml;profile="http://www.wapforum.org/xhtml"'});
    var negotiator = new Negotiator(request);

    test.deepEqual(negotiator.mediaTypes(['application/xhtml+xml;profile="http://www.wapforum.org/xhtml"']), ['application/xhtml+xml;profile="http://www.wapforum.org/xhtml"']);
    test.strictEqual(negotiator.mediaType(['application/xhtml+xml;profile="http://www.wapforum.org/xhtml"']), 'application/xhtml+xml;profile="http://www.wapforum.org/xhtml"');

    return test.done();
  };

  this["Should be case insensitive"] = function(test) {
    var request = createRequest({Accept: 'application/JSON'});
    var negotiator = new Negotiator(request);

    test.deepEqual(negotiator.mediaTypes(['application/json']), ['application/json']);
    test.strictEqual(negotiator.mediaType(['application/json']), 'application/json');

    return test.done();
  };


  testCorrectType = function(c) {
    return _this["Should return " + c.selected + " for access header " + c.accept + " with provided types " + c.provided] = function(test) {
      var request = createRequest({Accept: c.accept});
      var negotiator = new Negotiator(request);

      test.deepEqual(negotiator.mediaTypes(c.provided), c.selected);
      test.strictEqual(negotiator.mediaType(c.provided), c.selected[0]);

      return test.done();
    };
  };

  testConfigurations = [
    {
      accept: undefined,
      provided: ['text/html'],
      selected: ['text/html']
    }, {
      accept: 'text/html',
      provided: ['text/html'],
      selected: ['text/html']
    }, {
      accept: 'text/html;level',
      provided: ['text/html'],
      selected: ['text/html']
    }, {
      accept: '*/*',
      provided: ['text/html'],
      selected: ['text/html']
    }, {
      accept: 'text/*',
      provided: ['text/html'],
      selected: ['text/html']
    }, {
      accept: 'application/json, text/html',
      provided: ['text/html'],
      selected: ['text/html']
    }, {
      accept: 'text/html;q=0.1',
      provided: ['text/html'],
      selected: ['text/html']
    }, {
      accept: 'application/json, text/html',
      provided: ['application/json', 'text/html'],
      selected: ['application/json', 'text/html']
    }, {
      accept: 'application/json;q=0.2, text/html',
      provided: ['application/json', 'text/html'],
      selected: ['text/html', 'application/json']
    }, {
      accept: 'application/json;q=0.2, text/html',
      provided: null,
      selected: ['text/html', 'application/json']
    }, {
      accept: 'text/*, text/html;q=0',
      provided: ['text/html', 'text/plain'],
      selected: ['text/plain']
    }, {
      accept: 'text/*, text/html;q=0.5',
      provided: ['text/html', 'text/plain'],
      selected: ['text/plain', 'text/html']
    }, {
      accept: 'application/json, */*; q=0.01',
      provided: ['text/html', 'application/json'],
      selected: ['application/json', 'text/html']
    }, {
      accept: 'application/vnd.example;attribute=value',
      provided: ['application/vnd.example;attribute=other', 'application/vnd.example;attribute=value'],
      selected: ['application/vnd.example;attribute=value']
    }, {
      accept: 'application/vnd.example;attribute=other',
      provided: ['application/vnd.example', 'application/vnd.example;attribute=other'],
      selected: ['application/vnd.example;attribute=other']
    }, {
      accept: 'text/html;level=1',
      provided: ['text/html;level=1;foo=bar'],
      selected: ['text/html;level=1;foo=bar']
    }, {
      accept: 'text/html;level=1;foo=bar',
      provided: ['text/html;level=1'],
      selected: []
    }, {
      accept: 'text/html;level=2',
      provided: ['text/html;level=1'],
      selected: []
    }, {
      accept : 'text/html, text/html;level=1;q=0.1',
      provided : ['text/html', 'text/html;level=1'],
      selected : ['text/html', 'text/html;level=1']
    }, {
      accept : 'text/*;q=0.3, text/html;q=0.7, text/html;level=1, text/html;level=2;q=0.4, */*;q=0.5',
      provided : ['text/html;level=1', 'text/html', 'text/html;level=3', 'image/jpeg', 'text/html;level=2', 'text/plain'],
      selected : ['text/html;level=1', 'text/html', 'text/html;level=3', 'image/jpeg', 'text/html;level=2', 'text/plain']
    }, {
      accept : 'text/html, application/xhtml+xml, */*',
      provided : ['application/json', 'text/html'],
      selected : ['text/html', 'application/json' ]
    }, {
      accept : 'text/html, application/json',
      provided : ['text/html', 'boom'],
      selected : ['text/html']
    }, {
      accept: 'application/json;q=0.9, text/html;q=0.8, application/json;q=0.7',
      provided: ['application/json', 'text/html'],
      selected: ['application/json', 'text/html']
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
