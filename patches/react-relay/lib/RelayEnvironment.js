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

var _require = require('relay-runtime'),
    Observable = _require.Observable,
    recycleNodesInto = _require.recycleNodesInto;

/**
 * A version of the `RelayContext` interface where the `environment` property
 * satisfies both new `Environment` API and the classic environment API. Values
 * of this type allow both the classic and new APIs to be used together within a
 * single React view hierarchy.
 */


/**
 * @public
 *
 * `RelayEnvironment` is the public API for Relay core. Each instance provides
 * an isolated environment with:
 * - Methods for fetching and updating data.
 * - An in-memory cache of fetched data.
 * - A configurable network layer for resolving queries/mutations.
 * - A configurable task scheduler to control when internal tasks are executed.
 *
 * No data or configuration is shared between instances. We recommend creating
 * one `RelayEnvironment` instance per user: client apps may share a single
 * instance, server apps may create one instance per HTTP request.
 */
var RelayEnvironment = function () {
  RelayEnvironment.prototype.applyMutation = function applyMutation(_ref) {
    var configs = _ref.configs,
        operation = _ref.operation,
        optimisticResponse = _ref.optimisticResponse,
        variables = _ref.variables;

    var mutationTransaction = new (require('./RelayGraphQLMutation'))(operation.node, require('./RelayVariables').getOperationVariables(operation, variables), null, this);
    mutationTransaction.applyOptimistic(operation.node, optimisticResponse, configs);
    var disposed = false;
    return {
      dispose: function dispose() {
        if (!disposed) {
          disposed = true;
          mutationTransaction.rollback();
        }
      }
    };
  };

  RelayEnvironment.prototype.check = function check(selector) {
    return false;
  };

  RelayEnvironment.prototype.commitPayload = function commitPayload(operationSelector, payload) {
    var selector = operationSelector.root;
    var fragment = require('./RelayQuery').Fragment.create(selector.node, require('./RelayMetaRoute').get('$RelayEnvironment'), selector.variables);
    var path = require('./RelayQueryPath').getRootRecordPath();
    this._storeData.handleFragmentPayload(selector.dataID, fragment, path, payload, null);
  };

  /**
   * An internal implementation of the "lookup" API that is shared by `lookup()`
   * and `subscribe()`. Note that `subscribe()` cannot use `lookup()` directly,
   * since the former may modify the result data before freezing it.
   */


  RelayEnvironment.prototype._lookup = function _lookup(selector) {
    var fragment = require('./RelayQuery').Fragment.create(selector.node, require('./RelayMetaRoute').get('$RelayEnvironment'), selector.variables);

    var _readRelayQueryData = require('./readRelayQueryData')(this._storeData, fragment, selector.dataID),
        data = _readRelayQueryData.data,
        dataIDs = _readRelayQueryData.dataIDs;
    // Ensure that the root ID is considered "seen" and will be watched for
    // changes if the returned selector is passed to `subscribe()`.


    dataIDs[selector.dataID] = true;
    return (0, _extends3['default'])({}, selector, {
      data: data,
      seenRecords: dataIDs
    });
  };

  RelayEnvironment.prototype.lookup = function lookup(selector) {
    var snapshot = this._lookup(selector);
    if (process.env.NODE_ENV !== 'production') {
      deepFreezeSnapshot(snapshot);
    }
    return snapshot;
  };

  RelayEnvironment.prototype.sendMutation = function sendMutation(_ref2) {
    var configs = _ref2.configs,
        onCompleted = _ref2.onCompleted,
        onError = _ref2.onError,
        operation = _ref2.operation,
        optimisticOperation = _ref2.optimisticOperation,
        optimisticResponse = _ref2.optimisticResponse,
        variables = _ref2.variables,
        uploadables = _ref2.uploadables;

    var disposed = false;
    var mutationTransaction = new (require('./RelayGraphQLMutation'))(operation.node, require('./RelayVariables').getOperationVariables(operation, variables), uploadables, this, {
      onSuccess: function onSuccess(response) {
        if (disposed) {
          return;
        }
        onCompleted && onCompleted(response);
      },
      onFailure: function onFailure(transaction) {
        if (disposed) {
          return;
        }
        if (onError) {
          var _error = transaction.getError();
          if (!_error) {
            _error = new Error('RelayEnvironment: Unknown error executing mutation ' + operation.node.name);
          }
          onError(_error);
        }
      }
    });

    if (optimisticResponse) {
      mutationTransaction.applyOptimistic(optimisticOperation ? optimisticOperation.node : operation.node, optimisticResponse, configs);
    }

    mutationTransaction.commit(configs);
    return {
      dispose: function dispose() {
        if (!disposed) {
          disposed = true;
        }
      }
    };
  };

  RelayEnvironment.prototype.subscribe = function subscribe(snapshot, callback) {
    var _this = this;

    var subscription = void 0;
    var changeEmitter = this._storeData.getChangeEmitter();
    var update = function update() {
      // Re-read data and see if anything changed
      var nextSnapshot = _this._lookup(snapshot);
      // Note that `recycleNodesInto` may modify the "next" value
      nextSnapshot.data = recycleNodesInto(snapshot.data, nextSnapshot.data);
      if (nextSnapshot.data === snapshot.data) {
        // The record changes don't affect the results of the selector
        return;
      }
      if (process.env.NODE_ENV !== 'production') {
        deepFreezeSnapshot(nextSnapshot);
      }
      if (subscription) {
        subscription.remove();
      }
      subscription = changeEmitter.addListenerForIDs(Object.keys(nextSnapshot.seenRecords), update);
      snapshot = nextSnapshot;
      callback(snapshot);
    };
    subscription = changeEmitter.addListenerForIDs(Object.keys(snapshot.seenRecords), update);
    return {
      dispose: function dispose() {
        if (subscription) {
          subscription.remove();
          subscription = null;
        }
      }
    };
  };

  RelayEnvironment.prototype.retain = function retain(selector) {
    return {
      dispose: function dispose() {}
    };
  };

  RelayEnvironment.prototype.sendQuery = function sendQuery(_ref3) {
    var _this2 = this;

    var cacheConfig = _ref3.cacheConfig,
        onCompleted = _ref3.onCompleted,
        onError = _ref3.onError,
        onNext = _ref3.onNext,
        operation = _ref3.operation;

    var isDisposed = false;
    var dispose = function dispose() {
      isDisposed = true;
    };
    var query = require('./RelayQuery').OSSQuery.create(operation.node, require('./RelayMetaRoute').get('$RelayEnvironment'), operation.variables);
    var request = new (require('./RelayQueryRequest'))(query);
    request.then(function (payload) {
      if (isDisposed) {
        return;
      }
      var forceIndex = cacheConfig && cacheConfig.force ? require('./generateForceIndex')() : null;
      _this2._storeData.handleOSSQueryPayload(query, payload.response, forceIndex);

      onNext && onNext(operation.root);
      onCompleted && onCompleted();
    }, function (error) {
      if (isDisposed) {
        return;
      }
      onError && onError(error);
    });
    this._storeData.getTaskQueue().enqueue(function () {
      _this2._storeData.getNetworkLayer().sendQueries([request]);
    });
    return { dispose: dispose };
  };

  RelayEnvironment.prototype.streamQuery = function streamQuery(config) {
    require('fbjs/lib/warning')(false, 'environment.streamQuery() is deprecated. Update to the latest ' + 'version of react-relay, and use environment.execute().');
    return this.sendQuery(config);
  };

  RelayEnvironment.prototype.execute = function execute(_ref4) {
    var _this3 = this;

    var operation = _ref4.operation,
        cacheConfig = _ref4.cacheConfig,
        updater = _ref4.updater;

    return Observable.fromLegacy(function (observer) {
      return _this3.sendQuery((0, _extends3['default'])({ operation: operation, cacheConfig: cacheConfig }, observer));
    });
  };

  function RelayEnvironment(storeData) {
    (0, _classCallCheck3['default'])(this, RelayEnvironment);

    this._storeData = storeData ? storeData : new (require('./RelayStoreData'))();
    this._storeData.getChangeEmitter().injectBatchingStrategy(require('./relayUnstableBatchedUpdates'));
    this.applyUpdate = this.applyUpdate.bind(this);
    this.commitUpdate = this.commitUpdate.bind(this);
    this.unstable_internal = require('./RelayClassicCore');
  }

  /**
   * @internal
   */


  RelayEnvironment.prototype.getStoreData = function getStoreData() {
    return this._storeData;
  };

  /**
   * @internal
   */


  RelayEnvironment.prototype.injectDefaultNetworkLayer = function injectDefaultNetworkLayer(networkLayer) {
    this._storeData.getNetworkLayer().injectDefaultImplementation(networkLayer);
  };

  RelayEnvironment.prototype.injectNetworkLayer = function injectNetworkLayer(networkLayer) {
    this._storeData.getNetworkLayer().injectImplementation(networkLayer);
  };

  /**
   * @internal
   */


  RelayEnvironment.prototype.injectQueryTracker = function injectQueryTracker(queryTracker) {
    this._storeData.injectQueryTracker(queryTracker);
  };

  RelayEnvironment.prototype.addNetworkSubscriber = function addNetworkSubscriber(queryCallback, mutationCallback) {
    return this._storeData.getNetworkLayer().addNetworkSubscriber(queryCallback, mutationCallback);
  };

  RelayEnvironment.prototype.injectTaskScheduler = function injectTaskScheduler(scheduler) {
    this._storeData.injectTaskScheduler(scheduler);
  };

  RelayEnvironment.prototype.injectCacheManager = function injectCacheManager(cacheManager) {
    this._storeData.injectCacheManager(cacheManager);
  };

  /**
   * Primes the store by sending requests for any missing data that would be
   * required to satisfy the supplied set of queries.
   */


  RelayEnvironment.prototype.primeCache = function primeCache(querySet, callback) {
    return this._storeData.getQueryRunner().run(querySet, callback);
  };

  /**
   * Forces the supplied set of queries to be fetched and written to the store.
   * Any data that previously satisfied the queries will be overwritten.
   */


  RelayEnvironment.prototype.forceFetch = function forceFetch(querySet, callback) {
    return this._storeData.getQueryRunner().forceFetch(querySet, callback);
  };

  /**
   * Reads query data anchored at the supplied data ID.
   */


  RelayEnvironment.prototype.read = function read(node, dataID, options) {
    return require('./readRelayQueryData')(this._storeData, node, dataID, options).data;
  };

  /**
   * Reads query data anchored at the supplied data IDs.
   */


  RelayEnvironment.prototype.readAll = function readAll(node, dataIDs, options) {
    var _this4 = this;

    return dataIDs.map(function (dataID) {
      return require('./readRelayQueryData')(_this4._storeData, node, dataID, options).data;
    });
  };

  /**
   * Reads query data, where each element in the result array corresponds to a
   * root call argument. If the root call has no arguments, the result array
   * will contain exactly one element.
   */


  RelayEnvironment.prototype.readQuery = function readQuery(root, options) {
    var _this5 = this;

    var queuedStore = this._storeData.getQueuedStore();
    var storageKey = root.getStorageKey();
    var results = [];
    require('./forEachRootCallArg')(root, function (_ref5) {
      var identifyingArgKey = _ref5.identifyingArgKey;

      var data = void 0;
      var dataID = queuedStore.getDataID(storageKey, identifyingArgKey);
      if (dataID != null) {
        data = _this5.read(root, dataID, options);
      }
      results.push(data);
    });
    return results;
  };

  /**
   * @internal
   *
   * Returns a fragment "resolver" - a subscription to the results of a fragment
   * and a means to access the latest results. This is a transitional API and
   * not recommended for general use.
   */


  RelayEnvironment.prototype.getFragmentResolver = function getFragmentResolver(fragment, onNext) {
    return new (require('./GraphQLStoreQueryResolver'))(this._storeData, fragment, onNext);
  };

  /**
   * Adds an update to the store without committing it. The returned
   * RelayMutationTransaction can be committed or rolled back at a later time.
   */


  RelayEnvironment.prototype.applyUpdate = function applyUpdate(mutation, callbacks) {
    mutation.bindEnvironment(this);
    return this._storeData.getMutationQueue().createTransaction(mutation, callbacks).applyOptimistic();
  };

  /**
   * Adds an update to the store and commits it immediately. Returns
   * the RelayMutationTransaction.
   */


  RelayEnvironment.prototype.commitUpdate = function commitUpdate(mutation, callbacks) {
    var transaction = this.applyUpdate(mutation, callbacks);
    // The idea here is to defer the call to `commit()` to give the optimistic
    // mutation time to flush out to the UI before starting the commit work.
    var preCommitStatus = transaction.getStatus();
    setTimeout(function () {
      if (transaction.getStatus() !== preCommitStatus) {
        return;
      }
      transaction.commit();
    });
    return transaction;
  };

  /**
   * @deprecated
   *
   * Method renamed to commitUpdate
   */


  RelayEnvironment.prototype.update = function update(mutation, callbacks) {
    require('fbjs/lib/warning')(false, '`Relay.Store.update` is deprecated. Please use' + ' `Relay.Store.commitUpdate` or `Relay.Store.applyUpdate` instead.');
    this.commitUpdate(mutation, callbacks);
  };

  return RelayEnvironment;
}();

/**
 * RelayQuery mutates the `__cachedFragment__` property of concrete nodes for
 * memoization purposes, so a snapshot cannot be completely frozen. Instead this
 * function shallow-freezes the snapshot itself and deeply freezes all
 * properties except the `node`.
 */


function deepFreezeSnapshot(snapshot) {
  Object.freeze(snapshot);
  if (snapshot.data != null) {
    require('./deepFreeze')(snapshot.data);
  }
  require('./deepFreeze')(snapshot.seenRecords);
  require('./deepFreeze')(snapshot.variables);
  return snapshot;
}

module.exports = RelayEnvironment;