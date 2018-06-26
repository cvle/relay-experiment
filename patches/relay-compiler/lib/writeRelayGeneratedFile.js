/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule writeRelayGeneratedFile
 * 
 * @format
 */

'use strict';

// TODO T21875029 ../../relay-runtime/util/RelayConcreteNode

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _extends3 = _interopRequireDefault(require('babel-runtime/helpers/extends'));

let writeRelayGeneratedFile = (() => {
  var _ref = (0, _asyncToGenerator3.default)(function* (codegenDir, generatedNode, formatModule, typeText, persistQuery, platform, relayRuntimeModule, sourceHash, extension) {
    // Copy to const so Flow can refine.
    var _persistQuery = persistQuery;
    var moduleName = generatedNode.name + '.graphql';
    var platformName = platform ? moduleName + '.' + platform : moduleName;
    var filename = platformName + '.' + extension;
    var queryMapFilename = generatedNode.name + '.queryMap.json';
    var typeName = generatedNode.kind === require('./RelayConcreteNode').FRAGMENT ? 'ConcreteFragment' : generatedNode.kind === require('./RelayConcreteNode').REQUEST ? 'ConcreteRequest' : generatedNode.kind === require('./RelayConcreteNode').BATCH_REQUEST ? 'ConcreteBatchRequest' : null;
    var devOnlyProperties = {};

    var docText = void 0;
    if (generatedNode.kind === require('./RelayConcreteNode').REQUEST) {
      docText = generatedNode.text;
    } else if (generatedNode.kind === require('./RelayConcreteNode').BATCH_REQUEST) {
      docText = generatedNode.requests.map(function (request) {
        return request.text;
      }).join('\n\n');
    }

    var hash = null;
    var queryMap = null;

    if (generatedNode.kind === require('./RelayConcreteNode').REQUEST || generatedNode.kind === require('./RelayConcreteNode').BATCH_REQUEST) {
      var oldHash = Profiler.run('RelayFileWriter:compareHash', function () {
        var oldContent = codegenDir.read(filename);
        // Hash the concrete node including the query text.
        var hasher = require('crypto').createHash('md5');
        hasher.update('cache-breaker-6');
        hasher.update(JSON.stringify(generatedNode));
        if (typeText) {
          hasher.update(typeText);
        }
        if (_persistQuery) {
          hasher.update('persisted');
        }
        hash = hasher.digest('hex');
        return extractHash(oldContent);
      });
      if (hash === oldHash) {
        codegenDir.markUnchanged(filename);

        if (_persistQuery) {
          codegenDir.markUnchanged(queryMapFilename);
        }
        return null;
      }
      if (codegenDir.onlyValidate) {
        codegenDir.markUpdated(filename);

        if (_persistQuery) {
          codegenDir.markUpdated(queryMapFilename);
        }
        return null;
      }
      if (_persistQuery) {
        switch (generatedNode.kind) {
          case require('./RelayConcreteNode').REQUEST:
            var operationText = generatedNode.text;
            devOnlyProperties.text = operationText;
            var queryId = yield _persistQuery(require('fbjs/lib/nullthrows')(operationText));
            queryMap = {};
            queryMap[queryId] = operationText;
            generatedNode = (0, _extends3['default'])({}, generatedNode, {
              text: null,
              id: queryId
            });
            break;
          case require('./RelayConcreteNode').BATCH_REQUEST:
            devOnlyProperties.requests = generatedNode.requests.map(function (request) {
              return {
                text: request.text
              };
            });
            generatedNode = (0, _extends3['default'])({}, generatedNode, {
              requests: yield Promise.all(generatedNode.requests.map((() => {
                var _ref2 = (0, _asyncToGenerator3.default)(function* (request) {
                  var requestOperationText = request.text;
                  var queryId = yield _persistQuery(require('fbjs/lib/nullthrows')(requestOperationText));
                  queryMap = {};
                  queryMap[queryId] = requestOperationText;
                  return (0, _extends3['default'])({}, request, {
                    text: null,
                    id: queryId
                  });
                });

                return function (_x10) {
                  return _ref2.apply(this, arguments);
                };
              })()))
            });
            break;
          case require('./RelayConcreteNode').FRAGMENT:
            // Do not persist fragments.
            break;
          default:
            generatedNode.kind;
        }
      }
    }

    var devOnlyAssignments = require('./deepMergeAssignments')('node', devOnlyProperties);

    var moduleText = formatModule({
      moduleName: moduleName,
      documentType: typeName,
      docText: docText,
      typeText: typeText,
      hash: hash ? '@relayHash ' + hash : null,
      concreteText: require('./dedupeJSONStringify')(generatedNode),
      devOnlyAssignments: devOnlyAssignments,
      relayRuntimeModule: relayRuntimeModule,
      sourceHash: sourceHash
    });

    codegenDir.writeFile(filename, moduleText);
    if (_persistQuery && queryMap) {
      codegenDir.writeFile(queryMapFilename, JSON.stringify(queryMap, null, 2));
    }

    return generatedNode;
  });

  return function writeRelayGeneratedFile(_x, _x2, _x3, _x4, _x5, _x6, _x7, _x8, _x9) {
    return _ref.apply(this, arguments);
  };
})();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _require = require('./GraphQLCompilerPublic'),
    Profiler = _require.Profiler;

// TODO T21875029 ../../relay-runtime/util/RelayConcreteNode


function extractHash(text) {
  if (!text) {
    return null;
  }
  if (/<<<<<|>>>>>/.test(text)) {
    // looks like a merge conflict
    return null;
  }
  var match = text.match(/@relayHash (\w{32})\b/m);
  return match && match[1];
}

module.exports = writeRelayGeneratedFile;