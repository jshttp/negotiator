
var assert = require('assert')
var Negotiator = require('..')

describe('negotiator.mediaType()', function () {
  whenAccept(undefined, function () {
    it('should return */*', function () {
      assert.strictEqual(this.negotiator.mediaType(), '*/*')
    })
  })

  whenAccept('*/*', function () {
    it('should return */*', function () {
      assert.strictEqual(this.negotiator.mediaType(), '*/*')
    })
  })

  whenAccept('application/json', function () {
    it('should return application/json', function () {
      assert.deepEqual(this.negotiator.mediaType(), 'application/json')
    })
  })

  whenAccept('application/json;q=0', function () {
    it('should return undefined', function () {
      assert.strictEqual(this.negotiator.mediaType(), undefined)
    })
  })

  whenAccept('application/json;q=0.2, text/html', function () {
    it('should return text/html', function () {
      assert.deepEqual(this.negotiator.mediaType(), 'text/html')
    })
  })

  whenAccept('text/*', function () {
    it('should return text/*', function () {
      assert.strictEqual(this.negotiator.mediaType(), 'text/*')
    })
  })

  whenAccept('text/plain, application/json;q=0.5, text/html, */*;q=0.1', function () {
    it('should return text/plain', function () {
      assert.strictEqual(this.negotiator.mediaType(), 'text/plain')
    })
  })

  whenAccept('text/plain, application/json;q=0.5, text/html, text/xml, text/yaml, text/javascript, text/csv, text/css, text/rtf, text/markdown, application/octet-stream;q=0.2, */*;q=0.1', function () {
    it('should return text/plain', function () {
      assert.strictEqual(this.negotiator.mediaType(), 'text/plain')
    })
  })
})

describe('negotiator.mediaType(undefined, {detailed: true})', function () {
  whenAccept('text/*', function () {
    it('should return a detailed spec object with text/*', function () {
      assert.deepEqual(
        this.negotiator.mediaType(undefined, {detailed: true}),
        {"type": "text/*", parameters: {}, "q": 1}
      )
    })
  })

  whenAccept('text/plain;charset=utf-8;q=0.8, application/json;q=0.5, text/html;q=0.7, */*;q=0.1', function () {
    it('should return a detailed object for text/plain', function () {
      assert.deepEqual(
        this.negotiator.mediaType(undefined, {detailed: true}),
        {"type": "text/plain", parameters: {"charset": "utf-8"}, "q": .8}
      )
    })
  })
})

