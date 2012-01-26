preferredMediaTypes = require('../lib/mediaType').preferredMediaTypes

@["Should not return a media type when no media type provided"] = (test) ->
  test.deepEqual(preferredMediaTypes('*/*', []), [])
  test.done()

@["Should not return a media type when no media type is acceptable"] = (test) ->
  test.deepEqual(preferredMediaTypes('application/json', ['text/html']), [])
  test.done()

@["Should not return a media type with q = 0"] = (test) ->
  test.deepEqual(preferredMediaTypes('text/html;q=0', ['text/html']), [])
  test.done()


testCorrectType = (c) =>
  @["Should return #{c.selected} for access header #{c.accept} with provided types #{c.provided}"] = (test) ->
    test.deepEqual(preferredMediaTypes(c.accept, c.provided), c.selected)
    test.done()

testConfigurations =
  [{
    accept: 'text/html'
    provided: ['text/html']
    selected: ['text/html']
  },{
    accept: '*/*'
    provided: ['text/html']
    selected: ['text/html']
  },{
    accept: 'text/*'
    provided: ['text/html']
    selected: ['text/html']
  },{
    accept: 'application/json, text/html'
    provided: ['text/html']
    selected: ['text/html']
  },{
    accept: 'text/html;q=0.1'
    provided: ['text/html']
    selected: ['text/html']
  },{
    accept: 'application/json, text/html'
    provided: ['application/json', 'text/html']
    selected: ['application/json', 'text/html']
  },{
    accept: 'application/json;q=0.2, text/html'
    provided: ['application/json', 'text/html']
    selected: ['text/html', 'application/json']
  }]


for configuration in testConfigurations
  testCorrectType(configuration)

