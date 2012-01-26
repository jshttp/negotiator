Negotiator = require('../lib/negotiator').Negotiator
http = require('http')

representations =
  'text/html': '<h1>Hello world!</h1>'
  'text/plain': 'Hello World!'
  'application/json': JSON.stringify({hello: 'world!'})

availableMediaTypes = (key for key, val of representations)

server = http.createServer (req, res) ->
  negotiator = new Negotiator(req)

  console.log "Accept: #{req.headers['accept']}"
  console.log "Preferred: #{negotiator.preferredMediaTypes()}"
  console.log "Possible: #{negotiator.preferredMediaTypes(availableMediaTypes)}"
  mediaType = negotiator.preferredMediaType(availableMediaTypes)
  console.log "Selected: #{mediaType}"

  if mediaType
    res.writeHead(200, {'Content-Type': mediaType})
    res.end(representations[mediaType])
  else
    res.writeHead(406)
    res.end()

server.listen(8080)
