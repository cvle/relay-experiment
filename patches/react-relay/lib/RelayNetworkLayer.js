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

var _classCallCheck3 = _interopRequireDefault(require('babel-runtime/helpers/classCallCheck'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _require = require('relay-runtime'),
    RelayProfiler = _require.RelayProfiler;

/**
 * @internal
 *
 * `RelayNetworkLayer` provides a method to inject custom network behavior.
 */
var RelayNetworkLayer = function () {
  function RelayNetworkLayer() {
    (0, _classCallCheck3['default'])(this, RelayNetworkLayer);

    this._implementation = null;
    this._queue = null;
    this._subscribers = [];
  }

  /**
   * @internal
   */


  RelayNetworkLayer.prototype.injectDefaultImplementation = function injectDefaultImplementation(implementation) {
    if (this._defaultImplementation) {
      require('fbjs/lib/warning')(false, 'RelayNetworkLayer: Call received to injectDefaultImplementation(), ' + 'but a default layer was already injected.');
    }
    this._defaultImplementation = implementation;
  };

  RelayNetworkLayer.prototype.injectImplementation = function injectImplementation(implementation) {
    if (this._implementation) {
      require('fbjs/lib/warning')(false, 'RelayNetworkLayer: Call received to injectImplementation(), but ' + 'a layer was already injected.');
    }
    this._implementation = implementation;
  };

  RelayNetworkLayer.prototype.addNetworkSubscriber = function addNetworkSubscriber(queryCallback, mutationCallback) {
    var _this = this;

    var index = this._subscribers.length;
    this._subscribers.push({ queryCallback: queryCallback, mutationCallback: mutationCallback });
    return {
      remove: function remove() {
        delete _this._subscribers[index];
      }
    };
  };

  RelayNetworkLayer.prototype.sendMutation = function sendMutation(mutationRequest) {
    var implementation = this._getImplementation();
    this._subscribers.forEach(function (_ref) {
      var mutationCallback = _ref.mutationCallback;

      if (mutationCallback) {
        mutationCallback(mutationRequest);
      }
    });
    var maybePromise = implementation.sendMutation(mutationRequest);
    if (maybePromise) {
      require('./throwFailedPromise')(Promise.resolve(maybePromise));
    }
  };

  RelayNetworkLayer.prototype.sendQueries = function sendQueries(queryRequests) {
    profileQueue(queryRequests);
    var implementation = this._getImplementation();
    this._subscribers.forEach(function (_ref2) {
      var queryCallback = _ref2.queryCallback;

      if (queryCallback) {
        queryRequests.forEach(function (request) {
          queryCallback(request);
        });
      }
    });
    var maybePromise = implementation.sendQueries(queryRequests);
    if (maybePromise) {
      require('./throwFailedPromise')(Promise.resolve(maybePromise));
    }
  };

  RelayNetworkLayer.prototype.supports = function supports() {
    var implementation = this._getImplementation();

    for (var _len = arguments.length, options = Array(_len), _key = 0; _key < _len; _key++) {
      options[_key] = arguments[_key];
    }

    return implementation.supports.apply(implementation, options);
  };

  RelayNetworkLayer.prototype._getImplementation = function _getImplementation() {
    var implementation = this._implementation || this._defaultImplementation;
    require('fbjs/lib/invariant')(implementation, 'RelayNetworkLayer: Use `RelayEnvironment.injectNetworkLayer` to ' + 'configure a network layer.');
    return implementation;
  };

  /**
   * Schedules the supplied `query` to be sent to the server.
   *
   * This is a low-level transport API; application code should use higher-level
   * interfaces exposed by RelayContainer for retrieving data transparently via
   * queries defined on components.
   */


  RelayNetworkLayer.prototype.fetchRelayQuery = function fetchRelayQuery(query) {
    var _this2 = this;

    var currentQueue = this._queue || [];
    if (!this._queue) {
      this._queue = currentQueue;
      require('fbjs/lib/resolveImmediate')(function () {
        _this2._queue = null;
        _this2.sendQueries(currentQueue);
      });
    }
    var request = new (require('./RelayQueryRequest'))(query);
    currentQueue.push(request);
    return request.getPromise();
  };

  return RelayNetworkLayer;
}();

/**
 * Profiles time from request to receiving the first server response.
 */


function profileQueue(currentQueue) {
  // TODO #8783781: remove aggregate `fetchRelayQuery` profiler
  var firstResultProfiler = RelayProfiler.profile('fetchRelayQuery');
  currentQueue.forEach(function (query) {
    var profiler = RelayProfiler.profile('fetchRelayQuery.query', query.getQuery().getName());
    var onSettle = function onSettle() {
      profiler.stop();
      if (firstResultProfiler) {
        firstResultProfiler.stop();
        firstResultProfiler = null;
      }
    };
    query.done(onSettle, onSettle);
  });
}

RelayProfiler.instrumentMethods(RelayNetworkLayer.prototype, {
  sendMutation: 'RelayNetworkLayer.sendMutation',
  sendQueries: 'RelayNetworkLayer.sendQueries'
});

module.exports = RelayNetworkLayer;