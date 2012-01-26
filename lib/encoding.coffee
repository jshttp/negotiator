_ = require('underscore')

parseAcceptEncoding = (accept) ->
  acceptableEncodings = if accept
    accept.split(',').map (e) -> parseEncoding(e.trim())
  else
    []
  acceptableEncodings.push({encoding: 'identity', q: 0.1}) unless _.find(acceptableEncodings, (e) -> e.encoding == 'identity')
  _.select(acceptableEncodings, (e) -> e && e.q > 0)

parseEncoding = (s) ->
  match = /^\s*(\S+?)\s*(?:;(.*))?$/.exec(s)
  if !match
    null
  else
    encoding = match[1]
    params = {}
    q = 1
    if match[2]
      for p in match[2].split(';').map((s) -> s.trim().split('='))
        params[p[0]] = p[1]
      if params.q?
        q = parseFloat(params.q)
        delete params.q
    {encoding: encoding, q: q}

getEncodingPriority = (encoding, accepted) ->
  specs = accepted.map (a) -> specify(encoding, a)
  specs = _.select(specs, (x) -> x)
  _.max(specs, (spec) -> spec.q)?.q || 0

specify = (encoding, spec) ->
  spec if spec.encoding == '*' || spec.encoding == encoding

preferredEncodings = (accept, provided) ->
  accept = parseAcceptEncoding(accept || '')
  if provided
    _.chain(provided)
      .map((type) -> [type, getEncodingPriority(type, accept)])
      .select((pair) -> pair[1] > 0)
      .sortBy((pair) -> pair[1] * -1)
      .map((pair) -> pair[0])
      .value()
  else
    accept.map((type) -> type.encoding)

exports.preferredEncodings = preferredEncodings
