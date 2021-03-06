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

if (typeof global.__REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined') {
  global.__REACT_DEVTOOLS_GLOBAL_HOOK__._relayInternals = require('./RelayInternals');
}

/**
 * Relay contains the set of public methods used to initialize and orchestrate
 * a React application that uses GraphQL to declare data dependencies.
 */
var RelayPublic = {
  Environment: require('./RelayEnvironment'),
  GraphQLMutation: require('./RelayGraphQLMutation'),
  GraphQLStoreQueryResolver: require('./GraphQLStoreQueryResolver'),
  Mutation: require('./RelayMutation'),
  PropTypes: require('./RelayPropTypes'),
  QL: require('./RelayQL'),
  QueryConfig: require('./RelayQueryConfig'),
  ReadyStateRenderer: require('./RelayReadyStateRenderer'),
  RelayContainerProxy: require('./RelayContainerProxy'),
  Renderer: require('./RelayRenderer'),
  RootContainer: require('./RelayRootContainer'),
  Route: require('./RelayRoute'),
  Store: require('./RelayStore'),

  MutationTypes: require('relay-runtime').MutationTypes,
  RangeOperations: require('relay-runtime').RangeOperations,

  createContainer: require('./RelayContainer').create,
  createQuery: require('./createRelayQuery'),
  getQueries: require('./getRelayQueries'),
  injectNetworkLayer: require('./RelayStore').injectNetworkLayer.bind(require('./RelayStore')),
  injectTaskScheduler: require('./RelayStore').injectTaskScheduler.bind(require('./RelayStore')),
  isContainer: require('./isRelayContainer')
};

module.exports = RelayPublic;