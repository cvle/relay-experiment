/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @providesModule RelayCompilerBin
 * @format
 */

'use strict';

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _defineProperty3 = _interopRequireDefault(require('babel-runtime/helpers/defineProperty'));

var _toConsumableArray3 = _interopRequireDefault(require('babel-runtime/helpers/toConsumableArray'));

let run = (() => {
  var _ref2 = (0, _asyncToGenerator3.default)(function* (options) {
    var _parserConfigs;

    var schemaPath = require('path').resolve(process.cwd(), options.schema);
    if (!require('fs').existsSync(schemaPath)) {
      throw new Error('--schema path does not exist: ' + schemaPath + '.');
    }
    var srcDir = require('path').resolve(process.cwd(), options.src);
    if (!require('fs').existsSync(srcDir)) {
      throw new Error('--src path does not exist: ' + srcDir + '.');
    }

    var persist = options.persist;
    var persistOutput = options['persist-output'];
    if (persistOutput) {
      persistOutput = require('path').resolve(process.cwd(), persistOutput);
      var persistOutputDir = require('path').dirname(persistOutput);
      if (!require('fs').existsSync(persistOutputDir)) {
        throw new Error('--persist-output path does not exist: ' + persistOutputDir + '.');
      }

      var persistOutputFileExtension = require('path').extname(persistOutput);
      if (persistOutputFileExtension !== '.json') {
        throw new Error('--persist-output must be a path to a .json file: ' + persistOutput + '.');
      }
    }

    if (options.watch && !options.watchman) {
      throw new Error('Watchman is required to watch for changes.');
    }
    if (options.watch && !hasWatchmanRootFile(srcDir)) {
      throw new Error(('\n--watch requires that the src directory have a valid watchman "root" file.\n\nRoot files can include:\n- A .git/ Git folder\n- A .hg/ Mercurial folder\n- A .watchmanconfig file\n\nEnsure that one such file exists in ' + srcDir + ' or its parents.\n    ').trim());
    }
    if (options.verbose && options.quiet) {
      throw new Error("I can't be quiet and verbose at the same time");
    }

    var reporter = new ConsoleReporter({
      verbose: options.verbose,
      quiet: options.quiet
    });

    var useWatchman = options.watchman && (yield WatchmanClient.isAvailable());

    var schema = getSchema(schemaPath);

    var languagePlugin = getLanguagePlugin(options.language);

    var inputExtensions = options.extensions || languagePlugin.inputExtensions;
    var outputExtension = languagePlugin.outputExtension;

    var sourceParserName = inputExtensions.join('/');
    var sourceWriterName = outputExtension;

    var sourceModuleParser = require('./RelaySourceModuleParser')(languagePlugin.findGraphQLTags);

    var artifactDirectory = options.artifactDirectory ? // $FlowFixMe artifactDirectory can’t be null/undefined at this point
    require('path').resolve(process.cwd(), options.artifactDirectory) : null;

    var generatedDirectoryName = artifactDirectory || '__generated__';

    var sourceSearchOptions = {
      extensions: inputExtensions,
      include: options.include,
      exclude: ['**/*.graphql.*'].concat((0, _toConsumableArray3['default'])(options.exclude)) // Do not include artifacts
    };
    var graphqlSearchOptions = {
      extensions: ['graphql'],
      include: options.include,
      exclude: [require('path').relative(srcDir, schemaPath)].concat(options.exclude)
    };

    var parserConfigs = (_parserConfigs = {}, (0, _defineProperty3['default'])(_parserConfigs, sourceParserName, {
      baseDir: srcDir,
      getFileFilter: sourceModuleParser.getFileFilter,
      getParser: sourceModuleParser.getParser,
      getSchema: function getSchema() {
        return schema;
      },
      watchmanExpression: useWatchman ? buildWatchExpression(sourceSearchOptions) : null,
      filepaths: useWatchman ? null : getFilepathsFromGlob(srcDir, sourceSearchOptions)
    }), (0, _defineProperty3['default'])(_parserConfigs, 'graphql', {
      baseDir: srcDir,
      getParser: DotGraphQLParser.getParser,
      getSchema: function getSchema() {
        return schema;
      },
      watchmanExpression: useWatchman ? buildWatchExpression({
        extensions: ['graphql'],
        include: options.include,
        exclude: options.exclude
      }) : null,
      filepaths: useWatchman ? null : getFilepathsFromGlob(srcDir, {
        extensions: ['graphql'],
        include: options.include,
        exclude: options.exclude
      })
    }), _parserConfigs);
    var writerConfigs = (0, _defineProperty3['default'])({}, sourceWriterName, {
      getWriter: getRelayFileWriter(srcDir, languagePlugin, artifactDirectory, persist, persistOutput),
      isGeneratedFile: function isGeneratedFile(filePath) {
        return (filePath.endsWith('.graphql.' + outputExtension) || filePath.endsWith('.queryMap.json')) && filePath.includes(generatedDirectoryName);
      },
      parser: sourceParserName,
      baseParsers: ['graphql']
    });
    var codegenRunner = new CodegenRunner({
      reporter: reporter,
      parserConfigs: parserConfigs,
      writerConfigs: writerConfigs,
      onlyValidate: options.validate,
      // TODO: allow passing in a flag or detect?
      sourceControl: null
    });
    if (!options.validate && !options.watch && options.watchman) {
      // eslint-disable-next-line no-console
      console.log('HINT: pass --watch to keep watching for changes.');
    }
    var result = options.watch ? yield codegenRunner.watchAll() : yield codegenRunner.compileAll();

    if (result === 'ERROR') {
      process.exit(100);
    }
    if (options.validate && result !== 'NO_CHANGES') {
      process.exit(101);
    }
  });

  return function run(_x) {
    return _ref2.apply(this, arguments);
  };
})();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

