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
 * Runtime function to correspond to the `graphql` tagged template function.
 * All calls to this function should be transformed by the plugin.
 */
function graphql() {
  require('fbjs/lib/invariant')(false, 'graphql: Unexpected invocation at runtime. Either the Babel transform ' + 'was not set up, or it failed to identify this call site. Make sure it ' + 'is being used verbatim as `graphql`.');
}

function getClassicFragment(taggedNode) {
  return require('./RelayQL').__getClassicFragment(taggedNode);
}

function getClassicOperation(taggedNode) {
  return require('./RelayQL').__getClassicOperation(taggedNode);
}

module.exports = {
  getClassicFragment: getClassicFragment,
  getClassicOperation: getClassicOperation,
  graphql: graphql
};