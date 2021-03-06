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

var ReactRelayPropTypes = {
  Relay: function Relay(props, propName, componentName) {
    var relay = props[propName];
    if (!require('./isRelayModernContext')(relay)) {
      return new Error(require('fbjs/lib/sprintf')('Invalid prop/context `%s` supplied to `%s`, expected `%s` to be ' + 'an object with an `environment` and `variables`.', propName, componentName, relay));
    }
    return null;
  }
};

module.exports = ReactRelayPropTypes;