require('babel-polyfill');

var _require = require('./GraphQLCompilerPublic'),
    CodegenRunner = _require.CodegenRunner,
    ConsoleReporter = _require.ConsoleReporter,
    WatchmanClient = _require.WatchmanClient,
    DotGraphQLParser = _require.DotGraphQLParser;

var _require2 = require('graphql'),
    buildASTSchema = _require2.buildASTSchema,
    buildClientSchema = _require2.buildClientSchema,
    parse = _require2.parse,
    printSchema = _require2.printSchema;

var commonTransforms = require('./RelayIRTransforms').commonTransforms,
    codegenTransforms = require('./RelayIRTransforms').codegenTransforms,
    fragmentTransforms = require('./RelayIRTransforms').fragmentTransforms,
    printTransforms = require('./RelayIRTransforms').printTransforms,
    queryTransforms = require('./RelayIRTransforms').queryTransforms,
    schemaExtensions = require('./RelayIRTransforms').schemaExtensions;

function buildWatchExpression(options) {
  return ['allof', ['type', 'f'], ['anyof'].concat((0, _toConsumableArray3['default'])(options.extensions.map(function (ext) {
    return ['suffix', ext];
  }))), ['anyof'].concat((0, _toConsumableArray3['default'])(options.include.map(function (include) {
    return ['match', include, 'wholename'];
  })))].concat((0, _toConsumableArray3['default'])(options.exclude.map(function (exclude) {
    return ['not', ['match', exclude, 'wholename']];
  })));
}

function getFilepathsFromGlob(baseDir, options) {
  var extensions = options.extensions,
      include = options.include,
      exclude = options.exclude;

  var patterns = include.map(function (inc) {
    return inc + '/*.+(' + extensions.join('|') + ')';
  });

  var glob = require('fast-glob');
  return glob.sync(patterns, {
    cwd: baseDir,
    ignore: exclude
  });
}

/**
 * Unless the requested plugin is the builtin `javascript` one, import a
 * language plugin as either a CommonJS or ES2015 module.
 *
 * When importing, first check if it’s a path to an existing file, otherwise
 * assume it’s a package and prepend the plugin namespace prefix.
 *
 * Make sure to always use Node's `require` function, which otherwise would get
 * replaced with `__webpack_require__` when bundled using webpack, by using
 * `eval` to get it at runtime.
 */
function getLanguagePlugin(language) {
  if (language === 'javascript') {
    return require('./RelayLanguagePluginJavaScript')();
  } else {
    var pluginPath = require('path').resolve(process.cwd(), language);
    var requirePath = require('fs').existsSync(pluginPath) ? pluginPath : 'relay-compiler-language-' + language;
    try {
      // eslint-disable-next-line no-eval
      var languagePlugin = eval('require')(requirePath);
      if (languagePlugin['default']) {
        languagePlugin = languagePlugin['default'];
      }
      if (typeof languagePlugin === 'function') {
        return languagePlugin();
      } else {
        throw new Error('Expected plugin to export a function.');
      }
    } catch (err) {
      var e = new Error('Unable to load language plugin ' + requirePath + ': ' + err.message);
      e.stack = err.stack;
      throw e;
    }
  }
}

