
var assert = require('assert')
var Negotiator = require('..')

describe('negotiator.language()', function () {
  whenAcceptLanguage(undefined, function () {
    it('should return *', function () {
      assert.strictEqual(this.negotiator.language(), '*')
    })
  })

  whenAcceptLanguage('*', function () {
    it('should return *', function () {
      assert.strictEqual(this.negotiator.language(), '*')
    })
  })

  whenAcceptLanguage('*, en', function () {
    it('should return *', function () {
      assert.strictEqual(this.negotiator.language(), '*')
    })
  })

  whenAcceptLanguage('*, en;q=0', function () {
    it('should return *', function () {
      assert.strictEqual(this.negotiator.language(), '*')
    })
  })

  whenAcceptLanguage('*;q=0.8, en, es', function () {
    it('should return en', function () {
      assert.deepEqual(this.negotiator.language(), 'en')
    })
  })

  whenAcceptLanguage('en', function () {
    it('should en', function () {
      assert.strictEqual(this.negotiator.language(), 'en')
    })
  })

  whenAcceptLanguage('en;q=0', function () {
    it('should return undefined', function () {
      assert.strictEqual(this.negotiator.language(), undefined)
    })
  })

  whenAcceptLanguage('en;q=0.8, es', function () {
    it('should return es', function () {
      assert.strictEqual(this.negotiator.language(), 'es')
    })
  })

  whenAcceptLanguage('en;q=0.9, es;q=0.8, en;q=0.7', function () {
    it('should return en', function () {
      assert.strictEqual(this.negotiator.language(), 'en')
    })
  })

  whenAcceptLanguage('en-US, en;q=0.8', function () {
    it('should return en-US', function () {
      assert.strictEqual(this.negotiator.language(), 'en-US')
    })
  })

  whenAcceptLanguage('en-US, en-GB', function () {
    it('should return en-US', function () {
      assert.deepEqual(this.negotiator.language(), 'en-US')
    })
  })

  whenAcceptLanguage('en-US;q=0.8, es', function () {
    it('should return es', function () {
      assert.strictEqual(this.negotiator.language(), 'es')
    })
  })

  whenAcceptLanguage('nl;q=0.5, fr, de, en, it, es, pt, no, se, fi, ro', function () {
    it('should return fr', function () {
      assert.strictEqual(this.negotiator.language(), 'fr')
    })
  })
})

describe('negotiator.language(array)', function () {
  whenAcceptLanguage(undefined, function () {
    it('should return undefined for empty list', function () {
      assert.strictEqual(this.negotiator.language([]), undefined)
    })

    it('should return first language in list', function () {
      assert.strictEqual(this.negotiator.language(['en']), 'en')
      assert.strictEqual(this.negotiator.language(['es', 'en']), 'es')
    })
  })

  whenAcceptLanguage('*', function () {
    it('should return undefined for empty list', function () {
      assert.strictEqual(this.negotiator.language([]), undefined)
    })

    it('should return first language in list', function () {
      assert.strictEqual(this.negotiator.language(['en']), 'en')
      assert.strictEqual(this.negotiator.language(['es', 'en']), 'es')
    })
  })

  whenAcceptLanguage('*, en', function () {
    it('should return undefined for empty list', function () {
      assert.strictEqual(this.negotiator.language([]), undefined)
    })

    it('should return most preferred language', function () {
      assert.strictEqual(this.negotiator.language(['en']), 'en')
      assert.strictEqual(this.negotiator.language(['es', 'en']), 'en')
    })
  })

  whenAcceptLanguage('*, en;q=0', function () {
    it('should return undefined for empty list', function () {
      assert.strictEqual(this.negotiator.language([]), undefined)
    })

    it('should exclude en', function () {
      assert.strictEqual(this.negotiator.language(['en']), undefined)
      assert.strictEqual(this.negotiator.language(['es', 'en']), 'es')
    })
  })

  whenAcceptLanguage('*;q=0.8, en, es', function () {
    it('should prefer en and es over everything', function () {
      assert.deepEqual(this.negotiator.language(['en', 'nl']), 'en')
      assert.deepEqual(this.negotiator.language(['ro', 'nl']), 'ro')
    })
  })

  whenAcceptLanguage('en', function () {
    it('should return undefined for empty list', function () {
      assert.strictEqual(this.negotiator.language([]), undefined)
    })

    it('should return preferred langauge', function () {
      assert.strictEqual(this.negotiator.language(['en']), 'en')
      assert.strictEqual(this.negotiator.language(['es', 'en']), 'en')
    })

    it('should accept en-US, preferring en over en-US', function () {
      assert.strictEqual(this.negotiator.language(['en-US']), 'en-US')
      assert.strictEqual(this.negotiator.language(['en-US', 'en']), 'en')
      assert.strictEqual(this.negotiator.language(['en', 'en-US']), 'en')
    })
  })

  whenAcceptLanguage('en;q=0', function () {
    it('should return undefined for empty list', function () {
      assert.strictEqual(this.negotiator.language([]), undefined)
    })

    it('should return preferred langauge', function () {
      assert.strictEqual(this.negotiator.language(['es', 'en']), undefined)
    })
  })

  whenAcceptLanguage('en;q=0.8, es', function () {
    it('should return undefined for empty list', function () {
      assert.strictEqual(this.negotiator.language([]), undefined)
    })

    it('should return preferred langauge', function () {
      assert.strictEqual(this.negotiator.language(['en']), 'en')
      assert.strictEqual(this.negotiator.language(['en', 'es']), 'es')
    })
  })

  whenAcceptLanguage('en;q=0.9, es;q=0.8, en;q=0.7', function () {
    it('should use highest perferred order on duplicate', function () {
      assert.strictEqual(this.negotiator.language(['es']), 'es')
      assert.strictEqual(this.negotiator.language(['en', 'es']), 'en')
      assert.strictEqual(this.negotiator.language(['es', 'en']), 'en')
    })
  })

  whenAcceptLanguage('en-US, en;q=0.8', function () {
    it('should use prefer en-US over en', function () {
      assert.strictEqual(this.negotiator.language(['en', 'en-US']), 'en-US')
      assert.strictEqual(this.negotiator.language(['en-GB', 'en-US']), 'en-US')
      assert.strictEqual(this.negotiator.language(['en-GB', 'es']), 'en-GB')
    })
  })

  whenAcceptLanguage('en-US, en-GB', function () {
    it('should prefer en-US', function () {
      assert.deepEqual(this.negotiator.language(['en-US', 'en-GB']), 'en-US')
      assert.deepEqual(this.negotiator.language(['en-GB', 'en-US']), 'en-US')
    })
  })

  whenAcceptLanguage('en-US;q=0.8, es', function () {
    it('should prefer es over en-US', function () {
      assert.strictEqual(this.negotiator.language(['es', 'en-US']), 'es')
      assert.strictEqual(this.negotiator.language(['en-US', 'es']), 'es')
      assert.strictEqual(this.negotiator.language(['en-US', 'en']), 'en-US')
    })
  })

  whenAcceptLanguage('nl;q=0.5, fr, de, en, it, es, pt, no, se, fi, ro', function () {
    it('should use prefer fr over nl', function () {
      assert.strictEqual(this.negotiator.language(['nl', 'fr']), 'fr')
    })
  })
})

