/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule md5
 * 
 * @format
 */

'use strict';

var _crypto2 = _interopRequireDefault(require('crypto'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var md5 = function md5(x) {
  return _crypto2['default'].createHash('md5').update(x, 'utf8').digest('hex');
};

module.exports = md5;