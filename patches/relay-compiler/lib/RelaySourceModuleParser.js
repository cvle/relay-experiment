/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule RelaySourceModuleParser
 * 
 * @format
 */

'use strict';

var _toConsumableArray3 = _interopRequireDefault(require('babel-runtime/helpers/toConsumableArray'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _require = require('./GraphQLCompilerPublic'),
    ASTCache = _require.ASTCache,
    Profiler = _require.Profiler;

var _require2 = require('./RelayFindGraphQLTags'),
    memoizedFind = _require2.memoizedFind;

var parseGraphQL = Profiler.instrument(require('graphql').parse, 'GraphQL.parse');

var FIND_OPTIONS = {
  validateNames: true
};

module.exports = function (tagFinder) {
  var memoizedTagFinder = memoizedFind.bind(null, tagFinder);

  // Throws an error if parsing the file fails
  function parseFile(baseDir, file) {
    var text = require('fs').readFileSync(require('path').join(baseDir, file.relPath), 'utf8');

    require('fbjs/lib/invariant')(text.indexOf('graphql') >= 0, 'RelaySourceModuleParser: Files should be filtered before passed to the ' + 'parser, got unfiltered file `%s`.', file);

    var astDefinitions = [];
    memoizedTagFinder(text, baseDir, file, FIND_OPTIONS).forEach(function (template) {
      var ast = parseGraphQL(new (require('graphql').Source)(template, file.relPath));
      require('fbjs/lib/invariant')(ast.definitions.length, 'RelaySourceModuleParser: Expected GraphQL text to contain at least one ' + 'definition (fragment, mutation, query, subscription), got `%s`.', template);
      astDefinitions.push.apply(astDefinitions, (0, _toConsumableArray3['default'])(ast.definitions));
    });

    return {
      kind: 'Document',
      definitions: astDefinitions
    };
  }

  function getParser(baseDir) {
    return new ASTCache({
      baseDir: baseDir,
      parse: parseFile
    });
  }

  function getFileFilter(baseDir) {
    return function (file) {
      var text = require('fs').readFileSync(require('path').join(baseDir, file.relPath), 'utf8');
      return text.indexOf('graphql') >= 0;
    };
  }

  return {
    getParser: getParser,
    getFileFilter: getFileFilter
  };
};