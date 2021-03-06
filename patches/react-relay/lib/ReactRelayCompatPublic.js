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
 * The public interface to React Relay which supports a compatibility mode to
 * continue to work with the classic Relay runtime.
 */
module.exports = {
  QueryRenderer: require('./ReactRelayQueryRenderer'),

  MutationTypes: require('relay-runtime').MutationTypes,
  RangeOperations: require('relay-runtime').RangeOperations,

  applyOptimisticMutation: require('./RelayCompatMutations').applyUpdate,
  commitMutation: require('./RelayCompatMutations').commitUpdate,
  createFragmentContainer: require('./RelayCompatContainer').createContainer,
  createPaginationContainer: require('./RelayCompatPaginationContainer').createContainer,
  createRefetchContainer: require('./RelayCompatRefetchContainer').createContainer,
  fetchQuery: require('relay-runtime').fetchQuery,
  graphql: require('relay-runtime').graphql,

  injectDefaultVariablesProvider: require('./ReactRelayCompatContainerBuilder').injectDefaultVariablesProvider
};