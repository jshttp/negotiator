Negotiator = require('../lib/negotiator').Negotiator
http = require('http')

gbuf = require('gzip-buffer')

messages =
  identity: 'Hello World'

gbuf.gzip messages.identity, (zipped) ->
  messages.gzip = zipped

  availableEncodings = (key for key, val of messages)
  console.log availableEncodings

  server = http.createServer (req, res) ->
    negotiator = new Negotiator(req)

    console.log "Accept-Encoding: #{req.headers['accept-encoding']}"
    console.log "Preferred: #{negotiator.preferredEncodings()}"
    console.log "Possible: #{negotiator.preferredEncodings(availableEncodings)}"
    encoding = negotiator.preferredEncoding(availableEncodings)
    console.log "Selected: #{encoding}"

    if encoding
      res.writeHead(200, {'Content-Encoding': encoding})
      res.end(messages[encoding])
    else
      res.writeHead(406)
      res.end()

  server.listen(8080)
