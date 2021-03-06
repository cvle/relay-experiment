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

var RelayVariable = function () {
  function RelayVariable(name) {
    (0, _classCallCheck3['default'])(this, RelayVariable);

    this.name = name;
  }

  RelayVariable.prototype.equals = function equals(other) {
    return other instanceof RelayVariable && other.getName() === this.name;
  };

  RelayVariable.prototype.getName = function getName() {
    return this.name;
  };

  return RelayVariable;
}();

module.exports = RelayVariable;