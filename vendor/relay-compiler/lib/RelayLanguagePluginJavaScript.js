/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @providesModule RelayLanguagePluginJavaScript
 * @format
 */

'use strict';

var _require = require('./FindGraphQLTags'),
    find = _require.find;

module.exports = function () {
  return {
    inputExtensions: ['js', 'jsx'],
    outputExtension: 'js',
    typeGenerator: require('./RelayFlowGenerator'),
    formatModule: require('./formatGeneratedModule'),
    findGraphQLTags: find
  };
};