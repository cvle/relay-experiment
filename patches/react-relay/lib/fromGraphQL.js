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
 * Converts GraphQL nodes to RelayQuery nodes.
 */
var fromGraphQL = {
  Field: function Field(query) {
    var node = createNode(query, require('./RelayQuery').Field);
    require('fbjs/lib/invariant')(node instanceof require('./RelayQuery').Field, 'fromGraphQL.Field(): Expected a GraphQL field node.');
    return node;
  },
  Fragment: function Fragment(query) {
    var node = createNode(query, require('./RelayQuery').Fragment);
    require('fbjs/lib/invariant')(node instanceof require('./RelayQuery').Fragment, 'fromGraphQL.Fragment(): Expected a GraphQL fragment node.');
    return node;
  },
  Query: function Query(query) {
    var node = createNode(query, require('./RelayQuery').Root);
    require('fbjs/lib/invariant')(node instanceof require('./RelayQuery').Root, 'fromGraphQL.Query(): Expected a root node.');
    return node;
  },
  Operation: function Operation(query) {
    var node = createNode(query, require('./RelayQuery').Operation);
    require('fbjs/lib/invariant')(node instanceof require('./RelayQuery').Operation, 'fromGraphQL.Operation(): Expected a mutation/subscription node.');
    return node;
  }
};

function createNode(query, desiredType) {
  var variables = {};
  var route = require('./RelayMetaRoute').get('$fromGraphQL');
  return desiredType.create(query, route, variables);
}

module.exports = fromGraphQL;