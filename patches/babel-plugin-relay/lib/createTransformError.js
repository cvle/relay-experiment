/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule createTransformError
 * 
 * @format
 */

'use strict';

/**
 * In case of an error during transform, determine if it should be logged
 * to the console and/or printed in the source.
 */
function createTransformError(error) {
  if (error instanceof require('./RelayTransformError')) {
    return 'Relay Transform Error: ' + error.message;
  }

  var sourceText = error.sourceText,
      validationErrors = error.validationErrors;

  if (validationErrors && sourceText) {
    var sourceLines = sourceText.split('\n');
    return validationErrors.map(function (_ref) {
      var message = _ref.message,
          locations = _ref.locations;

      return 'GraphQL Validation Error: ' + message + '\n' + locations.map(function (location) {
        var preview = sourceLines[location.line - 1];
        return preview && ['>', '> ' + preview, '> ' + ' '.repeat(location.column - 1) + '^^^'].join('\n');
      }).filter(Boolean).join('\n');
    }).join('\n');
  }

  return require('util').format('Relay Transform Error: %s\n\n%s', error.message, error.stack);
}

module.exports = createTransformError;