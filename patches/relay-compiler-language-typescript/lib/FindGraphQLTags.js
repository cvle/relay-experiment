"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var util = require("util");
function isCreateContainerFunction(fnName) {
    return (fnName === "createFragmentContainer" ||
        fnName === "createRefetchContainer" ||
        fnName === "createPaginationContainer");
}
function isCreateContainerCall(callExpr) {
    var callee = callExpr.expression;
    return ((ts.isIdentifier(callee) && isCreateContainerFunction(callee.text)) ||
        (ts.isPropertyAccessExpression(callee) &&
            ts.isIdentifier(callee.expression) &&
            callee.expression.text === "Relay" &&
            isCreateContainerFunction(callee.name.text)));
}
function createContainerName(callExpr) {
    if (ts.isIdentifier(callExpr.expression) &&
        isCreateContainerFunction(callExpr.expression.text)) {
        return callExpr.expression.text;
    }
    if (ts.isPropertyAccessExpression(callExpr.expression) &&
        ts.isIdentifier(callExpr.expression.expression) &&
        callExpr.expression.expression.text === "Relay") {
        if (isCreateContainerFunction(callExpr.expression.name.text)) {
            return callExpr.expression.name.text;
        }
    }
    throw new Error("Not a relay create container call");
}
function visit(node, addGraphQLTag) {
    function visitNode(node) {
        switch (node.kind) {
            case ts.SyntaxKind.CallExpression: {
                var callExpr_1 = node;
                if (isCreateContainerCall(callExpr_1)) {
                    var fragmentSpec = callExpr_1.arguments[1];
                    if (fragmentSpec == null) {
                        break;
                    }
                    if (ts.isObjectLiteralExpression(fragmentSpec)) {
                        fragmentSpec.properties.forEach(function (prop) {
                            invariant(ts.isPropertyAssignment(prop) &&
                                prop.questionToken == null &&
                                ts.isIdentifier(prop.name) &&
                                ts.isTaggedTemplateExpression(prop.initializer), "FindGraphQLTags: `%s` expects fragment definitions to be " +
                                "`key: graphql`.", createContainerName(callExpr_1));
                            // We tested for this
                            var propAssignment = prop;
                            var taggedTemplate = propAssignment.initializer;
                            invariant(isGraphQLTag(taggedTemplate.tag), "FindGraphQLTags: `%s` expects fragment definitions to be tagged " +
                                "with `graphql`, got `%s`.", createContainerName(callExpr_1), taggedTemplate.tag.getText());
                            addGraphQLTag({
                                keyName: propAssignment.name.text,
                                template: getGraphQLText(taggedTemplate),
                                sourceLocationOffset: getSourceLocationOffset(taggedTemplate)
                            });
                        });
                    }
                    else {
                        invariant(ts.isTaggedTemplateExpression(fragmentSpec), "FindGraphQLTags: `%s` expects a second argument of fragment " +
                            "definitions.", createContainerName(callExpr_1));
                        var taggedTemplate = fragmentSpec;
                        invariant(isGraphQLTag(taggedTemplate.tag), "FindGraphQLTags: `%s` expects fragment definitions to be tagged " +
                            "with `graphql`, got `%s`.", createContainerName(callExpr_1), taggedTemplate.tag.getText());
                        addGraphQLTag({
                            keyName: null,
                            template: getGraphQLText(taggedTemplate),
                            sourceLocationOffset: getSourceLocationOffset(taggedTemplate)
                        });
                    }
                    // Visit remaining arguments
                    for (var i = 2; i < callExpr_1.arguments.length; i++) {
                        visit(callExpr_1.arguments[i], addGraphQLTag);
                    }
                    return;
                }
                break;
            }
            case ts.SyntaxKind.TaggedTemplateExpression: {
                var taggedTemplate = node;
                if (isGraphQLTag(taggedTemplate.tag)) {
                    // TODO: This code previously had no validation and thus no
                    //       keyName/sourceLocationOffset. Are these right?
                    addGraphQLTag({
                        keyName: null,
                        template: getGraphQLText(taggedTemplate),
                        sourceLocationOffset: getSourceLocationOffset(taggedTemplate)
                    });
                }
            }
        }
        ts.forEachChild(node, visitNode);
    }
    visitNode(node);
}
function isGraphQLTag(tag) {
    return (tag.kind === ts.SyntaxKind.Identifier &&
        tag.text === "graphql");
}
function getTemplateNode(quasi) {
    invariant(quasi.template.kind === ts.SyntaxKind.NoSubstitutionTemplateLiteral, "FindGraphQLTags: Substitutions are not allowed in graphql tags.");
    return quasi.template;
}
function getGraphQLText(quasi) {
    return getTemplateNode(quasi).text;
}
function getSourceLocationOffset(quasi) {
    var pos = getTemplateNode(quasi).pos;
    var loc = quasi.getSourceFile().getLineAndCharacterOfPosition(pos);
    return {
        line: loc.line,
        column: loc.character + 1
    };
}
function invariant(condition, msg) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    if (!condition) {
        throw new Error(util.format.apply(util, [msg].concat(args)));
    }
}
exports.find = function (text, filePath) {
    var result = [];
    var ast = ts.createSourceFile(filePath, text, ts.ScriptTarget.Latest, true);
    visit(ast, function (tag) { return result.push(tag); });
    return result;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRmluZEdyYXBoUUxUYWdzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0ZpbmRHcmFwaFFMVGFncy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtCQUFpQztBQUVqQywyQkFBNkI7QUFXN0IsbUNBQ0UsTUFBYztJQUtkLE1BQU0sQ0FBQyxDQUNMLE1BQU0sS0FBSyx5QkFBeUI7UUFDcEMsTUFBTSxLQUFLLHdCQUF3QjtRQUNuQyxNQUFNLEtBQUssMkJBQTJCLENBQ3ZDLENBQUM7QUFDSixDQUFDO0FBRUQsK0JBQStCLFFBQTJCO0lBQ3hELElBQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUM7SUFDbkMsTUFBTSxDQUFDLENBQ0wsQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxJQUFJLHlCQUF5QixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNuRSxDQUFDLEVBQUUsQ0FBQywwQkFBMEIsQ0FBQyxNQUFNLENBQUM7WUFDcEMsRUFBRSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDO1lBQ2xDLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxLQUFLLE9BQU87WUFDbEMseUJBQXlCLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUMvQyxDQUFDO0FBQ0osQ0FBQztBQUVELDZCQUNFLFFBQTJCO0lBSzNCLEVBQUUsQ0FBQyxDQUNELEVBQUUsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQztRQUNwQyx5QkFBeUIsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksQ0FDcEQsQ0FBQyxDQUFDLENBQUM7UUFDRCxNQUFNLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7SUFDbEMsQ0FBQztJQUNELEVBQUUsQ0FBQyxDQUNELEVBQUUsQ0FBQywwQkFBMEIsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDO1FBQ2xELEVBQUUs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