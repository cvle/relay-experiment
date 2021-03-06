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

var _extends3 = _interopRequireDefault(require('babel-runtime/helpers/extends'));

var _classCallCheck3 = _interopRequireDefault(require('babel-runtime/helpers/classCallCheck'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _require = require('./restoreRelayCacheData'),
    restoreFragmentDataFromCache = _require.restoreFragmentDataFromCache,
    restoreQueriesDataFromCache = _require.restoreQueriesDataFromCache;

var _require2 = require('relay-runtime'),
    ConnectionInterface = _require2.ConnectionInterface,
    RelayProfiler = _require2.RelayProfiler;

var ID = require('./RelayNodeInterface').ID,
    ID_TYPE = require('./RelayNodeInterface').ID_TYPE,
    NODE = require('./RelayNodeInterface').NODE,
    NODE_TYPE = require('./RelayNodeInterface').NODE_TYPE,
    TYPENAME = require('./RelayNodeInterface').TYPENAME;

var _require3 = require('./RelayStoreConstants'),
    ROOT_ID = _require3.ROOT_ID;

var EXISTENT = require('./RelayClassicRecordState').EXISTENT;

var idField = require('./RelayQuery').Field.build({
  fieldName: ID,
  type: 'String'
});
var typeField = require('./RelayQuery').Field.build({
  fieldName: TYPENAME,
  type: 'String'
});

/**
 * @internal
 *
 * Wraps the data caches and associated metadata tracking objects used by
 * GraphQLStore/RelayStore.
 */

var RelayStoreData = function () {
  function RelayStoreData() {
    var cachedRecords = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var cachedRootCallMap = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var queuedRecords = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var records = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    var rootCallMap = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
    var nodeRangeMap = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
    var rangeData = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : new (require('./GraphQLStoreRangeUtils'))();
    (0, _classCallCheck3['default'])(this, RelayStoreData);

    this._cacheManager = null;
    this._cachedRecords = cachedRecords;
    this._cachedRootCallMap = cachedRootCallMap;
    this._cachedStore = new (require('./RelayRecordStore'))({ cachedRecords: cachedRecords, records: records }, { cachedRootCallMap: cachedRootCallMap, rootCallMap: rootCallMap }, nodeRangeMap);
    this._changeEmitter = new (require('./GraphQLStoreChangeEmitter'))(rangeData);
    this._mutationQueue = new (require('./RelayMutationQueue'))(this);
    this._networkLayer = new (require('./RelayNetworkLayer'))();
    this._nodeRangeMap = nodeRangeMap;
    this._pendingQueryTracker = new (require('./RelayPendingQueryTracker'))(this);
    this._queryRunner = new (require('./GraphQLQueryRunner'))(this);
    this._queryTracker = new (require('./RelayQueryTracker'))();
    this._queuedRecords = queuedRecords;
    this._queuedStore = new (require('./RelayRecordStore'))({ cachedRecords: cachedRecords, queuedRecords: queuedRecords, records: records }, { cachedRootCallMap: cachedRootCallMap, rootCallMap: rootCallMap }, nodeRangeMap);
    this._records = records;
    this._recordStore = new (require('./RelayRecordStore'))({ records: records }, { rootCallMap: rootCallMap }, nodeRangeMap);
    this._rangeData = rangeData;
    this._rootCallMap = rootCallMap;
    this._taskQueue = new (require('./RelayTaskQueue'))();
  }

  /**
   * @internal
   *
   * Sets/clears the query tracker.
   *
   * @warning Do not use this unless your application uses only
   * `RelayGraphQLMutation` for mutations.
   */


  RelayStoreData.prototype.injectQueryTracker = function injectQueryTracker(queryTracker) {
    this._queryTracker = queryTracker;
  };

  /**
   * Sets/clears the scheduling function used by the internal task queue to
   * schedule units of work for execution.
   */


  RelayStoreData.prototype.injectTaskScheduler = function injectTaskScheduler(scheduler) {
    this._taskQueue.injectScheduler(scheduler);
  };

  /**
   * Sets/clears the cache manager that is used to cache changes written to
   * the store.
   */


  RelayStoreData.prototype.injectCacheManager = function injectCacheManager(cacheManager) {
    this._cacheManager = cacheManager;
  };

  RelayStoreData.prototype.clearCacheManager = function clearCacheManager() {
    this._cacheManager = null;
  };

  RelayStoreData.prototype.hasCacheManager = function hasCacheManager() {
    return !!this._cacheManager;
  };

  RelayStoreData.prototype.getCacheManager = function getCacheManager() {
    return this._cacheManager;
  };

  /**
   * Returns whether a given record is affected by an optimistic update.
   */


  RelayStoreData.prototype.hasOptimisticUpdate = function hasOptimisticUpdate(dataID) {
    dataID = this.getRangeData().getCanonicalClientID(dataID);
    return this.getQueuedStore().hasOptimisticUpdate(dataID);
  };

  /**
   * Returns a list of client mutation IDs for queued mutations whose optimistic
   * updates are affecting the record corresponding the given dataID. Returns
   * null if the record isn't affected by any optimistic updates.
   */


  RelayStoreData.prototype.getClientMutationIDs = function getClientMutationIDs(dataID) {
    dataID = this.getRangeData().getCanonicalClientID(dataID);
    return this.getQueuedStore().getClientMutationIDs(dataID);
  };

  /**
   * Restores data for queries incrementally from cache.
   * It calls onSuccess when all the data has been loaded into memory.
   * It calls onFailure when some data is unabled to be satisfied from cache.
   */


  RelayStoreData.prototype.restoreQueriesFromCache = function restoreQueriesFromCache(queries, callbacks) {
    var _this = this;

    var cacheManager = this._cacheManager;
    require('fbjs/lib/invariant')(cacheManager, 'RelayStoreData: `restoreQueriesFromCache` should only be called ' + 'when cache manager is available.');
    var changeTracker = new (require('./RelayChangeTracker'))();
    var profile = RelayProfiler.profile('RelayStoreData.readFromDiskCache');
    return restoreQueriesDataFromCache(queries, this._queuedStore, this._cachedRecords, this._cachedRootCallMap, cacheManager, changeTracker, {
      onSuccess: function onSuccess() {
        _this._handleChangedAndNewDataIDs(changeTracker.getChangeSet());
        profile.stop();
        callbacks.onSuccess && callbacks.onSuccess();
      },
      onFailure: function onFailure() {
        _this._handleChangedAndNewDataIDs(changeTracker.getChangeSet());
        profile.stop();
        callbacks.onFailure && callbacks.onFailure();
      }
    });
  };

  /**
   * Restores data for a fragment incrementally from cache.
   * It calls onSuccess when all the data has been loaded into memory.
   * It calls onFailure when some data is unabled to be satisfied from cache.
   */


  RelayStoreData.prototype.restoreFragmentFromCache = function restoreFragmentFromCache(dataID, fragment, path, callbacks) {
    var _this2 = this;

    var cacheManager = this._cacheManager;
    require('fbjs/lib/invariant')(cacheManager, 'RelayStoreData: `restoreFragmentFromCache` should only be called when ' + 'cache manager is available.');
    var changeTracker = new (require('./RelayChangeTracker'))();
    var profile = RelayProfiler.profile('RelayStoreData.readFragmentFromDiskCache');
    return restoreFragmentDataFromCache(dataID, fragment, path, this._queuedStore, this._cachedRecords, this._cachedRootCallMap, cacheManager, changeTracker, {
      onSuccess: function onSuccess() {
        _this2._handleChangedAndNewDataIDs(changeTracker.getChangeSet());
        profile.stop();
        callbacks.onSuccess && callbacks.onSuccess();
      },
      onFailure: function onFailure() {
        _this2._handleChangedAndNewDataIDs(changeTracker.getChangeSet());
        profile.stop();
        callbacks.onFailure && callbacks.onFailure();
      }
    });
  };

  /**
   * Write the results of an OSS query, which can have multiple root fields,
   * updating both the root call map (for consistency with classic queries)
   * and the root record (for consistency with modern queries/fragments).
   */


  RelayStoreData.prototype.handleOSSQueryPayload = function handleOSSQueryPayload(query, payload, forceIndex) {
    var _this3 = this;

    var profiler = RelayProfiler.profile('RelayStoreData.handleQueryPayload');
    var changeTracker = new (require('./RelayChangeTracker'))();
    var recordWriter = this.getRecordWriter();
    var writer = new (require('./RelayQueryWriter'))(this._queuedStore, recordWriter, this._queryTracker, changeTracker, {
      forceIndex: forceIndex,
      updateTrackedQueries: true
    });
    getRootsWithPayloads(query, payload).forEach(function (_ref) {
      var field = _ref.field,
          root = _ref.root,
          rootPayload = _ref.rootPayload;

      // Write the results of the field-specific query
      require('./writeRelayQueryPayload')(writer, root, rootPayload);

      // Ensure the root record exists
      var path = require('./RelayQueryPath').getRootRecordPath();
      recordWriter.putRecord(ROOT_ID, query.getType(), path);
      if (_this3._queuedStore.getRecordState(ROOT_ID) !== EXISTENT) {
        changeTracker.createID(ROOT_ID);
      } else {
        changeTracker.updateID(ROOT_ID);
      }

      // Collect linked record ids for this root field
      var dataIDs = [];
      require('./RelayNodeInterface').getResultsFromPayload(root, rootPayload).forEach(function (_ref2) {
        var result = _ref2.result,
            rootCallInfo = _ref2.rootCallInfo;
        var storageKey = rootCallInfo.storageKey,
            identifyingArgKey = rootCallInfo.identifyingArgKey;

        var dataID = recordWriter.getDataID(storageKey, identifyingArgKey);
        if (dataID != null) {
          dataIDs.push(dataID);
        }
      });

      // Write the field to the root record
      var storageKey = field.getStorageKey();
      if (field.isPlural()) {
        recordWriter.putLinkedRecordIDs(ROOT_ID, storageKey, dataIDs);
      } else {
        var dataID = dataIDs[0];
        if (dataID != null) {
          recordWriter.putLinkedRecordID(ROOT_ID, storageKey, dataID);
        } else {
          recordWriter.putField(ROOT_ID, storageKey, null);
        }
      }
    });
    this._handleChangedAndNewDataIDs(changeTracker.getChangeSet());
    profiler.stop();
  };

  /**
   * Write the results of a query into the base record store.
   */


  RelayStoreData.prototype.handleQueryPayload = function handleQueryPayload(query, payload, forceIndex) {
    var profiler = RelayProfiler.profile('RelayStoreData.handleQueryPayload');
    var changeTracker = new (require('./RelayChangeTracker'))();
    var writer = new (require('./RelayQueryWriter'))(this._queuedStore, this.getRecordWriter(), this._queryTracker, changeTracker, {
      forceIndex: forceIndex,
      updateTrackedQueries: true
    });
    require('./writeRelayQueryPayload')(writer, query, payload);
    this._handleChangedAndNewDataIDs(changeTracker.getChangeSet());
    profiler.stop();
  };

  /**
   * Write the result of a fragment into the base record store.
   */


  RelayStoreData.prototype.handleFragmentPayload = function handleFragmentPayload(dataID, fragment, path, payload, forceIndex) {
    var profiler = RelayProfiler.profile('RelayStoreData.handleFragmentPayload');
    var changeTracker = new (require('./RelayChangeTracker'))();
    var writer = new (require('./RelayQueryWriter'))(this._queuedStore, this.getRecordWriter(), this._queryTracker, changeTracker, {
      forceIndex: forceIndex,
      updateTrackedQueries: true
    });
    writer.createRecordIfMissing(fragment, dataID, path, payload);
    writer.writePayload(fragment, dataID, payload, path);
    this._handleChangedAndNewDataIDs(changeTracker.getChangeSet());
    profiler.stop();
  };

  /**
   * Write the results of an update into the base record store.
   */


  RelayStoreData.prototype.handleUpdatePayload = function handleUpdatePayload(operation, payload, _ref3) {
    var configs = _ref3.configs,
        isOptimisticUpdate = _ref3.isOptimisticUpdate;

    var profiler = RelayProfiler.profile('RelayStoreData.handleUpdatePayload');
    var changeTracker = new (require('./RelayChangeTracker'))();
    var recordWriter = void 0;
    if (isOptimisticUpdate) {
      var _ConnectionInterface$ = ConnectionInterface.get(),
          CLIENT_MUTATION_ID = _ConnectionInterface$.CLIENT_MUTATION_ID;

      var clientMutationID = payload[CLIENT_MUTATION_ID];
      require('fbjs/lib/invariant')(typeof clientMutationID === 'string', 'RelayStoreData.handleUpdatePayload(): Expected optimistic payload ' + 'to have a valid `%s`.', CLIENT_MUTATION_ID);
      recordWriter = this.getRecordWriterForOptimisticMutation(clientMutationID);
    } else {
      recordWriter = this._getRecordWriterForMutation();
    }
    var writer = new (require('./RelayQueryWriter'))(this._queuedStore, recordWriter, this._queryTracker, changeTracker, {
      forceIndex: require('./generateForceIndex')(),
      isOptimisticUpdate: isOptimisticUpdate,
      updateTrackedQueries: false
    });
    require('./writeRelayUpdatePayload')(writer, operation, payload, {
      configs: configs,
      isOptimisticUpdate: isOptimisticUpdate
    });
    this._handleChangedAndNewDataIDs(changeTracker.getChangeSet());
    profiler.stop();
  };

  /**
   * Given a query fragment and a data ID, returns a root query that applies
   * the fragment to the object specified by the data ID.
   */


  RelayStoreData.prototype.buildFragmentQueryForDataID = function buildFragmentQueryForDataID(fragment, dataID) {
    if (require('./RelayRecord').isClientID(dataID)) {
      var path = this._queuedStore.getPathToRecord(this._rangeData.getCanonicalClientID(dataID));
      require('fbjs/lib/invariant')(path, 'RelayStoreData.buildFragmentQueryForDataID(): Cannot refetch ' + 'record `%s` without a path.', dataID);
      return require('./RelayQueryPath').getQuery(this._cachedStore, path, fragment);
    }
    // Fragment fields cannot be spread directly into the root because they
    // may not exist on the `Node` type.
    return require('./RelayQuery').Root.build(fragment.getDebugName() || 'UnknownQuery', NODE, dataID, [idField, typeField, fragment], {
      identifyingArgName: ID,
      identifyingArgType: ID_TYPE,
      isAbstract: true,
      isDeferred: false,
      isPlural: false
    }, NODE_TYPE);
  };

  RelayStoreData.prototype.getNodeData = function getNodeData() {
    return this._records;
  };

  RelayStoreData.prototype.getQueuedData = function getQueuedData() {
    return this._queuedRecords;
  };

  RelayStoreData.prototype.clearQueuedData = function clearQueuedData() {
    var _this4 = this;

    require('fbjs/lib/forEachObject')(this._queuedRecords, function (_, key) {
      delete _this4._queuedRecords[key];
      _this4._changeEmitter.broadcastChangeForID(key);
    });
  };

  RelayStoreData.prototype.getCachedData = function getCachedData() {
    return this._cachedRecords;
  };

  RelayStoreData.prototype.getMutationQueue = function getMutationQueue() {
    return this._mutationQueue;
  };

  RelayStoreData.prototype.getNetworkLayer = function getNetworkLayer() {
    return this._networkLayer;
  };

  /**
   * Get the record store with only the cached and base data (no queued data).
   */


  RelayStoreData.prototype.getCachedStore = function getCachedStore() {
    return this._cachedStore;
  };

  /**
   * Get the record store with full data (cached, base, queued).
   */


  RelayStoreData.prototype.getQueuedStore = function getQueuedStore() {
    return this._queuedStore;
  };

  /**
   * Get the record store with only the base data (no queued/cached data).
   */


  RelayStoreData.prototype.getRecordStore = function getRecordStore() {
    return this._recordStore;
  };

  /**
   * Get the record writer for the base data.
   */


  RelayStoreData.prototype.getRecordWriter = function getRecordWriter() {
    return new (require('./RelayRecordWriter'))(this._records, this._rootCallMap, false, // isOptimistic
    this._nodeRangeMap, this._cacheManager ? this._cacheManager.getQueryWriter() : null);
  };

  RelayStoreData.prototype.getQueryTracker = function getQueryTracker() {
    return this._queryTracker;
  };

  RelayStoreData.prototype.getQueryRunner = function getQueryRunner() {
    return this._queryRunner;
  };

  RelayStoreData.prototype.getChangeEmitter = function getChangeEmitter() {
    return this._changeEmitter;
  };

  RelayStoreData.prototype.getRangeData = function getRangeData() {
    return this._rangeData;
  };

  RelayStoreData.prototype.getPendingQueryTracker = function getPendingQueryTracker() {
    return this._pendingQueryTracker;
  };

  RelayStoreData.prototype.getTaskQueue = function getTaskQueue() {
    return this._taskQueue;
  };

  /**
   * @deprecated
   *
   * Used temporarily by GraphQLStore, but all updates to this object are now
   * handled through a `RelayRecordStore` instance.
   */


  RelayStoreData.prototype.getRootCallData = function getRootCallData() {
    return this._rootCallMap;
  };

  RelayStoreData.prototype._isStoreDataEmpty = function _isStoreDataEmpty() {
    return Object.keys(this._records).length === 0 && Object.keys(this._queuedRecords).length === 0 && Object.keys(this._cachedRecords).length === 0;
  };

  /**
   * Given a ChangeSet, broadcasts changes for updated DataIDs
   * and registers new DataIDs with the garbage collector.
   */


  RelayStoreData.prototype._handleChangedAndNewDataIDs = function _handleChangedAndNewDataIDs(changeSet) {
    var _this5 = this;

    var updatedDataIDs = Object.keys(changeSet.updated);
    var createdDataIDs = Object.keys(changeSet.created);
    updatedDataIDs.forEach(function (id) {
      return _this5._changeEmitter.broadcastChangeForID(id);
    });
    // Containers may be subscribed to "new" records in the case where they
    // were previously garbage collected or where the link was incrementally
    // loaded from cache prior to the linked record.
    createdDataIDs.forEach(function (id) {
      _this5._changeEmitter.broadcastChangeForID(id);
    });
  };

  RelayStoreData.prototype._getRecordWriterForMutation = function _getRecordWriterForMutation() {
    return new (require('./RelayRecordWriter'))(this._records, this._rootCallMap, false, // isOptimistic
    this._nodeRangeMap, this._cacheManager ? this._cacheManager.getMutationWriter() : null);
  };

  RelayStoreData.prototype.getRecordWriterForOptimisticMutation = function getRecordWriterForOptimisticMutation(clientMutationID) {
    return new (require('./RelayRecordWriter'))(this._queuedRecords, this._rootCallMap, true, // isOptimistic
    this._nodeRangeMap, null, // don't cache optimistic data
    clientMutationID);
  };

  RelayStoreData.prototype.toJSON = function toJSON() {
    /**
     * A util function which remove the querypath from the record. Used to stringify the RecordMap.
     */
    var getRecordsWithoutPaths = function getRecordsWithoutPaths(recordMap) {
      if (!recordMap) {
        return null;
      }
      return require('fbjs/lib/mapObject')(recordMap, function (record) {
        var nextRecord = (0, _extends3['default'])({}, record);
        delete nextRecord[require('./RelayRecord').MetadataKey.PATH];
        return nextRecord;
      });
    };

    return {
      cachedRecords: getRecordsWithoutPaths(this._cachedRecords),
      cachedRootCallMap: this._cachedRootCallMap,
      queuedRecords: getRecordsWithoutPaths(this._queuedRecords),
      records: getRecordsWithoutPaths(this._records),
      rootCallMap: this._rootCallMap,
      nodeRangeMap: this._nodeRangeMap
    };
  };

  /* $FlowFixMe: This comment suppresses an error caught by Flow 0.59 which was
   * not caught before. Most likely, this error is because an exported function
   * parameter is missing an annotation. Without an annotation, these parameters
   * are uncovered by Flow. */


  RelayStoreData.fromJSON = function fromJSON(obj) {
    require('fbjs/lib/invariant')(obj, 'RelayStoreData: JSON object is empty');
    var cachedRecords = obj.cachedRecords,
        cachedRootCallMap = obj.cachedRootCallMap,
        queuedRecords = obj.queuedRecords,
        records = obj.records,
        rootCallMap = obj.rootCallMap,
        nodeRangeMap = obj.nodeRangeMap;


    deserializeRecordRanges(cachedRecords);
    deserializeRecordRanges(queuedRecords);
    deserializeRecordRanges(records);

    return new RelayStoreData(cachedRecords, cachedRootCallMap, queuedRecords, records, rootCallMap, nodeRangeMap);
  };

  return RelayStoreData;
}();

/**
 * A helper function which checks for serialized GraphQLRange
 * instances and deserializes them in toJSON()
 */


function deserializeRecordRanges(records) {
  for (var _key in records) {
    var record = records[_key];
    var range = record.__range__;
    if (range) {
      record.__range__ = require('./GraphQLRange').fromJSON(range);
    }
  }
}

/**
 * Given an OSS query and response, returns an array of information
 * corresponding to each root field with items as follows:
 * - `field`: the root field from the input query
 * - `root`: the synthesized RelayQueryRoot corresponding to that field
 * - `rootPayload`: the payload for that `root`
 */
function getRootsWithPayloads(query, response) {
  var results = [];
  query.getChildren().forEach(function (child) {
    var field = child;
    if (!(field instanceof require('./RelayQuery').Field) || !field.canHaveSubselections()) {
      // Only care about linked fields
      return;
    }
    // Get the concrete field from the RelayQueryField
    var concreteField = require('fbjs/lib/nullthrows')(require('./QueryBuilder').getField(field.getConcreteQueryNode()));
    // Build the identifying argument for the query
    var identifyingArgName = void 0;
    var identifyingArgType = void 0;
    var identifyingArg = concreteField.calls && concreteField.calls[0];
    if (identifyingArg) {
      identifyingArgName = identifyingArg.name;
      identifyingArgType = identifyingArg.metadata && identifyingArg.metadata.type;
    }
    // Build the concrete query
    var concreteQuery = {
      calls: concreteField.calls,
      children: concreteField.children,
      directives: [], // @include/@skip directives are processed within getChildren()
      fieldName: concreteField.fieldName,
      isDeferred: false,
      kind: 'Query',
      metadata: {
        identifyingArgName: identifyingArgName,
        identifyingArgType: identifyingArgType,
        isAbstract: concreteField.metadata && concreteField.metadata.isAbstract,
        isPlural: concreteField.metadata && concreteField.metadata.isPlural
      },
      name: query.getName(),
      // Note that classic queries are typed as the type of the root field, not
      // the `Query` type
      type: field.getType()
    };
    // Construct a root query
    var root = require('./RelayQuery').Root.create(concreteQuery, require('./RelayMetaRoute').get('$RelayEnvironment'), query.getVariables());
    // Construct the payload that would have been returned had `root` been
    // used to fetch data.
    var serializationKey = field.getSerializationKey();
    var rootPayload = {};
    if (!response.hasOwnProperty(serializationKey)) {
      // Data is missing for this field. This can occur when the field is empty
      // due to a failing conditional (@include/@skip) in its subtree.
      return;
    }
    rootPayload[root.getFieldName()] = response[serializationKey];
    results.push({
      field: field,
      root: root,
      rootPayload: rootPayload
    });
  });
  return results;
}

RelayProfiler.instrumentMethods(RelayStoreData.prototype, {
  handleQueryPayload: 'RelayStoreData.prototype.handleQueryPayload',
  handleUpdatePayload: 'RelayStoreData.prototype.handleUpdatePayload'
});

module.exports = RelayStoreData;