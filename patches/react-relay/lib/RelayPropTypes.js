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

var RelayPropTypes = {
  Container: function Container(props, propName, componentName) {
    var component = props[propName];
    if (component == null) {
      return new Error(require('fbjs/lib/sprintf')('Required prop `%s` was not specified in `%s`.', propName, componentName));
    } else if (!require('./isRelayContainer')(component)) {
      return new Error(require('fbjs/lib/sprintf')('Invalid prop `%s` supplied to `%s`, expected a RelayContainer.', propName, componentName));
    }
    return null;
  },
  Environment: function Environment(props, propName, componentName) {
    var context = props[propName];
    if (!require('./isClassicRelayEnvironment')(context) || !require('./isRelayEnvironment')(context)) {
      return new Error(require('fbjs/lib/sprintf')('Invalid prop/context `%s` supplied to `%s`, expected `%s` to be ' + 'an object conforming to the `RelayEnvironment` interface.', propName, componentName, context));
    }
    return null;
  },


  QueryConfig: require('prop-types').shape({
    name: require('prop-types').string.isRequired,
    params: require('prop-types').object.isRequired,
    queries: require('prop-types').object.isRequired
  }),

  ClassicRelay: function ClassicRelay(props, propName, componentName) {
    var relay = props[propName];
    if (!require('./isRelayContext')(relay) || !require('./isClassicRelayEnvironment')(relay.environment)) {
      return new Error(require('fbjs/lib/sprintf')('Invalid prop/context `%s` supplied to `%s`, expected `%s` to be ' + 'an object with a classic `environment` implementation and `variables`.', propName, componentName, relay));
    }
    return null;
  },
  Relay: function Relay(props, propName, componentName) {
    var relay = props[propName];
    if (!require('./isRelayContext')(relay)) {
      return new Error(require('fbjs/lib/sprintf')('Invalid prop/context `%s` supplied to `%s`, expected `%s` to be ' + 'an object with an `environment` and `variables`.', propName, componentName, relay));
    }
    return null;
  }
};

module.exports = RelayPropTypes;