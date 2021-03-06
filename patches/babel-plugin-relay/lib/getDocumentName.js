/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule getDocumentName
 * 
 * @format
 */

'use strict';

var PROVIDES_MODULE = 'providesModule';

/**
 * Given a path anywhere in a document, produce the name of that document.
 */
function getDocumentName(path, state) {
  var topPath = path;
  while (topPath.parentPath) {
    topPath = topPath.parentPath;
  }
  // Cache the document name onto this top level path.
  var documentName = topPath.documentName;
  if (!documentName) {
    var parent = topPath.parent;
    if (parent.comments && parent.comments.length) {
      var docblock = parent.comments[0].value || '';
      var propertyRegex = /@(\S+) *(\S*)/g;
      var captures = void 0;
      while (captures = propertyRegex.exec(docblock)) {
        var property = captures[1];
        var value = captures[2];
        if (property === PROVIDES_MODULE) {
          documentName = value.replace(/[\.-:]/g, '_');
          break;
        }
      }
    }
    var basename = state.file && state.file.opts.basename;
    if (basename && !documentName) {
      var _captures = basename.match(/^[_A-Za-z][_0-9A-Za-z]*/);
      if (_captures) {
        documentName = _captures[0];
      }
    }
    documentName = documentName || 'UnknownFile';
    topPath.documentName = documentName;
  }
  return documentName;
}

module.exports = getDocumentName;