describe('negotiator.mediaType(array)', function () {
  whenAccept(undefined, function () {
    it('should return first item in list', function () {
      assert.strictEqual(this.negotiator.mediaType(['text/html']), 'text/html')
      assert.strictEqual(this.negotiator.mediaType(['text/html', 'application/json']), 'text/html')
      assert.strictEqual(this.negotiator.mediaType(['application/json', 'text/html']), 'application/json')
    })
  })

  whenAccept('*/*', function () {
    it('should return first item in list', function () {
      assert.strictEqual(this.negotiator.mediaType(['text/html']), 'text/html')
      assert.strictEqual(this.negotiator.mediaType(['text/html', 'application/json']), 'text/html')
      assert.strictEqual(this.negotiator.mediaType(['application/json', 'text/html']), 'application/json')
    })
  })

  whenAccept('application/json', function () {
    it('should be case insensitive', function () {
      assert.strictEqual(this.negotiator.mediaType(['application/JSON']), 'application/JSON')
    })

    it('should only return application/json', function () {
      assert.strictEqual(this.negotiator.mediaType(['text/html']), undefined)
      assert.strictEqual(this.negotiator.mediaType(['text/html', 'application/json']), 'application/json')
    })
  })

  whenAccept('application/json;q=0', function () {
    it('should return undefined', function () {
      assert.strictEqual(this.negotiator.mediaType(), undefined)
    })
  })

  whenAccept('application/json;q=0.2, text/html', function () {
    it('should prefer text/html over application/json', function () {
      assert.strictEqual(this.negotiator.mediaType(['application/json']), 'application/json')
      assert.strictEqual(this.negotiator.mediaType(['application/json', 'text/html']), 'text/html')
      assert.strictEqual(this.negotiator.mediaType(['text/html', 'application/json']), 'text/html')
    })
  })

  whenAccept('text/*', function () {
    it('should prefer text media types', function () {
      assert.strictEqual(this.negotiator.mediaType(['application/json']), undefined)
      assert.strictEqual(this.negotiator.mediaType(['application/json', 'text/html']), 'text/html')
      assert.strictEqual(this.negotiator.mediaType(['text/html', 'application/json']), 'text/html')
    })
  })

  whenAccept('text/*, text/plain;q=0', function () {
    it('should prefer text media types', function () {
      assert.strictEqual(this.negotiator.mediaType(['application/json']), undefined)
      assert.strictEqual(this.negotiator.mediaType(['application/json', 'text/html']), 'text/html')
      assert.strictEqual(this.negotiator.mediaType(['text/html', 'application/json']), 'text/html')
    })
  })

  whenAccept('text/plain, application/json;q=0.5, text/html, */*;q=0.1', function () {
    it('should return in preferred order', function () {
      assert.strictEqual(this.negotiator.mediaType(['application/json', 'text/plain', 'text/html']), 'text/plain')
      assert.strictEqual(this.negotiator.mediaType(['image/jpeg', 'text/html']), 'text/html')
      assert.strictEqual(this.negotiator.mediaType(['image/jpeg', 'image/gif']), 'image/jpeg')
    })
  })

  whenAccept('text/plain, application/json;q=0.5, text/html, text/xml, text/yaml, text/javascript, text/csv, text/css, text/rtf, text/markdown, application/octet-stream;q=0.2, */*;q=0.1', function () {
    it('should return the client-preferred order', function () {
      assert.strictEqual(this.negotiator.mediaType(['text/plain', 'text/html', 'text/xml', 'text/yaml', 'text/javascript', 'text/csv', 'text/css', 'text/rtf', 'text/markdown', 'application/json', 'application/octet-stream']),
        'text/plain')
    })
  })
})

describe('negotiator.mediaType(array, {detailed: true})', function() {
  whenAccept('text/*', function () {
    it('should return a detailed spec object with text/html', function () {
      assert.deepEqual(
        this.negotiator.mediaType(["text/html"], {detailed: true}),
        {"type": "text/html", parameters: {}, "q": 1}
      )
    })
  })

  whenAccept('text/html;LEVEL=1, application/json;q=0.5', function () {
    it('should return parameters, but require an exact match', function () {
      assert.deepEqual(
        this.negotiator.mediaType(["text/html"], {detailed: true}),
        undefined
      )

      assert.deepEqual(
        this.negotiator.mediaType(["text/html; level=1"], {detailed: true}),
        {"type": "text/html", "parameters": {"level": "1"}, "q": 1}
      )
    })
  })
})

describe('negotiator.mediaTypes()', function () {
  whenAccept(undefined, function () {
    it('should return */*', function () {
      assert.deepEqual(this.negotiator.mediaTypes(), ['*/*'])
    })
  })

  whenAccept('*/*', function () {
    it('should return */*', mediaTypesPreferred(
      ['*/*']
    ))
  })

  whenAccept('application/json', function () {
    it('should return application/json', function () {
      assert.deepEqual(this.negotiator.mediaTypes(), ['application/json'])
    })
  })

  whenAccept('application/json;q=0', function () {
    it('should return empty list', function () {
      assert.deepEqual(this.negotiator.mediaTypes(), [])
    })
  })

  whenAccept('application/json;q=0.2, text/html', function () {
    it('should return text/html, application/json', function () {
      assert.deepEqual(this.negotiator.mediaTypes(), ['text/html', 'application/json'])
    })
  })

  whenAccept('text/*', function () {
    it('should return text/*', function () {
      assert.deepEqual(this.negotiator.mediaTypes(), ['text/*'])
    })
  })

  whenAccept('text/*, text/plain;q=0', function () {
    it('should return text/*', function () {
      assert.deepEqual(this.negotiator.mediaTypes(), ['text/*'])
    })
  })

  whenAccept('text/html;LEVEL=1', function () {
    it('should return text/html;LEVEL=1', function () {
      assert.deepEqual(this.negotiator.mediaTypes(), ['text/html'])
    })
  })

  whenAccept('text/html;foo="bar,text/css;";fizz="buzz,5", text/plain', function () {
    it('should return text/html, text/plain', function () {
      assert.deepEqual(this.negotiator.mediaTypes(), ['text/html', 'text/plain'])
    })
  })

  whenAccept('text/plain, application/json;q=0.5, text/html, */*;q=0.1', function () {
    it('should return text/plain, text/html, application/json, */*', function () {
      assert.deepEqual(this.negotiator.mediaTypes(), ['text/plain', 'text/html', 'application/json', '*/*'])
    })
  })

  whenAccept('text/plain, application/json;q=0.5, text/html, text/xml, text/yaml, text/javascript, text/csv, text/css, text/rtf, text/markdown, application/octet-stream;q=0.2, */*;q=0.1', function () {
    it('should return the client-preferred order', function () {
      assert.deepEqual(this.negotiator.mediaTypes(), ['text/plain', 'text/html', 'text/xml', 'text/yaml', 'text/javascript', 'text/csv', 'text/css', 'text/rtf', 'text/markdown', 'application/json', 'application/octet-stream', '*/*'])
    })
  })
})

