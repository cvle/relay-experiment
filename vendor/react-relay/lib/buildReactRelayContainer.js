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

var _require = require('./RelayContainerUtils'),
    getComponentName = _require.getComponentName,
    getContainerName = _require.getContainerName;

var containerContextTypes = {
  relay: require('./RelayPropTypes').Relay
};

/**
 * Creates a component class whose instances adapt to the
 * `context.relay.environment` in which they are rendered and which have the
 * necessary static methods (`getFragment()` etc) to be composed within classic
 * `Relay.Containers`.
 */
function buildReactRelayContainer(ComponentClass, fragmentSpec, createContainerWithFragments) {
  // Sanity-check user-defined fragment input
  var containerName = getContainerName(ComponentClass);
  require('./assertFragmentMap')(getComponentName(ComponentClass), fragmentSpec);

  // Memoize a container for the last environment instance encountered
  var environment = void 0;
  var Container = void 0;
  function ContainerConstructor(props, context) {
    if (Container == null || context.relay.environment !== environment) {
      environment = context.relay.environment;
      if (process.env.NODE_ENV !== 'production') {
        var _require2 = require('relay-runtime'),
            isRelayModernEnvironment = _require2.isRelayModernEnvironment;

        if (!isRelayModernEnvironment(environment)) {
          throw new Error('RelayModernContainer: Can only use Relay Modern component ' + (containerName + ' in a Relay Modern environment!\n') + 'When using Relay Modern and Relay Classic in the same ' + 'application, ensure components use Relay Compat to work in ' + 'both environments.\n' + 'See: http://facebook.github.io/relay/docs/relay-compat.html');
        }
      }
      var getFragmentFromTag = environment.unstable_internal.getFragment;

      var _fragments = require('fbjs/lib/mapObject')(fragmentSpec, getFragmentFromTag);
      Container = createContainerWithFragments(ComponentClass, _fragments);
    }
    /* $FlowFixMe(>=0.53.0) This comment suppresses an
     * error when upgrading Flow's support for React. Common errors found when
     * upgrading Flow's React support are documented at
     * https://fburl.com/eq7bs81w */
    return new Container(props, context);
  }
  ContainerConstructor.contextTypes = containerContextTypes;
  ContainerConstructor.displayName = containerName;

  if (process.env.NODE_ENV !== 'production') {
    ContainerConstructor.__ComponentClass = ComponentClass;
    // Classic container static methods.
    ContainerConstructor.getFragment = function getFragmentOnModernContainer() {
      throw new Error('RelayModernContainer: ' + containerName + '.getFragment() was called on ' + 'a Relay Modern component by a Relay Classic or Relay Compat ' + 'component.\n' + 'When using Relay Modern and Relay Classic in the same ' + 'application, ensure components use Relay Compat to work in ' + 'both environments.\n' + 'See: http://facebook.github.io/relay/docs/relay-compat.html');
    };
  }

  return ContainerConstructor;
}

module.exports = buildReactRelayContainer;