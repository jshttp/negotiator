_ = require('underscore')

parseAccept = (accept) ->
  acceptableTypes = accept.split(',').map (e) -> parseMediaType(e.trim())
  _.select(acceptableTypes, (e) -> e && e.q > 0)

parseMediaType = (s) ->
  match = /\s*(\S+)\/([^;\s]+)\s*(?:;(.*))?/.exec(s)
  if !match
    null
  else
    type = match[1]
    subtype = match[2]
    full = "#{type}/#{subtype}"
    params = {}
    q = 1
    if match[3]
      for p in match[3].split(';').map((s) -> s.trim().split('='))
        params[p[0]] = p[1]
      if params.q?
        q = parseFloat(params.q)
        delete params.q
    {type: type, subtype: subtype, params: params, q: q, full: full}

getMediaTypePriority = (type, accepted) ->
  specs = accepted.map (a) -> specify(type, a)
  specs = _.select(specs, (x) -> x)
  _.max(specs, (spec) -> spec.q)?.q || 0

specifies = (spec, type) ->
  spec == '*' || spec == type

specify = (type, spec) ->
  p = parseMediaType(type)
  spec if specifies(spec.type, p.type) &&
    specifies(spec.subtype, p.subtype) &&
    _.all(spec.params, (k, v) -> specifies(v, p.params[k]))

preferredMediaTypes = (accept, provided) ->
  accept = parseAccept(accept || '')
  if provided
    _.chain(provided)
      .map((type) -> [type, getMediaTypePriority(type, accept)])
      .select((pair) -> pair[1] > 0)
      .sortBy((pair) -> pair[1] * -1)
      .map((pair) -> pair[0])
      .value()
  else
    accept.map((type) -> type.full)

exports.preferredMediaTypes = preferredMediaTypes
