/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule RelayFileWriter
 * 
 * @format
 */

'use strict';

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _extends3 = _interopRequireDefault(require('babel-runtime/helpers/extends'));

var _classCallCheck3 = _interopRequireDefault(require('babel-runtime/helpers/classCallCheck'));

var _toConsumableArray3 = _interopRequireDefault(require('babel-runtime/helpers/toConsumableArray'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _require = require('./GraphQLCompilerPublic'),
    ASTConvert = _require.ASTConvert,
    CodegenDirectory = _require.CodegenDirectory,
    CompilerContext = _require.CompilerContext,
    Profiler = _require.Profiler,
    SchemaUtils = _require.SchemaUtils;

var _require2 = require('immutable'),
    ImmutableMap = _require2.Map;

var isExecutableDefinitionAST = SchemaUtils.isExecutableDefinitionAST;

var RelayFileWriter = function () {
  function RelayFileWriter(_ref) {
    var config = _ref.config,
        onlyValidate = _ref.onlyValidate,
        baseDocuments = _ref.baseDocuments,
        documents = _ref.documents,
        schema = _ref.schema,
        reporter = _ref.reporter,
        sourceControl = _ref.sourceControl;
    (0, _classCallCheck3['default'])(this, RelayFileWriter);

    this._baseDocuments = baseDocuments || ImmutableMap();
    this._baseSchema = schema;
    this._config = config;
    this._documents = documents;
    this._onlyValidate = onlyValidate;
    this._reporter = reporter;
    this._sourceControl = sourceControl;

    validateConfig(this._config);
  }

  RelayFileWriter.prototype.writeAll = function writeAll() {
    var _this = this;

    return Profiler.asyncContext('RelayFileWriter.writeAll', (0, _asyncToGenerator3.default)(function* () {
      // Can't convert to IR unless the schema already has Relay-local extensions
      var transformedSchema = ASTConvert.transformASTSchema(_this._baseSchema, _this._config.schemaExtensions);
      var extendedSchema = ASTConvert.extendASTSchema(transformedSchema, _this._baseDocuments.merge(_this._documents).valueSeq().toArray());

      // Build a context from all the documents
      var baseDefinitionNames = new Set();
      _this._baseDocuments.forEach(function (doc) {
        doc.definitions.forEach(function (def) {
          if (isExecutableDefinitionAST(def) && def.name) {
            baseDefinitionNames.add(def.name.value);
          }
        });
      });
      var definitionsMeta = new Map();
      var getDefinitionMeta = function getDefinitionMeta(definitionName) {
        var definitionMeta = definitionsMeta.get(definitionName);
        require('fbjs/lib/invariant')(definitionMeta, 'RelayFileWriter: Could not determine source for definition: `%s`.', definitionName);
        return definitionMeta;
      };
      var allOutputDirectories = new Map();
      var addCodegenDir = function addCodegenDir(dirPath) {
        var codegenDir = new CodegenDirectory(dirPath, {
          onlyValidate: _this._onlyValidate
        });
        allOutputDirectories.set(dirPath, codegenDir);
        return codegenDir;
      };

      var configOutputDirectory = void 0;
      if (_this._config.outputDir) {
        configOutputDirectory = addCodegenDir(_this._config.outputDir);
      }

      _this._documents.forEach(function (doc, filePath) {
        doc.definitions.forEach(function (def) {
          if (def.name) {
            definitionsMeta.set(def.name.value, {
              dir: require('path').join(_this._config.baseDir, require('path').dirname(filePath)),
              ast: def
            });
          }
        });
      });

      // Verify using local and global rules, can run global verifications here
      // because all files are processed together
      var validationRules = [].concat((0, _toConsumableArray3['default'])(require('./RelayValidator').LOCAL_RULES), (0, _toConsumableArray3['default'])(require('./RelayValidator').GLOBAL_RULES));
      var customizedValidationRules = _this._config.validationRules;
      if (customizedValidationRules) {
        validationRules = [].concat((0, _toConsumableArray3['default'])(validationRules), (0, _toConsumableArray3['default'])(customizedValidationRules.LOCAL_RULES || []), (0, _toConsumableArray3['default'])(customizedValidationRules.GLOBAL_RULES || []));
      }

      var definitions = ASTConvert.convertASTDocumentsWithBase(extendedSchema, _this._baseDocuments.valueSeq().toArray(), _this._documents.valueSeq().toArray(), validationRules, require('./RelayParser').transform.bind(require('./RelayParser')));

      var compilerContext = new CompilerContext(_this._baseSchema, extendedSchema).addAll(definitions);

      var getGeneratedDirectory = function getGeneratedDirectory(definitionName) {
        if (configOutputDirectory) {
          return configOutputDirectory;
        }
        var generatedPath = require('path').join(getDefinitionMeta(definitionName).dir, '__generated__');
        var cachedDir = allOutputDirectories.get(generatedPath);
        if (!cachedDir) {
          cachedDir = addCodegenDir(generatedPath);
        }
        return cachedDir;
      };

      var transformedFlowContext = compilerContext.applyTransforms(_this._config.typeGenerator.transforms, _this._reporter);
      var transformedQueryContext = compilerContext.applyTransforms([].concat((0, _toConsumableArray3['default'])(_this._config.compilerTransforms.commonTransforms), (0, _toConsumableArray3['default'])(_this._config.compilerTransforms.queryTransforms)), _this._reporter);
      var artifacts = require('./compileRelayArtifacts')(compilerContext, _this._config.compilerTransforms, _this._reporter);

      var existingFragmentNames = new Set(definitions.map(function (definition) {
        return definition.name;
      }));

      // TODO(T22651734): improve this to correctly account for fragments that
      // have generated flow types.
      baseDefinitionNames.forEach(function (baseDefinitionName) {
        existingFragmentNames['delete'](baseDefinitionName);
      });

      var formatModule = Profiler.instrument(_this._config.formatModule, 'RelayFileWriter:formatModule');

      var persistQuery = _this._config.persistQuery ? Profiler.instrumentWait(_this._config.persistQuery, 'RelayFileWriter:persistQuery') : null;

      try {
        yield Promise.all(artifacts.map((() => {
          var _ref3 = (0, _asyncToGenerator3.default)(function* (node) {
            if (baseDefinitionNames.has(node.name)) {
              // don't add definitions that were part of base context
              return;
            }
            if (node.metadata && node.metadata.deferred) {
              // don't write deferred operations, the batch request is
              // responsible for them
              return;
            }
            var relayRuntimeModule = _this._config.relayRuntimeModule || 'relay-runtime';

            var typeNode = transformedFlowContext.get(node.name);
            require('fbjs/lib/invariant')(typeNode, 'RelayFileWriter: did not compile types for: %s', node.name);

            var typeText = _this._config.typeGenerator.generate(typeNode, {
              customScalars: _this._config.customScalars,
              enumsHasteModule: _this._config.enumsHasteModule,
              existingFragmentNames: existingFragmentNames,
              inputFieldWhiteList: _this._config.inputFieldWhiteListForFlow,
              relayRuntimeModule: relayRuntimeModule,
              useHaste: _this._config.useHaste,
              useSingleArtifactDirectory: !!_this._config.outputDir
            });

            var sourceHash = Profiler.run('hashGraphQL', function () {
              return require('./md5')(require('graphql').print(getDefinitionMeta(node.name).ast));
            });

            yield require('./writeRelayGeneratedFile')(getGeneratedDirectory(node.name), node, formatModule, typeText, persistQuery, _this._config.platform, relayRuntimeModule, sourceHash, _this._config.extension);
          });

          return function (_x) {
            return _ref3.apply(this, arguments);
          };
        })()));

        var _generateExtraFiles = _this._config.generateExtraFiles;
        if (_generateExtraFiles) {
          Profiler.run('RelayFileWriter:generateExtraFiles', function () {
            var configDirectory = _this._config.outputDir;
            _generateExtraFiles(function (dir) {
              var outputDirectory = dir || configDirectory;
              require('fbjs/lib/invariant')(outputDirectory, 'RelayFileWriter: cannot generate extra files without specifying ' + 'an outputDir in the config or passing it in.');
              var outputDir = allOutputDirectories.get(outputDirectory);
              if (!outputDir) {
                outputDir = addCodegenDir(outputDirectory);
              }
              return outputDir;
            }, transformedQueryContext, getGeneratedDirectory);
          });
        }

        // clean output directories
        allOutputDirectories.forEach(function (dir) {
          dir.deleteExtraFiles();
        });

        if (_this._config.persistQuery) {
          _this.writeCompleteQueryMap(allOutputDirectories);
        }

        if (_this._sourceControl && !_this._onlyValidate) {
          yield CodegenDirectory.sourceControlAddRemove(_this._sourceControl, Array.from(allOutputDirectories.values()));
        }
      } catch (error) {
        var details = void 0;
        try {
          details = JSON.parse(error.message);
        } catch (_) {}
        if (details && details.name === 'GraphQL2Exception' && details.message) {
          throw new Error('GraphQL error writing modules:\n' + details.message);
        }
        throw new Error('Error writing modules:\n' + String(error.stack || error));
      }

      return allOutputDirectories;
    }));
  };

  /**
   * Find all *.queryMap.json and write it into a single file.
   * @param allOutputDirectories
   */


  RelayFileWriter.prototype.writeCompleteQueryMap = function writeCompleteQueryMap(allOutputDirectories) {
    var queryMapFilePath = this._config.persistOutput || this._config.baseDir + '/complete.queryMap.json';
    try {
      var queryMapJson = {};
      allOutputDirectories.forEach(function (d) {
        require('fs').readdirSync(d._dir).forEach(function (f) {
          if (f.endsWith('.queryMap.json')) {
            var singleQueryMap = JSON.parse(require('fs').readFileSync(require('path').join(d._dir, f), 'utf8'));
            queryMapJson = (0, _extends3['default'])({}, queryMapJson, singleQueryMap);
          }
        });
      });

      require('fs').writeFileSync(queryMapFilePath, JSON.stringify(queryMapJson, null, 2));
      this._reporter.reportMessage('Complete queryMap written to ' + queryMapFilePath);
    } catch (err) {
      this._reporter.reportError('RelayFileWriter.writeCompleteQueryMap', err);
    }
  };

  return RelayFileWriter;
}();

function validateConfig(config) {
  if (config.buildCommand) {
    process.stderr.write('WARNING: RelayFileWriter: For RelayFileWriter to work you must ' + 'replace config.buildCommand with config.formatModule.\n');
  }
}

module.exports = RelayFileWriter;