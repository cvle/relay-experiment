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

function createRelayQuery(node, variables) {
  require('fbjs/lib/invariant')(typeof variables === 'object' && variables != null && !Array.isArray(variables), 'Relay.Query: Expected `variables` to be an object.');
  return require('./RelayQuery').Root.create(node, require('./RelayMetaRoute').get('$createRelayQuery'), variables);
}

module.exports = createRelayQuery;