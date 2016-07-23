
var assert = require('assert')
var Negotiator = require('..')

var clientPreference = { sortPreference: 'client'}
var serverPreference = { sortPreference: 'server'}
var clientThenServerPreference = { sortPreference: 'clientThenServer'}

describe('negotiator.encoding()', function () {
  whenAcceptEncoding(undefined, function () {
    it('should return identity', function () {
      assert.strictEqual(this.negotiator.encoding(), 'identity')
    })
  })

  whenAcceptEncoding('*', function () {
    it('should return *', function () {
      assert.strictEqual(this.negotiator.encoding(), '*')
    })
  })

  whenAcceptEncoding('*, gzip', function () {
    it('should return *', function () {
      assert.strictEqual(this.negotiator.encoding(), '*')
    })
  })

  whenAcceptEncoding('*, gzip;q=0', function () {
    it('should return *', function () {
      assert.strictEqual(this.negotiator.encoding(), '*')
    })
  })

  whenAcceptEncoding('*;q=0', function () {
    it('should return undefined', function () {
      assert.strictEqual(this.negotiator.encoding(), undefined)
    })
  })

  whenAcceptEncoding('*;q=0, identity;q=1', function () {
    it('should return identity', function () {
      assert.strictEqual(this.negotiator.encoding(), 'identity')
    })
  })

  whenAcceptEncoding('identity', function () {
    it('should return identity', function () {
      assert.strictEqual(this.negotiator.encoding(), 'identity')
    })
  })

  whenAcceptEncoding('identity;q=0', function () {
    it('should return undefined', function () {
      assert.strictEqual(this.negotiator.encoding(), undefined)
    })
  })

  whenAcceptEncoding('gzip', function () {
    it('should return gzip', function () {
      assert.strictEqual(this.negotiator.encoding(), 'gzip')
    })
  })

  whenAcceptEncoding('gzip, compress;q=0', function () {
    it('should return gzip', function () {
      assert.strictEqual(this.negotiator.encoding(), 'gzip')
    })
  })

  whenAcceptEncoding('gzip, deflate', function () {
    it('should return gzip', function () {
      assert.strictEqual(this.negotiator.encoding(), 'gzip')
    })
  })

  whenAcceptEncoding('gzip;q=0.8, deflate', function () {
    it('should return deflate', function () {
      assert.strictEqual(this.negotiator.encoding(), 'deflate')
    })
  })

  whenAcceptEncoding('gzip;q=0.8, identity;q=0.5, *;q=0.3', function () {
    it('should return gzip', function () {
      assert.strictEqual(this.negotiator.encoding(), 'gzip')
    })
  })
})

