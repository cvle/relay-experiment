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

var RelayEnvironmentSerializer = {
  serialize: function serialize(relayEnvironment) {
    return JSON.stringify(relayEnvironment.getStoreData());
  },
  deserialize: function deserialize(str) {
    return new (require('./RelayEnvironment'))(require('./RelayStoreData').fromJSON(JSON.parse(str)));
  }
};

module.exports = RelayEnvironmentSerializer;