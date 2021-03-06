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

var _require = require('relay-runtime'),
    RelayProfiler = _require.RelayProfiler;

/**
 * @internal
 *
 * `flattenRelayQuery(query)` returns a clone of `query` with fields inside of
 * fragments recursively flattened into the nearest ancestor field.
 *
 * The result can be null if `node` only contains empty fragments or fragments
 * that only contain empty fragments.
 */
function flattenRelayQuery(node, options) {
  var flattener = new RelayQueryFlattener(options && options.shouldRemoveFragments);
  var state = {
    node: node,
    type: node.getType(),
    flattenedFieldMap: new (require('fbjs/lib/Map'))(),
    flattenedFragmentMap: new (require('fbjs/lib/Map'))()
  };
  flattener.traverse(node, state);
  return toQuery(node, state, !!(options && options.preserveEmptyNodes));
}

function toQuery(node, _ref, preserveEmptyNodes) {
  var flattenedFieldMap = _ref.flattenedFieldMap,
      flattenedFragmentMap = _ref.flattenedFragmentMap;

  var children = [];
  var aliases = Array.from(flattenedFieldMap.keys());
  aliases.forEach(function (alias) {
    var field = flattenedFieldMap.get(alias);
    if (field) {
      children.push(toQuery(field.node, field, preserveEmptyNodes));
    }
  });
  Array.from(flattenedFragmentMap.keys()).forEach(function (type) {
    var fragment = flattenedFragmentMap.get(type);
    if (fragment) {
      children.push(toQuery(fragment.node, fragment, preserveEmptyNodes));
    }
  });
  // Pattern nodes may contain non-scalar fields without children that
  // should not be removed.
  if (preserveEmptyNodes && node.canHaveSubselections() && !children.length) {
    return node;
  }
  return node.clone(children);
}

var RelayQueryFlattener = function (_RelayQueryVisitor) {
  (0, _inherits3['default'])(RelayQueryFlattener, _RelayQueryVisitor);

  function RelayQueryFlattener(shouldRemoveFragments) {
    (0, _classCallCheck3['default'])(this, RelayQueryFlattener);

    var _this = (0, _possibleConstructorReturn3['default'])(this, _RelayQueryVisitor.call(this));

    _this._shouldRemoveFragments = !!shouldRemoveFragments;
    return _this;
  }

  RelayQueryFlattener.prototype.visitFragment = function visitFragment(node, state) {
    var type = node.getType();
    if (this._shouldRemoveFragments || type === state.type) {
      this.traverse(node, state);
      return;
    }
    var flattenedFragment = state.flattenedFragmentMap.get(type);
    if (!flattenedFragment) {
      flattenedFragment = {
        node: node,
        type: type,
        flattenedFieldMap: new (require('fbjs/lib/Map'))(),
        flattenedFragmentMap: new (require('fbjs/lib/Map'))()
      };
      state.flattenedFragmentMap.set(type, flattenedFragment);
    }
    this.traverse(node, flattenedFragment);
  };

  RelayQueryFlattener.prototype.visitField = function visitField(node, state) {
    var hash = node.getShallowHash();
    var flattenedField = state.flattenedFieldMap.get(hash);
    if (!flattenedField) {
      flattenedField = {
        node: node,
        type: node.getType(),
        flattenedFieldMap: new (require('fbjs/lib/Map'))(),
        flattenedFragmentMap: new (require('fbjs/lib/Map'))()
      };
      state.flattenedFieldMap.set(hash, flattenedField);
    }
    this.traverse(node, flattenedField);
  };

  return RelayQueryFlattener;
}(require('./RelayQueryVisitor'));

module.exports = RelayProfiler.instrument('flattenRelayQuery', flattenRelayQuery);