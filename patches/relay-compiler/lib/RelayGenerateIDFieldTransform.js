/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @providesModule RelayGenerateIDFieldTransform
 * @format
 */

'use strict';

var _extends3 = _interopRequireDefault(require('babel-runtime/helpers/extends'));

var _toConsumableArray3 = _interopRequireDefault(require('babel-runtime/helpers/toConsumableArray'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _require = require('./RelayTransformUtils'),
    hasSelection = _require.hasSelection;

var _require2 = require('graphql'),
    assertAbstractType = _require2.assertAbstractType,
    assertCompositeType = _require2.assertCompositeType,
    isInterfaceType = _require2.isInterfaceType,
    getNullableType = _require2.getNullableType,
    GraphQLInterfaceType = _require2.GraphQLInterfaceType,
    GraphQLObjectType = _require2.GraphQLObjectType,
    GraphQLSchema = _require2.GraphQLSchema;

var _require3 = require('./GraphQLCompilerPublic'),
    CompilerContext = _require3.CompilerContext,
    SchemaUtils = _require3.SchemaUtils,
    IRTransformer = _require3.IRTransformer;

var canHaveSelections = SchemaUtils.canHaveSelections,
    getRawType = SchemaUtils.getRawType,
    implementsInterface = SchemaUtils.implementsInterface,
    isAbstractType = SchemaUtils.isAbstractType,
    mayImplement = SchemaUtils.mayImplement;


var ID = 'id';
var ID_KEY = '__id';
var ID_TYPE = 'ID';
var NODE_TYPE = 'Node';

/**
 * A transform that adds a `__id` field on any type that has a `Node` or `id`
 * field but where there is no unaliased `__id` selection.
 */
function relayGenerateIDFieldTransform(context) {
  return IRTransformer.transform(context, {
    LinkedField: visitNodeWithSelections,
    Fragment: visitNodeWithSelections
  });
}

function visitNodeWithSelections(node) {
  var transformedNode = this.traverse(node);

  // If the field already has an `__id` selection, do nothing.
  if (hasSelection(node, '__id')) {
    return transformedNode;
  }

  var context = this.getContext();
  var schema = context.serverSchema;
  var unmodifiedType = assertCompositeType(getRawType(node.type));
  var idFieldDefinition = getIDFieldDefinition(schema, unmodifiedType);

  // If the field type has a ID field add a selection for that field.
  if (idFieldDefinition && canHaveSelections(unmodifiedType)) {
    return (0, _extends3['default'])({}, transformedNode, {
      selections: [].concat((0, _toConsumableArray3['default'])(transformedNode.selections), [buildSelectionFromFieldDefinition(idFieldDefinition)])
    });
  }

  // - If the field type is abstract, then generate a `... on Node { __id: id }`
  //   fragment if *any* concrete type implements `Node`. Then generate a
  //   `... on PossibleType { __id: id }` for every concrete type that does
  //   *not* implement `Node`.
  // - If the field type implements the `Node` interface, return a selection of
  //   the one field in the `Node` interface that is of type `ID` or `ID!`.
  if (isAbstractType(unmodifiedType)) {
    var selections = [].concat((0, _toConsumableArray3['default'])(transformedNode.selections));
    if (mayImplement(schema, unmodifiedType, NODE_TYPE)) {
      var nodeType = assertCompositeType(schema.getType(NODE_TYPE));
      var nodeIDFieldDefinition = getNodeIDFieldDefinition(schema);
      if (nodeIDFieldDefinition) {
        selections.push(buildIDFragmentFromFieldDefinition(nodeType, nodeIDFieldDefinition));
      }
    }
    var abstractType = assertAbstractType(unmodifiedType);
    schema.getPossibleTypes(abstractType).forEach(function (possibleType) {
      if (!implementsInterface(possibleType, NODE_TYPE)) {
        var possibleTypeIDFieldDefinition = getIDFieldDefinition(schema, possibleType);
        if (possibleTypeIDFieldDefinition) {
          selections.push(buildIDFragmentFromFieldDefinition(possibleType, possibleTypeIDFieldDefinition));
        }
      }
    });
    return (0, _extends3['default'])({}, transformedNode, {
      selections: selections
    });
  }

  return transformedNode;
}

/**
 * @internal
 *
 * Returns IR for `... on FRAGMENT_TYPE { __id: id }`
 */
function buildIDFragmentFromFieldDefinition(fragmentType, idField) {
  return {
    kind: 'InlineFragment',
    directives: [],
    metadata: null,
    typeCondition: fragmentType,
    selections: [buildSelectionFromFieldDefinition(idField)]
  };
}

function buildSelectionFromFieldDefinition(field) {
  return {
    kind: 'ScalarField',
    alias: field.name === ID_KEY ? null : ID_KEY,
    args: [],
    directives: [],
    handles: null,
    metadata: null,
    name: field.name,
    type: field.type
  };
}

function getNodeIDFieldDefinition(schema) {
  var iface = schema.getType(NODE_TYPE);
  if (isInterfaceType(iface)) {
    var idType = schema.getType(ID_TYPE);
    var fields = [];
    var allFields = iface.getFields();
    for (var fieldName in allFields) {
      var field = allFields[fieldName];
      if (getNullableType(field.type) === idType) {
        fields.push(field);
      }
    }
    require('fbjs/lib/invariant')(fields.length === 1, 'RelayGenerateIDFieldTransform.getNodeIDFieldDefinition(): Expected ' + 'the Node interface to have one field of type `ID!`, but found %s.', fields.length === 0 ? 'none' : fields.map(function (field) {
      return '`' + field.name + '`';
    }).join(', '));
    return fields[0];
  }
  return null;
}

function getIDFieldDefinition(schema, type) {
  var unmodifiedType = getRawType(type);
  if (unmodifiedType instanceof GraphQLObjectType || unmodifiedType instanceof GraphQLInterfaceType) {
    var idType = schema.getType(ID_TYPE);
    var nodeIDField = getNodeIDFieldDefinition(schema);
    if (nodeIDField) {
      var foundNodeIDField = unmodifiedType.getFields()[nodeIDField.name];
      if (foundNodeIDField && getRawType(foundNodeIDField.type) === idType) {
        return foundNodeIDField;
      }
    }
    var idField = unmodifiedType.getFields()[ID];
    if (idField && getRawType(idField.type) === idType) {
      return idField;
    }
  }
  return null;
}

module.exports = {
  transform: relayGenerateIDFieldTransform,
  // Only exported for testing purposes.
  buildSelectionFromFieldDefinition: buildSelectionFromFieldDefinition,
  getIDFieldDefinition: getIDFieldDefinition,
  getNodeIDFieldDefinition: getNodeIDFieldDefinition
};