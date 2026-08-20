import { bench, describe } from 'vitest'
import Negotiator from '../index.js'

const complexAcceptCharset = 'utf-8, iso-8859-1;q=0.8, utf-7;q=0.2, iso-8859-5;q=0.6, utf-16;q=0.4, us-ascii;q=0.1, *;q=0.05'
const providedCharsets = [
  'utf-8',
  'utf-16',
  'iso-8859-1',
  'iso-8859-5',
  'us-ascii',
  'windows-1252'
]

function createNegotiator(acceptCharset) {
  return new Negotiator({ headers: { 'accept-charset': acceptCharset } })
}

describe('Accept-Charset header', () => {
  const simple = createNegotiator('utf-8, iso-8859-1;q=0.5, *;q=0.1')
  const complex = createNegotiator(complexAcceptCharset)

  bench('parse a simple header', () => {
    simple.charsets()
  })

  bench('parse a complex header', () => {
    complex.charsets()
  })

  bench('negotiate provided charsets', () => {
    complex.charsets(providedCharsets)
  })

  bench('select the preferred charset', () => {
    complex.charset(providedCharsets)
  })
})
