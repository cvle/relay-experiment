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

var _require = require('relay-runtime'),
    isRelayModernEnvironment = _require.isRelayModernEnvironment;

/**
 * Determine if the object is a plain object that matches the `RelayContext`
 * type.
 */


function isRelayModernContext(context) {
  return typeof context === 'object' && context !== null && !Array.isArray(context) && isRelayModernEnvironment(context.environment) && require('./isRelayVariables')(context.variables);
}

module.exports = isRelayModernContext;