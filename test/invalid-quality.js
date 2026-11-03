var assert = require('assert')
var Negotiator = require('..')

var headers = [
  { name: 'accept', method: 'mediaTypes', preferred: 'text/html', fallback: 'application/json' },
  { name: 'accept-language', method: 'languages', preferred: 'en', fallback: 'ru' },
  { name: 'accept-charset', method: 'charsets', preferred: 'utf-8', fallback: 'latin1' },
  { name: 'accept-encoding', method: 'encodings', preferred: 'gzip', fallback: 'br' }
]

describe('non-finite quality values', function () {
  headers.forEach(function (header) {
    describe(header.name, function () {
      ;['abc', 'NaN', 'Infinity', '-Infinity'].forEach(function (quality) {
        it('should ignore a duplicate with q=' + quality, function () {
          var values = {}
          values[header.name] = header.preferred + ';q=0.9, ' +
            header.fallback + ';q=0.5, ' + header.preferred + ';q=' + quality
          var negotiator = new Negotiator({ headers: values })
          assert.strictEqual(negotiator[header.method]()[0], header.preferred)
          assert.deepEqual(negotiator[header.method]([header.fallback, header.preferred]),
            [header.preferred, header.fallback])
          assert.deepEqual(negotiator[header.method]([header.preferred]), [header.preferred])
        })
      })

      it('should ignore a non-finite entry before a valid preference', function () {
        var values = {}
        values[header.name] = header.preferred + ';q=abc, ' + header.fallback + ';q=0.5'
        var negotiator = new Negotiator({ headers: values })
        assert.deepEqual(negotiator[header.method]([header.preferred, header.fallback]), [header.fallback])
      })

      it('should retain numeric zero-quality exclusions', function () {
        var values = {}
        values[header.name] = header.preferred + ';q=0, ' + header.fallback + ';q=0.5'
        var negotiator = new Negotiator({ headers: values })
        assert.deepEqual(negotiator[header.method]([header.preferred, header.fallback]), [header.fallback])
      })
    })
  })
})
