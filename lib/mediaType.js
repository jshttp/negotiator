module.exports = preferredMediaTypes;
preferredMediaTypes.preferredMediaTypes = preferredMediaTypes;

function parseAccept(accept) {
  return accept.split(',').map(function(e) {
    return parseMediaType(e.trim());
  }).filter(function(e) {
    return e;
  });
};

function parseMediaType(s) {
  var match = s.match(/\s*(\S+)\/([^;\s]+)\s*(?:;(.*))?/);
  if (!match) return null;

  var type = match[1],
      subtype = match[2],
      full = "" + type + "/" + subtype,
      params = {},
      q = 1;

  if (match[3]) {
    params = match[3].split(';').map(function(s) {
      return s.trim().split('=');
    }).reduce(function (set, p) {
      set[p[0]] = p[1];
      return set
    }, params);

    if (params.q != null) {
      q = parseFloat(params.q);
      delete params.q;
    }
  }

  return {
    type: type,
    subtype: subtype,
    params: params,
    q: q,
    full: full
  };
}

function getMediaTypePriority(type, accepted) {
  return (accepted.map(function(a, i) {
    return specify(type, a, i);
  }).filter(Boolean).sort(function (a, b) {
    if (a.s !== b.s) {
      return b.s - a.s;
    }

    if (a.i !== b.i) {
      return a.i - b.i;
    }

    return 0;
  }))[0];
}

function specify(type, spec, i) {
  var p = parseMediaType(type);
  var s = 0;
  if(spec.type == p.type) {
    s |= 4
  } else if(spec.type != '*') {
    return null;
  }

  if(spec.subtype == p.subtype) {
    s |= 2
  } else if(spec.subtype != '*') {
    return null;
  }


  if (spec.params) {
    var keys = Object.keys(spec.params);
    if (keys.some(function (k) {
      return spec.params[k] == '*' || spec.params[k] == p.params[k];
    })) {
      return null;
    } else {
      s |= 1;
    }
  }

  return {
    i: i,
    q: spec.q,
    s: s,
  }

}

function preferredMediaTypes(accept, provided) {
  accept = parseAccept(accept || '');
  if (provided) {
    return provided.map(function(type) {
      return [type, getMediaTypePriority(type, accept)];
    }).filter(function(pair) {
      return pair[1] && pair[1].q;
    }).sort(function(a, b) {
      // priority
      if (a[1].q !== b[1].q) {
        return b[1].q - a[1].q;
      }

      // precedence in `Accept` header, not in `provided` value
      // it's very important
      if (a[1].i !== b[1].i) {
        return a[1].i - b[1].i;
      }

      return 0;
    }).map(function(pair) {
      return pair[0];
    });

  } else {
    return accept.sort(function (a, b) {
      // revsort
      return a.q < b.q ? 1 : -1;
    }).filter(function(type) {
      return type.q > 0;
    }).map(function(type) {
      return type.full;
    });
  }
}