describe('negotiator.mediaTypes(undefined, {detailed: true})', function() {
  whenAccept('text/*', function () {
    it('should return a detailed spec object with text/*', function () {
      assert.deepEqual(
        this.negotiator.mediaTypes(undefined, {detailed: true}),
        [{"type": "text/*", parameters: {}, "q": 1}]
      )
    })
  })

  whenAccept('text/html;LEVEL=1, application/json;q=0.5', function () {
    it('should return more-detailed spec objects', function () {
      assert.deepEqual(
        this.negotiator.mediaTypes(undefined, {detailed: true}),
        [
          {"type": "text/html", "parameters": {"level": "1"}, "q": 1},
          {"type": "application/json", "parameters": {}, "q": 0.5}
        ]
      )
    })
  })
})

describe('negotiator.mediaTypes(array)', function () {
  whenAccept(undefined, function () {
    it('should return return original list', mediaTypesNegotiated(
      ['application/json', 'text/plain'],
      ['application/json', 'text/plain']
    ))
  })

  whenAccept('*/*', function () {
    it('should return return original list', mediaTypesNegotiated(
      ['application/json', 'text/plain'],
      ['application/json', 'text/plain']
    ))
  })

  whenAccept('*/*;q=0.8, text/*, image/*', function () {
    it('should return return stable-sorted list', mediaTypesNegotiated(
      ['application/json', 'text/html', 'text/plain', 'text/xml', 'application/xml', 'image/gif', 'image/jpeg', 'image/png', 'audio/mp3', 'application/javascript', 'text/javascript'],
      ['text/html', 'text/plain', 'text/xml', 'text/javascript', 'image/gif', 'image/jpeg', 'image/png', 'application/json', 'application/xml', 'audio/mp3', 'application/javascript']
    ))
  })

  whenAccept('application/json', function () {
    it('should accept application/json', mediaTypesNegotiated(
      ['application/json'],
      ['application/json']
    ))

    it('should be case insensitive', mediaTypesNegotiated(
      ['application/JSON'],
      ['application/JSON']
    ))

    it('should only return application/json', mediaTypesNegotiated(
      ['text/html', 'application/json'],
      ['application/json']
    ))

    it('should ignore invalid types', mediaTypesNegotiated(
      ['boom', 'application/json'],
      ['application/json']
    ))
  })

  whenAccept('application/json;q=0', function () {
    it('should not accept application/json', mediaTypesNegotiated(
      ['application/json'],
      []
    ))

    it('should not accept other media types', mediaTypesNegotiated(
      ['application/json', 'text/html', 'image/jpeg'],
      []
    ))
  })

  whenAccept('application/json;q=0.2, text/html', function () {
    it('should prefer text/html over application/json', mediaTypesNegotiated(
      ['application/json', 'text/html'],
      ['text/html', 'application/json']
    ))
  })

  whenAccept('application/json;q=0.9, text/html;q=0.8, application/json;q=0.7', function () {
    it('should prefer application/json over text/html', mediaTypesNegotiated(
      ['text/html', 'application/json'],
      ['application/json', 'text/html']
    ))
  })

  whenAccept('application/json, */*;q=0.1', function () {
    it('should prefer application/json over text/html', mediaTypesNegotiated(
      ['text/html', 'application/json'],
      ['application/json', 'text/html']
    ))
  })

  whenAccept('application/xhtml+xml;profile="http://www.wapforum.org/xhtml"', function () {
    it('should accept application/xhtml+xml;profile="http://www.wapforum.org/xhtml"', mediaTypesNegotiated(
      ['application/xhtml+xml;profile="http://www.wapforum.org/xhtml"'],
      ['application/xhtml+xml;profile="http://www.wapforum.org/xhtml"']
    ))
  })

  whenAccept('text/*', function () {
    it('should prefer text media types', mediaTypesNegotiated(
      ['text/html', 'application/json', 'text/plain'],
      ['text/html', 'text/plain']
    ))
  })

  whenAccept('text/*, text/html;level', function () {
    it('should accept text/html', mediaTypesNegotiated(
      ['text/html'],
      ['text/html']
    ))
  })

  whenAccept('text/*, text/plain;q=0', function () {
    it('should prefer text media types except text/plain', mediaTypesNegotiated(
      ['text/html', 'text/plain'],
      ['text/html']
    ))
  })

  whenAccept('text/*, text/plain;q=0.5', function () {
    it('should prefer text/plain below other text types', mediaTypesNegotiated(
      ['text/html', 'text/plain', 'text/xml'],
      ['text/html', 'text/xml', 'text/plain']
    ))
  })

  whenAccept('text/html;level=1', function () {
    it('should accept text/html;level=1', mediaTypesNegotiated(
      ['text/html;level=1'],
      ['text/html;level=1']
    ))

    it('should accept text/html;Level=1', mediaTypesNegotiated(
      ['text/html;Level=1'],
      ['text/html;Level=1']
    ))

    it('should not accept text/html;level=2', mediaTypesNegotiated(
      ['text/html;level=2'],
      []
    ))

    it('should not accept text/html', mediaTypesNegotiated(
      ['text/html'],
      []
    ))

    it('should accept text/html;level=1;foo=bar', mediaTypesNegotiated(
      ['text/html;level=1;foo=bar'],
      ['text/html;level=1;foo=bar']
    ))
  })

  whenAccept('text/html;level=1;foo=bar', function () {
    it('should not accept text/html;level=1', mediaTypesNegotiated(
      ['text/html;level=1'],
      []
    ))

    it('should accept text/html;level=1;foo=bar', mediaTypesNegotiated(
      ['text/html;level=1;foo=bar'],
      ['text/html;level=1;foo=bar']
    ))

    it('should accept text/html;foo=bar;level=1', mediaTypesNegotiated(
      ['text/html;foo=bar;level=1'],
      ['text/html;foo=bar;level=1']
    ))
  })

  whenAccept('text/html;level=1;foo="bar"', function () {
    it('should accept text/html;level=1;foo=bar', mediaTypesNegotiated(
      ['text/html;level=1;foo=bar'],
      ['text/html;level=1;foo=bar']
    ))

    it('should accept text/html;level=1;foo="bar"', mediaTypesNegotiated(
      ['text/html;level=1;foo="bar"'],
      ['text/html;level=1;foo="bar"']
    ))
  })

  whenAccept('text/html;foo=";level=2;"', function () {
    it('should not accept text/html;level=2', mediaTypesNegotiated(
      ['text/html;level=2'],
      []
    ))

    it('should accept text/html;foo=";level=2;"', mediaTypesNegotiated(
      ['text/html;foo=";level=2;"'],
      ['text/html;foo=";level=2;"']
    ))
  })

  whenAccept('text/html;LEVEL=1', function () {
    it('should accept text/html;level=1', mediaTypesNegotiated(
      ['text/html;level=1'],
      ['text/html;level=1']
    ))

    it('should accept text/html;Level=1', mediaTypesNegotiated(
      ['text/html;Level=1'],
      ['text/html;Level=1']
    ))
  })

  whenAccept('text/html;LEVEL=1;level=2', function () {
    it('should accept text/html;level=2', mediaTypesNegotiated(
      ['text/html;level=2'],
      ['text/html;level=2']
    ))

    it('should not accept text/html;level=1', mediaTypesNegotiated(
      ['text/html;level=1'],
      []
    ))
  })

  whenAccept('text/html;level=2', function () {
    it('should not accept text/html;level=1', mediaTypesNegotiated(
      ['text/html;level=1'],
      []
    ))
  })

  whenAccept('text/html;level=2, text/html', function () {
    it('should prefer text/html;level=2 over text/html', mediaTypesNegotiated(
      ['text/html', 'text/html;level=2'],
      ['text/html;level=2', 'text/html']
    ))
  })

  whenAccept('text/html;level=2;q=0.1, text/html', function () {
    it('should prefer text/html over text/html;level=2', mediaTypesNegotiated(
      ['text/html;level=2', 'text/html'],
      ['text/html', 'text/html;level=2']
    ))
  })

  whenAccept('text/html;level=2;q=0.1;level=1', function () {
    it('should not accept text/html;level=1', mediaTypesNegotiated(
      ['text/html;level=1'],
      []
    ))
  })

  whenAccept('text/html;level=2;q=0.1, text/html;level=1, text/html;q=0.5', function () {
    it('should prefer text/html;level=1, text/html, text/html;level=2', mediaTypesNegotiated(
      ['text/html;level=1', 'text/html;level=2', 'text/html'],
      ['text/html;level=1', 'text/html', 'text/html;level=2']
    ))
  })

  whenAccept('text/plain, application/json;q=0.5, text/html, */*;q=0.1', function () {
    it('should prefer text/plain over text/html', mediaTypesNegotiated(
      ['text/html', 'text/plain'],
      ['text/plain', 'text/html']
    ))

    it('should prefer application/json after text', mediaTypesNegotiated(
      ['application/json', 'text/html', 'text/plain'],
      ['text/plain', 'text/html', 'application/json']
    ))

    it('should prefer image/jpeg after text', mediaTypesNegotiated(
      ['image/jpeg', 'text/html', 'text/plain'],
      ['text/plain', 'text/html', 'image/jpeg']
    ))
  })

  whenAccept('text/plain, application/json;q=0.5, text/html, text/xml, text/yaml, text/javascript, text/csv, text/css, text/rtf, text/markdown, application/octet-stream;q=0.2, */*;q=0.1', function () {
    it('should return the client-preferred order', mediaTypesNegotiated(
      ['text/plain', 'text/html', 'text/xml', 'text/yaml', 'text/javascript', 'text/csv', 'text/css', 'text/rtf', 'text/markdown', 'application/json', 'application/octet-stream'],
      ['text/plain', 'text/html', 'text/xml', 'text/yaml', 'text/javascript', 'text/csv', 'text/css', 'text/rtf', 'text/markdown', 'application/json', 'application/octet-stream']
    ))
  })
})

