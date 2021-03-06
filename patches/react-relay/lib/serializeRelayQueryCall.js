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

/**
 * @internal
 *
 * Serializes a query "call" (a classic combination of field and argument value).
 */
function serializeRelayQueryCall(call) {
  var value = call.value;

  var valueString = void 0;
  if (Array.isArray(value)) {
    valueString = require('fbjs/lib/flattenArray')(value).map(function (value) {
      return serializeCallValue(value);
    }).join(',');
  } else {
    valueString = serializeCallValue(value);
  }
  return '.' + call.name + '(' + valueString + ')';
}

function serializeCallValue(value) {
  if (value == null) {
    return '';
  } else if (typeof value !== 'string') {
    return JSON.stringify(value);
  } else {
    return value;
  }
}

module.exports = serializeRelayQueryCall;