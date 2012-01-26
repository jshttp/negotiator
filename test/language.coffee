preferredLanguages = require('../lib/language').preferredLanguages

@["Should not return a language when no is provided"] = (test) ->
  test.deepEqual(preferredLanguages('*', []), [])
  test.done()

@["Should not return a language when no language is acceptable"] = (test) ->
  test.deepEqual(preferredLanguages('en', ['es']), [])
  test.done()

@["Should not return a language with q = 0"] = (test) ->
  test.deepEqual(preferredLanguages('en;q=0', ['en']), [])
  test.done()


testCorrectType = (c) =>
  @["Should return #{c.selected} for accept-language header #{c.accept} with provided language #{c.provided}"] = (test) ->
    test.deepEqual(preferredLanguages(c.accept, c.provided), c.selected)
    test.done()

testConfigurations =
  [{
    accept: 'en'
    provided: ['en']
    selected: ['en']
  },{
    accept: '*'
    provided: ['en']
    selected: ['en']
  },{
    accept: 'en-US, en;q=0.8'
    provided: ['en-US', 'en-GB']
    selected: ['en-US', 'en-GB']
  },{
    accept: 'en-US, en-GB'
    provided: ['en-US']
    selected: ['en-US']
  },{
    accept: 'en'
    provided: ['en-US']
    selected: ['en-US']
  },{
    accept: 'en;q=0.8, es'
    provided: ['en', 'es']
    selected: ['es', 'en']
  },{
    accept: 'en-US;q=0.8, es'
    provided: ['en', 'es']
    selected: ['es', 'en']
  }]


for configuration in testConfigurations
  testCorrectType(configuration)
  
