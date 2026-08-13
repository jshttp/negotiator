import { bench, describe } from 'vitest'
import Negotiator from '../index.js'

const complexAcceptLanguage = 'en-US, en;q=0.9, es-ES;q=0.8, fr-FR;q=0.7, de-DE;q=0.6, ja-JP;q=0.5, zh-CN;q=0.4, *;q=0.1'
const providedLanguages = [
  'en-US',
  'en-GB',
  'es-ES',
  'fr-FR',
  'de-DE',
  'ja-JP',
  'zh-CN'
]

function createNegotiator(acceptLanguage) {
  return new Negotiator({ headers: { 'accept-language': acceptLanguage } })
}

describe('Accept-Language header', () => {
  const simple = createNegotiator('en-US, en;q=0.5, *;q=0.1')
  const complex = createNegotiator(complexAcceptLanguage)

  bench('parse a simple header', () => {
    simple.languages()
  })

  bench('parse a complex header', () => {
    complex.languages()
  })

  bench('negotiate provided languages', () => {
    complex.languages(providedLanguages)
  })

  bench('select the preferred language', () => {
    complex.language(providedLanguages)
  })
})
