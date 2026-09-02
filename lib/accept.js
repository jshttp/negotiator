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
    var typeEnd = contentType.parse(header, { comma: true, start: start, parameters: false }).index;

    // `content-type` normalizes the type, but accept methods return original
    // casing; slice to the parsed type boundary so lower-casing length changes
    // (e.g. "İ") don't shift the offset.
    parsed.type = trimTrailingWhitespace(header.slice(start, typeEnd));
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

/**
 * Trim trailing optional whitespace.
 * @private
 */

function trimTrailingWhitespace(str) {
  var end = str.length;

  while (end > 0 && (str.charCodeAt(end - 1) === 0x20 || str.charCodeAt(end - 1) === 0x09)) {
    end--;
  }

  return str.slice(0, end);
}