function getRelayFileWriter(baseDir, languagePlugin, outputDir, persist, persistOutput) {
  return function (_ref) {
    var onlyValidate = _ref.onlyValidate,
        schema = _ref.schema,
        documents = _ref.documents,
        baseDocuments = _ref.baseDocuments,
        sourceControl = _ref.sourceControl,
        reporter = _ref.reporter;
    return new (require('./RelayFileWriter'))({
      config: {
        baseDir: baseDir,
        compilerTransforms: {
          commonTransforms: commonTransforms,
          codegenTransforms: codegenTransforms,
          fragmentTransforms: fragmentTransforms,
          printTransforms: printTransforms,
          queryTransforms: queryTransforms
        },
        customScalars: {},
        formatModule: languagePlugin.formatModule,
        inputFieldWhiteListForFlow: [],
        schemaExtensions: schemaExtensions,
        useHaste: false,
        extension: languagePlugin.outputExtension,
        typeGenerator: languagePlugin.typeGenerator,
        outputDir: outputDir,
        persistQuery: persist ? require('./persistQuery') : undefined,
        persistOutput: persistOutput
      },
      onlyValidate: onlyValidate,
      schema: schema,
      baseDocuments: baseDocuments,
      documents: documents,
      reporter: reporter,
      sourceControl: sourceControl
    });
  };
}

function getSchema(schemaPath) {
  try {
    var source = require('fs').readFileSync(schemaPath, 'utf8');
    if (require('path').extname(schemaPath) === '.json') {
      source = printSchema(buildClientSchema(JSON.parse(source).data));
    }
    source = '\n  directive @include(if: Boolean) on FRAGMENT_SPREAD | FIELD\n  directive @skip(if: Boolean) on FRAGMENT_SPREAD | FIELD\n\n  ' + source + '\n  ';
    return buildASTSchema(parse(source), { assumeValid: true });
  } catch (error) {
    throw new Error(('\nError loading schema. Expected the schema to be a .graphql or a .json\nfile, describing your GraphQL server\'s API. Error detail:\n\n' + error.stack + '\n    ').trim());
  }
}

// Ensure that a watchman "root" file exists in the given directory
// or a parent so that it can be watched
var WATCHMAN_ROOT_FILES = ['.git', '.hg', '.watchmanconfig'];

function hasWatchmanRootFile(testPath) {
  while (require('path').dirname(testPath) !== testPath) {
    if (WATCHMAN_ROOT_FILES.some(function (file) {
      return require('fs').existsSync(require('path').join(testPath, file));
    })) {
      return true;
    }
    testPath = require('path').dirname(testPath);
  }
  return false;
}

// Collect args
var argv = require('yargs').usage('Create Relay generated files\n\n' + '$0 --schema <path> --src <path> [--watch]').options({
  schema: {
    describe: 'Path to schema.graphql or schema.json',
    demandOption: true,
    type: 'string'
  },
  src: {
    describe: 'Root directory of application code',
    demandOption: true,
    type: 'string'
  },
  include: {
    array: true,
    'default': ['**'],
    describe: 'Directories to include under src',
    type: 'string'
  },
  exclude: {
    array: true,
    'default': ['**/node_modules/**', '**/__mocks__/**', '**/__tests__/**', '**/__generated__/**'],
    describe: 'Directories to ignore under src',
    type: 'string'
  },
  extensions: {
    array: true,
    describe: 'File extensions to compile (defaults to extensions provided by the ' + 'language plugin)',
    type: 'string'
  },
  verbose: {
    describe: 'More verbose logging',
    type: 'boolean'
  },
  quiet: {
    describe: 'No output to stdout',
    type: 'boolean'
  },
  watchman: {
    describe: 'Use watchman when not in watch mode',
    type: 'boolean',
    'default': true
  },
  watch: {
    describe: 'If specified, watches files and regenerates on changes',
    type: 'boolean'
  },
  validate: {
    describe: 'Looks for pending changes and exits with non-zero code instead of ' + 'writing to disk',
    type: 'boolean',
    'default': false
  },
  language: {
    describe: 'The name of the language plugin used for input files and artifacts',
    type: 'string',
    'default': 'javascript'
  },
  artifactDirectory: {
    describe: 'A specific directory to output all artifacts to. When enabling this ' + 'the babel plugin needs `artifactDirectory` set as well.',
    type: 'string',
    'default': null
  },
  persist: {
    describe: 'Use an md5 hash as query id to replace operation text',
    type: 'boolean'
  },
  'persist-output': {
    describe: 'The json filepath where the complete query map file will be written to',
    type: 'string',
    'default': null
  }
}).help().argv;

// Run script with args
// $FlowFixMe: Invalid types for yargs. Please fix this when touching this code.
run(argv)['catch'](function (error) {
  console.error(String(error.stack || error));
  process.exit(1);
});