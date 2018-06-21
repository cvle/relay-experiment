"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var relay_compiler_1 = require("relay-compiler");
var ts = require("typescript");
var TypeScriptTypeTransformers_1 = require("./TypeScriptTypeTransformers");
var graphql_1 = require("graphql");
var GraphQLCompilerPublic_1 = require("relay-compiler/lib/GraphQLCompilerPublic");
var isAbstractType = GraphQLCompilerPublic_1.SchemaUtils.isAbstractType;
exports.generate = function (node, options) {
    var ast = GraphQLCompilerPublic_1.IRVisitor.visit(node, createVisitor(options));
    var printer = ts.createPrinter({
        newLine: ts.NewLineKind.LineFeed
    });
    var resultFile = ts.createSourceFile("grapghql-def.ts", "", ts.ScriptTarget.Latest, 
    /*setParentNodes*/ false, ts.ScriptKind.TS);
    var fullProgramAst = ts.updateSourceFileNode(resultFile, ast);
    return printer.printNode(ts.EmitHint.SourceFile, fullProgramAst, resultFile);
};
function nullthrows(obj) {
    if (obj == null) {
        throw new Error("Obj is null");
    }
    return obj;
}
function makeProp(selection, state, concreteType) {
    var key = selection.key, schemaName = selection.schemaName, value = selection.value, conditional = selection.conditional, nodeType = selection.nodeType, nodeSelections = selection.nodeSelections;
    if (nodeType) {
        value = TypeScriptTypeTransformers_1.transformScalarType(nodeType, state, selectionsToAST([Array.from(nullthrows(nodeSelections).values())], state));
    }
    if (schemaName === "__typename" && concreteType) {
        value = ts.createLiteralTypeNode(ts.createLiteral(concreteType));
    }
    return readOnlyObjectTypeProperty(key, value, conditional);
}
var isTypenameSelection = function (selection) {
    return selection.schemaName === "__typename";
};
var hasTypenameSelection = function (selections) {
    return selections.some(isTypenameSelection);
};
var onlySelectsTypename = function (selections) {
    return selections.every(isTypenameSelection);
};
function selectionsToAST(selections, state, refTypeName) {
    var baseFields = new Map();
    var byConcreteType = {};
    flattenArray(selections).forEach(function (selection) {
        var concreteType = selection.concreteType;
        if (concreteType) {
            byConcreteType[concreteType] = byConcreteType[concreteType] || [];
            byConcreteType[concreteType].push(selection);
        }
        else {
            var previousSel = baseFields.get(selection.key);
            baseFields.set(selection.key, previousSel ? mergeSelection(selection, previousSel) : selection);
        }
    });
    var types = [];
    if (Object.keys(byConcreteType).length &&
        onlySelectsTypename(Array.from(baseFields.values())) &&
        (hasTypenameSelection(Array.from(baseFields.values())) ||
            Object.keys(byConcreteType).every(function (type) {
                return hasTypenameSelection(byConcreteType[type]);
            }))) {
        var _loop_1 = function (concreteType) {
            types.push(groupRefs(Array.from(baseFields.values()).concat(byConcreteType[concreteType])).map(function (selection) { return makeProp(selection, state, concreteType); }));
        };
        for (var concreteType in byConcreteType) {
            _loop_1(concreteType);
        }
        // It might be some other type than the listed concrete types. Ideally, we
        // would set the type to diff(string, set of listed concrete types), but
        // this doesn't exist in Flow at the time.
        var otherProp = readOnlyObjectTypeProperty("__typename", ts.createLiteralTypeNode(ts.createLiteral("%other")));
        var otherPropWithComment = ts.addSyntheticLeadingComment(otherProp, ts.SyntaxKind.MultiLineCommentTrivia, "This will never be '% other', but we need some\n" +
            "value in case none of the concrete values match.", true);
        types.push([otherPropWithComment]);
    }
    else {
        var selectionMap = selectionsToMap(Array.from(baseFields.values()));
        for (var concreteType in byConcreteType) {
            selectionMap = mergeSelections(selectionMap, selectionsToMap(byConcreteType[concreteType].map(function (sel) { return (__assign({}, sel, { conditional: true })); })));
        }
        var selectionMapValues = groupRefs(Array.from(selectionMap.values())).map(function (sel) {
            return isTypenameSelection(sel) && sel.concreteType
                ? makeProp(__assign({}, sel, { conditional: false }), state, sel.concreteType)
                : makeProp(sel, state);
        });
        types.push(selectionMapValues);
    }
    return ts.createUnionTypeNode(types.map(function (props) {
        if (refTypeName) {
            props.push(readOnlyObjectTypeProperty(" $refType", ts.createTypeReferenceNode(ts.createIdentifier(refTypeName), undefined)));
        }
        return exactObjectTypeAnnotation(props);
    }));
}
// We don't have exact object types in typescript.
function exactObjectTypeAnnotation(properties) {
    return ts.createTypeLiteralNode(properties);
}
var idRegex = /^[$a-zA-Z_][$a-z0-9A-Z_]*$/;
function readOnlyObjectTypeProperty(propertyName, type, optional) {
    return ts.createPropertySignature([ts.createToken(ts.SyntaxKind.ReadonlyKeyword)], idRegex.test(propertyName)
        ? ts.createIdentifier(propertyName)
        : ts.createLiteral(propertyName), optional ? ts.createToken(ts.SyntaxKind.QuestionToken) : undefined, type, undefined);
}
function mergeSelection(a, b) {
    if (!a) {
        return __assign({}, b, { conditional: true });
    }
    return __assign({}, a, { nodeSelections: a.nodeSelections
            ? mergeSelections(a.nodeSelections, nullthrows(b.nodeSelections))
            : null, conditional: a.conditional && b.conditional });
}
function mergeSelections(a, b) {
    var merged = new Map();
    for (var _i = 0, _a = Array.from(a.entries()); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        merged.set(key, value);
    }
    for (var _c = 0, _d = Array.from(b.entries()); _c < _d.length; _c++) {
        var _e = _d[_c], key = _e[0], value = _e[1];
        merged.set(key, mergeSelection(a.get(key), value));
    }
    return merged;
}
function isPlural(node) {
    return Boolean(node.metadata && node.metadata.plural);
}
function exportType(name, type) {
    return ts.createTypeAliasDeclaration(undefined, [ts.createToken(ts.SyntaxKind.ExportKeyword)], ts.createIdentifier(name), undefined, type);
}
function importTypes(names, fromModule) {
    return ts.createImportDeclaration(undefined, undefined, ts.createImportClause(undefined, ts.createNamedImports(names.map(function (name) {
        return ts.createImportSpecifier(undefined, ts.createIdentifier(name));
    }))), ts.createLiteral(fromModule));
}
function createVisitor(options) {
    var state = {
        customScalars: options.customScalars,
        enumsHasteModule: options.enumsHasteModule,
        existingFragmentNames: options.existingFragmentNames,
        inputFieldWhiteList: options.inputFieldWhiteList,
        relayRuntimeModule: options.relayRuntimeModule,
        usedEnums: {},
        usedFragments: new Set(),
        useHaste: options.useHaste,
        useSingleArtifactDirectory: options.useSingleArtifactDirectory
    };
    return {
        leave: {
            Root: function (node) {
                var inputVariablesType = generateInputVariablesType(node, state);
                var responseType = exportType(node.name + "Response", selectionsToAST(node.selections, state));
                return getEnumDefinitions(state).concat([
                    inputVariablesType,
                    responseType
                ]);
            },
            Fragment: function (node) {
                var flattenedSelections = flattenArray(node.selections);
                var numConecreteSelections = flattenedSelections.filter(function (s) { return s.concreteType; }).length;
                var selections = flattenedSelections.map(function (selection) {
                    if (numConecreteSelections <= 1 &&
                        isTypenameSelection(selection) &&
                        !isAbstractType(node.type)) {
                        return [
                            __assign({}, selection, { concreteType: node.type.toString() })
                        ];
                    }
                    return [selection];
                });
                // TODO: This is disabled until TS 2.8 is released which has the features we need to properly support fragment
                //       reference checking. See https://github.com/alloy/DefinitelyTyped/pull/1
                //
                // const refTypeName = getRefTypeName(node.name);
                // const _refType = ts.createEnumDeclaration(
                //   undefined,
                //   [ts.createToken(ts.SyntaxKind.ConstKeyword)],
                //   ts.createIdentifier(`_${refTypeName}`),
                //   []
                // );
                // const refType = ts.createTypeAliasDeclaration(
                //   undefined,
                //   [ts.createToken(ts.SyntaxKind.ExportKeyword)],
                //   refTypeName,
                //   undefined,
                //   ts.createIntersectionTypeNode([
                //     ts.createTypeReferenceNode(_refType.name, undefined),
                //     ts.createTypeReferenceNode("FragmentReference", undefined)
                //   ])
                // );
                // const baseType = selectionsToAST(selections, state, refTypeName);
                var baseType = selectionsToAST(selections, state);
                var type = isPlural(node)
                    ? ts.createTypeReferenceNode(ts.createIdentifier("ReadonlyArray"), [
                        baseType
                    ])
                    : baseType;
                return getEnumDefinitions(state).concat([
                    // importTypes(["FragmentReference"], state.relayRuntimeModule),
                    // _refType,
                    // refType,
                    exportType(node.name, type)
                ]);
            },
            InlineFragment: function (node) {
                var typeCondition = node.typeCondition;
                return flattenArray(node.selections).map(function (typeSelection) {
                    return isAbstractType(typeCondition)
                        ? __assign({}, typeSelection, { conditional: true }) : __assign({}, typeSelection, { concreteType: typeCondition.toString() });
                });
            },
            Condition: function (node) {
                return flattenArray(node.selections).map(function (selection) {
                    return __assign({}, selection, { conditional: true });
                });
            },
            ScalarField: function (node) {
                return [
                    {
                        key: node.alias || node.name,
                        schemaName: node.name,
                        value: TypeScriptTypeTransformers_1.transformScalarType(node.type, state)
                    }
                ];
            },
            LinkedField: function (node) {
                return [
                    {
                        key: node.alias || node.name,
                        schemaName: node.name,
                        nodeType: node.type,
                        nodeSelections: selectionsToMap(flattenArray(node.selections))
                    }
                ];
            },
            FragmentSpread: function (node) {
                state.usedFragments.add(node.name);
                return [
                    {
                        key: "__fragments_" + node.name,
                        ref: node.name
                    }
                ];
            }
        }
    };
}
function selectionsToMap(selections) {
    var map = new Map();
    selections.forEach(function (selection) {
        var previousSel = map.get(selection.key);
        map.set(selection.key, previousSel ? mergeSelection(previousSel, selection) : selection);
    });
    return map;
}
function flattenArray(arrayOfArrays) {
    var result = [];
    arrayOfArrays.forEach(function (array) { return result.push.apply(result, array); });
    return result;
}
function generateInputVariablesType(node, state) {
    return exportType(node.name + "Variables", exactObjectTypeAnnotation(node.argumentDefinitions.map(function (arg) {
        return readOnlyObjectTypeProperty(arg.name, TypeScriptTypeTransformers_1.transformInputType(arg.type, state), !(arg.type instanceof graphql_1.GraphQLNonNull));
    })));
}
function groupRefs(props) {
    var result = [];
    var refs = [];
    props.forEach(function (prop) {
        if (prop.ref) {
            refs.push(prop.ref);
        }
        else {
            result.push(prop);
        }
    });
    if (refs.length > 0) {
        var value = ts.createIntersectionTypeNode(refs.map(function (ref) {
            return ts.createTypeReferenceNode(ts.createIdentifier(getRefTypeName(ref)), undefined);
        }));
        // TODO: This is disabled until TS 2.8 is released which has the features we need to properly support fragment
        //       reference checking. See https://github.com/alloy/DefinitelyTyped/pull/1
        //
        // result.push({
        //   key: " $fragmentRefs",
        //   conditional: false,
        //   value
        // });
    }
    return result;
}
function createAnyTypeAlias(name) {
    return ts.createTypeAliasDeclaration(undefined, undefined, ts.createIdentifier(name), undefined, ts.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword));
}
function getFragmentImports(state) {
    var imports = [];
    if (state.usedFragments.size > 0) {
        var usedFragments = Array.from(state.usedFragments).sort();
        for (var _i = 0, usedFragments_1 = usedFragments; _i < usedFragments_1.length; _i++) {
            var usedFragment = usedFragments_1[_i];
            var refTypeName = getRefTypeName(usedFragment);
            if (state.useSingleArtifactDirectory &&
                state.existingFragmentNames.has(usedFragment)) {
                imports.push(importTypes([refTypeName], "./" + usedFragment + ".graphql"));
            }
            else {
                imports.push(createAnyTypeAlias(refTypeName));
            }
        }
    }
    return imports;
}
function anyTypeAlias(typeName) {
    return ts.createTypeAliasDeclaration(undefined, undefined, ts.createIdentifier(typeName), undefined, ts.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword));
}
function getEnumDefinitions(_a) {
    var enumsHasteModule = _a.enumsHasteModule, usedEnums = _a.usedEnums;
    var enumNames = Object.keys(usedEnums).sort();
    if (enumNames.length === 0) {
        return [];
    }
    if (enumsHasteModule) {
        return [importTypes(enumNames, enumsHasteModule)];
    }
    return enumNames.map(function (name) {
        var values = usedEnums[name].getValues().map(function (_a) {
            var value = _a.value;
            return value;
        });
        values.sort();
        values.push("%future added value");
        return exportType(name, ts.createUnionTypeNode(values.map(function (value) { return stringLiteralTypeAnnotation(value); })));
    });
}
function stringLiteralTypeAnnotation(name) {
    return ts.createLiteralTypeNode(ts.createLiteral(name));
}
function getRefTypeName(name) {
    return name + "$ref";
}
exports.transforms = [
    relay_compiler_1.IRTransforms.commonTransforms[2],
    relay_compiler_1.IRTransforms.commonTransforms[3],
    relay_compiler_1.IRTransforms.printTransforms[0] // FlattenTransform.transformWithOptions({})
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHlwZVNjcmlwdEdlbmVyYXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9UeXBlU2NyaXB0R2VuZXJhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxpREFBNkQ7QUFFN0QsK0JBQWlDO0FBR2pDLDJFQUtzQztBQUN0QyxtQ0FNaUI7QUFDakIsa0ZBTWtEO0FBSTFDLElBQUEsbUVBQWMsQ0FBaUI7QUFFMUIsUUFBQSxRQUFRLEdBQThCLFVBQUMsSUFBSSxFQUFFLE9BQU87SUFDL0QsSUFBTSxHQUFHLEdBQW1CLGlDQUFTLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUMxRSxJQUFNLE9BQU8sR0FBRyxFQUFFLENBQUMsYUFBYSxDQUFDO1FBQy9CLE9BQU8sRUFBRSxFQUFFLENBQUMsV0FBVyxDQUFDLFFBQVE7S0FDakMsQ0FBQyxDQUFDO0lBQ0gsSUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFDLGdCQUFnQixDQUNwQyxpQkFBaUIsRUFDakIsRUFBRSxFQUNGLEVBQUUsQ0FBQyxZQUFZLENBQUMsTUFBTTtJQUN0QixrQkFBa0IsQ0FBQyxLQUFLLEVBQ3hCLEVBQUUsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUNqQixDQUFDO0lBQ0YsSUFBTSxjQUFjLEdBQUcsRUFBRSxDQUFDLG9CQUFvQixDQUFDLFVBQVUsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUNoRSxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxjQUFjLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDL0UsQ0FBQyxDQUFDO0FBY0Ysb0JBQXVCLEdBQXlCO0lBQzlDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2hCLE1BQU0sSUFBSSxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDakMsQ0FBQztJ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