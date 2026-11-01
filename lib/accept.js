/*!
 * negotiator
 * Copyright(c) 2026 Blake Embrey
 * MIT Licensed
 */

'use strict';

var contentType = require('content-type');

/**
 * Module exports.
 * @private
 */

module.exports = parseAccept;

module.exports.isTokenText = isTokenText;

/**
 * Check whether a type only contains characters allowed inside a token in
 * RFC 9110 sec 5.6.2.
 *
 * A token can never be empty or contain whitespace or control characters, so
 * a member of an Accept-style header that does contain them is invalid and
 * must be ignored, matching the behavior of negotiator@1.0.x.
 * @private
 */
function isTokenText(type) {
  if (type === '') return false;

  for (var i = 0; i < type.length; i++) {
    var code = type.charCodeAt(i);
    if (code <= 32 || code === 127) return false;
  }

  return true;
}

/**
 * Parse an Accept-style header.
 * @private
 */

function parseAccept(header) {
  var values = [];
  var index = 0;

  while (index < header.length) {
    var start = skipOptionalWhitespace(header, index);
    var parsed = contentType.parse(header, { comma: true, start: start });

    // `content-type` normalizes the type, but accept methods return original casing.
    parsed.type = header.slice(start, start + parsed.type.length);
    values.push(parsed);

    index = parsed.index + 1;
  }

  return values;
}

/**
 * Skip optional whitespace.
 * @private
 */

function skipOptionalWhitespace(header, index) {
  var cursor = index;

  while (header.charCodeAt(cursor) === 0x20 || header.charCodeAt(cursor) === 0x09) {
    cursor++;
  }

  return cursor;
}
