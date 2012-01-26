Negotiator = require('../lib/negotiator').Negotiator
http = require('http')

Buffer = require('buffer').Buffer
Iconv  = require('iconv').Iconv

iconv = new Iconv('UTF-8', 'ISO-8859-1')
message = "ë"
messages =
  'utf-8': message
  'iso-8859-1': iconv.convert(new Buffer(message))

availableCharsets = (key for key, val of messages)

server = http.createServer (req, res) ->
  negotiator = new Negotiator(req )

  console.log "Accept-Charset: #{req.headers['accept-charset']}"
  console.log "Preferred: #{negotiator.preferredCharsets()}"
  console.log "Possible: #{negotiator.preferredCharsets(availableCharsets)}"
  charset = negotiator.preferredCharset(availableCharsets)
  console.log "Selected: #{charset}"

  if charset
    res.writeHead(200, {'Content-Type': "text/html; charset=#{charset}"})
    res.end(messages[charset])
  else
    res.writeHead(406)
    res.end()

server.listen(8080)
