/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule GraphQLSchemaUtils
 * 
 * @format
 */

'use strict';

var _require = require('graphql'),
    assertAbstractType = _require.assertAbstractType,
    getNamedType = _require.getNamedType,
    getNullableType = _require.getNullableType,
    isType = _require.isType,
    print = _require.print,
    typeFromAST = _require.typeFromAST,
    GraphQLInterfaceType = _require.GraphQLInterfaceType,
    GraphQLList = _require.GraphQLList,
    GraphQLObjectType = _require.GraphQLObjectType,
    GraphQLSchema = _require.GraphQLSchema,
    GraphQLUnionType = _require.GraphQLUnionType;

/**
 * Determine if the given type may implement the named type:
 * - it is the named type
 * - it implements the named interface
 * - it is an abstract type and *some* of its concrete types may
 *   implement the named type
 */
function mayImplement(schema, type, typeName) {
  var unmodifiedType = getRawType(type);
  return unmodifiedType.toString() === typeName || implementsInterface(unmodifiedType, typeName) || isAbstractType(unmodifiedType) && hasConcreteTypeThatImplements(schema, unmodifiedType, typeName);
}

function canHaveSelections(type) {
  return type instanceof GraphQLObjectType || type instanceof GraphQLInterfaceType;
}

/**
 * Determine if a type is abstract (not concrete).
 *
 * Note: This is used in place of the `graphql` version of the function in order
 * to not break `instanceof` checks with Jest. This version also unwraps
 * non-null/list wrapper types.
 */
function isAbstractType(type) {
  var rawType = getRawType(type);
  return rawType instanceof GraphQLInterfaceType || rawType instanceof GraphQLUnionType;
}

function isUnionType(type) {
  return type instanceof GraphQLUnionType;
}

/**
 * Get the unmodified type, with list/null wrappers removed.
 */
function getRawType(type) {
  return require('./nullthrowsOSS')(getNamedType(type));
}

/**
 * Gets the non-list type, removing the list wrapper if present.
 */
function getSingularType(type) {
  var unmodifiedType = type;
  while (unmodifiedType instanceof GraphQLList) {
    unmodifiedType = unmodifiedType.ofType;
  }
  return unmodifiedType;
}

/**
 * @public
 */
function implementsInterface(type, interfaceName) {
  return getInterfaces(type).some(function (interfaceType) {
    return interfaceType.toString() === interfaceName;
  });
}

/**
 * @private
 */
function hasConcreteTypeThatImplements(schema, type, interfaceName) {
  return isAbstractType(type) && getConcreteTypes(schema, type).some(function (concreteType) {
    return implementsInterface(concreteType, interfaceName);
  });
}

/**
 * @private
 */
function getConcreteTypes(schema, type) {
  return schema.getPossibleTypes(assertAbstractType(type));
}

/**
 * @private
 */
function getInterfaces(type) {
  if (type instanceof GraphQLObjectType) {
    return type.getInterfaces();
  }
  return [];
}

/**
 * @public
 *
 * Determine if an AST node contains a fragment/operation definition.
 */
function isExecutableDefinitionAST(ast) {
  return ast.kind === 'FragmentDefinition' || ast.kind === 'OperationDefinition';
}

/**
 * @public
 *
 * Determine if an AST node contains a schema definition.
 */
function isSchemaDefinitionAST(ast) {
  return ast.kind === 'SchemaDefinition' || ast.kind === 'ScalarTypeDefinition' || ast.kind === 'ObjectTypeDefinition' || ast.kind === 'InterfaceTypeDefinition' || ast.kind === 'UnionTypeDefinition' || ast.kind === 'EnumTypeDefinition' || ast.kind === 'InputObjectTypeDefinition' || ast.kind === 'DirectiveDefinition' || ast.kind === 'ScalarTypeExtension' || ast.kind === 'ObjectTypeExtension' || ast.kind === 'InterfaceTypeExtension' || ast.kind === 'UnionTypeExtension' || ast.kind === 'EnumTypeExtension' || ast.kind === 'InputObjectTypeExtension';
}

function assertTypeWithFields(type) {
  require('fbjs/lib/invariant')(type instanceof GraphQLObjectType || type instanceof GraphQLInterfaceType, 'GraphQLSchemaUtils: Expected type `%s` to be an object or interface type.', type);
  return type;
}

/**
 * Helper for calling `typeFromAST()` with a clear warning when the type does
 * not exist. This enables the pattern `assertXXXType(getTypeFromAST(...))`,
 * emitting distinct errors for unknown types vs types of the wrong category.
 */
function getTypeFromAST(schema, ast) {
  var type = typeFromAST(schema, ast);
  require('fbjs/lib/invariant')(isType(type), 'GraphQLSchemaUtils: Unknown type `%s`.', print(ast));
  return type;
}

module.exports = {
  assertTypeWithFields: assertTypeWithFields,
  canHaveSelections: canHaveSelections,
  getNullableType: getNullableType,
  getRawType: getRawType,
  getSingularType: getSingularType,
  getTypeFromAST: getTypeFromAST,
  implementsInterface: implementsInterface,
  isAbstractType: isAbstractType,
  isUnionType: isUnionType,
  isExecutableDefinitionAST: isExecutableDefinitionAST,
  isSchemaDefinitionAST: isSchemaDefinitionAST,
  mayImplement: mayImplement
};