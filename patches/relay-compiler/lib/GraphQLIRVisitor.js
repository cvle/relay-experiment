/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule GraphQLIRVisitor
 * 
 * @format
 */
'use strict';

var visit = require('graphql').visit;

var NodeKeys = {
  Argument: ['value'],
  Batch: ['requests', 'fragment'],
  Condition: ['condition', 'selections'],
  Directive: ['args'],
  Fragment: ['argumentDefinitions', 'directives', 'selections'],
  FragmentSpread: ['args', 'directives'],
  InlineFragment: ['directives', 'selections'],
  LinkedField: ['args', 'directives', 'selections'],
  Literal: [],
  LocalArgumentDefinition: [],
  Request: ['root'],
  Root: ['argumentDefinitions', 'directives', 'selections'],
  RootArgumentDefinition: [],
  ScalarField: ['args', 'directives'],
  Variable: [],
  DeferrableFragmentSpread: ['args', 'directives', 'fragmentArgs']
};

function visitIR(root, visitor) {
  return visit(root, visitor, NodeKeys);
}

module.exports = { visit: visitIR };