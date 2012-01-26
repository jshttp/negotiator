preferredCharsets = require('../lib/charset').preferredCharsets

@["Should not return a charset when no charset is provided"] = (test) ->
  test.deepEqual(preferredCharsets('*', []), [])
  test.done()

@["Should not return a charset when no charset is acceptable"] = (test) ->
  test.deepEqual(preferredCharsets('ISO-8859-1', ['utf-8']), [])
  test.done()

@["Should not return a charset with q = 0"] = (test) ->
  test.deepEqual(preferredCharsets('utf-8;q=0', ['utf-8']), [])
  test.done()

testCorrectCharset = (c) =>
  @["Should return #{c.selected} for accept-charset header #{c.accept} with provided charset #{c.provided}"] = (test) ->
    test.deepEqual(preferredCharsets(c.accept, c.provided), c.selected)
    test.done()

testConfigurations =
  [{
    accept: 'utf-8'
    provided: ['utf-8']
    selected: ['utf-8']
  },{
    accept: '*'
    provided: ['utf-8']
    selected: ['utf-8']
  },{
    accept: 'utf-8'
    provided: ['utf-8', 'ISO-8859-1']
    selected: ['utf-8']
  },{
    accept: 'utf-8, ISO-8859-1'
    provided: ['utf-8']
    selected: ['utf-8']
  },{
    accept: 'utf-8;q=0.8, ISO-8859-1'
    provided: ['utf-8', 'ISO-8859-1']
    selected:[ 'ISO-8859-1', 'utf-8']
  }]


for configuration in testConfigurations
  testCorrectCharset(configuration)

