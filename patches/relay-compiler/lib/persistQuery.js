/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule persistQuery
 * 
 * @format
 */

'use strict';

var _md2 = _interopRequireDefault(require('./md5'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var persistQuery = function persistQuery(operationText) {
  return new Promise(function (resolve) {
    return resolve((0, _md2['default'])(operationText));
  });
};

module.exports = persistQuery;