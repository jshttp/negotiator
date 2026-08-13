import { bench, describe } from 'vitest'
import Negotiator from '../index.js'

const complexAcceptEncoding = 'br, gzip;q=0.9, deflate;q=0.8, zstd;q=0.7, compress;q=0.5, identity;q=0.1, *;q=0.05'
const providedEncodings = [
  'br',
  'gzip',
  'deflate',
  'zstd',
  'compress',
  'identity'
]

function createNegotiator(acceptEncoding) {
  return new Negotiator({ headers: { 'accept-encoding': acceptEncoding } })
}

describe('Accept-Encoding header', () => {
  const simple = createNegotiator('gzip, deflate;q=0.5, *;q=0.1')
  const complex = createNegotiator(complexAcceptEncoding)

  bench('parse a simple header', () => {
    simple.encodings()
  })

  bench('parse a complex header', () => {
    complex.encodings()
  })

  bench('negotiate provided encodings', () => {
    complex.encodings(providedEncodings)
  })

  bench('select the preferred encoding', () => {
    complex.encoding(providedEncodings)
  })
})
