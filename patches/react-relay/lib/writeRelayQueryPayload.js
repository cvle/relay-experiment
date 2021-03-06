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

var _require = require('relay-runtime'),
    RelayProfiler = _require.RelayProfiler;

var ID = require('./RelayNodeInterface').ID;

/**
 * @internal
 *
 * Traverses a query and payload in parallel, writing the results into the
 * store.
 */


function writeRelayQueryPayload(writer, query, payload) {
  var store = writer.getRecordStore();
  var recordWriter = writer.getRecordWriter();
  var path = require('./RelayQueryPath').create(query);

  require('./RelayNodeInterface').getResultsFromPayload(query, payload).forEach(function (_ref) {
    var result = _ref.result,
        rootCallInfo = _ref.rootCallInfo;
    var storageKey = rootCallInfo.storageKey,
        identifyingArgKey = rootCallInfo.identifyingArgKey;


    var dataID = void 0;
    if (typeof result === 'object' && result && typeof result[ID] === 'string') {
      dataID = result[ID];
    }

    if (dataID == null) {
      dataID = store.getDataID(storageKey, identifyingArgKey) || require('./generateClientID')();
    }

    recordWriter.putDataID(storageKey, identifyingArgKey, dataID);
    writer.writePayload(query, dataID, result, path);
  });
}

module.exports = RelayProfiler.instrument('writeRelayQueryPayload', writeRelayQueryPayload);