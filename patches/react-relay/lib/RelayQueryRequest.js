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

var _possibleConstructorReturn3 = _interopRequireDefault(require('babel-runtime/helpers/possibleConstructorReturn'));

var _inherits3 = _interopRequireDefault(require('babel-runtime/helpers/inherits'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * @internal
 *
 * Instances of these are made available via `RelayNetworkLayer.sendQueries`.
 */
var RelayQueryRequest = function (_Deferred) {
  (0, _inherits3['default'])(RelayQueryRequest, _Deferred);

  function RelayQueryRequest(query) {
    (0, _classCallCheck3['default'])(this, RelayQueryRequest);

    var _this = (0, _possibleConstructorReturn3['default'])(this, _Deferred.call(this));

    _this._printedQuery = null;
    _this._query = query;
    return _this;
  }

  /**
   * @public
   *
   * Gets a string name used to refer to this request for printing debug output.
   */


  RelayQueryRequest.prototype.getDebugName = function getDebugName() {
    var name = this._query.getName();
    return this._query.isDeferred() ? name + ' (DEFERRED)' : name;
  };

  /**
   * @public
   *
   * Gets a unique identifier for this query. These identifiers are useful for
   * assigning response payloads to their corresponding queries when sent in a
   * single GraphQL request.
   */


  RelayQueryRequest.prototype.getID = function getID() {
    return this._query.getID();
  };

  RelayQueryRequest.prototype._getPrintedQuery = function _getPrintedQuery() {
    var printedQuery = this._printedQuery;
    if (printedQuery == null) {
      printedQuery = this._query instanceof require('./RelayQuery').OSSQuery ? require('./printRelayOSSQuery')(this._query) : require('./printRelayQuery')(this._query);
      this._printedQuery = printedQuery;
    }
    return printedQuery;
  };

  /**
   * @public
   *
   * Gets the variables used by the query. These variables should be serialized
   * and sent in the GraphQL request.
   */


  RelayQueryRequest.prototype.getVariables = function getVariables() {
    return this._getPrintedQuery().variables;
  };

  /**
   * @public
   *
   * Gets a string representation of the GraphQL query.
   */


  RelayQueryRequest.prototype.getQueryString = function getQueryString() {
    return this._getPrintedQuery().text;
  };

  /**
   * @public
   * @unstable
   */


  RelayQueryRequest.prototype.getQuery = function getQuery() {
    return this._query;
  };

  return RelayQueryRequest;
}(require('fbjs/lib/Deferred'));

module.exports = RelayQueryRequest;