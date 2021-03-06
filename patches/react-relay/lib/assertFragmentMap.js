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
 * Fail fast if the user supplies invalid fragments as input.
 */
function assertFragmentMap(componentName, fragments) {
  require('fbjs/lib/invariant')(fragments && typeof fragments === 'object', 'Could not create Relay Container for `%s`. ' + 'Expected a set of GraphQL fragments, got `%s` instead.', componentName, fragments);

  for (var key in fragments) {
    if (fragments.hasOwnProperty(key)) {
      var fragment = fragments[key];
      require('fbjs/lib/invariant')(fragment && (typeof fragment === 'object' || typeof fragment === 'function'), 'Could not create Relay Container for `%s`. ' + 'The value of fragment `%s` was expected to be a fragment, got `%s` instead.', componentName, key, fragment);
    }
  }
}

module.exports = assertFragmentMap;