describe('negotiator.languages()', function () {
  whenAcceptLanguage(undefined, function () {
    it('should return *', function () {
      assert.deepEqual(this.negotiator.languages(), ['*'])
    })
  })

  whenAcceptLanguage('*', function () {
    it('should return *', function () {
      assert.deepEqual(this.negotiator.languages(), ['*'])
    })
  })

  whenAcceptLanguage('*, en', function () {
    it('should return *, en', function () {
      assert.deepEqual(this.negotiator.languages(), ['*', 'en'])
    })
  })

  whenAcceptLanguage('*, en;q=0', function () {
    it('should return *', function () {
      assert.deepEqual(this.negotiator.languages(), ['*'])
    })
  })

  whenAcceptLanguage('*;q=0.8, en, es', function () {
    it('should return preferred languages', function () {
      assert.deepEqual(this.negotiator.languages(), ['en', 'es', '*'])
    })
  })

  whenAcceptLanguage('en', function () {
    it('should return preferred languages', function () {
      assert.deepEqual(this.negotiator.languages(), ['en'])
    })
  })

  whenAcceptLanguage('en;q=0', function () {
    it('should return empty list', function () {
      assert.deepEqual(this.negotiator.languages(), [])
    })
  })

  whenAcceptLanguage('en;q=0.8, es', function () {
    it('should return preferred languages', function () {
      assert.deepEqual(this.negotiator.languages(), ['es', 'en'])
    })
  })

  whenAcceptLanguage('en;q=0.9, es;q=0.8, en;q=0.7', function () {
    it.skip('should use highest perferred order on duplicate', function () {
      assert.deepEqual(this.negotiator.languages(), ['en', 'es'])
    })
  })

  whenAcceptLanguage('en-US, en;q=0.8', function () {
    it('should return en-US, en', function () {
      assert.deepEqual(this.negotiator.languages(), ['en-US', 'en'])
    })
  })

  whenAcceptLanguage('en-US, en-GB', function () {
    it('should return en-US, en-GB', function () {
      assert.deepEqual(this.negotiator.languages(), ['en-US', 'en-GB'])
    })
  })

  whenAcceptLanguage('en-US;q=0.8, es', function () {
    it('should return es, en-US', function () {
      assert.deepEqual(this.negotiator.languages(), ['es', 'en-US'])
    })
  })

  whenAcceptLanguage('nl;q=0.5, fr, de, en, it, es, pt, no, se, fi, ro', function () {
    it('should use prefer fr over nl', function () {
      assert.deepEqual(this.negotiator.languages(), ['fr', 'de', 'en', 'it', 'es', 'pt', 'no', 'se', 'fi', 'ro', 'nl'])
    })
  })
})

