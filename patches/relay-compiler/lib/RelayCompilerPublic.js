/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @providesModule RelayCompilerPublic
 * @format
 */

'use strict';

var _require = require('./GraphQLCompilerPublic'),
    ASTConvert = _require.ASTConvert,
    CodegenRunner = _require.CodegenRunner,
    ConsoleReporter = _require.ConsoleReporter,
    MultiReporter = _require.MultiReporter;

var RelayJSModuleParser = require('./RelaySourceModuleParser')(require('./FindGraphQLTags').find);

module.exports = {
  ConsoleReporter: ConsoleReporter,
  Parser: require('./RelayParser'),
  CodeGenerator: require('./RelayCodeGenerator'),

  GraphQLCompilerContext: require('./GraphQLCompilerContext'),

  /** @deprecated Use JSModuleParser. */
  FileIRParser: RelayJSModuleParser,

  FileWriter: require('./RelayFileWriter'),
  IRTransforms: require('./RelayIRTransforms'),
  JSModuleParser: RelayJSModuleParser,
  MultiReporter: MultiReporter,
  Runner: CodegenRunner,
  compileRelayArtifacts: require('./compileRelayArtifacts'),
  formatGeneratedModule: require('./formatGeneratedModule'),
  convertASTDocuments: ASTConvert.convertASTDocuments,
  transformASTSchema: ASTConvert.transformASTSchema
};