preferredLanguages = require('./language').preferredLanguages
preferredMediaTypes = require('./mediaType').preferredMediaTypes
preferredCharsets = require('./charset').preferredCharsets
preferredEncodings = require('./encoding').preferredEncodings

class Negotiator
  constructor: (@request) ->

  preferredLanguages: (availableLanguages) ->
    preferredLanguages(@request.headers['accept-language'], availableLanguages)

  preferredLanguage: (availableLanguages) ->
    @preferredLanguages(availableLanguages)?[0]

  preferredMediaTypes: (availableMediaTypes) ->
    preferredMediaTypes(@request.headers['accept'], availableMediaTypes)

  preferredMediaType: (availableMediaTypes) ->
    @preferredMediaTypes(availableMediaTypes)?[0]

  preferredCharsets: (availableCharsets) ->
    preferredCharsets(@request.headers['accept-charset'], availableCharsets)

  preferredCharset: (availableCharsets) ->
    @preferredCharsets(availableCharsets)?[0]

  preferredEncodings: (availableEncodings) ->
    preferredEncodings(@request.headers['accept-encoding'], availableEncodings)

  preferredEncoding: (availableEncodings) ->
    @preferredEncodings(availableEncodings)?[0]

exports.Negotiator = Negotiator