describe('negotiator.encoding(array)', function () {
  whenAcceptEncoding(undefined, function () {
    it('should return undefined for empty list', function () {
      assert.strictEqual(this.negotiator.encoding([]), undefined)
    })

    it('should only match identity', function () {
      assert.strictEqual(this.negotiator.encoding(['identity']), 'identity')
      assert.strictEqual(this.negotiator.encoding(['gzip']), undefined)
    })
  })

  whenAcceptEncoding('*', function () {
    it('should return undefined for empty list', function () {
      assert.strictEqual(this.negotiator.encoding([]), undefined)
    })

    it('should return first item in list', function () {
      assert.strictEqual(this.negotiator.encoding(['identity']), 'identity')
      assert.strictEqual(this.negotiator.encoding(['gzip']), 'gzip')
      assert.strictEqual(this.negotiator.encoding(['gzip', 'identity']), 'gzip')
    })
  })

  whenAcceptEncoding('*, gzip', function () {
    it('should prefer gzip', function () {
      assert.strictEqual(this.negotiator.encoding(['identity']), 'identity')
      assert.strictEqual(this.negotiator.encoding(['gzip']), 'gzip')
      assert.strictEqual(this.negotiator.encoding(['compress', 'gzip']), 'gzip')
    })

    it('clientThenServerPreference: should return server-preferred encoding', function () {
      assert.strictEqual(this.negotiator.encoding(['identity'], clientThenServerPreference), 'identity')
      assert.strictEqual(this.negotiator.encoding(['gzip'], clientThenServerPreference), 'gzip')
      assert.strictEqual(this.negotiator.encoding(['compress', 'gzip'], clientThenServerPreference), 'compress')
    })
  })

  whenAcceptEncoding('*, gzip;q=0', function () {
    it('should exclude gzip', function () {
      assert.strictEqual(this.negotiator.encoding(['identity']), 'identity')
      assert.strictEqual(this.negotiator.encoding(['gzip']), undefined)
      assert.strictEqual(this.negotiator.encoding(['gzip', 'compress']), 'compress')
    })
  })

  whenAcceptEncoding('*;q=0', function () {
    it('should return undefined for empty list', function () {
      assert.strictEqual(this.negotiator.encoding([]), undefined)
    })

    it('should match nothing', function () {
      assert.strictEqual(this.negotiator.encoding(['identity']), undefined)
      assert.strictEqual(this.negotiator.encoding(['gzip']), undefined)
    })
  })

  whenAcceptEncoding('*;q=0, identity;q=1', function () {
    it('should return undefined for empty list', function () {
      assert.strictEqual(this.negotiator.encoding([]), undefined)
    })

    it('should still match identity', function () {
      assert.strictEqual(this.negotiator.encoding(['identity']), 'identity')
      assert.strictEqual(this.negotiator.encoding(['gzip']), undefined)
    })
  })

  whenAcceptEncoding('identity', function () {
    it('should return undefined for empty list', function () {
      assert.strictEqual(this.negotiator.encoding([]), undefined)
    })

    it('should only match identity', function () {
      assert.strictEqual(this.negotiator.encoding(['identity']), 'identity')
      assert.strictEqual(this.negotiator.encoding(['gzip']), undefined)
    })
  })

  whenAcceptEncoding('identity;q=0', function () {
    it('should return undefined for empty list', function () {
      assert.strictEqual(this.negotiator.encoding([]), undefined)
    })

    it('should match nothing', function () {
      assert.strictEqual(this.negotiator.encoding(['identity']), undefined)
      assert.strictEqual(this.negotiator.encoding(['gzip']), undefined)
    })
  })

  whenAcceptEncoding('gzip', function () {
    it('should return undefined for empty list', function () {
      assert.strictEqual(this.negotiator.encoding([]), undefined)
    })

    it('should return client-preferred encodings', function () {
      assert.strictEqual(this.negotiator.encoding(['gzip']), 'gzip')
      assert.strictEqual(this.negotiator.encoding(['identity', 'gzip']), 'gzip')
      assert.strictEqual(this.negotiator.encoding(['identity']), 'identity')
    })
  })

  whenAcceptEncoding('gzip, compress;q=0', function () {
    it('should not return compress', function () {
      assert.strictEqual(this.negotiator.encoding(['compress']), undefined)
      assert.strictEqual(this.negotiator.encoding(['deflate', 'compress']), undefined)
      assert.strictEqual(this.negotiator.encoding(['gzip', 'compress']), 'gzip')
    })
  })

  whenAcceptEncoding('gzip, deflate', function () {
    it('should return first client-preferred encoding', function () {
      assert.strictEqual(this.negotiator.encoding(['deflate', 'compress']), 'deflate')
    })
  })

  whenAcceptEncoding('gzip;q=0.8, deflate', function () {
    it('should return most client-preferred encoding', function () {
      assert.strictEqual(this.negotiator.encoding(['gzip']), 'gzip')
      assert.strictEqual(this.negotiator.encoding(['deflate']), 'deflate')
      assert.strictEqual(this.negotiator.encoding(['deflate', 'gzip']), 'deflate')
    })
  })

  whenAcceptEncoding('gzip;q=0.8, identity;q=0.5, *;q=0.3', function () {
    it('should return most client-preferred encoding', function () {
      assert.strictEqual(this.negotiator.encoding(['gzip']), 'gzip')
      assert.strictEqual(this.negotiator.encoding(['compress', 'identity']), 'identity')
    })
  })

  whenAcceptEncoding('gzip;q=0.9, sdhc, br;q=0.9', function () {
    it('should return best server-preferred encoding of equal client-preferred encodings', function () {
      assert.strictEqual(this.negotiator.encoding(['compress', 'br', 'gzip']), 'gzip')
      assert.strictEqual(this.negotiator.encoding(['compress', 'gzip', 'br']), 'gzip')
    })

    it('should return best server-preferred encoding of equal client-preferred encodings', function () {
      assert.strictEqual(this.negotiator.encoding(['compress', 'br', 'gzip'], clientThenServerPreference), 'br')
      assert.strictEqual(this.negotiator.encoding(['compress', 'gzip', 'br'], clientThenServerPreference), 'gzip')
    })

    it('should return best server-preferred encoding of equal client-preferred encodings', function () {
      assert.strictEqual(this.negotiator.encoding(['compress', 'br', 'gzip'], serverPreference), 'br')
      assert.strictEqual(this.negotiator.encoding(['compress', 'gzip', 'br'], serverPreference), 'gzip')
    })
  })
})

