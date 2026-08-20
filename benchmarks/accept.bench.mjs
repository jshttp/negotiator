import { bench, describe } from 'vitest'
import Negotiator from '../index.js'

const complexAccept = 'text/plain, application/json;q=0.5, text/html, text/xml, text/yaml, text/javascript, text/csv, text/css, text/rtf, text/markdown, application/octet-stream;q=0.2, */*;q=0.1'
const providedMediaTypes = [
  'text/html',
  'text/plain',
  'application/json',
  'application/xml',
  'image/jpeg',
  'image/png',
  'video/mp4',
  'application/octet-stream'
]

function createNegotiator(accept) {
  return new Negotiator({ headers: { accept } })
}

describe('Accept header', () => {
  const simple = createNegotiator('text/html, application/json;q=0.5, */*;q=0.1')
  const complex = createNegotiator(complexAccept)
  const commas = createNegotiator('x;p="' + ','.repeat(100_000) + '"')

  bench('parse a simple header', () => {
    simple.mediaTypes()
  })

  bench('parse a complex header', () => {
    complex.mediaTypes()
  })

  bench('parse a pathological header', () => {
    commas.mediaTypes()
  })

  bench('negotiate provided media types', () => {
    complex.mediaTypes(providedMediaTypes)
  })

  bench('select the preferred media type', () => {
    complex.mediaType(providedMediaTypes)
  })
})
