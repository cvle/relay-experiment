/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */

'use strict';

/* eslint-disable no-bitwise */

var PREFIX = '_';

/**
 * @internal
 *
 * Sanitizes a stringified GraphQL field (including any calls and their values)
 * to produce a valid alias.
 *
 * This is used to auto-alias fields in generated queries, so that developers
 * composing multiple components together don't have to worry about collisions
 * between components requesting the same fields. (Explicit aliases are only
 * needed within a single component when it uses the same field multiple times,
 * in order to differentiate these fields in the props).
 */
function generateRQLFieldAlias(input) {
  // Field names with no calls can be used as aliases without encoding
  var index = input.indexOf('.');
  if (index === -1) {
    return input;
  }
  // Unsign crc32 hash so we do not base62 encode a negative number.
  return PREFIX + input.substr(0, index) + require('fbjs/lib/base62')(require('fbjs/lib/crc32')(input) >>> 0);
}

module.exports = generateRQLFieldAlias;