describe('negotiator.encodings()', function () {
  whenAcceptEncoding(undefined, function () {
    it('should return identity', function () {
      assert.deepEqual(this.negotiator.encodings(), ['identity'])
    })
  })

  whenAcceptEncoding('*', function () {
    it('should return *', function () {
      assert.deepEqual(this.negotiator.encodings(), ['*'])
    })
  })

  whenAcceptEncoding('*, gzip', function () {
    it('should prefer gzip', function () {
      assert.deepEqual(this.negotiator.encodings(), ['*', 'gzip'])
    })
  })

  whenAcceptEncoding('*, gzip;q=0', function () {
    it('should return *', function () {
      assert.deepEqual(this.negotiator.encodings(), ['*'])
    })
  })

  whenAcceptEncoding('*;q=0', function () {
    it('should return an empty list', function () {
      assert.deepEqual(this.negotiator.encodings(), [])
    })
  })

  whenAcceptEncoding('*;q=0, identity;q=1', function () {
    it('should return identity', function () {
      assert.deepEqual(this.negotiator.encodings(), ['identity'])
    })
  })

  whenAcceptEncoding('identity', function () {
    it('should return identity', function () {
      assert.deepEqual(this.negotiator.encodings(), ['identity'])
    })
  })

  whenAcceptEncoding('identity;q=0', function () {
    it('should return an empty list', function () {
      assert.deepEqual(this.negotiator.encodings(), [])
    })
  })

  whenAcceptEncoding('gzip', function () {
    it('should return gzip, identity', function () {
      assert.deepEqual(this.negotiator.encodings(), ['gzip', 'identity'])
    })
  })

  whenAcceptEncoding('gzip, compress;q=0', function () {
    it('should not return compress', function () {
      assert.deepEqual(this.negotiator.encodings(), ['gzip', 'identity'])
    })
  })

  whenAcceptEncoding('gzip, deflate', function () {
    it('should return client-preferred encodings', function () {
      assert.deepEqual(this.negotiator.encodings(), ['gzip', 'deflate', 'identity'])
    })
  })

  whenAcceptEncoding('gzip;q=0.8, deflate', function () {
    it('should return client-preferred encodings', function () {
      assert.deepEqual(this.negotiator.encodings(), ['deflate', 'gzip', 'identity'])
    })
  })

  whenAcceptEncoding('gzip;q=0.8, identity;q=0.5, *;q=0.3', function () {
    it('should return client-preferred encodings', function () {
      assert.deepEqual(this.negotiator.encodings(), ['gzip', 'identity', '*'])
    })
  })
})

