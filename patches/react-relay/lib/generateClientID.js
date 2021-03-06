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

var _clientID = 1;
var _prefix = 'client:' + require('fbjs/lib/crc32')('' + require('fbjs/lib/performanceNow')());

/**
 * Generate a unique clientID for GraphQL data objects that do not already have
 * an ID or their ID = null
 *
 * @internal
 */
function generateClientID() {
  return _prefix + _clientID++;
}

module.exports = generateClientID;