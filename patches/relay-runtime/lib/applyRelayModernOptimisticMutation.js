/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule applyRelayModernOptimisticMutation
 * 
 * @format
 */

'use strict';

/**
 * Higher-level helper function to execute a mutation against a specific
 * environment.
 */
function applyRelayModernOptimisticMutation(environment, config) {
  require('fbjs/lib/invariant')(require('./isRelayModernEnvironment')(environment), 'commitRelayModernMutation: expect `environment` to be an instance of ' + '`RelayModernEnvironment`.');
  var _environment$unstable = environment.unstable_internal,
      createOperationSelector = _environment$unstable.createOperationSelector,
      getRequest = _environment$unstable.getRequest;

  var mutation = getRequest(config.mutation);
  if (mutation.operationKind !== 'mutation') {
    throw new Error('commitRelayModernMutation: Expected mutation operation');
  }
  var optimisticUpdater = config.optimisticUpdater;
  var configs = config.configs,
      optimisticResponse = config.optimisticResponse,
      variables = config.variables;

  var operation = createOperationSelector(mutation, variables);
  if (configs) {
    var _RelayDeclarativeMuta = require('./RelayDeclarativeMutationConfig').convert(configs, mutation, optimisticUpdater);

    optimisticUpdater = _RelayDeclarativeMuta.optimisticUpdater;
  }

  return environment.applyUpdate({
    operation: operation,
    selectorStoreUpdater: optimisticUpdater,
    response: optimisticResponse
  });
}

module.exports = applyRelayModernOptimisticMutation;