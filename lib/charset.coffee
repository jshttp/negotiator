_ = require('underscore')

parseAcceptCharset = (accept) ->
  acceptableCharsets = accept.split(',').map (e) -> parseCharset(e.trim())
  _.select(acceptableCharsets, (e) -> e && e.q > 0)

parseCharset = (s) ->
  match = /^\s*(\S+?)\s*(?:;(.*))?$/.exec(s)
  if !match
    null
  else
    charset = match[1]
    params = {}
    q = 1
    if match[2]
      for p in match[2].split(';').map((s) -> s.trim().split('='))
        params[p[0]] = p[1]
      if params.q?
        q = parseFloat(params.q)
        delete params.q
    {charset: charset, q: q}

getCharsetPriority = (charset, accepted) ->
  specs = accepted.map (a) -> specify(charset, a)
  specs = _.select(specs, (x) -> x)
  _.max(specs, (spec) -> spec.q)?.q || 0

specify = (charset, spec) ->
  spec if spec.charset == '*' || spec.charset == charset

preferredCharsets = (accept, provided) ->
  accept = parseAcceptCharset(accept || '')
  if provided
    _.chain(provided)
      .map((type) -> [type, getCharsetPriority(type, accept)])
      .select((pair) -> pair[1] > 0)
      .sortBy((pair) -> pair[1] * -1)
      .map((pair) -> pair[0])
      .value()
  else
    accept.map((type) -> type.charset)

exports.preferredCharsets = preferredCharsets
