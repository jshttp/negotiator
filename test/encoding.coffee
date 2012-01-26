preferredEncodings = require('../lib/encoding').preferredEncodings

@["Should return identity encoding when no encoding is provided"] = (test) ->
  test.deepEqual(preferredEncodings(null), ['identity'])
  test.done()

@["Should include the identity encoding even if not explicity listed"] = (test) ->
  test.ok(preferredEncodings('gzip').indexOf('identity') != -1)
  test.done()

@["Should not return identity encoding if q = 0"] = (test) ->
  test.ok(preferredEncodings('identity;q=0').indexOf('identity') == -1)
  test.done()

testCorrectEncoding = (c) =>
  @["Should return #{c.selected} for accept-encoding header #{c.accept} with provided encoding #{c.provided}"] = (test) ->
    test.deepEqual(preferredEncodings(c.accept, c.provided), c.selected)
    test.done()

testConfigurations =
  [{
    accept: 'gzip'
    provided: ['identity', 'gzip']
    selected: ['gzip', 'identity']
  },{
    accept: 'gzip, compress'
    provided: ['compress']
    selected: ['compress']
  },{
    accept: '*'
    provided: ['identity', 'gzip']
    selected: ['identity', 'gzip']
  },{
    accept: 'gzip, compress'
    provided: ['compress', 'identity']
    selected: ['compress', 'identity']
  },{
    accept: 'gzip;q=0.8, identity;q=0.5, *;q=0.3'
    provided: ['identity', 'gzip', 'compress']
    selected: ['gzip', 'identity', 'compress']
  },{
    accept: 'gzip;q=0.8, compress'
    provided: ['gzip', 'compress']
    selected: ['compress', 'gzip']
  }]


for configuration in testConfigurations
  testCorrectEncoding(configuration)