describe('negotiator.encodings(array)', function () {
  whenAcceptEncoding(undefined, function () {
    it('should return empty list for empty list', function () {
      assert.deepEqual(this.negotiator.encodings([]), [])
    })

    it('should only match identity', function () {
      assert.deepEqual(this.negotiator.encodings(['identity']), ['identity'])
      assert.deepEqual(this.negotiator.encodings(['gzip']), [])
    })
  })

  whenAcceptEncoding('*', function () {
    it('should return empty list for empty list', function () {
      assert.deepEqual(this.negotiator.encodings([]), [])
    })

    it('should return original list', function () {
      assert.deepEqual(this.negotiator.encodings(['identity']), ['identity'])
      assert.deepEqual(this.negotiator.encodings(['gzip']), ['gzip'])
      assert.deepEqual(this.negotiator.encodings(['gzip', 'identity']), ['gzip', 'identity'])
    })
  })

  whenAcceptEncoding('*, gzip', function () {
    it('should prefer gzip', function () {
      assert.deepEqual(this.negotiator.encodings(['identity']), ['identity'])
      assert.deepEqual(this.negotiator.encodings(['gzip']), ['gzip'])
      assert.deepEqual(this.negotiator.encodings(['compress', 'deflate', 'gzip']), ['gzip', 'compress', 'deflate'])
    })

    it('clientThenServerPreference: should return server preferred encodings', function () {
      assert.deepEqual(this.negotiator.encodings(['identity'], clientThenServerPreference), ['identity'])
      assert.deepEqual(this.negotiator.encodings(['gzip'], clientThenServerPreference), ['gzip'])
      assert.deepEqual(this.negotiator.encodings(['compress', 'deflate', 'gzip'], clientThenServerPreference), ['compress', 'deflate', 'gzip'])
    })
  })

  whenAcceptEncoding('*, gzip;q=0', function () {
    it('should exclude gzip', function () {
      assert.deepEqual(this.negotiator.encodings(['identity']), ['identity'])
      assert.deepEqual(this.negotiator.encodings(['gzip']), [])
      assert.deepEqual(this.negotiator.encodings(['gzip', 'compress']), ['compress'])
    })
  })

  whenAcceptEncoding('*;q=0', function () {
    it('should always return empty list', function () {
      assert.deepEqual(this.negotiator.encodings([]), [])
      assert.deepEqual(this.negotiator.encodings(['identity']), [])
      assert.deepEqual(this.negotiator.encodings(['gzip']), [])
    })
  })

  whenAcceptEncoding('*;q=0, identity;q=1', function () {
    it('should still match identity', function () {
      assert.deepEqual(this.negotiator.encodings([]), [])
      assert.deepEqual(this.negotiator.encodings(['identity']), ['identity'])
      assert.deepEqual(this.negotiator.encodings(['gzip']), [])
    })
  })

  whenAcceptEncoding('identity', function () {
    it('should return empty list for empty list', function () {
      assert.deepEqual(this.negotiator.encodings([]), [])
    })

    it('should only match identity', function () {
      assert.deepEqual(this.negotiator.encodings(['identity']), ['identity'])
      assert.deepEqual(this.negotiator.encodings(['gzip']), [])
    })
  })

  whenAcceptEncoding('identity;q=0', function () {
    it('should always return empty list', function () {
      assert.deepEqual(this.negotiator.encodings([]), [])
      assert.deepEqual(this.negotiator.encodings(['identity']), [])
      assert.deepEqual(this.negotiator.encodings(['gzip']), [])
    })
  })

  whenAcceptEncoding('gzip', function () {
    it('should return empty list for empty list', function () {
      assert.deepEqual(this.negotiator.encodings([]), [])
    })

    it('should be case insensitive, returning provided casing', function () {
      assert.deepEqual(this.negotiator.encodings(['GZIP']), ['GZIP'])
      assert.deepEqual(this.negotiator.encodings(['gzip', 'GZIP']), ['gzip', 'GZIP'])
      assert.deepEqual(this.negotiator.encodings(['GZIP', 'gzip']), ['GZIP', 'gzip'])
    })

    it('should return client-preferred encodings', function () {
      assert.deepEqual(this.negotiator.encodings(['gzip']), ['gzip'])
      assert.deepEqual(this.negotiator.encodings(['gzip', 'identity']), ['gzip', 'identity'])
      assert.deepEqual(this.negotiator.encodings(['identity', 'gzip']), ['gzip', 'identity'])
      assert.deepEqual(this.negotiator.encodings(['identity']), ['identity'])
    })
  })

  whenAcceptEncoding('gzip, compress;q=0', function () {
    it('should not return compress', function () {
      assert.deepEqual(this.negotiator.encodings(['gzip', 'compress']), ['gzip'])
    })
  })

  whenAcceptEncoding('gzip, deflate', function () {
    it('should return client-preferred encodings', function () {
      assert.deepEqual(this.negotiator.encodings(['gzip']), ['gzip'])
      assert.deepEqual(this.negotiator.encodings(['gzip', 'identity']), ['gzip', 'identity'])
      assert.deepEqual(this.negotiator.encodings(['deflate', 'gzip']), ['gzip', 'deflate'])
      assert.deepEqual(this.negotiator.encodings(['identity']), ['identity'])
    })
  })

  whenAcceptEncoding('gzip;q=0.8, deflate', function () {
    it('should return client-preferred encodings', function () {
      assert.deepEqual(this.negotiator.encodings(['gzip']), ['gzip'])
      assert.deepEqual(this.negotiator.encodings(['deflate']), ['deflate'])
      assert.deepEqual(this.negotiator.encodings(['deflate', 'gzip']), ['deflate', 'gzip'])
    })

    it('serverPreference: should ignore client quality levels', function () {
      assert.deepEqual(this.negotiator.encodings(['deflate', 'gzip'], serverPreference), ['deflate', 'gzip'])
      assert.deepEqual(this.negotiator.encodings(['gzip', 'deflate'], serverPreference), ['gzip', 'deflate'])
    })
  })

  whenAcceptEncoding('gzip;q=0.8, identity;q=0.5, *;q=0.3', function () {
    it('should return client-preferred encodings', function () {
      assert.deepEqual(this.negotiator.encodings(['gzip']), ['gzip'])
      assert.deepEqual(this.negotiator.encodings(['identity', 'gzip', 'compress']), ['gzip', 'identity', 'compress'])
    })
  })

  whenAcceptEncoding('not;q=0, med1;q=0.9, med2;q=0.9, high, *;q=0.8', function () {
    it('clientPreference', function () {
      assert.deepEqual(this.negotiator.encodings(['high', 'not', 'med2', 'other', 'med1'], clientPreference), ['high', 'med1', 'med2', 'other'])
      assert.deepEqual(this.negotiator.encodings(['high', 'not', 'med1', 'other', 'med2'], clientPreference), ['high', 'med1', 'med2', 'other'])
    })

    it('clientThenServerPreference', function () {
      assert.deepEqual(this.negotiator.encodings(['high', 'not', 'med2', 'other', 'med1'], clientThenServerPreference), ['high', 'med2', 'med1', 'other'])
      assert.deepEqual(this.negotiator.encodings(['high', 'not', 'med1', 'other', 'med2'], clientThenServerPreference), ['high', 'med1', 'med2', 'other'])
    })

    it('serverPreference', function () {
      assert.deepEqual(this.negotiator.encodings(['high', 'not', 'med2', 'other', 'med1'], serverPreference), ['high', 'med2', 'other', 'med1'])
      assert.deepEqual(this.negotiator.encodings(['high', 'not', 'med1', 'other', 'med2'], serverPreference), ['high', 'med1', 'other', 'med2'])
    })
  })

  whenAcceptEncoding('not;q=0, med1;q=0.9, med2;q=0.9, high, identity;q=0.9', function () {
    it('clientPreference', function () {
      assert.deepEqual(this.negotiator.encodings(['high', 'not', 'med2', 'other', 'med1', 'identity'], clientPreference), ['high', 'med1', 'med2', 'identity'])
      assert.deepEqual(this.negotiator.encodings(['high', 'not', 'med1', 'other', 'med2', 'identity'], clientPreference), ['high', 'med1', 'med2', 'identity'])
    })

    it('clientThenServerPreference', function () {
      assert.deepEqual(this.negotiator.encodings(['high', 'not', 'med2', 'other', 'med1', 'identity'], clientThenServerPreference), ['high', 'med2', 'med1', 'identity'])
      assert.deepEqual(this.negotiator.encodings(['high', 'not', 'med1', 'other', 'med2', 'identity'], clientThenServerPreference), ['high', 'med1', 'med2', 'identity'])
    })

    it('serverPreference', function () {
      assert.deepEqual(this.negotiator.encodings(['high', 'not', 'med2', 'other', 'med1', 'identity'], serverPreference), ['high', 'med2', 'med1', 'identity'])
      assert.deepEqual(this.negotiator.encodings(['high', 'not', 'med1', 'other', 'med2', 'identity'], serverPreference), ['high', 'med1', 'med2', 'identity'])
    })
  })

  whenAcceptEncoding('c;q=0.9, b;q=0.89, a;q=0.9, d;q=0.91, e;q=0.9', function () {
    it('clientPreference', function () {
      assert.deepEqual(this.negotiator.encodings(['b','c','d','e'], clientPreference), ['d', 'c', 'e', 'b']);
      assert.deepEqual(this.negotiator.encodings(['c','d','e','b'], clientPreference), ['d', 'c', 'e', 'b']);
      assert.deepEqual(this.negotiator.encodings(['d','e','b','c'], clientPreference), ['d', 'c', 'e', 'b']);
      assert.deepEqual(this.negotiator.encodings(['e','b','c','d'], clientPreference), ['d', 'c', 'e', 'b']);

      assert.deepEqual(this.negotiator.encodings(['a','c','e'], clientPreference), ['c', 'a', 'e']);
      assert.deepEqual(this.negotiator.encodings(['c','e','a'], clientPreference), ['c', 'a', 'e']);
      assert.deepEqual(this.negotiator.encodings(['e','a','c'], clientPreference), ['c', 'a', 'e']);

      assert.deepEqual(this.negotiator.encodings(['identity','e','f'], clientPreference), ['e','identity']);
      assert.deepEqual(this.negotiator.encodings(['f','identity','e'], clientPreference), ['e','identity']);
      assert.deepEqual(this.negotiator.encodings(['e','f','identity'], clientPreference), ['e','identity']);
    })

    it('clientThenServerPreference', function () {
      assert.deepEqual(this.negotiator.encodings(['b','c','d','e'], clientThenServerPreference), ['d', 'c', 'e', 'b']);
      assert.deepEqual(this.negotiator.encodings(['c','d','e','b'], clientThenServerPreference), ['d', 'c', 'e', 'b']);
      assert.deepEqual(this.negotiator.encodings(['d','e','b','c'], clientThenServerPreference), ['d', 'e', 'c', 'b']);
      assert.deepEqual(this.negotiator.encodings(['e','b','c','d'], clientThenServerPreference), ['d', 'e', 'c', 'b']);

      assert.deepEqual(this.negotiator.encodings(['a','c','e'], clientThenServerPreference), ['a', 'c', 'e']);
      assert.deepEqual(this.negotiator.encodings(['c','e','a'], clientThenServerPreference), ['c', 'e', 'a']);
      assert.deepEqual(this.negotiator.encodings(['e','a','c'], clientThenServerPreference), ['e', 'a', 'c']);

      assert.deepEqual(this.negotiator.encodings(['identity','e','f'], clientThenServerPreference), ['e','identity']);
      assert.deepEqual(this.negotiator.encodings(['f','identity','e'], clientThenServerPreference), ['e','identity']);
      assert.deepEqual(this.negotiator.encodings(['e','f','identity'], clientThenServerPreference), ['e','identity']);
    })

    it('serverPreference', function () {
      assert.deepEqual(this.negotiator.encodings(['b','c','d','e'], serverPreference), ['b','c','d','e']);
      assert.deepEqual(this.negotiator.encodings(['c','d','e','b'], serverPreference), ['c','d','e','b']);
      assert.deepEqual(this.negotiator.encodings(['d','e','b','c'], serverPreference), ['d','e','b','c']);
      assert.deepEqual(this.negotiator.encodings(['e','b','c','d'], serverPreference), ['e','b','c','d']);

      assert.deepEqual(this.negotiator.encodings(['a','c','e'], serverPreference), ['a', 'c', 'e']);
      assert.deepEqual(this.negotiator.encodings(['c','e','a'], serverPreference), ['c', 'e', 'a']);
      assert.deepEqual(this.negotiator.encodings(['e','a','c'], serverPreference), ['e', 'a', 'c']);

      assert.deepEqual(this.negotiator.encodings(['identity','e','f'], serverPreference), ['identity', 'e']);
      assert.deepEqual(this.negotiator.encodings(['f','identity','e'], serverPreference), ['identity', 'e']);
      assert.deepEqual(this.negotiator.encodings(['e','f','identity'], serverPreference), ['e','identity']);
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

function whenAcceptEncoding(acceptEncoding, func) {
  var description = !acceptEncoding
    ? 'when no Accept-Encoding'
    : 'when Accept-Encoding: ' + acceptEncoding

  describe(description, function () {
    before(function () {
      this.negotiator = new Negotiator(createRequest({'Accept-Encoding': acceptEncoding}))
    })

    func()
  })
}
