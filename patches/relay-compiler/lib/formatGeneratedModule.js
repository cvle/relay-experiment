/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule formatGeneratedModule
 * 
 * @format
 */

'use strict';

var formatGeneratedModule = function formatGeneratedModule(_ref) {
  var moduleName = _ref.moduleName,
      documentType = _ref.documentType,
      docText = _ref.docText,
      concreteText = _ref.concreteText,
      typeText = _ref.typeText,
      hash = _ref.hash,
      relayRuntimeModule = _ref.relayRuntimeModule,
      sourceHash = _ref.sourceHash;

  var documentTypeImport = documentType ? 'import type { ' + documentType + ' } from \'' + relayRuntimeModule + '\';' : '';
  var docTextComment = docText ? '\n/*\n' + docText.trim() + '\n*/\n' : '';
  var hashText = hash ? '\n * ' + hash : '';
  return '/**\n * ' + '@' + 'flow' + hashText + '\n */\n\n/* eslint-disable */\n\n\'use strict\';\n\n/*::\n' + documentTypeImport + '\n' + (typeText || '') + '\n*/\n\n' + docTextComment + '\nconst node/*: ' + (documentType || 'empty') + '*/ = ' + concreteText + ';\n(node/*: any*/).hash = \'' + sourceHash + '\';\nmodule.exports = node;\n';
};

module.exports = formatGeneratedModule;