describe('negotiator.mediaTypes(array, {detailed: true})', function() {
  whenAccept('text/*', function () {
    it('should return a detailed spect object with text/html', function () {
      assert.deepEqual(
        this.negotiator.mediaTypes(["text/html"], {detailed: true}),
        [{"type": "text/html", parameters: {}, "q": 1}]
      )
    })
  })

  whenAccept('text/html;LEVEL=1, application/json;q=0.5', function () {
    it('should return parameters, but require an exact match', function () {
      assert.deepEqual(
        this.negotiator.mediaTypes(["text/html"], {detailed: true}),
        []
      )

      assert.deepEqual(
        this.negotiator.mediaTypes(["text/html; level=1"], {detailed: true}),
        [{"type": "text/html", "parameters": {"level": "1"}, "q": 1}]
      )
    })
  })
})

function createRequest(headers) {
  var request = {
    headers: {}
  }

  if (headers) {
    Object.keys(headers).forEach(function (key) {
      request.headers[key.toLowerCase()] = headers[key]
    })
  }

  return request
}

function mediaTypesNegotiated(serverTypes, preferredTypes) {
  return function () {
    assert.deepEqual(this.negotiator.mediaTypes(serverTypes), preferredTypes)
  }
}

function mediaTypesPreferred(preferredTypes) {
  return function () {
    assert.deepEqual(this.negotiator.mediaTypes(), preferredTypes)
  }
}

function whenAccept(accept, func) {
  var description = !accept
    ? 'when no Accept'
    : 'when Accept: ' + accept

  describe(description, function () {
    before(function () {
      this.negotiator = Negotiator(createRequest({'Accept': accept}))
    })

    func()
  })
}
