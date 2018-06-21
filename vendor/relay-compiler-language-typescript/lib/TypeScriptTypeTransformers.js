"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var graphql_1 = require("graphql");
function transformScalarType(type, state, objectProps) {
    if (type instanceof graphql_1.GraphQLNonNull) {
        return transformNonNullableScalarType(type.ofType, state, objectProps);
    }
    else {
        return ts.createUnionTypeNode([
            transformNonNullableScalarType(type, state, objectProps),
            ts.createKeywordTypeNode(ts.SyntaxKind.NullKeyword)
        ]);
    }
}
exports.transformScalarType = transformScalarType;
function transformNonNullableScalarType(type, state, objectProps) {
    if (type instanceof graphql_1.GraphQLList) {
        return ts.createTypeReferenceNode(ts.createIdentifier("ReadonlyArray"), [
            transformScalarType(type.ofType, state, objectProps)
        ]);
    }
    else if (type instanceof graphql_1.GraphQLObjectType ||
        type instanceof graphql_1.GraphQLUnionType ||
        type instanceof graphql_1.GraphQLInterfaceType) {
        return objectProps;
    }
    else if (type instanceof graphql_1.GraphQLScalarType) {
        return transformGraphQLScalarType(type, state);
    }
    else if (type instanceof graphql_1.GraphQLEnumType) {
        return transformGraphQLEnumType(type, state);
    }
    else {
        throw new Error("Could not convert from GraphQL type " + type.toString());
    }
}
function transformGraphQLScalarType(type, state) {
    switch (state.customScalars[type.name] || type.name) {
        case "ID":
        case "String":
        case "Url":
            return ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword);
        case "Float":
        case "Int":
            return ts.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword);
        case "Boolean":
            return ts.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword);
        default:
            return ts.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword);
    }
}
function transformGraphQLEnumType(type, state) {
    state.usedEnums[type.name] = type;
    return ts.createTypeReferenceNode(ts.createIdentifier(type.name), []);
}
function transformInputType(type, state) {
    if (type instanceof graphql_1.GraphQLNonNull) {
        return transformNonNullableInputType(type.ofType, state);
    }
    else {
        return ts.createUnionTypeNode([
            transformNonNullableInputType(type, state),
            ts.createKeywordTypeNode(ts.SyntaxKind.NullKeyword)
        ]);
    }
}
exports.transformInputType = transformInputType;
function transformNonNullableInputType(type, state) {
    if (type instanceof graphql_1.GraphQLList) {
        return ts.createTypeReferenceNode(ts.createIdentifier("ReadonlyArray"), [
            transformInputType(type.ofType, state)
        ]);
    }
    else if (type instanceof graphql_1.GraphQLScalarType) {
        return transformGraphQLScalarType(type, state);
    }
    else if (type instanceof graphql_1.GraphQLEnumType) {
        return transformGraphQLEnumType(type, state);
    }
    else if (type instanceof graphql_1.GraphQLInputObjectType) {
        var fields_1 = type.getFields();
        var props = Object.keys(fields_1)
            .map(function (key) { return fields_1[key]; })
            .filter(function (field) { return state.inputFieldWhiteList.indexOf(field.name) < 0; })
            .map(function (field) {
            var property = ts.createPropertySignature([ts.createToken(ts.SyntaxKind.ReadonlyKeyword)], ts.createIdentifier(field.name), field.type instanceof graphql_1.GraphQLNonNull
                ? ts.createToken(ts.SyntaxKind.QuestionToken)
                : undefined, transformInputType(field.type, state), undefined);
            return property;
        });
        return ts.createTypeLiteralNode(props);
    }
    else {
        throw new Error("Could not convert from GraphQL type " + type.toString());
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHlwZVNjcmlwdFR5cGVUcmFuc2Zvcm1lcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvVHlwZVNjcmlwdFR5cGVUcmFuc2Zvcm1lcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQkFBaUM7QUFFakMsbUNBV2lCO0FBYWpCLDZCQUNFLElBQWlCLEVBQ2pCLEtBQVksRUFDWixXQUF5QjtJQUV6QixFQUFFLENBQUMsQ0FBQyxJQUFJLFlBQVksd0JBQWMsQ0FBQyxDQUFDLENBQUM7UUFDbkMsTUFBTSxDQUFDLDhCQUE4QixDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQ3pFLENBQUM7SUFBQyxJQUFJLENBQUMsQ0FBQztRQUNOLE1BQU0sQ0FBQyxFQUFFLENBQUMsbUJBQW1CLENBQUM7WUFDNUIsOEJBQThCLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxXQUFXLENBQUM7WUFDeEQsRUFBRSxDQUFDLHFCQUFxQixDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDO1NBQ3BELENBQUMsQ0FBQztJQUNMLENBQUM7QUFDSCxDQUFDO0FBYkQsa0RBYUM7QUFFRCx3Q0FDRSxJQUFpQixFQUNqQixLQUFZLEVBQ1osV0FBeUI7SUFFekIsRUFBRSxDQUFDLENBQUMsSUFBSSxZQUFZLHFCQUFXLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxFQUFFLENBQUMsdUJBQXVCLENBQUMsRUFBRSxDQUFDLGdCQUFnQixDQUFDLGVBQWUsQ0FBQyxFQUFFO1lBQ3RFLG1CQUFtQixDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLFdBQVcsQ0FBQztTQUNyRCxDQUFDLENBQUM7SUFDTCxDQUFDO0lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUNSLElBQUksWUFBWSwyQkFBaUI7UUFDakMsSUFBSSxZQUFZLDBCQUFnQjtRQUNoQyxJQUFJLFlBQVksOEJBQ2xCLENB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