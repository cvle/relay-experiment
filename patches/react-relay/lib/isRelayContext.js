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
 * Determine if the input is a plain object that matches the `RelayContext`
 * type defined in `RelayEnvironmentTypes`.
 */
function isRelayContext(context) {
  return typeof context === 'object' && context !== null && !Array.isArray(context) && require('./isRelayEnvironment')(context.environment) && require('./isRelayVariables')(context.variables);
}

module.exports = isRelayContext;