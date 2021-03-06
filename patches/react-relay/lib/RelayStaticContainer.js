/**
 * Copyright 2013-2015, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @typechecks
 * 
 * @format
 */

'use strict';

var _classCallCheck3 = _interopRequireDefault(require('babel-runtime/helpers/classCallCheck'));

var _possibleConstructorReturn3 = _interopRequireDefault(require('babel-runtime/helpers/possibleConstructorReturn'));

var _inherits3 = _interopRequireDefault(require('babel-runtime/helpers/inherits'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var RelayStaticContainer = function (_React$Component) {
  (0, _inherits3['default'])(RelayStaticContainer, _React$Component);

  function RelayStaticContainer() {
    (0, _classCallCheck3['default'])(this, RelayStaticContainer);
    return (0, _possibleConstructorReturn3['default'])(this, _React$Component.apply(this, arguments));
  }

  RelayStaticContainer.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
    return !!nextProps.shouldUpdate;
  };

  RelayStaticContainer.prototype.render = function render() {
    var child = this.props.children;
    return child ? require('react').Children.only(child) : null;
  };

  return RelayStaticContainer;
}(require('react').Component);

module.exports = RelayStaticContainer;