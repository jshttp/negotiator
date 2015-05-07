
var assert = require('assert')
var Negotiator = require('..')

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
      assert.deepEqual(this.negotiator.encodings(['compress', 'gzip']), ['gzip', 'compress'])
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
  })

  whenAcceptEncoding('gzip;q=0.8, identity;q=0.5, *;q=0.3', function () {
    it('should return client-preferred encodings', function () {
      assert.deepEqual(this.negotiator.encodings(['gzip']), ['gzip'])
      assert.deepEqual(this.negotiator.encodings(['identity', 'gzip', 'compress']), ['gzip', 'identity', 'compress'])
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
