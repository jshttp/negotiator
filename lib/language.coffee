_ = require('underscore')

parseAcceptLanguage = (accept) ->
  acceptableLanguages = accept.split(',').map (e) -> parseLanguage(e.trim())
  _.select(acceptableLanguages, (e) -> e && e.q > 0)

parseLanguage = (s) ->
  match = /^\s*(\S+?)(?:-(\S+?))?\s*(?:;(.*))?$/.exec(s)
  if !match
    null
  else
    prefix = match[1]
    suffix = match[2]
    full = prefix
    full += "-#{suffix}" if suffix
    params = {}
    q = 1
    if match[3]
      for p in match[3].split(';').map((s) -> s.trim().split('='))
        params[p[0]] = p[1]
      if params.q?
        q = parseFloat(params.q)
        delete params.q
    {prefix: prefix, suffix: suffix, params: params, q: q, full: full}

getLanguagePriority = (language, accepted) ->
  match = getClosestMatch(language, accepted)
  match?.q || 0

getClosestMatch = (language, accepted) ->
  parsed = parseLanguage(language)
  matches = _.select(accepted, (a) -> (a.full == parsed.full))
  return matches[0] unless matches.length == 0
  matches = _.select(accepted, (a) -> a.prefix == parsed.prefix && !a.suffix)
  return matches[0] unless matches.length == 0
  matches = _.select(accepted, (a) -> a.prefix == parsed.prefix)
  return matches[0] unless matches.length == 0
  matches = _.select(accepted, (a) -> a.prefix == '*')
  return matches[0]

preferredLanguages = (accept, provided) ->
  accept = parseAcceptLanguage(accept || '')
  if provided
    _.chain(provided)
      .map((type) -> [type, getLanguagePriority(type, accept)])
      .select((pair) -> pair[1] > 0)
      .sortBy((pair) -> pair[1] * -1)
      .map((pair) -> pair[0])
      .value()
  else
    accept.map((type) -> type.full)

exports.preferredLanguages = preferredLanguages