describe('negotiator.languages(array)', function () {
  whenAcceptLanguage(undefined, function () {
    it('should return original list', function () {
      assert.deepEqual(this.negotiator.languages(['en']), ['en'])
      assert.deepEqual(this.negotiator.languages(['es', 'en']), ['es', 'en'])
    })
  })

  whenAcceptLanguage('*', function () {
    it('should return original list', function () {
      assert.deepEqual(this.negotiator.languages(['en']), ['en'])
      assert.deepEqual(this.negotiator.languages(['es', 'en']), ['es', 'en'])
    })
  })

  whenAcceptLanguage('*, en', function () {
    it('should return list in client-preferred order', function () {
      assert.deepEqual(this.negotiator.languages(['en']), ['en'])
      assert.deepEqual(this.negotiator.languages(['es', 'en']), ['en', 'es'])
    })
  })

  whenAcceptLanguage('*, en;q=0', function () {
    it('should exclude en', function () {
      assert.deepEqual(this.negotiator.languages(['en']), [])
      assert.deepEqual(this.negotiator.languages(['es', 'en']), ['es'])
    })
  })

  whenAcceptLanguage('*;q=0.8, en, es', function () {
    it('should return preferred languages', function () {
      assert.deepEqual(this.negotiator.languages(['fr', 'de', 'en', 'it', 'es', 'pt', 'no', 'se', 'fi', 'ro', 'nl']),
        ['en', 'es', 'fr', 'de', 'it', 'pt', 'no', 'se', 'fi', 'ro', 'nl'])
    })
  })

  whenAcceptLanguage('en', function () {
    it('should return preferred languages', function () {
      assert.deepEqual(this.negotiator.languages(['en']), ['en'])
      assert.deepEqual(this.negotiator.languages(['en', 'es']), ['en'])
      assert.deepEqual(this.negotiator.languages(['es', 'en']), ['en'])
    })

    it('should accept en-US, preferring en over en-US', function () {
      assert.deepEqual(this.negotiator.languages(['en-US']), ['en-US'])
      assert.deepEqual(this.negotiator.languages(['en-US', 'en']), ['en', 'en-US'])
      assert.deepEqual(this.negotiator.languages(['en', 'en-US']), ['en', 'en-US'])
    })
  })

  whenAcceptLanguage('en;q=0', function () {
    it('should return nothing', function () {
      assert.deepEqual(this.negotiator.languages(['en']), [])
      assert.deepEqual(this.negotiator.languages(['en', 'es']), [])
    })
  })

  whenAcceptLanguage('en;q=0.8, es', function () {
    it('should return preferred languages', function () {
      assert.deepEqual(this.negotiator.languages(['en']), ['en'])
      assert.deepEqual(this.negotiator.languages(['en', 'es']), ['es', 'en'])
      assert.deepEqual(this.negotiator.languages(['es', 'en']), ['es', 'en'])
    })
  })

  whenAcceptLanguage('en;q=0.9, es;q=0.8, en;q=0.7', function () {
    it.skip('should return preferred languages', function () {
      assert.deepEqual(this.negotiator.languages(['en']), ['en'])
      assert.deepEqual(this.negotiator.languages(['en', 'es']), ['es', 'en'])
      assert.deepEqual(this.negotiator.languages(['es', 'en']), ['es', 'en'])
    })
  })

  whenAcceptLanguage('en-US, en;q=0.8', function () {
    it('should be case insensitive', function () {
      assert.deepEqual(this.negotiator.languages(['en-us', 'EN']), ['en-us', 'EN'])
    })

    it('should prefer en-US over en', function () {
      assert.deepEqual(this.negotiator.languages(['en-US', 'en']), ['en-US', 'en'])
      assert.deepEqual(this.negotiator.languages(['en-GB', 'en-US', 'en']), ['en-US', 'en', 'en-GB'])
    })
  })

  whenAcceptLanguage('en-US, en-GB', function () {
    it('should prefer en-US over en-GB', function () {
      assert.deepEqual(this.negotiator.languages(['en-US', 'en-GB']), ['en-US', 'en-GB'])
      assert.deepEqual(this.negotiator.languages(['en-GB', 'en-US']), ['en-US', 'en-GB'])
    })
  })

  whenAcceptLanguage('en-US;q=0.8, es', function () {
    it('should prefer es over en-US', function () {
      assert.deepEqual(this.negotiator.languages(['en', 'es']), ['es', 'en'])
      assert.deepEqual(this.negotiator.languages(['en', 'es', 'en-US']), ['es', 'en-US', 'en'])
    })
  })

  whenAcceptLanguage('nl;q=0.5, fr, de, en, it, es, pt, no, se, fi, ro', function () {
    it('should return preferred languages', function () {
      assert.deepEqual(this.negotiator.languages(['fr', 'de', 'en', 'it', 'es', 'pt', 'no', 'se', 'fi', 'ro', 'nl']),
       ['fr', 'de', 'en', 'it', 'es', 'pt', 'no', 'se', 'fi', 'ro', 'nl'])
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

function whenAcceptLanguage(acceptLanguage, func) {
  var description = !acceptLanguage
    ? 'when no Accept-Language'
    : 'when Accept-Language: ' + acceptLanguage

  describe(description, function () {
    before(function () {
      this.negotiator = new Negotiator(createRequest({'Accept-Language': acceptLanguage}))
    })

    func()
  })
}
