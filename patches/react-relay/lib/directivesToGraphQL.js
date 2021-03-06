/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */

'use strict';

/**
 * @internal
 *
 * Convert plain object `{name, arguments}` directives to GraphQL directive
 * nodes.
 */
function directivesToGraphQL(directives) {
  return directives.map(function (_ref) {
    var directiveName = _ref.name,
        args = _ref.args;

    var concreteArguments = args.map(function (_ref2) {
      var argName = _ref2.name,
          value = _ref2.value;

      var concreteArgument = null;
      if (Array.isArray(value)) {
        concreteArgument = value.map(require('./QueryBuilder').createCallValue);
      } else if (value != null) {
        concreteArgument = require('./QueryBuilder').createCallValue(value);
      }
      return require('./QueryBuilder').createDirectiveArgument(argName, concreteArgument);
    });
    return require('./QueryBuilder').createDirective(directiveName, concreteArguments);
  });
}

module.exports = directivesToGraphQL;