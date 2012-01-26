Negotiator = require('../lib/negotiator').Negotiator
http = require('http')

messages =
  es: "¡Hola Mundo!",
  en: "Hello World!"

availableLanguages = (key for key, val of messages)

server = http.createServer (req, res) ->
  negotiator = new Negotiator(req )

  console.log "Accept-Language: #{req.headers['accept-language']}"
  console.log "Preferred: #{negotiator.preferredLanguages()}"
  console.log "Possible: #{negotiator.preferredLanguages(availableLanguages)}"
  language = negotiator.preferredLanguage(availableLanguages)
  console.log "Selected: #{language}"

  if language
    res.writeHead(200, {'Content-Language': language})
    res.end(messages[language])
  else
    res.writeHead(406)
    res.end()

server.listen(8080)
