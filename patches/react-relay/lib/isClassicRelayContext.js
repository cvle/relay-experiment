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
 * Determine if a given value is an object that implements the `RelayContext`
 * interface.
 */
function isClassicRelayContext(relay) {
  return typeof relay === 'object' && relay !== null && !Array.isArray(relay) && require('./isClassicRelayEnvironment')(relay.environment) && require('./isRelayVariables')(relay.variables);
}

module.exports = isClassicRelayContext;